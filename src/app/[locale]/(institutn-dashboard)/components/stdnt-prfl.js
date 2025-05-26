"use client";

import { useAbility } from "@/Casl/CaslContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GENDER_ROLES } from "@/constants/roles";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";

// Role Mapping (If Needed)
// const genderMapping = {
//   "01": "Male",
//   "02": "Female",
//   "03": "Others",
// };

export default function StudentDetailsPopup({
  student,
  isOpen,
  onClose,
  onDelete,
}) {
  const router = useRouter();
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const ability = useAbility();

  if (!student) return null;

  // const genderName = genderMapping[student.gender] || "Unknown Role";
  console.log("student", student);
  const formattedDOB = student.HCJ_ST_DOB
    ? new Date(student.HCJ_ST_DOB).toLocaleDateString()
    : "N/A";

  // Navigate to Edit Page with Student Data
  const handleEdit = () => {
    //     HCJ_ST_Address
    // :
    // "351/2 cross no 3rd Belgaum "
    // HCJ_ST_Alternate_Phone_Number
    // :
    // "915634534656"
    // HCJ_ST_Class_Of_Year
    // :
    // "2025"
    // HCJ_ST_DOB
    // :
    // "2025-05-01T00:00:00.000Z"
    // HCJ_ST_Educational_Alternate_Email
    // :
    // "starlord.4neco@gmail.com"
    // HCJ_ST_Educational_Email
    // :
    // "starlord.4neco@gmail.com"
    // HCJ_ST_Enrollment_Year
    // :
    // "2020"
    // HCJ_ST_Gender
    // :
    // "01"
    // HCJ_ST_Individual_Id
    // :
    // null
    // HCJ_ST_InstituteNum
    // :
    // "20000000263"
    // HCJ_ST_Institution_Name
    // :
    // "Bit Insitute Of Technology,  (F3) Hindupur"
    // HCJ_ST_Phone_Number
    // :
    // "915244555255"
    // HCJ_ST_Score_Grade
    // :
    // "99"
    // HCJ_ST_Score_Grade_Type
    // :
    // "grade"
    // HCJ_ST_Seeking_Internship
    // :
    // false
    // HCJ_ST_Student_Branch_Specialization
    // :
    // "Information Technology (IT)"
    // HCJ_ST_Student_City
    // :
    // "BELAGAVI"
    // HCJ_ST_Student_Country
    // :
    // "india"
    // HCJ_ST_Student_Document_Domicile
    // :
    // "India"
    // HCJ_ST_Student_Document_Number
    // :
    // "Q1234567"
    // HCJ_ST_Student_Document_Type
    // :
    // "passport"
    // HCJ_ST_Student_First_Name
    // :
    // "Omkar"
    // HCJ_ST_Student_Last_Name
    // :
    // "Walavalkar"
    // HCJ_ST_Student_Num
    // :
    // "20000000399"
    // HCJ_ST_Student_Pincode
    // :
    // "590001"
    // HCJ_ST_Student_Program_Name
    // :
    // "Engineering and Technology"
    // HCJ_ST_Student_State
    // :
    // "Karnataka"
    // HCJ_Student_Documents_Image
    // :
    const queryParams = new URLSearchParams({
      id: student.id,
      institutionNumber: student.HCJ_ST_InstituteNum,
      institutionName: student.HCJ_ST_Institution_Name,
      firstName: student.HCJ_ST_Student_First_Name,
      lastName: student.HCJ_ST_Student_Last_Name,
      email: student.HCJ_ST_Educational_Email,
      alternateEmail: student.HCJ_ST_Educational_Alternate_Email,
      phone: student.HCJ_ST_Phone_Number,
      alternatePhone: student.HCJ_ST_Alternate_Phone_Number,
      gender: student.HCJ_ST_Gender,
      dob: student.HCJ_ST_DOB,
      country: student.HCJ_ST_Student_Country,
      pincode: student.HCJ_ST_Student_Pincode,
      state: student.HCJ_ST_Student_State,
      city: student.HCJ_ST_Student_City,
      programName: student.HCJ_ST_Student_Program_Name,
      branchSpecialization: student.branchSpecialization,
      enrollmentYear: student.HCJ_ST_Enrollment_Year,
      gradeScore: student.HCJ_ST_Score_Grade_Type,
      gradeValue: student.HCJ_ST_Score_Grade,
      documentType: student.HCJ_ST_Student_Document_Type,
      documentNumber: student.HCJ_ST_Student_Document_Number,
      documentDomicile: student.HCJ_ST_Student_Document_Domicile,
      address: student.HCJ_ST_Address,
      classOfYear: student.HCJ_ST_Class_Of_Year,
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
            {ability.can("update", "Student") ? (
              <Button
                className="w-full border bg-primary py-2 px-4 rounded-md"
                onClick={handleEdit}>
                Edit
              </Button>
            ) : (
              <Button
                disabled
                className="w-full border bg-primary py-2 px-4 rounded-md">
                Edit
              </Button>
            )}
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
                {ability.can("update", "Student") ? (
                  <Button
                    className="w-full border bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                    onClick={() => setDeleteStudentId(student.id)} // ✅ Store student ID before delete
                  >
                    Delete Profile
                  </Button>
                ) : (
                  <Button
                    className="w-full border bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                    disabled>
                    Delete Profile
                  </Button>
                )}
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
                    className="bg-red-600 text-white hover:bg-red-700">
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
              {GENDER_ROLES[student.gender] || "Unknown"}
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
