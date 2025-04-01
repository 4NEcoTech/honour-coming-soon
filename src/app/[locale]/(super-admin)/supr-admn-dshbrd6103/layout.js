// import { useState } from 'react';

import { SuperAdminDashboardSidebar } from '@/components/super-admin-dashboard-sidebar';

export const metadata = {

  title: 'Super Admin Dashboard | HCJ',
 openGraph: {
    title: 'Super Admin Dashboard | HCJ',
 },
}

export default function SuperAdminDashboard({ children }) {
  // const [activeMenu, setActiveMenu] = useState('Users');

  // const menuItems = [
  //   {
  //     icon: '/image/seperadmindashboard/dbrd/1.svg',
  //     label: 'Users',
  //     href: '/super-admin',
  //   },
  //   {
  //     icon: '/image/seperadmindashboard/dbrd/2.svg',
  //     label: 'Institutions',
  //     href: '/super-admin/institutions',
  //   },
  //   {
  //     icon: '/image/seperadmindashboard/dbrd/3.svg',
  //     label: 'Reported Users',
  //     href: '/super-admin/reportedusers',
  //   },
  //   {
  //     icon: '/image/seperadmindashboard/dbrd/4.svg',
  //     label: 'Settings',
  //     href: '/super-admin/setting',
  //   },
  //   {
  //     icon: '/image/seperadmindashboard/dbrd/5.svg',
  //     label: 'Configurable Parameters',
  //     href: '/super-admin/configparams',
  //   },
  // ];

  // const handleMenuClick = (menuName) => {
  //   setActiveMenu(menuName);
  // };

  return (
    <div className="flex min-h-screen bg-background dark:bg-gray-900">
      <SuperAdminDashboardSidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
