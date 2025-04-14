"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import useInstitution from "@/hooks/useInstitution";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

// Add this utility function at the top of the file, after the imports
const toSentenceCase = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const staffSchema = z.object({
  CCP_Institute_Name: z.string().min(1, "Institution name is required"),
  CCP_Contact_Person_First_Name: z.string().min(1, "First name is required"),
  CCP_Contact_Person_Last_Name: z.string().min(1, "Last name is required"),
  CCP_Contact_Person_Phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),
  CCP_Contact_Person_Alternate_Phone: z.string().optional().or(z.literal("")),
  CCP_Contact_Person_Email: z.string().email("Invalid email address"),
  CCP_Contact_Person_Alternate_Email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  CCP_Contact_Person_Role: z.string().min(1, "Role is required"),
  CCP_Contact_Person_Gender: z.string().min(1, "Gender is required"),
  CCP_Contact_Person_DOB: z.date({
    required_error: "Date of birth is required",
  }),
  CCP_Contact_Person_Country: z.string().min(1, "Country is required"),
  CCP_Contact_Person_Pincode: z.string().min(1, "Pincode is required"),
  CCP_Contact_Person_State: z.string().min(1, "State is required"),
  CCP_Contact_Person_City: z.string().min(1, "City is required"),
  CCP_Contact_Person_Address_Line1: z.string().min(1, "Address is required"),
  CCP_Contact_Person_Joining_Year: z
    .string()
    .min(1, "Joining year is required"),
  CCP_Contact_Person_Department: z.string().min(1, "Department is required"),
  CCP_Contact_Person_Designation: z.string().min(1, "Designation is required"),
  CCP_Contact_Person_Document_Domicile: z
    .string()
    .min(1, "Document domicile is required"),
  CCP_Contact_Person_Document_Type: z
    .string()
    .min(1, "Document type is required"),
  CCP_Contact_Person_Document_Number: z
    .string()
    .min(1, "Document number is required"),
  CCP_Institution_Num: z.string().min(1, "Company ID is required"),
});

function AddStaffPage() {
  const [documentPicture, setDocumentPicture] = useState(null);
  const [countries, setCountries] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  // console.log('documentTypes', documentTypes);
  // Update the useForm hook to set India as the default country
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      CCP_Contact_Person_DOB: undefined,
      CCP_Institution_Num: "", // Default company ID
      CCP_Contact_Person_Country: "India", // Default country set to India
    },
  });

  useEffect(() => {
    // Fetch countries and document types on component mount
    fetchCountriesAndDocuments();

    // Set document domicile to match the default country (India)
    setValue("CCP_Contact_Person_Document_Domicile", "India");
  }, [setValue]);

  const watchCountry = watch("CCP_Contact_Person_Country");

  const router = useRouter();
  const { data: session } = useSession();
  const companyId = session?.user?.companyId; // or whatever field you use
  const { institutionData, loading, error } = useInstitution(companyId);

  const DESIGNATIONS = [
    "Chancellor/President",
    "Vice Chancellor",
    "Dean",
    "HOD",
    "Program Director",
    "Principle",
    "Vice Principle",
    "Registrar",
    "Deputy Registrar",
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturers",
    "Guest Faculty/Visiting Lecturers",
    "Training & Placement Officer",
    "Placement Coordinator",
    "Administrative Staff",
    "IT Support Staff",
    "Teaching Faculty",
    "Non Teaching Faculty",
  ];

  const departments = [
    "Computer Science Engineering (CSE)",
    "Information Technology (IT)",
    "Electronics and Communication Engineering (ECE)",
    "Electrical and Electronics Engineering (EEE)",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Artificial Intelligence and Machine Learning (AI/ML)",
    "Data Science and Analytics",
    "Robotics and Automation",
    "Cybersecurity",
    "Cloud Computing",
    "Blockchain",
    "UI/UX Design",
    "DevOps",
    "Finance",
    "Marketing",
    "Human Resource Management (HRM)",
    "Operations and Supply Chain Management",
    "International Business",
    "Business Analytics",
    "Entrepreneurship",
    "Digital Marketing",
    "Psychology",
    "Sociology",
    "Political Science",
    "History",
    "Geography",
    "Economics",
    "English Literature",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Microbiology",
    "Environmental Science",
    "Accounting and Auditing",
    "Taxation",
    "Banking and Insurance",
    "Corporate Law",
    "Medicine (MBBS)",
    "Nursing",
    "Pharmacy (BPharm)",
    "Physiotherapy",
    "Public Health and Epidemiology",
    "Fashion Design",
    "Interior Design",
    "Graphic Design",
    "Animation and Multimedia",
    "Corporate Law",
    "Criminal Law", 
    "Journalism and Mass Communication",
    "Film and Television Production",
    "Event Management",
    "Sports Management"
  ];
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit");
        return;
      }
      setDocumentPicture(file);
    }
  };

  // Update the fetchCountriesAndDocuments function to handle document arrays
  const fetchCountriesAndDocuments = async () => {
    try {
      const response = await fetch("/api/global/v1/gblArET90004FtchDcmntDtls");
      if (!response.ok) {
        throw new Error("Failed to fetch country and document data");
      }
      const data = await response.json();

      // Set countries
      if (data.countryDetails && data.countryDetails.length > 0) {
        setCountries(data.countryDetails);
      }

      // Set document types directly from the response
      if (data.documentDetails && data.documentDetails.length > 0) {
        setDocumentTypes(data.documentDetails);
      }

      // Set India as selected country if available
      const indiaCountry = data.countryDetails.find(
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
        title: "Error",
        description: "Failed to load country and document data",
        variant: "destructive",
      });
    }
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;

    // Update the form value for pincode
    const pincodeEvent = {
      target: {
        name: "CCP_Contact_Person_Pincode",
        value: pincode,
      },
    };
    register("CCP_Contact_Person_Pincode").onChange(pincodeEvent);

    // If pincode is not 6 digits, don't fetch data
    if (pincode.length !== 6) return;

    setIsLoadingPincode(true);

    try {
      const response = await fetch(
        `/api/global/v1/gblArET90003FtchPinCdDtls?pincode=${pincode}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch pincode data");
      }

      const data = await response.json();

      if (data.success && data.data) {
        // Update state and city fields
        const stateEvent = {
          target: {
            name: "CCP_Contact_Person_State",
            value: data.data.state || "",
          },
        };

        const cityEvent = {
          target: {
            name: "CCP_Contact_Person_City",
            value: data.data.city || "",
          },
        };

        register("CCP_Contact_Person_State").onChange(stateEvent);
        register("CCP_Contact_Person_City").onChange(cityEvent);

        // Force form to update
        setValue("CCP_Contact_Person_State", data.data.state || "");
        setValue("CCP_Contact_Person_City", data.data.city || "");
      } else {
        toast({
          title: "Pincode not found",
          description: "Could not find details for this pincode",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pincode details",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPincode(false);
    }
  };

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

  const searchParams = useSearchParams();
  const staffId = searchParams.get("id"); // Get staff ID from query params

  const onSubmit = async (data) => {
    try {
      if (!session?.user?.id) {
        throw new Error("User session is missing. Please log in.");
      }

      // Create FormData object
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(data).forEach((key) => {
        if (key === "CCP_Contact_Person_DOB" && data[key]) {
          formData.append(key, format(data[key], "yyyy-MM-dd")); // Format date for API
        } else if (data[key] !== undefined && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

      // Add admin invitee ID
      formData.append(
        "CCP_Admin_Invitee_Id",
        session.user.id || "DEFAULT_ADMIN_ID"
      );

      // Add institute number if not already included
      if (!formData.has("CCP_Institute_Num")) {
        formData.append("CCP_Institute_Num", data.CCP_Institution_Num || "");
      }

      // Ensure CCP_Company_Id is included
      formData.append(
        "CCP_Company_Id",
        session.user.companyId || "DEFAULT_COMPANY_ID"
      );

      // Add document picture if available
      if (documentPicture) {
        formData.append("CCP_Contact_Person_Document_Picture", documentPicture);
      }

      console.log("Form data being submitted:", Object.fromEntries(formData));

      // 🔹 Check if we are editing or adding
      const isEditing = Boolean(staffId);
      const apiUrl = isEditing
        ? `/api/institution/v1/hcjBrBT60582ManageStaff?id=${staffId}` // PATCH for updating
        : `/api/institution/v1/hcjBrBT60581AddStaff`; // POST for new staff

      const response = await fetch(apiUrl, {
        method: isEditing ? "PATCH" : "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error saving staff details");
      }

      // Success Alert
      Swal.fire({
        icon: "success",
        title: isEditing
          ? "Staff updated successfully!"
          : "Invitation sent successfully!",
        text: "What would you like to do next?",
        showCancelButton: true,
        confirmButtonText: isEditing ? "Go to Dashboard" : "Add Another Member",
        cancelButtonText: "Go to Dashboard",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed && !isEditing) {
          reset();
          setDocumentPicture(null);
        } else {
          router.push("/institutn-dshbrd6051");
        }
      });
    } catch (error) {
      console.error("Error saving staff details:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to save staff details",
        text: error.message || "Please try again.",
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

  useEffect(() => {
    if (staffId) {
      setValue("CCP_Institute_Name", searchParams.get("instituteName") || "");
      setValue(
        "CCP_Contact_Person_First_Name",
        searchParams.get("firstName") || ""
      );
      setValue(
        "CCP_Contact_Person_Last_Name",
        searchParams.get("lastName") || ""
      );
      setValue("CCP_Contact_Person_Phone", searchParams.get("phone") || "");
      setValue(
        "CCP_Contact_Person_Alternate_Phone",
        searchParams.get("altPhone") || ""
      );
      setValue("CCP_Contact_Person_Email", searchParams.get("email") || "");
      setValue(
        "CCP_Contact_Person_Designation",
        searchParams.get("designation") || ""
      );
      setValue("CCP_Contact_Person_Role", searchParams.get("role") || "");
      setValue(
        "CCP_Contact_Person_Department",
        searchParams.get("department") || ""
      );
      setValue(
        "CCP_Contact_Person_Joining_Year",
        searchParams.get("joiningYear") || ""
      );
      setValue("CCP_Contact_Person_Gender", searchParams.get("gender") || "");
      setValue(
        "CCP_Contact_Person_Country",
        searchParams.get("country") || "India"
      );
      setValue("CCP_Contact_Person_State", searchParams.get("state") || "");
      setValue("CCP_Contact_Person_City", searchParams.get("city") || "");
      setValue("CCP_Contact_Person_Pincode", searchParams.get("pincode") || "");
      setValue(
        "CCP_Contact_Person_Address_Line1",
        searchParams.get("address") || ""
      );

      // Handle Date (Convert from String to Date Object)
      const dob = searchParams.get("dob");
      if (dob) {
        setValue("CCP_Contact_Person_DOB", new Date(dob));
      }
    }
  }, [searchParams, setValue, staffId]);

  useEffect(() => {
    if (institutionData) {
      reset({
        CCP_Institute_Name: institutionData.CD_Company_Name || "",
        CCP_Institution_Num: institutionData.CD_Company_Num || "",
      });
    }
  }, [institutionData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Invite Staff Member
        </h1>
        <Link href="/institutn-dshbrd6051/team-bulk-imprt">
          <Button className="bg-primary text-white">Add Bulk Import</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Institution Information */}

          <h2 className="text-xl font-semibold mb-4 text-primary">
            Institution Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="instituteNum"
                className="text-sm text-primary font-medium"
              >
                Institute Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="instituteNum"
                readOnly
                {...register("CCP_Institution_Num")}
                placeholder="Enter institute number"
                className="mt-1"
              />
              {errors.CCP_Institution_Num && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Institution_Num.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="instituteName"
                className="text-sm text-primary font-medium"
              >
                Institution Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="instituteName"
                readOnly
                {...register("CCP_Institute_Name")}
                placeholder="Enter institution name"
                className="mt-1"
              />
              {errors.CCP_Institute_Name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Institute_Name.message}
                </p>
              )}
            </div>
          </div>

          {/* Personal Information */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-primary"
              >
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                {...register("CCP_Contact_Person_First_Name")}
                placeholder="Enter first name"
                className="mt-1"
              />
              {errors.CCP_Contact_Person_First_Name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_First_Name.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-primary"
              >
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                {...register("CCP_Contact_Person_Last_Name")}
                placeholder="Enter last name"
                className="mt-1"
              />
              {errors.CCP_Contact_Person_Last_Name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Last_Name.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-primary"
              >
                Educational Institution Email ID{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("CCP_Contact_Person_Email")}
                placeholder="Enter institutional email"
                className="mt-1"
              />
              {errors.CCP_Contact_Person_Email && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Email.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="alternateEmail"
                className="text-sm font-medium text-primary"
              >
                Alternate Email ID
              </Label>
              <Input
                id="alternateEmail"
                type="email"
                {...register("CCP_Contact_Person_Alternate_Email")}
                placeholder="Enter alternate email"
                className="mt-1"
              />
              {errors.CCP_Contact_Person_Alternate_Email && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Alternate_Email.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-primary"
              >
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="CCP_Contact_Person_Phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country={"in"}
                    value={field.value}
                    onChange={(phone) => field.onChange(phone)}
                    inputProps={{
                      id: "phoneNumber",
                    }}
                    containerClass="w-full mt-1"
                    inputClass="w-full !h-10 !text-base"
                    buttonClass="!h-10"
                    inputStyle={{
                      width: "100%",
                    }}
                  />
                )}
              />
              {errors.CCP_Contact_Person_Phone && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Phone.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="alternatePhoneNumber"
                className="text-sm font-medium text-primary"
              >
                Alternate Phone Number
              </Label>
              <Controller
                name="CCP_Contact_Person_Alternate_Phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country={"in"}
                    value={field.value}
                    onChange={(phone) => field.onChange(phone)}
                    inputProps={{
                      id: "alternatePhoneNumber",
                    }}
                    containerClass="mt-1"
                    inputClass=" !h-10 !text-base"
                    buttonClass="!h-10"
                    inputStyle={{
                      width: "100%",
                    }}
                  />
                )}
              />
              {errors.CCP_Contact_Person_Alternate_Phone && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Alternate_Phone.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="gender"
                className="text-sm font-medium text-primary"
              >
                Gender <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="CCP_Contact_Person_Gender"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">Male</SelectItem>
                      <SelectItem value="02">Female</SelectItem>
                      <SelectItem value="03">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.CCP_Contact_Person_Gender && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Gender.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="dateOfBirth"
                className="text-sm font-medium text-primary"
              >
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="CCP_Contact_Person_DOB"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>YYYY-MM-DD</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.CCP_Contact_Person_DOB && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_DOB.message}
                </p>
              )}
            </div>
          </div>

          {/* Address Information */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="country"
                className="text-sm font-medium text-primary"
              >
                Country <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="CCP_Contact_Person_Country"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Set document domicile to match the selected country
                      setValue("CCP_Contact_Person_Document_Domicile", value);
                      // Reset document type when country changes
                      setValue("CCP_Contact_Person_Document_Type", "");
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.iso2} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.CCP_Contact_Person_Country && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Country.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="pincode"
                className="text-sm font-medium text-primary"
              >
                Pincode <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pincode"
                {...register("CCP_Contact_Person_Pincode")}
                placeholder="Enter pincode"
                className="mt-1"
                onChange={(e) => {
                  register("CCP_Contact_Person_Pincode").onChange(e);
                  handlePincodeChange(e);
                }}
              />
              {isLoadingPincode && (
                <p className="text-primary text-sm mt-1">
                  Fetching location data...
                </p>
              )}
              {errors.CCP_Contact_Person_Pincode && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Pincode.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="state"
                className="text-sm font-medium text-primary"
              >
                State <span className="text-destructive">*</span>
              </Label>
              <Input
                id="state"
                {...register("CCP_Contact_Person_State")}
                placeholder="Enter state"
                className="mt-1"
              />
              {errors.CCP_Contact_Person_State && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_State.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="city"
                className="text-sm font-medium text-primary"
              >
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                {...register("CCP_Contact_Person_City")}
                placeholder="Enter city"
                className="mt-1"
              />
              {errors.CCP_Contact_Person_City && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_City.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label
                htmlFor="addressLine1"
                className="text-sm font-medium text-primary"
              >
                Address Line 1 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="addressLine1"
                {...register("CCP_Contact_Person_Address_Line1")}
                placeholder="Enter address"
                className="mt-1"
                rows={3}
              />
              {errors.CCP_Contact_Person_Address_Line1 && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Address_Line1.message}
                </p>
              )}
            </div>
          </div>

          {/* Professional Information */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="role"
                className="text-sm font-medium text-primary"
              >
                Role <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="CCP_Contact_Person_Role"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="07">Team Member</SelectItem>
                      <SelectItem value="08">Support Staff</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.CCP_Contact_Person_Role && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Role.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="joiningYear"
                className="text-sm font-medium text-primary"
              >
                Joining Year <span className="text-destructive">*</span>
              </Label>
              <Input
                id="joiningYear"
                {...register("CCP_Contact_Person_Joining_Year")}
                placeholder="YYYY"
                className="mt-1"
              />
              {errors.CCP_Contact_Person_Joining_Year && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Joining_Year.message}
                </p>
              )}
            </div>

            {/* <div>
              <Label
                htmlFor="department"
                className="text-sm font-medium text-primary">
                Department <span className="text-destructive">*</span>
              </Label>
              <Input
                id="department"
                {...register('CCP_Contact_Person_Department')}
                placeholder="Enter department"
                className="mt-1"
              />
              {errors.CCP_Contact_Person_Department && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Department.message}
                </p>
              )}
            </div> */}

            <div>
              <Label
                htmlFor="department"
                className="text-sm font-medium text-primary"
              >
                Department <span className="text-destructive">*</span>
              </Label>

              <Select
                onValueChange={(value) =>
                  setValue("CCP_Contact_Person_Department", value, {
                    shouldValidate: true,
                  })
                }
                defaultValue={getValues("CCP_Contact_Person_Department")}
              >
                <SelectTrigger id="department" className="mt-1">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept, index) => (
                    <SelectItem key={index} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.CCP_Contact_Person_Department && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Department.message}
                </p>
              )}
            </div>

            {/* <div>
              <Label
                htmlFor="designation"
                className="text-sm font-medium text-primary">
                Designation <span className="text-destructive">*</span>
              </Label>
              <Input
                id="designation"
                {...register('CCP_Contact_Person_Designation')}
                placeholder="Enter designation"
                className="mt-1"
              />
              {errors.CCP_Contact_Person_Designation && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Designation.message}
                </p>
              )}
            </div> */}

            <div>
            <Label
                htmlFor="department"
                className="text-sm font-medium text-primary"
              >
               Designations <span className="text-destructive">*</span>
              </Label>
         
            <Select
              onValueChange={(value) =>
                setValue("CCP_Contact_Person_Designation", value, {
                  shouldValidate: true,
                })
              }
              defaultValue={getValues("CCP_Contact_Person_Designation")}
            >
              <SelectTrigger id="designation" className="mt-1">
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                {DESIGNATIONS.map((role, index) => (
                  <SelectItem key={index} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
          </div>

          {/* Document Information */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="documentDomicile"
                className="text-sm font-medium text-primary"
              >
                Document Domicile <span className="text-destructive">*</span>
              </Label>
              <Input
                id="documentDomicile"
                {...register("CCP_Contact_Person_Document_Domicile")}
                placeholder="Document domicile will match country"
                className="mt-1"
                readOnly
              />
              {errors.CCP_Contact_Person_Document_Domicile && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Document_Domicile.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="documentType"
                className="text-sm font-medium text-primary"
              >
                Document Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="CCP_Contact_Person_Document_Type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!watchCountry}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue
                        placeholder={
                          watchCountry
                            ? "Select document type"
                            : "Select a country first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {watchCountry === "India" &&
                        // ? documentTypes
                        //     .find((doc) => doc.relatedCountry === 'India')
                        //     ?.document?.map((doc, index) => (
                        //       <SelectItem
                        //         className="capitalize"
                        //         key={index}
                        //         value={doc}>
                        //         {doc}
                        //       </SelectItem>
                        //     )) || (
                        //     <>
                        //       <SelectItem value="passport">Passport</SelectItem>
                        //       <SelectItem value="voter_id">Voter ID</SelectItem>
                        //       <SelectItem value="aadhaar_card">
                        //         Aadhar Card
                        //       </SelectItem>
                        //       <SelectItem value="pan_card">PAN Card</SelectItem>
                        //       <SelectItem value="driving_license">
                        //         Driving License
                        //       </SelectItem>
                        //     </>
                        //   )
                        // :

                        filterDocumentTypesByCountry(watchCountry)?.map(
                          (doc, index) => (
                            <SelectItem
                              className="capitalize"
                              key={index}
                              value={doc?.value}
                            >
                              {doc?.label}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.CCP_Contact_Person_Document_Type && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Document_Type.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="documentNumber"
                className="text-sm font-medium text-primary"
              >
                Document Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="documentNumber"
                {...register("CCP_Contact_Person_Document_Number")}
                placeholder="Enter document number"
                className="mt-1"
              />
              {errors.CCP_Contact_Person_Document_Number && (
                <p className="text-destructive text-sm mt-1">
                  {errors.CCP_Contact_Person_Document_Number.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="documentPicture"
                className="block text-sm font-medium dark:text-gray-300 text-primary "
              >
                Document Picture
              </Label>
              <div
                className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center dark:border-gray-600"
                onClick={() =>
                  document.getElementById("documentPicture").click()
                }
              >
                <Image
                  src="/image/info/upload.svg"
                  alt="Upload Icon"
                  width={32}
                  height={32}
                  className="mx-auto mb-2 w-8 h-8"
                />
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="text-primary dark:text-[hsl(206,_100%,_30%)]">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  PNG, JPG, JPEG (max. 2MB)
                </p>
              </div>
              <input
                type="file"
                id="documentPicture"
                name="documentPicture"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              {documentPicture && (
                <p className="text-green-600 mt-2 dark:text-green-400">
                  File uploaded: {documentPicture.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 text-lg font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Staff Member..." : "Add Staff Member"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStaffPage;
