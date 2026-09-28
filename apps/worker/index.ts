import { Hono } from "hono";
import { createDb } from "./db.js";
import { tasks } from "./schema.js";

type Bindings = {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const api = new Hono<{ Bindings: Bindings }>()
  .get("/health", (c) => c.json({ ok: true, timestamp: Date.now() }))
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
app.all("/api/*", (c) => c.json({ error: "Not found" }, 404));
app.get("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
