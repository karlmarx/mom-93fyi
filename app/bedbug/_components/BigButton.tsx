"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "danger" | "neutral" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-bedbug-sage text-bedbug-cream hover:brightness-95 active:brightness-90",
  danger: "bg-bedbug-red text-bedbug-cream hover:brightness-95 active:brightness-90",
  neutral: "bg-bedbug-ink text-bedbug-cream hover:brightness-110 active:brightness-95",
  ghost: "bg-transparent text-bedbug-ink border-2 border-bedbug-ink/30 hover:border-bedbug-ink/60",
};

const BASE =
  "inline-flex items-center justify-center w-full min-h-16 px-6 py-4 rounded-lg text-bedbug-button font-semibold leading-tight text-center transition-[filter,border-color,background-color] duration-150 select-none focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40 disabled:opacity-50 disabled:cursor-not-allowed";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
};

type AsButton = CommonProps & {
  onClick?: () => void;
  href?: undefined;
  type?: "button" | "submit";
};

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: () => void;
  type?: undefined;
};

export function BigButton(props: AsButton | AsLink) {
  const variant = props.variant ?? "primary";
  const className = `${BASE} ${VARIANT_CLASSES[variant]} ${props.className ?? ""}`;

  if ("href" in props && props.href) {
    if (props.external) {
      return (
        <a
          href={props.href}
          aria-label={props.ariaLabel}
          aria-disabled={props.disabled || undefined}
          onClick={props.onClick}
          className={className}
        >
          {props.children}
        </a>
      );
    }
    return (
      <Link
        href={props.href}
        aria-label={props.ariaLabel}
        onClick={props.onClick}
        className={className}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={(props as AsButton).type ?? "button"}
      onClick={(props as AsButton).onClick}
      aria-label={props.ariaLabel}
      disabled={props.disabled}
      className={className}
    >
      {props.children}
    </button>
  );
}
