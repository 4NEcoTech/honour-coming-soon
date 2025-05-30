"use client";

import { companyDocumentSchema } from "@/app/validation/employeeDocumentSchema";
import { ProfilePhotoUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldUser } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";

// REG1234567
// 22AAAAA0000A1Z5
export default function CompanyDocumentDetails() {
  const { data: session } = useSession();
  const router = useRouter();
  const [registrationDocUrl, setRegistrationDocUrl] = useState("");
  const [taxDocUrl, setTaxDocUrl] = useState("");
  const [uploadingRegistration, setUploadingRegistration] = useState(false);
  const [uploadingTax, setUploadingTax] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(companyDocumentSchema),
    defaultValues: {
      registrationNumber: "",
      taxGstNumber: "",
    },
  });
  console.log("errors", errors);

  // Register Doc  function for uploading the images  starts
  const handleRegistrationDocUploadSuccess = (url) => {
    console.log("omakr", url);
    // form.setValue("logoUrl", url);
    setRegistrationDocUrl(url);

    toast({
      title: "Success!",
      description: "Document uploaded successfully",
      variant: "default",
    });
  };

  const handleRegistrationDocRemove = () => {
    setRegistrationDocUrl("");

    toast({
      title: "Removed",
      description: "Document removed",
      variant: "default",
    });
  };

  const handleRegistrationDocUploadError = (error) => {
    toast({
      title: "Document upload failed",
      description: error.message || "Please try again with a different image",
      variant: "destructive",
    });
  };

  const handleRegistrationDocValidationError = (error) => {
    toast({
      title: "Invalid Document file",
      description: error.message,
      variant: "destructive",
    });
  };
  // Register Doc  function for uploading the images ends

  // Register TaxDoc  function for uploading the images  starts
  const handleTaxDocUploadSuccess = (url) => {
    // console.log("omakr", url);
    // form.setValue("logoUrl", url);
    setTaxDocUrl(url);

    toast({
      title: "Success!",
      description: "TaxDocument uploaded successfully",
      variant: "default",
    });
  };

  const handleTaxDocRemove = () => {
    setTaxDocUrl("");

    toast({
      title: "Removed",
      description: "TaxDocument removed",
      variant: "default",
    });
  };

  const handleTaxDocUploadError = (error) => {
    toast({
      title: "TaxDocument upload failed",
      description: error.message || "Please try again with a different image",
      variant: "destructive",
    });
  };

  const handleTaxDocValidationError = (error) => {
    toast({
      title: "Invalid TaxDocument file",
      description: error.message,
      variant: "destructive",
    });
  };
  // Register TaxDoc  function for uploading the images ends

  const onSubmit = async (data) => {
    // Check if documents have been uploaded
    if (!registrationDocUrl) {
      Swal.fire({
        title: "Missing Document",
        text: "Please upload your registration document first",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!taxDocUrl) {
      Swal.fire({
        title: "Missing Document",
        text: "Please upload your tax document first",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    // Prepare data for submission
    const submissionData = {
      CKD_Company_Id: session?.user?.companyId || "",
      CKD_Company_Registration_Number: data.registrationNumber,
      CKD_Company_Tax_Id: data.taxGstNumber,
      CKD_Company_Registration_Documents: registrationDocUrl,
      CKD_Company_Tax_Documents: taxDocUrl,
      CKD_Submitted_By: session?.user?.email || "",
      CKD_Audit_Trail: [
        { action: "submitted", timestamp: new Date().toISOString() },
      ],
    };

    try {
      const response = await fetch(
        "/api/institution/v1/hcjBrBT60311InstitutionDocument",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Redirecting to verification pending page...");
        Swal.fire({
          title: "Success",
          text: result.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        reset();
        setRegistrationDocUrl("");
        setTaxDocUrl("");
        router.push("/vrfctn-pndng6032");
      } else {
        Swal.fire({
          title: "Error",
          text: result.message || "Submission failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred during submission. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  
  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-xl font-bold mb-4 text-center">
        Company Document Details
      </h1>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="space-y-6 p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Registration Number */}
            <div className="space-y-1 mb-6">
              <Label htmlFor="registrationNumber" className="text-primary">
                Registration Number <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="registrationNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="registrationNumber"
                    placeholder="Registration number"
                    {...field}
                  />
                )}
              />
              {errors.registrationNumber && (
                <p className="text-destructive text-sm">
                  {errors.registrationNumber.message}
                </p>
              )}
            </div>

            {/* Upload Registration Document
            <div className="space-y-1 mb-6">
              <Label htmlFor="registrationDoc" className="text-primary">
                Company Registration Documents{" "}
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
                    className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center"
                    onClick={() =>
                      document.getElementById("registrationDoc").click()
                    }>
                    <div className="flex justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-500">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <p className="text-blue-500 font-medium">Click here</p>
                    <p className="text-gray-600">
                      to upload your file or drag and drop
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Supported format: PDF,JPG,PNG (2mb)
                    </p>
                    <Input
                      type="file"
                      id="registrationDoc"
                      accept=".pdf,.jpg,.png"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        onChange(file);
                        if (file) {
                          await handleRegistrationDocUpload(file);
                        }
                      }}
                      className="hidden"
                      {...field}
                    />
                    {value && (
                      <p className="text-green-600 text-sm mt-2">
                        File selected: {value.name}
                      </p>
                    )}
                    {uploadingRegistration && (
                      <p className="text-blue-600 text-sm mt-2">
                        Uploading... Please wait
                      </p>
                    )}
                    {registrationDocUrl && (
                      <p className="text-green-600 text-sm mt-2">
                        ✓ Registration document uploaded successfully
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
            </div> */}

            <ProfilePhotoUpload
              onUploadSuccess={handleTaxDocUploadSuccess}
              onRemovePhoto={handleTaxDocRemove}
              onUploadError={handleTaxDocUploadError}
              onValidationError={handleTaxDocValidationError}
              userId={session?.user?.id}
              imageTitle={"Company Registration Documents"}
              imageDescription={
                " Please ensure both front and back sides of the documents are uploaded"
              }
              optional={false}
              uploadEndpoint="/api/institution/v1/hcjBrBT60312InstitutionRegistrationImage"
              initialPhoto={registrationDocUrl}
              onUploadStateChange={setUploadingRegistration}
              // uploadIcon={ShieldUser}
              uploadType={"Document"}
            />

            {/* Tax/GST Number */}
            <div className="space-y-1 mb-6">
              <Label htmlFor="taxGstNumber" className="text-primary">
                Tax/GST Number <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="taxGstNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="taxGstNumber"
                    placeholder="Tax/gst number"
                    {...field}
                  />
                )}
              />
              {errors.taxGstNumber && (
                <p className="text-destructive text-sm">
                  {errors.taxGstNumber.message}
                </p>
              )}
            </div>

            {/* Upload Tax/GST Document */}
            {/* <div className="space-y-1 mb-6">
              <Label htmlFor="taxDoc" className="text-primary">
                Tax/GST Document <span className="text-destructive">*</span>
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
                    className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center"
                    onClick={() => document.getElementById("taxDoc").click()}>
                    <div className="flex justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-500">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <p className="text-blue-500 font-medium">Click here</p>
                    <p className="text-gray-600">
                      to upload your file or drag and drop
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Supported format: PDF,JPG,PNG (2mb)
                    </p>
                    <Input
                      type="file"
                      id="taxDoc"
                      accept=".pdf,.jpg,.png"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        onChange(file);
                        if (file) {
                          await handleTaxDocUpload(file);
                        }
                      }}
                      className="hidden"
                      {...field}
                    />
                    {value && (
                      <p className="text-green-600 text-sm mt-2">
                        File selected: {value.name}
                      </p>
                    )}
                    {uploadingTax && (
                      <p className="text-blue-600 text-sm mt-2">
                        Uploading... Please wait
                      </p>
                    )}
                    {taxDocUrl && (
                      <p className="text-green-600 text-sm mt-2">
                        ✓ Tax document uploaded successfully
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
            </div> */}

            <ProfilePhotoUpload
              onUploadSuccess={handleRegistrationDocUploadSuccess}
              onRemovePhoto={handleRegistrationDocRemove}
              onUploadError={handleRegistrationDocUploadError}
              onValidationError={handleRegistrationDocValidationError}
              userId={session?.user?.id}
              imageTitle={"Tax/GST Document"}
              imageDescription={
                "Please ensure both front and back sides of the documents are uploaded"
              }
              optional={false}
              uploadEndpoint="/api/institution/v1/hcjBrBT60313InstitutionTaxImage"
              initialPhoto={taxDocUrl}
              onUploadStateChange={setUploadingRegistration}
              // uploadIcon={ShieldUser}
              uploadType={"Document"}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                uploadingRegistration ||
                uploadingTax ||
                !registrationDocUrl ||
                !taxDocUrl
              }>
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
