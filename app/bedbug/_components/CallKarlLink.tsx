"use client";

import { CONFIG } from "../_lib/config";
import { telHref } from "../_lib/sms";
import { BigButton } from "./BigButton";

type Props = {
  children?: React.ReactNode;
  variant?: "primary" | "danger" | "ghost";
};

export function CallKarlLink({ children, variant = "primary" }: Props) {
  return (
    <BigButton
      href={telHref(CONFIG.KARL_PHONE)}
      external
      variant={variant}
      ariaLabel="Call Ben on the phone"
    >
      {children ?? "Call Ben now"}
    </BigButton>
  );
}
