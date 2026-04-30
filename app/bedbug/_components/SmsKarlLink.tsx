"use client";

import { CONFIG } from "../_lib/config";
import { smsHref } from "../_lib/sms";
import { BigButton } from "./BigButton";

type Props = {
  body: string;
  children?: React.ReactNode;
  variant?: "primary" | "danger" | "ghost";
  ariaLabel?: string;
  onClick?: () => void;
};

export function SmsKarlLink({
  body,
  children,
  variant = "primary",
  ariaLabel,
  onClick,
}: Props) {
  return (
    <BigButton
      href={smsHref(CONFIG.KARL_PHONE, body)}
      external
      variant={variant}
      ariaLabel={ariaLabel ?? "Send a text message to Ben"}
      onClick={onClick}
    >
      {children ?? "Text Ben"}
    </BigButton>
  );
}
