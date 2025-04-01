"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Modal } from "@/components/ui/modal"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddEducationPopup({ isOpen, onClose, onSubmit, isSubmitting, education = null }) {
  const [formData, setFormData] = useState({
    institutionName: "",
    degree: "",
    fieldOfStudy: "",
    score: "",
    gradeType: "CGPA",
    startDate: null,
    endDate: null,
    currentlyStudying: false,
  })

  // Reset form when education changes
  useEffect(() => {
    if (education) {
      setFormData({
        institutionName: education.institutionName || "",
        degree: education.degree || "",
        fieldOfStudy: education.fieldOfStudy || "",
        score: education.score || "",
        gradeType: education.gradeType || "CGPA",
        startDate: education.startDate ? new Date(education.startDate) : null,
        endDate: education.endDate ? new Date(education.endDate) : null,
        currentlyStudying: education.currentlyStudying || false,
      })
    } else {
      // Reset form for new education
      setFormData({
        institutionName: "",
        degree: "",
        fieldOfStudy: "",
        score: "",
        gradeType: "CGPA",
        startDate: null,
        endDate: null,
        currentlyStudying: false,
      })
    }
  }, [education, isOpen])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleGradeTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, gradeType: value }))
  }

  const handleDateChange = (field, date) => {
    setFormData((prev) => ({ ...prev, [field]: date }))
  }

  const handleCurrentlyStudyingChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      currentlyStudying: checked,
      endDate: checked ? null : prev.endDate,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Validate required fields
      if (!formData.institutionName || !formData.degree || !formData.fieldOfStudy || !formData.startDate) {
        alert("Please fill in all required fields")
        return
      }

      // Call the onSubmit handler passed from parent
      await onSubmit(formData)

      // Close the modal
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while saving the education")
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
          <h2 className="text-xl font-semibold">{education ? "Edit Education" : "Add Education"}</h2>
          <p className="text-sm text-muted-foreground">
            Enhance your profile by adding your education details to increase your chances of getting hired.
          </p>
        </div>
      }
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institutionName" className="text-primary">
                Institution Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                placeholder="e.g., Harvard University"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree" className="text-primary">
                Program Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g., Bachelor of Science"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy" className="text-primary">
                Branch & Specialization <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="score" className="text-primary">
                Score/Grade <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Select value={formData.gradeType} onValueChange={handleGradeTypeChange}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CGPA">CGPA</SelectItem>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="GPA">GPA</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="score"
                  value={formData.score}
                  onChange={handleChange}
                  placeholder={`e.g., ${formData.gradeType === "PERCENTAGE" ? "85%" : "3.8"}`}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-primary">
                Start Date <span className="text-destructive">*</span>
              </Label>
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
              <div className="flex items-center justify-between">
                <Label className="text-primary">End Date</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="currentlyStudying"
                    checked={formData.currentlyStudying}
                    onCheckedChange={handleCurrentlyStudyingChange}
                  />
                  <Label htmlFor="currentlyStudying" className="text-sm font-normal">
                    Currently Studying
                  </Label>
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={formData.currentlyStudying || !formData.startDate}
                  >
                    {formData.endDate && !formData.currentlyStudying ? (
                      format(formData.endDate, "MMM yyyy")
                    ) : (
                      <span className="text-muted-foreground">
                        {formData.currentlyStudying ? "Currently Studying" : "Select end date"}
                      </span>
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

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {education ? "Updating..." : "Saving..."}
                </>
              ) : education ? (
                "Update Education"
              ) : (
                "Save Education"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

