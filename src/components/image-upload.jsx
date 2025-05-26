"use client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Upload as DefaultUploadIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function ProfilePhotoUpload({
  onUploadSuccess,
  onUploadError,
  initialPhoto = null,
  maxFileSize = 2 * 1024 * 1024, // 2MB default
  acceptedFormats = ["image/jpeg", "image/png", "image/svg+xml"],
  className,
  disabled = false,
  userId,
  uploadEndpoint = "/api/upload/profile",
  onValidationError,
  onRemovePhoto,
  optional = true,
  imageTitle = "Upload Photo",
  imageDescription = "Upload a photo to proceed",
  uploadType = "profile",
  uploadIcon: UploadIcon = DefaultUploadIcon,
  uploadIconClassName = "",
  onUploadStateChange,
  showDefaultToasts = false,
}) {
  const [photo, setPhoto] = useState(initialPhoto);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isFileInvalid, setIsFileInvalid] = useState(false);
  const fileRef = useRef(null);
  const { toast } = useToast();
  const uploadImage = async (file) => {
    if (!file) return null;
    // Double-check validation
    if (file.size > maxFileSize) {
      setIsFileInvalid(true);
      const error = new Error(
        `File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`
      );
      onValidationError?.({ type: "size", message: error.message });
      throw error;
    }

    if (!acceptedFormats.includes(file.type)) {
      setIsFileInvalid(true);
      const error = new Error(
        `Invalid file type. Supported: ${acceptedFormats
          .join(", ")
          .replace("image/", "")}`
      );
      onValidationError?.({ type: "format", message: error.message });
      throw error;
    }

    setIsUploading(true);
    onUploadStateChange(true);
    try {
      const formData = new FormData();
      if (userId) formData.append("userId", userId);
      formData.append("docType", "profile");
      formData.append("type", "profile");
      formData.append("file", file);

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await response.json();
      setIsFileInvalid(false);
      onUploadSuccess(data.url);
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError?.(error);
      return null;
    } finally {
      setIsUploading(false);
      onUploadStateChange(false);
    }
  };

  const handleFileProcessing = async (file) => {
    // Reset states
    setIsFileInvalid(false);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPhoto(e.target?.result);
    reader.readAsDataURL(file);

    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setPhoto(imageUrl);
      }
    } catch (error) {
      setPhoto(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handlePhotoDrop = (e) => {
    e.preventDefault();
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileProcessing(file);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileProcessing(file);
  };
  const handleRemovePhoto = async (e) => {
    e.stopPropagation();
    setIsRemoving(true);
    try {
      // Call removal handler if provided
      if (onRemovePhoto) {
        await onRemovePhoto();
      } else {
        // Fallback behavior
        onUploadSuccess?.("");
      }

      // Clear local state
      setPhoto(null);
      if (fileRef.current) fileRef.current.value = "";

      if (showDefaultToasts) {
        toast({
          title: "Removed",
          description: "Profile photo removed",
        });
      }
    } catch (error) {
      // console.error("Removal error:", error);
      if (showDefaultToasts) {
        toast({
          title: "Removal failed",
          description: error.message || "Could not remove photo",
          variant: "destructive",
        });
      }
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className={cn("mt-6", className)}>
      <h3 className="text-sm font-medium text-primary">
        {imageTitle}{" "}
        {optional ? (
          <span className="text-gray-400">(Optional)</span>
        ) : (
          <span className="text-destructive">*</span>
        )}
      </h3>
      <p className="text-gray-400 text-xs mt-1">{imageDescription} </p>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center",
          "hover:border-primary/50 transition-colors cursor-pointer",
          (isUploading || disabled || isRemoving) &&
            "opacity-70 pointer-events-none",
          isFileInvalid && "border-red-500 bg-red-50 animate-pulse"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={handlePhotoDrop}
        onClick={() =>
          !isUploading && !disabled && !isRemoving && fileRef.current?.click()
        }>
        {isUploading || isRemoving ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              {isUploading ? "Uploading image..." : "Removing image..."}
            </p>
          </div>
        ) : photo ? (
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src={photo}
              alt="Profile photo"
              fill
              className="rounded-full object-cover"
              priority
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2"
              onClick={handleRemovePhoto}
              disabled={disabled}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <UploadIcon
              className={cn(
                "w-8 h-8 mx-auto mb-4",
                isFileInvalid ? "text-red-500" : "text-muted-foreground",
                uploadIconClassName
              )}
            />
            <div
              className={cn(
                "text-sm mb-1",
                isFileInvalid
                  ? "text-red-600 font-medium"
                  : "text-muted-foreground"
              )}>
              {isFileInvalid ? (
                "File too large! Click to try again"
              ) : (
                <>
                  <span className="text-primary">Click here</span>
                  {` to upload your ${uploadType} or drag and drop`}
                </>
              )}
            </div>
            <div
              className={cn(
                "text-xs",
                isFileInvalid ? "text-red-500" : "text-muted-foreground"
              )}>
              Supported format:{" "}
              {acceptedFormats.join(", ").replace("image/", "")} (Max{" "}
              {maxFileSize / (1024 * 1024)}MB)
            </div>
            {isFileInvalid && (
              <div className="text-red-500 text-xs mt-2 font-medium">
                ❌ Please select a smaller file (under{" "}
                {maxFileSize / (1024 * 1024)}MB)
              </div>
            )}
          </>
        )}
        <Input
          ref={fileRef}
          type="file"
          accept={acceptedFormats.join(",")}
          className="hidden"
          onChange={handlePhotoChange}
          disabled={isUploading || disabled || isRemoving}
        />
      </div>
    </div>
  );
}
