"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { GraduationCap, Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

import { useSession } from "next-auth/react"
import AddEducationPopup from "../../components/add-education6086"

export default function EducationPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentEducation, setCurrentEducation] = useState(null)
  const [educations, setEducations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const { data: session } = useSession()

  // Get individual ID from session
  const INDIVIDUAL_ID = session?.user?.individualId

  // Fetch all educations on component mount
  useEffect(() => {
    if (INDIVIDUAL_ID) {
      fetchAllEducations()
    }
  }, [INDIVIDUAL_ID])

  // GET ALL - Fetch all educations for the individual
  const fetchAllEducations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/student/v1/hcjBrBT60861AddEducation?IE_Individual_Id=${INDIVIDUAL_ID}`)
      const data = await response.json()

      if (data.success) {
        setEducations(data.educationRecords || [])
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch education data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching educations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch education data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // POST - Add a new education
  const handleAddEducation = async (formData) => {
    setIsSubmitting(true)
    try {
      // Map frontend form data to backend API structure
      const apiData = {
        IE_Individual_Id: INDIVIDUAL_ID,
        IE_Institute_Name: formData.institutionName,
        IE_Program_Name: formData.degree,
        IE_Specialization: formData.fieldOfStudy,
        IE_Start_Date: formData.startDate,
        IE_End_Date: formData.currentlyStudying ? null : formData.endDate,
        IE_Program_Status: formData.currentlyStudying ? "01" : "02", // 01 for in progress, 02 for completed
        IE_Score_Grades: formData.gradeType.toLowerCase(),
        IE_Score_Grades_Value: Number.parseFloat(formData.score),
      }

      const response = await fetch(`/api/student/v1/hcjBrBT60861AddEducation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      })

      const data = await response.json()

      if (data.message) {
        // Refresh the education list after successful addition
        fetchAllEducations()

        toast({
          title: "Success",
          description: "Education added successfully",
        })
        setIsOpen(false)
      } else {
        throw new Error(data.message || "Failed to add education")
      }
    } catch (error) {
      console.error("Error adding education:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add education",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // GET - Fetch a single education record
  const fetchEducation = async (id) => {
    try {
      const response = await fetch(`/api/student/v1/hcjBrBT60861AddEducation/${id}`)
      const data = await response.json()

      if (response.ok) {
        return data
      } else {
        throw new Error(data.message || "Failed to fetch education details")
      }
    } catch (error) {
      console.error("Error fetching education details:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch education details",
        variant: "destructive",
      })
      return null
    }
  }

  // PATCH - Update an existing education
  const handleUpdateEducation = async (formData) => {
    if (!currentEducation || !currentEducation._id) {
      toast({
        title: "Error",
        description: "No education selected for update",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Map frontend form data to backend API structure
      const apiData = {
        IE_Individual_Id: INDIVIDUAL_ID,
        IE_Institute_Name: formData.institutionName,
        IE_Program_Name: formData.degree,
        IE_Specialization: formData.fieldOfStudy,
        IE_Start_Date: formData.startDate,
        IE_End_Date: formData.currentlyStudying ? null : formData.endDate,
        IE_Program_Status: formData.currentlyStudying ? "01" : "02", // 01 for in progress, 02 for completed
        IE_Score_Grades: formData.gradeType.toLowerCase(),
        IE_Score_Grades_Value: Number.parseFloat(formData.score),
      }

      const response = await fetch(`/api/student/v1/hcjBrBT60861AddEducation/${currentEducation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      })

      const data = await response.json()

      if (data.message) {
        // Refresh the education list after successful update
        fetchAllEducations()

        toast({
          title: "Success",
          description: "Education updated successfully",
        })
        setIsEditOpen(false)
        setCurrentEducation(null)
      } else {
        throw new Error(data.message || "Failed to update education")
      }
    } catch (error) {
      console.error("Error updating education:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update education",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // DELETE - Delete an education
  const handleDeleteEducation = async (id) => {
    if (!id) return

    setIsDeleting(true)
    setDeleteId(id)

    try {
      const response = await fetch(`/api/student/v1/hcjBrBT60861AddEducation/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.message) {
        // Update local state after successful deletion
        setEducations(educations.filter((edu) => edu._id !== id))

        toast({
          title: "Success",
          description: "Education deleted successfully",
        })
      } else {
        throw new Error(data.message || "Failed to delete education")
      }
    } catch (error) {
      console.error("Error deleting education:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete education",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const handleEditClick = async (education) => {
    try {
      // Optionally fetch the full education details before editing
      const fullEducation = await fetchEducation(education._id);
      if (fullEducation) {
        setCurrentEducation(fullEducation);
      } else {
        setCurrentEducation(education);
      }

      // For now, just use the education data we already have
      setCurrentEducation(education)
      setIsEditOpen(true)
    } catch (error) {
      console.error("Error preparing education for edit:", error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    try {
      return format(new Date(dateString), "yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return ""
    }
  }

  const formatDuration = (startDate, endDate, programStatus) => {
    const start = formatDate(startDate)
    const end = programStatus === "01" ? "Present" : formatDate(endDate || "")
    return `${start} - ${end}`
  }

  // Map backend data structure to frontend display format
  const mapEducationForDisplay = (edu) => {
    return {
      _id: edu._id,
      institutionName: edu.IE_Institute_Name,
      degree: edu.IE_Program_Name,
      fieldOfStudy: edu.IE_Specialization,
      startDate: edu.IE_Start_Date,
      endDate: edu.IE_End_Date,
      currentlyStudying: edu.IE_Program_Status === "01",
      score: edu.IE_Score_Grades_Value,
      gradeType: edu.IE_Score_Grades ? edu.IE_Score_Grades.toUpperCase() : "CGPA",
    }
  }

  // Map backend data structure to form data for editing
  const mapEducationForEdit = (edu) => {
    return {
      institutionName: edu.IE_Institute_Name,
      degree: edu.IE_Program_Name,
      fieldOfStudy: edu.IE_Specialization,
      startDate: edu.IE_Start_Date ? new Date(edu.IE_Start_Date) : null,
      endDate: edu.IE_End_Date ? new Date(edu.IE_End_Date) : null,
      currentlyStudying: edu.IE_Program_Status === "01",
      score: edu.IE_Score_Grades_Value?.toString() || "",
      gradeType: edu.IE_Score_Grades ? edu.IE_Score_Grades.toUpperCase() : "CGPA",
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Education</h1>
          <Button onClick={() => setIsOpen(true)} className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </div>

        {/* Add Education Popup */}
        <AddEducationPopup
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleAddEducation}
          isSubmitting={isSubmitting}
        />

        {/* Edit Education Popup */}
        {currentEducation && (
          <AddEducationPopup
            isOpen={isEditOpen}
            onClose={() => {
              setIsEditOpen(false)
              setCurrentEducation(null)
            }}
            onSubmit={handleUpdateEducation}
            isSubmitting={isSubmitting}
            education={mapEducationForEdit(currentEducation)}
          />
        )}

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-[calc(100vh-150px)] pr-4">
            <div className="space-y-6 mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading education data...</span>
                </div>
              ) : educations.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No education details added yet.</p>
                  <Button variant="link" onClick={() => setIsOpen(true)}>
                    Add your education details
                  </Button>
                </div>
              ) : (
                educations.map((edu) => (
                  <Card key={edu._id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-semibold">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{edu.IE_Institute_Name}</h3>
                              <p className="text-gray-600">
                                {edu.IE_Program_Name}, {edu.IE_Specialization}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDuration(edu.IE_Start_Date, edu.IE_End_Date, edu.IE_Program_Status)}
                              </p>
                              {edu.IE_Score_Grades && (
                                <p className="text-sm text-gray-500 mt-2">
                                  {edu.IE_Score_Grades.toUpperCase()}: {edu.IE_Score_Grades_Value}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditClick(edu)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Education</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this education entry? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteEducation(edu._id)}
                                      disabled={isDeleting}
                                    >
                                      {isDeleting && deleteId === edu._id ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Deleting...
                                        </>
                                      ) : (
                                        "Delete"
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

