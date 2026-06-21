import { NextResponse, type NextRequest } from "next/server";

function getCanonicalUrl(): URL | undefined {
  const authUrl = process.env.AUTH_URL?.trim();

  if (!authUrl) return undefined;

  try {
    return new URL(authUrl);
  } catch {
    return undefined;
  }
}

export function proxy(request: NextRequest) {
  const canonicalUrl = getCanonicalUrl();
  const requestHost = request.headers.get("host");

  if (!canonicalUrl || requestHost === canonicalUrl.host) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(request.nextUrl.pathname, canonicalUrl.origin);
  redirectUrl.search = request.nextUrl.search;

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
