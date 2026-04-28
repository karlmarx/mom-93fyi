"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "neutral" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-bedbug-sage text-bedbug-cream",
  neutral: "bg-bedbug-cream text-bedbug-ink border-2 border-bedbug-ink/15",
  danger: "bg-bedbug-red text-bedbug-cream",
};

type Props = {
  href: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: Variant;
  ariaLabel?: string;
};

export function HomeCard({ href, title, subtitle, icon, variant = "neutral", ariaLabel }: Props) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? title}
      className={`flex w-full items-center gap-4 rounded-xl px-6 py-6 shadow-sm active:brightness-95 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40 ${VARIANTS[variant]}`}
      style={{ minHeight: 96 }}
    >
      {icon ? (
        <span aria-hidden="true" className="text-3xl leading-none">
          {icon}
        </span>
      ) : null}
      <div className="flex flex-col text-left">
        <span className="text-bedbug-title font-semibold leading-tight">{title}</span>
        {subtitle ? <span className="mt-1 text-base opacity-80">{subtitle}</span> : null}
      </div>
    </Link>
  );
}
