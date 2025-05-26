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
import { Menu, X, Bell, MessageSquare, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { useSearchParams } from "next/navigation";

import { Link, usePathname, useRouter } from "@/i18n/routing";
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
import { Input } from "@/components/ui/input";

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
  10: "employer",
  11: "employer",
  12: "jobSeeker",
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
    {
      label: "Volenteering Activities",
      href: "/stdnt-dshbrd6071/add-vlntrng6082",
    },
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

    {
      label: "Student Bulk Upload",
      href: "/supr-admn-dshbrd6103/student-bulk-upload6111",
    },
    {
      label: "Institution Staff Bulk Upload",
      href: "/supr-admn-dshbrd6103/institution-staff-bulk-upload6112",
    },
    {
      label: "Company Staff Bulk Upload",
      href: "/supr-admn-dshbrd6103/company-staff-bulk-upload6113",
    },
    {
      label: "Invited Student",
      href: "/supr-admn-dshbrd6103/invited-student6108",
    },
    { label: "Invited Staff", href: "/supr-admn-dshbrd6103/invited-staff6109" },
    {
      label: "Achiever Central",
      href: "/supr-admn-dshbrd6103/achiever-central",
    },
    { label: "Contact", href: "/supr-admn-dshbrd6103/contact6110" },
    {
      label: "Configurable Parameters",
      href: "/supr-admn-dshbrd6103/configparams6107",
    },
    { label: "Settings", href: "/supr-admn-dshbrd6103/setting6106" },
  ],
  employer: [
    { label: "Dashboard", href: "/emplyr-dshbrd6161" },
    { label: "Company Profile", href: "/emplyr-dshbrd6161/cmpny-prfl6163" },
    { label: "Staffs", href: "/emplyr-dshbrd6161/staffs6165" },
    { label: "Opportunities", href: "/emplyr-dshbrd6161/opprtnty6166" },
    { label: "Interviews", href: "/emplyr-dshbrd6161/intrvw6167" },
    { label: "Hiring Stats", href: "/emplyr-dshbrd6161/hrng-stats6168" },
    { label: "Inbox", href: "/emplyr-dshbrd6161/inbox6169" },
    { label: "Fairs", href: "/emplyr-dshbrd6161/fairs6170" },
    { label: "Talent", href: "/emplyr-dshbrd6161/talent6171" },
    { label: "Institutions", href: "/emplyr-dshbrd6161/institutns6172" },
    { label: "Campus Placements", href: "/emplyr-dshbrd6161/cmps-plcmnt6173" },
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
  if (["02", "03", "04"].includes(role)) return "/supr-admn-dshbrd6103";
  if (role === "05") return "/stdnt-dshbrd6071";
  if (role === "06") return "/institutn-dshbrd6051";
  if (["07", "08"].includes(role)) return "/institutn-dshbrd6051";
  if (["09", "10", "11"].includes(role)) return "/emplyr-dshbrd6161";
  return "/profile";
};

export default function Header() {
  const { data: session } = useSession();
  //  console.log(session);
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

  // const getUserInitials = (name) => {
  //   if (!name) return "U";
  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase();
  // };

  const getUserInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "U";
    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  // Add search state and handlers
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`/api/hcj/v1/hcjArET60131fetchFaq?search=${searchQuery}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setSuggestions(
              json.data.map((item) => ({
                question: item.question,
                answer: item.answer,
                id: item._id,
              }))
            );
          } else {
            setSuggestions([]);
          }
        })
        .catch(() => setSuggestions([]));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search results page or handle search
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
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
              {/* <Image
                src="/image/logo/headerlogo.png"
                alt="HCJ Logo"
                width={120}
                height={50}
                className="h-10 w-auto object-contain"
              /> */}
              {/* Light Mode Logo */}
              <Image
                src="/image/logo/headerlogo.png"
                alt="HCJ Logo"
                width={120}
                height={50}
                className="h-10 w-auto object-contain block dark:hidden"
              />

              {/* Dark Mode Logo */}
              <Image
                src="/image/logo/darkfooterlogo.png" // Your dark mode logo
                alt="HCJ Logo Dark"
                width={120}
                height={50}
                className="h-10 w-auto object-contain hidden dark:block"
              />
            </Link>
          </div>

          {/* Desktop Logo */}
          <div className="hidden md:block">
            {/* <Link href="/" className="text-xl font-bold text-foreground">
              HCJ
            </Link> */}
            <Link href="/" className="flex items-center">
              {/* <Image
                src="/image/logo/headerlogo.png"
                alt="HCJ Logo"
                width={120}
                height={50}
                className="h-10 w-auto object-contain"
              /> */}

              {/* Light Mode Logo */}
              <Image
                src="/image/logo/headerlogo.png"
                alt="HCJ Logo"
                width={120}
                height={50}
                className="h-10 w-auto object-contain block dark:hidden"
              />

              {/* Dark Mode Logo */}
              <Image
                src="/image/logo/darkfooterlogo.png" // Your dark mode logo
                alt="HCJ Logo Dark"
                width={120}
                height={50}
                className="h-10 w-auto object-contain hidden dark:block"
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
            <Link
              href="/jobs6006"
              className={`${
                pathname === "/jobs6006"
                  ? "text-primary"
                  : "text-muted-foreground"
              } hover:text-primary transition-colors`}
            >
              Jobs
            </Link>
          </nav>
          {/* Right Side: Buttons & Profile */}
          <div className="flex items-center justify-end space-x-2">
            {/* Search Field - Desktop */}
            {/* <div className="hidden md:flex items-center relative">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-3 pr-8 py-2 rounded-md border border-input bg-background text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50 text-left max-h-64 overflow-y-auto border border-border">
                  {suggestions.map((item, index) => (
                    <Link
                      key={index}
                      href={`/faq6013?q=${encodeURIComponent(item.question)}`}
                      onClick={() => {
                        setSearchQuery("");
                        setSuggestions([]);
                      }}
                      className="block px-4 py-2 hover:bg-accent dark:hover:bg-gray-700 text-foreground dark:text-gray-200"
                    >
                      {item.question}
                    </Link>
                  ))}
                </div>
              )}
            </div> */}
            {!session ? (
              <>
                {/* Desktop (not logged in) */}
                <div className="hidden md:flex items-center space-x-2">
                  {/* <Link href="/login6035">
                    <Button variant="outline" onClick={handleLoginClick}>
                      Login
                    </Button>
                  </Link> */}
                  <NavigationMenu className="border rounded-md">
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Login</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid gap-2 p-4 w-full max-w-xs">
                            <NavigationMenuLink asChild>
                              <Link
                                href="/login6035"
                                className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium">
                                  Institution
                                </div>
                              </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/emp-login6152"
                                className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium">
                                  Company
                                </div>
                              </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/stdnt-login"
                                className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium">
                                  Student
                                </div>
                              </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/jb-skr-login"
                                className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium">
                                  Job Seeker
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

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
                                href="/emp-rgstr6151"
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
                  {/* <ModeToggle /> */}
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
                      {/* <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user?.profileImage || ""}
                          alt={`${session.user?.first_name || ""} ${
                            session.user?.last_name || ""
                          }`}
                        />
                        <AvatarFallback>
                          {getUserInitials(
                            session.user?.first_name,
                            session.user?.last_name
                          )}
                        </AvatarFallback>
                      </Avatar> */}
                      <Avatar className="h-10 w-10">
                        {session.user?.profileImage ? (
                          <Image
                            src={session.user.profileImage}
                            alt={`${session.user.first_name} ${session.user.last_name}`}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback>
                            {getUserInitials(
                              session.user?.first_name,
                              session.user?.last_name
                            )}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={getProfileUrl(session.user?.role)}>
                          My Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="cursor-pointer text-red-600"
                      >
                        Logout
                      </DropdownMenuItem>
                      {/* Additional role-based items can be added here */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* Also show ModeToggle & LangSwitcher for logged-in users */}
                  {/* <ModeToggle /> */}
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
                              href="/emp-rgstr6151"
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
                {/* <Link href="/login6035">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link> */}
                <NavigationMenu className="border rounded-md">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Login</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-2 p-4 w-full max-w-xs">
                          <NavigationMenuLink asChild>
                            <Link
                              href="/login6035"
                              className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              <div className="text-sm font-medium">
                                Institution
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/emp-login6152"
                              className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              <div className="text-sm font-medium">Company</div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/stdnt-login"
                              className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              <div className="text-sm font-medium">Student</div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/jb-skr-login"
                              className="block select-none rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              <div className="text-sm font-medium">
                                Job Seeker
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                {/* <ModeToggle /> */}
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
                    {/* <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.profileImage || ""}
                        alt={`${session.user?.first_name || ""} ${
                          session.user?.last_name || ""
                        }`}
                      />
                      <AvatarFallback>
                        {getUserInitials(
                          session.user?.first_name,
                          session.user?.last_name
                        )}
                      </AvatarFallback>
                    </Avatar> */}
                    <Avatar className="h-10 w-10">
                      {session.user?.profileImage ? (
                        <Image
                          src={session.user.profileImage}
                          alt={`${session.user.first_name} ${session.user.last_name}`}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <AvatarFallback>
                          {getUserInitials(
                            session.user?.first_name,
                            session.user?.last_name
                          )}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={getProfileUrl(session.user?.role)}>
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="cursor-pointer text-red-600"
                    >
                      Logout
                    </DropdownMenuItem>
                    {/* Additional mobile menu items can be added here */}
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <ModeToggle /> */}
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
                    {/* <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session.user?.profileImage || ""}
                        alt={`${session.user?.first_name || ""} ${
                          session.user?.last_name || ""
                        }`}
                      />
                      <AvatarFallback>
                        {getUserInitials(
                          session.user?.first_name,
                          session.user?.last_name
                        )}
                      </AvatarFallback>
                    </Avatar> */}
                    <Avatar className="h-10 w-10">
                      {session.user?.profileImage ? (
                        <Image
                          src={session.user.profileImage}
                          alt={`${session.user.first_name} ${session.user.last_name}`}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <AvatarFallback>
                          {getUserInitials(
                            session.user?.first_name,
                            session.user?.last_name
                          )}
                        </AvatarFallback>
                      )}
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

                {/* Add search field to mobile menu */}
                <div className="px-3 py-2 relative">
                  {/* <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 rounded-md border border-input bg-background text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </form> */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-3 right-3 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50 text-left max-h-64 overflow-y-auto border border-border">
                      {suggestions.map((item, index) => (
                        <Link
                          key={index}
                          href={`/faq6013?q=${encodeURIComponent(
                            item.question
                          )}`}
                          onClick={() => {
                            setSearchQuery("");
                            setSuggestions([]);
                          }}
                          className="block px-4 py-2 hover:bg-accent dark:hover:bg-gray-700 text-foreground dark:text-gray-200"
                        >
                          {item.question}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

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
                <Link
                  href="/jobs6006"
                  className={`${
                    pathname === "/jobs6006"
                      ? "text-primary"
                      : "text-muted-foreground"
                  } hover:text-primary transition-colors`}
                >
                  Jobs
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
