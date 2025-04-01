import StudentDashboardSidebar from '@/components/student-dashboard-sidebar';

import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "Student Dashboard",
    template: "%s | Student Dashboard",
  },
  description: "Manage your educational journey with our comprehensive student dashboard.",
}

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        <StudentDashboardSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
