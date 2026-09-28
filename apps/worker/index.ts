import { Hono } from "hono";

type Bindings = {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
};

const app = new Hono<{ Bindings: Bindings }>();

const api = new Hono<{ Bindings: Bindings }>()
  .get("/health", (c) => c.json({ ok: true, timestamp: Date.now() }))
  .get("/hello/:name", (c) => c.json({ message: `Hello, ${c.req.param("name")}!` }));

app.route("/api", api);
app.all("/api/*", (c) => c.json({ error: "Not found" }, 404));
app.get("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
