"use client";

import { useAbility } from "@/Casl/CaslContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Link } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Camera,
  Check,
  Loader2,
  Plus,
  Save,
  Trash,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
import { VisibilitySheet } from "./visibility-popover";

// Define schemas for form validation
const personalInfoSchema = (t) =>
  z.object({
    firstName: z
      .string()
      .min(1, t("6061_1"))
      .max(50, t("6061_2"))
      .regex(/^[a-zA-Z\s]+$/, t("6061_3")),
    lastName: z
      .string()
      .max(50, "")
      .regex(/^[a-zA-Z\s]*$/, t("6061_4"))
      .optional(),
    profileHeadline: z.string().max(100, t("6061_5")).optional(),
    designation: z.string().max(100, t("6061_6")).optional(),
    about: z.string().max(500, t("6061_7")).optional(),
    email: z.string().email(t("6061_8")).min(1, t("6061_9")),
    phone: z
      .string()
      .min(10, t("6061_10"))
      .max(15, t("6061_11"))
      .regex(/^\+?[0-9\s\-]+$/, t("6061_12")),
  });

const addressSchema = (t) =>
  z.object({
    addressLine1: z.string().min(1, t("6061_13")).max(100, t("6061_14")),
    addressLine2: z.string().max(100, t("6061_15")).optional(),
    landmark: z.string().max(100, t("6061_16")).optional(),
    country: z.string().min(1, t("6061_17")).max(50, t("6061_18")),
    state: z.string().min(1, t("6061_19")).max(50, t("6061_20")),
    city: z.string().min(1, t("6061_21")),
    pincode: z
      .string()
      .min(5, t("6061_22"))
      .max(10, t("6061_23"))
      .regex(/^\d+$/, t("6061_24")),
  });

const socialLinksSchema = (t) =>
  z.object({
    website: z.string().trim().url(t("6061_25")).optional().or(z.literal("")),
    linkedin: z.string().trim().url(t("6061_26")).optional().or(z.literal("")),
    facebook: z.string().trim().url(t("6061_27")).optional().or(z.literal("")),
    instagram: z.string().trim().url(t("6061_28")).optional().or(z.literal("")),
    portfolio: z.string().trim().url(t("6061_29")).optional().or(z.literal("")),
  });

// Language proficiency options
const proficiencyOptions = [
  { value: "01", label: "Basic" },
  { value: "02", label: "Intermediate" },
  { value: "03", label: "Fluent" },
  { value: "04", label: "Native" },
];

// Language proficiency types
const proficiencyTypes = [
  { id: "01", label: "Reading" },
  { id: "02", label: "Writing" },
  { id: "03", label: "Speaking" },
];

// Languages list
const languagesList = [
  {
    groupName: "Popular in India",
    languages: [
      { value: "hindi", label: "Hindi" },
      { value: "english", label: "English" },
      { value: "bengali", label: "Bengali" },
      { value: "telugu", label: "Telugu" },
      { value: "marathi", label: "Marathi" },
      { value: "tamil", label: "Tamil" },
      { value: "urdu", label: "Urdu" },
      { value: "gujarati", label: "Gujarati" },
      { value: "kannada", label: "Kannada" },
      { value: "odia", label: "Odia" },
      { value: "malayalam", label: "Malayalam" },
      { value: "punjabi", label: "Punjabi" },
      { value: "assamese", label: "Assamese" },
      { value: "bhojpuri", label: "Bhojpuri" },
    ],
  },
  {
    groupName: "Other Indian Languages",
    languages: [
      { value: "konkani", label: "Konkani" },
      { value: "sindhi", label: "Sindhi" },
      { value: "sanskrit", label: "Sanskrit" },
      { value: "manipuri", label: "Manipuri" },
      { value: "bodo", label: "Bodo" },
      { value: "kashmiri", label: "Kashmiri" },
      { value: "tulu", label: "Tulu" },
      { value: "santhali", label: "Santhali" },
      { value: "mao", label: "Mao" },
      { value: "nepali", label: "Nepali" },
    ],
  },
  {
    groupName: "International Languages",
    languages: [
      { value: "french", label: "French" },
      { value: "spanish", label: "Spanish" },
      { value: "arabic", label: "Arabic" },
      { value: "chinese", label: "Chinese" },
      { value: "german", label: "German" },
      { value: "japanese", label: "Japanese" },
      { value: "russian", label: "Russian" },
      { value: "korean", label: "Korean" },
      { value: "italian", label: "Italian" },
      { value: "portuguese", label: "Portuguese" },
      { value: "dutch", label: "Dutch" },
      { value: "indonesian", label: "Indonesian" },
      { value: "malaysian", label: "Malaysian" },
      { value: "turkish", label: "Turkish" },
      { value: "persian", label: "Persian" },
      { value: "swahili", label: "Swahili" },
    ],
  },
];

export default function Page() {
  const tForm = useTranslations("formErrors");
  const tError = useTranslations("errorCode");

  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [savingSection, setSavingSection] = useState("");

  // Language state
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedProficiency, setSelectedProficiency] = useState("");
  const [selectedProficiencyTypes, setSelectedProficiencyTypes] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [addingLanguage, setAddingLanguage] = useState(false);
  const [languageError, setLanguageError] = useState("");
  const ability = useAbility();

  // Initialize forms with default values
  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchema(tForm)),
    defaultValues: {
      firstName: "",
      lastName: "",
      profileHeadline: "",
      designation: "",
      about: "",
      email: "",
      phone: "",
    },
  });

  const addressForm = useForm({
    resolver: zodResolver(addressSchema(tForm)),
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
  });

  const socialLinksForm = useForm({
    resolver: zodResolver(socialLinksSchema(tForm)),
    defaultValues: {
      website: "",
      linkedin: "",
      facebook: "",
      instagram: "",
      portfolio: "",
    },
  });

  // Fetch profile data when component mounts
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchProfileData = async () => {
      try {
        if (!session || !session.user) {
          setLoading(false);
          return;
        }

        const administratorId = session.user.id;

        if (!administratorId) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/institution/v1/hcjArET60521FetchAdminData/${administratorId}`
        );

        const data = await response.json();

        if (!response.ok) {
          toast({
            title: data.title,
            description: data.message || "Failed to load profile data",
            variant: "destructive",
          });
        } else {
          setProfileData(data.data);
          populateFormsWithData(data.data);

          // Fetch languages after profile data is loaded
          if (data.data.individualDetails && data.data.individualDetails._id) {
            fetchLanguages(data.data.individualDetails._id);
          }
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        toast({
          title: err.title || "Error",
          description: err.message || "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session, status]);

  // Fetch languages
  const fetchLanguages = async (individualId) => {
    setLoadingLanguages(true);
    try {
      const response = await fetch(
        `/api/institution/v1/hcjBrTo60615UserLanguage/${individualId}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setLanguages(data.data || []);
      } else {
        console.log("No languages found or error:", data.message);
        setLanguages([]);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      setLanguages([]);
    } finally {
      setLoadingLanguages(false);
    }
  };

  // Populate forms with fetched data
  const populateFormsWithData = (data) => {
    const { user, individualDetails, address, socialLinks } = data || {};

    // Set personal form values
    personalForm.reset({
      firstName: individualDetails?.ID_First_Name || "",
      lastName: individualDetails?.ID_Last_Name || "",
      profileHeadline: individualDetails?.ID_Profile_Headline || "",
      designation: individualDetails?.ID_Individual_Designation || "",
      about: individualDetails?.ID_About || "",
      email: individualDetails?.ID_Email || "",
      phone: individualDetails?.ID_Phone || "",
    });

    // Set address form values
    addressForm.reset({
      addressLine1: address?.IAD_Address_Line1 || "",
      addressLine2: address?.IAD_Address_Line2 || "",
      landmark: address?.IAD_Landmark || "",
      country: address?.IAD_Country || "",
      state: address?.IAD_State || "",
      city: address?.IAD_City || "",
      pincode: address?.IAD_Pincode || "",
    });

    // Set social links form values
    socialLinksForm.reset({
      website: socialLinks?.SL_Website_Url || "",
      linkedin: socialLinks?.SL_LinkedIn_Profile || "",
      facebook: socialLinks?.SL_Facebook_Url || "",
      instagram: socialLinks?.SL_Instagram_Url || "",
      portfolio: socialLinks?.SL_Portfolio_Url || "",
    });
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle cover image change
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle image uploads
  const handleImageUpload = async () => {
    setSavingSection("photos");

    try {
      if (!profileImage && !coverImage) {
        toast({
          title: tError("errorCode.6061_59.title"),
          description: tError("errorCode.6061_59.description"),
        });
        setSavingSection("");
        return;
      }

      if (!profileData?.individualDetails?._id) {
        toast({
          title: tError("errorCode.6061_40.title"),
          description: tError("errorCode.6061_40.description"),
          variant: "destructive",
        });
        setSavingSection("");
        return;
      }

      const formData = new FormData();
      if (profileImage) formData.append("profilePicture", profileImage);
      if (coverImage) formData.append("coverPhoto", coverImage);

      console.log("Uploading images:", {
        hasProfileImage: !!profileImage,
        hasCoverImage: !!coverImage,
        individualId: profileData.individualDetails._id,
      });

      const response = await fetch(
        `/api/institution/v1/hcjBrTo60614UpdateProfileImages/${profileData.individualDetails._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const data = await response.json();
      // console.log("Upload response:", data);

      if (response.ok && data.success) {
        toast({
          title: response.title || "Success",
          description: response.message || "Images uploaded successfully",
        });

        // Refresh profile data to get updated image URLs
        const refreshResponse = await fetch(
          `/api/institution/v1/hcjArET60521FetchAdminData/${session.user.id}`
        );
        const refreshData = await refreshResponse.json();

        if (refreshResponse.ok) {
          setProfileData(refreshData.data);
        }

        // Clear image previews
        setProfileImagePreview(null);
        setCoverImagePreview(null);
        setProfileImage(null);
        setCoverImage(null);
      } else {
        toast({
          title: data.title || "Error",
          description:
            data.message ||
            "An error occurred while uploading the images. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: error.title || "Error",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setSavingSection("");
    }
  };

  // Handle personal info submission
  const onPersonalSubmit = async (data) => {
    setSavingSection("personal");
    try {
      if (!profileData?.individualDetails?._id) {
        toast({
          title: tError("6061_40.title"),
          description: tError("6061_40.description"),
          variant: "destructive",
        });
        setSavingSection("");
        return;
      }

      const updateData = {
        ID_First_Name: data.firstName,
        ID_Last_Name: data.lastName,
        ID_Profile_Headline: data.profileHeadline,
        ID_Individual_Designation: data.designation,
        ID_Email: data.email,
        ID_Phone: data.phone,
        ID_About: data.about,
      };

      const response = await fetch(
        `/api/institution/v1/hcjBrTo60611UpdateIndividual/${profileData.individualDetails._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast({
          title: responseData.title || "Success",
          description:
            responseData.message || "Personal information updated successfully",
        });
      } else {
        toast({
          title: responseData.title || "Error",
          description:
            responseData.message || "Failed to update personal information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast({
        title: error.title || "Error",
        description: error.message || "Failed to update personal information",
        variant: "destructive",
      });
    } finally {
      setSavingSection("");
    }
  };

  // Handle address submission
  const onAddressSubmit = async (data) => {
    setSavingSection("address");
    try {
      console.log(profileData);
      if (!profileData?.address?._id) {
        toast({
          title: tError("6061_41.title"),
          description: tError("6061_41.description"),
          variant: "destructive",
        });
        setSavingSection("");
        return;
      }

      const updateData = {
        IAD_Address_Line1: data.addressLine1,
        IAD_Address_Line2: data.addressLine2,
        IAD_Landmark: data.landmark,
        IAD_Country: data.country,
        IAD_State: data.state,
        IAD_City: data.city,
        IAD_Pincode: data.pincode,
      };

      const response = await fetch(
        `/api/institution/v1/hcjBrTo60612UpdateAddress/${profileData.address._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast({
          title: responseData.title || "Success",
          description:
            responseData.message || "Address information updated successfully",
        });
      } else {
        toast({
          title: responseData.title || "Error",
          description:
            responseData.message || "Failed to update address information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: error.title || "Error",
        description: error.message || "Failed to update address information",
        variant: "destructive",
      });
    } finally {
      setSavingSection("");
    }
  };

  // Handle social links submission
  const onSocialLinksSubmit = async (data) => {
    setSavingSection("social");
    try {
      if (!profileData?.socialLinks?._id) {
        toast({
          title: tError("6061_42.title"),
          description: tError("6061_42.description"),
          variant: "destructive",
        });
        setSavingSection("");
        return;
      }

      const updateData = {
        SL_Website_Url: data.website,
        SL_LinkedIn_Profile: data.linkedin,
        SL_Facebook_Url: data.facebook,
        SL_Instagram_Url: data.instagram,
        SL_Portfolio_Url: data.portfolio,
      };

      const response = await fetch(
        `/api/institution/v1/hcjBrTo60613UpdateSocialLinks/${profileData.socialLinks._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast({
          title: responseData.title || "Success",
          description:
            responseData.message || "Social links updated successfully",
        });
      } else {
        toast({
          title: responseData.title || "Error",
          description: responseData.message || "Failed to update social links",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating social links:", error);
      toast({
        title: error.title || "Error",
        description: error.message || "Failed to update social links",
      });
    } finally {
      setSavingSection("");
    }
  };

  // Handle language proficiency type selection
  const handleProficiencyTypeChange = (id) => {
    setSelectedProficiencyTypes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
    setLanguageError("");
  };

  // Add a new language
  const handleAddLanguage = async () => {
    setLanguageError("");

    // Validate inputs
    if (!selectedLanguage) {
      setLanguageError("Please select a language");
      return;
    }

    if (!selectedProficiency) {
      setLanguageError("Please select proficiency level");
      return;
    }

    if (selectedProficiencyTypes.length === 0) {
      setLanguageError(
        "Please select at least one proficiency type (Reading, Writing, Speaking)"
      );
      return;
    }

    if (!profileData?.individualDetails?._id) {
      setLanguageError("Individual ID not found");
      return;
    }

    setAddingLanguage(true);

    try {
      const languageData = {
        HCJ_JSL_Source: "01",
        HCJ_JSL_Id: profileData.individualDetails._id,
        HCJ_JSL_Language: selectedLanguage,
        HCJ_JSL_Language_Proficiency_Level: selectedProficiency,
        HCJ_JSL_Language_Proficiency: selectedProficiencyTypes,
        HCJ_JSL_Ref: "IndividualDetails",
        HCJ_JSL_Creation_DtTym: new Date().toISOString(),
      };

      const response = await fetch(
        `/api/institution/v1/hcjBrTo60615UserLanguage/${profileData.individualDetails._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(languageData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: data.title||"Success",
          description:data.message|| "Language added successfully",
        });

        // Reset form
        setSelectedLanguage("");
        setSelectedProficiency("");
        setSelectedProficiencyTypes([]);

        // Refresh languages list
        fetchLanguages(profileData.individualDetails._id);
      } else {
        setLanguageError(data.message || "Failed to add language");
      }
    } catch (error) {
      console.error("Error adding language:", error);
      setLanguageError("Failed to add language");
    } finally {
      setAddingLanguage(false);
    }
  };

  // Delete a language
  const handleDeleteLanguage = async (languageId) => {
    if (!languageId) return;

    try {
      const response = await fetch(
        `/api/institution/v1/hcjBrTo60616UpdateUserLanguage/${languageId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: data.title||"Success",
          description:data.message|| "Language deleted successfully",
        });

        // Update languages list
        setLanguages((prev) => prev.filter((lang) => lang._id !== languageId));
      } else {
        toast({
          title: data.title||"Error",
          description: data.message || "Failed to delete language",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting language:", error);
      toast({
        title: error.title||"Error",
        description:error.message|| "Failed to delete language",
      });
    }
  };

  // Get proficiency level label
  const getProficiencyLabel = (code) => {
    const proficiency = proficiencyOptions.find((p) => p.value === code);
    return proficiency ? proficiency.label : "Unknown";
  };

  // Get proficiency types as string
  const getProficiencyTypes = (types) => {
    if (!types || !Array.isArray(types)) return "";

    return types
      .map((type) => {
        const profType = proficiencyTypes.find((p) => p.id === type);
        return profType ? profType.label : "";
      })
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="max-w-full mx-auto p-5">
        <div className="text-center mb-5">
          <Skeleton className="h-52 w-full" />
        </div>
        <div className="container mx-auto flex flex-col sm:flex-row items-start justify-between mb-5 sm:px-16">
          <div className="flex flex-col items-center sm:items-start">
            <Skeleton className="h-24 w-24 rounded-full mb-2" />
            <Skeleton className="h-6 w-40 mb-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="container mx-auto sm:px-16">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full dark:bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 mb-20">
      <div className="flex items-center mb-6 justify-between">
        <div className="justify-start items-start">
          <Link href="/institutn-dshbrd6051/my-prfl6052">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        <div className="flex items-end">
          {ability.can("manage", "PersonalInfo") && (
            <VisibilitySheet position="top-right" />
          )}
        </div>
      </div>

      {/* Images Section */}
      <Card className="mb-8 overflow-hidden shadow-md border border-gray-200">
        <CardHeader className="bg-primary/5 pb-0">
          <CardTitle className="text-xl font-semibold text-primary">
            Profile Images
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-[200px] bg-gray-100">
            {coverImagePreview ? (
              <div className="w-full h-full relative">
                <Image
                  src={coverImagePreview || "/placeholder.svg"}
                  alt="Cover"
                  layout="fill"
                  objectFit="cover"
                />
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() =>
                    document.getElementById("cover-upload").click()
                  }>
                  <Camera className="h-4 w-4 mr-2" />
                  Change Cover
                </Button>
              </div>
            ) : profileData?.individualDetails?.ID_Cover_Photo ? (
              <div className="w-full h-full relative">
                <Image
                  src={
                    profileData.individualDetails.ID_Cover_Photo ||
                    "/placeholder.svg"
                  }
                  alt="Cover"
                  layout="fill"
                  objectFit="cover"
                />
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() =>
                    document.getElementById("cover-upload").click()
                  }>
                  <Camera className="h-4 w-4 mr-2" />
                  Change Cover
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Button
                  variant="ghost"
                  className="text-primary"
                  onClick={() =>
                    document.getElementById("cover-upload").click()
                  }>
                  <Camera className="mr-2 h-4 w-4" />
                  Add cover photo
                </Button>
              </div>
            )}
            <input
              id="cover-upload"
              type="file"
              className="hidden"
              onChange={handleCoverImageChange}
              accept="image/*"
            />

            <div className="absolute left-6 bottom-0 translate-y-1/2">
              <div className="relative">
                <div className="w-32 h-32 rounded-md border-2 border-primary bg-white overflow-hidden">
                  {profileImagePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={profileImagePreview || "/placeholder.svg"}
                        alt="Profile"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ) : profileData?.individualDetails?.ID_Profile_Picture ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={
                          profileData.individualDetails.ID_Profile_Picture ||
                          "/placeholder.svg"
                        }
                        alt="Profile"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <Camera className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute left-0 -bottom-6 whitespace-nowrap">
                  <Button
                    variant="link"
                    className="text-primary p-0 h-auto font-normal"
                    onClick={() =>
                      document.getElementById("profile-upload").click()
                    }>
                    Change Profile Picture
                  </Button>
                </div>
                <input
                  id="profile-upload"
                  type="file"
                  className="hidden"
                  onChange={handleProfileImageChange}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div className="mt-16 p-4 flex justify-end">
            <Button
              onClick={handleImageUpload}
              disabled={savingSection === "photos"}
              className="bg-primary text-white hover:bg-primary/90">
              {savingSection === "photos" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Images...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Images
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Section */}
      <Card className="mb-8 shadow-md border border-gray-200">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl font-semibold text-primary">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...personalForm}>
            <form
              onSubmit={personalForm.handleSubmit(onPersonalSubmit)}
              className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={personalForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        First Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="profileHeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Profile Headline
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Administrator at IIT Delhi"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Designation
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Administrator" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Phone Number <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        {/* <Input placeholder="+91 9876543210" {...field} /> */}
                        <PhoneInput
                          // country={''}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          disabled
                          inputStyle={{
                            width: "100%",
                            height: "40px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={personalForm.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">About</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={savingSection === "personal"}
                  className="bg-primary text-white hover:bg-primary/90">
                  {savingSection === "personal" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Personal Information...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Personal Information
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Language Section */}
      <Card className="mb-8 shadow-md border border-gray-200">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl font-semibold text-primary">
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Current Languages */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Languages</h3>

              {loadingLanguages ? (
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : languages.length > 0 ? (
                <div className="space-y-2">
                  {languages.map((language) => (
                    <div
                      key={language._id}
                      className="flex items-center justify-between p-4 border rounded-md bg-muted/30">
                      <div className="space-y-1">
                        <div className="font-medium capitalize">
                          {language.HCJ_JSL_Language}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getProficiencyLabel(
                            language.HCJ_JSL_Language_Proficiency_Level
                          )}{" "}
                          •{" "}
                          {getProficiencyTypes(
                            language.HCJ_JSL_Language_Proficiency
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteLanguage(language._id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground">
                    No languages added yet
                  </p>
                </div>
              )}
            </div>

            {/* Add New Language */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Add New Language</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    Language <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languagesList.map((group) => (
                        <SelectGroup key={group.groupName}>
                          {/* Group heading */}
                          <SelectLabel>{group.groupName}</SelectLabel>

                          {/* Group items */}
                          {group.languages.map((language) => (
                            <SelectItem
                              key={language.value}
                              value={language.value}
                              disabled={languages?.some(
                                (profile) =>
                                  profile.HCJ_JSL_Language === language.value
                              )}>
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    Proficiency Level{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={selectedProficiency}
                    onValueChange={setSelectedProficiency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">
                  Proficiency Types <span className="text-destructive">*</span>
                </label>
                <p className="text-sm text-muted-foreground mb-2">
                  Select at least one
                </p>

                <div className="flex flex-wrap gap-4">
                  {proficiencyTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.id}`}
                        checked={selectedProficiencyTypes.includes(type.id)}
                        onCheckedChange={() =>
                          handleProficiencyTypeChange(type.id)
                        }
                      />
                      <label
                        htmlFor={`type-${type.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {languageError && (
                <div className="text-sm text-destructive">{languageError}</div>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleAddLanguage}
                  disabled={addingLanguage}
                  className="bg-primary text-white hover:bg-primary/90">
                  {addingLanguage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Language...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Language
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Section */}
      <Card className="mb-8 shadow-md border border-gray-200">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl font-semibold text-primary">
            Address Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...addressForm}>
            <form
              onSubmit={addressForm.handleSubmit(onAddressSubmit)}
              className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={addressForm.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Address Line 1{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Address Line 2
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="landmark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Landmark</FormLabel>
                      <FormControl>
                        <Input placeholder="Near metro station" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Country <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="USA">USA</SelectItem>
                          <SelectItem value="UK">UK</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Pincode <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="560017" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        State <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        City <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={savingSection === "address"}
                  className="bg-primary text-white hover:bg-primary/90">
                  {savingSection === "address" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Address Information...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Address Information
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Social Links Section */}
      <Card className="mb-8 shadow-md border border-gray-200">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl font-semibold text-primary">
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...socialLinksForm}>
            <form
              onSubmit={socialLinksForm.handleSubmit(onSocialLinksSubmit)}
              className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={socialLinksForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Website</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                            <Image
                              src="/image/institutndashboard/dashpage/myprofile/www.svg"
                              alt="Website"
                              width={24}
                              height={24}
                            />
                          </div>
                          <Input
                            placeholder="https://yourwebsite.com"
                            {...field}
                            className="flex-grow"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialLinksForm.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">LinkedIn</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                            <Image
                              src="/image/institutndashboard/dashpage/myprofile/linkedin.svg"
                              alt="LinkedIn"
                              width={24}
                              height={24}
                            />
                          </div>
                          <Input
                            placeholder="https://linkedin.com/in/yourprofile"
                            {...field}
                            className="flex-grow"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialLinksForm.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Facebook</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                            <Image
                              src="/image/institutndashboard/dashpage/myprofile/fb.svg"
                              alt="Facebook"
                              width={24}
                              height={24}
                            />
                          </div>
                          <Input
                            placeholder="https://facebook.com/yourprofile"
                            {...field}
                            className="flex-grow"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialLinksForm.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Instagram</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                            <Image
                              src="/image/institutndashboard/dashpage/myprofile/ig.svg"
                              alt="Instagram"
                              width={24}
                              height={24}
                            />
                          </div>
                          <Input
                            placeholder="https://instagram.com/yourprofile"
                            {...field}
                            className="flex-grow"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialLinksForm.control}
                  name="portfolio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Portfolio</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                            <Image
                              src="/image/institutndashboard/dashpage/myprofile/four.svg"
                              alt="Portfolio"
                              width={24}
                              height={24}
                            />
                          </div>
                          <Input
                            placeholder="https://yourportfolio.com"
                            {...field}
                            className="flex-grow"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={savingSection === "social"}
                  className="bg-primary text-white hover:bg-primary/90">
                  {savingSection === "social" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Social Links...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Social Links
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Bottom Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/institutn-dshbrd6051/my-prfl6052">
          <Button
            variant="outline"
            className="border-2 border-primary text-primary">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
        <Link href="/institutn-dshbrd6051/my-prfl6052">
          <Button
            variant="outline"
            className="border-2 border-green-500 text-green-500">
            <Check className="mr-2 h-4 w-4" />
            Preview Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
