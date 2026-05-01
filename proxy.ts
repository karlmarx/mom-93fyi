import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host.startsWith("thumbyoga.")) {
    const url = request.nextUrl.clone();
    if (url.pathname.startsWith("/thumbyoga/") || url.pathname.startsWith("/api/")) {
      return NextResponse.next();
    }
    url.pathname =
      url.pathname === "/" ? "/thumbyoga/index.html" : `/thumbyoga${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (!host.startsWith("bedbug.")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  if (
    url.pathname === "/bedbug" ||
    url.pathname.startsWith("/bedbug/") ||
    url.pathname.startsWith("/api/")
  ) {
    // /api/* stays as-is so Twilio webhooks reach the canonical handler
    // regardless of which host they came in on.
    return NextResponse.next();
  }

  url.pathname = url.pathname === "/" ? "/bedbug" : `/bedbug${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Run on every path except Next.js internals, the manifest, the service
    // worker, the favicon, API routes, and obvious static assets.
    "/((?!api/|_next/|manifest\\.webmanifest$|bedbug-sw\\.js$|favicon\\.ico$|.*\\.(?:svg|png|jpg|jpeg|webp|gif|css|js|woff2?)$).*)",
  ],
};
