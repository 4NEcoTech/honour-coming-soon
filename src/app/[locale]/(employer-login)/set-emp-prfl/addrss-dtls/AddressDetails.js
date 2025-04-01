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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';

const countries = [{ label: 'India', value: 'india' }];
const states = [
  { label: 'Karnataka', value: 'karnataka' },
  { label: 'Maharashtra', value: 'maharashtra' },
  { label: 'Tamil Nadu', value: 'tamil-nadu' },
];
const cities = {
  karnataka: ['Bangalore', 'Mysore'],
  maharashtra: ['Mumbai', 'Pune'],
  'tamil-nadu': ['Chennai', 'Coimbatore'],
};

export default function AddressDetails({ initialData, isSubmitting, onSubmit, onBack }) {
  const form = useForm({
    defaultValues: {
      country: initialData?.country || "india",
      pincode: initialData?.pincode || "",
      state: initialData?.state || "",
      city: initialData?.city || "",
      addressLine1: initialData?.addressLine1 || "",
      addressLine2: initialData?.addressLine2 || "",
      landmark: initialData?.landmark || "",
    },
  });
  

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    if (pincode.length === 6) {
      if (pincode === '560001') {
        form.setValue('state', 'karnataka');
        form.setValue('city', 'Bangalore');
      } else if (pincode === '400001') {
        form.setValue('state', 'maharashtra');
        form.setValue('city', 'Mumbai');
      }
    }
  };
  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        className="space-y-4 p-4 max-w-lg mx-auto"
      >
        {/* Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-primary'>Country <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {countries.map((item, index) => (
                      <SelectItem value={item.value} key={index}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pincode */}
        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-primary'>Pincode <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="6-digit pincode"
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

        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-primary'>State <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((item, index) => (
                    <SelectItem value={item.value} key={index}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-primary'>City <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {form.watch('state') && cities[form.watch('state')]
                    ? cities[form.watch('state')].map((city, index) => (
                        <SelectItem value={city} key={index}>
                          {city}
                        </SelectItem>
                      ))
                    : (
                      <SelectItem value="none" disabled>
                        Select a state first
                      </SelectItem>
                    )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Line 1 */}
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-primary'>Address Line 1 <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">
            Back
          </Button>
          <Button type="submit" className="w-full sm:w-auto bg-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Next'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
