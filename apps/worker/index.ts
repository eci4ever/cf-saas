import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { createDb } from "./db/index.js";
import { createAuth } from "./lib/auth.js";
import type { Bindings } from "./lib/env.js";
import { tasksRoutes } from "./routes/tasks.js";

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
  .get("/hello/:name", (c) => c.json({ message: `Hello, ${c.req.param("name")}!` }));

api.route("/", tasksRoutes);

app.route("/api", api);
app.on(["POST", "GET"], "/api/auth/*", (c) => createAuth(c.env).handler(c.req.raw));
app.all("/api/*", (c) => c.json({ error: "Not found" }, 404));
app.get("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
