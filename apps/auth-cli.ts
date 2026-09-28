import { createAuth } from "./worker/lib/auth.js";

declare const process: { env: Record<string, string | undefined> };

export const auth = createAuth({
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "dev-secret-not-for-production",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:5173",
});
