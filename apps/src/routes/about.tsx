import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => (
    <section>
      <h1>About</h1>
      <p>
        Hono API and React client served by one Cloudflare Worker. This page is served as a static
        asset with SPA fallback — refresh works.
      </p>
    </section>
  ),
});
