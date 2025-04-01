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
  projectName: z.string(),
  budget: z.string(),
  duration: z.string(),
  projectType: z.enum(["one-time", "ongoing"]),
  description: z.string(),
  perks: z.array(z.string()),
  requirements: z.array(z.string()),
  isRemote: z.boolean(),
})

export default function ProjectPostingForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      projectName: "",
      budget: "",
      duration: "",
      projectType: "one-time",
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
    { id: "flexible-schedule", label: "Flexible schedule" },
    { id: "remote-work", label: "Remote work" },
    { id: "milestone-payments", label: "Milestone-based payments" },
    { id: "portfolio-rights", label: "Portfolio usage rights" },
    { id: "long-term-potential", label: "Potential for long-term collaboration" },
  ]

  const requirements = [
    { id: "portfolio", label: "Portfolio link" },
    { id: "experience", label: "Relevant experience" },
    { id: "tools", label: "Required tools & software" },
    { id: "availability", label: "Immediate availability" },
    { id: "communication", label: "Strong communication skills" },
  ]

  return (
    <div className="p-6 container mx-auto max-w-lg">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-xl font-semibold">Post Opportunity</h1>
          <p className="text-sm text-muted-foreground">Create a new project posting</p>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. UI Design for Mobile App" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Internal project name" {...field} />
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
                <FormDescription>Allow remote work for this project</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Range</FormLabel>
              <FormControl>
                <Input placeholder="e.g. $500 - $1000" {...field} />
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
              <FormLabel>Expected Duration</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 2 weeks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Project Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="one-time" />
                    </FormControl>
                    <FormLabel className="font-normal">One-time project</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ongoing" />
                    </FormControl>
                    <FormLabel className="font-normal">Ongoing project</FormLabel>
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
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the project scope and requirements"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Project Benefits</FormLabel>
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

