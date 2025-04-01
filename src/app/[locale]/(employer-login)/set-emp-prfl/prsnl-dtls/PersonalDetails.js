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
import { Input } from "@/components/ui/input";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as React from "react";
import { useForm } from "react-hook-form";

export default function PersonalDetails({
  initialData,
  isSubmitting,
  onSubmit,
}) {
  const [uploadedFile, setUploadedFile] = React.useState(null);

  const form = useForm({
    defaultValues: {
      photo: null,
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      corporateEmail: initialData?.corporateEmail || "",
      alternateEmail: initialData?.alternateEmail || "",
      phone: initialData?.phone || "",
      alternatePhone: initialData?.alternatePhone || "",
      designation: initialData?.designation || "",
      profileHeadline: initialData?.profileHeadline || "",
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 max-w-xl mx-auto"
      >
        {/* Upload Profile Photo */}
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="uploadPhoto" className="text-primary">
                Upload Profile Photo
              </FormLabel>
              <FormControl>
                <div
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center"
                  onClick={() =>
                    document.getElementById("uploadPhoto")?.click()
                  }
                >
                  <Image
                    src="/image/info/upload.svg"
                    alt="Upload Icon"
                    width={32}
                    height={32}
                    className="mx-auto mb-2 w-8 h-8"
                  />
                  <p className="text-gray-600">
                    <span className="text-primary">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    JPG, JPEG, PNG less than 2MB
                  </p>
                  <input
                    type="file"
                    id="uploadPhoto"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                      handleFileChange(e);
                      field.onChange(e.target.files?.[0]);
                    }}
                    className="hidden"
                  />
                </div>
              </FormControl>
              {uploadedFile && (
                <p className="text-green-600 mt-2">
                  File uploaded: {uploadedFile.name}
                </p>
              )}
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
              <FormLabel className='text-primary'>First Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="First name" />
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
              <FormLabel className='text-primary'>Last Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="Last name" />
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
              <FormLabel className='text-primary'>Corporate Email ID <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Corporate email ID"
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
              <FormLabel className='text-primary'>Alternate Email ID <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Alternate email ID"
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
              <FormLabel className="text-primary">Phone Number <span className="text-destructive">*</span></FormLabel>
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

        <FormField
          control={form.control}
          name="alternatePhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-primary'>Alternate Phone Number <span className="text-destructive">*</span></FormLabel>
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

        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-primary'>Designation</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your current designation"
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
              <FormLabel className='text-primary'>Profile Headline</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your profile headline" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full bg-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
