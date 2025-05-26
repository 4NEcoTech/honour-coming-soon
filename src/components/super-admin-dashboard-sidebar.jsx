"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout";
import { useSession } from "next-auth/react";
import {
  ChevronDown,
  ChevronUp,
  Upload,
  GraduationCap,
  Users2,
  Building2,
  Contact,
} from "lucide-react";
import { useState } from "react";

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
    icon: "/image/institutndashboard/dashboard/bulkupload.svg",
    label: "Bulk Upload",
    dropdown: true,
    items: [
      {
        label: "Student",
        href: "/supr-admn-dshbrd6103/student-bulk-upload6111",
        icon: <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />,
      },
      {
        label: "Institution Staff",
        href: "/supr-admn-dshbrd6103/institution-staff-bulk-upload6112",
        icon: <Users2 className="h-4 w-4 mr-2 text-muted-foreground" />,
      },
      {
        label: "Company Staff",
        href: "/supr-admn-dshbrd6103/company-staff-bulk-upload6113",
        icon: <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />,
      },
    ],
  },


  {
    icon: "/image/seperadmindashboard/dbrd/1.svg",
    label: "Invited People",
    dropdown: true,
    items: [
      {
        label: "Invited Student",
        href: "/supr-admn-dshbrd6103/invited-student6108",
        icon: <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />,
      },
      {
        label: "Invited Staff",
        href: "/supr-admn-dshbrd6103/invited-staff6109",
        icon: <Users2 className="h-4 w-4 mr-2 text-muted-foreground" />,
      },
    ],
  },
  {
    icon: "/image/seperadmindashboard/dbrd/2.svg",
    label: "Extra Activities",
    dropdown: true,
    items: [
      {
        label: "Achiever Central",
        href: "/supr-admn-dshbrd6103/achiever-central",
        icon: <Upload className="h-4 w-4 mr-2 text-muted-foreground" />,
      },
      {
        label: "Contact",
        href: "/supr-admn-dshbrd6103/contact6110",
        icon: <Contact className="h-4 w-4 mr-2 text-muted-foreground" />,
      },
    ],
  },

    {
    icon: "/image/seperadmindashboard/dbrd/5.svg",
    label: "Config Params",
    href: "/supr-admn-dshbrd6103/configparams6107",
  },

    {
    icon: "/image/seperadmindashboard/dbrd/4.svg",
    label: "Settings",
    href: "/supr-admn-dshbrd6103/setting6106",
  },
];

export function SuperAdminDashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const roleMapping = {
    "02": "Super Admin",
    "03": "Super Admin Team",
    "04": "Super Admin Support",
  };

  if (!session || !session.user) {
    return <p className="text-red-500">User not found</p>;
  }

  const userEmail = session.user.email || "unknown@example.com";
  const userName = userEmail.split("@")[0];
  const userImage = session.user.image || "";
  const fallbackInitials = userEmail.slice(0, 2).toUpperCase();
  const userRole = roleMapping[session.user.role] || "Unknown Role";

  return (
    <div className="w-64 border-r border-border bg-background dark:bg-gray-900 p-6 space-y-6 md:flex flex-col shadow-sm hidden">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
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
        {menuItems.map((item) =>
          item.dropdown ? (
            <div key={item.label} className="space-y-1">
              <button
                onClick={() => toggleDropdown(item.label)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg text-foreground dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-3">
                  <Image
                    src={item.icon || "/placeholder.svg"}
                    alt={item.label}
                    className="h-4 w-4"
                    width={16}
                    height={16}
                  />
                  {item.label}
                </span>
                {openDropdowns[item.label] ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {openDropdowns[item.label] && (
                <div className="ml-6 space-y-1">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md ${
                        pathname === subItem.href
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {subItem.icon}
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-gray-200 dark:bg-gray-800 font-semibold"
                  : "text-foreground dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
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
          )
        )}
        <LogoutButton className="w-full mt-4 text-muted-foreground hover:text-foreground" />
      </nav>
    </div>
  );
}
