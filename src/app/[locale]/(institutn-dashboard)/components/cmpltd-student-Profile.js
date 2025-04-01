"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function RegisteredStudentPopup({ student, isOpen, onClose }) {
  if (!student) return null;

  const initials = student.name
    ? student.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "NA";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex-row items-start justify-between space-y-0">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/image/institutndashboard/dashpage/popup/profile.svg" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <DialogTitle className="text-xl">{student.name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Image
                  src="/image/institutndashboard/dashpage/popup/qr.svg"
                  alt="Verified"
                  width={20}
                  height={20}
                />
                <span className="text-sm text-muted-foreground">Verified</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Image
                  src="/image/institutndashboard/dashpage/popup/follower.svg"
                  alt="Followers"
                  width={16}
                  height={16}
                  className="mr-1"
                />
                0 Followers
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex space-x-4 mt-2">
          <Link href="/stdnt-prfl" className="flex-1">
            <Button className="w-full border bg-gray border-gray-300 py-2 px-4 text-gray-700 rounded-md hover:bg-blue-300">
              View Profile
            </Button>
          </Link>
          <Button className="flex-1 w-full border bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90">
            Follow
          </Button>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Program Name</div>
            <div className="text-sm text-muted-foreground">
              {student.programName || "N/A"}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Branch / Specialization</div>
            <div className="text-sm text-muted-foreground">
              {student.branchSpecialization || "N/A"}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Enrollment Year</div>
            <div className="text-sm text-muted-foreground">
              {student.enrollmentYear || "N/A"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
