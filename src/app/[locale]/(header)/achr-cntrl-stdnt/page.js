"use client"

import { useState, useRef } from "react"
import { Upload, Loader2, User, CalendarIcon, Award, School, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Image from "next/image"

export default function AchieverNomination() {
  const [formData, setFormData] = useState({
    HCJ_AC_News_Shrt_Description: "",
    HCJ_AC_Publish_Dt: "",
    HCJ_AC_Achievers_Event_Dt: "",
    HCJ_AC_Achievers_Name: "",
    HCJ_AC_Achievers_Event_Name: "",
    HCJ_AC_Achievers_Event_Description: "",
    HCJ_AC_Achievers_Award_Description: "",
    HCJ_AC_College_Num: "",
    HCJ_AC_College_Name: "",
    HCJ_AC_Achievers_Award_Detail_Description: "",
    HCJ_AC_Achievers_Photo: null,
    HCJ_AC_Achievers_Award_Img: null,
  })

  const [loading, setLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState({
    HCJ_AC_Achievers_Photo: null,
    HCJ_AC_Achievers_Award_Img: null,
  })
  const { toast } = useToast()
  const fileInputRefs = {
    HCJ_AC_Achievers_Photo: useRef(null),
    HCJ_AC_Achievers_Award_Img: useRef(null),
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e, field) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [field]: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }))
    setImagePreviews((prev) => ({ ...prev, [field]: null }))
    if (fileInputRefs[field]?.current) {
      fileInputRefs[field].current.value = ""
    }
  }

  const triggerFileInput = (field) => {
    fileInputRefs[field]?.current?.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value)
    })

    try {
      const response = await fetch("/api/hcj/v1/hcjBrBt60071AhieverCentral", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        toast({
          title: "Success 🎉",
          description: "Nomination submitted successfully!",
          variant: "default",
        })
        // Reset form
        setFormData({
          HCJ_AC_News_Shrt_Description: "",
          HCJ_AC_Publish_Dt: "",
          HCJ_AC_Achievers_Event_Dt: "",
          HCJ_AC_Achievers_Name: "",
          HCJ_AC_Achievers_Event_Name: "",
          HCJ_AC_Achievers_Event_Description: "",
          HCJ_AC_Achievers_Award_Description: "",
          HCJ_AC_College_Num: "",
          HCJ_AC_College_Name: "",
          HCJ_AC_Achievers_Award_Detail_Description: "",
          HCJ_AC_Achievers_Photo: null,
          HCJ_AC_Achievers_Award_Img: null,
        })
        setImagePreviews({
          HCJ_AC_Achievers_Photo: null,
          HCJ_AC_Achievers_Award_Img: null,
        })
      } else {
        toast({
          title: "Error ❌",
          description: "Failed to submit nomination. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting nomination:", error)
      toast({
        title: "Error ❌",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4 py-10">
      <Card className="w-full max-w-[800px] shadow-xl border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4 space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-foreground">
              Achiever Nomination
            </CardTitle>
            <Award className="h-8 w-8 text-primary" />
          </div>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Recognize and celebrate outstanding achievements in your community
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="nomination-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="HCJ_AC_Achievers_Name" className="text-sm font-medium text-primary">
                  <User className="h-4 w-4 inline mr-2 text-primary" />
                  Achiever&apos;s Name
                </Label>
                <Input
                  id="HCJ_AC_Achievers_Name"
                  name="HCJ_AC_Achievers_Name"
                  value={formData.HCJ_AC_Achievers_Name}
                  onChange={handleChange}
                  className="border-gray-300 dark:border-gray-600 focus:ring-primary"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="HCJ_AC_College_Name" className="text-sm font-medium text-primary">
                  <School className="h-4 w-4 inline mr-2 text-primary" />
                  College Name
                </Label>
                <Input
                  id="HCJ_AC_College_Name"
                  name="HCJ_AC_College_Name"
                  value={formData.HCJ_AC_College_Name}
                  onChange={handleChange}
                  className="border-gray-300 dark:border-gray-600 focus:ring-primary"
                  placeholder="Enter college name"
                  required
                />
              </div>
            </div>

            {/* Event Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="HCJ_AC_Achievers_Event_Name" className="text-sm font-medium text-primary">
                  <Award className="h-4 w-4 inline mr-2 text-primary" />
                  Event Name
                </Label>
                <Input
                  id="HCJ_AC_Achievers_Event_Name"
                  name="HCJ_AC_Achievers_Event_Name"
                  value={formData.HCJ_AC_Achievers_Event_Name}
                  onChange={handleChange}
                  className="border-gray-300 dark:border-gray-600 focus:ring-primary"
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="HCJ_AC_Achievers_Event_Dt" className="text-sm font-medium text-primary">
                  <CalendarIcon className="h-4 w-4 inline mr-2 text-primary" />
                  Event Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 dark:border-gray-600",
                        !formData.HCJ_AC_Achievers_Event_Dt && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.HCJ_AC_Achievers_Event_Dt ? (
                        format(new Date(formData.HCJ_AC_Achievers_Event_Dt), "PPP")
                      ) : (
                        <span>Select event date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.HCJ_AC_Achievers_Event_Dt ? new Date(formData.HCJ_AC_Achievers_Event_Dt) : undefined
                      }
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          HCJ_AC_Achievers_Event_Dt: date ? date.toISOString().split("T")[0] : "",
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="HCJ_AC_News_Shrt_Description" className="text-sm font-medium text-primary">
                  <FileText className="h-4 w-4 inline mr-2 text-primary" />
                  Short News Description
                </Label>
                <Textarea
                  id="HCJ_AC_News_Shrt_Description"
                  name="HCJ_AC_News_Shrt_Description"
                  value={formData.HCJ_AC_News_Shrt_Description}
                  onChange={handleChange}
                  className="border-gray-300 dark:border-gray-600 focus:ring-primary min-h-[100px]"
                  placeholder="Provide a brief description of the achievement"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="HCJ_AC_Achievers_Event_Description" className="text-sm font-medium text-primary">
                  <FileText className="h-4 w-4 inline mr-2 text-primary" />
                  Event Description
                </Label>
                <Textarea
                  id="HCJ_AC_Achievers_Event_Description"
                  name="HCJ_AC_Achievers_Event_Description"
                  value={formData.HCJ_AC_Achievers_Event_Description}
                  onChange={handleChange}
                  className="border-gray-300 dark:border-gray-600 focus:ring-primary min-h-[100px]"
                  placeholder="Describe the event in detail"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="HCJ_AC_Publish_Dt" className="text-sm font-medium text-primary">
                  <CalendarIcon className="h-4 w-4 inline mr-2 text-primary" />
                  Publish Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 dark:border-gray-600",
                        !formData.HCJ_AC_Publish_Dt && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.HCJ_AC_Publish_Dt ? (
                        format(new Date(formData.HCJ_AC_Publish_Dt), "PPP")
                      ) : (
                        <span>Select publish date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.HCJ_AC_Publish_Dt ? new Date(formData.HCJ_AC_Publish_Dt) : undefined}
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          HCJ_AC_Publish_Dt: date ? date.toISOString().split("T")[0] : "",
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="HCJ_AC_Achievers_Award_Description" className="text-sm font-medium text-primary">
                  <Award className="h-4 w-4 inline mr-2 text-primary" />
                  Award Description
                </Label>
                <Textarea
                  id="HCJ_AC_Achievers_Award_Description"
                  name="HCJ_AC_Achievers_Award_Description"
                  value={formData.HCJ_AC_Achievers_Award_Description}
                  onChange={handleChange}
                  className="border-gray-300 dark:border-gray-600 focus:ring-primary min-h-[100px]"
                  placeholder="Describe the award received"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="HCJ_AC_Achievers_Award_Detail_Description" className="text-sm font-medium text-primary">
                <FileText className="h-4 w-4 inline mr-2 text-primary" />
                Detailed Award Description
              </Label>
              <Textarea
                id="HCJ_AC_Achievers_Award_Detail_Description"
                name="HCJ_AC_Achievers_Award_Detail_Description"
                value={formData.HCJ_AC_Achievers_Award_Detail_Description}
                onChange={handleChange}
                className="border-gray-300 dark:border-gray-600 focus:ring-primary min-h-[120px]"
                placeholder="Provide detailed information about the award and its significance"
                required
              />
            </div>

            {/* Image Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Achiever's Photo Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-primary">
                  <User className="h-4 w-4 inline mr-2 text-primary" />
                  Achiever&apos;s Photo
                </Label>
                <div className="flex flex-col items-center">
                  {imagePreviews.HCJ_AC_Achievers_Photo ? (
                    <div className="relative w-full">
                      <Image
                        src={imagePreviews.HCJ_AC_Achievers_Photo || "/placeholder.svg"}
                        alt="Achiever Preview"
                        height="100"
                        width="100"
                        className="w-full h-auto rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => removeImage("HCJ_AC_Achievers_Photo")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => triggerFileInput("HCJ_AC_Achievers_Photo")}
                      className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload photo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG or JPEG</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRefs.HCJ_AC_Achievers_Photo}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "HCJ_AC_Achievers_Photo")}
                    className="hidden"
                    required={!formData.HCJ_AC_Achievers_Photo}
                  />
                </div>
              </div>

              {/* Award Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-primary">
                  <Award className="h-4 w-4 inline mr-2 text-primary" />
                  Award Image
                </Label>
                <div className="flex flex-col items-center">
                  {imagePreviews.HCJ_AC_Achievers_Award_Img ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreviews.HCJ_AC_Achievers_Award_Img || "/placeholder.svg"}
                        alt="Award Preview"
                        className="w-full h-auto rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => removeImage("HCJ_AC_Achievers_Award_Img")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => triggerFileInput("HCJ_AC_Achievers_Award_Img")}
                      className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload award image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG or JPEG</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRefs.HCJ_AC_Achievers_Award_Img}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "HCJ_AC_Achievers_Award_Img")}
                    className="hidden"
                    required={!formData.HCJ_AC_Achievers_Award_Img}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end pt-2">
          <Button
            type="submit"
            form="nomination-form"
            disabled={loading}
            className="flex items-center bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Nomination"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

