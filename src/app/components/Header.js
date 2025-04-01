// 'use client';

// import LangSwitcher from '@/components/lang-switcher';
// import { ModeToggle } from '@/components/theme-button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Menu, X } from 'lucide-react';
// import { signOut, useSession } from 'next-auth/react';

// import { useSearchParams } from 'next/navigation';

// import { Link, usePathname } from '@/i18n/routing';
// import { useEffect, useState } from 'react';

// // Define role-based menu items
// const ROLE_BASED_MENU_ITEMS = {
//   student: [
//     { label: 'Dashboard', href: '/dashboard' },
//     { label: 'My Profile', href: '/profile' },
//     { label: 'Message', href: '/messages' },
//     { label: 'Account Setting', href: '/settings' },
//   ],
//   institution: [
//     { label: 'Dashboard', href: '/dashboard' },
//     { label: 'My Profile', href: '/profile' },
//     { label: 'Institution Profile', href: '/institution-profile' },
//     { label: 'Registered Students', href: '/registered-students' },
//     { label: 'Add Students', href: '/add-students' },
//     { label: 'Student Bulk Import', href: '/bulk-import' },
//     { label: 'Staff', href: '/staff' },
//     { label: 'Add Team', href: '/add-team' },
//     { label: 'Message', href: '/messages' },
//     { label: 'Account Setting', href: '/settings' },
//   ],
//   superAdmin: [
//     { label: 'Dashboard', href: '/dashboard' },
//     { label: 'My Profile', href: '/profile' },
//     { label: 'Message', href: '/messages' },
//     { label: 'Account Setting', href: '/settings' },
//   ],
//   employer: [
//     { label: 'Dashboard', href: '/dashboard' },
//     { label: 'My Profile', href: '/profile' },
//     { label: 'Message', href: '/messages' },
//     { label: 'Account Setting', href: '/settings' },
//   ],
// };

// export default function Header() {
//   // console.log('params', params.locale);
//   const { data: session } = useSession();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const pathname = usePathname();
//   // const { sendGTMEvent } = useGTM();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const url = `${pathname}${searchParams.toString()}`;
//     // This will send a pageview to Google Analytics
//     window.gtag('config', 'G-WY0986PD4K', {
//       page_path: url,
//     });
//   }, [pathname, searchParams]);

//   const handleLoginClick = () => {
//     // This will send a custom event to Google Analytics
//     window.gtag('event', 'login_click', {
//       event_category: 'engagement',
//       event_label: 'Login test button',
//     });
//   };

//   // Close menu when resizing to larger screen
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768 && isMenuOpen) {
//         setIsMenuOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [isMenuOpen]);

//   // Prevent scrolling when menu is open
//   useEffect(() => {
//     if (isMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isMenuOpen]);

//   // Get user's initials for avatar fallback
//   const getUserInitials = (name) => {
//     if (!name) return 'U';
//     return name
//       .split(' ')
//       .map((n) => n[0])
//       .join('')
//       .toUpperCase();
//   };

//   return (
//     <header className="w-full bg-background border-b border-border z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center md:hidden">
//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="p-2 mr-2 text-foreground hover:bg-accent rounded-md"
//               aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
//               {isMenuOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </button>

//             {/* Logo - left aligned on mobile */}
//             <Link href="/" className="text-xl font-bold text-foreground">
//               HCJ
//             </Link>
//           </div>

//           {/* Desktop Logo */}
//           <div className="hidden md:block">
//             <Link href="/" className="text-xl font-bold text-foreground">
//               HCJ
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex space-x-4">
//             <Link
//               href="/"
//               className={`${
//                 pathname === '/' ? 'text-primary' : 'text-muted-foreground'
//               } hover:text-primary transition-colors`}>
//               Home
//             </Link>

//             <Link
//               href="/eductnl-inst6002"
//               className={`${
//                 pathname === '/eductnl-inst6002'
//                   ? 'text-primary'
//                   : 'text-muted-foreground'
//               } hover:text-primary transition-colors`}>
//               Educational Institution
//             </Link>
//             <Link
//               href="/hwit-wrks6004"
//               className={`${
//                 pathname === '/hwit-wrks6004'
//                   ? 'text-primary'
//                   : 'text-muted-foreground'
//               } hover:text-primary transition-colors`}>
//               How it Works
//             </Link>
//             <Link
//               href="/job-fair6005"
//               className={`${
//                 pathname === '/job-fair6005'
//                   ? 'text-primary'
//                   : 'text-muted-foreground'
//               } hover:text-primary transition-colors`}>
//               Job Fair
//             </Link>
//           </nav>

//           {/* Login Buttons and Avatar */}
//           <div className="flex items-center space-x-2">
//             {!session ? (
//               <>
//                 <Link href="/login6035">
//                   <Button
//                     variant="outline"
//                     className="hidden md:inline-flex"
//                     // onClick={() => sendGTMEvent({ event: 'loginClick', value: 'Login test button' })}
//                     onClick={handleLoginClick}>
//                     Login
//                   </Button>
//                 </Link>

//                 <Link href="/rgstrtn6021">
//                   <Button className="hidden md:inline-flex">
//                     Institution Registration
//                   </Button>
//                 </Link>
//               </>
//             ) : (
//               <>
//                 {/* Desktop Avatar Dropdown */}
//                 <div className="hidden md:flex items-center space-x-2">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger className="focus:outline-none">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage
//                           src={session.user?.image || ''}
//                           alt={session.user?.name || 'User'}
//                         />
//                         <AvatarFallback>
//                           {getUserInitials(session.user?.name)}
//                         </AvatarFallback>
//                       </Avatar>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => signOut()}>
//                         Sign Out
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </>
//             )}

//             {/* Mobile Login Button */}
//             {!session ? (
//               <Link href="/login6035">
//                 <Button variant="outline" className="md:hidden">
//                   Login
//                 </Button>
//               </Link>
//             ) : (
//               <Avatar className="h-8 w-8 md:hidden">
//                 <AvatarImage
//                   src={session.user?.image || ''}
//                   alt={session.user?.name || 'User'}
//                 />
//                 <AvatarFallback>
//                   {getUserInitials(session.user?.name)}
//                 </AvatarFallback>
//               </Avatar>
//             )}

//             <LangSwitcher />
//             <ModeToggle />
//           </div>
//         </div>

//         {/* Mobile Menu Overlay */}
//         {isMenuOpen && (
//           <div
//             className="fixed inset-0 z-40 bg-white top-16"
//             onClick={() => setIsMenuOpen(false)}>
//             <div
//               className="absolute left-0 right-0 bg-background z-50 overflow-y-auto max-h-[calc(100vh-4rem)]"
//               onClick={(e) => e.stopPropagation()}>
//               <nav className="px-2 pt-2 pb-4 space-y-1">
//                 {/* User Profile Section in Mobile Menu */}
//                 {session?.user && (
//                   <div className="flex items-center space-x-3 p-4 border-b border-border">
//                     <Avatar className="h-10 w-10">
//                       <AvatarImage
//                         src={session.user?.image || ''}
//                         alt={session.user?.name || 'User'}
//                       />
//                       <AvatarFallback>
//                         {getUserInitials(session.user?.name)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium text-foreground">
//                         {session.user?.name}
//                       </span>
//                       <span className="text-xs text-muted-foreground">
//                         {session.user?.email}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <Link
//                   href="/"
//                   className={`${
//                     pathname === '/' ? 'text-primary' : 'text-muted-foreground'
//                   } block px-3 py-2 rounded-md hover:text-primary hover:bg-accent transition-colors`}
//                   onClick={() => setIsMenuOpen(false)}>
//                   Home
//                 </Link>
//                 <Link
//                   href="/eductnl-inst6002"
//                   className={`${
//                     pathname === '/eductnl-inst6002'
//                       ? 'text-primary'
//                       : 'text-muted-foreground'
//                   } block px-3 py-2 rounded-md hover:text-primary hover:bg-accent transition-colors`}
//                   onClick={() => setIsMenuOpen(false)}>
//                   Educational Institution
//                 </Link>
//                 <Link
//                   href="/hwit-wrks6004"
//                   className={`${
//                     pathname === '/hwit-wrks6004'
//                       ? 'text-primary'
//                       : 'text-muted-foreground'
//                   } block px-3 py-2 rounded-md hover:text-primary hover:bg-accent transition-colors`}
//                   onClick={() => setIsMenuOpen(false)}>
//                   How it Works
//                 </Link>
//                 <Link
//                   href="/job-fair6005"
//                   className={`${
//                     pathname === '/job-fair6005'
//                       ? 'text-primary'
//                       : 'text-muted-foreground'
//                   } block px-3 py-2 rounded-md hover:text-primary hover:bg-accent transition-colors`}
//                   onClick={() => setIsMenuOpen(false)}>
//                   Job Fair
//                 </Link>

//                 {/* Role-based menu items */}
//                 {session?.user && (
//                   <>
//                     <div className="border-t border-border my-2" />
//                     {ROLE_BASED_MENU_ITEMS[session.user.role]?.map((item) => (
//                       <Link
//                         key={item.label}
//                         href={item.href}
//                         className={`${
//                           pathname === item.href
//                             ? 'text-primary'
//                             : 'text-muted-foreground'
//                         } block px-3 py-2 rounded-md hover:text-primary hover:bg-accent`}
//                         onClick={() => setIsMenuOpen(false)}>
//                         {item.label}
//                       </Link>
//                     ))}
//                     <Button
//                       onClick={() => {
//                         signOut();
//                         setIsMenuOpen(false);
//                       }}
//                       variant="outline"
//                       className="w-full mt-2">
//                       Sign Out
//                     </Button>
//                   </>
//                 )}

//                 {!session && (
//                   <div className="px-3 py-2">
//                     <Link href="/rgstrtn6021">
//                       <Button
//                         className="w-full"
//                         onClick={() => setIsMenuOpen(false)}>
//                         Institution Registration
//                       </Button>
//                     </Link>
//                   </div>
//                 )}
//               </nav>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }

"use client";

import LangSwitcher from "@/components/lang-switcher";
import { ModeToggle } from "@/components/theme-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Bell, MessageSquare } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { useSearchParams } from "next/navigation";

import { Link, usePathname } from "@/i18n/routing";
import { useEffect, useState } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import NotificationBell from "@/components/NotificationBell";
import Image from "next/image";


// Define role-based menu items (for additional links if needed)
const ROLE_MAPPING = {
  "01": "guest",
  "02": "superAdmin",
  "03": "superAdmin",
  "04": "superAdmin",
  "05": "student",
  "06": "institution",
  "07": "institution",
  "08": "institution",
  "09": "employer",
  "10": "employer",
  "11": "employer",
  "12": "jobSeeker",
};

const ROLE_BASED_MENU_ITEMS = {
  student: [
    { label: "Dashboard", href: "/stdnt-dshbrd6071" },
    { label: "My Profile", href: "/stdnt-dshbrd6071/my-prfl6072" },
    { label: "My Jobs", href: "/stdnt-dshbrd6071/my-jobs" },
    { label: "Message", href: "/stdnt-dshbrd6071/mssg6073" },
    { label: "Resume", href: "/stdnt-dshbrd6071/resume6075" },
    { label: "Skills", href: "/stdnt-dshbrd6071/skills6076" },
    { label: "Projects", href: "/stdnt-dshbrd6071/prjct6077" },
    { label: "Educations", href: "/stdnt-dshbrd6071/add-edctn6081" },
    { label: "Work Experience", href: "/stdnt-dshbrd6071/wrkexprnc6078" },
    { label: "Volenteering Activities", href: "/stdnt-dshbrd6071/add-vlntrng6082" },
    { label: "Account Setting", href: "/stdnt-dshbrd6071/accnt-sttng6074" },
  ],
  institution: [
    { label: "Dashboard", href: "/institutn-dshbrd6051" },
    { label: "My Profile", href: "/institutn-dshbrd6051/my-prfl6052" },
    {
      label: "Institution Profile",
      href: "/institutn-dshbrd6051/edu-institutn6053",
    },
    {
      label: "Registered Students",
      href: "/institutn-dshbrd6051/rgstr-stdnt6054",
    },
    {
      label: "Invited Students",
      href: "/institutn-dshbrd6051/invitd-stdnt6066",
    },
    { label: "Add Students", href: "/institutn-dshbrd6051/add-stdnts6055" },
    {
      label: "Student Bulk Import",
      href: "/institutn-dshbrd6051/stdnt-blk-imprt6056",
    },
   
    { label: "Staff", href: "/institutn-dshbrd6051/team-stff6057" },
    {
      label: "Invited Staff",
      href: "/institutn-dshbrd6051/invitd-stff6067",
    },
    {
      label: "Add Staff Member",
      href: "/institutn-dshbrd6051/add-stff-membr6058",
    },
    {
      label: "Staff Bulk Import",
      href: "/institutn-dshbrd6051/team-bulk-imprt",
    },
    { label: "Message", href: "/institutn-dshbrd6051/message6059" },
    { label: "Account Setting", href: "/institutn-dshbrd6051/accnt-sttng6060" },
  ],
  superAdmin: [
    { label: "Users", href: "/supr-admn-dshbrd6103" },
    { label: "Institutions", href: "/supr-admn-dshbrd6103/institutn6104" },
    { label: "Reported Users", href: "/supr-admn-dshbrd6103/reprtdusrs6105" },
    { label: "Settings", href: "/supr-admn-dshbrd6103/setting6106" },
    {
      label: "Configurable Parameters",
      href: "/supr-admn-dshbrd6103/configparams6107",
    },
    { label: "Achiever Central", href: "/supr-admn-dshbrd6103/achiever-central" },
    { label: "Contact", href: "/supr-admn-dshbrd6103/contact6110" },
  ],
  employer: [
    { label: "Dashboard", href: "/emplyr-dshbrd" },
    { label: "Company Profile", href: "/emplyr-dshbrd/cmpny-prfl" },
    { label: "Staffs", href: "/emplyr-dshbrd/staffs" },
    { label: "Opportunities", href: "/emplyr-dshbrd/opprtnty" },
    { label: "Interviews", href: "/emplyr-dshbrd/intrvw" },
    { label: "Hiring Stats", href: "/emplyr-dshbrd/hrng-stats" },
    { label: "Inbox", href: "/emplyr-dshbrd/inbox" },
    { label: "Fairs", href: "/emplyr-dshbrd/fairs" },
    { label: "Talent", href: "/emplyr-dshbrd/talent" },
    { label: "Institutions", href: "/emplyr-dshbrd/institutns" },
    { label: "Campus Placements", href: "/emplyr-dshbrd/cmps-plcmnt" },
  ],
  jobSeeker: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/profile" },
    { label: "Applied Jobs", href: "/applied-jobs" },
    { label: "Saved Jobs", href: "/saved-jobs" },
    { label: "Messages", href: "/messages" },
  ],
  guest: [],
};

// Helper function to map role to profile/dashboard URL
const getProfileUrl = (role) => {
  if (!role) return "/profile";
  // Mapping based on your provided roles:
  // 01: Guest User (fallback to /profile)
  // 02,03,04: Super Admin → /en/supr-admn-dshbrd6103
  // 05: Student → /en/stdnt-dshbrd6071
  // 06: Institution Administrator → /en/institutn-dshbrd6051
  // 07,08: (Additional institution roles) → /en/institutn-dshbrd6051
  // 09,10,11: Employer → /en/emplyr-dshbrd
  // 12: Job Seeker (if needed, add here)
  if (["02", "03", "04"].includes(role)) return "/supr-admn-dshbrd6103";
  if (role === "05") return "/stdnt-dshbrd6071";
  if (role === "06") return "/institutn-dshbrd6051";
  if (["07", "08"].includes(role)) return "/institutn-dshbrd6051";
  if (["09", "10", "11"].includes(role)) return "/emplyr-dshbrd";
  return "/profile";
};

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams.toString()}`;
    window.gtag("config", "G-WY0986PD4K", { page_path: url });
  }, [pathname, searchParams]);

  const handleLoginClick = () => {
    window.gtag("event", "login_click", {
      event_category: "engagement",
      event_label: "Login test button",
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMenuOpen]);

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="w-full bg-background border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 mr-2 text-foreground hover:bg-accent rounded-md"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            {/* <Link href="/" className="text-xl font-bold text-foreground">
              HCJ
            </Link> */}
            <Link href="/" className="flex items-center">
    <Image
      src="/image/logo/headerlogo.png" 
      alt="HCJ Logo"
      width={120}
      height={50}
      className="h-10 w-auto object-contain"
    />
  </Link>
          </div>

          {/* Desktop Logo */}
          <div className="hidden md:block">
            {/* <Link href="/" className="text-xl font-bold text-foreground">
              HCJ
            </Link> */}
            <Link href="/" className="flex items-center">
    <Image
      src="/image/logo/headerlogo.png" 
      alt="HCJ Logo"
      width={120}
      height={50}
      className="h-10 w-auto object-contain"
    />
  </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              } hover:text-primary transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/eductnl-inst6002"
              className={`${
                pathname === "/eductnl-inst6002"
                  ? "text-primary"
                  : "text-muted-foreground"
              } hover:text-primary transition-colors`}
            >
              Educational Institution
            </Link>
            <Link
              href="/hwit-wrks6004"
              className={`${
                pathname === "/hwit-wrks6004"
                  ? "text-primary"
                  : "text-muted-foreground"
              } hover:text-primary transition-colors`}
            >
              How it Works
            </Link>
            <Link
              href="/job-fair6005"
              className={`${
                pathname === "/job-fair6005"
                  ? "text-primary"
                  : "text-muted-foreground"
              } hover:text-primary transition-colors`}
            >
              Job Fair
            </Link>
          </nav>
          {/* Right Side: Buttons & Profile */}
          <div className="flex items-center justify-end space-x-2">
            {!session ? (
              <>
                {/* Desktop (not logged in) */}
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/login6035">
                    <Button variant="outline" onClick={handleLoginClick}>
                      Login
                    </Button>
                  </Link>
                  <NavigationMenu className="border rounded-md">
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>
                          Registration
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid gap-2 p-4 w-[200px]">
                            <NavigationMenuLink asChild>
                              <Link
                                href="/rgstrtn6021"
                                className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium">
                                  Institution Registration
                                </div>
                              </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/emp-rgstr"
                                className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium">
                                  Company Registration
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>

                {/* Desktop Controls: Mode & Language */}
                <div className="hidden md:flex items-center space-x-2">
                  <ModeToggle />
                  <LangSwitcher />
                </div>
              </>
            ) : (
              <>
                {/* After Login: Desktop */}
                <div className="hidden md:flex items-center space-x-2">
                  {/* <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button> */}
                  <NotificationBell />

                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user?.image || ""}
                          alt={session.user?.name || "User"}
                        />
                        <AvatarFallback>
                          {getUserInitials(session.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={getProfileUrl(session.user?.role)}>
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      {/* Additional role-based items can be added here */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* Also show ModeToggle & LangSwitcher for logged-in users */}
                  <ModeToggle />
                  <LangSwitcher />
                </div>
              </>
            )}

            {/* Mobile Buttons */}
            {!session ? (
              <div className="flex items-center space-x-2 md:hidden">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-9 px-3">
                        Register
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[200px] gap-2 p-2">
                          <NavigationMenuLink asChild>
                            <Link
                              href="/rgstrtn6021"
                              className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              Institution Registration
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/emp-rgstr"
                              className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              Company Registration
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <Link href="/login6035">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <ModeToggle />
              </div>
            ) : (
              <div className="flex items-center space-x-2 md:hidden">
                {/* <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button> */}
                <NotificationBell />

                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {getUserInitials(session.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={getProfileUrl(session.user?.role)}>
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    {/* Additional mobile menu items can be added here */}
                  </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}

        {isMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-white top-16"
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className="absolute left-0 right-0 bg-background z-50 flex flex-col h-[calc(100vh-4rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex-1 px-2 pt-2 pb-4 space-y-1 overflow-y-auto">
                {session?.user && (
                  <div className="flex items-center space-x-3 p-4 border-b border-border">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {getUserInitials(session.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {session.user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {session.user?.email}
                      </span>
                    </div>
                  </div>
                )}

                {/* Default Links */}
                <Link
                  href="/"
                  className={`${
                    pathname === "/" ? "text-primary" : "text-muted-foreground"
                  } block px-3 py-2 rounded-md hover:text-primary hover:bg-accent transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/eductnl-inst6002"
                  className={`${
                    pathname === "/eductnl-inst6002"
                      ? "text-primary"
                      : "text-muted-foreground"
                  } block px-3 py-2 rounded-md hover:text-primary hover:bg-accent transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Educational Institution
                </Link>
                <Link
                  href="/hwit-wrks6004"
                  className={`${
                    pathname === "/hwit-wrks6004"
                      ? "text-primary"
                      : "text-muted-foreground"
                  } block px-3 py-2 rounded-md hover:text-primary hover:bg-accent transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it Works
                </Link>
                <Link
                  href="/job-fair6005"
                  className={`${
                    pathname === "/job-fair6005"
                      ? "text-primary"
                      : "text-muted-foreground"
                  } block px-3 py-2 rounded-md hover:text-primary hover:bg-accent transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Job Fair
                </Link>

                {/* Role-Based Navigation Items After Job Fair */}
                {session?.user?.role &&
                  ROLE_BASED_MENU_ITEMS[ROLE_MAPPING[session.user.role]]?.map(
                    (item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`${
                          pathname === item.href
                            ? "text-primary"
                            : "text-muted-foreground"
                        } block px-3 py-2 rounded-md hover:text-primary hover:bg-accent transition-colors`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  )}

                <div className="border-t border-border p-4 bg-background">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Language
                    </span>
                    <LangSwitcher />
                  </div>
                </div>

                {/* Logout Button for Logged-in Users */}
                {session?.user && (
                  <Button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    Sign Out
                  </Button>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
