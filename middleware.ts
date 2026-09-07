import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

/** Constant-time string comparison to avoid leaking credential length/prefix. */
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  let diff = bufA.length ^ bufB.length;
  const len = Math.max(bufA.length, bufB.length);
  for (let i = 0; i < len; i++) {
    diff |= (bufA[i % bufA.length] ?? 0) ^ (bufB[i % bufB.length] ?? 0);
  }
  return diff === 0;
}

function handleAdminAuth(request: NextRequest): NextResponse {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    return new NextResponse(
      "Admin access is not configured (ADMIN_USER / ADMIN_PASSWORD missing).",
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const separator = decoded.indexOf(":");
      const givenUser = decoded.slice(0, separator);
      const givenPassword = decoded.slice(separator + 1);
      if (
        separator > -1 &&
        safeEqual(givenUser, user) &&
        safeEqual(givenPassword, password)
      ) {
        const response = NextResponse.next();
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
        return response;
      }
    } catch {
      // fall through to the 401 below on malformed base64
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"',
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return handleAdminAuth(request);
  }
  return handleI18n(request);
}

export const config = {
  // 1) /admin/** for Basic Auth, 2) everything else for locale routing, minus
  //    the API, Next internals, and real static assets.
  //
  // The asset exclusion lists actual file extensions rather than "any path
  // containing a dot". The broader form skipped this middleware for anything
  // dotted, so /index.html and /foo.php never got a locale — and the only
  // not-found page calls getLocale(), which throws without one. Every bot
  // probe for /index.html or /wp-login.php answered 500 instead of 404, and a
  // steady trickle of server errors is exactly what makes a crawler back off.
  matcher: [
    "/admin/:path*",
    "/((?!api|admin|_next|_vercel|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|mjs|txt|xml|json|webmanifest|woff|woff2|ttf|otf|eot|pdf|mp4|webm|mp3)$).*)",
  ],
};
