// // middleware.js
// import { getToken } from "next-auth/jwt";
// import createMiddleware from "next-intl/middleware";
// import { NextResponse } from "next/server";
// import { routing } from "./i18n/routing";
// import { getRoleRoutes, isPublicRoute, PUBLIC_ROUTES } from "./lib/routeAccess";

// const intlMiddleware = createMiddleware(routing);

// export async function middleware(req) {
//   const { pathname } = req.nextUrl;
//   const locale = req.nextUrl.locale || "en";

//   // Check if the route is public - public pages are always accessible
//   if (isPublicRoute(pathname)) {
//     console.log("Public route accessed:", pathname); // Debugging line
//     return intlMiddleware(req); // Public pages are accessible to everyone
//   }

//   // Protected flow starts here
//   const token = await getToken({ req });

//   // If there's no token and it's not a public route, redirect to login
//   // if (!token) {
//   //   console.log("No token found, redirecting to login6035"); // Debugging line
//   //   return NextResponse.redirect(new URL(`/${locale}/login6035`, req.url));
//   // }

//   // Get user role
//   const role = token?.role;
//   // if (!role) {
//   //   console.log("No role found, redirecting to unauthorized"); // Debugging line
//   //   return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
//   // }

//   // Check if user has access to the route
//   const allowedRoutes = [...getRoleRoutes(role), ...PUBLIC_ROUTES];
//   const isAllowed = allowedRoutes.some((route) =>
//     pathname.startsWith(`/${locale}${route}`)
//   );

//   if (!isAllowed) {
//     console.log(
//       "Access denied, redirecting to unauthorized",
//       isPublicRoute(pathname),
//       allowedRoutes,
//       pathname
//     ); // Debugging line
//     return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
//   }

//   return intlMiddleware(req);
// }

// export const config = {
//   matcher: ["/", "/(hi|en|mr|gu|de|fr|es|ru|ja|ar|fa|ka|ml|tl|tm)/:path*"],
// };

// middleware.js
// middleware.js

import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

import { LOCALES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "./lib/routeAccess";

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware function to handle various request checks and routing.
 *
 * @async
 * @function middleware
 * @param {import('next/server').NextRequest} req - The incoming request object.
 * @returns {Promise<import('next/server').NextResponse>} The response object after processing the middleware logic.
 *
 * @description
 * This middleware performs the following checks and actions:
 * 1. **Skip Non-Page Requests**: Skips middleware processing for requests that do not require it.
 * 2. **Handle Public Routes**: Allows public access to specific routes.
 * 3. **Authentication Check**: Verifies if the user is authenticated by checking for a valid token.
 * 4. **Role Verification**: Ensures the token contains a valid role; redirects to an unauthorized page if missing.
 * 5. **Authorization Check**: Validates if the user's role is authorized to access the requested route; redirects to an unauthorized page if access is denied.
 * 6. **All Checks Passed**: If all checks are successful, the request is processed further.
 *
 * @example
 * // Example usage in a Next.js application
 * import { middleware } from './middleware';
 *
 * export async function handleRequest(req) {
 *   return await middleware(req);
 * }
 */

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const locale = req.nextUrl.locale || "en";

  // ===== 1. Skip Non-Page Requests =====
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  // ===== 2. Handle Public Routes =====
  if (isPublicRoute(pathname)) {
    return intlMiddleware(req); // Public access always allowed
  }

  // ===== 3. Authentication Check =====
  const token = await getToken({ req });

  if (!token) {
    return handleUnauthenticated(req, pathname, locale);
  }

  // ===== 4. Role Verification =====
  const role = token?.role;
  if (!role) {
    // console.log("No role found, redirecting to unauthorized"); // Debugging line
    return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
  }

  // ===== 5. Authorization Check =====

  if (!isAuthorized(role, pathname)) {
    // console.log(      '"Access denied, redirecting to unauthorized"); // Debugging line'    );
    return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
  }

  // ===== 6. All Checks Passed =====
  return intlMiddleware(req);
}

// Helper Functions

function shouldSkipMiddleware(pathname) {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") || // Static files
    pathname.startsWith("/favicon.ico")
  );
}

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.some((route) => isPathMatch(pathname, route));
}

function handleUnauthenticated(req, pathname, locale) {
  // Special case: Don't redirect if already going to login
  if (isPathMatch(pathname, "/login6035")) {
    return NextResponse.next();
  }

  const loginUrl = new URL(`/${locale}/login6035`, req.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

function isAuthorized(role, pathname) {
  // Get all allowed paths for this role
  const roleRoutes = PROTECTED_ROUTES[role] || [];
  const allowedPaths = [...roleRoutes, ...PUBLIC_ROUTES];

  return allowedPaths.some((route) => isPathMatch(pathname, route));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/",
    "/(hi|en|mr|gu|de|fr|es|ru|ja|ar|fa|ka|ml|tl|tm)/:path*",
  ],
};

// lib/pathUtils.js

export function normalizePath(pathname) {
  // Remove locale prefix if present
  const localePrefix = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  return localePrefix
    ? pathname.replace(`/${localePrefix}`, "") || "/"
    : pathname;
}

export function isPathMatch(requestPath, targetPath) {
  const cleanRequest = normalizePath(requestPath);
  const cleanTarget = normalizePath(targetPath);
  return (
    cleanRequest === cleanTarget || cleanRequest.startsWith(`${cleanTarget}/`)
  );
}
