"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import ProjectPopup from "../../components/add-project6088";
import { useSession } from "next-auth/react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-alert";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  //  console.log(session)

  // ... existing state declarations ...
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Fetch all projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/student/v1/hcjBrBT60881AddProject");
      const data = await response.json();

      if (data.success) {
        // Transform API data to match our frontend structure
        const transformedProjects = data.projects.map((project) => ({
          id: project._id,
          title: project.HCJ_JSP_Project_Name,
          company: project.HCJ_JSP_Company_Name,
          startDate: project.HCJ_JSP_Start_Date,
          endDate: project.HCJ_JSP_End_Date,
          status: project.HCJ_JSP_Project_Status,
          description: project.HCJ_JSP_Project_Description,
          // Keep original data for reference if needed
          originalData: project,
        }));
        setProjects(transformedProjects);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch projects",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = () => {
    setCurrentProject(null);
    setIsPopupOpen(true);
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setIsPopupOpen(true);
  };

  const handleDeleteClick = (id) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/student/v1/hcjBrBT60881AddProject/${projectToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        setProjects(
          projects.filter((project) => project.id !== projectToDelete)
        );
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleSubmitProject = async (formData) => {
    // Transform frontend data to match API structure
    const apiData = {
      HCJ_JSP_Job_Seeker_Id: "64c2d76c9bdf5c44f8c44e1e", // You might want to make this dynamic
      HCJ_JSP_Individual_Id: "64c2d76c9bdf5c44f8c44e1e", // You might want to make this dynamic
      HCJ_JSP_Project_Name: formData.title,
      HCJ_JSP_Company_Name: formData.company,
      HCJ_JSP_Start_Date: formData.startDate,
      HCJ_JSP_End_Date: formData.endDate,
      HCJ_JSP_Project_Status: formData.status,
      HCJ_JSP_Project_Description: formData.description,
      HCJ_JSP_Session_Id: "session123", // You might want to make this dynamic
    };

    try {
      if (currentProject) {
        // Update existing project
        const response = await fetch(
          `/api/student/v1/hcjBrBT60881AddProject/${currentProject.id}`,
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
            description: "Project updated successfully",
          });
          // Update the project in state
          setProjects(
            projects.map((project) =>
              project.id === currentProject.id
                ? {
                    ...project,
                    title: formData.title,
                    company: formData.company,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    status: formData.status,
                    description: formData.description,
                  }
                : project
            )
          );
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to update project",
            variant: "destructive",
          });
        }
      } else {
        // Create new project
        const response = await fetch("/api/student/v1/hcjBrBT60881AddProject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        });
        const data = await response.json();

        if (data.success) {
          toast({
            title: "Success",
            description: "Project created successfully",
          });
          // Refresh projects to get the new one
          fetchProjects();
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to create project",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to get the first letter of the project title for the avatar
  const getProjectInitial = (title) => {
    return title && title.length > 0 ? title[0].toUpperCase() : "P";
  };

  // Function to get a random background color for the avatar
  const getAvatarColor = (title) => {
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

    // Use the first character of the title to determine the color
    const index = title ? title.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button
          onClick={handleAddProject}
          className="flex items-center gap-2 rounded-lg px-6"
        >
          <Plus className="h-5 w-5" /> Add project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first project to showcase your work
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar with project initial */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-md flex items-center justify-center text-xl font-semibold ${getAvatarColor(
                    project.title
                  )}`}
                >
                  {getProjectInitial(project.title)}
                </div>

                <div className="flex-grow">
                  {/* Project title and company */}
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-muted-foreground">
                    {project.company || "Personal Project"}
                  </p>

                  {/* Date range and status */}
                  <div className="mt-1 text-muted-foreground">
                    {project.startDate &&
                      format(new Date(project.startDate), "MMM yyyy")}{" "}
                    -
                    {project.endDate
                      ? format(new Date(project.endDate), " MMM yyyy")
                      : " Present"}
                    {project.status === "01"
                      ? " · In Progress"
                      : " · Completed"}
                  </div>

                  {/* Project description */}
                  <p className="mt-4">{project.description}</p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(project.id)}
                    disabled={isDeleting}
                    className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteProject}
        isLoading={isDeleting}
      />

      <ProjectPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleSubmitProject}
        project={currentProject}
      />
    </div>
  );
}
