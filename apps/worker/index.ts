import { Hono } from "hono";

const app = new Hono().basePath("/api");

app.get("/health", (c) => c.json({ ok: true, timestamp: Date.now() }));

app.get("/hello/:name", (c) => c.json({ message: `Hello, ${c.req.param("name")}!` }));

export default app;
