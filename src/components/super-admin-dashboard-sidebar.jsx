"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout";
import { useSession } from "next-auth/react";

const menuItems = [
  {
    icon: "/image/seperadmindashboard/dbrd/1.svg",
    label: "Users",
    href: "/supr-admn-dshbrd6103",
  },
  {
    icon: "/image/seperadmindashboard/dbrd/2.svg",
    label: "Institutions",
    href: "/supr-admn-dshbrd6103/institutn6104",
  },
  {
    icon: "/image/seperadmindashboard/dbrd/3.svg",
    label: "Reported Users",
    href: "/supr-admn-dshbrd6103/reprtdusrs6105",
  },
  {
    icon: "/image/seperadmindashboard/dbrd/4.svg",
    label: "Settings",
    href: "/supr-admn-dshbrd6103/setting6106",
  },
  {
    icon: "/image/seperadmindashboard/dbrd/5.svg",
    label: "Configurable Parameters",
    href: "/supr-admn-dshbrd6103/configparams6107",
  },
  {
    icon: "/image/seperadmindashboard/dbrd/5.svg",
    label: "Contact",
    href: "/supr-admn-dshbrd6103/contact6110",
  },
  {
    icon: "/image/seperadmindashboard/dbrd/5.svg",
    label: "Achiever Central",
    href: `/supr-admn-dshbrd6103/achiever-central`,
  },
];

export function SuperAdminDashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  // console.log(session)
  const roleMapping = {
    "02": "Super Admin",
    "03": "Super Admin Team",
    "04": "Super Admin Support",
  };

  // Ensure session is available before rendering
  if (!session || !session.user) {
    return <p className="text-red-500">User not found</p>;
  }
  const userEmail = session?.user?.email || "unknown@example.com";
  const userName = userEmail.split("@")[0];
  const userImage = session?.user?.image || "";
  const fallbackInitials = userEmail.slice(0, 2).toUpperCase();
  const userRole = roleMapping[session.user.role] || "Unknown Role";

  return (
    <div className="w-64 border-r border-border bg-background dark:bg-gray-900 p-6 space-y-6 md:flex flex-col shadow-sm hidden">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          {/* If user image exists, show it; otherwise, show a fallback */}
          {userImage ? (
            <AvatarImage src={userImage} alt="User Avatar" />
          ) : (
            <AvatarFallback>{fallbackInitials}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-medium text-foreground dark:text-gray-100">
            {userName}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            {userRole}
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname === item.href
                ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white dark:from-blue-500 dark:to-emerald-500 dark:text-white shadow-md"
                : "text-foreground dark:text-gray-100 hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-800 dark:hover:text-white"
            }`}
          >
            <Image
              src={item.icon || "/placeholder.svg"}
              alt={item.label}
              className="h-4 w-4"
              width={16}
              height={16}
            />
            {item.label}
          </Link>
        ))}
        <LogoutButton className="w-full" />
      </nav>
    </div>
  );
}
