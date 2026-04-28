"use client";

import { useRef, useState } from "react";
import { CONFIG } from "../_lib/config";
import { smsHref } from "../_lib/sms";

type Props = {
  smsBody: string;
};

export function PhotoCaptureButton({ smsBody }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [captured, setCaptured] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCaptured(true);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Take a photo with the camera"
        className="inline-flex w-full min-h-16 items-center justify-center rounded-lg border-2 border-bedbug-ink/30 bg-bedbug-cream px-6 py-4 text-bedbug-button font-semibold text-bedbug-ink hover:border-bedbug-sage active:brightness-95 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
      >
        Take a photo
      </button>

      {captured ? (
        <div className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body text-bedbug-ink">
          <p className="mb-3">
            Photo saved. Open Messages and text the photo to Karl. Tap below to open Messages.
          </p>
          <a
            href={smsHref(CONFIG.KARL_PHONE, smsBody)}
            className="inline-flex w-full min-h-16 items-center justify-center rounded-lg bg-bedbug-sage px-6 py-4 text-bedbug-button font-semibold text-bedbug-cream hover:brightness-95"
            aria-label="Open Messages to send the photo to Karl"
          >
            Open Messages to Karl
          </a>
        </div>
      ) : null}
    </div>
  );
}
