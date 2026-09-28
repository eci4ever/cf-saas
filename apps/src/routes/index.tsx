import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";

import { BrandMark } from "@/components/landing/brand-mark";
import { StatusPills } from "@/components/landing/status-pills";
import { Button } from "@/components/ui/button";
import { STACK } from "@/lib/brand";

function Landing() {
  return (
    <div className="bg-background text-foreground relative isolate flex min-h-svh flex-col overflow-hidden">
      <div className="from-foreground/[0.05] dark:from-foreground/[0.08] pointer-events-none absolute inset-x-0 top-0 -z-20 h-[560px] bg-linear-to-b to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="bg-foreground/10 dark:bg-foreground/15 absolute top-[-240px] left-1/2 size-[720px] -translate-x-1/2 rounded-full blur-[140px]" />
        <div className="bg-foreground/[0.07] dark:bg-foreground/[0.09] absolute top-[-160px] left-[16%] size-[420px] rounded-full blur-[120px]" />
        <div className="bg-foreground/[0.05] dark:bg-foreground/[0.07] absolute top-[-120px] right-[14%] size-[380px] rounded-full blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_85%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_85%,transparent)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <BrandMark />
        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/login"
            className="text-muted-foreground hover:text-foreground hidden text-sm font-medium transition-colors sm:block"
          >
            Sign in
          </Link>
          <Button
            nativeButton={false}
            render={<Link to="/signup" />}
            className="h-9 rounded-full px-4"
          >
            Get started
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 text-center">
          <span className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both border-border bg-muted/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium duration-700">
            <SparklesIcon className="size-3.5" />
            Built with Cloudflare Workers, Hono &amp; Neon
          </span>

          <h1 className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both font-heading max-w-3xl text-4xl font-semibold tracking-tighter text-balance delay-100 duration-700 sm:text-6xl">
            <span className="bg-linear-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
              Ship your SaaS faster with a Cloudflare starter
            </span>
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-2 text-muted-foreground fill-mode-both max-w-xl text-lg leading-8 text-balance delay-200 duration-700">
            Hono API, React SPA, and Neon Postgres with typed queries and live status — one Worker,
            one origin. Clone it, brand it, ship it.
          </p>

          <div className="animate-in fade-in fill-mode-both flex w-full items-center justify-center delay-300 duration-700 sm:w-auto">
            <Button
              nativeButton={false}
              render={<Link to="/signup" />}
              className="h-12 w-full rounded-full px-6 text-base sm:w-auto"
            >
              Get started
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>

          <div className="animate-in fade-in fill-mode-both flex flex-col items-center gap-3 delay-[450ms] duration-700">
            <StatusPills />
            <p className="text-muted-foreground text-xs">{STACK.join(" · ")}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({ component: Landing });
