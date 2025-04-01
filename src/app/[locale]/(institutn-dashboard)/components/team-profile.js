"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/routing";
import { useState } from "react"; //  Import useState
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";



// Role Mapping
const roleMapping = {
  "07": "Team Member",
  "08": "Support Staff",
};

export default function TeamProfile({ staff, isOpen, onClose, onDelete }) {
  const router = useRouter();
  const [deleteStaffId, setDeleteStaffId] = useState(null);

  if (!staff) return null;

  const roleName = roleMapping[staff.CCP_Contact_Person_Role] || "Unknown Role";

  // Navigate to the edit page with staff data as query parameters
  const handleEdit = () => {
    const queryParams = new URLSearchParams({
      id: staff._id,
      firstName: staff.CCP_Contact_Person_First_Name,
      lastName: staff.CCP_Contact_Person_Last_Name,
      phone: staff.CCP_Contact_Person_Phone,
      altPhone: staff.CCP_Contact_Person_Alternate_Phone || "",
      email: staff.CCP_Contact_Person_Email,
      designation: staff.CCP_Contact_Person_Designation,
      role: staff.CCP_Contact_Person_Role,
      department: staff.CCP_Contact_Person_Department,
      joiningYear: staff.CCP_Contact_Person_Joining_Year,
      gender: staff.CCP_Contact_Person_Gender,
      dob: staff.CCP_Contact_Person_DOB,
      address: staff.CCP_Contact_Person_Address_Line1,
      city: staff.CCP_Contact_Person_City,
      state: staff.CCP_Contact_Person_State,
      country: staff.CCP_Contact_Person_Country,
      pincode: staff.CCP_Contact_Person_Pincode,
    }).toString();

    router.push(`/institutn-dshbrd6051/add-stff-membr6058?${queryParams}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex-row items-start justify-between space-y-0">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>
                {staff.CCP_Contact_Person_First_Name.charAt(0)}
                {staff.CCP_Contact_Person_Last_Name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <DialogTitle className="text-xl">
                {staff.CCP_Contact_Person_First_Name}{" "}
                {staff.CCP_Contact_Person_Last_Name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {staff.CCP_Contact_Person_Designation}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Buttons Section */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <Button
              className="w-full border bg-primary py-2 px-4 rounded-md"
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>
          <div className="flex-1">
            {/* <Button
              className="w-full border bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              onClick={() => onDelete(staff._id)}
            >
              Delete Profile
            </Button> */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full border bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                  onClick={() => setDeleteStaffId(staff.id)}
                >
                  Delete Profile
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <h2 className="text-lg font-semibold">Are you sure?</h2>
                  <p>This action cannot be undone.</p>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (deleteStaffId) {
                        onDelete(deleteStaffId);
                      } else {
                        console.error(
                          "Error: Staff ID is missing for deletion."
                        );
                      }
                    }}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* User Details */}
        <div className="grid gap-4 py-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Role</div>
            <div className="text-sm text-muted-foreground">{roleName}</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Phone Number</div>
            <div className="text-sm text-muted-foreground">
              +{staff.CCP_Contact_Person_Phone}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Email</div>
            <div className="text-sm text-muted-foreground">
              {staff.CCP_Contact_Person_Email}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Department</div>
            <div className="text-sm text-muted-foreground">
              {staff.CCP_Contact_Person_Department}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Joining Year</div>
            <div className="text-sm text-muted-foreground">
              {staff.CCP_Contact_Person_Joining_Year}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Gender</div>
            <div className="text-sm text-muted-foreground">
              {staff.CCP_Contact_Person_Gender}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">DOB</div>
            <div className="text-sm text-muted-foreground">
              {new Date(staff.CCP_Contact_Person_DOB).toLocaleDateString()}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Address</div>
            <div className="text-sm text-muted-foreground">
              {staff.CCP_Contact_Person_Address_Line1},{" "}
              {staff.CCP_Contact_Person_City}, {staff.CCP_Contact_Person_State},{" "}
              {staff.CCP_Contact_Person_Country} -{" "}
              {staff.CCP_Contact_Person_Pincode}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
