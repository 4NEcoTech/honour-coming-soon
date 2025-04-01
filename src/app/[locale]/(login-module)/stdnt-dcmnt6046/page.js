"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react"; //  Added useSession hook
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";


const formSchema = z.object({
  domicile: z.string().nonempty("6046_1 Please select a country."),
  documentType: z.string().nonempty("6046_2 Please select a document type."),
  documentNumber: z.string().nonempty("6046_3 Document number is required."),
  uploadPhoto: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      "6046_5 Max file size is 2MB."
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
      "6046_6 Only JPG, PNG, and PDF are allowed"
    )
    .optional(),
});

export default function CompleteProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [documentOptions, setDocumentOptions] = useState([]);
  const { toast } = useToast();
  const { data: session } = useSession(); // ✅ Get session data
  const router = useRouter()

//  console.log(session)


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domicile: "",
      documentType: "",
      documentNumber: "",
    },
  });

  const selectedDomicile = form.watch("domicile");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await fetch(
          '/api/global/v1/gblArET90004FtchDcmntDtls'
        );
        if (!response.ok) throw new Error("Failed to fetch document details");
        const data = await response.json();
        setCountryOptions(data.countryDetails);
        setDocumentOptions(data.documentDetails);
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
    (doc) => doc.relatedCountryCode === selectedDomicile
  );

  async function onSubmit(data) {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      if (data.uploadPhoto) formData.append("IDD_Document_File", data.uploadPhoto);
      formData.append("IDD_Individual_Id", session.user.individualId);
      formData.append("IDD_Document1_Domicile", data.domicile);
      formData.append("IDD_Document1_Type", data.documentType);
      formData.append("IDD_Document1_Unq_Identifier", data.documentNumber);



      const response = await fetch("/api/student/v1/hcjBrBt60451StudentDocumentCreate", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Failed to submit form");

      toast({
        title: result.title || "Success",
        description:
          result.message || "Document details submitted successfully",
      });
      router.push('/vrfctn-pndng6032')
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit document details",
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
            Complete Your Profile
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-primary hover:text-primary/90 transition-colors"
            >
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
                    defaultValue={field.value}
                  >
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Document Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {filteredDocuments[0]?.document?.map((doc) => (
                        <SelectItem key={doc} value={doc.value}>
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
                  <FormLabel className="text-primary">
                    Upload Your Document{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <div
                    onClick={() =>
                      document.getElementById("uploadPhoto")?.click()
                    }
                    className="border-2 border-dashed border-input rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  >
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
                      <span className="text-primary">Click here</span> to upload
                      your file or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported format: PDF, JPG, PNG (2MB)
                    </p>
                  </div>
                  <input
                    id="uploadPhoto"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    }}
                    className="hidden"
                    {...field}
                  />
                  <FormMessage />
                  {value && (
                    <p className="text-sm text-primary mt-2">
                      File selected: {value.name}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
