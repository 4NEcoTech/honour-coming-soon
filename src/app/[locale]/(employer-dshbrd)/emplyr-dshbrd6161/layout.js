import InteractiveSidebar from '@/components/employer-dashboard-sidebar';
import { LogoutButton } from '@/components/logout';
import Image from 'next/image';
import {
  Users,
  UserPlus,
  Upload,
  ShieldCheck,
  MailPlus,
} from 'lucide-react';

export const metadata = {
  title: 'Employer Dashboard | HCJ',
  openGraph: {
    title: 'Employer Dashboard | HCJ',
  },
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/emplyr-dshbrd6161',
    icon: '/image/employerdashboard/db/1.svg',
  },
  {
    name: 'My Profile',
    href: '/emplyr-dshbrd6161/my-prfl6162',
    icon: '/image/employerdashboard/db/2.svg',
  },
  {
    name: 'Company Profile',
    href: '/emplyr-dshbrd6161/cmpny-prfl6163',
    icon: '/image/employerdashboard/db/2.svg',
  },
  // {
  //   name: 'My Jobs',
  //   href: '/emplyr-dshbrd6161/my-jobs6164',
  //   icon: '/image/employerdashboard/db/3.svg',
  // },
  {
    name: 'Staffs',
    dropdown: true,
    icon: '/image/employerdashboard/db/3.svg',
  },
  {
    name: 'Opportunities',
    href: '/emplyr-dshbrd6161/opprtnty6166',
    icon: '/image/employerdashboard/db/5.svg',
  },
  // {
  //   name: 'Interviews',
  //   href: '/emplyr-dshbrd6161/intrvw6167',
  //   icon: '/image/employerdashboard/db/6.svg',
  // },
  // {
  //   name: 'Hiring Stats',
  //   href: '/emplyr-dshbrd6161/hrng-stats6168',
  //   icon: '/image/employerdashboard/db/7.svg',
  // },
  // {
  //   name: 'Inbox',
  //   href: '/emplyr-dshbrd6161/inbox6169',
  //   icon: '/image/employerdashboard/db/4.svg',
  // },
  // {
  //   name: 'Fairs',
  //   href: '/emplyr-dshbrd6161/fairs6170',
  //   icon: '/image/employerdashboard/db/8.svg',
  // },
  // {
  //   name: 'Talent',
  //   href: '/emplyr-dshbrd6161/talent6171',
  //   icon: '/image/employerdashboard/db/9.svg',
  // },
  // {
  //   name: 'Institutions',
  //   href: '/emplyr-dshbrd6161/institutns6172',
  //   icon: '/image/employerdashboard/db/10.svg',
  // },
  // {
  //   name: 'Campus Placements',
  //   href: '/emplyr-dshbrd6161/cmps-plcmnt6173',
  //   icon: '/image/employerdashboard/db/11.svg',
  // },
  {
    name: 'Account Setting',
    href: '/emplyr-dshbrd6161/setting6185',
    icon: '/image/institutndashboard/dashboard/setting.svg',
  },
];

const dropdownItems = {
  Staffs: [
    {
      name: `Registered Staff's`,
      href: '/emplyr-dshbrd6161/rgstered-staff6165',
      icon: <Users className="h-5 w-5" />, 
    },
    {
      name: `Invited Staff's`,
      href: '/emplyr-dshbrd6161/invited-staff6176', 
      icon: <MailPlus className="h-5 w-5" />,
    },
    {
      name: 'Add New Staff',
      href: '/emplyr-dshbrd6161/add-staff6178',
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      name: 'Staff Bulk Upload',
      href: '/emplyr-dshbrd6161/staff-bulk-import6180', 
      icon: <Upload className="h-5 w-5" />, 
    },
  ],
};

export default function EmployerDashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 shadow-lg p-2 hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="mb-4 text-center font-bold p-4 rounded-lg">
            <Image
              src="/image/institutndashboard/dashboard/dashboardlogo.svg"
              alt="Employer Logo"
              width={40}
              height={40}
              className="mx-auto w-32 h-32 object-contain"
            />
            <p className="text-center text-sm mt-2 dark:text-gray-300">4N EcoTech</p>
          </div>
          <InteractiveSidebar
            menuItems={menuItems}
            dropdownItems={dropdownItems}
          />
          <LogoutButton className="w-full mt-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}