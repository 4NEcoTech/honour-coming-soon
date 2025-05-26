"use client";

import { ProfilePhotoUpload } from "@/components/image-upload";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldUser } from "lucide-react";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Swal from "sweetalert2";
import * as z from "zod";
// Form validation schema
const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  missionCompany: z
    .string()
    .max(1000, "Mission must be less than 1000 characters")
    .optional(),
  aboutCompany: z
    .string()
    .max(1000, "About section must be less than 1000 characters")
    .optional(),
  industry: z.string().min(1, "Industry is required"),
  subIndustry: z.string().min(1, "Sub-industry is required"),
  companyType: z.string().min(1, "Company type is required"),
  companyEmail: z.string().email("Invalid email address"),
  alternateEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().min(10, "Phone number is required"),
  alternatePhone: z.string().optional(),
  companyWebsite: z.string().url("Invalid URL").optional().or(z.literal("")),
  companySize: z.string().min(1, "Company size is required"),
  logoUrl: z.string().optional(),
});

// Industry and sub-industry data
// const industries = [
//   {
//     category: "Technology",
//     subIndustries: [
//       "Software Development",
//       "Information Technology Services",
//       "Cloud Computing",
//       "Artificial Intelligence",
//       "Cybersecurity",
//       "Blockchain",
//       "Data Analytics",
//       "E-commerce",
//     ],
//   },
//   {
//     category: "Finance",
//     subIndustries: [
//       "Banking",
//       "Insurance",
//       "Investment Management",
//       "Fintech",
//       "Accounting",
//       "Financial Planning",
//       "Stock Brokerage",
//     ],
//   },
//   {
//     category: "Healthcare",
//     subIndustries: [
//       "Pharmaceuticals",
//       "Medical Devices",
//       "Healthcare Services",
//       "Biotechnology",
//       "Telemedicine",
//       "Health Insurance",
//     ],
//   },
//   {
//     category: "Manufacturing",
//     subIndustries: [
//       "Automotive",
//       "Electronics",
//       "Textiles",
//       "Food Processing",
//       "Chemicals",
//       "Industrial Equipment",
//     ],
//   },
//   {
//     category: "Retail",
//     subIndustries: [
//       "Department Stores",
//       "Specialty Retail",
//       "E-commerce",
//       "Supermarkets",
//       "Convenience Stores",
//     ],
//   },
// ];

const industries = [
  {
    category: "Education",
    subIndustries: [
      "Education Management",
      "E-Learning",
      "Higher Education",
      "Primary/Secondary Education",
      "Research",
    ],
  },
  {
    category: "Construction",
    subIndustries: [
      "Building Materials",
      "Civil Engineering",
      "Construction",
      "Architecture & Planning",
    ],
  },
  {
    category: "Design",
    subIndustries: ["Design", "Graphic Design"],
  },
  {
    category: "Corporate Services",
    subIndustries: [
      "Accounting",
      "Business Supplies & Equipment",
      "Environmental Services",
      "Events Services",
      "Executive Office",
      "Facilities Services",
      "Human Resources",
      "Information Services",
      "Management Consulting",
      "Outsourcing/Offshoring",
      "Professional Training & Coaching",
      "Security & Investigations",
      "Staffing & Recruiting",
    ],
  },
  {
    category: "Retail",
    subIndustries: [
      "Retail",
      "Supermarkets",
      "Wholesale",
      "Department Stores",
      "Specialty Retail",
      "E-commerce",
      "Convenience Stores",
    ],
  },
  {
    category: "Energy and Mining",
    subIndustries: ["Mining & Metals", "Oil & Energy", "Utilities"],
  },
  {
    category: "Manufacturing",
    subIndustries: [
      "Automotive",
      "Aviation & Aerospace",
      "Chemicals",
      "Defense & Space",
      "Electrical & Electronic Manufacturing",
      "Food Production",
      "Glass, Ceramics & Concrete",
      "Industrial Automation",
      "Machinery",
      "Mechanical or Industrial Engineering",
      "Packaging & Containers",
      "Paper & Forest Products",
      "Plastics",
      "Railroad Manufacture",
      "Renewables & Environment",
      "Shipbuilding",
      "Electronics",
      "Textiles",
      "Food Processing",
      "Industrial Equipment",
    ],
  },
  {
    category: "Textiles",
    subIndustries: ["Textiles", "Apparel & Fashion"],
  },
  {
    category: "Finance",
    subIndustries: [
      "Banking",
      "Capital Markets",
      "Financial Services",
      "Insurance",
      "Investment Banking",
      "Investment Management",
      "Venture Capital & Private Equity",
      "Fintech",
      "Accounting",
      "Financial Planning",
      "Stock Brokerage",
    ],
  },
  {
    category: "Recreation and Travel",
    subIndustries: [
      "Airlines/Aviation",
      "Gambling & Casinos",
      "Hospitality",
      "Leisure, Travel & Tourism",
      "Restaurants",
      "Recreational Facilities & Services",
      "Sports",
    ],
  },
  {
    category: "Arts",
    subIndustries: [
      "Arts & Crafts",
      "Fine Art",
      "Performing Arts",
      "Photography",
    ],
  },
  {
    category: "Healthcare",
    subIndustries: [
      "Biotechnology",
      "Hospital & Health Care",
      "Medical Device",
      "Medical Practice",
      "Mental Health Care",
      "Pharmaceuticals",
      "Veterinary",
      "Telemedicine",
      "Health Insurance",
    ],
  },
  {
    category: "Hardware and Networking",
    subIndustries: [
      "Computer Hardware",
      "Computer Networking",
      "Nanotechnology",
      "Semiconductors",
      "Telecommunications",
      "Wireless",
    ],
  },
  {
    category: "Real Estate",
    subIndustries: ["Commercial Real Estate", "Real Estate"],
  },
  {
    category: "Legal",
    subIndustries: [
      "Alternative Dispute Resolution",
      "Law Practice",
      "Legal Services",
    ],
  },
  {
    category: "Consumer Goods",
    subIndustries: [
      "Apparel & Fashion",
      "Consumer Electronics",
      "Consumer Goods",
      "Consumer Services",
      "Cosmetics",
      "Food & Beverages",
      "Furniture",
      "Luxury Goods & Jewelry",
      "Sporting Goods",
      "Tobacco",
    ],
  },
  {
    category: "Wine and Spirits",
    subIndustries: ["Wine and Spirits"],
  },
  {
    category: "Agriculture",
    subIndustries: ["Dairy", "Farming", "Fishery", "Ranching"],
  },
  {
    category: "Media and Communications",
    subIndustries: [
      "Market Research",
      "Marketing & Advertising",
      "Newspapers",
      "Online Media",
      "Printing",
      "Public Relations & Communications",
      "Publishing",
      "Translation & Localization",
      "Writing & Editing",
    ],
  },
  {
    category: "Nonprofit",
    subIndustries: [
      "Civic & Social Organization",
      "Fundraising",
      "Individual & Family Services",
      "International Trade & Development",
      "Libraries",
      "Museums & Institutions",
      "Non-Profit Organization Management",
      "Philanthropy",
      "Program Development",
      "Religious Institutions",
      "Think Tanks",
    ],
  },
  {
    category: "Software and IT Services",
    subIndustries: [
      "Computer & Network Security",
      "Computer Software",
      "Information Technology & Services",
      "Internet",
      "Software Development",
      "Information Technology Services",
      "Cloud Computing",
      "Artificial Intelligence",
      "Cybersecurity",
      "Blockchain",
      "Data Analytics",
    ],
  },
  {
    category: "Transportation and Logistics",
    subIndustries: [
      "Import & Export",
      "Logistics & Supply Chain",
      "Maritime",
      "Package/Freight Delivery",
      "Transportation/Trucking/Railroad",
      "Warehousing",
    ],
  },
  {
    category: "Entertainment",
    subIndustries: [
      "Animation",
      "Broadcast Media",
      "Computer Games",
      "Entertainment",
      "Media Production",
      "Mobile Games",
      "Motion Pictures & Film",
      "Music",
    ],
  },
  {
    category: "Wellness and Fitness",
    subIndustries: ["Alternative Medicine", "Health, Wellness & Fitness"],
  },
  {
    category: "Public Safety",
    subIndustries: ["Law Enforcement", "Military", "Public Safety"],
  },
  {
    category: "Public Administration",
    subIndustries: [
      "Government Administration",
      "Government Relations",
      "International Affairs",
      "Judiciary",
      "Legislative Office",
      "Political Organization",
      "Public Policy",
    ],
  },
];

// Company size options
const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1001-5000 employees",
  "5000+ employees",
];

export default function CompanyDetails({ initialData, onNext }) {
  const [logo, setLogo] = React.useState(initialData?.logo || null);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [uploadingLogo, setUploadingLogo] = React.useState(false);
  const [selectedIndustry, setSelectedIndustry] = React.useState(
    initialData?.industry || ""
  );
  const [subIndustryOptions, setSubIndustryOptions] = React.useState([]);
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: initialData?.companyName || "",
      missionCompany: initialData?.missionCompany || "",
      aboutCompany: initialData?.aboutCompany || "",
      companySize: initialData?.companySize || "",
      companyType: initialData?.companyType || "private",
      companyEmail: initialData?.companyEmail || "",
      alternateEmail: initialData?.alternateEmail || "",
      phone: initialData?.phone || "",
      alternatePhone: initialData?.alternatePhone || "",
      industry: initialData?.industry || "",
      subIndustry: initialData?.subIndustry || "",
      companyWebsite: initialData?.companyWebsite || "",
      logoUrl: initialData?.logoUrl || "",
    },
  });

  // Update sub-industry options when industry changes
  React.useEffect(() => {
    if (selectedIndustry) {
      const industryObj = industries.find(
        (ind) => ind.category === selectedIndustry
      );
      if (industryObj) {
        setSubIndustryOptions(industryObj.subIndustries);
        form.setValue("subIndustry", "");
      }
    }
  }, [selectedIndustry, form]);

  // Register Doc  function for uploading the images  starts
  const handleLogoUploadSuccess = (url) => {
    console.log("omakr", url);
    form.setValue("logoUrl", url);

    toast({
      title: "Success!",
      description: "Logo uploaded successfully",
      variant: "default",
    });
  };

  const handleLogoRemove = () => {
    form.setValue("logoUrl", "");

    toast({
      title: "Removed",
      description: "Logo removed",
      variant: "default",
    });
  };

  const handleLogoUploadError = (error) => {
    toast({
      title: "Logo upload failed",
      description: error.message || "Please try again with a different image",
      variant: "destructive",
    });
  };

  const handleLogoValidationError = (error) => {
    toast({
      title: "Invalid Logo file",
      description: error.message,
      variant: "destructive",
    });
  };
  // Register Doc  function for uploading the images ends

  // Handle logo upload
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
        form.setValue("logoUrl", result.url);
        Swal.fire({
          title: "Success",
          text: "Company logo uploaded successfully",
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
        text: error.message || "Failed to upload company logo",
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
    console.log("Form data:", data);
    onSubmit({
      ...data,
      logo,
      logoUrl: form.getValues("logoUrl") || "",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          onNext(data);
          console.log("Form data:", data);
        })}
        className="space-y-4 p-4 max-w-xl mx-auto">
        {/* Company Name */}
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Company Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your company name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden field for logo URL
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        Upload Logo
        <FormField
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
                    }>
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
                      <span className="text-primary">Click to upload</span> or
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
          onUploadSuccess={handleLogoUploadSuccess}
          onRemovePhoto={handleLogoRemove}
          onUploadError={handleLogoUploadError}
          onValidationError={handleLogoValidationError}
          userId={session?.user?.id}
          imageTitle={"Upload Logo"}
          imageDescription={""}
          uploadEndpoint="/api/institution/v1/hcjBrBT60282InstitutionProfileImage"
          initialPhoto={form.getValues("logoUrl")}
          onUploadStateChange={setUploadingLogo}
          // uploadIcon={ShieldUser}
          uploadType={"Logo"}
        />

        {/* Industry */}
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Industry <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedIndustry(value);
                  }}
                  value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem
                        key={industry.category}
                        value={industry.category}>
                        {industry.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sub-Industry */}
        <FormField
          control={form.control}
          name="subIndustry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Sub Industry <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedIndustry}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedIndustry
                          ? "Select sub-industry"
                          : "Select industry first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {subIndustryOptions.map((subIndustry) => (
                      <SelectItem key={subIndustry} value={subIndustry}>
                        {subIndustry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Size */}
        <FormField
          control={form.control}
          name="companySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Company Size <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Type */}
        <FormField
          control={form.control}
          name="companyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Company Type <span className="text-destructive">*</span>
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

        {/* Company Email */}
        <FormField
          control={form.control}
          name="companyEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Company Email <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="example@company.com"
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
                Alternate Email{" "}
                <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="alternate@company.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Phone Number <span className="text-destructive">*</span>
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
          name="alternatePhone"
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

        {/* Company Website */}
        <FormField
          control={form.control}
          name="companyWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Company Website{" "}
                <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://your-company.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* About Company */}
        <FormField
          control={form.control}
          name="aboutCompany"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                About Company <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell us about your company, vision, culture..."
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

        {/* Company Mission */}
        <FormField
          control={form.control}
          name="missionCompany"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Company Mission{" "}
                <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="What is your company's mission?"
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
