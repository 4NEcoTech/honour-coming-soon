import InteractiveSidebar from '@/components/institution-dashboard-sidebar';
import { LogoutButton } from '@/components/logout';
import Image from 'next/image';

export const metadata = {
  title: 'Institution Dashboard | HCJ',
 openGraph: {
    title: 'Institution Dashboard | HCJ',
 },
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/institutn-dshbrd6051',
    icon: '/image/institutndashboard/dashboard/dashboard.svg',
  },
  {
    name: 'My Profile',
    href: '/institutn-dshbrd6051/my-prfl6052',
    icon: '/image/institutndashboard/dashboard/myprofile.svg',
  },
  {
    name: 'Institution Profile',
    href: '/institutn-dshbrd6051/edu-institutn6053',
    icon: '/image/institutndashboard/dashboard/eduins.svg',
  },
  {
    name: 'Students',
    href: '#',
    icon: '/image/institutndashboard/dashboard/students.svg',
    dropdown: true,
  },
  {
    name: 'Team',
    href: '#',
    icon: '/image/institutndashboard/dashboard/team.svg',
    dropdown: true,
  },
  // {
  //   name: 'Messages',
  //   href: '/institutn-dshbrd6051/message6059',
  //   icon: '/image/institutndashboard/dashboard/message.svg',
  // },
  {
    name: 'Account Settings',
    href: '/institutn-dshbrd6051/accnt-sttng6060',
    icon: '/image/institutndashboard/dashboard/setting.svg',
  },
  // {
  //   name: 'Logout',
  //   href: '/institutn-dshbrd6051/logout6061',
  //   icon: '/image/institutndashboard/dashboard/logout.svg',
  // },
];

const dropdownItems = {
  Students: [
    {
      name: 'Registered Students',
      href: '/institutn-dshbrd6051/rgstr-stdnt6054',
      icon: '/image/institutndashboard/dashboard/studentregister.svg',
    },
    {
      name: 'Invited Students',
      href: '/institutn-dshbrd6051/invitd-stdnt6066',
      icon: '/image/institutndashboard/dashboard/studentregister.svg',
    },
    {
      name: 'Add Students',
      href: '/institutn-dshbrd6051/add-stdnts6055',
      icon: '/image/institutndashboard/dashboard/addstudents.svg',
    },
    {
      name: 'Bulk Import',
      href: '/institutn-dshbrd6051/stdnt-blk-imprt6056',
      icon: '/image/institutndashboard/dashboard/bulkupload.svg',
    },

  ],
  Team: [
    {
      name: 'Staff',
      href: '/institutn-dshbrd6051/team-stff6057',
      icon: '/image/institutndashboard/dashboard/staff.svg',
    },
    {
      name: 'Invited Staff',
      href: '/institutn-dshbrd6051/invitd-stff6067',
      icon: '/image/institutndashboard/dashboard/staff.svg',
    },
    {
      name: 'Add Staff Member',
      href: '/institutn-dshbrd6051/add-stff-membr6058',
      icon: '/image/institutndashboard/dashboard/addstaffmember.svg',
    },
    {
      name: 'Bulk Import',
      href: '/institutn-dshbrd6051/team-bulk-imprt',
      icon: '/image/institutndashboard/dashboard/bulkupload.svg',
    },
  ],
};

export default function InstituteDashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 shadow-lg p-2 hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="mb-4 text-center font-bold p-4 rounded-lg">
            <Image
              src="/image/institutndashboard/dashboard/dashboardlogo.svg"
              alt="Institution Logo"
              width={40}
              height={40}
              className="mx-auto w-32 h-32 object-contain"
            />
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
