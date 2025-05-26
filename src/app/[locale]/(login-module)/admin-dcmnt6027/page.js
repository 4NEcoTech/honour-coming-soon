// "use client";
// import { DocumentSchema } from "@/app/validation/documentSchema";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "@/i18n/routing";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2 } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";

// export default function Page() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [countryOptions, setCountryOptions] = useState([]);
//   const [documentOptions, setDocumentOptions] = useState([]);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");
//   const { toast } = useToast();
//   const { data: session } = useSession();
//   // console.log(session);
//   const router = useRouter();

//   // Initialize form with Zod validation
//   const form = useForm({
//     resolver: zodResolver(DocumentSchema),
//     defaultValues: {
//       domicile: "IN",
//       documentType: "",
//       documentNumber: "",
//       uploadPhoto: null,
//     },
//   });

//   const selectedDomicile = form.watch("domicile");
//   const selectedDocumentType = form.watch("documentType");

//   useEffect(() => {
//     const fetchDocumentDetails = async () => {
//       try {
//         const response = await fetch(
//           "/api/global/v1/gblArET90004FtchDcmntDtls"
//         );
//         if (!response.ok) throw new Error("Failed to fetch document details");
//         const data = await response.json();
//         setCountryOptions(data.countryDetails);
//         setDocumentOptions(data.documentDetails);
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to load document options",
//           variant: "destructive",
//         });
//       }
//     };

//     fetchDocumentDetails();
//   }, [toast]);

//   const filteredDocuments = documentOptions.filter(
//     (doc) => doc.relatedCountryCode === selectedDomicile
//   );

//   // Function to upload image immediately when selected
//   const uploadImage = async (file) => {
//     if (!file || !session?.user?.individualId) return;

//     setIsUploading(true);
//     try {
//       const docType = form.getValues("documentType") || "document";

//       const imageFormData = new FormData();
//       imageFormData.append("userId", session.user.individualId);
//       imageFormData.append("docType", docType);
//       imageFormData.append("file", file);

//       const response = await fetch(
//         "/api/institution/v1/hcjBrBT60272AdminDocumentImage",
//         {
//           method: "POST",
//           body: imageFormData,
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to upload image");
//       }

//       const result = await response.json();

//       if (result.success && result.url) {
//         setUploadedImageUrl(result.url);
//         toast({
//           title: "Success",
//           description: "Document uploaded successfully!",
//         });
//         return result.url;
//       } else {
//         throw new Error("Image upload failed");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload image",
//         variant: "destructive",
//       });
//       return null;
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Function to submit document details
//   const submitDocumentDetails = async (documentData) => {
//     const response = await fetch(
//       "/api/institution/v1/hcjBrBT60271AdminDocument",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(documentData),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Failed to submit document details");
//     }

//     return await response.json();
//   };

//   async function onSubmit(data) {
//     if (!session?.user?.id) {
//       toast({
//         title: "Error",
//         description: "User not authenticated",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!uploadedImageUrl) {
//       toast({
//         title: "Error",
//         description: "Please upload a document image first",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Submit document details with the already uploaded image URL
//       const documentData = {
//         IDD_Individual_Id: session?.user?.individualId,
//         IDD_Document1_Domicile: data.domicile,
//         IDD_Document1_Type: data.documentType,
//         IDD_Document1_Unq_Identifier: data.documentNumber,
//         IDD_Individual1_Document: uploadedImageUrl,
//       };

//       const documentResult = await submitDocumentDetails(documentData);

//       if (!documentResult.success) {
//         throw new Error("Document submission failed");
//       }

//       toast({
//         title: "Success",
//         description:
//           documentResult.message || "Document details saved successfully!",
//       });

//       //  router.push("/set-edu-dtls")

//       const userRole = session?.user?.role;
//       if (
//         userRole === "07" ||
//         userRole === "08" ||
//         userRole === "10" ||
//         userRole === "11"
//       ) {
//         router.push("/vrfctn-pndng6032");
//       } else if (userRole === "09") {
//         router.push("/set-cmp-prfl");
//       } else {
//         router.push("/set-edu-dtls");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to save document details",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background p-4 transition-colors">
//       <Card className="mx-auto max-w-2xl p-6 md:p-8 bg-card text-card-foreground dark:border-gray-700">
//         <h1 className="text-2xl font-semibold text-foreground mb-8">
//           Upload Your Documents
//         </h1>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Country Selection */}
//             <FormField
//               control={form.control}
//               name="domicile"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-primary">
//                     Country <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Country" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {countryOptions.map((option) => (
//                         <SelectItem key={option.iso2} value={option.iso2}>
//                           {option.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Document Type */}
//             <FormField
//               control={form.control}
//               name="documentType"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-primary">
//                     Document Type <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Document Type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {filteredDocuments[0]?.document?.map((doc) => (
//                         <SelectItem key={doc.value} value={doc.value}>
//                           {doc.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Document Number */}
//             <FormField
//               control={form.control}
//               name="documentNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-primary">
//                     Document Number <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter document number" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* File Upload Field */}
//             <FormField
//               control={form.control}
//               name="uploadPhoto"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-primary">
//                     Upload Your Document{" "}
//                     <span className="text-destructive">*</span>
//                   </FormLabel>
//                   <div
//                     onClick={() => {
//                       if (!isUploading) {
//                         document.getElementById("uploadPhoto")?.click();
//                       }
//                     }}
//                     className={`border-2 border-dashed border-input rounded-lg p-8 text-center ${
//                       isUploading
//                         ? "cursor-not-allowed opacity-70"
//                         : "cursor-pointer hover:border-primary"
//                     } transition-colors`}>
//                     {isUploading ? (
//                       <div className="flex flex-col items-center">
//                         <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
//                         <p className="text-sm">Uploading document...</p>
//                       </div>
//                     ) : uploadedImageUrl ? (
//                       <div className="flex flex-col items-center">
//                         <div className="bg-green-100 text-green-700 rounded-full p-2 mb-2">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-6 w-6"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor">
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M5 13l4 4L19 7"
//                             />
//                           </svg>
//                         </div>
//                         <p className="text-sm text-green-700">
//                           Document uploaded successfully
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Click to replace
//                         </p>
//                       </div>
//                     ) : (
//                       <>
//                         <Image
//                           src="/image/info/upload.svg"
//                           alt="Upload Icon"
//                           width={32}
//                           height={32}
//                           className="mx-auto mb-2 w-8 h-8"
//                         />
//                         <p className="text-sm">
//                           Click to upload or drag & drop (PDF, JPG, PNG - Max
//                           2MB)
//                         </p>
//                       </>
//                     )}
//                   </div>
//                   <input
//                     id="uploadPhoto"
//                     type="file"
//                     accept=".jpg,.jpeg,.png,.pdf"
//                     className="hidden"
//                     onChange={async (e) => {
//                       const file = e.target.files?.[0];
//                       if (file) {
//                         form.setValue("uploadPhoto", file);
//                         await uploadImage(file);
//                       }
//                     }}
//                     disabled={isUploading}
//                   />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={isLoading || isUploading || !uploadedImageUrl}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Submitting...
//                 </>
//               ) : (
//                 "Submit"
//               )}
//             </Button>
//           </form>
//         </Form>
//       </Card>
//     </div>
//   );
// }

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
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const formSchema = (t) =>
  z
    .object({
      domicile: z.string().nonempty(t("6024_21")),
      documentType: z.string().nonempty(t("6024_22")),
      documentNumber: z.string().nonempty(t("6024_23")),
      uploadPhoto: z.string().url(t("6024_24")).optional(),
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

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [documentOptions, setDocumentOptions] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const tForm = useTranslations("formErrors");

  // Initialize form with Zod validation
  const form = useForm({
    resolver: zodResolver(formSchema(tForm)),
    mode: "onChange", // Enables validation on change
    defaultValues: {
      domicile: "India",
      documentType: "",
      documentNumber: "",
    },
  });

  const selectedDomicile = form.watch("domicile");

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
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load document options",
          variant: "destructive",
        });
      }
    };

    fetchDocumentDetails();
  }, [toast]);

  const filteredDocuments = documentOptions.filter(
    (doc) => doc.relatedCountry === selectedDomicile
  );

  // Function to upload image immediately when selected
  // const uploadImage = async (file) => {
  //   if (!file || !session?.user?.individualId) return;

  //   setIsUploading(true);
  //   try {
  //     const docType = form.getValues("documentType") || "document";

  //     const imageFormData = new FormData();
  //     imageFormData.append("userId", session.user.individualId);
  //     imageFormData.append("docType", docType);
  //     imageFormData.append("file", file);

  //     const response = await fetch(
  //       "/api/institution/v1/hcjBrBT60272AdminDocumentImage",
  //       {
  //         method: "POST",
  //         body: imageFormData,
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to upload image");
  //     }

  //     const result = await response.json();

  //     if (result.success && result.url) {
  //       setUploadedImageUrl(result.url);
  //       toast({
  //         title: "Success",
  //         description: "Document uploaded successfully!",
  //       });
  //       return result.url;
  //     } else {
  //       throw new Error("Image upload failed");
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to upload image",
  //       variant: "destructive",
  //     });
  //     return null;
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  // Function to submit document details
  const submitDocumentDetails = async (documentData) => {
    const response = await fetch(
      "/api/institution/v1/hcjBrBT60271AdminDocument",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit document details");
    }

    return await response.json();
  };

  // Tax Doc function for uploading the images  starts
  const handleTaxDocUploadSuccess = (url) => {
    // form.setValue("taxDoc", url);

    form.getValues("uploadPhoto", url);
    setUploadedImageUrl(url);
    toast({
      title: "Success!",
      description: tForm("6027_1"),
      variant: "default",
    });
  };

  const handleTaxDocRemove = () => {
    form.getValues("uploadPhoto", "");

    toast({
      title: "Removed",
      description: tForm("6027_3"),
      variant: "default",
    });
  };

  const handleTaxDocUploadError = (error) => {
    toast({
      title: " upload Document failed",
      description: tForm("6027_2", {
        message: error.message,
      }),
      variant: "destructive",
    });
  };

  const handleTaxDocValidationError = (error) => {
    toast({
      title: "Invalid Document file",
      description: tForm("6027_4", {
        message: error.message,
      }),
      variant: "destructive",
    });
  };
  // Tax Doc function for uploading the images  ends

  async function onSubmit(data) {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedImageUrl) {
      toast({
        title: "Error",
        description: "Please upload a document image first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Submit document details with the already uploaded image URL
      const documentData = {
        IDD_Individual_Id: session?.user?.individualId,
        IDD_Document1_Domicile: data.domicile,
        IDD_Document1_Type: data.documentType,
        IDD_Document1_Unq_Identifier: data.documentNumber,
        IDD_Individual1_Document: uploadedImageUrl,
      };

      const documentResult = await submitDocumentDetails(documentData);

      if (!documentResult.success) {
        throw new Error("Document submission failed");
      }

      toast({
        title: "Success",
        description:
          documentResult.message || "Document details saved successfully!",
      });

      const userRole = session?.user?.role;
      if (
        userRole === "07" ||
        userRole === "08" ||
        userRole === "10" ||
        userRole === "11"
      ) {
        router.push("/vrfctn-pndng6032");
      } else if (userRole === "09") {
        router.push("/set-cmp-prfl");
      } else {
        router.push("/set-edu-dtls");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save document details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 transition-colors">
      <Card className="mx-auto max-w-2xl p-6 md:p-8 bg-card text-card-foreground dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Upload Your Documents
          </h1>
          {/* <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-primary hover:text-primary/90 transition-colors">
              Skip for now {">"}
            </Link>
          </div> */}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Country Selection */}
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
                        <SelectItem key={option.iso2} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Type */}
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

            {/* Document Number */}
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

            {/* File Upload Field */}
            {/* <FormField
              control={form.control}
              name="uploadPhoto"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
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
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <ProfilePhotoUpload
              onUploadSuccess={handleTaxDocUploadSuccess}
              onRemovePhoto={handleTaxDocRemove}
              onUploadError={handleTaxDocUploadError}
              onValidationError={handleTaxDocValidationError}
              userId={session?.user?.id}
              imageTitle={"Upload Your Document"}
              imageDescription="Please ensure upload document to proceed"
              optional={false}
              uploadEndpoint="/api/institution/v1/hcjBrBT60272AdminDocumentImage"
              initialPhoto={form.getValues("uploadPhoto")}
              onUploadStateChange={setIsUploading}
              // uploadIcon={ShieldUser}
              uploadType={"Document"}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isUploading || !uploadedImageUrl}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
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
