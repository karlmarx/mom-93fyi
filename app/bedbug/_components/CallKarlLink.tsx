"use client";

import { CONFIG } from "../_lib/config";
import { telHref } from "../_lib/sms";
import { BigButton } from "./BigButton";

type Props = {
  label?: string;
  variant?: "primary" | "danger";
};

export function CallKarlLink({ label = "Call Karl now", variant = "primary" }: Props) {
  return (
    <BigButton
      href={telHref(CONFIG.KARL_PHONE)}
      external
      variant={variant}
      ariaLabel={`${label}. Phone number ${CONFIG.KARL_PHONE}.`}
    >
      {label}
    </BigButton>
  );
}
