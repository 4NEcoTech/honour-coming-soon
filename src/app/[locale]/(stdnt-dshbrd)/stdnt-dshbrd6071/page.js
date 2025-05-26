"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";

const data = [
  { name: "Sat", value: 200 },
  { name: "Sun", value: 400 },
  { name: "Mon", value: 200 },
  { name: "Tue", value: 500 },
  { name: "Wed", value: 300 },
  { name: "Thu", value: 350 },
  { name: "Fri", value: 300 },
];

const timeFilters = [
  { label: "1h", value: "hour" },
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

export default function Page() {
  const [activeFilter, setActiveFilter] = useState("day");

  const { data: session, status } = useSession();
  console.log(session, status);

  const [isHovered, setIsHovered] = useState();
  const individualId = session?.user?.individualId;

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-600 dark:text-gray-300">
          {session?.user?.first_name
            ? `Hello ${session.user.first_name} ${session.user.last_name}!`
            : "Hello Student!"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome to Your Dashboard!
        </p>
        <div className="flex flex-wrap items-end gap-4 mt-8">
          <Link
            href={`/student-ecolink/${individualId}`}
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
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* First Row: Numbered Cards */}
        <Link
          href={"/stdnt-dshbrd6071/my-prfl6072"}
          className="max-w-3xl p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          // onClick={() => handleCardClick('myprofile')}
        >
          <div>
            <Image
              src="/image/institutndashboard/dashboard/myprofile.svg"
              alt="Plus Icon"
              height={20}
              width={20}
              className="w-6 h-6"
            />
            <p className="text-gray-600 dark:text-gray-300">My Profile</p>
          </div>
          <div className="bg-[#BEFB70] rounded-full p-4 ">
            <Image
              src="/image/institutndashboard/dashpage/profile.svg"
              alt="Plus Icon"
              height={20}
              width={20}
              className="w-6 h-6"
            />
          </div>
        </Link>

        <Link
          href={"/stdnt-dshbrd6071/skills6076"}
          className="max-w-3xl p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          // onClick={() => handleCardClick('skills')}
        >
          <div>
            <Image
              src="/image/institutndashboard/dashpage/skills.svg"
              alt="Plus Icon"
              height={20}
              width={20}
              className="w-6 h-6"
            />
            <p className="text-gray-600 dark:text-gray-300">Skills</p>
          </div>
          <div className="bg-[#BEFB70] rounded-full p-4 ">
            <Image
              src="/image/institutndashboard/dashpage/plus.svg"
              alt="Plus Icon"
              height={20}
              width={20}
              className="w-6 h-6"
            />
          </div>
        </Link>

        {/* Second Row: Text with Image */}
        <Link
          href={"/stdnt-dshbrd6071/prjct6077"}
          className="max-w-3xl p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          // onClick={() => handleCardClick('project')}
        >
          <div className=" items-center">
            <div className="text-4xl text-gray-700 mr-4">
              <Image
                src="/image/institutndashboard/dashpage/project.svg"
                alt="Plus Icon"
                height={20}
                width={20}
                className="w-6 h-6"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">Project</p>
          </div>
          <div className="bg-[#BEFB70] rounded-full p-4 ">
            <Image
              src="/image/institutndashboard/dashpage/plus.svg"
              alt="Plus Icon"
              height={20}
              width={20}
              className="w-6 h-6"
            />
          </div>
        </Link>

        <Link
          href={"/stdnt-dshbrd6071/wrkexprnc6078"}
          className="max-w-3xl p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          // onClick={() => handleCardClick('workexprnce')}
        >
          <div className=" items-center">
            <div className="text-4xl text-gray-700 mr-4">
              <Image
                src="/image/institutndashboard/dashpage/exp.svg"
                alt="Plus Icon"
                height={20}
                width={20}
                className="w-6 h-6"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">Work Experience</p>
          </div>
          <div className="bg-[#BEFB70] rounded-full p-4">
            <Image
              src="/image/institutndashboard/dashpage/plus.svg"
              alt="Plus Icon"
              height={20}
              width={20}
              className="w-6 h-6"
            />
          </div>
        </Link>
        <Link
          href={"/stdnt-dshbrd6071/add-edctn6081"}
          className="max-w-3xl p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <div className=" items-center">
            <div className="text-4xl text-gray-700 mr-4">
              <Image
                src="/image/institutndashboard/dashpage/project.svg"
                alt="Plus Icon"
                height={20}
                width={20}
                className="w-6 h-6"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">Education</p>
          </div>
          <div className="bg-[#BEFB70] rounded-full p-4 ">
            <Image
              src="/image/institutndashboard/dashpage/plus.svg"
              alt="Plus Icon"
              height={20}
              width={20}
              className="w-6 h-6"
            />
          </div>
        </Link>

        <Link
          href={"/stdnt-dshbrd6071/add-vlntrng6082"}
          className="max-w-3xl p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          // onClick={() => handleCardClick('accntsttng')}
        >
          <div className="items-center">
            <div className="text-4xl text-gray-700 mr-4">
              <Image
                src="/image/institutndashboard/dashboard/setting.svg"
                alt="Plus Icon"
                height={20}
                width={20}
                className="w-6 h-6"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">Volunteering</p>
          </div>
          <div className="bg-[#BEFB70] rounded-full p-4">
            <Image
              src="/image/institutndashboard/dashpage/setting.svg"
              alt="Plus Icon"
              height={20}
              width={20}
              className="w-6 h-6"
            />
          </div>
        </Link>

        <Link
          href={"/stdnt-dshbrd6071/resume6075"}
          className="max-w-3xl p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          // onClick={() => handleCardClick('resume')}
        >
          <div>
            <Image
              src="/image/institutndashboard/dashpage/resume.svg"
              alt="Plus Icon"
              className="w-6 h-6"
              height={20}
              width={20}
            />
            <p className="text-gray-600 dark:text-gray-300">Resume</p>
          </div>
          <div className="bg-[#BEFB70] rounded-full p-4 ">
            <Image
              src="/image/institutndashboard/dashpage/plus.svg"
              alt="Plus Icon"
              height={20}
              width={20}
              className="w-6 h-6"
            />
          </div>
        </Link>

        <Link
          href={"/stdnt-dshbrd6071/accnt-sttng6074"}
          className="max-w-3xl p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          // onClick={() => handleCardClick('accntsttng')}
        >
          <div className="items-center">
            <div className="text-4xl text-gray-700 mr-4">
              <Image
                src="/image/institutndashboard/dashboard/setting.svg"
                alt="Plus Icon"
                height={20}
                width={20}
                className="w-6 h-6"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">Account Setting</p>
          </div>
          <div className="bg-[#BEFB70] rounded-full p-4">
            <Image
              src="/image/institutndashboard/dashpage/setting.svg"
              alt="Plus Icon"
              height={20}
              width={20}
              className="w-6 h-6"
            />
          </div>
        </Link>
      </div>

      {/* Activity Chart */}
      {/* <Card className="mt-10 p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Students adding activities</h2>
          <div className="flex gap-2 sm:gap-4">
            {timeFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "ghost"}
                className={`rounded-full px-3 py-2 ${
                  activeFilter === filter.value
                    ? "bg-primary text-white hover:bg-[#77C6FA] hover:text-primary"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                }`}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

  
          <div className="h-[300px]">
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
        </div>
      </Card> */}
    </div>
  );
}
