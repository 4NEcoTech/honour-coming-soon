"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import {AdminPersonalSchema} from "@/app/validation/adminSchema";

// const personalSchema = z.object({
//   photo: z.any().optional(),
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   corporateEmail: z.string().email("Invalid email format"),
//   alternateEmail: z.string().email("Invalid email format").optional(),
//   phone: z.string().min(10, "Phone number is required"),
//   alternatePhone: z.string().optional(),
//   designation: z.string().optional(),
//   profileHeadline: z.string().optional(),
//   gender: z.enum(["01", "02", "03"], { required_error: "Gender is required" }),
//   dob: z.string().min(1, "Date of birth is required"),
// });
export default function PersonalDetails({
  initialData,
  isSubmitting,
  onSubmit,
}) {
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(
    initialData?.photoUrl || null
  );

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(AdminPersonalSchema),
    defaultValues: {
      photo: initialData?.photo || null,
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      corporateEmail: session?.user?.email || initialData?.corporateEmail || "",
      alternateEmail: initialData?.alternateEmail || "",
      phone: initialData?.phone || "",
      alternatePhone: initialData?.alternatePhone || "",
      designation: initialData?.designation || "",
      profileHeadline: initialData?.profileHeadline || "",
      gender: initialData?.gender || "",
      dob: initialData?.dob || "",
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (less than 2MB)
      if (file.size > 2 * 1024 * 1024) {
        form.setError("photo", {
          type: "manual",
          message: "File size should be less than 2MB",
        });
        return;
      }

      // Check file type
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        form.setError("photo", {
          type: "manual",
          message: "Only JPG, JPEG, and PNG files are allowed",
        });
        return;
      }

      setUploadedFile(file);
      form.setValue("photo", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  React.useEffect(()=>{
    form.setValue("corporateEmail", session?.user?.email)
  },[session])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-2 sm:p-4 max-w-xl mx-auto">
        {/* Upload Profile Photo */}
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="uploadPhoto"
                className="text-primary font-medium">
                Upload Profile Photo
              </FormLabel>
              <FormControl>
                <div
                  className="relative border-2 border-dashed border-blue-200 rounded-lg p-6 cursor-pointer text-center hover:bg-blue-50 transition-colors"
                  onClick={() =>
                    document.getElementById('uploadPhoto')?.click()
                  }>
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-blue-300">
                        <img
                          src={previewUrl || '/placeholder.svg'}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-primary text-sm">
                        Click to change photo
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto mb-2 w-10 h-10 text-primary" />
                      <p className="text-gray-600">
                        <span className="text-primary font-medium">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        JPG, JPEG, PNG less than 2MB
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    id="uploadPhoto"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Fields */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-medium">
                First Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="First name"
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-medium">
                Last Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Last name"
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="corporateEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-medium">
                Corporate Email ID <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Corporate email ID"
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternateEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-medium">
                Alternate Email ID <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Alternate email ID"
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel className="text-primary font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </FormLabel>
                <Button
                  type="button"
                  variant="link"
                  className="text-primary p-0 h-auto text-xs">
                  Verify with OTP
                </Button>
              </div>
              <FormControl>
                <PhoneInput
                  country={'in'}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                  buttonStyle={{
                    borderRadius: '5px 0 0 5px',
                    border: '1px solid #ccc',
                  }}
                  dropdownStyle={{
                    width: '300px',
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternatePhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-medium">
                Alternate Phone Number{' '}
                <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <PhoneInput
                  country={'in'}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                  buttonStyle={{
                    borderRadius: '5px 0 0 5px',
                    border: '1px solid #ccc',
                  }}
                  dropdownStyle={{
                    width: '300px',
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-medium">
                Gender <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">Male</SelectItem>
                    <SelectItem value="02">Female</SelectItem>
                    <SelectItem value="03">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-medium">
                Date of Birth <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-medium">
                Designation <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your current designation"
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profileHeadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-medium">
                Profile Headline{' '}
                <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your profile headline"
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full text-white py-2 rounded-md transition-colors"
          disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Next'}
        </Button>
      </form>
    </Form>
  );
}
