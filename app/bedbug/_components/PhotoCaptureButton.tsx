"use client";

import { useRef, useState } from "react";
import { CONFIG } from "../_lib/config";
import { smsHref } from "../_lib/sms";
import { BigButton } from "./BigButton";

type Props = {
  smsBody: string; // text body to send with the photo
  label?: string;
};

// Native camera capture via file input. After the user picks a photo, iOS
// can't reliably attach it to an sms: link, so we fall back to instructing
// her to attach it manually. We open Messages prefilled with the body either
// way.
export function PhotoCaptureButton({ smsBody, label = "Take a photo" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [taken, setTaken] = useState(false);

  function open() {
    inputRef.current?.click();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setTaken(true);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
      {!taken ? (
        <BigButton onClick={open} ariaLabel={label}>
          {label}
        </BigButton>
      ) : (
        <div className="flex flex-col gap-3 rounded-lg bg-bedbug-cream-deeper p-4">
          <p className="text-bedbug-body leading-snug text-bedbug-ink">
            Photo saved on your phone. Now open Messages and text the photo to
            Ben.
          </p>
          <BigButton
            href={smsHref(CONFIG.KARL_PHONE, smsBody)}
            external
            ariaLabel="Open Messages to text the photo to Ben"
          >
            Open Messages
          </BigButton>
          <BigButton onClick={open} variant="ghost" ariaLabel="Take another photo">
            Take another photo
          </BigButton>
        </div>
      )}
    </div>
  );
}
