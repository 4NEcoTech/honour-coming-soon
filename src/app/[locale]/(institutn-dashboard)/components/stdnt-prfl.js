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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

// Role Mapping (If Needed)
const genderMapping = {
  "01": "Male",
  "02": "Female",
  "03": "Others",
};

export default function StudentDetailsPopup({
  student,
  isOpen,
  onClose,
  onDelete,
}) {
  const router = useRouter();
  const [deleteStudentId, setDeleteStudentId] = useState(null);

  if (!student) return null;

  const genderName = genderMapping[student.gender] || "Unknown Role";

  const formattedDOB = student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString()
    : "N/A";

  // Navigate to Edit Page with Student Data
  const handleEdit = () => {
    const queryParams = new URLSearchParams({
      id: student.id,
      institutionNumber: student.institutionNumber,
      institutionName: student.institutionName,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      gender: student.gender,
      dob: student.dob,
      country: student.country,
      pincode: student.pincode,
      state: student.state,
      city: student.city,
      programName: student.programName,
      branchSpecialization: student.branchSpecialization,
      enrollmentYear: student.enrollmentYear,
      gradeScore: student.gradeScore,
      gradeValue: student.gradeValue,
      documentType: student.documentType,
      documentNumber: student.documentNumber,
    }).toString();

    router.push(`/institutn-dshbrd6051/add-stdnts6055?${queryParams}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex-row items-start justify-between space-y-0">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <DialogTitle className="text-xl">{student.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {student.programName}
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
              onClick={() => onDelete(student._id)}
            >
              Delete Profile
            </Button> */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full border bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                  onClick={() => setDeleteStudentId(student.id)} // ✅ Store student ID before delete
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
                      if (deleteStudentId) {
                        //  Now using deleteStudentId instead of student.id
                        onDelete(deleteStudentId);
                      } else {
                        console.error(
                          "Error: Student ID is missing for deletion."
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

        {/* Student Details */}
        <div className="grid gap-4 py-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Email</div>
            <div className="text-sm text-muted-foreground">{student.email}</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Phone Number</div>
            <div className="text-sm text-muted-foreground">{student.phone}</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Gender</div>
            <div className="text-sm text-muted-foreground">
              {genderMapping[student.gender] || "Unknown"}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Date of Birth</div>
            <div className="text-sm text-muted-foreground">{formattedDOB}</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Institution</div>
            <div className="text-sm text-muted-foreground">
              {student.institutionName}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Program</div>
            <div className="text-sm text-muted-foreground">
              {student.programName}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Branch Specialization</div>
            <div className="text-sm text-muted-foreground">
              {student.branchSpecialization}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Enrollment Year</div>
            <div className="text-sm text-muted-foreground">
              {student.enrollmentYear}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-medium">Address</div>
            <div className="text-sm text-muted-foreground">
              {student.country}, {student.state}, {student.city},{" "}
              {student.pincode}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
