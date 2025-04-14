"use client"

import { companyDocumentSchema } from "@/app/validation/companyDocumentSchema"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Swal from "sweetalert2"

export default function EducationalDocumentDetails() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [registrationDocUrl, setRegistrationDocUrl] = useState("")
  const [taxDocUrl, setTaxDocUrl] = useState("")
  const [uploadingRegistration, setUploadingRegistration] = useState(false)
  const [uploadingTax, setUploadingTax] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(companyDocumentSchema),
    defaultValues: {
      institutionType: "College",
      aisheCode: "",
      collegeName: "",
      affiliatedUniversity: "",
      universityName: "",
      universityType: "",
      taxId: "",
      companyRegistrationNumber: "",
    },
  })

  const fetchInstitutionDetails = async (aisheCode) => {
    if (!aisheCode) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/global/v1/gblArET90011FtchInstitutnDtls?AISHE_Code=${aisheCode}`)
      const result = await response.json()

      if (result.success && result.data && result.data.length > 0) {
        const institutionData = result.data[0]

        // Auto-fill fields based on institution type
        if (watch("institutionType") === "College") {
          setValue("collegeName", institutionData.Institute_Name)
          setValue("affiliatedUniversity", institutionData.Name_of_Affiliated_University)
        } else if (watch("institutionType") === "University") {
          setValue("universityName", institutionData.Name_of_Affiliated_University)
          setValue("universityType", institutionData.Type_of_Institute)
        }
      }
    } catch (error) {
      console.error("Error fetching institution details:", error)
    } finally {
      setIsLoading(false)
    }
  }

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

  const institutionType = watch("institutionType")

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
      CKD_Institution_Type: data.institutionType,
      CKD_AISHE_Code: data.aisheCode,
      CKD_Company_Tax_Id: data.taxId,
      CKD_Company_Registration_Number: data.companyRegistrationNumber,
      CKD_Company_Registration_Documents: registrationDocUrl,
      CKD_Company_Tax_Documents: taxDocUrl,
      CKD_Submitted_By: session?.user?.email || "",
      CKD_Audit_Trail: [{ action: "submitted", timestamp: new Date().toISOString() }],
    }

    // Add conditional fields based on institution type
    if (data.institutionType === "College") {
      submissionData.CKD_College_Name = data.collegeName
      submissionData.CKD_College_Name_Other = ""
      submissionData.CKD_Affiliated_University = data.affiliatedUniversity
      submissionData.CKD_Affiliated_University_Other = ""
      submissionData.CKD_University_Name = ""
      submissionData.CKD_University_Name_Other = ""
      submissionData.CKD_University_Type = ""
    } else {
      submissionData.CKD_College_Name = ""
      submissionData.CKD_College_Name_Other = ""
      submissionData.CKD_Affiliated_University = ""
      submissionData.CKD_Affiliated_University_Other = ""
      submissionData.CKD_University_Name = data.universityName
      submissionData.CKD_University_Name_Other = ""
      submissionData.CKD_University_Type = data.universityType
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
    <Card className="container mx-auto max-w-lg mt-4 mb-4 sm:mt-4 sm:mb-4 shadow-none border-transparent sm:border-gray-300 sm:shadow-lg">
      <CardContent className="space-y-6 mt-4 mb-4 sm:mt-4 sm:mb-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Institution Type Radio Buttons */}
          <div className="space-y-2 mb-4">
            <Label className="text-primary font-medium">
              Institution Type <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="institutionType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value)
                    // Reset the fields for the other institution type
                    if (value === "College") {
                      setValue("universityName", "")
                      setValue("universityType", "")
                    } else {
                      setValue("collegeName", "")
                      setValue("affiliatedUniversity", "")
                    }

                    // Re-fetch data if AISHE code is already entered
                    const aisheCode = getValues("aisheCode")
                    if (aisheCode) {
                      fetchInstitutionDetails(aisheCode)
                    }
                  }}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="College" id="college" />
                    <Label htmlFor="college">College</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="University" id="university" />
                    <Label htmlFor="university">University</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.institutionType && <p className="text-destructive text-sm">{errors.institutionType.message}</p>}
          </div>

          {/* Common Fields */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="aisheCode" className="text-primary">
                AISHE Code <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="aisheCode"
                control={control}
                render={({ field }) => (
                  <Input
                    id="aisheCode"
                    placeholder="Enter AISHE Code"
                    {...field}
                    onBlur={(e) => {
                      field.onBlur()
                      fetchInstitutionDetails(e.target.value)
                    }}
                  />
                )}
              />
              {errors.aisheCode && <p className="text-destructive text-sm">{errors.aisheCode.message}</p>}
              {isLoading && <p className="text-primary text-sm">Loading institution details...</p>}
            </div>

            {/* College-specific fields */}
            {institutionType === "College" && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="collegeName" className="text-primary">
                    Name of College <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="collegeName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="collegeName"
                        placeholder="College name will auto-fill based on AISHE code"
                        {...field}
                      />
                    )}
                  />
                  {errors.collegeName && <p className="text-destructive text-sm">{errors.collegeName.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="affiliatedUniversity" className="text-primary">
                    Affiliated to University <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="affiliatedUniversity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="affiliatedUniversity"
                        placeholder="Affiliated university will auto-fill based on AISHE code"
                        {...field}
                      />
                    )}
                  />
                  {errors.affiliatedUniversity && (
                    <p className="text-destructive text-sm">{errors.affiliatedUniversity.message}</p>
                  )}
                </div>
              </>
            )}

            {/* University-specific fields */}
            {institutionType === "University" && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="universityName" className="text-primary">
                    University Name <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="universityName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="universityName"
                        placeholder="University name will auto-fill based on AISHE code"
                        {...field}
                      />
                    )}
                  />
                  {errors.universityName && <p className="text-destructive text-sm">{errors.universityName.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="universityType" className="text-primary">
                    University Type <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="universityType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="universityType"
                        placeholder="University type will auto-fill based on AISHE code"
                        {...field}
                      />
                    )}
                  />
                  {errors.universityType && <p className="text-destructive text-sm">{errors.universityType.message}</p>}
                </div>
              </>
            )}

            <div className="space-y-1">
              <Label htmlFor="companyRegistrationNumber" className="text-primary">
                Registration Number <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="companyRegistrationNumber"
                control={control}
                render={({ field }) => (
                  <Input id="companyRegistrationNumber" placeholder="Enter Company Registration Number" {...field} />
                )}
              />
              {errors.companyRegistrationNumber && (
                <p className="text-destructive text-sm">{errors.companyRegistrationNumber.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="taxId" className="text-primary">
                Tax ID/GST Number <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="taxId"
                control={control}
                render={({ field }) => <Input id="taxId" placeholder="Enter Tax/GST Number" {...field} />}
              />
              {errors.taxId && <p className="text-destructive text-sm">{errors.taxId.message}</p>}
            </div>
          </div>

          {/* Upload Registration Document */}
          <div className="space-y-1 mt-4">
            <Label htmlFor="registrationDoc" className="text-primary">
              Upload Your Registration Document <span className="text-destructive">*</span>
            </Label>
            <p className="text-gray-400 text-xs mt-1">
              Please ensure both front and back sides of the documents are uploaded
            </p>
            <Controller
              name="registrationDoc"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center"
                  onClick={() => document.getElementById("registrationDoc").click()}
                >
                  <Image
                    src="/image/info/upload.svg"
                    alt="Upload Icon"
                    width={32}
                    height={32}
                    className="mx-auto mb-2 w-8 h-8"
                  />
                  <p className="text-gray-400 text-xs mt-1 font-semibold">Institute Registration Documents</p>
                  <p className="text-gray-600">
                    <span className="text-primary">Click to upload</span> to upload your file or drag and drop
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Supported format : PDF,JPG,PNG (2mb)</p>
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

          {/* Upload Tax/GST Document */}
          <div className="space-y-1 mt-4">
            <Label htmlFor="taxDoc" className="text-primary">
              Upload Your Tax/GST Documents <span className="text-destructive">*</span>
            </Label>
            <p className="text-gray-400 text-xs mt-1">
              Please ensure both front and back sides of the documents are uploaded
            </p>
            <Controller
              name="taxDoc"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center"
                  onClick={() => document.getElementById("taxDoc").click()}
                >
                  <Image
                    src="/image/info/upload.svg"
                    alt="Upload Icon"
                    width={32}
                    height={32}
                    className="mx-auto mb-2 w-8 h-8"
                  />
                  <p className="text-gray-400 text-xs mt-1 font-semibold">Tax/GST Documents</p>
                  <p className="text-gray-600">
                    <span className="text-primary">Click to upload</span> to upload your file or drag and drop
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Supported format : PDF,JPG,PNG (2mb)</p>
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
            className="mt-6 w-full"
            disabled={isSubmitting || uploadingRegistration || uploadingTax || !registrationDocUrl || !taxDocUrl}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

