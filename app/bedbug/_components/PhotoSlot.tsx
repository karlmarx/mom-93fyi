"use client";

import { useEffect, useState } from "react";

type Props = {
  id: string;
  alt?: string;
};

export function PhotoSlot({ id, alt }: Props) {
  const src = `/photos/${id}.jpg`;
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setExists(true);
    };
    img.onerror = () => {
      if (!cancelled) setExists(false);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (exists) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ""} className="w-full rounded-lg shadow-sm" />;
  }

  return (
    <div
      role="img"
      aria-label={alt ?? `Photo placeholder for ${id}`}
      className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-bedbug-ink/20 bg-bedbug-cream-deeper text-bedbug-ink/50"
    >
      <span className="font-mono text-sm uppercase tracking-wide">photo: {id}</span>
      <span className="mt-2 text-xs">(Karl will add)</span>
    </div>
  );
}
