"use client"

import { companyDocumentSchema } from "@/app/validation/companyDocumentSchema"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Swal from "sweetalert2"

export default function CompanyDocumentDetails() {
  const { data: session } = useSession()
  const router = useRouter()
  const [registrationDocUrl, setRegistrationDocUrl] = useState("")
  const [taxDocUrl, setTaxDocUrl] = useState("")
  const [uploadingRegistration, setUploadingRegistration] = useState(false)
  const [uploadingTax, setUploadingTax] = useState(false)

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
  })

  // Handle registration document upload
  const handleRegistrationDocUpload = async (file) => {
    if (!file) return

    setUploadingRegistration(true)
    try {
      const formData = new FormData()
      formData.append("companyId", session?.user?.companyId || "")
      formData.append("file", file)

      const response = await fetch("/api/institution/v1/hcjBrBT60312InstitutionRegistrationImage", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (result.success && result.url) {
        setRegistrationDocUrl(result.url)
        Swal.fire({
          title: "Success",
          text: "Registration document uploaded successfully",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        })
        return result.url
      } else {
        throw new Error(result.message || "Upload failed")
      }
    } catch (error) {
      console.error("Registration document upload error:", error)
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to upload registration document",
        icon: "error",
        confirmButtonText: "OK",
      })
      return null
    } finally {
      setUploadingRegistration(false)
    }
  }

  // Handle tax document upload
  const handleTaxDocUpload = async (file) => {
    if (!file) return

    setUploadingTax(true)
    try {
      const formData = new FormData()
      formData.append("companyId", session?.user?.companyId || "")
      formData.append("file", file)

      const response = await fetch("/api/institution/v1/hcjBrBT60313InstitutionTaxImage", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (result.success && result.url) {
        setTaxDocUrl(result.url)
        Swal.fire({
          title: "Success",
          text: "Tax document uploaded successfully",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        })
        return result.url
      } else {
        throw new Error(result.message || "Upload failed")
      }
    } catch (error) {
      console.error("Tax document upload error:", error)
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to upload tax document",
        icon: "error",
        confirmButtonText: "OK",
      })
      return null
    } finally {
      setUploadingTax(false)
    }
  }

  const onSubmit = async (data) => {
    // Check if documents have been uploaded
    if (!registrationDocUrl) {
      Swal.fire({
        title: "Missing Document",
        text: "Please upload your registration document first",
        icon: "warning",
        confirmButtonText: "OK",
      })
      return
    }

    if (!taxDocUrl) {
      Swal.fire({
        title: "Missing Document",
        text: "Please upload your tax document first",
        icon: "warning",
        confirmButtonText: "OK",
      })
      return
    }

    // Prepare data for submission
    const submissionData = {
      CKD_Company_Id: session?.user?.companyId || "",
      CKD_Company_Registration_Number: data.registrationNumber,
      CKD_Company_Tax_Id: data.taxGstNumber,
      CKD_Company_Registration_Documents: registrationDocUrl,
      CKD_Company_Tax_Documents: taxDocUrl,
      CKD_Submitted_By: session?.user?.email || "",
      CKD_Audit_Trail: [{ action: "submitted", timestamp: new Date().toISOString() }],
    }

    try {
      const response = await fetch("/api/institution/v1/hcjBrBT60311InstitutionDocument", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (response.ok) {
        Swal.fire({
          title: "Success",
          text: result.message,
          icon: "success",
          confirmButtonText: "OK",
        })
        reset()
        setRegistrationDocUrl("")
        setTaxDocUrl("")
        router.push("/vrfctn-pndng6032")
      } else {
        Swal.fire({
          title: "Error",
          text: result.message || "Submission failed",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      Swal.fire({
        title: "Error",
        text: "An error occurred during submission. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Company Document Details</h1>
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
                render={({ field }) => <Input id="registrationNumber" placeholder="Registration number" {...field} />}
              />
              {errors.registrationNumber && (
                <p className="text-destructive text-sm">{errors.registrationNumber.message}</p>
              )}
            </div>

            {/* Upload Registration Document */}
            <div className="space-y-1 mb-6">
              <Label htmlFor="registrationDoc" className="text-primary">
                Company Registration Documents <span className="text-destructive">*</span>
              </Label>
              <p className="text-gray-400 text-xs mt-1">
                Please ensure both front and back sides of the documents are uploaded
              </p>
              <Controller
                name="registrationDoc"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div
                    className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center"
                    onClick={() => document.getElementById("registrationDoc").click()}
                  >
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
                        className="text-blue-500"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <p className="text-blue-500 font-medium">Click here</p>
                    <p className="text-gray-600">to upload your file or drag and drop</p>
                    <p className="text-gray-400 text-xs mt-1">Supported format: PDF,JPG,PNG (2mb)</p>
                    <Input
                      type="file"
                      id="registrationDoc"
                      accept=".pdf,.jpg,.png"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        onChange(file)
                        if (file) {
                          await handleRegistrationDocUpload(file)
                        }
                      }}
                      className="hidden"
                      {...field}
                    />
                    {value && <p className="text-green-600 text-sm mt-2">File selected: {value.name}</p>}
                    {uploadingRegistration && <p className="text-blue-600 text-sm mt-2">Uploading... Please wait</p>}
                    {registrationDocUrl && (
                      <p className="text-green-600 text-sm mt-2">✓ Registration document uploaded successfully</p>
                    )}
                  </div>
                )}
              />
              {errors.registrationDoc && <p className="text-destructive text-sm">{errors.registrationDoc.message}</p>}
            </div>

            {/* Tax/GST Number */}
            <div className="space-y-1 mb-6">
              <Label htmlFor="taxGstNumber" className="text-primary">
                Tax/GST Number <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="taxGstNumber"
                control={control}
                render={({ field }) => <Input id="taxGstNumber" placeholder="Tax/gst number" {...field} />}
              />
              {errors.taxGstNumber && <p className="text-destructive text-sm">{errors.taxGstNumber.message}</p>}
            </div>

            {/* Upload Tax/GST Document */}
            <div className="space-y-1 mb-6">
              <Label htmlFor="taxDoc" className="text-primary">
                Tax/GST Document <span className="text-destructive">*</span>
              </Label>
              <p className="text-gray-400 text-xs mt-1">
                Please ensure both front and back sides of the documents are uploaded
              </p>
              <Controller
                name="taxDoc"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div
                    className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center"
                    onClick={() => document.getElementById("taxDoc").click()}
                  >
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
                        className="text-blue-500"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <p className="text-blue-500 font-medium">Click here</p>
                    <p className="text-gray-600">to upload your file or drag and drop</p>
                    <p className="text-gray-400 text-xs mt-1">Supported format: PDF,JPG,PNG (2mb)</p>
                    <Input
                      type="file"
                      id="taxDoc"
                      accept=".pdf,.jpg,.png"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        onChange(file)
                        if (file) {
                          await handleTaxDocUpload(file)
                        }
                      }}
                      className="hidden"
                      {...field}
                    />
                    {value && <p className="text-green-600 text-sm mt-2">File selected: {value.name}</p>}
                    {uploadingTax && <p className="text-blue-600 text-sm mt-2">Uploading... Please wait</p>}
                    {taxDocUrl && <p className="text-green-600 text-sm mt-2">✓ Tax document uploaded successfully</p>}
                  </div>
                )}
              />
              {errors.taxDoc && <p className="text-destructive text-sm">{errors.taxDoc.message}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || uploadingRegistration || uploadingTax || !registrationDocUrl || !taxDocUrl}
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
