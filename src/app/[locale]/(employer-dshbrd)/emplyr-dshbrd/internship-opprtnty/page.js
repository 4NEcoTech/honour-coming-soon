"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  location: z.string(),
  stipend: z.string(),
  duration: z.string(),
  internshipType: z.enum(["full-time", "part-time"]),
  description: z.string(),
  perks: z.array(z.string()),
  requirements: z.array(z.string()),
  isRemote: z.boolean(),
})

export default function InternshipPostingForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      stipend: "",
      duration: "",
      internshipType: "full-time",
      description: "",
      perks: [],
      requirements: [],
      isRemote: false,
    },
  })

  function onSubmit(values) {
    console.log(values)
  }

  const perks = [
    { id: "performance-based", label: "Performance based stipend" },
    { id: "flexible-hours", label: "Flexible Work Hours" },
    { id: "certificate", label: "Certificate" },
    { id: "mentorship", label: "Mentorship" },
    { id: "inclusive-environment", label: "Inclusive work environment" },
  ]

  const requirements = [
    { id: "student", label: "Currently enrolled student" },
    { id: "portfolio", label: "Portfolio link" },
    { id: "resume", label: "Resume" },
    { id: "cover-letter", label: "Cover letter" },
    { id: "work-samples", label: "Samples of previous work" },
  ]

  return (
    <div className="p-6 container mx-auto max-w-lg">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-xl font-semibold">Post Opportunity</h1>
          <p className="text-sm text-muted-foreground">Create a new internship posting</p>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internship Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. UI/UX Design Intern" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. New York, NY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRemote"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Remote Work</FormLabel>
                <FormDescription>Allow remote work for this internship</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stipend"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stipend</FormLabel>
              <FormControl>
                <Input placeholder="e.g. $1,000/month" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 3 months" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="internshipType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Internship Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="full-time" />
                    </FormControl>
                    <FormLabel className="font-normal">Full-time</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="part-time" />
                    </FormControl>
                    <FormLabel className="font-normal">Part-time</FormLabel>
                  </FormItem>
                </RadioGroup>
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
              <FormLabel>Internship Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the internship role and responsibilities"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Perks & Benefits</FormLabel>
          {perks.map((perk) => (
            <FormField
              key={perk.id}
              control={form.control}
              name="perks"
              render={({ field }) => (
                <FormItem key={perk.id} className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(perk.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, perk.id])
                          : field.onChange(field.value?.filter((value) => value !== perk.id))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{perk.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="space-y-4">
          <FormLabel>Requirements</FormLabel>
          {requirements.map((requirement) => (
            <FormField
              key={requirement.id}
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem key={requirement.id} className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(requirement.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, requirement.id])
                          : field.onChange(field.value?.filter((value) => value !== requirement.id))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{requirement.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit" className="w-full">
          Publish
        </Button>
      </form>
    </Form>
    </div>
  )
}

