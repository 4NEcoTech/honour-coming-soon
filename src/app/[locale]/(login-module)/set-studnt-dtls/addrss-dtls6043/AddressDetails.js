"use client";

import studentSchema from "@/app/validation/studentSchema";
import { Button } from "@/components/ui/button";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";

export default function AddressDetails({
  initialData,
  isSubmitting,
  onSubmit,
}) {
  const t = useTranslations("formErrors");
  const Schema = studentSchema(t);
  const form = useForm({
    resolver: zodResolver(
      Schema.pick({
        HCJ_ST_Student_Country: true,
        HCJ_ST_Student_City: true,
        HCJ_ST_Student_Pincode: true,
        HCJ_ST_Student_State: true,
        HCJ_ST_Address: true,
      })
    ),
    mode: "onChange",
    defaultValues: {
      HCJ_ST_Student_Country: "",
      HCJ_ST_Student_Pincode: "",
      HCJ_ST_Student_State: "",
      HCJ_ST_Student_City: "",
      HCJ_ST_Address: "",
    },
  });

  // ✅ Mapping Function for Initial Data
  const mapToFormFields = (data) => ({
    HCJ_ST_Student_Country: data.HCJ_ST_Student_Country || "",
    HCJ_ST_Student_Pincode: data.HCJ_ST_Student_Pincode || "",
    HCJ_ST_Student_State: data.HCJ_ST_Student_State || "",
    HCJ_ST_Student_City: data.HCJ_ST_Student_City || "",
    HCJ_ST_Address: data.HCJ_ST_Address || "",
  });

  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const mappedData = mapToFormFields(initialData);

      console.log("initialData", initialData);
      form.reset(mappedData); // ✅ Reset with mapped data
    }
  }, [initialData, form]);

  const fetchAddressDetails = async (HCJ_ST_Student_Pincode) => {
    try {
      const response = await fetch(
        `/api/global/v1/gblArET90003FtchPinCdDtls?pincode=${HCJ_ST_Student_Pincode}`
      );
      const data = await response.json();
      if (data?.data?.state && data?.data?.city) {
        form.setValue("HCJ_ST_Student_State", data?.data?.state, {
          shouldValidate: true,
        });
        form.setValue("HCJ_ST_Student_City", data?.data?.city, {
          shouldValidate: true,
        });
      } else {
        throw new Error("Invalid pincode");
      }
    } catch (err) {
      form.setValue("HCJ_ST_Student_State", "");
      form.setValue("HCJ_ST_Student_City", "");
      toast({
        title: err.title,
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    if (pincode.length === 6) {
      // Simulate pincode lookup

      fetchAddressDetails(e.target.value);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit("address", data))}
        className="space-y-6">
        <FormField
          control={form.control}
          name="HCJ_ST_Student_Country"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-primary">
                Country <span className="text-destructive">*</span>
              </FormLabel>
              <Select defaultValue={form.value}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Fruits</SelectLabel> */}
                    <SelectItem value="india">India</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="HCJ_ST_Student_Pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                {" "}
                Pincode <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="6-digits pincode"
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
          name="HCJ_ST_Student_State"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-primary">
                State <span className="text-destructive">*</span>
              </FormLabel>
              {Array.isArray(field.value) ? (
                // Show Dropdown when state is an array
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="relative ps-9">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.value.map((item, ind) => (
                      <SelectItem value={item.value} key={item.value || ind}>
                        <span className="truncate">{item.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                // Show selected field when state is not an array
                <Input
                  {...field}
                  // disabled={!field.value.length}
                  placeholder="Enter Your address"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="HCJ_ST_Student_City"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                City <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Bangalore (Autofill from pincode/editable)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="HCJ_ST_Address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Address <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Your address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Next"}
        </Button>
      </form>
    </Form>
  );
}
