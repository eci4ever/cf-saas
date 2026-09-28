import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  component: () => (
    <section className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">About</h1>
      <Card>
        <CardHeader>
          <CardTitle>Single origin stack</CardTitle>
          <CardDescription>
            One Cloudflare Worker serves the React client as static assets and runs the Hono API
            under /api. This page works on direct refresh thanks to the SPA fallback.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          UI by shadcn/ui on Base UI primitives, styled with Tailwind v4.
        </CardContent>
      </Card>
    </section>
  ),
});
