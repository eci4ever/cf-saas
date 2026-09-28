import { Hono } from "hono";

export const mgmtRoutes = new Hono().get("/ping", (c) => c.json({ ok: true }));
