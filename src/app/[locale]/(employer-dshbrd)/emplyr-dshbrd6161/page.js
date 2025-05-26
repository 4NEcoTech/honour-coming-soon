"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSession } from "next-auth/react";
import useInstitution from "@/hooks/useInstitution";
import { useTheme } from "next-themes";
import { Link } from "@/i18n/routing";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const data = [
  { name: "Sat", value: 200 },
  { name: "Sun", value: 400 },
  { name: "Mon", value: 300 },
  { name: "Tue", value: 500 },
  { name: "Wed", value: 300 },
  { name: "Thu", value: 350 },
  { name: "Fri", value: 300 },
];

const cards = [
  {
    title: "Company Profile",
    icon: "/image/employerdashboard/pg/p1.svg",
    href: "/emplyr-dshbrd6161/cmpny-prfl6163",
  },
  {
    title: "Staffs",
    icon: "/image/employerdashboard/pg/p2.svg",
    href: "/emplyr-dshbrd6161/staffs6165",
  },
  {
    title: "Opportunities",
    icon: "/image/employerdashboard/pg/p3.svg",
    href: "/emplyr-dshbrd6161/opprtnty6166",
  },
  // {
  //   title: "Drafts",
  //   icon: "/image/employerdashboard/pg/p4.svg",
  //   href: "/emplyr-dshbrd6161/draft6174",
  // },
  // {
  //   title: "Hiring Stats",
  //   icon: "/image/employerdashboard/pg/p5.svg",
  //   href: "/emplyr-dshbrd6161/hrng-stats6168",
  // },
  // {
  //   title: "Interviews",
  //   icon: "/image/employerdashboard/pg/p6.svg",
  //   href: "/emplyr-dshbrd6161/intrvw6167",
  // },
  // {
  //   title: "Inbox",
  //   icon: "/image/employerdashboard/pg/p7.svg",
  //   href: "/emplyr-dshbrd6161/inbox6169",
  // },
];

export default function Dashboard() {
  const [activeTimeframe, setActiveTimeframe] = useState("Day");
  const { theme } = useTheme();
  const { data: session } = useSession();
  //  console.log(session);
  const companyId = session?.user?.companyId;
  const { institutionData, loading, error } = useInstitution(companyId);

  // Admin Eco Liink Started
  const [isHovered, setIsHovered] = useState();
  const individualId = session?.user?.individualId;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          {/* Left Greeting Block */}
          <div>
            <h1 className="text-3xl font-bold text-gray-500 dark:text-gray-100">
              Hello{" "}
              {session?.user?.first_name
                ? `${session.user.first_name} ${session.user.last_name}`
                : "Administrator"}
              !
            </h1>
            <p className="text-gray-500 dark:text-gray-300">
              Welcome to Your Dashboard!
            </p>
          </div>

          {/* Right Side Block */}
          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
            <p className="text-lg text-gray-700 dark:text-gray-200 font-semibold">
              Company Number:{" "}
              {loading
                ? "Loading..."
                : institutionData?.CD_Company_Num || "Not Available"}
            </p>
            <Link href="/emplyr-dshbrd6161/post-oppartunity6182">
            <Button
              onClick={() => console.log("Upload Opportunity clicked")}
              className="mt-2 px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-primary/90 transition"
            >
              Post Opportunities
            </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Wrap both buttons in a horizontal flex container */}
      <div className="flex flex-wrap items-end gap-4 mt-8 mb-10">
        {/* Button 1 */}
        <Link
          href={`/user-ecolink/${individualId}`}
          target="_blank"
          className="inline-block"
        >
          <motion.button
            className="group relative flex items-center gap-2.5 overflow-hidden rounded-lg bg-white px-6 py-3 text-gray-700 shadow-md transition-all duration-300 hover:text-gray-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 border border-gray-200 sm:px-8 sm:py-3.5 md:min-w-[200px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="View your EcoLink"
          >
            <Share2 className="h-5 w-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 sm:h-5 sm:w-5" />
            <span className="font-semibold text-sm tracking-wide sm:text-base">
              View Your EcoLink
            </span>

            <motion.div
              className="absolute inset-0 -z-10 bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] w-full bg-gray-400"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
        </Link>

        {/* Button 2 */}
        <Link
          href={`/company-ecolink/${companyId}`}
          target="_blank"
          className="inline-block"
        >
          <motion.button
            className="group relative flex items-center gap-2.5 overflow-hidden rounded-lg bg-white px-6 py-3 text-gray-700 shadow-md transition-all duration-300 hover:text-gray-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 border border-gray-200 sm:px-8 sm:py-3.5 md:min-w-[200px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="View institution EcoLink"
          >
            <Share2 className="h-5 w-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 sm:h-5 sm:w-5" />
            <span className="font-semibold text-sm tracking-wide sm:text-base">
              View Company EcoLink
            </span>

            <motion.div
              className="absolute inset-0 -z-10 bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] w-full bg-gray-400"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {cards.slice(0, 6).map((card, index) => (
          <Card
            key={card.title}
            className={`p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-lg transition-shadow ${
              index >= 6 ? "lg:col-span-2" : ""
            }`}
          >
            <Link href={card.href}>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={24}
                    height={24}
                  />
                  <span className="text-gray-600 mt-2 dark:text-gray-300">
                    {card.title}
                  </span>
                </div>
                <button className="w-12 h-12 rounded-full bg-[#BEFB70] flex items-center justify-center">
                  <Image
                    src="/image/employerdashboard/pg/1.svg"
                    alt="Arrow"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </Link>
          </Card>
        ))}
        {/* Last two cards in their own row */}
        <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {cards.slice(6).map((card) => (
            <Card
              key={card.title}
              className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-lg transition-shadow"
            >
              <Link href={card.href}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-col">
                    <Image
                      src={card.icon}
                      alt={card.title}
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-600 mt-2 dark:text-gray-300">
                      {card.title}
                    </span>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-[#BEFB70] flex items-center justify-center">
                    <Image
                      src="/image/employerdashboard/pg/1.svg"
                      alt="Arrow"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <Card className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
            Hiring Status
          </h2>
          <div className="flex flex-wrap gap-2">
            {["1h", "Day", "Week", "Month", "Year"].map((timeframe) => (
              <button
                key={timeframe}
                className={`px-4 py-2 rounded-full ${
                  activeTimeframe === timeframe
                    ? "bg-primary text-white hover:bg-[#77C6FA] hover:text-primary"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                }`}
                onClick={() => setActiveTimeframe(timeframe)}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280" }}
                ticks={[100, 200, 300, 400, 500]}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0EA5E9"
                strokeWidth={2}
                fill="url(#colorValue)"
                dot={false}
                activeDot={{ r: 6, fill: "#0EA5E9" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
