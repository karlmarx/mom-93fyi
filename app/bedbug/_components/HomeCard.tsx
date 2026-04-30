"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "neutral" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-bedbug-sage text-bedbug-cream hover:brightness-95 focus:ring-bedbug-sage/40",
  neutral:
    "bg-bedbug-cream-deeper text-bedbug-ink hover:brightness-95 focus:ring-bedbug-sage/40",
  danger:
    "bg-bedbug-red text-bedbug-cream hover:brightness-95 focus:ring-bedbug-red/40",
};

type Props = {
  href: string;
  title: string;
  body?: string;
  eyebrow?: string;
  variant?: Variant;
  ariaLabel?: string;
  children?: ReactNode;
};

export function HomeCard({
  href,
  title,
  body,
  eyebrow,
  variant = "neutral",
  ariaLabel,
  children,
}: Props) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? title}
      className={`block rounded-lg p-6 min-h-[6rem] focus:outline-none focus:ring-4 transition-[filter,background-color] ${VARIANT_CLASSES[variant]}`}
    >
      {eyebrow ? (
        <span
          className={`block text-sm font-semibold uppercase tracking-wider ${
            variant === "primary" || variant === "danger"
              ? "text-bedbug-cream/85"
              : "text-bedbug-ink/60"
          }`}
        >
          {eyebrow}
        </span>
      ) : null}
      <span className="mt-1 block text-bedbug-title font-semibold leading-snug">
        {title}
      </span>
      {body ? (
        <span
          className={`mt-2 block text-bedbug-body leading-snug ${
            variant === "primary" || variant === "danger"
              ? "text-bedbug-cream/90"
              : "text-bedbug-ink/70"
          }`}
        >
          {body}
        </span>
      ) : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </Link>
  );
}
