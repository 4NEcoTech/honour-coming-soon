"use client";

import { useAbility } from "@/Casl/CaslContext";
import { Link } from "@/i18n/routing";
// import { useAbility } from "@casl/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function InteractiveSidebar({ menuItems, dropdownItems }) {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);

  const pathname = usePathname();
  const ability = useAbility(); // Assuming you have a useAbility hook to get the current ability
  // console.log("ability", ability.can("read", "Student"));
  const toggleDropdown = (menuName) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  const handleMenuClick = (menuName, isDropdown) => {
    if (isDropdown) {
      toggleDropdown(menuName);
    } else {
      setActiveMenu(menuName);
    }
  };

  const isActive = (href) => pathname === href;

  const isDropdownActive = (items) =>
    items.some(
      (item) =>
        isActive(item.href) ||
        (item.subDropdown && isDropdownActive(item.subDropdown))
    );

  const renderDropdownItems = (items, level = 1) => {
    return (
      <ul className={`mt-2 space-y-2 ${level === 1 ? "pl-8" : "pl-4"}`}>
        {items.map((item) => (
          <li key={item.name}>
            
            <Link
              href={item.href}
              className={`flex items-center  hover:text-blue-500 dark:hover:text-blue-400 ${
                isActive(item.href) ||
                (item.subDropdown && isDropdownActive(item.subDropdown))
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              scroll={false}>
              <Image
                src={item.icon || "/placeholder.svg"}
                alt={item.name}
                width={24}
                height={24}
                className="mr-3"
              />
              {item.name}
            </Link>
            {item.subDropdown &&
              renderDropdownItems(item.subDropdown, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ul className="space-y-4">
      {menuItems.map((item) => (
        <React.Fragment key={item.name}>
          <li
            onClick={() => handleMenuClick(item.name, item.dropdown)}
            className={`relative cursor-pointer text-gray-700 rounded-lg flex items-center p-2 ${
              (item.dropdown && isDropdownActive(dropdownItems[item.name])) ||
              (!item.dropdown && isActive(item.href))
                ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}>
            <Image
              src={item.icon || "/placeholder.svg"}
              alt={item.name}
              width={24}
              height={24}
              className="mr-3"
            />
            <Link
              href={item.href}
              scroll={false}
              className={`flex-grow ${
                (item.dropdown && isDropdownActive(dropdownItems[item.name])) ||
                (!item.dropdown && isActive(item.href))
                  ? "font-semibold"
                  : ""
              }`}>
              {item.name}
            </Link>
            {item.dropdown && (
              <button
                onClick={() => toggleDropdown(item.name)}
                className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                {openDropdowns[item.name] ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            )}
          </li>

          {item.dropdown &&
            openDropdowns[item.name] &&
            renderDropdownItems(dropdownItems[item.name])}
        </React.Fragment>
      ))}
    </ul>
  );
}
