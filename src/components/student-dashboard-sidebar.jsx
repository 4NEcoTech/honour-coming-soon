"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  FaBriefcase,
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaGraduationCap,
  FaHandsHelping,
  FaMapMarkerAlt,
  FaProjectDiagram,
  FaTools,
  FaUser,
} from "react-icons/fa";
import { LogoutButton } from "./logout";

const menuItems = [
  {
    name: "Dashboard",
    href: "/stdnt-dshbrd6071",
    icon: "/image/institutndashboard/dashboard/dashboard.svg",
  },
  {
    name: "My Profile",
    href: "/stdnt-dshbrd6071/my-prfl6072",
    icon: "/image/institutndashboard/dashboard/myprofile.svg",
    dropdown: true,
  },
  // {
  //   name: "My Jobs",
  //   href: "/stdnt-dshbrd6071/my-jobs",
  //   icon: "/image/institutndashboard/dashboard/myprofile.svg",
  // },
  // {
  //   name: "Messages",
  //   href: "/stdnt-dshbrd6071/mssg6073",
  //   icon: "/image/institutndashboard/dashboard/message.svg",
  // },
  {
    name: "Account Settings",
    href: "/stdnt-dshbrd6071/accnt-sttng6074",
    icon: "/image/institutndashboard/dashboard/setting.svg",
  },
];

const dropdownItems = {
  "My Profile": [
    { name: "About", id: "about", icon: <FaUser className="text-gray-500" /> },
    {
      name: "Skill",
      id: "skills",
      icon: <FaTools className="text-gray-500" />,
    },
    {
      name: "Experience",
      id: "experience",
      icon: <FaBriefcase className="text-gray-500" />,
    },
    {
      name: "Education",
      id: "education",
      icon: <FaGraduationCap className="text-gray-500" />,
    },
    {
      name: "Project",
      id: "project",
      icon: <FaProjectDiagram className="text-gray-500" />,
    },
    {
      name: "Volunteering",
      id: "volenteering",
      icon: <FaHandsHelping className="text-gray-500" />,
    },
    {
      name: "Location Preference",
      id: "location",
      icon: <FaMapMarkerAlt className="text-gray-500" />,
    },
    {
      name: "Resume",
      id: "resume",
      icon: <FaFileAlt className="text-gray-500" />,
    },
    //   {
    //     name: "Language",
    //     id: "language",
    //     icon: <FaLanguage className="text-gray-500" />,
    //   },
    //   {
    //     name: "Social",
    //     id: "social",
    //     icon: <FaUserFriends className="text-gray-500" />,
    //   },
  ],
};

export default function StudentDashboardSidebar() {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const pathname = usePathname();

  // Function to toggle dropdown visibility
  const toggleDropdown = (menuName) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  // Function to scroll to section inside `myprofile6112.js`
  const scrollToSection = (id) => {
    if (typeof window !== "undefined") {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <aside className="w-64 shadow-lg p-2 hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="mb-4 text-center font-bold p-4 rounded-lg">
        <Image
          src="/image/institutndashboard/dashboard/dashboardlogo.svg"
          alt="Institution Logo"
          width={40}
          height={40}
          className="mx-auto w-32 h-32 object-contain"
        />
      </div>

      {/* Sidebar Menu */}
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <React.Fragment key={item.name}>
            <Link href={item.href} scroll={false}>
              <li
                onClick={() => item.dropdown && toggleDropdown(item.name)}
                className={`relative cursor-pointer text-gray-700 rounded-lg flex items-center p-2 ${
                  pathname === item.href ||
                  (item.dropdown && openDropdowns[item.name])
                    ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}>
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={24}
                  height={24}
                  className="mr-3"
                />

                <span className="flex-grow">{item.name}</span>

                {item.dropdown && (
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                    {openDropdowns[item.name] ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                )}
              </li>
            </Link>
            {/* Dropdown Items */}
            {item.dropdown && openDropdowns[item.name] && (
              <ul className="mt-2 space-y-2 pl-8">
                {dropdownItems[item.name].map((subItem) => (
                  <li
                    key={subItem.name}
                    className="flex items-center cursor-pointer"
                    onClick={() => scrollToSection(subItem.id)}>
                    <span className="mr-3">{subItem.icon}</span>
                    <span className="hover:text-blue-500 dark:hover:text-blue-400 text-gray-600 dark:text-gray-300">
                      {subItem.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}

        {/* Logout Button */}
        <LogoutButton className="w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" />
      </ul>
    </aside>
  );
}
