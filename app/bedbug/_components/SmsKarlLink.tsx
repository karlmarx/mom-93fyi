"use client";

import { CONFIG } from "../_lib/config";
import { smsHref } from "../_lib/sms";
import { BigButton } from "./BigButton";

type Props = {
  body: string;
  label: string;
  variant?: "primary" | "danger" | "neutral";
  onClick?: () => void;
};

export function SmsKarlLink({ body, label, variant = "primary", onClick }: Props) {
  return (
    <BigButton
      href={smsHref(CONFIG.KARL_PHONE, body)}
      external
      variant={variant}
      onClick={onClick}
      ariaLabel={`${label}. Sends a text message to Karl.`}
    >
      {label}
    </BigButton>
  );
}
