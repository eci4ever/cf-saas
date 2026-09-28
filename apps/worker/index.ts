import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { createAuth, type AuthEnv } from "./auth.js";
import { createDb } from "./db.js";
import { tasks } from "./schema.js";

type Bindings = AuthEnv & {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
};

let startedAt: number | undefined;

const app = new Hono<{ Bindings: Bindings }>();

const api = new Hono<{ Bindings: Bindings }>()
  .get("/health", (c) => c.json({ ok: true, timestamp: Date.now() }))
  .get("/status", async (c) => {
    startedAt ??= Date.now();
    const uptime = `${Math.floor((Date.now() - startedAt) / 1000)}s`;
    const requestStartedAt = performance.now();
    let dbStatus: "up" | "down" = "down";
    let dbLatencyMs: number | undefined;
    try {
      const db = createDb(c.env.DATABASE_URL);
      await db.execute(sql`select 1`);
      dbLatencyMs = Math.round(performance.now() - requestStartedAt);
      dbStatus = "up";
    } catch {
      // keep dbStatus = "down"; the API itself is still serving
    }
    return c.json({
      status: "ok",
      uptime,
      db: { status: dbStatus, latency_ms: dbLatencyMs },
    });
  })
  .get("/hello/:name", (c) => c.json({ message: `Hello, ${c.req.param("name")}!` }))
  .get("/tasks", async (c) => {
    const db = createDb(c.env.DATABASE_URL);
    const rows = await db.select().from(tasks).orderBy(tasks.id);
    return c.json(rows);
  })
  .post("/tasks", async (c) => {
    const body = await c.req.json<{ title?: string }>().catch(() => null);
    const title = body?.title?.trim();
    if (!title) return c.json({ error: "title is required" }, 400);
    const db = createDb(c.env.DATABASE_URL);
    const [row] = await db.insert(tasks).values({ title }).returning();
    return c.json(row, 201);
  });

app.route("/api", api);
app.on(["POST", "GET"], "/api/auth/*", (c) => createAuth(c.env).handler(c.req.raw));
app.all("/api/*", (c) => c.json({ error: "Not found" }, 404));
app.get("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
