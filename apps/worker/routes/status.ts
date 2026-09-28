import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { createDb } from "../db/index.js";
import type { Bindings } from "../lib/env.js";

let startedAt: number | undefined;

export const statusRoutes = new Hono<{ Bindings: Bindings }>().get("/status", async (c) => {
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
});
