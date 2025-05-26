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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

// Predefined options for Select
const years = [
  { label: "1st", value: "1" },
  { label: "2nd", value: "2" },
  { label: "3rd", value: "3" },
  { label: "4th", value: "4" },
];

const gradeTypes = [
  { label: "Percentage", value: "percentage" },
  { label: "CGPA", value: "cgpa" },
  { label: "Grade", value: "grade" },
];

export default function EducationalDetails({ initialData, onSubmit }) {
  const t = useTranslations("formErrors");
  const Schema = studentSchema(t);
  // ✅ Define default values (best practice)
  const defaultValues = {
    HCJ_ST_Institution_Name: "",
    HCJ_ST_Enrollment_Year: "",
    HCJ_ST_Class_Of_Year: "",
    HCJ_ST_Student_Program_Name: "",
    HCJ_ST_Student_Branch_Specialization: "",
    year: "",
    HCJ_ST_Score_Grade_Type: "",
    HCJ_ST_Score_Grade: "",
  };

  // ✅ React Hook Form Setup
  const form = useForm({
    resolver: zodResolver(
      Schema.pick({
        HCJ_ST_Institution_Name: true,
        HCJ_ST_Enrollment_Year: true,
        HCJ_ST_Student_Program_Name: true,
        HCJ_ST_Class_Of_Year: true,
        HCJ_ST_Student_Branch_Specialization: true,
        HCJ_ST_Score_Grade_Type: true,
        HCJ_ST_Score_Grade: true,
      })
    ),
    defaultValues, // Use default values
  });

  // ✅ Mapping Function for Initial Data (Best Practice)
  const mapToFormFields = (data) => ({
    HCJ_ST_Institution_Name: data?.HCJ_ST_Institution_Name || "",
    HCJ_ST_Enrollment_Year: data?.HCJ_ST_Enrollment_Year || "",
    HCJ_ST_Class_Of_Year: data?.HCJ_ST_Class_Of_Year || "",
    HCJ_ST_Student_Program_Name: data?.HCJ_ST_Student_Program_Name || "",
    HCJ_ST_Student_Branch_Specialization:
      data?.HCJ_ST_Student_Branch_Specialization || "",
    year: data?.year || "",
    HCJ_ST_Score_Grade_Type: data?.HCJ_ST_Score_Grade_Type || "",
    HCJ_ST_Score_Grade: data?.HCJ_ST_Score_Grade || "",
  });

  // ✅ Load Initial Data into the Form
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const mappedData = mapToFormFields(initialData);
      // setPhoto(initialData?.ID_Profile_Picture);
      form.reset(mappedData); // ✅ Reset with mapped data
    }
  }, [initialData, form]);

  console.log(form.formState);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit("educational", data))}
        className="space-y-6">
        {/* Institution Name (Disabled) */}
        <FormField
          control={form.control}
          name="HCJ_ST_Institution_Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Institution Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Program Enrolled Year (Disabled) */}
        <FormField
          control={form.control}
          name="HCJ_ST_Enrollment_Year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Program Enrolled Year{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Class of Year (Disabled) */}
        <FormField
          control={form.control}
          name="HCJ_ST_Class_Of_Year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Class of the Year <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Program Name (Disabled) */}
        <FormField
          control={form.control}
          name="HCJ_ST_Student_Program_Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Program Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Branch/Specialization (Disabled) */}
        <FormField
          control={form.control}
          name="HCJ_ST_Student_Branch_Specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Branch/Specialization{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Year, Grade Type & Score */}
        <div className="grid grid-cols-3 gap-4">
          {/* Year Select */}
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-primary">Year</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="relative ps-9">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grade Type Select */}
          <FormField
            control={form.control}
            name="HCJ_ST_Score_Grade_Type"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-primary">Score/Grade</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  value={field.value}>
                  <SelectTrigger className="relative ps-9">
                    <SelectValue placeholder="Select Grade Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeTypes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Score Input */}
          <FormField
            control={form.control}
            name="HCJ_ST_Score_Grade"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-primary">Score</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter score" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Next
        </Button>
      </form>
    </Form>
  );
}
