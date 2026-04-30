// Returns the build version baked in at build time. The client polls this on
// focus to detect when a new deploy has landed and hard-reloads if so, so
// Mom always sees the latest version without having to know what to tap.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { version: process.env.NEXT_PUBLIC_BUILD_VERSION ?? "dev" },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
}
