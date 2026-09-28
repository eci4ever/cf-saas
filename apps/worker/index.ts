import { Hono } from "hono";
import { createAuth } from "./lib/auth.js";
import type { Bindings } from "./lib/env.js";
import { statusRoutes } from "./routes/status.js";
import { tasksRoutes } from "./routes/tasks.js";

const app = new Hono<{ Bindings: Bindings }>();

const api = new Hono<{ Bindings: Bindings }>()
  .get("/health", (c) => c.json({ ok: true, timestamp: Date.now() }))
  .get("/hello/:name", (c) => c.json({ message: `Hello, ${c.req.param("name")}!` }));

api.route("/", statusRoutes);
api.route("/", tasksRoutes);

app.route("/api", api);
app.on(["POST", "GET"], "/api/auth/*", (c) => createAuth(c.env).handler(c.req.raw));
app.all("/api/*", (c) => c.json({ error: "Not found" }, 404));
app.get("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
