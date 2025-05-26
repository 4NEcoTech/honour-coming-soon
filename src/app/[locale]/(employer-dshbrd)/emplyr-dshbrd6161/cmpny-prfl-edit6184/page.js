"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Camera, Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Link } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { InstitutionVisibilitySheet } from "./visibility-popover";

// Define schemas for form validation
const basicInfoSchema = z.object({
  institutionName: z.string().min(1, "Institution name is required"),
  specialization: z.string().optional(),
  // totalStudents: z.string().optional(),
  institutionType: z.enum(["private", "public"], {
    required_error: "Institution type is required",
  }),
  about: z.string().optional(),
  mission: z.string().optional(),
});

const addressSchema = z.object({
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(1, "Pincode is required"),
});

const contactSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const socialLinksSchema = z.object({
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export default function InstitutionProfileEdit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [savingSection, setSavingSection] = useState("");
  const { data: session, status } = useSession();

  // Add these state variables after the other useState declarations
  const [companyId, setCompanyId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [socialId, setSocialId] = useState("");
  const [existingProfileImage, setExistingProfileImage] = useState("");
  const [existingCoverImage, setExistingCoverImage] = useState("");

  // Initialize forms with default values
  const basicInfoForm = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      institutionName: "",
      specialization: "",
      // totalStudents: "250", // Pre-filled as per the original code
      institutionType: "private", // Default value
      about: "",
      mission: "",
    },
  });

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
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

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      phone: "",
      website: "",
    },
  });

  const socialLinksForm = useForm({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      linkedin: "",
      facebook: "",
      instagram: "",
      twitter: "",
      website: "",
    },
  });

  // Fetch institution data when component mounts
  useEffect(() => {
    const fetchInstitutionData = async () => {
      setLoading(true);
      try {
        // Get institution ID from session
        if (status !== "authenticated" || !session?.user?.individualId) {
          toast({
            title: "Error",
            description: "You must be logged in to edit your profile",
            variant: "destructive",
          });
          return;
        }

        const institutionId = session.user.individualId;
        console.log("Fetching data for institution ID:", institutionId);

        // Fetch real data from the API
        const response = await fetch(
          `/api/institution/v1/hcjArET60531FetchInstitutionData/${institutionId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to load institution data"
          );
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (!data.data) {
          throw new Error("No data returned from API");
        }

        // Extract the data from the API response
        const { companyDetails, companyAddress, socialLinks } = data.data;

        // Set existing images
        if (companyDetails?.CD_Company_Logo) {
          setExistingProfileImage(companyDetails.CD_Company_Logo);
          console.log("Profile image URL:", companyDetails.CD_Company_Logo);
        }

        if (companyDetails?.CD_Company_Cover_Profile) {
          setExistingCoverImage(companyDetails.CD_Company_Cover_Profile);
          console.log(
            "Cover image URL:",
            companyDetails.CD_Company_Cover_Profile
          );
        }

        // Also set the preview URLs for existing images
        if (companyDetails?.CD_Company_Logo) {
          setProfileImagePreview(companyDetails.CD_Company_Logo);
        }

        if (companyDetails?.CD_Company_Cover_Profile) {
          setCoverImagePreview(companyDetails.CD_Company_Cover_Profile);
        }

        // Add these lines after extracting the data:
        setCompanyId(companyDetails?._id || "");
        setAddressId(companyAddress?._id || "");
        setSocialId(socialLinks?._id || "");

        // Map API data to form structure
        const mappedData = {
          basicInfo: {
            institutionName: companyDetails?.CD_Company_Name || "",
            specialization: "", // Map this if available in your API
          //  totalStudents: "250", // This seems to be hardcoded in your original code
            institutionType: companyDetails?.CD_Company_Type || "private",
            about: companyDetails?.CD_Company_About || "",
            mission: companyDetails?.CD_Company_Mission || "", // Using the same field for mission if no separate field exists
          },
          address: {
            addressLine1: companyAddress?.CAD_Address_Line1 || "",
            addressLine2: companyAddress?.CAD_Address_Line2 || "",
            landmark: "", // Map this if available in your API
            country: companyAddress?.CAD_Country || "",
            state: companyAddress?.CAD_State || "",
            city: companyAddress?.CAD_City || "",
            pincode: companyAddress?.CAD_Pincode || "",
          },
          contact: {
            email: companyDetails?.CD_Company_Email || "",
            phone: companyDetails?.CD_Phone_Number || "",
            website: companyDetails?.CD_Company_Website || "",
          },
          socialLinks: {
            linkedin: socialLinks?.SL_LinkedIn_Profile || "",
            facebook: socialLinks?.SL_Facebook_Url || "",
            instagram: socialLinks?.SL_Instagram_Url || "",
            twitter: socialLinks?.SL_Twitter_Url || "",
            website: companyDetails?.CD_Company_Website || "",
          },
        };

        // Populate forms with fetched data
        basicInfoForm.reset(mappedData.basicInfo);
        addressForm.reset(mappedData.address);
        contactForm.reset(mappedData.contact);
        socialLinksForm.reset(mappedData.socialLinks);
      } catch (error) {
        console.error("Error fetching institution data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load institution data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutionData();
  }, [session, status, router]);

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
          title: "No changes",
          description: "No images selected for upload",
        });
        setSavingSection("");
        return;
      }

      if (!companyId) {
        throw new Error("Company ID not found");
      }

      // Create form data for the API
      const formData = new FormData();

      if (profileImage) {
        formData.append("companyLogo", profileImage);
      }

      if (coverImage) {
        formData.append("coverPhoto", coverImage);
      }

      // Call the API to update images
      const response = await fetch(
        `/api/institution/v1/hcjBrTo60624UpdateCompanyImages/${companyId}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update institution images"
        );
      }

      const result = await response.json();
      console.log("API Response:", result);

      // Update existing image URLs if the API returns them
      if (result.data) {
        if (result.data.CD_Company_Logo) {
          setExistingProfileImage(result.data.CD_Company_Logo);
        }
        if (result.data.CD_Company_Cover_Profile) {
          setExistingCoverImage(result.data.CD_Company_Cover_Profile);
        }
      }

      toast({
        title: "Success",
        description: "Institution images updated successfully",
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setSavingSection("");
    }
  };

  // Replace the onBasicInfoSubmit function with this:
  const onBasicInfoSubmit = async (data) => {
    setSavingSection("basicInfo");
    try {
      if (!companyId) {
        throw new Error("Company ID not found");
      }

      // Prepare data for API
      const updateData = {
        CD_Company_Name: data.institutionName,
        CD_Company_Type: data.institutionType,
        CD_Company_About: data.about,
        CD_Company_Mission: data.mission,
        CD_Company_Email: contactForm.getValues().email,
        CD_Phone_Number: contactForm.getValues().phone,
        CD_Company_Website: contactForm.getValues().website,
        // Add other fields as needed
      };

      // Call the API
      const response = await fetch(
        `/api/institution/v1/hcjBrTo60621UpdateCompany/${companyId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update institution information"
        );
      }

      const result = await response.json();
      console.log("API Response:", result);

      toast({
        title: "Success",
        description: "Institution information updated successfully",
      });
    } catch (error) {
      console.error("Error updating basic info:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update institution information",
        variant: "destructive",
      });
    } finally {
      setSavingSection("");
    }
  };

  // Replace the onAddressSubmit function with this:
  const onAddressSubmit = async (data) => {
    setSavingSection("address");
    try {
      if (!addressId) {
        throw new Error("Address ID not found");
      }

      // Prepare data for API
      const updateData = {
        CAD_Address_Line1: data.addressLine1,
        CAD_Address_Line2: data.addressLine2,
        CAD_Country: data.country,
        CAD_State: data.state,
        CAD_City: data.city,
        CAD_Pincode: data.pincode,
        // Add other fields as needed
      };

      // Call the API
      const response = await fetch(
        `/api/institution/v1/hcjBrTo60622UpdateCompanyAddress/${addressId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update address information"
        );
      }

      const result = await response.json();
      console.log("API Response:", result);

      toast({
        title: "Success",
        description: "Address information updated successfully",
      });
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update address information",
        variant: "destructive",
      });
    } finally {
      setSavingSection("");
    }
  };

  // Replace the onSocialLinksSubmit function with this:
  const onSocialLinksSubmit = async (data) => {
    setSavingSection("social");
    try {
      if (!socialId) {
        throw new Error("Social Links ID not found");
      }

      // Prepare data for API
      const updateData = {
        SL_LinkedIn_Profile: data.linkedin,
        SL_Facebook_Url: data.facebook,
        SL_Instagram_Url: data.instagram,
        SL_Twitter_Url: data.twitter,
        // Add other fields as needed
      };

      // Call the API
      const response = await fetch(
        `/api/institution/v1/hcjBrTo60623UpdateCompanySocialLinks/${socialId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update social links");
      }

      const result = await response.json();
      console.log("API Response:", result);

      toast({
        title: "Success",
        description: "Social links updated successfully",
      });
    } catch (error) {
      console.error("Error updating social links:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update social links",
        variant: "destructive",
      });
    } finally {
      setSavingSection("");
    }
  };

  if (loading) {
    return (
      <div className="max-w-full mx-auto p-5">
        {/* Cover Photo Skeleton */}
        <div className="text-center mb-5">
          <Skeleton className="h-52 w-full" />
        </div>

        {/* Profile Info Skeleton */}
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

        {/* Details Section Skeleton */}
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
      <div className="flex flex-row mb-6 justify-between">
        <div className="justify-start items-start">
          <Link href="/emplyr-dshbrd6161/cmpny-prfl6163">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Institution Profile</h1>
        </div>
        <div className="flex items-end">
          <InstitutionVisibilitySheet position="top-right" />
        </div>
      </div>

      {/* Images Section */}
      <Card className="mb-8 overflow-hidden shadow-md border border-gray-200">
        <CardHeader className="bg-primary/5 pb-0">
          <CardTitle className="text-xl font-semibold text-primary">
            Institution Images
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-[200px] bg-gray-100">
            {coverImagePreview || existingCoverImage ? (
              <div className="w-full h-full relative">
                <Image
                  src={coverImagePreview || existingCoverImage}
                  alt="Cover"
                  layout="fill"
                  objectFit="cover"
                />
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() =>
                    document.getElementById("cover-upload").click()
                  }
                >
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
                  }
                >
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

            {/* Profile image section */}
            <div className="absolute left-6 bottom-0 translate-y-1/2">
              <div className="relative">
                <div className="w-32 h-32 rounded-md border-2 border-primary bg-white overflow-hidden">
                  {profileImagePreview || existingProfileImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={profileImagePreview || existingProfileImage}
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
                    }
                  >
                    Change Institution Logo
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
              className="bg-primary text-white hover:bg-primary/90"
            >
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

      {/* Basic Information Section */}
      <Card className="mb-8 shadow-md border border-gray-200">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl font-semibold text-primary">
            Basic Information & Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...basicInfoForm}>
            <form
              onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={basicInfoForm.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Institution Name{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Delhi Public School" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicInfoForm.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Specialization
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Science and Technology"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={basicInfoForm.control}
                  name="totalStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Total No. of Students
                      </FormLabel>
                      <FormControl>
                        <Input readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={basicInfoForm.control}
                  name="institutionType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-primary">
                        Institution Type{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="private" id="private" />
                            <FormLabel
                              htmlFor="private"
                              className="font-normal"
                            >
                              Private
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="public" id="public" />
                            <FormLabel htmlFor="public" className="font-normal">
                              Public
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={basicInfoForm.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">About</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your institution"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicInfoForm.control}
                  name="mission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Mission</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is your institution's mission?"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={contactForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Phone Number <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={contactForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Website Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://www.example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={savingSection === "basicInfo"}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {savingSection === "basicInfo" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Basic & Contact Information...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Basic & Contact Information
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
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
              className="space-y-6"
            >
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
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                        <Input placeholder="110001" {...field} />
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
                  className="bg-primary text-white hover:bg-primary/90"
                >
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
              className="space-y-6"
            >
              <div className="space-y-4">
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
                            placeholder="https://linkedin.com/school/yourschool"
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
                            placeholder="https://facebook.com/yourschool"
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
                            placeholder="https://instagram.com/yourschool"
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
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Twitter</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                            <Image
                              src="/image/institutndashboard/dashpage/myprofile/twitter.svg"
                              alt="Twitter"
                              width={24}
                              height={24}
                              onError={(e) => {
                                e.target.src =
                                  "/placeholder.svg?height=24&width=24";
                              }}
                            />
                          </div>
                          <Input
                            placeholder="https://twitter.com/yourschool"
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
                            placeholder="https://www.yourschool.edu"
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
                  className="bg-primary text-white hover:bg-primary/90"
                >
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
        <Link href="/emplyr-dshbrd6161/cmpny-prfl6163">
          <Button
            variant="outline"
            className="border-2 border-primary text-primary"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
        <Link href="/emplyr-dshbrd6161/cmpny-prfl6163">
          <Button
            variant="outline"
            className="border-2 border-green-500 text-green-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
