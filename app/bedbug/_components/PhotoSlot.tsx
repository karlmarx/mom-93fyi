"use client";

import { useState } from "react";

type Props = {
  id: string;
  alt: string;
};

// Karl uploads photos by dropping a file at /public/photos/[id].jpg.
// If the file isn't there, we show a labeled placeholder so the slot is still
// obviously "where a photo will go" rather than a broken image icon.
export function PhotoSlot({ id, alt }: Props) {
  const [errored, setErrored] = useState(false);
  const src = `/photos/${id}.jpg`;

  if (errored) {
    return (
      <div
        role="img"
        aria-label={`Photo placeholder: ${alt}`}
        className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-bedbug-cream-deeper text-bedbug-ink/40"
      >
        <span className="text-base">[ photo: {id} ]</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="aspect-[4/3] w-full rounded-lg object-cover"
    />
  );
}
