// 'use client';
// import { Button } from '@/components/ui/button';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination';
// import { Link } from '@/i18n/routing';
// import { useSession } from 'next-auth/react';
// import Image from 'next/image';

// const Page = () => {
//   const { data: session, status } = useSession();
//   return (
//     <div className="bg-background dark:bg-gray-900 min-h-screen pb-6">
//       {/* First Section */}
//       <div className="relative">
//         <Image
//           src="/image/institute/EducationalInstitute/background1.png"
//           alt="Background"
//           width={500}
//           height={500}
//           className="w-full h-[500px] object-cover brightness-90 dark:brightness-75"
//         />
//         <div className="container mx-auto absolute inset-0 flex flex-col items-start justify-center text-white px-6 py-8">
//           {status === 'authenticated' ? (
//             <>
//               <h1 className="text-3xl md:text-4xl lg:text-6xl text-left lg:ml-20  lg:mt-8">
//                 Welcome to our platform
//               </h1>
//               <p className="text-lg md:text-xl mt-2 mb-8 text-left lg:mt-6 lg:ml-20">
//                 250+ Educational Institutions are growing <br /> with HCJ.{' '}
//                 <span className="text-green-500 dark:text-green-400 font-bold">
//                   Is yours next?
//                 </span>
//               </p>
//               <div className="relative flex items-center lg:ml-20 lg:mt-8 w-full max-w-2xl">
//                 <input
//                   type="text"
//                   placeholder="Search by keywords"
//                   className="flex-grow pl-6 pr-16 py-4 text-lg rounded-full bg-transparent border-2 border-white placeholder-white focus:ring focus:ring-white text-white"
//                 />
//                 <Image
//                   src="/image/institute/EducationalInstitute/filter.svg"
//                   alt="Search Icon"
//                   width={80}
//                   height={80}
//                   className="absolute right-6 w-20 h-20"
//                 />
//               </div>
//             </>
//           ) : (
//             <>
//               <h1 className="text-3xl md:text-4xl lg:text-6xl text-left lg:ml-20 lg:mt-8">
//                 Register your College on HCJ
//               </h1>
//               <p className="text-lg md:text-xl mt-2 text-left lg:mt-6 lg:ml-20">
//                 Give your students opportunities to excel in their career.
//               </p>
//               <Link href="/rgstrtn6021">
//                 <Button className="mt-4 px-6 py-3 bg-primary dark:hover:bg-primary/80 text-white rounded-lg lg:ml-20 hover:bg-[#77C6FA] hover:text-primary">
//                   Register your institution with HCJ
//                 </Button>
//               </Link>
//             </>
//           )}
//         </div>
//       </div>

//       {status === 'authenticated' ? (
//         <>
//           {/* Logged-in content */}
//           <div className="py-12 px-4 md:px-8 lg:px-16">
//             <h2 className="text-left md:text-center text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
//               Colleges on HCJ
//             </h2>
//             <p className="text-left dark:text-emerald-400 md:text-center text-3xl md:text-5xl text-green-500 mt-2">
//               Institutes Registered{' '}
//               <span className="text-gray-800 dark:text-gray-200 text-3xl md:text-5xl">
//                 On HCJ
//               </span>
//             </p>
//             <p className="text-left md:text-center text-gray-800 dark:text-gray-200 mt-1">
//               Every great institution deserves to shine. HCJ provides the tools,
//               network, and
//               <br /> visibility to help your institution and students succeed.
//             </p>
//             {/* Grid Section */}
//             <div className="container  mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
//               {Array.from({ length: 12 }).map((_, index) => (
//                 <div
//                   key={index}
//                   className="bg-transparent shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-gray-200 dark:border-gray-700">
//                   <Image
//                     src={`/image/institute/EducationalInstitute/${
//                       index + 1
//                     }.svg`}
//                     alt="Institute"
//                     width={200}
//                     height={200}
//                     className="w-full h-[150px] object-cover"
//                   />
//                   <div className="p-4">
//                     <h3 className="text-lg font-bold">IIT Kanpur</h3>
//                     <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
//                       Kanpur UP
//                     </p>
//                     <p className="text-sm text-gray-800 dark:text-gray-200">
//                       256 Students registered
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           {/* Pagination Section */}
//           <div className="flex justify-center mt-8">
//             <Pagination>
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious href="#" />
//                 </PaginationItem>
//                 {[1, 2, 3, '...'].map((page, idx) => (
//                   <PaginationItem key={idx}>
//                     <PaginationLink href="#" isActive={page === 2}>
//                       {page}
//                     </PaginationLink>
//                   </PaginationItem>
//                 ))}
//                 <PaginationItem>
//                   <PaginationNext href="#" />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         </>
//       ) : (
//         <>
//           {/* Not logged-in content */}
//           {/* Second Section */}
//           <div className="container mx-auto px-6 py-12">
//             <div className="flex flex-col md:flex-row items-start justify-between space-y-6 md:space-y-0">
//               {/* Left Aligned Text */}
//               <div className="flex-1 text-left">
//                 <h2 className="text-2xl md:text-5xl font-medium">
//                   <span className="text-green-500 dark:text-emerald-400">
//                     Redefining
//                   </span>{' '}
//                   Education and Employment with HCJ
//                 </h2>
//               </div>

//               {/* Right Aligned Text */}
//               <div className="flex-1 text-left md:ml-8">
//                 <p className="text-gray-600 mt-4 md:mt-0 text-lg md:text-xl">
//                   HCJ bridges the gap between education and employment,
//                   providing institutions with a comprehensive platform to
//                   showcase their strengths, connect with top recruiters, and
//                   empower students to achieve their dreams. Join 250+
//                   institutions already making an impact with HCJ.
//                 </p>
//                 <p className="text-black-600 font-semibold mt-4 md:mt-6 text-lg md:text-xl">
//                   Be a part of a platform that is redefining career
//                   opportunities for students and institutions alike.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Third Section */}
//           <div className="px-6 py-12 flex justify-center">
//             <div className="w-full max-w-5xl">
//               <h2 className="text-2xl font-bold md:text-3xl text-left mb-8 md:text-center">
//                 <span className="text-green-500 dark:text-emerald-400">
//                   Benefits
//                 </span>{' '}
//                 of registering on HCJ
//               </h2>
//               <div className="grid gap-1 gap-y-8 mt-8 grid-cols-1 md:grid-cols-2">
//                 {/* First Benefit */}
//                 <div className="flex flex-col justify-center m-0 p-0">
//                   <h3 className="text-lg font-semibold text-primary m-0 p-0">
//                     Import all your students
//                   </h3>
//                   <h4 className="text-gray-600 m-0 p-0 text-sm md:text-base mb-4 md:mb-6">
//                     Easily onboard your students onto HCJ using bulk imports.
//                     Save time while keeping profiles up-to-date for seamless
//                     engagement.
//                   </h4>
//                 </div>
//                 <div className="m-0 p-0">
//                   <Image
//                     src="/image/institute/EducationalInstitute/notloggedin/Frame1.svg"
//                     alt="Import Students"
//                     width={200}
//                     height={200}
//                     className="w-full max-w-xs max-h-48 object-contain"
//                   />
//                 </div>

//                 {/* Second Benefit */}
//                 <div className="flex flex-end justify-end m-0 p-0">
//                   <Image
//                     src="/image/institute/EducationalInstitute/notloggedin/Frame2.svg"
//                     alt="Student Management"
//                     width={200}
//                     height={200}
//                     className="w-full max-w-xs max-h-48 object-contain flex-end"
//                   />
//                 </div>
//                 <div className="flex flex-col justify-center m-0 p-0">
//                   <h3 className="text-lg font-semibold text-primary m-0 p-0">
//                     Student Management
//                   </h3>
//                   <h4 className="text-gray-600 m-0 p-0 text-sm md:text-base mb-4 md:mb-6">
//                     Manage student profiles, track their career progress,
//                     identify growth areas, and provide personalized support to
//                     help students achieve their career goals. Simplify
//                     administration with organized, easy-to-navigate dashboards
//                     that keep all essential data at your fingertips.
//                   </h4>
//                 </div>

//                 {/* Third Benefit */}
//                 <div className="flex flex-col justify-center m-0 p-0">
//                   <h3 className="text-lg font-semibold text-primary m-0 p-0">
//                     Opportunities for your students
//                   </h3>
//                   <h4 className="text-gray-600 m-0 p-0 text-sm md:text-base mb-4 md:mb-6">
//                     <span className="text-green-500 block dark:text-emerald-400">
//                       Internships, projects, jobs
//                     </span>
//                     Enable your students to connect with top employers at
//                     India&apos;s largest job fair organized by HCJ. Give them a
//                     platform to showcase their skills and secure meaningful
//                     career opportunities.
//                   </h4>
//                 </div>
//                 <div className="m-0 p-0">
//                   <Image
//                     src="/image/institute/EducationalInstitute/notloggedin/Frame3.svg"
//                     alt="Job Opportunities"
//                     width={200}
//                     height={200}
//                     className="w-full max-w-xs max-h-48 object-contain"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Last Section */}
//           <div className="px-6 py-12 container mx-auto">
//             <h2 className="text-2xl text-left sm:text-left md:text-center lg:text-center font-bold md:text-3xl">
//               <span className="text-green-500 dark:text-emerald-400">
//                 250+ Institutions
//               </span>{' '}
//               are already on HCJ
//             </h2>

//             <div className="grid gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-4">
//               <div className="flex gap-4 sm:flex-row  sm:space-x-4 sm:text-left lg:flex lg:flex-col">
//                 <Image
//                   src="/image/institute/EducationalInstitute/notloggedin/1.svg"
//                   alt="IIT Kanpur"
//                   width={100}
//                   height={100}
//                   className="w-24 h-24 lg:w-72 lg:h-72  sm:w-auto sm:h-auto rounded-lg sm:mr-4" // Added margin on mobile for gap
//                 />
//                 <div className="text-left mt-2 sm:mt-0">
//                   {' '}

//                   <h3 className="text-lg font-bold">IIT Kanpur</h3>
//                   <p className="text-gray-600">Kanpur, UP</p>
//                   <p className="text-gray-600">256 Students registered</p>
//                 </div>
//               </div>
//               <div className="flex gap-4 sm:flex-row  sm:space-x-4 sm:text-left lg:flex lg:flex-col">
//                 <Image
//                   src="/image/institute/EducationalInstitute/notloggedin/2.svg"
//                   alt="ISB Delhi"
//                   width={100}
//                   height={100}
//                   className="w-24 h-24 lg:w-72 lg:h-72 sm:w-auto sm:h-auto rounded-lg sm:mr-4" // Added margin on mobile for gap
//                 />
//                 <div className="text-left mt-2 sm:mt-0">
//                   {' '}

//                   <h3 className="text-lg font-bold">ISB Delhi</h3>
//                   <p className="text-gray-600">Delhi</p>
//                   <p className="text-gray-600">312 Students registered</p>
//                 </div>
//               </div>
//               <div className="flex gap-4 sm:flex-row  sm:space-x-4 sm:text-left lg:flex lg:flex-col">
//                 <Image
//                   src="/image/institute/EducationalInstitute/notloggedin/3.svg"
//                   alt="IIT Guwahati"
//                   width={100}
//                   height={100}
//                   className="w-24 h-24 sm:w-auto lg:w-72 lg:h-72  sm:h-auto rounded-lg sm:mr-4" // Added margin on mobile for gap
//                 />
//                 <div className="text-left  mt-2 sm:mt-0">
//                   {' '}

//                   <h3 className="text-lg font-bold">IIT Guwahati</h3>
//                   <p className="text-gray-600">Guwahati, Assam</p>
//                   <p className="text-gray-600">412 Students registered</p>
//                 </div>
//               </div>
//               <div className="flex gap-4 sm:flex-row  sm:space-x-4 sm:text-left lg:flex lg:flex-col">
//                 <Image
//                   src="/image/institute/EducationalInstitute/notloggedin/4.svg"
//                   alt="IIM Lucknow"
//                   width={100}
//                   height={100}
//                   className="w-24 h-24 sm:w-auto sm:h-auto lg:w-72 lg:h-72 rounded-lg sm:mr-4" // Increased size on large screens
//                 />
//                 <div className="text-left  mt-2 sm:mt-0">
//                   <h3 className="text-lg font-bold">IIM Lucknow</h3>
//                   <p className="text-gray-600">Lucknow, UP</p>
//                   <p className="text-gray-600">156 Students registered</p>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
//               <Link
//                 href="/hwit-wrks6004"
//                 className="px-6 py-3 bg-background dark:bg-gray-800 text-primary border border-primary rounded-lg w-full md:w-auto hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700">
//                 See How it Works
//               </Link>
//               <Link
//                 href="/rgstrtn6021"
//                 className="px-6 py-3 bg-primary text-primary-foreground rounded-lg w-full md:w-auto hover:bg-primary/90 dark:hover:bg-primary/80">
//                 Register your institution with HCJ
//               </Link>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Page;

"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePagination } from "@/hooks/use-pagination";

const Page = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  
  const {
    items: institutions,
    paginationInfo,
    isLoading,
    searchText,
    setSearchText,
    goToPage,
    setAdditionalFilters,
    refreshData,
  } = usePagination('/api/hcj/v1/hcjArET60021fetchVerifyInstitution', {
    pageSize: 20, // Show 20 institutions per page
    batchSize: 100,
    searchDelay: 400,
  });

  // For non-logged in users, set dummy data
  const dummyData = [
    {
      _id: "67ffe25dd9d2fc92dd7b396f",
      CD_Company_Name: "CHAUDHRY MUKHTAR SINGH GOVT. GIRLS POLYTECNIC",
      CD_Company_Logo: null,
      CD_Company_Email: "omkarwalawalkar23@gmail.com",
      CD_Company_Website: "",
      CD_Company_Num: "20000000233",
      CD_Company_About: "98374598739835",
      CD_Company_Status: "01",
      verifiedStudentCount: 0,
    },
    {
      _id: "67ffdcffd9d2fc92dd7b3930",
      CD_Company_Name: "CHAUDHRY MUKHTAR SINGH GOVT. GIRLS POLYTECNIC",
      CD_Company_Logo:
        "https://drive.google.com/uc?id=1MQJ7mgiDKDrgxdwG9nvq9LaKr1KJsLdQ",
      CD_Company_Email: "aditya.4neco@gmail.com",
      CD_Company_Website: "https://yyy.com",
      CD_Company_Num: "20000000230",
      CD_Company_About: "iyutiuyiewr",
      CD_Company_Status: "01",
      verifiedStudentCount: 0,
    },
    {
      _id: "67fdef3c427ab4a32b32c337",
      CD_Company_Name: "CHAUDHRY MUKHTAR SINGH GOVT. GIRLS POLYTECNIC",
      CD_Company_Logo:
        "https://drive.google.com/uc?id=1vnC7mxYp0s5TAoGJ4p3FEoqfPRU6uS7s",
      CD_Company_Email: "adityakas1907@gmail.com",
      CD_Company_Website: "http://yyy.com",
      CD_Company_Num: "20000000213",
      CD_Company_About: "987345789938",
      CD_Company_Status: "01",
      verifiedStudentCount: 0,
    },
    {
      _id: "67fdef3c427ab4a32b32c338",
      CD_Company_Name: "CHAUDHRY MUKHTAR SINGH GOVT. GIRLS POLYTECNIC",
      CD_Company_Logo:
        "https://drive.google.com/uc?id=1vnC7mxYp0s5TAoGJ4p3FEoqfPRU6uS7s",
      CD_Company_Email: "adityakas1907@gmail.com",
      CD_Company_Website: "http://yyy.com",
      CD_Company_Num: "20000000236",
      CD_Company_About: "987345789938",
      CD_Company_Status: "01",
      verifiedStudentCount: 0,
    },
  ];

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (status === "authenticated") {
      refreshData();
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;

    // Always show first page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink
          href="#"
          isActive={paginationInfo.currentPage === 1}
          onClick={(e) => {
            e.preventDefault();
            goToPage(1);
          }}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Add ellipsis if needed
    if (paginationInfo.currentPage > maxVisiblePages) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <span className="px-4">...</span>
        </PaginationItem>
      );
    }

    // Add pages around current page
    for (
      let i = Math.max(2, paginationInfo.currentPage - 1);
      i <= Math.min(paginationInfo.totalPages - 1, paginationInfo.currentPage + 1);
      i++
    ) {
      if (i <= 1 || i >= paginationInfo.totalPages) continue;

      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            href="#"
            isActive={paginationInfo.currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              goToPage(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis if needed
    if (
      paginationInfo.currentPage < paginationInfo.totalPages - maxVisiblePages + 1 &&
      paginationInfo.totalPages > maxVisiblePages
    ) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <span className="px-4">...</span>
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (paginationInfo.totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${paginationInfo.totalPages}`}>
          <PaginationLink
            href="#"
            isActive={paginationInfo.currentPage === paginationInfo.totalPages}
            onClick={(e) => {
              e.preventDefault();
              goToPage(paginationInfo.totalPages);
            }}
          >
            {paginationInfo.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-transparent shadow-xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="w-full h-[150px] bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );

  // Determine which data to display
  const displayData = status === "authenticated" ? institutions : dummyData;
  const displayPagination = status === "authenticated" ? paginationInfo : {
    currentPage: 1,
    totalPages: 1,
    total: dummyData.length,
    batchNumber: 1,
  };

  return (
    <div className="bg-background dark:bg-gray-900 min-h-screen pb-6">
      {/* First Section */}
      <div className="relative">
        <Image
          src="/image/institute/EducationalInstitute/background1.png"
          alt="Background"
          width={500}
          height={500}
          className="w-full h-[500px] object-cover brightness-90 dark:brightness-75"
        />
        <div className="container mx-auto absolute inset-0 flex flex-col items-start justify-center text-white px-6 py-8">
          {status === "authenticated" ? (
            <>
              <h1 className="text-3xl md:text-4xl lg:text-6xl text-left lg:ml-20 lg:mt-8">
                Welcome to our platform
              </h1>
              <p className="text-lg md:text-xl mt-2 mb-8 text-left lg:mt-6 lg:ml-20">
                250+ Educational Institutions are growing <br /> with HCJ.{" "}
                <span className="text-green-500 dark:text-green-400 font-bold">
                  Is yours next?
                </span>
              </p>
              <form
                onSubmit={handleSearch}
                className="relative flex items-center lg:ml-20 lg:mt-8 w-full max-w-2xl"
              >
                <input
                  type="text"
                  placeholder="Search by keywords"
                  className="flex-grow pl-6 pr-16 py-4 text-lg rounded-full bg-transparent border-2 border-white placeholder-white focus:ring focus:ring-white text-white"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <button type="submit" className="absolute right-6">
                  <Image
                    src="/image/institute/EducationalInstitute/filter.svg"
                    alt="Search Icon"
                    width={80}
                    height={80}
                    className="w-20 h-20"
                  />
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl lg:text-6xl text-left lg:ml-20 lg:mt-8">
                Register your College on HCJ
              </h1>
              <p className="text-lg md:text-xl mt-2 text-left lg:mt-6 lg:ml-20">
                Give your students opportunities to excel in their career.
              </p>
              <Link href="/rgstrtn6021">
                <Button className="mt-4 px-6 py-3 bg-primary dark:hover:bg-primary/80 text-white rounded-lg lg:ml-20 hover:bg-[#77C6FA] hover:text-primary">
                  Register your institution with HCJ
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {status === "authenticated" ? (
        <>
          {/* Logged-in content */}
          <div className="py-12 px-4 md:px-8 lg:px-16">
            <h2 className="text-left md:text-center text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
              Colleges on HCJ
            </h2>
            <p className="text-left dark:text-emerald-400 md:text-center text-3xl md:text-5xl text-green-500 mt-2">
              Institutes Registered{" "}
              <span className="text-gray-800 dark:text-gray-200 text-3xl md:text-5xl">
                On HCJ
              </span>
            </p>
            <p className="text-left md:text-center text-gray-800 dark:text-gray-200 mt-1">
              Every great institution deserves to shine. HCJ provides the tools,
              network, and
              <br /> visibility to help your institution and students succeed.
            </p>

            {isLoading ? (
              <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {Array.from({ length: 20 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : (
              <>
                {/* Grid Section */}
                {displayData.length > 0 ? (
                  <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                    {displayData.map((institution, index) => (
                      <Link
                        key={institution._id || index}
                        href={`/institution/${institution.CD_Individual_Id}`}
                        className="bg-transparent shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-gray-200 dark:border-gray-700 block"
                      >
                        {institution.CD_Company_Logo ? (
                          <Image
                            src={
                              institution.CD_Company_Logo || "/placeholder.svg"
                            }
                            alt={institution.CD_Company_Name}
                            width={200}
                            height={200}
                            className="w-full h-[150px] object-cover"
                          />
                        ) : (
                          <Image
                            src={`/image/institute/EducationalInstitute/${
                              (index % 12) + 1
                            }.svg`}
                            alt="Institute"
                            width={200}
                            height={200}
                            className="w-full h-[150px] object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-bold">
                            {institution.CD_Company_Name}
                          </h3>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {institution.CD_Company_Website ||
                              "Location not available"}
                          </p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            {institution.verifiedStudentCount || 0} Students
                            registered
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    No institutions found. Try a different search term.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination Section */}
          {displayData.length > 0 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (displayPagination.currentPage > 1) {
                          goToPage(displayPagination.currentPage - 1);
                        }
                      }}
                      className={
                        displayPagination.currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (displayPagination.currentPage < displayPagination.totalPages) {
                          goToPage(displayPagination.currentPage + 1);
                        }
                      }}
                      className={
                        displayPagination.currentPage >= displayPagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <>
        {/* Not logged-in content */}
        {/* Second Section */}
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start justify-between space-y-6 md:space-y-0">
            {/* Left Aligned Text */}
            <div className="flex-1 text-left">
              <h2 className="text-2xl md:text-5xl font-medium">
                <span className="text-green-500 dark:text-emerald-400">
                  Redefining
                </span>{" "}
                Education and Employment with HCJ
              </h2>
            </div>

            {/* Right Aligned Text */}
            <div className="flex-1 text-left md:ml-8">
              <p className="text-gray-600 mt-4 md:mt-0 text-lg md:text-xl">
                HCJ bridges the gap between education and employment,
                providing institutions with a comprehensive platform to
                showcase their strengths, connect with top recruiters, and
                empower students to achieve their dreams. Join 250+
                institutions already making an impact with HCJ.
              </p>
              <p className="text-black-600 font-semibold mt-4 md:mt-6 text-lg md:text-xl">
                Be a part of a platform that is redefining career
                opportunities for students and institutions alike.
              </p>
            </div>
          </div>
        </div>

        {/* Third Section */}
        <div className="px-6 py-12 flex justify-center">
          <div className="w-full max-w-5xl">
            <h2 className="text-2xl font-bold md:text-3xl text-left mb-8 md:text-center">
              <span className="text-green-500 dark:text-emerald-400">
                Benefits
              </span>{" "}
              of registering on HCJ
            </h2>
            <div className="grid gap-1 gap-y-8 mt-8 grid-cols-1 md:grid-cols-2">
              {/* First Benefit */}
              <div className="flex flex-col justify-center m-0 p-0">
                <h3 className="text-lg font-semibold text-primary m-0 p-0">
                  Import all your students
                </h3>
                <h4 className="text-gray-600 m-0 p-0 text-sm md:text-base mb-4 md:mb-6">
                  Easily onboard your students onto HCJ using bulk imports.
                  Save time while keeping profiles up-to-date for seamless
                  engagement.
                </h4>
              </div>
              <div className="m-0 p-0">
                <Image
                  src="/image/institute/EducationalInstitute/notloggedin/Frame1.svg"
                  alt="Import Students"
                  width={200}
                  height={200}
                  className="w-full max-w-xs max-h-48 object-contain"
                />
              </div>

              {/* Second Benefit */}
              <div className="flex flex-end justify-end m-0 p-0">
                <Image
                  src="/image/institute/EducationalInstitute/notloggedin/Frame2.svg"
                  alt="Student Management"
                  width={200}
                  height={200}
                  className="w-full max-w-xs max-h-48 object-contain flex-end"
                />
              </div>
              <div className="flex flex-col justify-center m-0 p-0">
                <h3 className="text-lg font-semibold text-primary m-0 p-0">
                  Student Management
                </h3>
                <h4 className="text-gray-600 m-0 p-0 text-sm md:text-base mb-4 md:mb-6">
                  Manage student profiles, track their career progress,
                  identify growth areas, and provide personalized support to
                  help students achieve their career goals. Simplify
                  administration with organized, easy-to-navigate dashboards
                  that keep all essential data at your fingertips.
                </h4>
              </div>

              {/* Third Benefit */}
              <div className="flex flex-col justify-center m-0 p-0">
                <h3 className="text-lg font-semibold text-primary m-0 p-0">
                  Opportunities for your students
                </h3>
                <h4 className="text-gray-600 m-0 p-0 text-sm md:text-base mb-4 md:mb-6">
                  <span className="text-green-500 block dark:text-emerald-400">
                    Internships, projects, jobs
                  </span>
                  Enable your students to connect with top employers at
                  India&apos;s largest job fair organized by HCJ. Give them a
                  platform to showcase their skills and secure meaningful
                  career opportunities.
                </h4>
              </div>
              <div className="m-0 p-0">
                <Image
                  src="/image/institute/EducationalInstitute/notloggedin/Frame3.svg"
                  alt="Job Opportunities"
                  width={200}
                  height={200}
                  className="w-full max-w-xs max-h-48 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Last Section - Featured Institutions (using original images) */}
        <div className="px-6 py-12 container mx-auto">
          <h2 className="text-2xl text-left sm:text-left md:text-center lg:text-center font-bold md:text-3xl">
            <span className="text-green-500 dark:text-emerald-400">
              250+ Institutions
            </span>{" "}
            are already on HCJ
          </h2>

          <div className="grid gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Institution 1 */}
            <div className="flex gap-4 sm:flex-row sm:space-x-4 sm:text-left lg:flex lg:flex-col">
              <Image
                src="/image/institute/EducationalInstitute/notloggedin/1.svg"
                alt="IIT Kanpur"
                width={100}
                height={100}
                className="w-24 h-24 lg:w-72 lg:h-72 sm:w-auto sm:h-auto rounded-lg sm:mr-4"
              />
              <div className="text-left mt-2 sm:mt-0">
                <h3 className="text-lg font-bold">IIT Kanpur</h3>
                <p className="text-gray-600">Kanpur, UP</p>
                <p className="text-gray-600">256 Students registered</p>
              </div>
            </div>

            {/* Institution 2 */}
            <div className="flex gap-4 sm:flex-row sm:space-x-4 sm:text-left lg:flex lg:flex-col">
              <Image
                src="/image/institute/EducationalInstitute/notloggedin/2.svg"
                alt="ISB Delhi"
                width={100}
                height={100}
                className="w-24 h-24 lg:w-72 lg:h-72 sm:w-auto sm:h-auto rounded-lg sm:mr-4"
              />
              <div className="text-left mt-2 sm:mt-0">
                <h3 className="text-lg font-bold">ISB Delhi</h3>
                <p className="text-gray-600">Delhi</p>
                <p className="text-gray-600">312 Students registered</p>
              </div>
            </div>

            {/* Institution 3 */}
            <div className="flex gap-4 sm:flex-row sm:space-x-4 sm:text-left lg:flex lg:flex-col">
              <Image
                src="/image/institute/EducationalInstitute/notloggedin/3.svg"
                alt="IIT Guwahati"
                width={100}
                height={100}
                className="w-24 h-24 sm:w-auto lg:w-72 lg:h-72 sm:h-auto rounded-lg sm:mr-4"
              />
              <div className="text-left mt-2 sm:mt-0">
                <h3 className="text-lg font-bold">IIT Guwahati</h3>
                <p className="text-gray-600">Guwahati, Assam</p>
                <p className="text-gray-600">412 Students registered</p>
              </div>
            </div>

            {/* Institution 4 */}
            <div className="flex gap-4 sm:flex-row sm:space-x-4 sm:text-left lg:flex lg:flex-col">
              <Image
                src="/image/institute/EducationalInstitute/notloggedin/4.svg"
                alt="IIM Lucknow"
                width={100}
                height={100}
                className="w-24 h-24 sm:w-auto sm:h-auto lg:w-72 lg:h-72 rounded-lg sm:mr-4"
              />
              <div className="text-left mt-2 sm:mt-0">
                <h3 className="text-lg font-bold">IIM Lucknow</h3>
                <p className="text-gray-600">Lucknow, UP</p>
                <p className="text-gray-600">156 Students registered</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link
              href="/hwit-wrks6004"
              className="px-6 py-3 bg-background dark:bg-gray-800 text-primary border border-primary rounded-lg w-full md:w-auto hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700"
            >
              See How it Works
            </Link>
            <Link
              href="/rgstrtn6021"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg w-full md:w-auto hover:bg-primary/90 dark:hover:bg-primary/80"
            >
              Register your institution with HCJ
            </Link>
          </div>
        </div>
      </>
      )}
    </div>
  );
};

export default Page;