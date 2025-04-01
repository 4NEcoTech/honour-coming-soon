// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { zodResolver } from "@hookform/resolvers/zod"
// import Image from "next/image"
// import { useSession } from "next-auth/react"
// import { useRouter } from "@/i18n/routing"
// import { useState } from "react"
// import { Controller, useForm } from "react-hook-form"
// import Swal from "sweetalert2"
// import * as z from "zod"

// const formSchema = z
//   .object({
//     institutionType: z.enum(["College", "University"]),
//     aisheCode: z.string().min(1, "AISHE Code is required"),
//     collegeName: z.string().optional(),
//     collegeNameOther: z.string().optional(),
//     affiliatedUniversity: z.string().optional(),
//     affiliatedUniversityOther: z.string().optional(),
//     universityName: z.string().optional(),
//     universityNameOther: z.string().optional(),
//     universityType: z.string().optional(),
//     taxId: z.string().min(1, "Tax ID is required"),
//     companyRegistrationNumber: z.string().min(1, "Company Registration Number is required"),
//     registrationDoc: z
//       .instanceof(File)
//       .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB")
//       .refine(
//         (file) => ["application/pdf", "image/jpeg", "image/png"].includes(file.type),
//         "File must be PDF, JPG, or PNG",
//       ),
//     taxDoc: z
//       .instanceof(File)
//       .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB")
//       .refine(
//         (file) => ["application/pdf", "image/jpeg", "image/png"].includes(file.type),
//         "File must be PDF, JPG, or PNG",
//       ),
//   })
//   .superRefine((data, ctx) => {
//     // College validation
//     if (data.institutionType === "College") {
//       if (!data.collegeName) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "College name is required",
//           path: ["collegeName"],
//         })
//       }

//       if (data.collegeName === "other" && !data.collegeNameOther) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Please specify the college name",
//           path: ["collegeNameOther"],
//         })
//       }

//       if (!data.affiliatedUniversity) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Affiliated university is required",
//           path: ["affiliatedUniversity"],
//         })
//       }

//       if (data.affiliatedUniversity === "other" && !data.affiliatedUniversityOther) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Please specify the affiliated university",
//           path: ["affiliatedUniversityOther"],
//         })
//       }
//     }

//     // University validation
//     if (data.institutionType === "University") {
//       if (!data.universityName) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "University name is required",
//           path: ["universityName"],
//         })
//       }

//       if (data.universityName === "other" && !data.universityNameOther) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Please specify the university name",
//           path: ["universityNameOther"],
//         })
//       }

//       if (!data.universityType) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "University type is required",
//           path: ["universityType"],
//         })
//       }
//     }
//   })

// // Sample data for dropdowns
// const collegeList = [
//   { value: "college1", label: "Delhi College of Engineering" },
//   { value: "college2", label: "St. Stephen's College" },
//   { value: "college3", label: "Lady Shri Ram College" },
//   { value: "other", label: "Other" },
// ]

// const universityList = [
//   { value: "university1", label: "Delhi University" },
//   { value: "university2", label: "Jawaharlal Nehru University" },
//   { value: "university3", label: "Jamia Millia Islamia" },
//   { value: "other", label: "Other" },
// ]

// const universityTypes = [
//   { value: "public", label: "Public" },
//   { value: "private", label: "Private" },
//   { value: "deemed", label: "Deemed University" },
//   { value: "central", label: "Central University" },
// ]

// function EducationalDocumentDetails() {
//   const { data: session } = useSession()
//   console.log(session)
//   const router = useRouter()
//   const [showCollegeNameOther, setShowCollegeNameOther] = useState(false)
//   const [showUniversityNameOther, setShowUniversityNameOther] = useState(false)
//   const [showAffiliatedUniversityOther, setShowAffiliatedUniversityOther] = useState(false)

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     watch,
//     reset,
//     getValues,
//     setValue,
//   } = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       institutionType: "College",
//       aisheCode: "",
//       collegeName: "",
//       collegeNameOther: "",
//       affiliatedUniversity: "",
//       affiliatedUniversityOther: "",
//       universityName: "",
//       universityNameOther: "",
//       universityType: "",
//       taxId: "",
//       companyRegistrationNumber: "",
//     },
//   })

//   const institutionType = watch("institutionType")

//   const onSubmit = async (data) => {
//     console.log("onSubmit triggered with data:", data)
//     const formDataObj = new FormData()

//     // Append basic fields
//     formDataObj.append("CKD_Company_Id", session?.user?.companyId || "")
//     formDataObj.append("CKD_Institution_Type", data.institutionType)
//     formDataObj.append("CKD_AISHE_Code", data.aisheCode)
//     formDataObj.append("CKD_Company_Tax_Id", data.taxId)
//     formDataObj.append("CKD_Company_Registration_Number", data.companyRegistrationNumber)

//     // Conditional College or University Fields
//     if (data.institutionType === "College") {
//       const collegeName =
//         data.collegeName === "other"
//           ? data.collegeNameOther
//           : collegeList.find((c) => c.value === data.collegeName)?.label || data.collegeName

//       const universityName =
//         data.affiliatedUniversity === "other"
//           ? data.affiliatedUniversityOther
//           : universityList.find((u) => u.value === data.affiliatedUniversity)?.label || data.affiliatedUniversity

//       formDataObj.append("CKD_College_Name", collegeName)
//       formDataObj.append("CKD_Affiliated_University", universityName)
//     } else {
//       const universityName =
//         data.universityName === "other"
//           ? data.universityNameOther
//           : universityList.find((u) => u.value === data.universityName)?.label || data.universityName

//       const universityTypeLabel =
//         universityTypes.find((t) => t.value === data.universityType)?.label || data.universityType

//       formDataObj.append("CKD_University_Name", universityName)
//       formDataObj.append("CKD_University_Type", universityTypeLabel)
//     }

//     // Append files
//     if (data.registrationDoc) {
//       formDataObj.append("CKD_Company_Registration_Documents", data.registrationDoc)
//     }

//     if (data.taxDoc) {
//       formDataObj.append("CKD_Company_Tax_Documents", data.taxDoc)
//     }

//     // Append metadata fields
//     formDataObj.append("CKD_Submitted_By", session?.user?.email || "")
//     formDataObj.append(
//       "CKD_Audit_Trail",
//       JSON.stringify([{ action: "submitted", timestamp: new Date().toISOString() }]),
//     )

//     // Debugging: Console log FormData
//     console.log("FormData Object:")
//     for (const [key, value] of formDataObj.entries()) {
//       console.log(`${key}:`, value)
//     }

//     try {
//       const response = await fetch("/api/institution/v1/hcjBrBT60311InstitutionDocument", {
//         method: "POST",
//         body: formDataObj,
//       })

//       const result = await response.json()

//       if (response.ok) {
//         Swal.fire({
//           title: "Success",
//           text: result.message,
//           icon: "success",
//           confirmButtonText: "OK",
//         })

//         router.push("/vrfctn-pndng6032") // Redirect after success
//       } else {
//         Swal.fire({
//           title: "Error",
//           text: result.message || "Submission failed",
//           icon: "error",
//           confirmButtonText: "OK",
//         })
//       }
//     } catch (error) {
//       console.error("Submission error:", error)
//       Swal.fire({
//         title: "Error",
//         text: "An error occurred during submission. Please try again later.",
//         icon: "error",
//         confirmButtonText: "OK",
//       })
//     }
//   }

//   return (
//     <Card className="container mx-auto max-w-lg mt-4 mb-4 sm:mt-4 sm:mb-4 shadow-none border-transparent sm:border-gray-300 sm:shadow-lg">
//       <CardContent className="space-y-6 mt-4 mb-4 sm:mt-4 sm:mb-4">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* Institution Type Radio Buttons */}
//           <div className="space-y-2 mb-4">
//             <Label className="text-primary font-medium">
//               Institution Type <span className="text-destructive">*</span>
//             </Label>
//             <Controller
//               name="institutionType"
//               control={control}
//               render={({ field }) => (
//                 <RadioGroup
//                   onValueChange={(value) => {
//                     field.onChange(value)
//                     // Reset the fields for the other institution type
//                     if (value === "College") {
//                       setValue("universityName", "")
//                       setValue("universityNameOther", "")
//                       setValue("universityType", "")
//                     } else {
//                       setValue("collegeName", "")
//                       setValue("collegeNameOther", "")
//                       setValue("affiliatedUniversity", "")
//                       setValue("affiliatedUniversityOther", "")
//                     }
//                   }}
//                   defaultValue={field.value}
//                   className="flex space-x-4"
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="College" id="college" />
//                     <Label htmlFor="college">College</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="University" id="university" />
//                     <Label htmlFor="university">University</Label>
//                   </div>
//                 </RadioGroup>
//               )}
//             />
//             {errors.institutionType && <p className="text-destructive text-sm">{errors.institutionType.message}</p>}
//           </div>

//           {/* Common Fields */}
//           <div className="space-y-4">
//             <div className="space-y-1">
//               <Label htmlFor="aisheCode" className="text-primary">
//                 AISHE Code <span className="text-destructive">*</span>
//               </Label>
//               <Controller
//                 name="aisheCode"
//                 control={control}
//                 render={({ field }) => <Input id="aisheCode" placeholder="Enter AISHE Code" {...field} />}
//               />
//               {errors.aisheCode && <p className="text-destructive text-sm">{errors.aisheCode.message}</p>}
//             </div>

//             {/* College-specific fields */}
//             {institutionType === "College" && (
//               <>
//                 <div className="space-y-1">
//                   <Label htmlFor="collegeName" className="text-primary">
//                     Name of College <span className="text-destructive">*</span>
//                   </Label>
//                   <Controller
//                     name="collegeName"
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         onValueChange={(value) => {
//                           field.onChange(value)
//                           setShowCollegeNameOther(value === "other")
//                         }}
//                         value={field.value}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select college" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {collegeList.map((college) => (
//                             <SelectItem key={college.value} value={college.value}>
//                               {college.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.collegeName && <p className="text-destructive text-sm">{errors.collegeName.message}</p>}
//                 </div>

//                 {showCollegeNameOther && (
//                   <div className="space-y-1">
//                     <Label htmlFor="collegeNameOther" className="text-primary">
//                       Other College Name <span className="text-destructive">*</span>
//                     </Label>
//                     <Controller
//                       name="collegeNameOther"
//                       control={control}
//                       render={({ field }) => (
//                         <Input id="collegeNameOther" placeholder="Enter college name" {...field} />
//                       )}
//                     />
//                     {errors.collegeNameOther && (
//                       <p className="text-destructive text-sm">{errors.collegeNameOther.message}</p>
//                     )}
//                   </div>
//                 )}

//                 <div className="space-y-1">
//                   <Label htmlFor="affiliatedUniversity" className="text-primary">
//                     Affiliated to University <span className="text-destructive">*</span>
//                   </Label>
//                   <Controller
//                     name="affiliatedUniversity"
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         onValueChange={(value) => {
//                           field.onChange(value)
//                           setShowAffiliatedUniversityOther(value === "other")
//                         }}
//                         value={field.value}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select university" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {universityList.map((university) => (
//                             <SelectItem key={university.value} value={university.value}>
//                               {university.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.affiliatedUniversity && (
//                     <p className="text-destructive text-sm">{errors.affiliatedUniversity.message}</p>
//                   )}
//                 </div>

//                 {showAffiliatedUniversityOther && (
//                   <div className="space-y-1">
//                     <Label htmlFor="affiliatedUniversityOther" className="text-primary">
//                       Other University Name <span className="text-destructive">*</span>
//                     </Label>
//                     <Controller
//                       name="affiliatedUniversityOther"
//                       control={control}
//                       render={({ field }) => (
//                         <Input id="affiliatedUniversityOther" placeholder="Enter university name" {...field} />
//                       )}
//                     />
//                     {errors.affiliatedUniversityOther && (
//                       <p className="text-destructive text-sm">{errors.affiliatedUniversityOther.message}</p>
//                     )}
//                   </div>
//                 )}
//               </>
//             )}

//             {/* University-specific fields */}
//             {institutionType === "University" && (
//               <>
//                 <div className="space-y-1">
//                   <Label htmlFor="universityName" className="text-primary">
//                     University Name <span className="text-destructive">*</span>
//                   </Label>
//                   <Controller
//                     name="universityName"
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         onValueChange={(value) => {
//                           field.onChange(value)
//                           setShowUniversityNameOther(value === "other")
//                         }}
//                         value={field.value}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select university" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {universityList.map((university) => (
//                             <SelectItem key={university.value} value={university.value}>
//                               {university.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.universityName && <p className="text-destructive text-sm">{errors.universityName.message}</p>}
//                 </div>

//                 {showUniversityNameOther && (
//                   <div className="space-y-1">
//                     <Label htmlFor="universityNameOther" className="text-primary">
//                       Other University Name <span className="text-destructive">*</span>
//                     </Label>
//                     <Controller
//                       name="universityNameOther"
//                       control={control}
//                       render={({ field }) => (
//                         <Input id="universityNameOther" placeholder="Enter university name" {...field} />
//                       )}
//                     />
//                     {errors.universityNameOther && (
//                       <p className="text-destructive text-sm">{errors.universityNameOther.message}</p>
//                     )}
//                   </div>
//                 )}

//                 <div className="space-y-1">
//                   <Label htmlFor="universityType" className="text-primary">
//                     University Type <span className="text-destructive">*</span>
//                   </Label>
//                   <Controller
//                     name="universityType"
//                     control={control}
//                     render={({ field }) => (
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select university type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {universityTypes.map((type) => (
//                             <SelectItem key={type.value} value={type.value}>
//                               {type.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.universityType && <p className="text-destructive text-sm">{errors.universityType.message}</p>}
//                 </div>
//               </>
//             )}

//             <div className="space-y-1">
//               <Label htmlFor="companyRegistrationNumber" className="text-primary">
//                 Registration Number <span className="text-destructive">*</span>
//               </Label>
//               <Controller
//                 name="companyRegistrationNumber"
//                 control={control}
//                 render={({ field }) => (
//                   <Input id="companyRegistrationNumber" placeholder="Enter Company Registration Number" {...field} />
//                 )}
//               />
//               {errors.companyRegistrationNumber && (
//                 <p className="text-destructive text-sm">{errors.companyRegistrationNumber.message}</p>
//               )}
//             </div>

//             <div className="space-y-1">
//               <Label htmlFor="taxId" className="text-primary">
//                 Tax ID/GST Number <span className="text-destructive">*</span>
//               </Label>
//               <Controller
//                 name="taxId"
//                 control={control}
//                 render={({ field }) => <Input id="taxId" placeholder="Enter Tax/GST Number" {...field} />}
//               />
//               {errors.taxId && <p className="text-destructive text-sm">{errors.taxId.message}</p>}
//             </div>
//           </div>

//           {/* Upload Registration Document */}
//           <div className="space-y-1 mt-4">
//             <Label htmlFor="registrationDoc" className="text-primary">
//               Upload Your Registration Document <span className="text-destructive">*</span>
//             </Label>
//             <p className="text-gray-400 text-xs mt-1">
//               Please ensure both front and back sides of the documents are uploaded
//             </p>
//             <Controller
//               name="registrationDoc"
//               control={control}
//               render={({ field: { onChange, value, ...field } }) => (
//                 <div
//                   className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center"
//                   onClick={() => document.getElementById("registrationDoc").click()}
//                 >
//                   <Image
//                     src="/image/info/upload.svg"
//                     alt="Upload Icon"
//                     width={32}
//                     height={32}
//                     className="mx-auto mb-2 w-8 h-8"
//                   />
//                   <p className="text-gray-400 text-xs mt-1 font-semibold">Institute Registration Documents</p>
//                   <p className="text-gray-600">
//                     <span className="text-primary">Click to upload</span> to upload your file or drag and drop
//                   </p>
//                   <p className="text-gray-400 text-xs mt-1">Supported format : PDF,JPG,PNG (2mb)</p>
//                   <Input
//                     type="file"
//                     id="registrationDoc"
//                     accept=".pdf,.jpg,.png"
//                     onChange={(e) => {
//                       const file = e.target.files[0]
//                       onChange(file)
//                     }}
//                     className="hidden"
//                     {...field}
//                   />
//                   {value && <p className="text-green-600 text-sm mt-2">File selected: {value.name}</p>}
//                 </div>
//               )}
//             />
//             {errors.registrationDoc && <p className="text-destructive text-sm">{errors.registrationDoc.message}</p>}
//           </div>

//           {/* Upload Tax/GST Document */}
//           <div className="space-y-1 mt-4">
//             <Label htmlFor="taxDoc" className="text-primary">
//               Upload Your Tax/GST Documents <span className="text-destructive">*</span>
//             </Label>
//             <p className="text-gray-400 text-xs mt-1">
//               Please ensure both front and back sides of the documents are uploaded
//             </p>
//             <Controller
//               name="taxDoc"
//               control={control}
//               render={({ field: { onChange, value, ...field } }) => (
//                 <div
//                   className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center"
//                   onClick={() => document.getElementById("taxDoc").click()}
//                 >
//                   <Image
//                     src="/image/info/upload.svg"
//                     alt="Upload Icon"
//                     width={32}
//                     height={32}
//                     className="mx-auto mb-2 w-8 h-8"
//                   />
//                   <p className="text-gray-400 text-xs mt-1 font-semibold">Tax/GST Documents</p>
//                   <p className="text-gray-600">
//                     <span className="text-primary">Click to upload</span> to upload your file or drag and drop
//                   </p>
//                   <p className="text-gray-400 text-xs mt-1">Supported format : PDF,JPG,PNG (2mb)</p>
//                   <Input
//                     type="file"
//                     id="taxDoc"
//                     accept=".pdf,.jpg,.png"
//                     onChange={(e) => {
//                       const file = e.target.files[0]
//                       onChange(file)
//                     }}
//                     className="hidden"
//                     {...field}
//                   />
//                   {value && <p className="text-green-600 text-sm mt-2">File selected: {value.name}</p>}
//                 </div>
//               )}
//             />
//             {errors.taxDoc && <p className="text-destructive text-sm">{errors.taxDoc.message}</p>}
//           </div>

//           {/* Submit Button */}
//           <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

// export default EducationalDocumentDetails

'use client';

import { companyDocumentSchema } from '@/app/validation/companyDocumentSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from '@/i18n/routing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

export default function EducationalDocumentDetails() {
  const { data: session } = useSession();
  console.log(session);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(companyDocumentSchema),
    defaultValues: {
      institutionType: 'College',
      aisheCode: '',
      collegeName: '',
      affiliatedUniversity: '',
      universityName: '',
      universityType: '',
      taxId: '',
      companyRegistrationNumber: '',
    },
  });

  const fetchInstitutionDetails = async (aisheCode) => {
    if (!aisheCode) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/global/v1/gblArET90011FtchInstitutnDtls?AISHE_Code=${aisheCode}`
      );
      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const institutionData = result.data[0];

        // Auto-fill fields based on institution type
        if (watch('institutionType') === 'College') {
          setValue('collegeName', institutionData.Institute_Name);
          setValue(
            'affiliatedUniversity',
            institutionData.Name_of_Affiliated_University
          );
        } else if (watch('institutionType') === 'University') {
          setValue(
            'universityName',
            institutionData.Name_of_Affiliated_University
          );
          setValue('universityType', institutionData.Type_of_Institute);
        }
      }
    } catch (error) {
      console.error('Error fetching institution details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const institutionType = watch('institutionType');

  const onSubmit = async (data) => {
    console.log('onSubmit triggered with data:', data);
    const formDataObj = new FormData();

    // Append basic fields
    formDataObj.append('CKD_Company_Id', session?.user?.companyId || '');
    formDataObj.append('CKD_Institution_Type', data.institutionType);
    formDataObj.append('CKD_AISHE_Code', data.aisheCode);
    formDataObj.append('CKD_Company_Tax_Id', data.taxId);
    formDataObj.append(
      'CKD_Company_Registration_Number',
      data.companyRegistrationNumber
    );

    // Conditional College or University Fields
    if (data.institutionType === 'College') {
      formDataObj.append('CKD_College_Name', data.collegeName);
      formDataObj.append(
        'CKD_Affiliated_University',
        data.affiliatedUniversity
      );
    } else {
      formDataObj.append('CKD_University_Name', data.universityName);
      formDataObj.append('CKD_University_Type', data.universityType);
    }

    // Append files
    if (data.registrationDoc) {
      formDataObj.append(
        'CKD_Company_Registration_Documents',
        data.registrationDoc
      );
    }

    if (data.taxDoc) {
      formDataObj.append('CKD_Company_Tax_Documents', data.taxDoc);
    }

    // Append metadata fields
    formDataObj.append('CKD_Submitted_By', session?.user?.email || '');
    formDataObj.append(
      'CKD_Audit_Trail',
      JSON.stringify([
        { action: 'submitted', timestamp: new Date().toISOString() },
      ])
    );

    // Debugging: Console log FormData
    console.log('FormData Object:');
    for (const [key, value] of formDataObj.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(
        '/api/institution/v1/hcjBrBT60311InstitutionDocument',
        {
          method: 'POST',
          body: formDataObj,
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Success',
          text: result.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        reset(); // **Reset form fields after successful submission**
        router.push('/vrfctn-pndng6032'); // Redirect after success
      } else {
        Swal.fire({
          title: 'Error',
          text: result.message || 'Submission failed',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred during submission. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Card className="container mx-auto max-w-lg mt-4 mb-4 sm:mt-4 sm:mb-4 shadow-none border-transparent sm:border-gray-300 sm:shadow-lg">
      <CardContent className="space-y-6 mt-4 mb-4 sm:mt-4 sm:mb-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Institution Type Radio Buttons */}
          <div className="space-y-2 mb-4">
            <Label className="text-primary font-medium">
              Institution Type <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="institutionType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Reset the fields for the other institution type
                    if (value === 'College') {
                      setValue('universityName', '');
                      setValue('universityType', '');
                    } else {
                      setValue('collegeName', '');
                      setValue('affiliatedUniversity', '');
                    }

                    // Re-fetch data if AISHE code is already entered
                    const aisheCode = getValues('aisheCode');
                    if (aisheCode) {
                      fetchInstitutionDetails(aisheCode);
                    }
                  }}
                  defaultValue={field.value}
                  className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="College" id="college" />
                    <Label htmlFor="college">College</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="University" id="university" />
                    <Label htmlFor="university">University</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.institutionType && (
              <p className="text-destructive text-sm">
                {errors.institutionType.message}
              </p>
            )}
          </div>

          {/* Common Fields */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="aisheCode" className="text-primary">
                AISHE Code <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="aisheCode"
                control={control}
                render={({ field }) => (
                  <Input
                    id="aisheCode"
                    placeholder="Enter AISHE Code"
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      fetchInstitutionDetails(e.target.value);
                    }}
                  />
                )}
              />
              {errors.aisheCode && (
                <p className="text-destructive text-sm">
                  {errors.aisheCode.message}
                </p>
              )}
              {isLoading && (
                <p className="text-primary text-sm">
                  Loading institution details...
                </p>
              )}
            </div>

            {/* College-specific fields */}
            {institutionType === 'College' && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="collegeName" className="text-primary">
                    Name of College <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="collegeName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="collegeName"
                        placeholder="College name will auto-fill based on AISHE code"
                        {...field}
                      />
                    )}
                  />
                  {errors.collegeName && (
                    <p className="text-destructive text-sm">
                      {errors.collegeName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="affiliatedUniversity"
                    className="text-primary">
                    Affiliated to University{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="affiliatedUniversity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="affiliatedUniversity"
                        placeholder="Affiliated university will auto-fill based on AISHE code"
                        {...field}
                      />
                    )}
                  />
                  {errors.affiliatedUniversity && (
                    <p className="text-destructive text-sm">
                      {errors.affiliatedUniversity.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* University-specific fields */}
            {institutionType === 'University' && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="universityName" className="text-primary">
                    University Name <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="universityName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="universityName"
                        placeholder="University name will auto-fill based on AISHE code"
                        {...field}
                      />
                    )}
                  />
                  {errors.universityName && (
                    <p className="text-destructive text-sm">
                      {errors.universityName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="universityType" className="text-primary">
                    University Type <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="universityType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="universityType"
                        placeholder="University type will auto-fill based on AISHE code"
                        {...field}
                      />
                    )}
                  />
                  {errors.universityType && (
                    <p className="text-destructive text-sm">
                      {errors.universityType.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-1">
              <Label
                htmlFor="companyRegistrationNumber"
                className="text-primary">
                Registration Number <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="companyRegistrationNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="companyRegistrationNumber"
                    placeholder="Enter Company Registration Number"
                    {...field}
                  />
                )}
              />
              {errors.companyRegistrationNumber && (
                <p className="text-destructive text-sm">
                  {errors.companyRegistrationNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="taxId" className="text-primary">
                Tax ID/GST Number <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="taxId"
                control={control}
                render={({ field }) => (
                  <Input
                    id="taxId"
                    placeholder="Enter Tax/GST Number"
                    {...field}
                  />
                )}
              />
              {errors.taxId && (
                <p className="text-destructive text-sm">
                  {errors.taxId.message}
                </p>
              )}
            </div>
          </div>

          {/* Upload Registration Document */}
          <div className="space-y-1 mt-4">
            <Label htmlFor="registrationDoc" className="text-primary">
              Upload Your Registration Document{' '}
              <span className="text-destructive">*</span>
            </Label>
            <p className="text-gray-400 text-xs mt-1">
              Please ensure both front and back sides of the documents are
              uploaded
            </p>
            <Controller
              name="registrationDoc"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center"
                  onClick={() =>
                    document.getElementById('registrationDoc').click()
                  }>
                  <Image
                    src="/image/info/upload.svg"
                    alt="Upload Icon"
                    width={32}
                    height={32}
                    className="mx-auto mb-2 w-8 h-8"
                  />
                  <p className="text-gray-400 text-xs mt-1 font-semibold">
                    Institute Registration Documents
                  </p>
                  <p className="text-gray-600">
                    <span className="text-primary">Click to upload</span> to
                    upload your file or drag and drop
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Supported format : PDF,JPG,PNG (2mb)
                  </p>
                  <Input
                    type="file"
                    id="registrationDoc"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      onChange(file);
                    }}
                    className="hidden"
                    {...field}
                  />
                  {value && (
                    <p className="text-green-600 text-sm mt-2">
                      File selected: {value.name}
                    </p>
                  )}
                </div>
              )}
            />
            {errors.registrationDoc && (
              <p className="text-destructive text-sm">
                {errors.registrationDoc.message}
              </p>
            )}
          </div>

          {/* Upload Tax/GST Document */}
          <div className="space-y-1 mt-4">
            <Label htmlFor="taxDoc" className="text-primary">
              Upload Your Tax/GST Documents{' '}
              <span className="text-destructive">*</span>
            </Label>
            <p className="text-gray-400 text-xs mt-1">
              Please ensure both front and back sides of the documents are
              uploaded
            </p>
            <Controller
              name="taxDoc"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center"
                  onClick={() => document.getElementById('taxDoc').click()}>
                  <Image
                    src="/image/info/upload.svg"
                    alt="Upload Icon"
                    width={32}
                    height={32}
                    className="mx-auto mb-2 w-8 h-8"
                  />
                  <p className="text-gray-400 text-xs mt-1 font-semibold">
                    Tax/GST Documents
                  </p>
                  <p className="text-gray-600">
                    <span className="text-primary">Click to upload</span> to
                    upload your file or drag and drop
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Supported format : PDF,JPG,PNG (2mb)
                  </p>
                  <Input
                    type="file"
                    id="taxDoc"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      onChange(file);
                    }}
                    className="hidden"
                    {...field}
                  />
                  {value && (
                    <p className="text-green-600 text-sm mt-2">
                      File selected: {value.name}
                    </p>
                  )}
                </div>
              )}
            />
            {errors.taxDoc && (
              <p className="text-destructive text-sm">
                {errors.taxDoc.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
