"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Plus, Calendar, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useRouter } from "@/i18n/routing";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

// Define schemas for each opportunity type
const jobSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  skillsRequired: z.array(z.string()).optional(),
  workMode: z.enum(["in-office", "hybrid", "remote"]),
  duration: z.enum(["permanent", "contract"]),
  startDate: z.enum(["immediately", "within-month", "later"]),
  location: z.string().optional(),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  additionalPreferences: z.string().optional(),
  assessmentQuestions: z
    .array(
      z.object({
        question: z.string(),
        isMandatory: z.boolean().default(false),
      })
    )
    .optional(),
  salaryCurrency: z.string().optional(),
  salaryAmount: z.string().optional(),
  perks: z.array(z.string()).optional(),
  isEqualOpportunity: z.boolean().optional(),
  whoCanApply: z.array(z.string()).optional(),
  additionalRequirements: z.array(z.string()).optional(),
  closingDate: z.date().optional(),
  numberOfOpenings: z.string().optional(),
});

const internshipSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  skillsRequired: z.array(z.string()).optional(),
  workMode: z.enum(["in-office", "hybrid", "remote"]),
  startDate: z.enum(["immediately", "within-month", "later"]),
  durationValue: z.string().optional(),
  durationType: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  additionalPreferences: z.string().optional(),
  assessmentQuestions: z
    .array(
      z.object({
        question: z.string(),
        isMandatory: z.boolean().default(false),
      })
    )
    .optional(),
  numberOfInterns: z.string().optional(),
  salaryCurrency: z.string().optional(),
  salaryAmount: z.string().optional(),
  perks: z.array(z.string()).optional(),
  isEqualOpportunity: z.boolean().optional(),
  whoCanApply: z.array(z.string()).optional(),
  additionalRequirements: z.array(z.string()).optional(),
  closingDate: z.date().optional(),
  longTermPossibility: z.boolean().optional(),
});

const projectSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  skillsRequired: z.array(z.string()).optional(),
  workMode: z.enum(["in-office", "hybrid", "remote"]),
  durationValue: z.string().optional(),
  durationType: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  additionalPreferences: z.string().optional(),
  assessmentQuestions: z
    .array(
      z.object({
        question: z.string(),
        isMandatory: z.boolean().default(false),
      })
    )
    .optional(),
  numberOfInterns: z.string().optional(),
  salaryCurrency: z.string().optional(),
  salaryAmount: z.string().optional(),
  perks: z.array(z.string()).optional(),
  isEqualOpportunity: z.boolean().optional(),
  whoCanApply: z.array(z.string()).optional(),
  additionalRequirements: z.array(z.string()).optional(),
  closingDate: z.date().optional(),
  longTermPossibility: z.boolean().optional(),
});

// Union type for all opportunity types
const formSchema = z.discriminatedUnion("opportunityType", [
  z.object({ opportunityType: z.literal("job") }).merge(jobSchema),
  z
    .object({ opportunityType: z.literal("internship") })
    .merge(internshipSchema),
  z.object({ opportunityType: z.literal("project") }).merge(projectSchema),
]);

export default function OpportunityPostingForm() {
  const [assessmentQuestions, setAssessmentQuestions] = useState([
    { question: "", isMandatory: false },
  ]);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Get company ID from session
  const companyId = session?.user?.companyId;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opportunityType: "job",
      title: "",
      skillsRequired: [],
      workMode: "in-office",
      duration: "permanent",
      startDate: "immediately",
      location: "",
      description: "",
      responsibilities: "",
      additionalPreferences: "",
      assessmentQuestions: [],
      salaryCurrency: "INR",
      salaryAmount: "",
      perks: [],
      isEqualOpportunity: true,
      whoCanApply: [],
      additionalRequirements: [],
      durationValue: "",
      durationType: "months",
      numberOfOpenings: "",
      numberOfInterns: "",
      longTermPossibility: false,
    },
  });

  const opportunityType = form.watch("opportunityType");
  const isEqualOpportunity = form.watch("isEqualOpportunity");
  // Add this near the top of your component
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const isEditing = !!id;

  // Fetch data when editing
  useEffect(() => {
    if (id && form) {
      const fetchOpportunity = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/employee/v1/hcjBrBT61821JobPostings/${id}`,
            {
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch opportunity");
          }

          const data = await response.json();
          if (data.success && data.data) {
            const opportunity = data.data;

            // Map API data to form structure
            const formData = {
              opportunityType: opportunity.HCJ_JP_Opportunity_Type,
              title: opportunity.HCJ_JP_Job_Title,
              description: opportunity.HCJ_JP_Job_Description,
              responsibilities: opportunity.HCJ_JP_Responsibility,
              additionalPreferences: opportunity.HCJ_JP_Additional_Preferences,
              // assessmentQuestions: opportunity.HCJ_JP_Assessment_Questions
              //   ? opportunity.HCJ_JP_Assessment_Questions.map((q) => ({ question: q, isMandatory: false }))
              //   : [],
              assessmentQuestions: opportunity.HCJ_JP_Assessment_Questions
                ? Array.isArray(opportunity.HCJ_JP_Assessment_Questions)
                  ? opportunity.HCJ_JP_Assessment_Questions.map((q) =>
                      typeof q === "string"
                        ? { question: q, isMandatory: false }
                        : q
                    )
                  : []
                : [],
              skillsRequired: opportunity.HCJ_JP_Job_Skills || [],
              location: opportunity.HCJ_JDT_Job_Location,
              closingDate: opportunity.HCJ_JP_Closing_Date
                ? new Date(opportunity.HCJ_JP_Closing_Date)
                : undefined,
              isEqualOpportunity: opportunity.HCJ_JP_Equal_Opportunity_Flag,
              whoCanApply: opportunity.HCJ_JP_Who_Can_Apply?.split(", ") || [],
              additionalRequirements:
                opportunity.HCJ_JP_Additional_Requirement?.split(", ") || [],
              perks: opportunity.HCJ_JP_Perks || [],
              salaryCurrency: "INR",
              salaryAmount: opportunity.HCJ_JDT_Salary?.toString() || "",
              workMode: opportunity.HCJ_JP_Job_Type,
              duration: opportunity.HCJ_JP_Job_Duration,
              startDate: opportunity.HCJ_JP_Start_Date_Flag
                ? "within-month"
                : "immediately",
              numberOfOpenings: "",
              longTermPossibility: false,
            };

            form.reset(formData);
            // setAssessmentQuestions(
            //   opportunity.HCJ_JP_Assessment_Questions
            //     ? opportunity.HCJ_JP_Assessment_Questions.map((q) => ({ question: q, isMandatory: false }))
            //     : [{ question: "", isMandatory: false }],
            // )
            setAssessmentQuestions(
              opportunity.HCJ_JP_Assessment_Questions
                ? opportunity.HCJ_JP_Assessment_Questions.map((q) => {
                    if (typeof q === "object" && q !== null) {
                      return {
                        question: String(q.question || ""),
                        isMandatory: Boolean(q.isMandatory),
                      };
                    } else {
                      return {
                        question: String(q),
                        isMandatory: false,
                      };
                    }
                  })
                : [{ question: "", isMandatory: false }]
            );
          }
        } catch (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchOpportunity();
    }
  }, [id, form, toast]);

  async function onSubmit(values, action = "publish") {
    try {
      console.log("Omkar", values);

      // Ensure assessmentQuestions is properly formatted
      values.assessmentQuestions = assessmentQuestions
        .filter((q) => q.question && typeof q.question === "string")
        .map((q) => ({
          question: q.question.trim(),
          isMandatory: Boolean(q.isMandatory),
        }));

      // Fix: Ensure `whoCanApply` is populated when equal opportunity is selected
      if (
        values.isEqualOpportunity &&
        (!values.whoCanApply || values.whoCanApply.length < whoCanApply.length)
      ) {
        values.whoCanApply = whoCanApply.map((item) => item.id);
      }

      // Convert date to string if needed
      if (values.closingDate instanceof Date) {
        values.closingDate = values.closingDate.toISOString().split("T")[0];
      }

      // If action is preview, store form data in localStorage and redirect to preview page
      if (action === "preview") {
        localStorage.setItem("previewOpportunity", JSON.stringify(values));
        router.push(
          `/emplyr-dshbrd6161/preview-post6177?type=${values.opportunityType}${
            id ? `&id=${id}` : ""
          }`
        );
        return;
      }

      // Prepare the API request based on whether we're editing or creating
      const url = isEditing
        ? `/api/employee/v1/hcjBrBT61821JobPostings/${id}`
        : "/api/employee/v1/hcjBrBT61821JobPostings";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          title: "Success!",
          description: isEditing
            ? "Opportunity updated successfully."
            : "Opportunity posted successfully.",
        });

        if (!isEditing) {
          form.reset();
          setAssessmentQuestions([{ question: "", isMandatory: false }]);
        }

        router.push("/emplyr-dshbrd6161/opprtnty6166");
      } else {
        toast({
          title: "Failed",
          description: result.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  const handlePreview = () => {
    const values = form.getValues();
    onSubmit(values, "preview");
  };

  const addAssessmentQuestion = () => {
    setAssessmentQuestions([
      ...assessmentQuestions,
      { question: "", isMandatory: false },
    ]);
  };

  const updateAssessmentQuestion = (index, field, value) => {
    const newQuestions = [...assessmentQuestions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setAssessmentQuestions(newQuestions);
  };

  const deleteAssessmentQuestion = (index) => {
    const newQuestions = [...assessmentQuestions];
    newQuestions.splice(index, 1);
    setAssessmentQuestions(newQuestions);
  };

  // Skills list
  const skillsList = [
    { id: "ui-design", label: "UI Design" },
    { id: "ux-design", label: "UX Design" },
    { id: "research", label: "Research" },
    { id: "figma", label: "Figma" },
    { id: "sketch", label: "Sketch" },
    { id: "adobe-xd", label: "Adobe XD" },
    { id: "graphic-design", label: "Graphic Design" },
    { id: "motion-design", label: "Motion Design" },
    { id: "prototyping", label: "Prototyping" },
    { id: "wireframing", label: "Wireframing" },
    { id: "user-testing", label: "User Testing" },
    { id: "front-end", label: "Front-end" },
  ];

  // Perks
  const perks = [
    { id: "flexible-hours", label: "Flexible Work Hours" },
    { id: "health-insurance", label: "Health Insurance" },
    { id: "paid-time-off", label: "Paid Time Off" },
    { id: "remote-work", label: "Remote Work Option" },
    { id: "professional-development", label: "Professional Development" },
  ];

  // Who can apply
  const whoCanApply = [
    { id: "differently-abled", label: "Differently Abled" },
    { id: "students", label: "Students" },
    { id: "lgbtqia", label: "LGBTQIA+" },
    { id: "mothers", label: "Mothers" },
    { id: "women", label: "Women" },
    { id: "sports-person", label: "Sports Person" },
    { id: "single-parent", label: "Single Parent" },
    { id: "returning-from-illness", label: "Returning From Illness" },
    { id: "veterans", label: "Veterans" },
    { id: "racial-biased", label: "Racial Biased" },
    { id: "seniors", label: "Seniors" },
  ];

  // Additional requirements
  const additionalRequirements = [
    { id: "night-shift", label: "Night Shift" },
    { id: "weekend-work", label: "Weekend Work" },
    { id: "travel-required", label: "Travel Required" },
    { id: "relocation-assistance", label: "Relocation Assistance" },
  ];

  // Currencies
  const currencies = [
    { id: "INR", label: "INR (₹)" },
    { id: "USD", label: "USD ($)" },
  ];

  // Time duration types
  const timeDurationTypes = [
    { id: "days", label: "Days" },
    { id: "weeks", label: "Weeks" },
    { id: "months", label: "Months" },
    { id: "years", label: "Years" },
  ];

  if (isLoading && isEditing) {
    return (
      <div className="mb-10 mt-10 p-4 container mx-auto max-w-lg border rounded-xl space-y-6">
        <div className="flex items-center mb-4 gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 mt-10 p-4 container mx-auto max-w-lg border rounded-xl">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-500"
          onClick={() => router.push("/emplyr-dshbrd6161/opprtnty6166")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium ml-2">Post Opportunity</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-medium">Opportunity Details</h2>

            <FormField
              control={form.control}
              name="opportunityType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="job" />
                        </FormControl>
                        <FormLabel className="font-normal">Job</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="internship" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Internship
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="project" />
                        </FormControl>
                        <FormLabel className="font-normal">Project</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {opportunityType === "job" && "Job Title"}
                    {opportunityType === "internship" && "Internship Title"}
                    {opportunityType === "project" && "Project Title"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        opportunityType === "job"
                          ? "e.g. Senior UI Designer"
                          : opportunityType === "internship"
                          ? "e.g. UI/UX Design Intern"
                          : "e.g. UI Design for Mobile App"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillsRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills Required</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange([...(field.value || []), value])
                    }
                    value=""
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skills" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skillsList.map((skill) => (
                        <SelectItem
                          key={skill.id}
                          value={skill.id}
                          disabled={field.value?.includes(skill.id)}
                        >
                          {skill.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((skill) => (
                        <div
                          key={skill}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          {skillsList.find((s) => s.id === skill)?.label}
                          <button
                            type="button"
                            className="ml-1 text-blue-800"
                            onClick={() => {
                              field.onChange(
                                field.value.filter((s) => s !== skill)
                              );
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workMode"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Work Mode</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="in-office" />
                        </FormControl>
                        <FormLabel className="font-normal">In Office</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="hybrid" />
                        </FormControl>
                        <FormLabel className="font-normal">Hybrid</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="remote" />
                        </FormControl>
                        <FormLabel className="font-normal">Remote</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {opportunityType === "job" && (
              <>
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="permanent" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Permanent
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="contract" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Contract
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfOpenings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Openings</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {(opportunityType === "internship" ||
              opportunityType === "project") && (
              <FormField
                control={form.control}
                name="longTermPossibility"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Long Term Possibility</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="immediately" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Immediately
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="within-month" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Within a Month
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="later" />
                        </FormControl>
                        <FormLabel className="font-normal">Later</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {(opportunityType === "internship" ||
              opportunityType === "project") && (
              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="durationValue"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>&nbsp;</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeDurationTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {opportunityType === "job" && "Job Location"}
                    {opportunityType === "internship" && "Internship Location"}
                    {opportunityType === "project" && "Project Location"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. New York, NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {opportunityType === "job" && "Job Description"}
                    {opportunityType === "internship" && "About Internship"}
                    {opportunityType === "project" && "About Project"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        opportunityType === "job"
                          ? "Describe the job role and responsibilities"
                          : opportunityType === "internship"
                          ? "Describe the internship program"
                          : "Describe the project scope and requirements"
                      }
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the key responsibilities"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional preferences for candidates"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Assessment Questions</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAssessmentQuestion}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Question
                </Button>
              </div>
              {assessmentQuestions.map((question, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <div className="flex-1">
                    <Input
                      value={question.question}
                      onChange={(e) =>
                        updateAssessmentQuestion(
                          index,
                          "question",
                          e.target.value
                        )
                      }
                      placeholder={`Question ${index + 1}`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`mandatory-${index}`}
                        checked={question.isMandatory}
                        onCheckedChange={(checked) =>
                          updateAssessmentQuestion(
                            index,
                            "isMandatory",
                            checked
                          )
                        }
                      />
                      <label htmlFor={`mandatory-${index}`} className="text-sm">
                        Mandatory
                      </label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAssessmentQuestion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {(opportunityType === "internship" ||
              opportunityType === "project") && (
              <FormField
                control={form.control}
                name="numberOfInterns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {opportunityType === "internship"
                        ? "Number of Interns Required"
                        : "Number of People Required"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h2 className="text-sm font-medium text-blue-500">
              Salary & Perks
            </h2>

            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="salaryCurrency"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.id} value={currency.id}>
                            {currency.label}
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
                name="salaryAmount"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Perks</FormLabel>
              <div className="grid grid-cols-1 gap-2">
                {perks.map((perk) => (
                  <FormField
                    key={perk.id}
                    control={form.control}
                    name="perks"
                    render={({ field }) => (
                      <FormItem
                        key={perk.id}
                        className="flex items-start space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(perk.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...(field.value || []),
                                    perk.id,
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== perk.id
                                    ) || []
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">
                          {perk.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h2 className="text-sm font-medium text-blue-500">
              Equal Opportunity
            </h2>
            <p className="text-xs text-gray-500">
              Is this an equal employment opportunity?
            </p>

            <FormField
              control={form.control}
              name="isEqualOpportunity"
              render={({ field }) => (
                <div className="flex items-center">
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        const isEqual = value === "yes";
                        field.onChange(isEqual);
                        if (isEqual) {
                          // Auto-select all whoCanApply options
                          form.setValue(
                            "whoCanApply",
                            whoCanApply.map((item) => item.id)
                          );
                        }
                      }}
                      value={field.value ? "yes" : "no"}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <div className="ml-auto">
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          // Auto-select all whoCanApply options
                          form.setValue(
                            "whoCanApply",
                            whoCanApply.map((item) => item.id)
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            />
          </div>

          {!isEqualOpportunity && (
            <>
              <Separator className="my-4" />
              <div className="space-y-4">
                <h2 className="text-sm font-medium text-blue-500">
                  Who Can Apply
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {whoCanApply.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="whoCanApply"
                      render={({ field }) => (
                        <FormItem
                          key={item.id}
                          className="flex items-start space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      item.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      ) || []
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-sm">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator className="my-4" />

          <div className="space-y-4">
            <h2 className="text-sm font-medium text-blue-500">
              Additional Details/Requirement
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {additionalRequirements.map((req) => (
                <FormField
                  key={req.id}
                  control={form.control}
                  name="additionalRequirements"
                  render={({ field }) => (
                    <FormItem
                      key={req.id}
                      className="flex items-start space-x-2 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(req.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), req.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== req.id
                                  ) || []
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">
                        {req.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="closingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Closing Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" className="w-full bg-primary">
              {isEditing ? "Update" : "Publish"}
            </Button>
            <Button
              type="button"
              className="w-full"
              variant="outline"
              onClick={handlePreview}
            >
              Preview
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
