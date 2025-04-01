"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import Link from "next/link";
// import { Link } from 'next/link';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const options = [
  { country: "मराठी", code: "mr" },
  { country: "हिन्दी", code: "hi" },
  { country: "ગુજરાતી", code: "gu" },
  { country: "English", code: "en" },
  { country: "తెలుగు", code: "tl" }, // Telugu
  { country: "தமிழ்", code: "tm" }, // Tamil
  { country: "മലയാളം", code: "ml" }, // Malayalam
  { country: "ಕನ್ನಡ", code: "ka" }, // Kannada
  // { country: "Deutsch", code: "de" },
  // { country: "Français", code: "fr" },
  // { country: "Español", code: "es" },
  // { country: "Русский", code: "ru" },
  // { country: "日本語", code: "ja" },
  // { country: "العربية", code: "ar" },
  // { country: "فارسی", code: "fa" },
];

export default function LangSwitcher() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Function to clean URL and update language
  const getUpdatedPath = (newLang) => {
    let cleanedPath = pathname.replace(/\(.*?\)\//g, "");

    if (/^\/[a-z]{2}(\/|$)/.test(cleanedPath)) {
      return cleanedPath
        .replace(/^\/[a-z]{2}/, `/${newLang}`)
        .replace(/\/$/, "");
    }

    return `/${newLang}${cleanedPath}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          Language
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((lang) => (
          <DropdownMenuItem key={lang.code} asChild>
            <Link
              href={getUpdatedPath(lang.code)}
              className={`w-full ${
                pathname.startsWith(`/${lang.code}`)
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
            >
              {lang.country}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
