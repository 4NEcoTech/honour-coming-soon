"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/ui/modal"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"

export default function ProjectPopup({ isOpen, onClose, onSubmit, project = null }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    startDate: null,
    endDate: null,
    status: "in-progress",
    description: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        company: project.company || "",
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
        status: project.status || "in-progress",
        description: project.description || "",
      })
    } else {
      // Reset form for new project
      setFormData({
        title: "",
        company: "",
        startDate: null,
        endDate: null,
        status: "in-progress",
        description: "",
      })
    }
  }, [project, isOpen])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleDateChange = (field, date) => {
    setFormData((prev) => ({ ...prev, [field]: date }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.startDate || !formData.description) {
        alert("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      // Call the onSubmit handler passed from parent
      await onSubmit(formData)

      // Close the modal
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while saving the project")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      animation="zoom"
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{project ? "Edit Project" : "Add Project"}</h2>
          <p className="text-sm text-muted-foreground">Showcase your work by adding details about your projects.</p>
        </div>
      }
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-primary">Project Name <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., E-commerce Website"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-primary">Company/Client Name</Label>
              <Input id="company" value={formData.company} onChange={handleChange} placeholder="e.g., ABC Corp" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-primary">Start Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {formData.startDate ? (
                      format(formData.startDate, "MMM yyyy")
                    ) : (
                      <span className="text-muted-foreground">Select start date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDateChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-primary">End Date {formData.status === "in-progress" && "(Expected)"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={!formData.startDate}
                  >
                    {formData.endDate ? (
                      format(formData.endDate, "MMM yyyy")
                    ) : (
                      <span className="text-muted-foreground">Select end date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleDateChange("endDate", date)}
                    disabled={(date) => date < formData.startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-primary">Project Status<span className="text-destructive">*</span></Label>
            <RadioGroup value={formData.status} onValueChange={handleStatusChange} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="01" id="01" />
                <Label htmlFor="01">In Progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="02" id="02" />
                <Label htmlFor="02">Finished</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-primary">Description *<span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project, technologies used, your role, and achievements..."
              rows={4}
              className="resize-y"
              required
            />
            <div className="text-right text-sm text-muted-foreground">
              {formData.description.length > 0 ? `${formData.description.split(/\s+/).length} words` : "0 words"} (less
              than 1000 words)
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {project ? "Updating..." : "Saving..."}
                </>
              ) : project ? (
                "Update Project"
              ) : (
                "Save Project"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

