'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function InteractiveSidebar({ menuItems, dropdownItems }) {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const pathname = usePathname();

  const toggleDropdown = (menuName) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  const handleMenuClick = (menuName, isDropdown, href) => {
    if (isDropdown) {
      toggleDropdown(menuName);
    }
  };

  const isActive = (href) => pathname === href;

  const isDropdownActive = (items) =>
    items.some(
      (item) =>
        isActive(item.href) ||
        (item.subDropdown && isDropdownActive(item.subDropdown))
    );

  const renderIcon = (icon, alt) => {
    if (typeof icon === 'string') {
      return (
        <Image
          src={icon}
          alt={alt}
          width={24}
          height={24}
          className="mr-3"
        />
      );
    }
    // If it's a React component (like Lucide icon)
    return React.cloneElement(icon, {
      className: `${icon.props.className || ''} mr-3`
    });
  };

  const renderDropdownItems = (items, level = 1) => {
    return (
      <ul className={`mt-2 space-y-2 ${level === 1 ? 'pl-8' : 'pl-4'}`}>
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`flex items-center hover:text-blue-500 dark:hover:text-blue-400 ${
                isActive(item.href) ||
                (item.subDropdown && isDropdownActive(item.subDropdown))
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              scroll={false}
            >
              {item.icon && renderIcon(item.icon, item.name)}
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
            onClick={() => handleMenuClick(item.name, item.dropdown, item.href)}
            className={`relative cursor-pointer text-gray-700 rounded-lg flex items-center p-2 ${
              (item.dropdown && isDropdownActive(dropdownItems[item.name])) ||
              (!item.dropdown && isActive(item.href))
                ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {item.icon && renderIcon(item.icon, item.name)}
            {item.dropdown ? (
              <span className={`flex-grow ${
                (item.dropdown && isDropdownActive(dropdownItems[item.name])) ||
                (!item.dropdown && isActive(item.href))
                  ? 'font-semibold'
                  : ''
              }`}>
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                scroll={false}
                className={`flex-grow ${
                  (!item.dropdown && isActive(item.href))
                    ? 'font-semibold'
                    : ''
                }`}
              >
                {item.name}
              </Link>
            )}
            {item.dropdown && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(item.name);
                }}
                className="ml-auto text-sm text-gray-500 dark:text-gray-400"
              >
                {openDropdowns[item.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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