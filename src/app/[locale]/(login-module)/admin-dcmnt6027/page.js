'use client';
import { DocumentSchema } from '@/app/validation/documentSchema';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from '@/i18n/routing';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CompleteProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [documentOptions, setDocumentOptions] = useState([]);
  const { toast } = useToast();
  const { data: session } = useSession();
  // console.log(session)
  const router = useRouter();

  // Initialize form with Zod validation
  const form = useForm({
    resolver: zodResolver(DocumentSchema),
    defaultValues: {
      domicile: 'IN',
      documentType: '',
      documentNumber: '',
      uploadPhoto: null,
    },
  });

  const selectedDomicile = form.watch('domicile');
  const selectedDocumentType = form.watch('documentType');

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await fetch(
          '/api/global/v1/gblArET90004FtchDcmntDtls'
        );
        if (!response.ok) throw new Error('Failed to fetch document details');
        const data = await response.json();
        setCountryOptions(data.countryDetails);
        setDocumentOptions(data.documentDetails);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load document options',
          variant: 'destructive',
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
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('IDD_Individual_Id', session?.user?.individualId);
      formData.append('IDD_Document1_Domicile', data.domicile);
      formData.append('IDD_Document1_Type', data.documentType);
      formData.append('IDD_Document1_Unq_Identifier', data.documentNumber);

      if (data.uploadPhoto) {
        formData.append('IDD_Document_File', data.uploadPhoto);
      }

      const response = await fetch(
        '/api/institution/v1/hcjBrBT60271AdminDocument',
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || 'Failed to submit form');

      toast({
        title: 'Success',
        description: result.message || 'Document uploaded successfully!',
      });

      router.push('/set-edu-dtls');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 transition-colors">
      <Card className="mx-auto max-w-2xl p-6 md:p-8 bg-card text-card-foreground dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-foreground mb-8">
          Complete Your Profile
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Country Selection */}
            <FormField
              control={form.control}
              name="domicile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">
                    Country <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
            <FormField
              control={form.control}
              name="uploadPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">
                    Upload Your Document{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <div
                    onClick={() =>
                      document.getElementById('uploadPhoto')?.click()
                    }
                    className="border-2 border-dashed border-input rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                    <Image
                      src="/image/info/upload.svg"
                      alt="Upload Icon"
                      width={32}
                      height={32}
                      className="mx-auto mb-2 w-8 h-8"
                    />
                    <p className="text-sm">
                      Click to upload or drag & drop (PDF, JPG, PNG - Max 2MB)
                    </p>
                  </div>
                  <input
                    id="uploadPhoto"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      form.setValue('uploadPhoto', file);
                    }}
                  />
                  <FormMessage />
                  {field.value && (
                    <p className="text-sm text-primary mt-2">
                      Selected: {field.value.name}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="animate-spin" />
              )}
              {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
