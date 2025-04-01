"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"

const skillOptions = [
  { value: 1, label: "Read" },
  { value: 2, label: "Write" },
  { value: 3, label: "Speak" },
]

const languageSchema = z.object({
  languages: z.array(
    z.object({
      language: z.string().min(1, "Language is required"),
      proficiency: z.string().min(1, "Proficiency is required"),
      skills: z.array(z.number()),
    }),
  ),
})

const proficiencyOptions = ["Beginner", "Intermediate", "Advanced"]

export default function AddLanguagePopup({ isOpen, onClose, onSubmit }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      languages: [],
    },
  })

  const handleAddLanguage = () => {
    const newLanguage = watch("newLanguage")
    const newProficiency = watch("newProficiency")
    const skills = watch("skills") || []

    if (newLanguage && newProficiency) {
      setValue("languages", [
        ...watch("languages"),
        {
          language: newLanguage,
          proficiency: newProficiency,
          skills: skillOptions.filter((skill) => skills.includes(skill.value)).map((skill) => skill.value),
        },
      ])
      setValue("newLanguage", "")
      setValue("newProficiency", "")
      setValue("skills", [])
    } else {
      alert("Please select both a language and proficiency.")
    }
  }

  const onFormSubmit = (data) => {
    console.log("Language data submitted:", data)
    if (onSubmit) onSubmit(data)
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      animation="zoom"
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Add Language</h2>
          <p className="text-sm text-muted-foreground">Enhance your profile by adding languages you know</p>
        </div>
      }
    >
      <div className="p-6">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="newLanguage"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="language" className="font-medium text-primary">
                        Language
                      </Label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "English",
                            "Spanish",
                            "French",
                            "German",
                            "Chinese",
                            "Japanese",
                            "Russian",
                            "Arabic",
                            "Hindi",
                          ].map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />

                <Controller
                  name="newProficiency"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="proficiency" className="font-medium text-primary">
                        Proficiency
                      </Label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Proficiency" />
                        </SelectTrigger>
                        <SelectContent>
                          {proficiencyOptions.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-medium text-primary">Skills</Label>
              <div className="grid grid-cols-3 gap-4">
                {skillOptions.map((skill) => (
                  <div key={skill.label} className="flex items-center space-x-2">
                    <Controller
                      name="skills"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={skill.label}
                          checked={field.value?.includes(skill.value)}
                          onCheckedChange={(checked) => {
                            const updatedSkills = checked
                              ? [...(field.value || []), skill.value]
                              : (field.value || []).filter((value) => value !== skill.value)
                            field.onChange(updatedSkills)
                          }}
                        />
                      )}
                    />
                    <Label htmlFor={skill.label} className="text-gray-700 dark:text-gray-300">
                      {skill.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="button" variant="outline" onClick={handleAddLanguage} className="w-full">
              Add Language
            </Button>

            {watch("languages").length > 0 && (
              <div className="space-y-3">
                <Label className="font-medium">Selected Languages</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {watch("languages").map((lang, index) => (
                    <div key={index} className="border p-4 rounded-xl bg-muted/30">
                      <p className="font-medium">
                        {lang.language} - {lang.proficiency}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {lang.skills
                          .map((skillValue) => skillOptions.find((option) => option.value === skillValue)?.label)
                          .map((skill, i) => (
                            <Badge key={i} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={watch("languages").length === 0}>
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

