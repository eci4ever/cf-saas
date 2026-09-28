import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";

import { BRAND_INITIAL, BRAND_NAME } from "@/lib/brand";

type BrandMarkProps = {
  className?: string;
  to?: LinkProps["to"];
};

export function BrandMark({ className, to = "/" }: BrandMarkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex min-w-0 items-center gap-2 font-semibold tracking-tight transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span className="bg-linear-to-br from-foreground to-foreground/55 text-background shadow-sm flex size-8 shrink-0 items-center justify-center rounded-lg text-sm">
        {BRAND_INITIAL}
      </span>
      <span className="truncate">{BRAND_NAME}</span>
    </Link>
  );
}
