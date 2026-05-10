import type { Metadata } from "next";
import ConsentForm from "./ConsentForm";

export const metadata: Metadata = {
  title: "SMS Consent · mom.93.fyi",
  robots: "noindex",
};

export default function ConsentPage() {
  return <ConsentForm />;
}
