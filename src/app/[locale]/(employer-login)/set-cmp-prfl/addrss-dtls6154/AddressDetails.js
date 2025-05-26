'use client';

import { Button } from '@/components/ui/button';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  pincode: z.string().min(6, 'Pincode is required'),
});

export default function AddressDetailsTab({ onNext, onBack, initialData }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressLine1: initialData?.addressLine1 || '',
      addressLine2: initialData?.addressLine2 || '',
      landmark: initialData?.landmark || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      country: initialData?.country || 'India',
      pincode: initialData?.pincode || '',
    },
  });

  const handleSubmit = (data) => {
    onNext(data); // call the correct prop
  };
  

  // Function to fetch address details from pincode
  const fetchAddressDetails = async (pincode) => {
    try {
      const response = await fetch(
        `/api/global/v1/gblArET90003FtchPinCdDtls?pincode=${pincode}`
      );
      const data = await response.json();

      if (data?.data?.state && data?.data?.city) {
        form.setValue('state', data?.data?.state, {
          shouldValidate: true,
        });
        form.setValue('city', data?.data?.city, {
          shouldValidate: true,
        });
      } else {
        throw new Error('Invalid pincode');
      }
    } catch (err) {
      console.error('Error fetching address details:', err);
      // Keep existing values if there's an error
    }
  };

  // Handle pincode change and auto-fill state and city
  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    if (pincode.length === 6) {
      fetchAddressDetails(pincode);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-2 sm:p-4 max-w-xl mx-auto">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-medium">
                Country <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Pincode <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Pincode"
                  maxLength={6}
                  onChange={(e) => {
                    field.onChange(e);
                    handlePincodeChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                State <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="State (Auto-filled from pincode, editable)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                City <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="City (Auto-filled from pincode, editable)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Address Line 1 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Address Line 1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Address Line 2 <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Address Line 2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="landmark"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Landmark <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Landmark" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" onClick={onBack} className="w-full sm:w-auto">
            Back
          </Button>
          <Button type="submit" className="w-full sm:w-auto bg-primary">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
