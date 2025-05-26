"use client";
import { validationSchemas } from "@/app/validation/documentSchema";
import { ProfilePhotoUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = (t) =>
  z
    .object({
      domicile: z.string().nonempty(t("6046_1")),
      documentType: z.string().nonempty(t("6046_2")),
      documentNumber: z.string().nonempty(t("6046_3")),
      uploadPhoto: z.string().url(t("6046_5")).optional(),
    })
    .superRefine((data, ctx) => {
      const { documentType, documentNumber } = data;
      const schemas = validationSchemas(t);
      const schema = schemas[documentType];

      if (schema) {
        const result = schema.safeParse(documentNumber);
        if (!result.success) {
          ctx.addIssue({
            path: ["documentNumber"],
            message: result.error.errors[0].message,
          });
        }
      } else {
        ctx.addIssue({
          path: ["documentType"],
          message: t("invalid_document_type"),
        });
      }
    });

export default function CompleteProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [documentOptions, setDocumentOptions] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const tForm = useTranslations("formErrors");
  const tError = useTranslations("errorCode");

  const form = useForm({
    resolver: zodResolver(formSchema(tForm)),
    mode: "onChange", // Enables validation on change
    defaultValues: {
      domicile: "IN",
      documentType: "",
      documentNumber: "",
    },
  });

  const selectedDomicile = form.watch("domicile");
  console.log("Selected uploadPhoto:", form.getValues("uploadPhoto"));
  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await fetch(
          "/api/global/v1/gblArET90004FtchDcmntDtls"
        );
        if (!response.ok) throw new Error("Failed to fetch document details");
        const data = await response.json();
        setCountryOptions(data.data.countryDetails);
        setDocumentOptions(data.data.documentDetails);
        console.log("Document Options:", data.documentDetails);
      } catch (error) {
        toast({
          title: error?.title || "Error",
          description: error?.message || "Failed to load document options",
          variant: "destructive",
        });
      }
    };

    fetchDocumentDetails();
  }, [toast]);

  const filteredDocuments = documentOptions.filter(
    (doc) => doc.relatedCountryCode === selectedDomicile
  );

  // Function to upload image immediately when selected
  const uploadImage = async (file) => {
    if (!file || !session?.user?.individualId) return;

    setIsUploading(true);
    try {
      const docType = form.getValues("documentType") || "document";

      const imageFormData = new FormData();
      imageFormData.append("userId", session.user.individualId);
      imageFormData.append("docType", docType);
      imageFormData.append("file", file);

      const response = await fetch(
        "/api/institution/v1/hcjBrBT60272AdminDocumentImage",
        {
          method: "POST",
          body: imageFormData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const result = await response.json();

      if (result.success && result.url) {
        setUploadedImageUrl(result.url);
        toast({
          title: result?.title || "Success",
          description: result?.message || "Document uploaded successfully!",
        });
        return result.url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      toast({
        title: error?.title || "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadSuccess = (url) => {
    // setProfileImageUrl(url);
    form.setValue("uploadPhoto", url);
    setUploadedImageUrl(url);
    // console.log("Uploaded URL:", url);
    toast({
      title: tError("6046_6.title"),
      description: tError("6046_6.description"),
      variant: "default",
    });
  };

  const handleRemovePhoto = () => {
    form.setValue("uploadPhoto", "");
    toast({
      title: tError("6046_7.title"),
      description: tError("6046_7.description"),
      variant: "default",
    });
  };

  const handleUploadError = (error) => {
    toast({
      title: error.title || "Upload failed",
      description: error.message || "Please try again with a different image",
      variant: "destructive",
    });
  };

  const handleValidationError = (error) => {
    toast({
      title: error.title || "Invalid file",
      description: error.message,
      variant: "destructive",
    });
  };

  async function onSubmit(data) {
    if (!session?.user?.id) {
      toast({
        title: tError("6046_8.title"),
        description: tError("6046_8.description"),
        variant: "destructive",
      });
      return;
    }

    if (!uploadedImageUrl) {
      toast({
        title: tError("6046_9.title"),
        description: tError("6046_9.description"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Submit document details with the already uploaded image URL
      const documentData = {
        IDD_Individual_Id: session.user.individualId,
        IDD_Document1_Domicile: data.domicile,
        IDD_Document1_Type: data.documentType,
        IDD_Document1_Unq_Identifier: data.documentNumber,
        IDD_Individual1_Document: uploadedImageUrl,
      };

      const response = await fetch(
        "/api/student/v1/hcjBrBt60451StudentDocumentCreate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(documentData),
        }
      );

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Failed to submit form");

      toast({
        title: result.title || "Success",
        description:
          result.message || "Document details submitted successfully",
      });
      router.push("/vrfctn-pndng6032");
    } catch (error) {
      toast({
        title: error.title || "Error",
        description: error.message || "Failed to submit document details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  // console.log(isLoading, isUploading, !uploadedImageUrl);
  return (
    <div className="min-h-screen bg-background p-4 transition-colors">
      <Card className="mx-auto max-w-2xl p-6 md:p-8 bg-card text-card-foreground dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Upload Your Documents
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-primary hover:text-primary/90 transition-colors">
              Skip for now {">"}
            </Link>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="domicile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">
                    Document Domicile{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryOptions.map((option) => (
                        <SelectItem key={option.iso2} value={option.iso2}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">
                    Document Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Document Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredDocuments[0]?.document?.map((doc) => (
                        <SelectItem key={doc.value} value={doc.value}>
                          {doc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">
                    Document Number <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uploadPhoto"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <ProfilePhotoUpload
                    onUploadSuccess={handleUploadSuccess}
                    onRemovePhoto={handleRemovePhoto}
                    onUploadError={handleUploadError}
                    onValidationError={handleValidationError}
                    imageTitle={"Upload Your Document"}
                    uploadType="document"
                    userId={session?.user?.id}
                    uploadEndpoint="/api/institution/v1/hcjBrBT60272AdminDocumentImage"
                    initialPhoto={form.getValues("uploadPhoto")}
                    uploadIcon={FileText}
                    onUploadStateChange={setIsUploading}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*
                  <FormLabel className="text-primary">
                    Upload Your Document{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <div
                    onClick={() => {
                      if (!isUploading) {
                        document.getElementById("uploadPhoto")?.click();
                      }
                    }}
                    className={`border-2 border-dashed border-input rounded-lg p-8 text-center ${
                      isUploading
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer hover:border-primary"
                    } transition-colors`}>
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <p className="text-sm">Uploading document...</p>
                      </div>
                    ) : uploadedImageUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="bg-green-100 text-green-700 rounded-full p-2 mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-green-700">
                          Document uploaded successfully
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Click to replace
                        </p>
                      </div>
                    ) : (
                      <>
                        <Image
                          src="/image/info/upload.svg"
                          alt="Upload Icon"
                          width={32}
                          height={32}
                          className="mx-auto mb-2 w-8 h-8"
                        />
                        <p className="text-sm text-muted-foreground mb-1">
                          PAN/Adhar/Voter ID
                        </p>
                        <p className="text-sm">
                          <span className="text-primary">Click here</span> to
                          upload your file or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supported format: PDF, JPG, PNG (2MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    id="uploadPhoto"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                        await uploadImage(file);
                      }
                    }}
                    className="hidden"
                    disabled={isUploading}
                    {...field}
                  />
*/}
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                isUploading ||
                !uploadedImageUrl ||
                form.formState.isValid
              }>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : isUploading ? (
                "Uploading..."
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
