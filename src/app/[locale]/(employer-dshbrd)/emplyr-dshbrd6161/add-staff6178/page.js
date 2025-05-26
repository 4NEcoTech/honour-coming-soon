"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";

import { useAbility } from "@/Casl/CaslContext";
import { ProfilePhotoUpload } from "@/components/image-upload";
import { YearSelect } from "@/components/select-year";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/hooks/use-toast";
import useInstitution from "@/hooks/useInstitution";
import { Link, useRouter } from "@/i18n/routing";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
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
    .min(1, "Alternate email is required"), // Making Alternate Email mandatory
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
  CCP_Contact_Person_Joining_Year: z.number().optional(), // Making Joining Year optional
  CCP_Contact_Person_Department: z.string().optional(), // Making Department optional
  CCP_Contact_Person_Designation: z.string().optional(), // Making Designation optional
  CCP_Contact_Person_Document_Domicile: z.string().optional(), // Making Document Domicile optional
  CCP_Contact_Person_Document_Type: z.string().optional(), // Making Document Type optional
  CCP_Contact_Person_Document_Number: z.string().optional(), // Making Document Number optional
  CCP_Contact_Person_Document_Picture: z.string().optional(), // Making Document Number optional
  CCP_Institute_Num: z.string().min(1, "Company Num is required"),
});

function AddStaffPage() {
  const [documentPicture, setDocumentPicture] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const ability = useAbility();
  const { Toast } = useToast();
  // console.log('documentTypes', documentTypes);
  // Update the useForm hook to set India as the default country
  const form = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      CCP_Contact_Person_DOB: undefined,
      CCP_Contact_Person_Country: "India", // Default country set to India
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = form;
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
    "Sports Management",
  ];

  // Update the fetchCountriesAndDocuments function to handle document arrays
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

  useEffect(() => {
    if (institutionData) {
      reset({
        CCP_Institute_Name: institutionData.CD_Company_Name || "",
        CCP_Institute_Num: institutionData.CD_Company_Num || "", // Changed from CCP_Institution_Num
      });
    }
  }, [institutionData, reset]);

  // Update the onSubmit function to use the already uploaded document URL
  const onSubmit = async (data) => {
    try {
      if (!session?.user?.id) {
        throw new Error("User session is missing. Please log in.");
      }

      // Prepare the data for submission
      const jsonData = {
        ...data,
        CCP_Admin_Invitee_Id: session.user.id || "DEFAULT_ADMIN_ID",
        CCP_Company_Id: session.user.companyId || "DEFAULT_COMPANY_ID",
        CCP_Contact_Person_DOB: data.CCP_Contact_Person_DOB
          ? format(data.CCP_Contact_Person_DOB, "yyyy-MM-dd")
          : null,
      };
      // console.log("jsonData", jsonData);
      // Make the API call with JSON data
      const response = await fetch(
        staffId
          ? `/api/employee/v1/manage-staff?id=${staffId}`
          : `api/employee/v1/add-staff`,
        {
          method: staffId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to ${staffId ? "update" : "add"} staff. Status: ${
            response.status
          }`
        );
      }

      // Success Alert
      Swal.fire({
        icon: "success",
        title: staffId
          ? "Staff updated successfully!"
          : "Invitation sent successfully!",
        text: "What would you like to do next?",
        showCancelButton: true,
        confirmButtonText: staffId ? "Go to Dashboard" : "Add Another Member",
        cancelButtonText: "Go to Dashboard",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed && !staffId) {
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

  const handleUploadSuccess = (url) => {
    // setProfileImageUrl(url);
    form.setValue("CCP_Contact_Person_Document_Picture", url);
    console.log("omkar", url);
    toast({
      title: "Success!",
      description: "Profile image uploaded successfully",
      variant: "default",
    });
  };

  const handleRemovePhoto = () => {
    form.setValue("CCP_Contact_Person_Document_Picture", "");
    toast({
      title: "Removed",
      description: "Profile photo removed",
      variant: "default",
    });
  };

  const handleUploadError = (error) => {
    toast({
      title: "Upload failed",
      description: error.message || "Please try again with a different image",
      variant: "destructive",
    });
  };

  const handleValidationError = (error) => {
    toast({
      title: "Invalid file",
      description: error.message,
      variant: "destructive",
    });
  };

  useEffect(() => {
    if (institutionData) {
      // Only set institution-specific fields when institution data loads
      setValue("CCP_Institute_Name", institutionData.CD_Company_Name || "");
      setValue("CCP_Institute_Num", institutionData.CD_Company_Num || "");
    }

    if (staffId) {
      // Set all edit fields including phone number
      setValue(
        "CCP_Contact_Person_Alternate_Email",
        searchParams.get("altEmail") || ""
      );
      setValue(
        "CCP_Contact_Person_Document_Number",
        searchParams.get("documentNumber") || ""
      );
      setValue(
        "CCP_Contact_Person_Document_Type",
        searchParams.get("documentType") || ""
      );
      setValue(
        "CCP_Contact_Person_Document_Domicile",
        searchParams.get("documentDomicile") || ""
      );
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
        Number(searchParams.get("joiningYear")) || null
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
  }, [institutionData, searchParams, setValue, staffId]);

  // useEffect(() => {
  //   if (staffId) {
  //     setValue("CCP_Institute_Name", searchParams.get("instituteName") || "");
  //     setValue(
  //       "CCP_Contact_Person_Alternate_Email",
  //       searchParams.get("altEmail") || ""
  //     );
  //     setValue(
  //       "CCP_Contact_Person_First_Name",
  //       searchParams.get("firstName") || ""
  //     );
  //     setValue(
  //       "CCP_Contact_Person_Last_Name",
  //       searchParams.get("lastName") || ""
  //     );
  //     setValue("CCP_Contact_Person_Phone", searchParams.get("phone") || "");
  //     setValue(
  //       "CCP_Contact_Person_Alternate_Phone",
  //       searchParams.get("altPhone") || ""
  //     );
  //     setValue("CCP_Contact_Person_Email", searchParams.get("email") || "");
  //     setValue(
  //       "CCP_Contact_Person_Designation",
  //       searchParams.get("designation") || ""
  //     );
  //     setValue("CCP_Contact_Person_Role", searchParams.get("role") || "");
  //     setValue(
  //       "CCP_Contact_Person_Department",
  //       searchParams.get("department") || ""
  //     );
  //     setValue(
  //       "CCP_Contact_Person_Joining_Year",
  //       searchParams.get("joiningYear") || ""
  //     );
  //     setValue("CCP_Contact_Person_Gender", searchParams.get("gender") || "");
  //     setValue(
  //       "CCP_Contact_Person_Country",
  //       searchParams.get("country") || "India"
  //     );
  //     setValue("CCP_Contact_Person_State", searchParams.get("state") || "");
  //     setValue("CCP_Contact_Person_City", searchParams.get("city") || "");
  //     setValue("CCP_Contact_Person_Pincode", searchParams.get("pincode") || "");
  //     setValue(
  //       "CCP_Contact_Person_Address_Line1",
  //       searchParams.get("address") || ""
  //     );

  //     // Handle Date (Convert from String to Date Object)
  //     const dob = searchParams.get("dob");
  //     if (dob) {
  //       setValue("CCP_Contact_Person_DOB", new Date(dob));
  //     }
  //   }
  // }, [searchParams, setValue, staffId]);

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Institution Information */}
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Institution Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="CCP_Institute_Num"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Institute Number <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        placeholder="Enter institute number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCP_Institute_Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Institution Name <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        placeholder="Enter institution name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="CCP_Contact_Person_First_Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      First Name <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Last_Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Last Name <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Educational Institution Email ID <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter institutional email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Alternate_Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Alternate Email ID <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter alternate email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Phone Number <RequiredIndicator />
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
                name="CCP_Contact_Person_Alternate_Phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Alternate Phone Number
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
                name="CCP_Contact_Person_Gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Gender <RequiredIndicator />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
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
                name="CCP_Contact_Person_DOB"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-primary">
                      Date of Birth <RequiredIndicator />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "PPP")
                              : "YYYY-MM-DD"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Country <RequiredIndicator />
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue(
                          "CCP_Contact_Person_Document_Domicile",
                          value
                        );
                        form.setValue("CCP_Contact_Person_Document_Type", "");
                      }}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.iso2} value={country.name}>
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
                name="CCP_Contact_Person_Pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Pincode <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter pincode"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handlePincodeChange(e);
                        }}
                      />
                    </FormControl>
                    {isLoadingPincode && (
                      <p className="text-primary text-sm mt-1">
                        Fetching location data...
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCP_Contact_Person_State"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      State <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter state"
                        {...field}
                        // value={stateData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCP_Contact_Person_City"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      City <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter city"
                        {...field}
                        // value={cityData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Address_Line1"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-primary">
                      Address Line 1 <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter address"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Role <RequiredIndicator />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10">Team Member</SelectItem>
                        <SelectItem value="11">Support Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Joining_Year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Joining Year</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="YYYY" {...field} /> */}
                      <YearSelect {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept, ind) => (
                          <SelectItem key={`${dept}_${ind}`} value={dept}>
                            {dept}
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
                name="CCP_Contact_Person_Designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Designations</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DESIGNATIONS.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Document Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Document_Domicile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Document Domicile
                    </FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        placeholder="Document domicile will match country"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Document_Type"
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
              <FormField
                control={form.control}
                name="CCP_Contact_Person_Document_Number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Document Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter document number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ProfilePhotoUpload
                onUploadSuccess={handleUploadSuccess}
                onRemovePhoto={handleRemovePhoto}
                onUploadError={handleUploadError}
                onValidationError={handleValidationError}
                userId={session?.user?.id}
                imageTitle={" Upload Photo of Document"}
                imageDescription={""}
                uploadEndpoint="/api/institution/v1/hcjBrBT60583UploadStaffDocument"
                initialPhoto={form.getValues(
                  "CCP_Contact_Person_Document_Picture"
                )}
                onUploadStateChange={setIsUploading}
                // UploadIcon={ShieldUser}
                uploadType={"Document"}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <Button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 text-lg font-medium"
                disabled={form.formState.isSubmitting || isUploading}>
                {form.formState.isSubmitting
                  ? "Adding Staff Member..."
                  : isUploading
                  ? "Uploading Document..."
                  : "Add Staff Member"}
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

export default AddStaffPage;
