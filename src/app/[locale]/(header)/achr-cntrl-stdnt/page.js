"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Loader2,
  User,
  CalendarIcon,
  Award,
  School,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isFuture } from "date-fns";
import Image from "next/image";

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
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({
    HCJ_AC_Achievers_Photo: null,
    HCJ_AC_Achievers_Award_Img: null,
  });
  const { toast } = useToast();
  const fileInputRefs = {
    HCJ_AC_Achievers_Photo: useRef(null),
    HCJ_AC_Achievers_Award_Img: useRef(null),
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();

    // Name validation
    if (!formData.HCJ_AC_Achievers_Name.trim()) {
      newErrors.HCJ_AC_Achievers_Name = "Achiever's name is required";
    }

    // College validation
    if (!formData.HCJ_AC_College_Name.trim()) {
      newErrors.HCJ_AC_College_Name = "College name is required";
    }

    // Event name validation
    if (!formData.HCJ_AC_Achievers_Event_Name.trim()) {
      newErrors.HCJ_AC_Achievers_Event_Name = "Event name is required";
    }

    // Event date validation
    if (!formData.HCJ_AC_Achievers_Event_Dt) {
      newErrors.HCJ_AC_Achievers_Event_Dt = "Event date is required";
    } else if (isFuture(new Date(formData.HCJ_AC_Achievers_Event_Dt))) {
      newErrors.HCJ_AC_Achievers_Event_Dt =
        "Event date cannot be in the future";
    }

    // Publish date validation
    if (!formData.HCJ_AC_Publish_Dt) {
      newErrors.HCJ_AC_Publish_Dt = "Publish date is required";
    } else if (isFuture(new Date(formData.HCJ_AC_Publish_Dt))) {
      newErrors.HCJ_AC_Publish_Dt = "Publish date cannot be in the future";
    }

    // News description validation
    if (!formData.HCJ_AC_News_Shrt_Description.trim()) {
      newErrors.HCJ_AC_News_Shrt_Description = "News description is required";
    } else if (formData.HCJ_AC_News_Shrt_Description.length > 500) {
      newErrors.HCJ_AC_News_Shrt_Description =
        "Description must be less than 500 characters";
    }

    // Event description validation
    if (!formData.HCJ_AC_Achievers_Event_Description.trim()) {
      newErrors.HCJ_AC_Achievers_Event_Description =
        "Event description is required";
    }

    // Award description validation
    if (!formData.HCJ_AC_Achievers_Award_Description.trim()) {
      newErrors.HCJ_AC_Achievers_Award_Description =
        "Award description is required";
    }

    // Detailed award description validation
    if (!formData.HCJ_AC_Achievers_Award_Detail_Description.trim()) {
      newErrors.HCJ_AC_Achievers_Award_Detail_Description =
        "Detailed award description is required";
    }

    // Image validations
    if (!formData.HCJ_AC_Achievers_Photo) {
      newErrors.HCJ_AC_Achievers_Photo = "Achiever's photo is required";
    }
    if (!formData.HCJ_AC_Achievers_Award_Img) {
      newErrors.HCJ_AC_Achievers_Award_Img = "Award image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match("image.*")) {
        setErrors((prev) => ({
          ...prev,
          [field]: "Please upload an image file",
        }));
        return;
      }

      // Validate file size (e.g., 5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [field]: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, [field]: file }));
      setErrors((prev) => ({ ...prev, [field]: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [field]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    setImagePreviews((prev) => ({ ...prev, [field]: null }));
    if (fileInputRefs[field]?.current) {
      fileInputRefs[field].current.value = "";
    }
    setErrors((prev) => ({ ...prev, [field]: "This field is required" }));
  };

  const triggerFileInput = (field) => {
    fileInputRefs[field]?.current?.click();
  };

  const handleDateSelect = (date, field) => {
    if (date && isFuture(date)) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Date cannot be in the future",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: date ? date.toISOString().split("T")[0] : "",
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value);
    });

    try {
      const response = await fetch("/api/hcj/v1/hcjBrBt60071AhieverCentral", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        toast({
          title: "Success 🎉",
          description: "Nomination submitted successfully!",
          variant: "default",
        });
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
        });
        setImagePreviews({
          HCJ_AC_Achievers_Photo: null,
          HCJ_AC_Achievers_Award_Img: null,
        });
        setErrors({});
      } else {
        const errorData = await response.json();
        toast({
          title: "Error ❌",
          description:
            errorData.message ||
            "Failed to submit nomination. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting nomination:", error);
      toast({
        title: "Error ❌",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <form
            id="nomination-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="HCJ_AC_Achievers_Name"
                  className="text-sm font-medium text-primary"
                >
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
                />
                {errors.HCJ_AC_Achievers_Name && (
                  <p className="text-sm text-red-500">
                    {errors.HCJ_AC_Achievers_Name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="HCJ_AC_College_Name"
                  className="text-sm font-medium text-primary"
                >
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
                />
                {errors.HCJ_AC_College_Name && (
                  <p className="text-sm text-red-500">
                    {errors.HCJ_AC_College_Name}
                  </p>
                )}
              </div>
            </div>

            {/* Event Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="HCJ_AC_Achievers_Event_Name"
                  className="text-sm font-medium text-primary"
                >
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
                />
                {errors.HCJ_AC_Achievers_Event_Name && (
                  <p className="text-sm text-red-500">
                    {errors.HCJ_AC_Achievers_Event_Name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="HCJ_AC_Achievers_Event_Dt"
                  className="text-sm font-medium text-primary"
                >
                  <CalendarIcon className="h-4 w-4 inline mr-2 text-primary" />
                  Event Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 dark:border-gray-600",
                        !formData.HCJ_AC_Achievers_Event_Dt &&
                          "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.HCJ_AC_Achievers_Event_Dt ? (
                        format(
                          new Date(formData.HCJ_AC_Achievers_Event_Dt),
                          "PPP"
                        )
                      ) : (
                        <span>Select event date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.HCJ_AC_Achievers_Event_Dt
                          ? new Date(formData.HCJ_AC_Achievers_Event_Dt)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleDateSelect(date, "HCJ_AC_Achievers_Event_Dt")
                      }
                      initialFocus
                      disabled={(date) => isFuture(date)}
                    />
                  </PopoverContent>
                </Popover>
                {errors.HCJ_AC_Achievers_Event_Dt && (
                  <p className="text-sm text-red-500">
                    {errors.HCJ_AC_Achievers_Event_Dt}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="HCJ_AC_News_Shrt_Description"
                  className="text-sm font-medium text-primary"
                >
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
                />
                {errors.HCJ_AC_News_Shrt_Description && (
                  <p className="text-sm text-red-500">
                    {errors.HCJ_AC_News_Shrt_Description}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="HCJ_AC_Achievers_Event_Description"
                  className="text-sm font-medium text-primary"
                >
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
                />
                {errors.HCJ_AC_Achievers_Event_Description && (
                  <p className="text-sm text-red-500">
                    {errors.HCJ_AC_Achievers_Event_Description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="HCJ_AC_Publish_Dt"
                  className="text-sm font-medium text-primary"
                >
                  <CalendarIcon className="h-4 w-4 inline mr-2 text-primary" />
                  Publish Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 dark:border-gray-600",
                        !formData.HCJ_AC_Publish_Dt && "text-muted-foreground"
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
                      selected={
                        formData.HCJ_AC_Publish_Dt
                          ? new Date(formData.HCJ_AC_Publish_Dt)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleDateSelect(date, "HCJ_AC_Publish_Dt")
                      }
                      initialFocus
                      disabled={(date) => isFuture(date)}
                    />
                  </PopoverContent>
                </Popover>
                {errors.HCJ_AC_Publish_Dt && (
                  <p className="text-sm text-red-500">
                    {errors.HCJ_AC_Publish_Dt}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="HCJ_AC_Achievers_Award_Description"
                  className="text-sm font-medium text-primary"
                >
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
                />
                {errors.HCJ_AC_Achievers_Award_Description && (
                  <p className="text-sm text-red-500">
                    {errors.HCJ_AC_Achievers_Award_Description}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="HCJ_AC_Achievers_Award_Detail_Description"
                className="text-sm font-medium text-primary"
              >
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
              />
              {errors.HCJ_AC_Achievers_Award_Detail_Description && (
                <p className="text-sm text-red-500">
                  {errors.HCJ_AC_Achievers_Award_Detail_Description}
                </p>
              )}
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
                        src={
                          imagePreviews.HCJ_AC_Achievers_Photo ||
                          "/placeholder.svg"
                        }
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload photo
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG or JPEG (max 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRefs.HCJ_AC_Achievers_Photo}
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, "HCJ_AC_Achievers_Photo")
                    }
                    className="hidden"
                  />
                  {errors.HCJ_AC_Achievers_Photo && (
                    <p className="text-sm text-red-500">
                      {errors.HCJ_AC_Achievers_Photo}
                    </p>
                  )}
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
                        src={
                          imagePreviews.HCJ_AC_Achievers_Award_Img ||
                          "/placeholder.svg"
                        }
                        alt="Award Preview"
                        className="w-full h-auto rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() =>
                          removeImage("HCJ_AC_Achievers_Award_Img")
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        triggerFileInput("HCJ_AC_Achievers_Award_Img")
                      }
                      className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload award image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG or JPEG (max 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRefs.HCJ_AC_Achievers_Award_Img}
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, "HCJ_AC_Achievers_Award_Img")
                    }
                    className="hidden"
                  />
                  {errors.HCJ_AC_Achievers_Award_Img && (
                    <p className="text-sm text-red-500">
                      {errors.HCJ_AC_Achievers_Award_Img}
                    </p>
                  )}
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
  );
}
