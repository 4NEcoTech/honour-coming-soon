"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
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
} from "@/components/ui/alert-dialog";
import WorkExperiencePopup from "../../components/add-work-experience6092";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const {data: session} = useSession()
//  console.log(session)

  // Hardcoded individual ID for testing
  const INDIVIDUAL_ID = session?.user?.individualId;

  // Fetch all experiences on component mount
  useEffect(() => {
    fetchAllExperiences();
  }, []);

  // GET ALL - Fetch all experiences for the individual
  const fetchAllExperiences = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/student/v1/hcjBrBT60921AddWorkExperience?HCJ_JSX_Individual_Id=${INDIVIDUAL_ID}`
      );
      const data = await response.json();

      if (data.success) {
        setExperiences(data.experiences);
        console.log("Fetched experiences:", data.experiences);
      } else {
        console.error("Error fetching experiences:", data.message);
        toast({
          title: "Error",
          description: data.message || "Failed to fetch experiences",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast({
        title: "Error",
        description: "Failed to fetch experiences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // GET SINGLE - Fetch a single experience by ID
  const fetchSingleExperience = async (id) => {
    try {
      const response = await fetch(
        `/api/student/v1/hcjBrBT60921AddWorkExperience/${id}`
      );
      const data = await response.json();

      if (data.success) {
        console.log("Fetched single experience:", data.experience);
        return data.experience;
      } else {
        console.error("Error fetching experience:", data.message);
        toast({
          title: "Error",
          description: data.message || "Failed to fetch experience",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error("Error fetching experience:", error);
      toast({
        title: "Error",
        description: "Failed to fetch experience",
        variant: "destructive",
      });
      return null;
    }
  };



  // POST - Add a new experience
  const handleAddExperience = async (formData) => {
    setIsSubmitting(true);
    try {
      // Prepare data for API
      const apiData = {
        HCJ_JSX_Job_Seeker_Id: session?.user?.jobSeekerId,
        HCJ_JSX_Individual_Id: session?.user?.individualId,
        HCJ_JSX_Company_Name: formData.companyName,
        HCJ_JSX_Job_Title: formData.jobTitle,
        HCJ_JSX_Start_Date: formData.startDate ? new Date(formData.startDate) : null,
        HCJ_JSX_End_Date: formData.currentlyWorking
          ? null
          : formData.endDate
          ? new Date(formData.endDate)
          : null,
        HCJ_JSX_Currently_Working: formData.currentlyWorking,
        HCJ_JSX_Job_Description: formData.description,
        HCJ_JSX_Country: formData.country,
        HCJ_JSX_State: formData.state,
        HCJ_JSX_City: formData.city,
        HCJ_JSX_Work_Mode: formData.workmode,
        HCJ_JSX_Employement_Type: formData.employmentType,
        HCJ_JSX_Updated_By: session?.user?.individualId,
      };
      

      console.log("formData", formData);

      const response = await fetch(
        `/api/student/v1/hcjBrBT60921AddWorkExperience`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        }
      );

      const data = await response.json();

      console.log("formData", formData);

      if (data.success) {
        toast({
          title: "Success",
          description: "Experience added successfully",
        });
        fetchAllExperiences(); // Refresh the list
        setIsOpen(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add experience",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding experience:", error);
      toast({
        title: "Error",
        description: "Failed to add experience",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // PATCH - Update an existing experience
  const handleUpdateExperience = async (formData) => {
    if (!currentExperience || !currentExperience._id) {
      toast({
        title: "Error",
        description: "No experience selected for update",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const apiData = {
        HCJ_JSX_Job_Seeker_Id: session?.user?.jobSeekerId,
        HCJ_JSX_Individual_Id: session?.user?.individualId,
        HCJ_JSX_Company_Name: formData.companyName,
        HCJ_JSX_Job_Title: formData.jobTitle,
        HCJ_JSX_Start_Date: formData.startDate
          ? new Date(formData.startDate)
          : undefined,
        HCJ_JSX_End_Date: formData.currentlyWorking
          ? null
          : formData.endDate
          ? new Date(formData.endDate)
          : undefined,
        HCJ_JSX_Currently_Working: formData.currentlyWorking,
        HCJ_JSX_Job_Description: formData.description || "",
        HCJ_JSX_Country: formData.country,
        HCJ_JSX_State: "up",
        HCJ_JSX_City: formData.city,
        HCJ_JSX_Work_Mode: formData.workmode,
        HCJ_JSX_Employement_Type: formData.employmentType,
        HCJ_JSX_Updated_By: session?.user?.individualId, // Hardcoded for testing
      };

      const response = await fetch(
        `/api/student/v1/hcjBrBT60921AddWorkExperience/${currentExperience._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Experience updated successfully",
        });
        fetchAllExperiences(); // Refresh the list
        setIsEditOpen(false);
        setCurrentExperience(null);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update experience",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating experience:", error);
      toast({
        title: "Error",
        description: "Failed to update experience",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE - Delete an experience
  const handleDeleteExperience = async (id) => {
    if (!id) return;

    setIsDeleting(true);
    setDeleteId(id);

    try {
      const response = await fetch(
        `/api/student/v1/hcjBrBT60921AddWorkExperience/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Experience deleted successfully",
        });
        // Remove the deleted experience from state
        setExperiences(experiences.filter((exp) => exp._id !== id));
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete experience",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleEditClick = (experience) => {
    setCurrentExperience(experience);
    setIsEditOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM yyyy");
  };

  const formatDuration = (startDate, endDate, currentlyWorking) => {
    const start = formatDate(startDate);
    const end = currentlyWorking ? "Present" : formatDate(endDate || "");
    return `${start} - ${end}`;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">Work Experience</h1>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add work experience
          </Button>
        </div>

        {/* Add Experience Popup */}
        <WorkExperiencePopup
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleAddExperience}
          isSubmitting={isSubmitting}
        />

        {/* Edit Experience Popup */}
        {currentExperience && (
          <WorkExperiencePopup
            isOpen={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              setCurrentExperience(null);
            }}
            onSubmit={handleUpdateExperience}
            isSubmitting={isSubmitting}
            initialData={{
              jobTitle: currentExperience.HCJ_JSX_Job_Title,
              employmentType:
                currentExperience.HCJ_JSX_Employement_Type.toLowerCase(),
              companyName: currentExperience.HCJ_JSX_Company_Name,
              country: currentExperience.HCJ_JSX_Country.toLowerCase(),
              state: currentExperience.HCJ_JSX_State,
              city: currentExperience.HCJ_JSX_City,
              workmode: currentExperience.HCJ_JSX_Work_Mode.toLowerCase(),
              description: currentExperience.HCJ_JSX_Job_Description,
              startDate: new Date(currentExperience.HCJ_JSX_Start_Date),
              endDate: currentExperience.HCJ_JSX_End_Date
                ? new Date(currentExperience.HCJ_JSX_End_Date)
                : null,
              currentlyWorking: currentExperience.HCJ_JSX_Currently_Working,
            }}
          />
        )}

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-[calc(100vh-150px)] pr-4">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading experiences...</span>
                </div>
              ) : experiences.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">
                    No work experiences added yet.
                  </p>
                  <Button variant="link" onClick={() => setIsOpen(true)}>
                    Add your first work experience
                  </Button>
                </div>
              ) : (
                experiences.map((exp) => (
                  <Card key={exp._id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-semibold">
                          {exp.HCJ_JSX_Company_Name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">
                                {exp.HCJ_JSX_Job_Title}
                              </h3>
                              <p className="text-gray-600">
                                {exp.HCJ_JSX_Company_Name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDuration(
                                  exp.HCJ_JSX_Start_Date,
                                  exp.HCJ_JSX_End_Date,
                                  exp.HCJ_JSX_Currently_Working
                                )}
                              </p>
                              <p className="text-sm text-gray-500">
                                {exp.HCJ_JSX_City}, {exp.HCJ_JSX_State},{" "}
                                {exp.HCJ_JSX_Country}
                              </p>
                              <p className="text-sm text-gray-500">
                                {exp.HCJ_JSX_Employement_Type} ·{" "}
                                {exp.HCJ_JSX_Work_Mode}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(exp)}
                              >
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
                                    <AlertDialogTitle>
                                      Delete Experience
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this work
                                      experience? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteExperience(exp._id)
                                      }
                                      disabled={isDeleting}
                                    >
                                      {isDeleting && deleteId === exp._id ? (
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
                          {exp.HCJ_JSX_Job_Description && (
                            <div className="mt-2 text-sm">
                              <p>{exp.HCJ_JSX_Job_Description}</p>
                            </div>
                          )}
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
  );
}
