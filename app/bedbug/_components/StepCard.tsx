"use client";

import type { ReactNode } from "react";
import { PhotoSlot } from "./PhotoSlot";

type Props = {
  eyebrow?: string;
  title: string;
  instruction?: string;
  photoSlotId?: string;
  doneWhen?: string;
  children?: ReactNode;
  footer?: ReactNode;
};

export function StepCard({
  eyebrow,
  title,
  instruction,
  photoSlotId,
  doneWhen,
  children,
  footer,
}: Props) {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      {eyebrow ? (
        <div className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          {eyebrow}
        </div>
      ) : null}

      <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
        {title}
      </h1>

      {instruction ? (
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">{instruction}</p>
      ) : null}

      {photoSlotId ? <PhotoSlot id={photoSlotId} alt={title} /> : null}

      {children ? <div className="flex flex-col gap-4">{children}</div> : null}

      {doneWhen ? (
        <p className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic text-bedbug-ink/80">
          <span className="font-semibold not-italic">DONE when:</span> {doneWhen}
        </p>
      ) : null}

      {footer ? <div className="pt-2">{footer}</div> : null}
    </article>
  );
}
