"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import PasswordForm from "@/components/update-password";
export default function AccountSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [passwordChange, setPasswordChange] = useState(false);
  const [viewMode, setViewMode] = useState("Administrator");

  const { data: session } = useSession();

  return (
    <div className="max-w-2xl p-6 mx-4 sm:mx-8 md:mx-16 lg:mx-16 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Account Settings
      </h1>

      <>
        {/* Common Fields */}
        <div className="flex sm:flex-row items-center justify-between mb-4 border-b border-gray-300 dark:border-gray-700 pb-4">
          <div className="mb-4 sm:mb-0">
            <p className="font-medium text-gray-800 dark:text-white">Email</p>
            <p className="text-gray-500 dark:text-gray-400">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-row items-center justify-between mb-4 border-b border-gray-300 dark:border-gray-700 pb-4">
          <p className="font-medium text-gray-800 dark:text-white">
            Email Notification
          </p>
          <Button
            onClick={() => setEmailNotifications(!emailNotifications)}
            variant={emailNotifications ? "default" : "outline"}
            className={`w-20 flex items-center justify-center font-medium ${
              emailNotifications
                ? "dark:bg-blue-600 dark:hover:bg-blue-700"
                : "dark:bg-transparent dark:text-blue-400 dark:border-blue-400"
            }`}
          >
            {emailNotifications ? "On" : "Off"}
          </Button>
        </div>
        <div className="flex flex-col mb-4 border-b border-gray-300 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-800 dark:text-white">
              Password
            </p>

            <Button
              onClick={() => setPasswordChange(!passwordChange)}
              variant={passwordChange ? "default" : "outline"}
              className={`w-20 flex items-center justify-center font-medium ${
                passwordChange
                  ? "dark:bg-blue-600 dark:hover:bg-blue-700"
                  : "dark:bg-transparent dark:text-blue-400 dark:border-blue-400"
              }`}
            >
              {passwordChange ? "Cancel" : "Change"}
            </Button>
          </div>

          {passwordChange && (
            <PasswordForm setPasswordChange={setPasswordChange} />
          )}
        </div>
      </>
    </div>
  );
}
