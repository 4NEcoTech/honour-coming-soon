"use client";

import { useAbility } from "@/Casl/CaslContext";
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

const roleMapping = {
  "07": "Team Member",
  "08": "Support Staff",
  "06": "Administrator",
};

export default function RegisteredTeamPopup({ staff, isOpen, onClose }) {
  const ability = useAbility();


  
  if (!staff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex-row items-start justify-between space-y-0">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/image/institutndashboard/dashpage/popup/profile.svg" />
              <AvatarFallback>{staff?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <DialogTitle className="text-xl">{staff.name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Image
                  src="/image/institutndashboard/dashpage/popup/qr.svg"
                  alt="Verified"
                  width={20}
                  height={20}
                />
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Image
                  src="/image/institutndashboard/dashpage/popup/follower.svg"
                  alt="Followers"
                  width={16}
                  height={16}
                  className="mr-1"
                />
                5997 Followers
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex space-x-4 mt-4">
          {ability.can("read", "Staff") ? (
            <Link href={`/team-prfl/${staff.id}`} className="flex-1">
              <Button className="w-full border bg-gray border-gray-300 py-2 px-4 text-gray-700 rounded-md hover:bg-blue-300">
                View Profile
              </Button>
            </Link>
          ) : (
            <div className="flex-1">
              <Button
                disabled
                className="w-full border bg-gray border-gray-300 py-2 px-4 text-gray-700 rounded-md hover:bg-blue-300 cursor-not-allowed">
                View Profile
              </Button>
            </div>
          )}
          {ability.can("update", "Staff") ? (
            <Link
              href={`/institutn-dshbrd6051/add-stff-membr6058?id=${staff.id}`}
              className="flex-1">
              <Button className="w-full border bg-primary py-2 px-4 rounded-md text-white">
                Edit
              </Button>
            </Link>
          ) : (
            <div className="flex-1">
              <Button
                disabled
                className="w-full border bg-primary py-2 px-4 rounded-md text-white cursor-not-allowed ">
                Edit
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Role</div>
            <div className="text-sm text-muted-foreground">{staff.role}</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Phone Number</div>
            <div className="text-sm text-muted-foreground">
              {staff.phone || "N/A"}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Email</div>
            <div className="text-sm text-muted-foreground">{staff.email}</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Department</div>
            <div className="text-sm text-muted-foreground">
              {staff.department}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Joining Year</div>
            <div className="text-sm text-muted-foreground">
              {staff.joiningYear}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
