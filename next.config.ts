import type { NextConfig } from "next";
import { execSync } from "node:child_process";

// Build version is baked in at build time and used by the auto-update flow:
// the client periodically fetches /version and hard-reloads if the response
// disagrees with the baked-in value. Prefer git short SHA; fall back to a
// timestamp so dev/CI without a git context still produces a unique value.
const buildVersion = (() => {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return Math.floor(Date.now() / 1000).toString(36);
  }
})();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_VERSION: buildVersion,
  },
};

export default nextConfig;
