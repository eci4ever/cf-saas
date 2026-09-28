import { createFileRoute } from "@tanstack/react-router";
import { BrandMark } from "@/components/landing/brand-mark";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  component: () => (
    <div className="min-h-svh">
      <header className="border-border/70 border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
          <BrandMark />
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl px-6 py-8">
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
            <CardContent className="text-muted-foreground text-sm">
              UI by shadcn/ui on Base UI primitives, styled with Tailwind v4.
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  ),
});
