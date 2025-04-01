import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req) {
  // Run internationalization middleware first
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse; // Handle language-based redirection

  // Handle authentication using next-auth
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/(hi|en|mr|gu|de|fr|es|ru|ja|ar|fa|ka|ml|tl|tm)/:path*", // i18n matcher
  ],
};
