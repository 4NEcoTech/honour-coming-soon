'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function LogoutButton({ className }) {
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setIsLogoutDialogOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
      <DialogTrigger asChild>
        <button className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 ${className}`}>
          <Image
            src="/image/seperadmindashboard/dbrd/6.svg"
            alt="Logout"
            className="h-4 w-4"
            width={16}
            height={16}
          />
          Logout
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">Confirm Logout?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">Are you sure you want to log out?</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="w-24" onClick={() => setIsLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="w-24" onClick={handleLogout}>
                Yes
              </Button>
            </div>
          </CardContent>
      </DialogContent>
    </Dialog>
  );
}
