// lib/routeAccess.js
export const PUBLIC_ROUTES = [
  "/",
  "/video",
  "/message",
  "/swagger",
  "/unauthorized",
  "/about",
  "/cntct6011",
  "/login6035",
"/stdnt-login",
  "/emp-login6152",
  "/jb-skr-login",
  "/frgt-psswd6036",
  "/rgstrtn6021",
  "/cookie6012",
  "/eductnl-inst6002",
  "/faq6013",
  "/prvcy-plcy6014",
  "/trmsnd-cndtn6015",
  "/hwit-wrks6004",
  "/job-fair6005",
  "/jobs6006",
  "/job",
  "/emp-rgstr6151",
  "/student-signup",
  "/team-signup",
  "/vrfctn-pndng6032",
  "/vrfctn-scss6034",
  "/cmpny-public-prfl",
  "/institution",
  "/institution-ecolink",
  "/institutn-public-fllwng",
  "/student",
  "/student-ecolink",
  "/team-public-prfl6065",
  "/user-ecolink",
  "/supr-admn-login6102",
  "/supr-admn-rgstrtn6101",
  "/achvr-cntrl6007",
  "/achr-cntrl-stdnt",
  "/admin",
  "/company-ecolink",
  "/cmpny",
  "/employer",
];

// Role-based protected routes (without locales)
// 01 Guest User
// 02 SA - Admin
// 03 SA - Team
// 04 SA - Support
// 05 Student
// 06 In Admin
// 07 In Team
// 08 In Support
// 09 Em Admin
// 10 Em Team
// 11 Em Support
// 12 Job Seeker

export const PROTECTED_ROUTES = {
  "01": [""], // Guest User
  "02": ["/supr-admn-dshbrd6103"], // SA - Admin
  "03": ["/supr-admn-dshbrd6103"], // SA - Team Admin
  "04": ["/supr-admn-dshbrd6103"], // SA - Support Admin
  "05": ["/stdnt-dshbrd6071", "/set-studnt-dtls", "/stdnt-dcmnt6046"], // Student
  "06": [
    "/institutn-dshbrd6051",
    "/set-admin-dtls",
    "/admin-dcmnt6027",
    "/cmpny-dcmnt6031",
    "/set-edu-dtls",
  ], // In Admin
  "07": [
    "/institutn-dshbrd6051",
    "/set-admin-dtls",
    "/admin-dcmnt6027",
    "/cmpny-dcmnt6031",
    "/set-edu-dtls",
    "/set-team-staff-prfl",
  ], // In Team
  "08": [
    "/institutn-dshbrd6051",
    "/set-admin-dtls",
    "/admin-dcmnt6027",
    "/cmpny-dcmnt6031",
    "/set-edu-dtls",
    "/set-team-staff-prfl",
  ], // In Support
  "09": ["/set-admin-dtls", "/admin-dcmnt6027", "/set-cmp-prfl", "/cmp-dcmnt6156", "/emplyr-dshbrd6161"], // Em Admin
  10: [ "/set-team-staff-prfl", "/admin-dcmnt6027", "/emplyr-dshbrd6161",], // Em Team
  11: [ "/set-team-staff-prfl", "/admin-dcmnt6027", "/emplyr-dshbrd6161",], // Em Support
  12: [""], // Job Seeker

  // Add more roles as needed
};

// Supported locales
export const LOCALES = [
  "en",
  "hi",
  "mr",
  "gu",
  "de",
  "fr",
  "es",
  "ru",
  "ja",
  "ar",
  "fa",
  "ka",
  "ml",
  "tl",
  "tm",
];

/**
 * Remove locale prefix from path if present
 */
function removeLocalePrefix(pathname) {
  const localePrefix = LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  return localePrefix ? pathname.replace(`/${localePrefix}`, "") : pathname;
}

/**
 * Check if a route is public (accessible to everyone)
 * Handles both localized and non-localized paths
 */
export function isPublicRoute(pathname) {
  const cleanPath = removeLocalePrefix(pathname);
  return PUBLIC_ROUTES.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`)
  );
}

/**
 * Get protected routes for a specific role including localized versions
 */
export function getRoleRoutes(role) {
  const baseRoutes = PROTECTED_ROUTES[role] || [];

  // Generate localized versions of all protected routes
  const localizedRoutes = baseRoutes.flatMap((route) =>
    LOCALES.map((locale) => `/${locale}${route}`)
  );

  // Return both original and localized routes
  return [...baseRoutes, ...localizedRoutes];
}

/**
 * Check if a path matches any of the allowed routes
 */
export function isRouteAllowed(pathname, allowedRoutes) {
  const cleanPath = removeLocalePrefix(pathname);
  return allowedRoutes.some((route) => {
    const cleanRoute = removeLocalePrefix(route);
    return cleanPath === cleanRoute || cleanPath.startsWith(`${cleanRoute}/`);
  });
}
