"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {AdminAddressSchema} from "@/app/validation/adminSchema"
import React from "react"

// const addressSchema = z.object({
//   addressLine1: z.string().min(1, "Address line 1 is required"),
//   addressLine2: z.string().optional(),
//   landmark: z.string().optional(),
//   country: z.string().min(1, "Country is required"),
//   pincode: z.string().min(1, "Pincode is required"),
//   state: z.string().min(1, "State is required"),
//   city: z.string().min(1, "City is required"),
// })

export default function AddressDetails({ initialData, onSubmit, onBack, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(AdminAddressSchema),
    defaultValues: {
      addressLine1: initialData?.addressLine1 || "",
      addressLine2: initialData?.addressLine2 || "",
      landmark: initialData?.landmark || "",
      country: initialData?.country || "India",
      pincode: initialData?.pincode || "",
      state: initialData?.state || "",
      city: initialData?.city || "",
    },
  })

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]);


  const handleSubmit = (data) => {
    onSubmit(data)
  }

  // Function to fetch address details from pincode
  const fetchAddressDetails = async (pincode) => {
    try {
      const response = await fetch(`/api/global/v1/gblArET90003FtchPinCdDtls?pincode=${pincode}`)
      const data = await response.json()

      if (data?.data?.state && data?.data?.city) {
        form.setValue("state", data?.data?.state, {
          shouldValidate: true,
        })
        form.setValue("city", data?.data?.city, {
          shouldValidate: true,
        })
      } else {
        throw new Error("Invalid pincode")
      }
    } catch (err) {
      console.error("Error fetching address details:", err)
      // Keep existing values if there's an error
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 p-2 sm:p-4 max-w-xl mx-auto">
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
              <FormLabel className="text-primary font-medium">
                Pincode <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="6-digit Pincode"
                  maxLength={6}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    // Auto-fill state and city when pincode has 6 digits
                    if (e.target.value.length === 6) {
                      fetchAddressDetails(e.target.value);
                    }
                  }}
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
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
              <FormLabel className="text-primary font-medium">
                State <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="State (Auto-filled from pincode, editable)"
                  {...field}
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
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
              <FormLabel className="text-primary font-medium">
                City <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="City (Auto-filled from pincode, editable)"
                  {...field}
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
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
              <FormLabel className="text-primary font-medium">
                Address Line 1 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your address"
                  {...field}
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                />
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
              <FormLabel className="text-primary font-medium">
                Address Line 2 <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter additional address details"
                  {...field}
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                />
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
              <FormLabel className="text-primary font-medium">
                Landmark <span className="text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g near metro station or nagar"
                  {...field}
                  className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center justify-center gap-1 border-primary text-primary">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Button
            type="submit"
            className="flex items-center justify-center gap-1 bg-primary text-white"
            disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Next'}
            {!isSubmitting && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}

