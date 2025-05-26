import { SuperAdminDashboardSidebar } from '@/components/super-admin-dashboard-sidebar';

export const metadata = {

  title: 'Super Admin Dashboard | HCJ',
 openGraph: {
    title: 'Super Admin Dashboard | HCJ',
 },
}

export default function SuperAdminDashboard({ children }) {

  return (
    <div className="flex min-h-screen bg-background dark:bg-gray-900">
      <SuperAdminDashboardSidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
