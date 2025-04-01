"use client";
import Image from "next/image";
// import Link from "next/link";
import { Link } from "@/i18n/routing";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";
// import { encryptUrl } from '../utils/encryptUrl';
import StayUpToDate from "./StayUpToDate";
export default function Footer() {
  // Social media links (with images)
  const socialLinks = [
    {
      src: "/image/institute/footer/Instagram.svg",
      href: "https://www.instagram.com/thehonourenterprise/",
      label: "Instagram",
    },
    {
      src: "/image/institute/footer/Facebook.svg",
      href: "https://www.facebook.com/profile.php?id=61574451387626",
      label: "Facebook",
    },
    {
      src: "/image/institute/footer/linkedin.svg",
      href: "https://www.linkedin.com/company/106391158/admin/dashboard/",
      label: "LinkedIn",
    },
    { 
      src: "/image/institute/footer/youtube.svg", 
      href: "https://www.youtube.com/@HonourHCJ", 
      label: "YouTube" 
    },
  ];

  // Company links
  // const companyLinks = [
  //   { name: "About us", href: "/#about" },
  //   { name: "How it works", href: "/howitworks" },
  //   { name: "Contact us", href: "/contact" },
  //   { name: "FAQ", href: "/faq" },
  // ];

  // Support links
  // const supportLinks = [
  //   { name: "Terms of service", href: "/termsandcondition" },
  //   { name: "Privacy policy", href: "/privacypolicy" },
  //   { name: "Cookies", href: "/cookie" },
  // ];

  const encryptedUrl = "LyNhYm91dA=="; // your encrypted URL

  // const companyLinks = [
  //   { name: "About us", href: `/#about?ref=${encryptedUrl}` },
  //   { name: "How it works", href: `/hwit-wrks6004?ref=${encryptedUrl}` },
  //   { name: "Contact us", href: `/cntct6011?ref=${encryptedUrl}` },
  //   { name: "FAQ", href: `/faq6013?ref=${encryptedUrl}` },
  // ];

  const companyLinks = [
    { name: "About us", href: `/#about` },
    { name: "How it works", href: `/hwit-wrks6004` },
    { name: "Contact us", href: `/cntct6011` },
    { name: "FAQ", href: `/faq6013` },
  ];

  const supportLinks = [
    {
      name: "Terms of service",
      href: `/trmsnd-cndtn6015`,
    },
    { name: "Privacy policy", href: `/prvcy-plcy6014` },
    { name: "Cookies", href: `/cookie6012` },
  ];
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8 flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:justify-between lg:items-start">
        {/* Left Section */}
        <div className="flex flex-col space-y-4 lg:ml-[50px] xl:ml-[100px]">
          {/* <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            HCJ
          </h2> */}
          <Image
            src="/image/logo/footerlogo.png"
            alt="HCJ Footer Logo"
            width={100}
            height={40}
            className="ml-0" // changed from mx-auto
          />

          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                aria-label={link.label}
                className="w-10 h-10"
              >
                <Image
                  src={link.src}
                  alt={link.label}
                  width={24}
                  height={24}
                  className="hover:opacity-80 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                />
              </a>
            ))}
          </div>
          <p className="text-left text-gray-800 dark:text-gray-200">
            <span className="text-lg sm:text-xl md:text-base">
              Copyright © 2025 The Honour Enterprise
            </span>
            <br />
            <span className="text-xs sm:text-lg md:text-sm">
              All rights reserved
            </span>
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col space-y-12 lg:mr-[50px] xl:mr-[100px] md:flex-row md:space-y-0 md:space-x-20">
          {/* Company */}
          <div>
            <h5 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Company
            </h5>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Support
            </h5>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Up to Date */}
          <div>
            <h5 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Stay up to date
            </h5>
            <StayUpToDate />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto mt-8 text-right text-base font-bold px-4 xl:px-[100px] pb-6">
        <span className="text-orange-500">Made with</span>{" "}
        <span className="text-primary">
          <span className="text-primary">L</span>
          <span
            style={{
              background:
                "linear-gradient(to bottom, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)", // India flag colors (top orange, middle white, bottom green)
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            💙
          </span>
          <span className="text-primary">VE</span>
        </span>{" "}
        <span className="text-green-500 dark:text-green-400">in India</span>
      </div>

      {/* Scroll to Top Button */}
      {/* {scrolling && (
       <button onClick={scrollToTop}
       className="fixed bottom-12 right-6 bg-black text-white border-none rounded-full w-10 h-10 flex items-center justify-center text-lg cursor-pointer transition duration-300 hover:bg-gray-800 z-50"
       >
        <i className="fas fa-angle-up"></i>
     </button>

      )} */}
      {scrolling && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-12 right-6 bg-gray-900 dark:bg-gray-700 text-white border-none rounded-full w-10 h-10 flex items-center justify-center text-lg cursor-pointer transition duration-300 hover:bg-gray-800 dark:hover:bg-gray-600 z-50
      ${scrolling ? "animate-bounce" : "opacity-0 scale-0"}`}
        >
          <i className="fas fa-angle-up"></i>
        </button>
      )}
    </footer>
  );
}
