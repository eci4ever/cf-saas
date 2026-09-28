import type { AuthEnv } from "./auth.js";

export type Bindings = AuthEnv & {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
};
