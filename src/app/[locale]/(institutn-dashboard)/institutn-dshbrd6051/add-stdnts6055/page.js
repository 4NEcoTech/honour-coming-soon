// "use client";
// import React, { useEffect, useState } from "react";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import useInstitution from "@/hooks/useInstitution";
// import { Link, useRouter } from "@/i18n/routing";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";
// import { CalendarIcon, Loader2, Upload } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { useSearchParams } from "next/navigation";
// import { Controller, useForm } from "react-hook-form";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Swal from "sweetalert2";
// import * as z from "zod";

// // Define validation schema
// const studentSchema = z.object({
//   HCJ_ST_InstituteNum: z.string().nonempty("Institution number is required."),
//   HCJ_ST_Institution_Name: z.string().nonempty("Institution name is required."),
//   HCJ_ST_Student_First_Name: z.string().nonempty("First name is required."),
//   HCJ_ST_Student_Last_Name: z.string().nonempty("Last name is required."),
//   HCJ_ST_Educational_Email: z.string().email("Invalid email address."),
//   HCJ_ST_Phone_Number: z.string().nonempty("Phone number is required."),
//   HCJ_ST_Gender: z.string().nonempty("Gender is required."),
//   HCJ_ST_DOB: z.date({
//     required_error: "Date of birth is required.",
//   }),
//   HCJ_ST_Student_Country: z.string().nonempty("Country is required."),
//   HCJ_ST_Student_Pincode: z.string().nonempty("Pin code is required."),
//   HCJ_ST_Student_State: z.string().nonempty("State is required."),
//   HCJ_ST_Student_City: z.string().nonempty("City is required."),
//   HCJ_ST_Address: z.string().nonempty("Address is required."),
//   HCJ_ST_Enrollment_Year: z
//     .string()
//     .nonempty("Program Enrolled Year is required."),
//   HCJ_ST_Student_Program_Name: z.string().nonempty("Program Name is required."),
//   HCJ_ST_Score_Grade_Type: z.string().optional(),
//   HCJ_ST_Score_Grade: z.string().optional(),
//   HCJ_ST_Student_Document_Domicile: z.string().optional(),
//   HCJ_ST_Student_Document_Type: z.string().optional(),
//   HCJ_ST_Student_Document_Number: z.string().optional(),
//   HCJ_ST_Educational_Alternate_Email: z
//     .string()
//     .email("Invalid alternate email")
//     .optional(),
//   HCJ_ST_Alternate_Phone_Number: z.string().optional(),
//   HCJ_ST_Class_Of_Year: z.string().nonempty("Class year is required."),
//   HCJ_ST_Student_Branch_Specialization: z
//     .string()
//     .nonempty("Branch is required."),
//   photo: z.any().optional(),
// });

// // Specialization data structure
// const specializationData = [
//   {
//     category: "Engineering and Technology",
//     specializations: [
//       "Computer Science Engineering (CSE)",
//       "Information Technology (IT)",
//       "Electronics and Communication Engineering (ECE)",
//       "Electrical and Electronics Engineering (EEE)",
//       "Mechanical Engineering",
//       "Civil Engineering",
//       "Chemical Engineering",
//       "Biotechnology",
//       "Aerospace Engineering",
//       "Automobile Engineering",
//       "Artificial Intelligence and Machine Learning (AI/ML)",
//       "Data Science and Analytics",
//       "Robotics and Automation",
//       "Environmental Engineering",
//       "Petroleum Engineering",
//       "Marine Engineering",
//       "Mechatronics Engineering",
//       "Textile Engineering",
//       "Agricultural Engineering",
//       "Mining Engineering",
//     ],
//   },
//   {
//     category: "Management and Business Administration",
//     specializations: [
//       "Finance",
//       "Marketing",
//       "Human Resource Management (HRM)",
//       "Operations and Supply Chain Management",
//       "International Business",
//       "Business Analytics",
//       "Entrepreneurship",
//       "Digital Marketing",
//       "Healthcare Management",
//       "Hospitality and Tourism Management",
//     ],
//   },
//   {
//     category: "Arts, Humanities, and Social Sciences",
//     specializations: [
//       "Psychology",
//       "Sociology",
//       "Political Science",
//       "History",
//       "Geography",
//       "Economics",
//       "English Literature",
//       "Philosophy",
//       "International Relations",
//       "Social Work",
//     ],
//   },
//   {
//     category: "Science",
//     specializations: [
//       "Physics",
//       "Chemistry",
//       "Mathematics",
//       "Biology",
//       "Biotechnology",
//       "Microbiology",
//       "Environmental Science",
//       "Zoology",
//       "Botany",
//       "Forensic Science",
//       "Data Science",
//       "Computational Sciences",
//     ],
//   },
//   {
//     category: "Commerce and Finance",
//     specializations: [
//       "Accounting and Auditing",
//       "Taxation",
//       "Financial Management",
//       "Investment Banking",
//       "Actuarial Science",
//       "Business Economics",
//       "Banking and Insurance",
//       "Corporate Law",
//     ],
//   },
//   {
//     category: "Design and Creative Arts",
//     specializations: [
//       "Fashion Design",
//       "Interior Design",
//       "Graphic Design",
//       "Animation and Multimedia",
//       "Product Design",
//       "Industrial Design",
//       "Game Design",
//       "Fine Arts",
//     ],
//   },
//   {
//     category: "Law",
//     specializations: [
//       "Corporate Law",
//       "Criminal Law",
//       "Intellectual Property Law",
//       "International Law",
//       "Environmental Law",
//       "Cyber Law",
//     ],
//   },
//   {
//     category: "Education and Teaching",
//     specializations: [
//       "Primary and Secondary Education",
//       "Special Education",
//       "Educational Technology",
//       "Curriculum and Instruction",
//     ],
//   },
//   {
//     category: "Medical and Health Sciences",
//     specializations: [
//       "Medicine (MBBS)",
//       "Dental Sciences (BDS)",
//       "Ayurveda (BAMS)",
//       "Homeopathy (BHMS)",
//       "Unani Medicine (BUMS)",
//       "Veterinary Science (BVSc)",
//       "Nursing",
//       "Pharmacy (BPharm)",
//       "Physiotherapy",
//       "Medical Laboratory Technology",
//       "Public Health and Epidemiology",
//       "Optometry",
//       "Clinical Research",
//       "Nutrition and Dietetics",
//     ],
//   },
//   {
//     category: "Other Specialized Fields",
//     specializations: [
//       "Journalism and Mass Communication",
//       "Film and Television Production",
//       "Event Management",
//       "Sports Management",
//       "Aviation and Aeronautics",
//       "Ethics and Governance",
//       "Renewable Energy",
//       "Library and Information Science",
//     ],
//   },
// ];

// // Helper function to convert to sentence case
// const toSentenceCase = (str) => {
//   if (!str) return "";
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// };

// export default function AddStudentPage() {
//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(studentSchema),
//   });

//   const router = useRouter();
//   // Update the state variables at the top of the component to include countries and program-related states
//   const [documentTypes, setDocumentTypes] = useState([]);
//   const [stateData, setStateData] = useState("");
//   const [cityData, setCityData] = useState("");
//   const [isLoadingLocation, setIsLoadingLocation] = useState(false);
//   const [countries, setCountries] = useState([]);
//   const [filteredSpecializations, setFilteredSpecializations] =
//     useState(specializationData);
//   const [selectedProgram, setSelectedProgram] = useState("");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const { data: session, status } = useSession();
//   const companyId = session?.user?.companyId; // or whatever field you use
//   const { institutionData, loading, error } = useInstitution(companyId);

//   // console.log(session);

//   // Update the fetchDocumentDetails function to fetch countries as well
//   const fetchDocumentDetails = async (countryCode) => {
//     try {
//       const response = await fetch("/api/global/v1/gblArET90004FtchDcmntDtls");
//       const data = await response.json();

//       if (data && data.documentDetails) {
//         // Get unique countries from the API response
//         const uniqueCountries = [
//           ...new Set(
//             data.documentDetails.map((doc) => doc.relatedCountry.toLowerCase())
//           ),
//         ];
//         setCountries(uniqueCountries);

//         // Filter documents for the selected country
//         const countryDocuments = data.documentDetails.filter(
//           (doc) =>
//             doc.relatedCountry.toLowerCase() === countryCode.toLowerCase()
//         );

//         if (countryDocuments.length > 0) {
//           setDocumentTypes(countryDocuments);
//         }

//         // Auto-fill the Document Domicile field with the selected country
//         setValue(
//           "HCJ_ST_Student_Document_Domicile",
//           toSentenceCase(countryCode)
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching document details:", error);
//     }
//   };

//   // Add useEffect to fetch countries on component mount
//   useEffect(() => {
//     // Set default country to India
//     setValue("HCJ_ST_Student_Country", "india");
//     setValue("HCJ_ST_Student_Document_Domicile", "India");

//     // Fetch document details and countries
//     fetchDocumentDetails("india");
//   }, [setValue]);

//   // Add this function to fetch location data by pincode
//   const fetchLocationByPincode = async (pincode) => {
//     if (pincode.length !== 6) return;

//     setIsLoadingLocation(true);
//     try {
//       const response = await fetch(
//         `/api/global/v1/gblArET90003FtchPinCdDtls?pincode=${pincode}`
//       );
//       const data = await response.json();

//       if (data.success && data.data) {
//         // Set state and city from API response
//         setStateData(data.data.state || "");
//         setCityData(data.data.city || "");

//         // Update form values
//         setValue("HCJ_ST_Student_State", data.data.state || "");
//         setValue("HCJ_ST_Student_City", data.data.city || "");
//       }
//     } catch (error) {
//       console.error("Error fetching location data:", error);
//     } finally {
//       setIsLoadingLocation(false);
//     }
//   };

//   // Update the filterSpecializationsByProgram function to properly filter specializations
//   const filterSpecializationsByProgram = (programName) => {
//     if (!programName) {
//       // If no program is selected, show all specializations
//       setFilteredSpecializations(specializationData);
//       return;
//     }

//     // Convert program name to lowercase for case-insensitive matching
//     const lowerProgramName = programName.toLowerCase();

//     // Find matching categories based on program name keywords
//     const filtered = specializationData.filter((category) => {
//       // Check if program name contains the category name or vice versa
//       return (
//         category.category.toLowerCase().includes(lowerProgramName) ||
//         lowerProgramName.includes(category.category.toLowerCase()) ||
//         // Check if program name matches any specialization
//         category.specializations.some(
//           (spec) =>
//             spec.toLowerCase().includes(lowerProgramName) ||
//             lowerProgramName.includes(spec.toLowerCase())
//         )
//       );
//     });

//     // If no matches found, show all data
//     setFilteredSpecializations(
//       filtered.length > 0 ? filtered : specializationData
//     );
//   };

//   const searchParams = useSearchParams();
//   const studentId = searchParams.get("id"); // Get student ID from query params

//   useEffect(() => {
//     if (studentId) {
//       setValue(
//         "HCJ_ST_InstituteNum",
//         searchParams.get("institutionNumber") || ""
//       );
//       setValue(
//         "HCJ_ST_Institution_Name",
//         searchParams.get("institutionName") || ""
//       );
//       setValue(
//         "HCJ_ST_Student_First_Name",
//         searchParams.get("firstName") || ""
//       );
//       setValue("HCJ_ST_Student_Last_Name", searchParams.get("lastName") || "");
//       setValue("HCJ_ST_Educational_Email", searchParams.get("email") || "");
//       setValue("HCJ_ST_Phone_Number", searchParams.get("phone") || "");
//       const genderMap = {
//         "01": "Male",
//         "02": "Female",
//         "03": "Others",
//       };
//       const genderValue = searchParams.get("gender");
//       setValue("HCJ_ST_Gender", genderMap[genderValue] || "Unknown");
//       setValue("HCJ_ST_DOB", searchParams.get("dob") || "");
//       setValue(
//         "HCJ_ST_Student_Country",
//         searchParams.get("country") || "India"
//       );
//       setValue("HCJ_ST_Student_Pincode", searchParams.get("pincode") || "");
//       setValue("HCJ_ST_Student_State", searchParams.get("state") || "");
//       setValue("HCJ_ST_Student_City", searchParams.get("city") || "");
//       setValue("HCJ_ST_Address", searchParams.get("address") || "");
//       setValue(
//         "HCJ_ST_Enrollment_Year",
//         searchParams.get("enrollmentYear") || ""
//       );
//       setValue(
//         "HCJ_ST_Student_Program_Name",
//         searchParams.get("programName") || ""
//       );
//       setValue(
//         "HCJ_ST_Student_Branch_Specialization",
//         searchParams.get("specialization") || ""
//       );
//       setValue("HCJ_ST_Class_Of_Year", searchParams.get("classOfYear") || "");
//       setValue("HCJ_ST_Score_Grade_Type", searchParams.get("gradeScore") || "");
//       setValue("HCJ_ST_Score_Grade", searchParams.get("gradeValue") || "");
//       setValue(
//         "HCJ_ST_Student_Document_Type",
//         searchParams.get("documentType") || ""
//       );
//       setValue(
//         "HCJ_ST_Student_Document_Number",
//         searchParams.get("documentNumber") || ""
//       );

//       // Handle Date conversion from string to Date object
//       const dob = searchParams.get("dob");
//       if (dob) {
//         setValue("HCJ_ST_DOB", new Date(dob));
//       }
//     }
//   }, [searchParams, setValue, studentId]);

//   useEffect(() => {
//     if (institutionData) {
//       reset({
//         HCJ_ST_Institution_Name: institutionData.CD_Company_Name || "",
//         HCJ_ST_InstituteNum: institutionData.CD_Company_Num || "",
//       });
//     }
//   }, [institutionData]);

//   const onSubmit = async (formData) => {
//     try {
//       const data = new FormData();

//       // Append form fields to FormData
//       Object.keys(formData).forEach((key) => {
//         if (key === "photo" && formData.photo.length > 0) {
//           data.append("photo", formData.photo[0]); // Handle photo upload
//         } else if (
//           key === "HCJ_ST_DOB" &&
//           formData.HCJ_ST_DOB instanceof Date
//         ) {
//           data.append(
//             "HCJ_ST_DOB",
//             formData.HCJ_ST_DOB.toISOString().split("T")[0] // Convert to YYYY-MM-DD
//           );
//         } else {
//           data.append(key, formData[key]);
//         }
//       });

//       // 🔹 Determine if it's an edit (PATCH) or a new student (POST)
//       const isEditing = Boolean(studentId);
//       const apiUrl = isEditing
//         ? `/api/institution/v1/hcjBrBT60552ManageStudents?id=${studentId}` // PATCH for updating
//         : `/api/institution/v1/hcjBrBT60551AddStudents`; // POST for new student

//       const response = await fetch(apiUrl, {
//         method: isEditing ? "PATCH" : "POST",
//         body: data,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || "Error saving student details");
//       }

//       //  Success Alert with Redirection
//       Swal.fire({
//         icon: "success",
//         title: isEditing
//           ? "Student updated successfully!"
//           : "Student added successfully!",
//         text: "What would you like to do next?",
//         showCancelButton: true,
//         confirmButtonText: isEditing
//           ? "Go to Dashboard"
//           : "Add Another Student",
//         cancelButtonText: "Go to Dashboard",
//         reverseButtons: true,
//       }).then((result) => {
//         reset(); // Reset the form
//         if (result.isConfirmed && !isEditing) {
//           router.push("/institutn-dshbrd6051/add-stdnts6055");
//         } else {
//           router.push("/institutn-dshbrd6051");
//         }
//       });
//     } catch (error) {
//       console.error("Error saving student details:", error);

//       //  Error Handling
//       Swal.fire({
//         icon: "error",
//         title: "Failed to save student details",
//         text: error.message || "Please try again.",
//         showCancelButton: true,
//         confirmButtonText: "Retry",
//         cancelButtonText: "Go to Dashboard",
//         reverseButtons: true,
//       }).then((result) => {
//         if (result.dismiss === Swal.DismissReason.cancel) {
//           router.push("/institutn-dshbrd6051");
//         }
//       });
//     }
//   };

//   return (
//     <div className="flex items-start min-h-screen justify-center mt-10 sm:mt-20 dark:bg-gray-900 pb-20">
//       <div className="w-full max-w-4xl rounded-lg border border:gray dark:shadow-lg p-8 bg-white dark:bg-gray-800">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-semibold text-primary dark:text-blue-400">
//             Add Student Data
//           </h1>
//           <Link href="stdnt-blk-imprt6056">
//             <Button className="">Bulk Import</Button>
//           </Link>
//         </div>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Institution Details */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Education Institution Number{" "}
//                 <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="text"
//                 placeholder="Institute Number"
//                 readOnly
//                 {...register("HCJ_ST_InstituteNum")}
//                 className={`${
//                   errors.HCJ_ST_InstituteNum ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//               {errors.HCJ_ST_InstituteNum && (
//                 <p className="text-red-500 text-sm">
//                   {errors.HCJ_ST_InstituteNum.message}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Education Institution Name{" "}
//                 <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="text"
//                 placeholder="Institute Name"
//                 readOnly
//                 {...register("HCJ_ST_Institution_Name")}
//                 className={`${
//                   errors.HCJ_ST_Institution_Name ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//             </div>
//           </div>

//           {/* Student Name */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student First Name <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="text"
//                 placeholder="First Name"
//                 {...register("HCJ_ST_Student_First_Name")}
//                 className={`${
//                   errors.HCJ_ST_Student_First_Name ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student Last Name <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="text"
//                 placeholder="Last Name"
//                 {...register("HCJ_ST_Student_Last_Name")}
//                 className={`${
//                   errors.HCJ_ST_Student_Last_Name ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//             </div>
//           </div>

//           {/* Contact Info */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s Educational Institution Email ID{" "}
//                 <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="email"
//                 placeholder="Institution Email"
//                 {...register("HCJ_ST_Educational_Email")}
//                 className={`${
//                   errors.HCJ_ST_Educational_Email ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s Alternate Email ID <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="email"
//                 placeholder="Alternate Email"
//                 {...register("HCJ_ST_Educational_Alternate_Email")}
//                 className="dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s Phone Number{" "}
//                 <span className="text-destructive">*</span>
//               </label>
//               <Controller
//                 name="HCJ_ST_Phone_Number"
//                 control={control}
//                 render={({ field }) => (
//                   <PhoneInput
//                     {...field}
//                     country={"in"}
//                     inputClass={`${
//                       errors.HCJ_ST_Phone_Number ? "border-red-500" : ""
//                     } dark:bg-gray-700 dark:text-white w-full`}
//                     containerClass="w-full"
//                     buttonClass="dark:bg-gray-600"
//                     dropdownClass="dark:bg-gray-700 dark:text-white"
//                     inputStyle={{
//                       width: "100%",
//                     }}
//                   />
//                 )}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s Alternate Phone No
//               </label>
//               <Controller
//                 name="HCJ_ST_Alternate_Phone_Number"
//                 control={control}
//                 render={({ field }) => (
//                   <PhoneInput
//                     {...field}
//                     country={"in"}
//                     inputClass="dark:bg-gray-700 dark:text-white"
//                     containerClass="w-full"
//                     buttonClass="dark:bg-gray-600"
//                     dropdownClass="dark:bg-gray-700 dark:text-white"
//                     inputStyle={{
//                       width: "100%",
//                     }}
//                   />
//                 )}
//               />
//             </div>
//           </div>

//           {/* Gender and DOB */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Gender <span className="text-destructive">*</span>
//               </label>
//               <Select
//                 onValueChange={(value) => setValue("HCJ_ST_Gender", value)}>
//                 <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                   <SelectValue placeholder="Select Gender" />
//                 </SelectTrigger>
//                 <SelectContent className="dark:bg-gray-800">
//                   <SelectItem value="01">Male</SelectItem>
//                   <SelectItem value="02">Female</SelectItem>
//                   <SelectItem value="03">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s Date of Birth{" "}
//                 <span className="text-destructive">*</span>
//               </label>
//               <Controller
//                 control={control}
//                 name="HCJ_ST_DOB"
//                 render={({ field }) => (
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="w-full justify-start text-left">
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {selectedDate
//                           ? format(selectedDate, "PPP")
//                           : "Pick a date"}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent>
//                       <Calendar
//                         mode="single"
//                         selected={selectedDate}
//                         onSelect={(date) => {
//                           setSelectedDate(date);
//                           setValue("HCJ_ST_DOB", date);
//                         }}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 )}
//               />
//             </div>
//           </div>

//           {/* Location */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s Country{" "}
//                 <span className="text-destructive">*</span>
//               </label>
//               <Controller
//                 name="HCJ_ST_Student_Country"
//                 control={control}
//                 defaultValue="india"
//                 render={({ field }) => (
//                   <Select
//                     value={field.value}
//                     onValueChange={(value) => {
//                       field.onChange(value);
//                       // Fetch document details based on country
//                       fetchDocumentDetails(value);
//                     }}>
//                     <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                       <SelectValue placeholder="Select Country" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800">
//                       {countries.length > 0 ? (
//                         countries.map((country, index) => (
//                           <SelectItem key={index} value={country}>
//                             {toSentenceCase(country)}
//                           </SelectItem>
//                         ))
//                       ) : (
//                         <SelectItem value="india">India</SelectItem>
//                       )}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s Pin code{" "}
//                 <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="text"
//                 placeholder="Pin code"
//                 {...register("HCJ_ST_Student_Pincode")}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   setValue("HCJ_ST_Student_Pincode", value);
//                   if (value.length === 6) {
//                     fetchLocationByPincode(value);
//                   }
//                 }}
//                 className={`${
//                   errors.HCJ_ST_Student_Pincode ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//               {isLoadingLocation && (
//                 <p className="text-xs text-primary mt-1">
//                   Fetching location data...
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* State and City */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s State <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="text"
//                 placeholder="State"
//                 value={stateData}
//                 onChange={(e) => {
//                   setStateData(e.target.value);
//                   setValue("HCJ_ST_Student_State", e.target.value);
//                 }}
//                 className={`${
//                   errors.HCJ_ST_Student_State ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s City <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="text"
//                 placeholder="City"
//                 value={cityData}
//                 onChange={(e) => {
//                   setCityData(e.target.value);
//                   setValue("HCJ_ST_Student_City", e.target.value);
//                 }}
//                 className={`${
//                   errors.HCJ_ST_Student_City ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Address <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="text"
//                 placeholder="Enter Address"
//                 {...register("HCJ_ST_Address", {
//                   required: "Address is required",
//                 })}
//                 className={`${
//                   errors.HCJ_ST_Address ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//               {errors.HCJ_ST_Address && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.HCJ_ST_Address.message}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Program Enrolled Year{" "}
//                 <span className="text-destructive">*</span>
//               </label>
//               <Input
//                 type="text"
//                 placeholder="Program Enrolled Year"
//                 {...register("HCJ_ST_Enrollment_Year")}
//                 className={`${
//                   errors.HCJ_ST_Enrollment_Year ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//             </div>
//           </div>

//           {/* Program Details */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Program Name <span className="text-destructive">*</span>
//               </label>
//               <Select
//                 onValueChange={(value) => {
//                   setValue("HCJ_ST_Student_Program_Name", value);
//                   setSelectedProgram(value);
//                   filterSpecializationsByProgram(value);
//                 }}>
//                 <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                   <SelectValue placeholder="Select Program" />
//                 </SelectTrigger>
//                 <SelectContent className="h-80 overflow-y-auto dark:bg-gray-800">
//                   {specializationData.map((data, index) => (
//                     <SelectItem key={index} value={data.category}>
//                       {data.category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Branch/Specialization{" "}
//                 <span className="text-destructive">*</span>
//               </label>
//               <Select
//                 onValueChange={(value) =>
//                   setValue("HCJ_ST_Student_Branch_Specialization", value)
//                 }>
//                 <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                   <SelectValue placeholder="Select Branch/Specialization" />
//                 </SelectTrigger>
//                 <SelectContent className="h-80 overflow-y-auto dark:bg-gray-800">
//                   {filteredSpecializations.map((category, categoryIndex) => (
//                     <React.Fragment key={`category-${categoryIndex}`}>
//                       <SelectItem
//                         value={`heading-${categoryIndex}`}
//                         disabled
//                         className="font-bold text-primary">
//                         {category.category}
//                       </SelectItem>

//                       {category.specializations.map(
//                         (specialization, specIndex) => (
//                           <SelectItem
//                             key={`spec-${categoryIndex}-${specIndex}`}
//                             value={`${categoryIndex}-${specialization
//                               .toLowerCase()
//                               .replace(/\s+/g, "_")}`}>
//                             {specialization}
//                           </SelectItem>
//                         )
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Documents */}
//           <div className="grid grid-cols-2 gap-6">
//             <div className="grid grid-col-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                   Grade/Score
//                 </label>
//                 <Select
//                   onValueChange={(value) =>
//                     setValue("HCJ_ST_Score_Grade_Type", value)
//                   }>
//                   <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                     <SelectValue placeholder="CGPA" />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800">
//                     <SelectItem value="grade">Grade</SelectItem>
//                     <SelectItem value="score">Score</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                   Grade/Score Value
//                 </label>
//                 <Input
//                   type="text"
//                   placeholder="8.5"
//                   {...register("HCJ_ST_Score_Grade")}
//                   className={`${
//                     errors.HCJ_ST_Score_Grade ? "border-red-500" : ""
//                   } dark:bg-gray-700 dark:text-white`}
//                 />
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                   Class of Year <span className="text-destructive">*</span>
//                 </label>
//                 <Input
//                   type="text"
//                   placeholder="Class Year"
//                   {...register("HCJ_ST_Class_Of_Year")}
//                   className={`${
//                     errors.HCJ_ST_Class_Of_Year ? "border-red-500" : ""
//                   } dark:bg-gray-700 dark:text-white`}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Grade/Score */}
//           <div className="grid grid-cols-2 gap-6">

//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s Document Domicile{" "}
//               </label>
//               <Input
//                 type="text"
//                 placeholder="Document Domicile"
//                 {...register("HCJ_ST_Student_Document_Domicile")}
//                 className={`${
//                   errors.HCJ_ST_Student_Document_Domicile
//                     ? "border-red-500"
//                     : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s Document Type{" "}
//               </label>
//               <Select
//                 onValueChange={(value) =>
//                   setValue("HCJ_ST_Student_Document_Type", value)
//                 }>
//                 <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                   <SelectValue placeholder="Select Document Type" />
//                 </SelectTrigger>
//                 <SelectContent className="dark:bg-gray-800">
//                   {documentTypes.length > 0 && documentTypes[0]?.document ? (
//                     documentTypes[0].document.map((doc, index) => (
//                       <SelectItem key={index} value={doc.value}>
//                         {toSentenceCase(doc.label)}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <>
//                       <SelectItem value="passport">Passport</SelectItem>
//                       <SelectItem value="voter_id">Voter ID</SelectItem>
//                       <SelectItem value="aadhaar">Aadhaar</SelectItem>
//                       <SelectItem value="pan_card">PAN Card</SelectItem>
//                       <SelectItem value="driving_license">
//                         Driving License
//                       </SelectItem>
//                     </>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Alternate Contact and Document Number */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Student&apos;s Document Number{" "}
//               </label>
//               <Input
//                 type="text"
//                 placeholder="Document Number"
//                 {...register("HCJ_ST_Student_Document_Number")}
//                 className={`${
//                   errors.HCJ_ST_Student_Document_Number ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Upload Photo of Document{" "}
//                 {/* <span className="text-destructive">*</span> */}
//               </label>
//               <div className="border-2 border-dashed border-primary dark:border-gray-600 rounded-lg p-6 text-center">
//                 <input
//                   type="file"
//                   className="hidden"
//                   id="file-upload"
//                   accept="image/*"
//                   {...register("photo")}
//                 />
//                 <label
//                   htmlFor="file-upload"
//                   className="cursor-pointer flex flex-col items-center justify-center">
//                   <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
//                   <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//                     Click here to upload your file or drag and drop
//                   </span>
//                   <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                     Supported formats: JPG, PNG
//                   </span>
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex flex-col items-center text-center space-y-4">
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-64 px-6 py-2 text-white bg-primary dark:bg-blue-600 rounded-md hover:bg-primary/90 dark:hover:bg-blue-700">
//               {isSubmitting && <Loader2 className="animate-spin" />}
//               Add Student
//             </Button>
//           </div>
//         </form>

//         <ToastContainer />
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";

import { useAbility } from "@/Casl/CaslContext";
import { ProfilePhotoUpload } from "@/components/image-upload";
import { YearSelect } from "@/components/select-year";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import useInstitution from "@/hooks/useInstitution";
import { Link, useRouter } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import * as z from "zod";
// Define validation schema
const studentSchema = (t) =>
  z.object({
    HCJ_ST_InstituteNum: z.string().nonempty(t("6055_1")),
    HCJ_ST_Institution_Name: z.string().nonempty(t("6055_2")),
    HCJ_ST_Student_First_Name: z.string().nonempty(t("6055_3")),
    HCJ_ST_Student_Last_Name: z.string().nonempty(t("6055_4")),
    HCJ_ST_Educational_Email: z.string().email(t("6055_5")),
    HCJ_ST_Phone_Number: z.string().nonempty(t("6055_6")),
    HCJ_ST_Gender: z.string().nonempty(t("6055_6")),
    HCJ_ST_DOB: z.date({
      required_error: t("6055_8"),
    }),
    HCJ_ST_Student_Country: z.string().nonempty(t("6055_9")),
    HCJ_ST_Student_Pincode: z.string().nonempty(t("6055_10")),
    HCJ_ST_Student_State: z.string().nonempty(t("6055_11")),
    HCJ_ST_Student_City: z.string().nonempty(t("6055_12")),
    HCJ_ST_Address: z.string().nonempty(t("6055_13")),
    HCJ_ST_Enrollment_Year: z
      .number()
      .min(1900, t("6055_14"))
      .max(new Date().getFullYear(), t("6055_15")),
    HCJ_ST_Student_Program_Name: z.string().nonempty(t("6055_16")),
    HCJ_ST_Score_Grade_Type: z.string().optional(),
    HCJ_ST_Score_Grade: z.string().optional(),
    HCJ_ST_Student_Document_Domicile: z.string().optional(),
    HCJ_ST_Student_Document_Type: z.string().optional(),
    HCJ_ST_Student_Document_Number: z.string().optional(),
    HCJ_ST_Educational_Alternate_Email: z
      .string()
      .email(t("6055_17"))
      .optional(),
    HCJ_ST_Alternate_Phone_Number: z.string().optional(),
    HCJ_ST_Class_Of_Year: z
      .number()
      .min(1900, t("6055_14"))
      .max(new Date().getFullYear(), t("6055_15")),
    HCJ_ST_Student_Branch_Specialization: z.string().nonempty(t("6055_18")),
    photo: z.any().optional(),
  });

// Specialization data structure
const specializationData = [
  {
    category: "Engineering and Technology",
    specializations: [
      "Computer Science Engineering (CSE)",
      "Information Technology (IT)",
      "Electronics and Communication Engineering (ECE)",
      "Electrical and Electronics Engineering (EEE)",
      "Mechanical Engineering",
      "Civil Engineering",
      "Chemical Engineering",
      "Biotechnology",
      "Aerospace Engineering",
      "Automobile Engineering",
      "Artificial Intelligence and Machine Learning (AI/ML)",
      "Data Science and Analytics",
      "Robotics and Automation",
      "Environmental Engineering",
      "Petroleum Engineering",
      "Marine Engineering",
      "Mechatronics Engineering",
      "Textile Engineering",
      "Agricultural Engineering",
      "Mining Engineering",
    ],
  },
  {
    category: "Management and Business Administration",
    specializations: [
      "Finance",
      "Marketing",
      "Human Resource Management (HRM)",
      "Operations and Supply Chain Management",
      "International Business",
      "Business Analytics",
      "Entrepreneurship",
      "Digital Marketing",
      "Healthcare Management",
      "Hospitality and Tourism Management",
    ],
  },
  {
    category: "Arts, Humanities, and Social Sciences",
    specializations: [
      "Psychology",
      "Sociology",
      "Political Science",
      "History",
      "Geography",
      "Economics",
      "English Literature",
      "Philosophy",
      "International Relations",
      "Social Work",
    ],
  },
  {
    category: "Science",
    specializations: [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology",
      "Biotechnology",
      "Microbiology",
      "Environmental Science",
      "Zoology",
      "Botany",
      "Forensic Science",
      "Data Science",
      "Computational Sciences",
    ],
  },
  {
    category: "Commerce and Finance",
    specializations: [
      "Accounting and Auditing",
      "Taxation",
      "Financial Management",
      "Investment Banking",
      "Actuarial Science",
      "Business Economics",
      "Banking and Insurance",
      "Corporate Law",
    ],
  },
  {
    category: "Design and Creative Arts",
    specializations: [
      "Fashion Design",
      "Interior Design",
      "Graphic Design",
      "Animation and Multimedia",
      "Product Design",
      "Industrial Design",
      "Game Design",
      "Fine Arts",
    ],
  },
  {
    category: "Law",
    specializations: [
      "Corporate Law",
      "Criminal Law",
      "Intellectual Property Law",
      "International Law",
      "Environmental Law",
      "Cyber Law",
    ],
  },
  {
    category: "Education and Teaching",
    specializations: [
      "Primary and Secondary Education",
      "Special Education",
      "Educational Technology",
      "Curriculum and Instruction",
    ],
  },
  {
    category: "Medical and Health Sciences",
    specializations: [
      "Medicine (MBBS)",
      "Dental Sciences (BDS)",
      "Ayurveda (BAMS)",
      "Homeopathy (BHMS)",
      "Unani Medicine (BUMS)",
      "Veterinary Science (BVSc)",
      "Nursing",
      "Pharmacy (BPharm)",
      "Physiotherapy",
      "Medical Laboratory Technology",
      "Public Health and Epidemiology",
      "Optometry",
      "Clinical Research",
      "Nutrition and Dietetics",
    ],
  },
  {
    category: "Other Specialized Fields",
    specializations: [
      "Journalism and Mass Communication",
      "Film and Television Production",
      "Event Management",
      "Sports Management",
      "Aviation and Aeronautics",
      "Ethics and Governance",
      "Renewable Energy",
      "Library and Information Science",
    ],
  },
];

// Helper function to convert to sentence case
const toSentenceCase = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function AddStudentPage() {
  const tForm = useTranslations("formErrors");
  const tError = useTranslations("errorCode");
  const form = useForm({
    resolver: zodResolver(studentSchema(tForm)),
    mode: "onChange",
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const ability = useAbility();
  const router = useRouter();
  // Update the state variables at the top of the component to include countries and program-related states
  const [documentTypes, setDocumentTypes] = useState([]);
  const [stateData, setStateData] = useState("");
  const [cityData, setCityData] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [countries, setCountries] = useState([]);
  const [filteredSpecializations, setFilteredSpecializations] =
    useState(specializationData);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const { data: session, status } = useSession();
  const companyId = session?.user?.companyId; // or whatever field you use
  const { institutionData, loading, error } = useInstitution(companyId);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // console.log(session);
  const watchCountry = watch("HCJ_ST_Student_Country");

  // Update the fetchDocumentDetails function to fetch countries as well
  const fetchCountriesAndDocuments = async () => {
    try {
      const response = await fetch("/api/global/v1/gblArET90004FtchDcmntDtls");
      if (!response.ok) {
        throw new Error("Failed to fetch country and document data");
      }
      const data = await response.json();

      // Set countries
      if (data.data.countryDetails && data.data.countryDetails.length > 0) {
        setCountries(data.data.countryDetails);
      }

      // Set document types directly from the response
      if (data.data.documentDetails && data.data.documentDetails.length > 0) {
        setDocumentTypes(data.data.documentDetails);
      }

      // Set India as selected country if available
      const indiaCountry = data.data.countryDetails.find(
        (country) => country.name === "India"
      );
      if (indiaCountry) {
        setValue("CCP_Contact_Person_Country", "India");
        // Set document domicile to match the country
        setValue("CCP_Contact_Person_Document_Domicile", "India");
      }
    } catch (error) {
      console.error("Error fetching country and document data:", error);
      toast({
        title: error.title || "Error",
        description:
          error.message || "Failed to load country and document data",
        variant: "destructive",
      });
    }
  };
  // // Add useEffect to fetch countries on component mount

  // Replace the filterDocumentTypesByCountry function with this updated version
  const filterDocumentTypesByCountry = (country) => {
    if (!country || !documentTypes.length) return [];

    const countryDocuments = documentTypes.find(
      (doc) =>
        doc.relatedCountry === country || doc.relatedCountryCode === country
    );

    return countryDocuments && Array.isArray(countryDocuments.document)
      ? countryDocuments.document
      : [];
  };
  useEffect(() => {
    fetchCountriesAndDocuments();
    // Set default country to India
    setValue("HCJ_ST_Student_Country", "India");
    setValue("HCJ_ST_Student_Document_Domicile", "India");

    // Fetch document details and countries
  }, []);

  // Add this function to fetch location data by pincode
  const fetchLocationByPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    setIsLoadingLocation(true);
    try {
      const response = await fetch(
        `/api/global/v1/gblArET90003FtchPinCdDtls?pincode=${pincode}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        // Set state and city from API response
        setStateData(data.data.state || "");
        setCityData(data.data.city || "");

        // Update form values
        setValue("HCJ_ST_Student_State", data.data.state || "");
        setValue("HCJ_ST_Student_City", data.data.city || "");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Update the filterSpecializationsByProgram function to properly filter specializations
  const filterSpecializationsByProgram = (programName) => {
    if (!programName) {
      // If no program is selected, show all specializations
      setFilteredSpecializations(specializationData);
      return;
    }

    // Convert program name to lowercase for case-insensitive matching
    const lowerProgramName = programName.toLowerCase();

    // Find matching categories based on program name keywords
    const filtered = specializationData.filter((category) => {
      // Check if program name contains the category name or vice versa
      return (
        category.category.toLowerCase().includes(lowerProgramName) ||
        lowerProgramName.includes(category.category.toLowerCase()) ||
        // Check if program name matches any specialization
        category.specializations.some(
          (spec) =>
            spec.toLowerCase().includes(lowerProgramName) ||
            lowerProgramName.includes(spec.toLowerCase())
        )
      );
    });

    // If no matches found, show all data
    setFilteredSpecializations(
      filtered.length > 0 ? filtered : specializationData
    );
  };

  const searchParams = useSearchParams();
  const studentId = searchParams.get("id"); // Get student ID from query params

  useEffect(() => {
    if (studentId) {
      setValue(
        "HCJ_ST_InstituteNum",
        searchParams.get("institutionNumber") || ""
      );
      setValue(
        "HCJ_ST_Institution_Name",
        searchParams.get("institutionName") || ""
      );
      setValue(
        "HCJ_ST_Student_First_Name",
        searchParams.get("firstName") || ""
      );
      setValue(
        "HCJ_ST_Student_Document_Domicile",
        searchParams.get("documentDomicile") || "India"
      ); //added
      // setValue("HCJ_ST_Student_City", searchParams.get("city") || ""); //added
      setValue(
        "HCJ_ST_Educational_Alternate_Email",
        searchParams.get("alternateEmail") || ""
      ); //added
      setValue("HCJ_ST_Address", searchParams.get("state") || ""); //added
      setValue(
        "HCJ_ST_Alternate_Phone_Number",
        searchParams.get("alternatePhone") || ""
      ); //added

      setValue("HCJ_ST_Student_Last_Name", searchParams.get("lastName") || "");
      setValue("HCJ_ST_Educational_Email", searchParams.get("email") || "");
      setValue("HCJ_ST_Phone_Number", searchParams.get("phone") || "");
      const genderMap = {
        "01": "Male",
        "02": "Female",
        "03": "Others",
      };
      const genderValue = searchParams.get("gender");
      console.log(genderValue, genderMap[genderValue]);
      setValue("HCJ_ST_Gender", genderValue || "");
      setValue("HCJ_ST_DOB", searchParams.get("dob") || "");
      setValue(
        "HCJ_ST_Student_Country",
        searchParams.get("country") || "India"
      );
      setValue("HCJ_ST_Student_Pincode", searchParams.get("pincode") || "");
      setValue("HCJ_ST_Student_State", searchParams.get("state") || "");
      setValue("HCJ_ST_Student_City", searchParams.get("city") || "");
      setValue("HCJ_ST_Address", searchParams.get("address") || "");
      setValue(
        "HCJ_ST_Enrollment_Year",
        searchParams.get("enrollmentYear") || ""
      );
      setValue(
        "HCJ_ST_Student_Program_Name",
        searchParams.get("programName") || ""
      );
      setValue(
        "HCJ_ST_Student_Branch_Specialization",
        searchParams.get("branchSpecialization") || ""
      );
      setValue("HCJ_ST_Class_Of_Year", searchParams.get("classOfYear") || "");
      setValue("HCJ_ST_Score_Grade_Type", searchParams.get("gradeScore") || "");
      setValue("HCJ_ST_Score_Grade", searchParams.get("gradeValue") || "");
      setValue(
        "HCJ_ST_Student_Document_Type",
        searchParams.get("documentType") || ""
      );
      setValue(
        "HCJ_ST_Student_Document_Number",
        searchParams.get("documentNumber") || ""
      );

      // Handle Date conversion from string to Date object
      const dob = searchParams.get("dob");
      if (dob) {
        setValue("HCJ_ST_DOB", new Date(dob));
      }
    }
  }, [searchParams, studentId]);

  useEffect(() => {
    if (institutionData) {
      setValue(
        "HCJ_ST_Institution_Name",
        institutionData.CD_Company_Name || ""
      );
      setValue("HCJ_ST_InstituteNum", institutionData.CD_Company_Num || "");
    }
  }, [institutionData, setValue]);

  // const handleFileUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   setIsUploading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("photo", file);

  //     const response = await fetch(
  //       "/api/institution/v1/hcjBrBT60553UploadStudentDocument",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to upload image");
  //     }

  //     const result = await response.json();
  //     setUploadedPhotoUrl(result.photoUrl);

  //     // Show success alert
  //     Swal.fire({
  //       title: "Success",
  //       text: "Registration document uploaded successfully",
  //       icon: "success",
  //       toast: true,
  //       position: "top-end",
  //       showConfirmButton: false,
  //       timer: 3000,
  //     });
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     Swal.fire({
  //       title: "Error",
  //       text: "Failed to upload image. Please try again.",
  //       icon: "error",
  //       toast: true,
  //       position: "top-end",
  //       showConfirmButton: false,
  //       timer: 3000,
  //     });
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true); // Set isUploading to true before starting upload
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch(
        "/api/institution/v1/hcjBrBT60553UploadStudentDocument",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      setUploadedPhotoUrl(result?.data?.photoUrl); // Set uploaded photo URL

      Swal.fire({
        title: result?.title,
        text: result?.message,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        title: error?.title,
        text: error?.message,
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadSuccess = (url) => {
    setUploadedPhotoUrl(url);
    // form.setValue("CCP_Contact_Person_Document_Picture", url);
    toast({
      title: tError("6055_19.title"),
      description: tError("6055_19.description"),
      variant: "default",
    });
  };

  const handleRemovePhoto = () => {
    setUploadedPhotoUrl(url);
    // form.setValue("CCP_Contact_Person_Document_Picture", "");
    toast({
      title: tError("6055_20.title"),
      description: tError("6055_20.description"),
      variant: "default",
    });
  };

  const handleUploadError = (error) => {
    toast({
      title: error.title,
      description: error.message || "Please try again with a different image",
      variant: "destructive",
    });
  };

  const handleValidationError = (error) => {
    toast({
      title: error.title,
      description: error.message,
      variant: "destructive",
    });
  };

  const onSubmit = async (formData) => {
    try {
      // Create a JSON object with all form data
      const studentData = {
        ...formData,
        HCJ_ST_DOB:
          formData.HCJ_ST_DOB instanceof Date
            ? formData.HCJ_ST_DOB.toISOString().split("T")[0]
            : formData.HCJ_ST_DOB,
        HCJ_Student_Documents_Image: uploadedPhotoUrl, // Use the uploaded image URL
      };

      // Remove the photo field as we're not sending the file anymore
      delete studentData.photo;

      // 🔹 Determine if it's an edit (PATCH) or a new student (POST)
      const isEditing = Boolean(studentId);
      const apiUrl = isEditing
        ? `/api/institution/v1/hcjBrBT60552ManageStudents?id=${studentId}` // PATCH for updating
        : `/api/institution/v1/hcjBrBT60551AddStudents`; // POST for new student

      const response = await fetch(apiUrl, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error saving student details");
      }

      //  Success Alert with Redirection
      Swal.fire({
        icon: "success",
        title: isEditing ? tError("6055_22.title") : tError("6055_23.title"),
        text: isEditing
          ? tError("6055_22.description")
          : tError("6055_23.description"),
        showCancelButton: true,
        confirmButtonText: isEditing
          ? "Go to Dashboard"
          : "Add Another Student",
        cancelButtonText: "Go to Dashboard",
        reverseButtons: true,
      }).then((result) => {
        reset(); // Reset the form
        setUploadedPhotoUrl(""); // Reset the uploaded photo URL
        if (result.isConfirmed && !isEditing) {
          router.push("/institutn-dshbrd6051/add-stdnts6055");
        } else {
          router.push("/institutn-dshbrd6051");
        }
      });
    } catch (error) {
      console.error("Error saving student details:", error);

      //  Error Handling
      Swal.fire({
        icon: "error",
        title: error?.title,
        text: error?.message || "Please try again.",
        showCancelButton: true,
        confirmButtonText: "Retry",
        cancelButtonText: "Go to Dashboard",
        reverseButtons: true,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          router.push("/institutn-dshbrd6051");
        }
      });
    }
  };
  console.log("funFry", form.getValues("HCJ_ST_Gender"));
  // console.log(form.getValues("HCJ_ST_DOB"));

  return (
    <div className="flex items-start min-h-screen justify-center mt-10 sm:mt-20 dark:bg-gray-900 pb-20">
      <div className="w-full max-w-4xl rounded-lg border border:gray dark:shadow-lg p-8 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-primary dark:text-blue-400">
            Add Student Data
          </h1>
          <Link href="stdnt-blk-imprt6056">
            <Button>Bulk Import</Button>
          </Link>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Institution Details */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="HCJ_ST_InstituteNum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Education Institution Number <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="HCJ_ST_Institution_Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Education Institution Name <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Student Name */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="HCJ_ST_Student_First_Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Student First Name <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="HCJ_ST_Student_Last_Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Student Last Name <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="HCJ_ST_Educational_Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Student&apos;s Educational Institution Email ID{" "}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Institution Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="HCJ_ST_Educational_Alternate_Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student&apos;s Alternate Email ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Alternate Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-2 gap-6 w-full">
              <FormField
                className="w-full"
                control={form.control}
                name="HCJ_ST_Phone_Number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Student&apos;s Phone Number <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        country={"in"}
                        value={field.value}
                        onChange={field.onChange}
                        inputClass="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="HCJ_ST_Alternate_Phone_Number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Student&apos;s Alternate Phone No</FormLabel>
                    <FormControl>
                      <PhoneInput
                        country={"in"}
                        value={field.value}
                        onChange={field.onChange}
                        inputClass="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender and DOB */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="HCJ_ST_Gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Gender <RequiredIndicator />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="01">Male</SelectItem>
                        <SelectItem value="02">Female</SelectItem>
                        <SelectItem value="03">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="HCJ_ST_DOB"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Student&apos;s Date of Birth <RequiredIndicator />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setSelectedDate(date);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="HCJ_ST_Student_Country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Student&apos;s Country <RequiredIndicator />
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        fetchCountriesAndDocuments(value);
                      }}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country, ind) => (
                          <SelectItem
                            key={`${ind}_${country}`}
                            value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="HCJ_ST_Student_Pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Student&apos;s Pin code <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pin code"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.length === 6) {
                            fetchLocationByPincode(e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    {isLoadingLocation && (
                      <p className="text-xs text-primary mt-1">
                        Fetching location data...
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* State and City */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="HCJ_ST_Student_State"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Student&apos;s State <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="State"
                        value={stateData}
                        onChange={(e) => {
                          setStateData(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="HCJ_ST_Student_City"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Student&apos;s City <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City"
                        value={cityData}
                        onChange={(e) => {
                          setCityData(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address and Enrollment Year */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="HCJ_ST_Address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="HCJ_ST_Enrollment_Year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Program Enrolled Year <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <YearSelect {...field} startYear={2000} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Program Details */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="HCJ_ST_Student_Program_Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Program Name <RequiredIndicator />
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedProgram(value);
                        filterSpecializationsByProgram(value);
                      }}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-80 overflow-y-auto">
                        {specializationData.map((data) => (
                          <SelectItem key={data.category} value={data.category}>
                            {data.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="HCJ_ST_Student_Branch_Specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Branch/Specialization <RequiredIndicator />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Branch/Specialization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-80 overflow-y-auto">
                        {filteredSpecializations.map((category) => (
                          <React.Fragment key={category.category}>
                            <SelectItem
                              value={`heading-${category.category}`}
                              disabled
                              className="font-bold">
                              {category.category}
                            </SelectItem>
                            {category.specializations.map(
                              (specialization, ind) => (
                                <SelectItem
                                  key={`${specialization}-${ind}`}
                                  value={specialization.trim()}>
                                  {specialization}
                                </SelectItem>
                              )
                            )}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Grade/Score */}
            <div className="grid grid-cols-2 gap-6">
              <div className="grid grid-col-2 gap-6">
                <FormField
                  control={form.control}
                  name="HCJ_ST_Score_Grade_Type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade/Score</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="CGPA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="grade">Grade</SelectItem>
                          <SelectItem value="score">Score</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="HCJ_ST_Score_Grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade/Score Value</FormLabel>
                      <FormControl>
                        <Input placeholder="8.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="HCJ_ST_Class_Of_Year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Class of Year <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <YearSelect {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Documents */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="HCJ_ST_Student_Document_Domicile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student&apos;s Document Domicile</FormLabel>
                    <FormControl>
                      <Input placeholder="Document Domicile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="HCJ_ST_Student_Document_Type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Document Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!watchCountry}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              watchCountry
                                ? "Select document type"
                                : "Select a country first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {watchCountry &&
                          filterDocumentTypesByCountry(watchCountry)?.map(
                            (doc) => (
                              <SelectItem key={doc.value} value={doc.value}>
                                {doc.label}
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Document Upload */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="HCJ_ST_Student_Document_Number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student&apos;s Document Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Document Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormItem>
                <FormLabel>Upload Photo of Document</FormLabel>
                <div className="border-2 border-dashed rounded-lg p-6 text-center text-primary">
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer   flex flex-col items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="h-12 w-12 animate-spin" />
                    ) : (
                      <Upload className="h-12 w-12" />
                    )}
                    <span className="mt-2 text-sm">
                      {uploadedPhotoUrl
                        ? "Document uploaded successfully! Click to change"
                        : "Click here to upload your file or drag and drop"}
                    </span>
                    <span className="mt-1 text-xs">
                      Supported formats: JPG, PNG
                    </span>
                  </label>
                </div>
                {uploadedPhotoUrl && (
                  <p className="text-xs text-green-500 mt-1">
                    Document uploaded successfully!
                  </p>
                )}
              </FormItem> */}

              <ProfilePhotoUpload
                onUploadSuccess={handleUploadSuccess}
                onRemovePhoto={handleRemovePhoto}
                onUploadError={handleUploadError}
                onValidationError={handleValidationError}
                userId={session?.user?.id}
                imageTitle={"Upload Photo of Document"}
                imageDescription={""}
                uploadEndpoint="/api/institution/v1/hcjBrBT60583UploadStaffDocument"
                initialPhoto={uploadedPhotoUrl}
                onUploadStateChange={setIsUploading}
                // UploadIcon={ShieldUser}
                uploadType={"Document"}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting || isUploading}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Student
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

function RequiredIndicator() {
  return <span className="text-destructive">*</span>;
}

// }
// return (
//   <div className="flex items-start min-h-screen justify-center mt-10 sm:mt-20 dark:bg-gray-900 pb-20">
//     <div className="w-full max-w-4xl rounded-lg border border:gray dark:shadow-lg p-8 bg-white dark:bg-gray-800">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-primary dark:text-blue-400">
//           Add Student Data
//         </h1>
//         {ability.can("create", "Student") ? (
//           <Link href="stdnt-blk-imprt6056">
//             <Button className="">Bulk Import</Button>
//           </Link>
//         ) : (
//           <Button className="cursor-not-allowed" disabled>
//             Bulk Import
//           </Button>
//         )}
//       </div>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Institution Details */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Education Institution Number{" "}
//               <span className="text-destructive">*</span>
//             </label>
//             <Input
//               type="text"
//               placeholder="Institute Number"
//               readOnly
//               {...register("HCJ_ST_InstituteNum")}
//               className={`${
//                 errors.HCJ_ST_InstituteNum ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//             {errors.HCJ_ST_InstituteNum && (
//               <p className="text-red-500 text-sm">
//                 {errors.HCJ_ST_InstituteNum.message}
//               </p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Education Institution Name{" "}
//               <span className="text-destructive">*</span>
//             </label>
//             <Input
//               type="text"
//               placeholder="Institute Name"
//               readOnly
//               {...register("HCJ_ST_Institution_Name")}
//               className={`${
//                 errors.HCJ_ST_Institution_Name ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//           </div>
//         </div>

//         {/* Student Name */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student First Name <span className="text-destructive">*</span>
//             </label>
//             <Input
//               type="text"
//               placeholder="First Name"
//               {...register("HCJ_ST_Student_First_Name")}
//               className={`${
//                 errors.HCJ_ST_Student_First_Name ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student Last Name <span className="text-destructive">*</span>
//             </label>
//             <Input
//               type="text"
//               placeholder="Last Name"
//               {...register("HCJ_ST_Student_Last_Name")}
//               className={`${
//                 errors.HCJ_ST_Student_Last_Name ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//           </div>
//         </div>

//         {/* Contact Info */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s Educational Institution Email ID{" "}
//               <span className="text-destructive">*</span>
//             </label>
//             <Input
//               type="email"
//               placeholder="Institution Email"
//               {...register("HCJ_ST_Educational_Email")}
//               className={`${
//                 errors.HCJ_ST_Educational_Email ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s Alternate Email ID{" "}
//               <span className="text-destructive">*</span>
//             </label>
//             <Input
//               type="email"
//               placeholder="Alternate Email"
//               {...register("HCJ_ST_Educational_Alternate_Email")}
//               className="dark:bg-gray-700 dark:text-white"
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s Phone Number{" "}
//               <span className="text-destructive">*</span>
//             </label>
//             <Controller
//               name="HCJ_ST_Phone_Number"
//               control={control}
//               render={({ field }) => (
//                 <PhoneInput
//                   {...field}
//                   country={"in"}
//                   inputClass={`${
//                     errors.HCJ_ST_Phone_Number ? "border-red-500" : ""
//                   } dark:bg-gray-700 dark:text-white w-full`}
//                   containerClass="w-full"
//                   buttonClass="dark:bg-gray-600"
//                   dropdownClass="dark:bg-gray-700 dark:text-white"
//                   inputStyle={{
//                     width: "100%",
//                   }}
//                 />
//               )}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s Alternate Phone No
//             </label>
//             <Controller
//               name="HCJ_ST_Alternate_Phone_Number"
//               control={control}
//               render={({ field }) => (
//                 <PhoneInput
//                   {...field}
//                   country={"in"}
//                   inputClass="dark:bg-gray-700 dark:text-white"
//                   containerClass="w-full"
//                   buttonClass="dark:bg-gray-600"
//                   dropdownClass="dark:bg-gray-700 dark:text-white"
//                   inputStyle={{
//                     width: "100%",
//                   }}
//                 />
//               )}
//             />
//           </div>
//         </div>

//         {/* Gender and DOB */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Gender <span className="text-destructive">*</span>
//             </label>
//             <Select
//               onValueChange={(value) => setValue("HCJ_ST_Gender", value)}>
//               <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                 <SelectValue placeholder="Select Gender" />
//               </SelectTrigger>
//               <SelectContent className="dark:bg-gray-800">
//                 <SelectItem value="01">Male</SelectItem>
//                 <SelectItem value="02">Female</SelectItem>
//                 <SelectItem value="03">Other</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s Date of Birth{" "}
//               <span className="text-destructive">*</span>
//             </label>
//             <Controller
//               control={control}
//               name="HCJ_ST_DOB"
//               render={({ field }) => (
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-start text-left">
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {selectedDate
//                         ? format(selectedDate, "PPP")
//                         : "Pick a date"}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent>
//                     <Calendar
//                       mode="single"
//                       selected={selectedDate}
//                       onSelect={(date) => {
//                         setSelectedDate(date);
//                         setValue("HCJ_ST_DOB", date);
//                       }}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               )}
//             />
//           </div>
//         </div>

//         {/* Location */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s Country{" "}
//               <span className="text-destructive">*</span>
//             </label>
//             <Controller
//               name="HCJ_ST_Student_Country"
//               control={control}
//               defaultValue="india"
//               render={({ field }) => (
//                 <Select
//                   value={field.value}
//                   onValueChange={(value) => {
//                     field.onChange(value);
//                     // Fetch document details based on country
//                     fetchDocumentDetails(value);
//                   }}>
//                   <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                     <SelectValue placeholder="Select Country" />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800">
//                     {countries.length > 0 ? (
//                       countries.map((country, index) => (
//                         <SelectItem key={index} value={country}>
//                           {toSentenceCase(country)}
//                         </SelectItem>
//                       ))
//                     ) : (
//                       <SelectItem value="india">India</SelectItem>
//                     )}
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s Pin code{" "}
//               <span className="text-destructive">*</span>
//             </label>
//             <Input
//               type="text"
//               placeholder="Pin code"
//               {...register("HCJ_ST_Student_Pincode")}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setValue("HCJ_ST_Student_Pincode", value);
//                 if (value.length === 6) {
//                   fetchLocationByPincode(value);
//                 }
//               }}
//               className={`${
//                 errors.HCJ_ST_Student_Pincode ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//             {isLoadingLocation && (
//               <p className="text-xs text-primary mt-1">
//                 Fetching location data...
//               </p>
//             )}
//           </div>
//         </div>

//         {/* State and City */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s State <span className="text-destructive">*</span>
//             </label>
//             <Input
//               type="text"
//               placeholder="State"
//               value={stateData}
//               onChange={(e) => {
//                 setStateData(e.target.value);
//                 setValue("HCJ_ST_Student_State", e.target.value);
//               }}
//               className={`${
//                 errors.HCJ_ST_Student_State ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s City <span className="text-destructive">*</span>
//             </label>
//             <Input
//               type="text"
//               placeholder="City"
//               value={cityData}
//               onChange={(e) => {
//                 setCityData(e.target.value);
//                 setValue("HCJ_ST_Student_City", e.target.value);
//               }}
//               className={`${
//                 errors.HCJ_ST_Student_City ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//           </div>
//         </div>

//         {/* Address */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Address <span className="text-destructive">*</span>
//             </label>
//             <Input
//               type="text"
//               placeholder="Enter Address"
//               {...register("HCJ_ST_Address", {
//                 required: "Address is required",
//               })}
//               className={`${
//                 errors.HCJ_ST_Address ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//             {errors.HCJ_ST_Address && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.HCJ_ST_Address.message}
//               </p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Program Enrolled Year{" "}
//               <span className="text-destructive">*</span>
//             </label>
//             <YearSelect {...register("HCJ_ST_Enrollment_Year")} />
//             {/* <Input
//               type="text"
//               placeholder="Program Enrolled Year"
//               {...register("HCJ_ST_Enrollment_Year")}
//               className={`${
//                 errors.HCJ_ST_Enrollment_Year ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             /> */}
//           </div>
//         </div>

//         {/* Program Details */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Program Name <span className="text-destructive">*</span>
//             </label>
//             <Select
//               onValueChange={(value) => {
//                 setValue("HCJ_ST_Student_Program_Name", value);
//                 setSelectedProgram(value);
//                 filterSpecializationsByProgram(value);
//               }}>
//               <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                 <SelectValue placeholder="Select Program" />
//               </SelectTrigger>
//               <SelectContent className="h-80 overflow-y-auto dark:bg-gray-800">
//                 {specializationData.map((data, index) => (
//                   <SelectItem key={index} value={data.category}>
//                     {data.category}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Branch/Specialization{" "}
//               <span className="text-destructive">*</span>
//             </label>
//             <Select
//               onValueChange={(value) =>
//                 setValue("HCJ_ST_Student_Branch_Specialization", value)
//               }>
//               <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                 <SelectValue placeholder="Select Branch/Specialization" />
//               </SelectTrigger>
//               <SelectContent className="h-80 overflow-y-auto dark:bg-gray-800">
//                 {filteredSpecializations.map((category, categoryIndex) => (
//                   <React.Fragment key={`category-${categoryIndex}`}>
//                     <SelectItem
//                       value={`heading-${categoryIndex}`}
//                       disabled
//                       className="font-bold text-primary">
//                       {category.category}
//                     </SelectItem>

//                     {category.specializations.map(
//                       (specialization, specIndex) => (
//                         <SelectItem
//                           key={`spec-${categoryIndex}-${specIndex}`}
//                           value={`${specialization.trim()}`}>
//                           {specialization}
//                         </SelectItem>
//                       )
//                     )}
//                   </React.Fragment>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Documents */}
//         <div className="grid grid-cols-2 gap-6">
//           <div className="grid grid-col-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Grade/Score
//               </label>
//               <Select
//                 onValueChange={(value) =>
//                   setValue("HCJ_ST_Score_Grade_Type", value)
//                 }>
//                 <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                   <SelectValue placeholder="CGPA" />
//                 </SelectTrigger>
//                 <SelectContent className="dark:bg-gray-800">
//                   <SelectItem value="grade">Grade</SelectItem>
//                   <SelectItem value="score">Score</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Grade/Score Value
//               </label>
//               <Input
//                 type="text"
//                 placeholder="8.5"
//                 {...register("HCJ_ST_Score_Grade")}
//                 className={`${
//                   errors.HCJ_ST_Score_Grade ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               />
//             </div>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-primary dark:text-gray-300">
//                 Class of Year <span className="text-destructive">*</span>
//               </label>

//               <YearSelect {...register("HCJ_ST_Class_Of_Year")} />

//               {/* <Input
//                 type="text"
//                 placeholder="Class Year"
//                 {...register("HCJ_ST_Class_Of_Year")}
//                 className={`${
//                   errors.HCJ_ST_Class_Of_Year ? "border-red-500" : ""
//                 } dark:bg-gray-700 dark:text-white`}
//               /> */}
//             </div>
//           </div>
//         </div>

//         {/* Grade/Score */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s Document Domicile{" "}
//             </label>
//             <Input
//               type="text"
//               placeholder="Document Domicile"
//               {...register("HCJ_ST_Student_Document_Domicile")}
//               className={`${
//                 errors.HCJ_ST_Student_Document_Domicile
//                   ? "border-red-500"
//                   : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s Document Type{" "}
//             </label>
//             <Select
//               onValueChange={(value) =>
//                 setValue("HCJ_ST_Student_Document_Type", value)
//               }>
//               <SelectTrigger className="dark:bg-gray-700 dark:text-white">
//                 <SelectValue placeholder="Select Document Type" />
//               </SelectTrigger>
//               <SelectContent className="dark:bg-gray-800">
//                 {documentTypes.length > 0 && documentTypes[0]?.document ? (
//                   documentTypes[0].document.map((doc, index) => (
//                     <SelectItem key={index} value={doc.value}>
//                       {toSentenceCase(doc.label)}
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <>
//                     <SelectItem value="passport">Passport</SelectItem>
//                     <SelectItem value="voter_id">Voter ID</SelectItem>
//                     <SelectItem value="aadhaar">Aadhaar</SelectItem>
//                     <SelectItem value="pan_card">PAN Card</SelectItem>
//                     <SelectItem value="driving_license">
//                       Driving License
//                     </SelectItem>
//                   </>
//                 )}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Alternate Contact and Document Number */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Student&apos;s Document Number{" "}
//             </label>
//             <Input
//               type="text"
//               placeholder="Document Number"
//               {...register("HCJ_ST_Student_Document_Number")}
//               className={`${
//                 errors.HCJ_ST_Student_Document_Number ? "border-red-500" : ""
//               } dark:bg-gray-700 dark:text-white`}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-primary dark:text-gray-300">
//               Upload Photo of Document{" "}
//               {/* <span className="text-destructive">*</span> */}
//             </label>
//             <div className="border-2 border-dashed border-primary dark:border-gray-600 rounded-lg p-6 text-center">
//               <input
//                 type="file"
//                 className="hidden"
//                 id="file-upload"
//                 accept="image/*"
//                 onChange={handleFileUpload}
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="cursor-pointer flex flex-col items-center justify-center">
//                 {isUploading ? (
//                   <Loader2 className="h-12 w-12 animate-spin text-gray-400 dark:text-gray-500" />
//                 ) : (
//                   <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
//                 )}
//                 <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//                   {uploadedPhotoUrl
//                     ? "Document uploaded successfully! Click to change"
//                     : "Click here to upload your file or drag and drop"}
//                 </span>
//                 <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                   Supported formats: JPG, PNG
//                 </span>
//               </label>
//             </div>
//             {uploadedPhotoUrl && (
//               <p className="text-xs text-green-500 mt-1">
//                 Document uploaded successfully!
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex flex-col items-center text-center space-y-4">
//           {/* <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-64 px-6 py-2 text-white bg-primary dark:bg-blue-600 rounded-md hover:bg-primary/90 dark:hover:bg-blue-700"
//           >
//             {isSubmitting && <Loader2 className="animate-spin" />}
//             Add Student
//           </Button> */}
//           <Button
//             type="submit"
//             disabled={isSubmitting || isUploading} // Disable if uploading or submitting
//             className="w-64 px-6 py-2 text-white bg-primary dark:bg-blue-600 rounded-md hover:bg-primary/90 dark:hover:bg-blue-700">
//             {isSubmitting && <Loader2 className="animate-spin" />}
//             Add Student
//           </Button>
//         </div>
//       </form>

//       <ToastContainer />
//     </div>
//   </div>
// );
