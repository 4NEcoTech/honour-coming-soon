import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'hi', 'mr', 'gu', 'de', 'fr', 'es', 'ru', 'ja', 'ar','fa', 'ka', 'ml', 'tl', 'tm'],

  // Used when no locale matches
  defaultLocale: 'en',
  localeDetection: true,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
