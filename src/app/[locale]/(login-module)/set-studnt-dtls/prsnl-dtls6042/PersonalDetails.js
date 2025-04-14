"use client"
import { StudentProfileSchema } from "@/app/validation/studentSchema"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import React from "react"
import { useForm } from "react-hook-form"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function PersonalDetails({
  initialData,
  // isSubmitting,
  onSubmit,
}) {
  const [photo, setPhoto] = React.useState(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const fileRef = React.useRef(null)
  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(StudentProfileSchema),
    defaultValues: {
      utUserId: "",
      HCJ_ST_Student_First_Name: "",
      HCJ_ST_Student_Last_Name: "",
      HCJ_ST_Phone_Number: "",
      HCJ_ST_Educational_Email: "",
      HCJ_ST_Educational_Alternate_Email: "",
      HCJ_ST_Alternate_Phone_Number: "",
      HCJ_ST_Gender: "",
      HCJ_ST_DOB: "",
      ID_About: "",
      ID_Profile_Picture: initialData?.ID_Profile_Picture || "",
    },
  })

  // ✅ Mapping Function for Initial Data
  const mapToFormFields = (data) => ({
    // utUserId: data.id || '', // Maps `id` -> `utUserId`
    HCJ_ST_Student_First_Name: data.HCJ_ST_Student_First_Name || "",
    HCJ_ST_Student_Last_Name: data.HCJ_ST_Student_Last_Name || "",
    HCJ_ST_Phone_Number: data.HCJ_ST_Phone_Number || "",
    HCJ_ST_Educational_Email: data.HCJ_ST_Educational_Email || "",
    HCJ_ST_Educational_Alternate_Email: data.HCJ_ST_Educational_Alternate_Email || "",
    HCJ_ST_Alternate_Phone_Number: data.HCJ_ST_Alternate_Phone_Number || "",
    HCJ_ST_Gender: data.HCJ_ST_Gender?.toString() || "",
    HCJ_ST_DOB: data.HCJ_ST_DOB ? new Date(data.HCJ_ST_DOB) : "",
    ID_About: data.ID_About || "",
    ID_Profile_Picture: data.ID_Profile_Picture || "",
  })

  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const mappedData = mapToFormFields(initialData)
      if (initialData.ID_Profile_Picture) {
        setPhoto(initialData.ID_Profile_Picture)
      }
      form.reset(mappedData) // ✅ Reset with mapped data
    }
  }, [initialData, form])

  const uploadImage = async (file) => {
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("userId", session?.user?.id || "67ed18907bab422e2108de90")
      formData.append("type", "profile")
      formData.append("file", file)

      const response = await fetch("/api/student/v1/hcjBrBT60422StudentProfileImage", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        // Store the URL in the form
        form.setValue("ID_Profile_Picture", data.url)
        toast.success("Image uploaded successfully")
        return data.url
      } else {
        throw new Error(data.message || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image", {
        description: error.message || "Please try again",
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handlePhotoDrop = async (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      // Show preview immediately
      const reader = new FileReader()
      reader.onload = (e) => setPhoto(e.target?.result)
      reader.readAsDataURL(file)

      // Upload to server
      const imageUrl = await uploadImage(file)
      if (imageUrl) {
        setPhoto(imageUrl)
      }
    }
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Show preview immediately
      const reader = new FileReader()
      reader.onload = (e) => setPhoto(e.target?.result)
      reader.readAsDataURL(file)

      // Upload to server
      const imageUrl = await uploadImage(file)
      if (imageUrl) {
        setPhoto(imageUrl)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit("personal", data))} className="space-y-6">
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-4 text-primary">
            Upload Profile Photo <span className="text-gray-400">(Optional)</span>
          </h3>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center",
              "hover:border-primary/50 transition-colors cursor-pointer",
              isUploading && "opacity-70 pointer-events-none",
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handlePhotoDrop}
            onClick={() => !isUploading && fileRef.current?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Uploading image...</p>
              </div>
            ) : photo ? (
              <div className="relative w-32 h-32 mx-auto">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt="Profile photo"
                  fill
                  className="rounded-full object-cover"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPhoto(null)
                    form.setValue("ID_Profile_Picture", "")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <span className="text-primary">Click here</span> to upload your photo or drag and drop
                </div>
                <div className="text-xs text-muted-foreground mt-2">Supported format: PNG, JPG, SVG (2mb)</div>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={isUploading}
            />
          </div>
        </div>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="HCJ_ST_Student_First_Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">
                  First Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="HCJ_ST_Student_Last_Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">
                  Last Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="HCJ_ST_Educational_Email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">
                  Student Email Id <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="HCJ_ST_Educational_Alternate_Email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">
                  Alternate Email Id <span className="text-gray-400">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="HCJ_ST_Phone_Number"
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

          <FormField
            control={form.control}
            name="HCJ_ST_Alternate_Phone_Number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">
                  Alternate Phone Number <span className="text-gray-400">(Optional)</span>
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
          <FormField
            control={form.control}
            name="HCJ_ST_Gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">
                  Gender <span className="text-destructive font-medium">*</span>
                </FormLabel>
                <Select
                  defaultValue={field.value}
                  value={field.value || ""} // ✅ Ensure it's always a string
                  onValueChange={(value) => field.onChange(value)}
                >
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
            name="HCJ_ST_DOB"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">
                  Date Of Birth <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ID_About"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">
                  Profile Headline <span className="text-gray-400">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your profile headline" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isUploading}>
          Next
        </Button>
      </form>
    </Form>
  )
}

