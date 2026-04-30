"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Floating "I'm stuck — call Ben" button. Always visible except on the
// home screen (where it's a card) and on the panic screen itself.
export function PanicButton() {
  const pathname = usePathname();
  if (!pathname) return null;
  if (pathname === "/bedbug" || pathname === "/bedbug/") return null;
  if (pathname.startsWith("/bedbug/stuck")) return null;

  return (
    <Link
      href="/bedbug/stuck"
      aria-label="I'm stuck — call Ben"
      className="fixed bottom-4 right-4 z-50 inline-flex min-h-16 items-center justify-center rounded-full bg-bedbug-red px-6 py-4 text-bedbug-button font-semibold text-bedbug-cream shadow-lg active:brightness-90 focus:outline-none focus:ring-4 focus:ring-bedbug-red/40"
    >
      <span aria-hidden="true" className="mr-2">
        🆘
      </span>
      I&apos;m stuck
    </Link>
  );
}
