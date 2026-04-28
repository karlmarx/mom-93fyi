import type { Metadata, Viewport } from "next";
import "./bedbug.css";
import { AppShell } from "./_components/AppShell";

export const metadata: Metadata = {
  title: "Mom's Bed Bug Plan",
  description: "Step-by-step help for the bed bug plan.",
  applicationName: "Mom's Bed Bug Plan",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Bed Bug Plan",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FBF7F0",
};

export default function BedbugLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
