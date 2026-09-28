import { Hono } from "hono";
import { createDb } from "../db/index.js";
import { tasks } from "../db/schema.js";
import type { Bindings } from "../lib/env.js";

export const tasksRoutes = new Hono<{ Bindings: Bindings }>()
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
