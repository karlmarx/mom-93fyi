import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!host.startsWith("bedbug.")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  if (url.pathname === "/bedbug" || url.pathname.startsWith("/bedbug/")) {
    return NextResponse.next();
  }

  url.pathname = url.pathname === "/" ? "/bedbug" : `/bedbug${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Run on every path except Next.js internals, the manifest, the service
    // worker, the favicon, and obvious static assets.
    "/((?!_next/|manifest\\.webmanifest$|bedbug-sw\\.js$|favicon\\.ico$|.*\\.(?:svg|png|jpg|jpeg|webp|gif|css|js|woff2?)$).*)",
  ],
};
