"use client";

import { FormMultiSelect } from "@/components/extension/multi-select";
import { ProfilePhotoUpload } from "@/components/image-upload";
import { YearSelect } from "@/components/select-year";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Swal from "sweetalert2";
import * as z from "zod";

const formSchema = (t) =>
  z.object({
    institutionName: z.string().min(2, t("6028_1")),
    mission: z.string().max(1000, t("6028_2")),
    about: z.string().max(1000, t("6028_3")).optional(),
    specialization: z.array(z.string().min(1)).min(1, t("6028_4")),
    institutionType: z.string().min(1, t("6028_5")),
    institutionEmail: z.string().email(t("6028_6")),
    alternateEmail: z.string().email(t("6028_7")).optional().or(z.literal("")),
    phoneNumber: z.string().min(10, t("6028_8")),
    alternatePhoneNumber: z.string().optional(),
    websiteUrl: z.string().url(t("6028_9")).optional().or(z.literal("")),
    establishmentYear: z.string().optional(),
    logoUrl: z.string().optional(),
  });

const specializations = [
  {
    category: "Engineering and Technology",
    specializations: [
      { label: "Computer Science Engineering (CSE)", value: "cse" },
      { label: "Information Technology (IT)", value: "it" },
      {
        label: "Electronics and Communication Engineering (ECE)",
        value: "ece",
      },
      { label: "Electrical and Electronics Engineering (EEE)", value: "eee" },
      { label: "Mechanical Engineering", value: "mechanical-engineering" },
      { label: "Civil Engineering", value: "civil-engineering" },
      { label: "Chemical Engineering", value: "chemical-engineering" },
      { label: "Biotechnology", value: "biotechnology" },
      {
        label: "Artificial Intelligence and Machine Learning (AI/ML)",
        value: "ai-ml",
      },
      { label: "Data Science and Analytics", value: "data-science" },
      { label: "Robotics and Automation", value: "robotics" },
      { label: "Cybersecurity", value: "cybersecurity" },
      { label: "Cloud Computing", value: "cloud-computing" },
      { label: "Blockchain", value: "blockchain" },
      { label: "UI/UX Design", value: "ui-ux" },
      { label: "DevOps", value: "devops" },
    ],
  },
  {
    category: "Management and Business Administration",
    specializations: [
      { label: "Finance", value: "finance" },
      { label: "Marketing", value: "marketing" },
      { label: "Human Resource Management (HRM)", value: "hrm" },
      {
        label: "Operations and Supply Chain Management",
        value: "operations-supply-chain",
      },
      { label: "International Business", value: "international-business" },
      { label: "Business Analytics", value: "business-analytics" },
      { label: "Entrepreneurship", value: "entrepreneurship" },
      { label: "Digital Marketing", value: "digital-marketing" },
    ],
  },
  {
    category: "Arts, Humanities, and Social Sciences",
    specializations: [
      { label: "Psychology", value: "psychology" },
      { label: "Sociology", value: "sociology" },
      { label: "Political Science", value: "political-science" },
      { label: "History", value: "history" },
      { label: "Geography", value: "geography" },
      { label: "Economics", value: "economics" },
      { label: "English Literature", value: "english-literature" },
    ],
  },
  {
    category: "Science",
    specializations: [
      { label: "Physics", value: "physics" },
      { label: "Chemistry", value: "chemistry" },
      { label: "Mathematics", value: "mathematics" },
      { label: "Biology", value: "biology" },
      { label: "Microbiology", value: "microbiology" },
      { label: "Environmental Science", value: "environmental-science" },
    ],
  },
  {
    category: "Commerce and Finance",
    specializations: [
      { label: "Accounting and Auditing", value: "accounting" },
      { label: "Taxation", value: "taxation" },
      { label: "Banking and Insurance", value: "banking-insurance" },
      { label: "Corporate Law", value: "corporate-law" },
    ],
  },
  {
    category: "Medical and Health Sciences",
    specializations: [
      { label: "Medicine (MBBS)", value: "mbbs" },
      { label: "Nursing", value: "nursing" },
      { label: "Pharmacy (BPharm)", value: "pharmacy" },
      { label: "Physiotherapy", value: "physiotherapy" },
      { label: "Public Health and Epidemiology", value: "public-health" },
    ],
  },
  {
    category: "Design and Creative Arts",
    specializations: [
      { label: "Fashion Design", value: "fashion-design" },
      { label: "Interior Design", value: "interior-design" },
      { label: "Graphic Design", value: "graphic-design" },
      { label: "Animation and Multimedia", value: "animation" },
    ],
  },
  {
    category: "Law",
    specializations: [
      { label: "Corporate Law", value: "corporate-law" },
      { label: "Criminal Law", value: "criminal-law" },
    ],
  },
  {
    category: "Other Specialized Fields",
    specializations: [
      { label: "Journalism and Mass Communication", value: "journalism" },
      { label: "Film and Television Production", value: "film-production" },
      { label: "Event Management", value: "event-management" },
      { label: "Sports Management", value: "sports-management" },
    ],
  },
];

const currentYear = new Date().getFullYear();

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function EducationalDetailsTab({ initialData, onSubmit }) {
  const [logo, setLogo] = useState(initialData?.logo || null);
  const [searchResults, setSearchResults] = useState([]);
  const [customEntry, setCustomEntry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const tForm = useTranslations("formErrors");

  const fetchInstitutions = async (query) => {
    if (query.length < 4) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/global/v1/gblArET90011FtchInstitutnDtls?institutionName=${query}`
      );
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch {
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleSearch = debounce(fetchInstitutions, 500);

  const form = useForm({
    resolver: zodResolver(formSchema(tForm)),
    defaultValues: {
      institutionName: initialData?.institutionName || "",
      mission: initialData?.mission || "",
      about: initialData?.about || "",
      specialization: initialData?.specialization?.split(",") || [],
      institutionType: initialData?.institutionType || "",
      institutionEmail: initialData?.institutionEmail || "",
      alternateEmail: initialData?.alternateEmail || "",
      phoneNumber: initialData?.phoneNumber || "",
      alternatePhoneNumber: initialData?.alternatePhoneNumber || "",
      websiteUrl: initialData?.websiteUrl || "",
      establishmentYear: initialData?.establishmentYear || currentYear,
      logoUrl: initialData?.logoUrl || "",
    },
  });

  const handleLogoUpload = async (file) => {
    if (!file) return null;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("individualId", session?.user?.individualId || "");
      formData.append("file", file);

      const response = await fetch(
        "/api/institution/v1/hcjBrBT60282InstitutionProfileImage",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success && result.url) {
        // Set the URL in the form
        form.setValue("logoUrl", result.url);

        Swal.fire({
          title: "Success",
          text: "Institution logo uploaded successfully",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });

        return result.url;
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to upload institution logo",
        icon: "error",
        confirmButtonText: "OK",
      });
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  // const handleFileChange = async (e, onChange) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     // Check file size (less than 2MB)
  //     if (file.size > 2 * 1024 * 1024) {
  //       Swal.fire({
  //         title: "Error",
  //         text: "File size should be less than 2MB",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //       return;
  //     }

  //     // Check file type
  //     if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
  //       Swal.fire({
  //         title: "Error",
  //         text: "Only JPG, JPEG, and PNG files are allowed",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //       return;
  //     }

  //     setUploadedFile(file);

  //     // Create preview URL
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setLogo(e.target.result);
  //       onChange(e.target.result);
  //     };
  //     reader.readAsDataURL(file);

  //     // Upload the logo immediately
  //     await handleLogoUpload(file);
  //   }
  // };

  const handleSubmit = (data) => {
    const formattedSpecialization = Array.isArray(data.specialization)
      ? data.specialization.join(",")
      : data.specialization;
    onSubmit({
      ...data,
      logo,
      specialization: formattedSpecialization,
      logoUrl: form.getValues("logoUrl") || "",
    });
  };

  const capitalize = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => {
        // Handle words in parentheses or with punctuation
        if (word.length === 0) return "";
        if (word.startsWith("(")) {
          return "(" + word[1].toUpperCase() + word.slice(2);
        }
        return word[0].toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  const handleUploadSuccess = (url) => {
    // setProfileImageUrl(url);
    form.setValue("logoUrl", url);
    console.log("Uploaded URL:", url);
    toast({
      title: "Success!",
      description: tForm("6028_10"),
      variant: "default",
    });
  };

  const handleRemovePhoto = () => {
    form.setValue("logoUrl", "");
    toast({
      title: "Removed",
      description: tForm("6028_11"),
      variant: "default",
    });
  };

  const handleUploadError = (error) => {
    toast({
      title: "Upload failed",
      description: tForm("6028_12", {
        message: error.message,
      }),
      variant: "destructive",
    });
  };

  const handleValidationError = (error) => {
    toast({
      title: "Invalid file",
      description: tForm("6028_13", {
        message: error.message,
      }),
      variant: "destructive",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-2 sm:p-4 max-w-xl mx-auto">
        {/* Institution Name */}
        <FormField
          control={form.control}
          name="institutionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Institution Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Search Institution"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleSearch(e.target.value);
                      setCustomEntry(false);
                    }}
                  />
                  {loading && (
                    <span className="absolute right-3 top-3 text-gray-500">
                      Loading...
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />

              {/* Dropdown Results */}
              {searchResults.length > 0 && !customEntry && (
                <ul className="border mt-2 rounded-md bg-white shadow-lg">
                  {searchResults.map((inst) => (
                    <li
                      key={inst.AISHE_Code}
                      className="p-2 cursor-pointer hover:bg-gray-100 capitalize"
                      onClick={() => {
                        field.onChange(toTitleCase(inst.Institute_Name));
                        setSearchResults([]);
                      }}>
                      {toTitleCase(inst.Institute_Name)}
                    </li>
                  ))}
                </ul>
              )}

              {/* Manual Entry Option */}
              {!loading &&
                searchResults.length === 0 &&
                !customEntry &&
                field.value.length >= 4 && (
                  <p
                    className="mt-2 text-sm text-blue-600 cursor-pointer"
                    onClick={() => setCustomEntry(true)}>
                    Can&apos;t find your institution? Click here to enter
                    manually.
                  </p>
                )}
            </FormItem>
          )}
        />

        {/* Hidden field for logo URL */}
        {/* <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => <input type="hidden" {...field} />}
        /> */}

        {/* Upload Logo */}
        {/* <FormField
          control={form.control}
          name="logo"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Upload Logo <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <div>
                  <div
                    className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center"
                    onClick={() =>
                      document.getElementById("uploadLogo")?.click()
                    }
                  >
                    {uploadingLogo ? (
                      <Loader2 className="mx-auto mb-2 w-8 h-8 animate-spin text-primary" />
                    ) : (
                      <Image
                        src={logo || "/image/info/upload.svg"}
                        alt="Upload Icon"
                        width={32}
                        height={32}
                        className="mx-auto mb-2 w-8 h-8"
                      />
                    )}
                    <p className="text-gray-600">
                      <span className="text-blue-600">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      JPG, JPEG, PNG less than 2MB
                    </p>
                  </div>
                  <Input
                    type="file"
                    id="uploadLogo"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, onChange)}
                    className="hidden"
                    disabled={uploadingLogo}
                    {...field}
                  />
                  {uploadedFile && !uploadingLogo && (
                    <p className="text-green-600 mt-2">
                      File uploaded: {uploadedFile.name}
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <ProfilePhotoUpload
          onUploadSuccess={handleUploadSuccess}
          onRemovePhoto={handleRemovePhoto}
          onUploadError={handleUploadError}
          onValidationError={handleValidationError}
          userId={session?.user?.id}
          imageTitle={"Upload Logo"}
          uploadEndpoint="/api/institution/v1/hcjBrBT60282InstitutionProfileImage"
          initialPhoto={form.getValues("logoUrl")}
          onUploadStateChange={setUploadingLogo}
          // UploadIcon={ShieldUser}
          uploadType={"logo"}
        />
        {/* Establishment Year */}
        <FormField
          control={form.control}
          name="establishmentYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Establishment Year<span className="text-destructive">*</span>
              </FormLabel>
              <YearSelect name="establishmentYear" control={form.control} />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mission */}
        <FormField
          control={form.control}
          name="mission"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Mission <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Let us know about your mission"
                  className="resize-none min-h-[100px]"
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">Less than 1000 words</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Specialization */}
        <FormMultiSelect
          name="specialization"
          label="Specializations"
          options={specializations}
          placeholder="Select specializations..."
        />

        {/* Institution Type */}
        <FormField
          control={form.control}
          name="institutionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Institution Type <span className="text-destructive">*</span>
              </FormLabel>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="private"
                    value="private"
                    checked={field.value === "private"}
                    onChange={() => field.onChange("private")}
                    className="mr-2"
                  />
                  <label htmlFor="private">Private</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="public"
                    value="public"
                    checked={field.value === "public"}
                    onChange={() => field.onChange("public")}
                    className="mr-2"
                  />
                  <label htmlFor="public">Public</label>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Institution Email */}
        <FormField
          control={form.control}
          name="institutionEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Institution Email ID <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="example@institution.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Alternate Email */}
        <FormField
          control={form.control}
          name="alternateEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Alternate Email ID{" "}
                <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="alternate@institution.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Phone Number<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <PhoneInput
                  country={"in"}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
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

        {/* Alternate Phone Number */}
        <FormField
          control={form.control}
          name="alternatePhoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Alternate Phone Number{" "}
                <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <PhoneInput
                  country={"in"}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
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

        {/* Institution Website */}
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Institution Website URL{" "}
                <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://your-website.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                About Institution{" "}
                <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell us about your institution, vision, culture, impact..."
                  className="resize-none min-h-[100px]"
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Less than 1000 characters
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-primary"
          disabled={uploadingLogo}>
          {uploadingLogo ? "Uploading Logo..." : "Next"}
        </Button>
      </form>
    </Form>
  );
}
