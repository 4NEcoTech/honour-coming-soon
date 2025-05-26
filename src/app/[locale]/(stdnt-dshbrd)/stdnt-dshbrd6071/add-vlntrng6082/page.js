"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import VolunteeringPopup from "../../components/add-volunteering6091";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-alert";

export default function VolunteeringPage() {
  const [volunteerings, setVolunteerings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentVolunteering, setCurrentVolunteering] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const {data : session} = useSession()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [volunteeringToDelete, setVolunteeringToDelete] = useState(null)

  // console.log(session)

  // Fetch all volunteering activities on component mount
  useEffect(() => {
    fetchVolunteerings();
  }, []);

  const fetchVolunteerings = async () => {
    setIsLoading(true);
    try {
      // Replace 'individualId' with the actual dynamic value from your context or session
      const individualId = session?.user?.individualId; // Example individual ID
      const response = await fetch(
        `/api/student/v1/hcjBrBT60911AddVolenteering?HCJ_JSV_Individual_Id=${individualId}`
      );
      const data = await response.json();

      if (data.success) {
        // Transform API data to match our frontend structure
        const transformedVolunteerings = data.activities.map((activity) => ({
          id: activity._id,
          activity: activity.HCJ_JSV_VolunteerActivity_Name,
          organization: activity.HCJ_JSV_Company_Name,
          startDate: activity.HCJ_JSV_Start_Date,
          endDate: activity.HCJ_JSV_End_Date,
          status: activity.HCJ_JSV_VolunteerActivity_Status,
          description: activity.HCJ_JSV_VolunteerActivity_Description,
          originalData: activity,
        }));
        setVolunteerings(transformedVolunteerings);
      } else {
        toast({
          title: "Error",
          description:
            data.message || "Failed to fetch volunteering activities",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching volunteering activities:", error);
      toast({
        title: "Error",
        description:
          "Failed to fetch volunteering activities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVolunteering = () => {
    setCurrentVolunteering(null);
    setIsPopupOpen(true);
  };

  const handleEditVolunteering = (volunteering) => {
    setCurrentVolunteering(volunteering);
    setIsPopupOpen(true);
  };

  const handleDeleteClick = (id) => {
    setVolunteeringToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteVolunteering = async () => {
    if (!volunteeringToDelete) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(
        `/api/student/v1/hcjBrBT60911AddVolenteering/${volunteeringToDelete}`,
        {
          method: "DELETE",
        }
      )
      const data = await response.json()
  
      if (data.success) {
        toast({
          title: "Success",
          description: "Volunteering activity deleted successfully",
        })
        setVolunteerings(
          volunteerings.filter((volunteering) => volunteering.id !== volunteeringToDelete)
        )
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete volunteering activity",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting volunteering activity:", error)
      toast({
        title: "Error",
        description: "Failed to delete volunteering activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setVolunteeringToDelete(null)
    }
  }

  const handleSubmitVolunteering = async (formData) => {
    const apiData = {
      HCJ_JSV_Job_Seeker_Id: session?.user?.jobSeekerId, // Replace with dynamic value
      HCJ_JSV_Individual_Id: session?.user?.individualId, // Replace with dynamic value
      HCJ_JSV_VolunteerActivity_Name: formData.activity,
      HCJ_JSV_Company_Name: formData.organization,
      HCJ_JSV_Start_Date: formData.startDate,
      HCJ_JSV_End_Date: formData.endDate,
      HCJ_JSV_VolunteerActivity_Status: formData.status,
      HCJ_JSV_VolunteerActivity_Description: formData.description,
    };

    try {
      if (currentVolunteering) {
        // Update existing volunteering activity
        const response = await fetch(
          `/api/student/v1/hcjBrBT60911AddVolenteering/${currentVolunteering.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
          }
        );
        const data = await response.json();

        if (data.success) {
          toast({
            title: "Success",
            description: "Volunteering activity updated successfully",
          });
          setVolunteerings(
            volunteerings.map((volunteering) =>
              volunteering.id === currentVolunteering.id
                ? {
                    ...volunteering,
                    activity: formData.activity,
                    organization: formData.organization,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    status: formData.status,
                    description: formData.description,
                  }
                : volunteering
            )
          );
          setIsPopupOpen(false);
        } else {
          toast({
            title: "Error",
            description:
              data.message || "Failed to update volunteering activity",
            variant: "destructive",
          });
        }
      } else {
        // Create new volunteering activity
        const response = await fetch(
          "/api/student/v1/hcjBrBT60911AddVolenteering",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
          }
        );
        const data = await response.json();

        if (data.success) {
          toast({
            title: "Success",
            description: "Volunteering activity created successfully",
          });
          fetchVolunteerings();
          setIsPopupOpen(false);
        } else {
          toast({
            title: "Error",
            description:
              data.message || "Failed to create volunteering activity",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error saving volunteering activity:", error);
      toast({
        title: "Error",
        description: "Failed to save volunteering activity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getVolunteeringInitial = (activity) => {
    return activity && activity.length > 0 ? activity[0].toUpperCase() : "V";
  };

  const getAvatarColor = (activity) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-yellow-100 text-yellow-600",
      "bg-red-100 text-red-600",
      "bg-indigo-100 text-indigo-600",
      "bg-pink-100 text-pink-600",
      "bg-teal-100 text-teal-600",
    ];

    const index = activity ? activity.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Volunteering Activities</h1>
        <Button
          onClick={handleAddVolunteering}
          className="flex items-center gap-2 rounded-lg px-6"
        >
          <Plus className="h-5 w-5" /> Add volunteering
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
          <ScrollArea className="h-[calc(100vh-150px)] pr-4">
            <div className="space-y-6">

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading volunteering activities...</span>
        </div>
      ) : volunteerings.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <h3 className="text-lg font-medium mb-2">
            No volunteering activities yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Add your first volunteering activity to showcase your community
            involvement
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {volunteerings.map((volunteering) => (
            <div
              key={volunteering.id}
              className="border rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-md flex items-center justify-center text-xl font-semibold ${getAvatarColor(
                    volunteering.activity
                  )}`}
                >
                  {getVolunteeringInitial(volunteering.activity)}
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">
                    {volunteering.activity}
                  </h3>
                  <p className="text-muted-foreground">
                    {volunteering.organization || "Personal Initiative"}
                  </p>

                  <div className="mt-1 text-muted-foreground">
                    {volunteering.startDate &&
                      format(new Date(volunteering.startDate), "MMM yyyy")}{" "}
                    -
                    {volunteering.endDate
                      ? format(new Date(volunteering.endDate), " MMM yyyy")
                      : " Present"}
                    {volunteering.status === "01"
                      ? " · In Progress"
                      : " · Completed"}
                  </div>

                  <p className="mt-4">{volunteering.description}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditVolunteering(volunteering)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(volunteering.id)}
                    disabled={isDeleting}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
          </div>
          </ScrollArea>
        </div>

        <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteVolunteering}
        isLoading={isDeleting}
      />

      <VolunteeringPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleSubmitVolunteering}
        volunteering={currentVolunteering}
      />
    </div>
  );
}
