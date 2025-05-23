"use client"

import React, { useState } from "react"

import Image from "next/image"
import { LogoutButton } from "@/components/logout"
import { Link } from "@/i18n/routing"


export default function DashboardLayout({ children }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard")

  const menuItems = [
    {
      name: "Dashboard",
      icon: "1",
      href: "/emplyr-dshbrd6161",
    },
    {
      name: "My Profile",
      icon: "2",
      href: "/emplyr-dshbrd6161/my-prfl6162",
    },
    {
      name: "Company Profile",
      icon: "2",
      href: "/emplyr-dshbrd6161/cmpny-prfl6163",
    },
    {
      name: "My Jobs",
      icon: "3",
      href: "/emplyr-dshbrd6161/my-jobs6164",
    },
    {
      name: "Staffs",
      icon: "3",
      href: "/emplyr-dshbrd6161/staffs6165",
    },
    {
      name: "Opportunities",
      icon: "5",
      href: "/emplyr-dshbrd6161/opprtnty6166",
    },
    {
      name: "Interviews",
      icon: "6",
      href: "/emplyr-dshbrd6161/intrvw6167",
    },
    {
      name: "Hiring Stats",
      icon: "7",
      href: "/emplyr-dshbrd6161/hrng-stats6168",
    },
    {
      name: "Inbox",
      icon: "4",
      href: "/emplyr-dshbrd6161/inbox6169",
    },
    {
      name: "Fairs",
      icon: "8",
      href: "/emplyr-dshbrd6161/fairs6170",
    },
    {
      name: "Talent",
      icon: "9",
      href: "/emplyr-dshbrd6161/talent6171",
    },
    {
      name: "Institutions",
      icon: "10",
      href: "/emplyr-dshbrd6161/institutns6172",
    },
    {
      name: "Campus Placements",
      icon: "11",
      href: "/emplyr-dshbrd6161/cmps-plcmnt6173",
    },
  
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-sm h-full dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Image src="/image/institutndashboard/dashboard/dashboardlogo.svg" alt="Company Logo" width={64} height={64} className="mx-auto" />
          <p className="text-center text-sm mt-2 dark:text-gray-300">4N EcoTech</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 mb-2 rounded-lg transition-colors ${
                activeMenu === item.name
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveMenu(item.name)
              }}
            >
              <Image src={`/image/employerdashboard/db/${item.icon}.svg`} alt={item.name} width={20} height={20} className="mr-3" />
              <span>{item.name}</span>
            </Link>
          ))}
               <LogoutButton className="w-full" />
        </nav>
   
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

