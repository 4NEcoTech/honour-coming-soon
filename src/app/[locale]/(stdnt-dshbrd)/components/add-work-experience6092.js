"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal } from "@/components/ui/modal"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"

export default function WorkExperiencePopup({ isOpen, onClose, onSubmit, isSubmitting = false, initialData }) {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentlyWorking, setCurrentlyWorking] = useState(false)
  const [formData, setFormData] = useState({
    jobTitle: "",
    employmentType: "",
    companyName: "",
    country: "india",
    city: "",
    workmode: "",
    description: "",
  })

  // Initialize form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        jobTitle: initialData.jobTitle || "",
        employmentType: initialData.employmentType || "",
        companyName: initialData.companyName || "",
        country: initialData.country || "india",
        city: initialData.city || "",
        workmode: initialData.workmode || "",
        description: initialData.description || "",
      })
      setStartDate(initialData.startDate || null)
      setEndDate(initialData.endDate || null)
      setCurrentlyWorking(initialData.currentlyWorking || false)
    }
  }, [initialData])

  // Reset form when closed
  useEffect(() => {
    if (!isOpen && !initialData) {
      setFormData({
        jobTitle: "",
        employmentType: "",
        companyName: "",
        country: "india",
        city: "",
        workmode: "",
        description: "",
      })
      setStartDate(null)
      setEndDate(null)
      setCurrentlyWorking(false)
    }
  }, [isOpen, initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCurrentlyWorkingChange = (checked) => {
    setCurrentlyWorking(checked)
    if (checked) {
      setEndDate(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.jobTitle || !formData.companyName || !startDate || !formData.employmentType) {
      return
    }

    const data = {
      ...formData,
      startDate,
      endDate: currentlyWorking ? null : endDate,
      currentlyWorking,
    }

    onSubmit(data)
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="xl"
      animation="zoom"
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{initialData ? "Edit Work Experience" : "Add Work Experience"}</h2>
          <p className="text-sm text-muted-foreground">
            Share your professional experience to showcase your skills and expertise.
          </p>
        </div>
      }
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-primary">Job Title <span className="text-destructive">*</span></Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g., UI/UX Designer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType" className="text-primary">Employment Type <span className="text-destructive">*</span></Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => handleSelectChange("employmentType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-primary">Company Name <span className="text-destructive">*</span></Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g., Google"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-primary">Country <span className="text-destructive">*</span></Label>
              <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-primary">City <span className="text-destructive">*</span></Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Bangalore"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workmode" className="text-primary">Work Mode <span className="text-destructive">*</span></Label>
            <Select value={formData.workmode} onValueChange={(value) => handleSelectChange("workmode", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-site">On-Site</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-primary">Start Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {startDate ? (
                      format(startDate, "MMM yyyy")
                    ) : (
                      <span className="text-muted-foreground">Select start date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-primary">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={!startDate || currentlyWorking}
                  >
                    {endDate ? (
                      format(endDate, "MMM yyyy")
                    ) : (
                      <span className="text-muted-foreground">{currentlyWorking ? "Present" : "Select end date"}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="currently-working"
              checked={currentlyWorking}
              onCheckedChange={handleCurrentlyWorkingChange}
            />
            <Label htmlFor="currently-working">I am currently working in this role</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-primary">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your role, responsibilities, and achievements..."
              rows={4}
              className="resize-y"
            />
            <div className="text-right text-sm text-muted-foreground">
              {formData.description.length > 0 ? `${formData.description.split(/\s+/).length} words` : "0 words"} (less
              than 1000 words)
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Saving..."}
                </>
              ) : initialData ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

