import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-svh">
      <nav className="flex items-center gap-5 border-b px-6 py-3">
        <Link
          to="/"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          activeProps={{ className: "text-foreground" }}
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          activeProps={{ className: "text-foreground" }}
        >
          About
        </Link>
      </nav>
      <main className="mx-auto w-full max-w-2xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  ),
});
