

"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Building2, Download, Mail, MapPin, Pencil, Plus, Trash2, Loader2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import AddAboutPopup from "../../components/add-about6085"
import AddEducationPopup from "../../components/add-education6086"
import VolunteeringPopup from "../../components/add-volunteering6091"
import WorkExperiencePopup from "../../components/add-work-experience6092"
import ProjectPopup from "../../components/add-project6088"
import AddSkillsPopup from "../../components/add-skills6089"
import { useSession } from "next-auth/react"

export default function ProfilePage() {
  // Toast for notifications
  const { toast } = useToast()
  const {data: session} =useSession()
  console.log(session)

  // State for managing popups - simplified to a single state
  const [popup, setPopup] = useState({
    type: null,
    isOpen: false,
    data: null,
  })

  // Loading states
  const [loading, setLoading] = useState({
    about: false,
    skills: false,
    experiences: false,
    education: false,
    projects: false,
    languages: false,
    volunteering: false,
    social: false,
  })

  // Handlers for popups - optimized to prevent unnecessary re-renders
  const openPopup = (type, item = null) => {
    setPopup({
      type,
      isOpen: true,
      data: item,
    })
  }

  const closePopup = () => {
    setPopup({
      type: null,
      isOpen: false,
      data: null,
    })
  }

  // Individual ID - would typically come from auth context or session
  const individualId = session?.user?.individualId;

  // State for profile data
  const [about, setAbout] = useState(
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries",
  )

  const [skills, setSkills] = useState([])
  const [skillsRecord, setSkillsRecord] = useState(null)
  const [experiences, setExperiences] = useState([])
  const [education, setEducation] = useState([
    {
      id: 1,
      institution: "IIT Delhi",
      degree: "B-Tech",
      field: "Mechanical",
      duration: "2018 - 2022",
      skills: ["Finite Element Analysis", "Programming Skills", "Manufacturing Processes", "Welding"],
    },
  ])

  const [projects, setProjects] = useState([])
  const [languages, setLanguages] = useState([
    {
      id: 1,
      lang: "English",
      level: "Professional working proficiency",
      read: true,
      write: true,
      speak: true,
    },
    {
      id: 2,
      lang: "Hindi",
      level: "Elementary proficiency",
      read: true,
      write: true,
      speak: true,
    },
    {
      id: 3,
      lang: "Tamil",
      level: "Bilingual proficiency",
      read: true,
      write: true,
      speak: true,
    },
  ])

  const [socialMediaLinks, setSocialMediaLinks] = useState([
    {
      id: 1,
      platform: "LinkedIn",
      url: "http://www.linkedin.com/in/jake-jacob-C7995664",
      image: "/image/institutndashboard/dashpage/myprofile/linkedin.svg",
    },
    {
      id: 2,
      platform: "Instagram",
      url: "http://www.instagram.com/in/jake-jacob-qyu5567",
      image: "/image/institutndashboard/dashpage/myprofile/ig.svg",
    },
    {
      id: 3,
      platform: "Facebook",
      url: "http://www.facebook.com/in/jake-jacob-qyu5567",
      image: "/image/institutndashboard/dashpage/myprofile/fb.svg",
    },
  ])

  const [volunteering, setVolunteering] = useState([])
  const [preferences, setPreferences] = useState({
    locations: ["Bangalore", "Bangalore Urban", "Mangalore", "Chennai", "Hyderabad"],
  })

  // Fetch data on component mount
  useEffect(() => {
    fetchSkills()
    fetchProjects()
    fetchExperiences()
    fetchVolunteering()
  }, [])

  // Fetch skills
  const fetchSkills = async () => {
    try {
      setLoading((prev) => ({ ...prev, skills: true }))
      const response = await fetch(`/api/student/v1/hcjBrBT60891AddSkills?HCJ_SKT_Individual_Id=${individualId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch skills")
      }

      const data = await response.json()

      if (data.success && data.skills && data.skills.length > 0) {
        // Get the most recent skills record
        const latestSkillsRecord = data.skills[data.skills.length - 1]
        setSkillsRecord(latestSkillsRecord)
        setSkills(latestSkillsRecord.HCJ_SKT_Skills || [])
      } else {
        // No skills found for this user
        setSkills([])
      }
    } catch (err) {
      console.error("Error fetching skills:", err)
      toast({
        title: "Error",
        description: "Failed to load skills. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, skills: false }))
    }
  }

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }))
      const response = await fetch("/api/student/v1/hcjBrBT60881AddProject")
      const data = await response.json()

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
        }))
        setProjects(transformedProjects)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch projects",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }))
    }
  }

  // Fetch experiences
  const fetchExperiences = async () => {
    try {
      setLoading((prev) => ({ ...prev, experiences: true }))
      const response = await fetch(
        `/api/student/v1/hcjBrBT60921AddWorkExperience?HCJ_JSX_Individual_Id=${individualId}`,
      )
      const data = await response.json()

      if (data.success) {
        // Transform API data to match our frontend structure
        const transformedExperiences = data.experiences.map((exp) => ({
          id: exp._id,
          title: exp.HCJ_JSX_Job_Title,
          company: exp.HCJ_JSX_Company_Name,
          type: exp.HCJ_JSX_Employement_Type,
          duration: `${new Date(exp.HCJ_JSX_Start_Date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })} - ${
            exp.HCJ_JSX_Currently_Working
              ? "Present"
              : new Date(exp.HCJ_JSX_End_Date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
          }`,
          location: `${exp.HCJ_JSX_City}, ${exp.HCJ_JSX_State}, ${exp.HCJ_JSX_Country}`,
          originalData: exp,
        }))
        setExperiences(transformedExperiences)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch experiences",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching experiences:", error)
      toast({
        title: "Error",
        description: "Failed to fetch experiences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, experiences: false }))
    }
  }

  // Fetch volunteering activities
  const fetchVolunteering = async () => {
    try {
      setLoading((prev) => ({ ...prev, volunteering: true }))
      const response = await fetch(`/api/student/v1/hcjBrBT60911AddVolenteering?HCJ_JSV_Individual_Id=${individualId}`)
      const data = await response.json()

      if (data.success) {
        // Transform API data to match our frontend structure
        const transformedVolunteering = data.activities.map((activity) => ({
          id: activity._id,
          activity: activity.HCJ_JSV_VolunteerActivity_Name,
          organization: activity.HCJ_JSV_Company_Name,
          startDate: activity.HCJ_JSV_Start_Date,
          endDate: activity.HCJ_JSV_End_Date,
          status: activity.HCJ_JSV_VolunteerActivity_Status,
          description: activity.HCJ_JSV_VolunteerActivity_Description,
          originalData: activity,
        }))
        setVolunteering(transformedVolunteering)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch volunteering activities",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching volunteering activities:", error)
      toast({
        title: "Error",
        description: "Failed to fetch volunteering activities. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, volunteering: false }))
    }
  }

  // Generic update handler - optimized to use popup.type
  const handleUpdate = async (data) => {
    switch (popup.type) {
      case "about":
        setAbout(data)
        break
      case "skills":
        await handleUpdateSkills(data)
        break
      case "experience":
        await handleUpdateExperience(data)
        break
      case "education":
        if (popup.data) {
          setEducation(education.map((edu) => (edu.id === popup.data.id ? { ...edu, ...data } : edu)))
        } else {
          setEducation([...education, { id: Date.now(), ...data }])
        }
        break
      case "projects":
        await handleUpdateProject(data)
        break
      case "languages":
        if (popup.data) {
          setLanguages(languages.map((lang) => (lang.id === popup.data.id ? { ...lang, ...data } : lang)))
        } else {
          setLanguages([...languages, { id: Date.now(), ...data }])
        }
        break
      case "social":
        if (popup.data) {
          setSocialMediaLinks(socialMediaLinks.map((link) => (link.id === popup.data.id ? { ...link, ...data } : link)))
        } else {
          setSocialMediaLinks([...socialMediaLinks, { id: Date.now(), ...data }])
        }
        break
      case "volunteering":
        await handleUpdateVolunteering(data)
        break
      case "preferences":
        setPreferences({ ...preferences, ...data })
        break
      default:
        break
    }
    closePopup()
  }

  // Handle skills update
  const handleUpdateSkills = async (updatedSkills) => {
    try {
      setLoading((prev) => ({ ...prev, skills: true }))

      let response
      if (skillsRecord) {
        // Update existing skills
        response = await fetch(`/api/student/v1/hcjBrBT60891AddSkills/${skillsRecord._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            HCJ_SKT_Skills: updatedSkills,
            HCJ_SKT_Industry: skillsRecord.HCJ_SKT_Industry || "General",
            HCJ_SKT_Session_Id: skillsRecord.HCJ_SKT_Session_Id || `session_${Date.now()}`,
          }),
        })
      } else {
        // Create new skills
        response = await fetch("/api/student/v1/hcjBrBT60891AddSkills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            HCJ_SKT_Individual_Id: individualId,
            HCJ_SKT_Industry: "General",
            HCJ_SKT_Skills: updatedSkills,
            HCJ_SKT_Session_Id: `session_${Date.now()}`,
          }),
        })
      }

      if (!response.ok) {
        throw new Error("Failed to save skills")
      }

      const data = await response.json()

      if (data.success) {
        // Update skills in state
        setSkills(updatedSkills)
        toast({
          title: "Success",
          description: "Skills updated successfully",
        })
      } else {
        throw new Error(data.message || "Failed to update skills")
      }
    } catch (error) {
      console.error("Error updating skills:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update skills",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, skills: false }))
    }
  }

  // Handle experience update
  const handleUpdateExperience = async (formData) => {
    try {
      setLoading((prev) => ({ ...prev, experiences: true }))

      const apiData = {
        HCJ_JSX_Job_Seeker_Id: "65d7adfdc9f2a839aafe7777", // Replace with dynamic value
        HCJ_JSX_Individual_Id: individualId,
        HCJ_JSX_Company_Name: formData.companyName,
        HCJ_JSX_Job_Title: formData.jobTitle,
        HCJ_JSX_Start_Date: formData.startDate,
        HCJ_JSX_End_Date: formData.currentlyWorking ? null : formData.endDate,
        HCJ_JSX_Currently_Working: formData.currentlyWorking,
        HCJ_JSX_Job_Description: formData.description || "",
        HCJ_JSX_Country: formData.country,
        HCJ_JSX_State: formData.state || "State",
        HCJ_JSX_City: formData.city,
        HCJ_JSX_Work_Mode: formData.workmode,
        HCJ_JSX_Employement_Type: formData.employmentType,
        HCJ_JSX_Updated_By: "user@example.com", // Replace with dynamic value
        HCJ_JSX_Session_Id: "SESSION123456", // Replace with dynamic value
      }

      let response
      if (popup.data) {
        // Update existing experience
        response = await fetch(`/api/student/v1/hcjBrBT60921AddWorkExperience/${popup.data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        })
      } else {
        // Create new experience
        response = await fetch("/api/student/v1/hcjBrBT60921AddWorkExperience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: popup.data ? "Experience updated successfully" : "Experience added successfully",
        })
        // Refresh experiences
        fetchExperiences()
      } else {
        throw new Error(data.message || "Failed to update experience")
      }
    } catch (error) {
      console.error("Error updating experience:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update experience",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, experiences: false }))
    }
  }

  // Handle project update
  const handleUpdateProject = async (formData) => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }))

      const apiData = {
        HCJ_JSP_Job_Seeker_Id: "64c2d76c9bdf5c44f8c44e1e", // Replace with dynamic value
        HCJ_JSP_Individual_Id: individualId,
        HCJ_JSP_Project_Name: formData.title,
        HCJ_JSP_Company_Name: formData.company,
        HCJ_JSP_Start_Date: formData.startDate,
        HCJ_JSP_End_Date: formData.endDate,
        HCJ_JSP_Project_Status: formData.status,
        HCJ_JSP_Project_Description: formData.description,
        HCJ_JSP_Session_Id: "session123", // Replace with dynamic value
      }

      let response
      if (popup.data) {
        // Update existing project
        response = await fetch(`/api/student/v1/hcjBrBT60881AddProject/${popup.data.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        })
      } else {
        // Create new project
        response = await fetch("/api/student/v1/hcjBrBT60881AddProject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: popup.data ? "Project updated successfully" : "Project added successfully",
        })
        // Refresh projects
        fetchProjects()
      } else {
        throw new Error(data.message || "Failed to update project")
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }))
    }
  }

  // Handle volunteering update
  const handleUpdateVolunteering = async (formData) => {
    try {
      setLoading((prev) => ({ ...prev, volunteering: true }))

      const apiData = {
        HCJ_JSV_Job_Seeker_Id: "65d7adfdc9f2a839aafe7777", // Replace with dynamic value
        HCJ_JSV_Individual_Id: individualId,
        HCJ_JSV_VolunteerActivity_Name: formData.activity,
        HCJ_JSV_Company_Name: formData.organization,
        HCJ_JSV_Start_Date: formData.startDate,
        HCJ_JSV_End_Date: formData.endDate,
        HCJ_JSV_VolunteerActivity_Status: formData.status,
        HCJ_JSV_VolunteerActivity_Description: formData.description,
        HCJ_JSV_Session_Id: "SESSION123456", // Replace with dynamic value
      }

      let response
      if (popup.data) {
        // Update existing volunteering activity
        response = await fetch(`/api/student/v1/hcjBrBT60911AddVolenteering/${popup.data.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        })
      } else {
        // Create new volunteering activity
        response = await fetch("/api/student/v1/hcjBrBT60911AddVolenteering", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: popup.data
            ? "Volunteering activity updated successfully"
            : "Volunteering activity added successfully",
        })
        // Refresh volunteering activities
        fetchVolunteering()
      } else {
        throw new Error(data.message || "Failed to update volunteering activity")
      }
    } catch (error) {
      console.error("Error updating volunteering activity:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update volunteering activity",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, volunteering: false }))
    }
  }

  // Handle delete experience
  const handleDeleteExperience = async (id) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      try {
        setLoading((prev) => ({ ...prev, experiences: true }))

        const response = await fetch(`/api/student/v1/hcjBrBT60921AddWorkExperience/${id}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Success",
            description: "Experience deleted successfully",
          })
          // Remove the deleted experience from state
          setExperiences(experiences.filter((exp) => exp.id !== id))
        } else {
          throw new Error(data.message || "Failed to delete experience")
        }
      } catch (error) {
        console.error("Error deleting experience:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to delete experience",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, experiences: false }))
      }
    }
  }

  // Handle delete project
  const handleDeleteProject = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        setLoading((prev) => ({ ...prev, projects: true }))

        const response = await fetch(`/api/student/v1/hcjBrBT60881AddProject/${id}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Success",
            description: "Project deleted successfully",
          })
          // Remove the deleted project from state
          setProjects(projects.filter((project) => project.id !== id))
        } else {
          throw new Error(data.message || "Failed to delete project")
        }
      } catch (error) {
        console.error("Error deleting project:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to delete project",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, projects: false }))
      }
    }
  }

  // Handle delete volunteering
  const handleDeleteVolunteering = async (id) => {
    if (confirm("Are you sure you want to delete this volunteering activity?")) {
      try {
        setLoading((prev) => ({ ...prev, volunteering: true }))

        const response = await fetch(`/api/student/v1/hcjBrBT60911AddVolenteering/${id}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Success",
            description: "Volunteering activity deleted successfully",
          })
          // Remove the deleted volunteering activity from state
          setVolunteering(volunteering.filter((vol) => vol.id !== id))
        } else {
          throw new Error(data.message || "Failed to delete volunteering activity")
        }
      } catch (error) {
        console.error("Error deleting volunteering activity:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to delete volunteering activity",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, volunteering: false }))
      }
    }
  }

  // Map popup types to their corresponding components
  const popupComponents = {
    about: (
      <AddAboutPopup isOpen={popup.type === "about"} onClose={closePopup} onSubmit={handleUpdate} initialData={about} />
    ),
    skills: (
      <AddSkillsPopup
        isOpen={popup.type === "skills"}
        onClose={closePopup}
        onSave={handleUpdate}
        selectedSkills={skills}
      />
    ),
    experience: (
      <WorkExperiencePopup
        isOpen={popup.type === "experience"}
        onClose={closePopup}
        onSubmit={handleUpdate}
        experience={popup.data ? popup.data.originalData : null}
      />
    ),
    education: (
      <AddEducationPopup
        isOpen={popup.type === "education"}
        onClose={closePopup}
        onSubmit={handleUpdate}
        education={popup.data}
      />
    ),
    projects: (
      <ProjectPopup
        isOpen={popup.type === "projects"}
        onClose={closePopup}
        onSubmit={handleUpdate}
        project={popup.data}
      />
    ),

    volunteering: (
      <VolunteeringPopup
        isOpen={popup.type === "volunteering"}
        onClose={closePopup}
        onSubmit={handleUpdate}
        activity={popup.data}
      />
    ),
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors mb-10">
      {/* Cover Photo Section */}
      <div className="relative h-[150px] sm:h-[180px] md:h-[200px] w-full bg-gray-200 dark:bg-gray-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <Button variant="outline" className="text-sm sm:text-base dark:bg-gray-800 dark:text-gray-100">
            <Plus className="mr-2 h-4 w-4" />
            Add cover photo
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16">
          {/* Profile Picture */}
          <Image
            src="/image/institutndashboard/dashpage/myprofile/profile.svg"
            alt="Profile picture"
            width={128}
            height={128}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-32 md:h-32 rounded-lg border-4 border-white shadow-lg dark:border-gray-800"
          />

          {/* Info and Buttons Container - positioned below profile picture */}
          <div className="flex flex-col sm:flex-row justify-between items-start w-full mt-4 gap-4 sm:gap-0">
            {/* Name and Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold dark:text-white">John Jacob</h1>
              <p className="text-gray-600 dark:text-gray-300">UIUX Designer</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Last Profile Update: 13-10-2024</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full sm:w-auto justify-end">
            <Link href="/stdnt-public-prfl-6080">
                <Button className="bg-green-500 hover:bg-green-600 hover:text-gray-100 text-sm sm:text-base dark:bg-green-600 dark:hover:bg-green-700">
                  View profile
                </Button>
              </Link>
              <Link href="/stdnt-dshbrd6071/my-prfl-edit6079">
                <Button
                  variant="outline"
                  className="bg-primary text-sm sm:text-base text-white"
                >
                  Edit profile
                </Button>
              </Link>
            
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base dark:text-gray-300">Bangalore, Karnataka</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base dark:text-gray-300">+917788802020</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base dark:text-gray-300">IIT Delhi</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base break-all dark:text-gray-300">Jakejacob@gmail.com</span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-3 mt-10">
            <Image
              src="/image/institutndashboard/dashpage/myprofile/language.svg"
              alt="Language"
              width={24}
              height={24}
              className="mr-2"
            />
            <h4 className="text-lg font-semibold">Language</h4>
          </div>
          <div>
            <ul className="pl-5 list-none">
              <li className="mb-3">
                <div className="text-base font-medium">English</div>
                <div className="text-sm text-gray-500">Fluent</div>
                <div className="text-xs text-gray-400 mt-1">Reading Writing Speaking</div>
              </li>
              <li className="mb-3">
                <div className="text-base font-medium">Hindi</div>
                <div className="text-sm text-gray-500">Native</div>
                <div className="text-xs text-gray-400 mt-1">Reading Writing Speaking</div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start mb-3 mt-10">
          <div className="flex gap-2">
            {/* LinkedIn */}
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/linkedin.svg"
                alt="LinkedIn"
                width={24}
                height={24}
                className="mr-2 cursor-pointer"
              />
            </a>

            {/* Facebook */}
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/fb.svg"
                alt="Facebook"
                width={24}
                height={24}
                className="mr-2 cursor-pointer"
              />
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/ig.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="mr-2 cursor-pointer"
              />
            </a>

            {/* Portfolio */}
            <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/four.svg"
                alt="Portfolio"
                width={24}
                height={24}
                className="mr-2 cursor-pointer"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Skills and other sections */}
      <div className="mt-8 grid gap-6 px-4 lg:px-8 max-w-6xl mx-auto grid-cols-1">
        {/* About */}
        <Card id="about" className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg sm:text-xl dark:text-white">About</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => openPopup("about")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-300">{about}</CardContent>
        </Card>

        {/* Skills */}
        <Card id="skills" className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg sm:text-xl dark:text-white">Skills</CardTitle>
            <Button className="bg-primary hover:bg-primary/90 text-white" size="sm" onClick={() => openPopup("skills")}>
              {skillsRecord ? (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Skills
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skills
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {loading.skills ? (
              <div className="w-full flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading skills...</span>
              </div>
            ) : skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  No skills added yet. Click the button above to add your skills.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card id="experience" className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl dark:text-white">Work Experience</CardTitle>
            <Button
              className="w-full sm:w-auto text-sm bg-primary hover:bg-primary/90 text-white"
              onClick={() => openPopup("experience")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add work experience
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading.experiences ? (
              <div className="w-full flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading experiences...</span>
              </div>
            ) : experiences.length > 0 ? (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-all hover:shadow-md border border-gray-100 dark:border-gray-600"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center dark:text-blue-100 text-xl font-semibold">
                      {exp.company.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-semibold text-lg dark:text-white">{exp.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-gray-100 dark:hover:bg-gray-600 h-8 w-8 p-0"
                            onClick={() => openPopup("experience", exp)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 h-8 w-8 p-0"
                            onClick={() => handleDeleteExperience(exp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{exp.company}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <p className="text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                          {exp.duration}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                          {exp.location}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                          {exp.type}
                        </p>
                      </div>
                      {exp.originalData?.HCJ_JSX_Job_Description && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {exp.originalData.HCJ_JSX_Job_Description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  No work experience added yet. Click the button above to add your work experience.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card id="education" className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl dark:text-white">Education</CardTitle>
            <Button
              className="w-full sm:w-auto text-sm bg-primary hover:bg-primary/90 text-white"
              onClick={() => openPopup("education")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {education.length > 0 ? (
              education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-all hover:shadow-md border border-gray-100 dark:border-gray-600"
                >
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-semibold text-lg dark:text-white">{edu.institution}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-gray-100 dark:hover:bg-gray-600 h-8 w-8 p-0"
                          onClick={() => openPopup("education", edu)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 h-8 w-8 p-0"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this education?")) {
                              setEducation(education.filter((e) => e.id !== edu.id))
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      {edu.degree}, {edu.field}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{edu.duration}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {edu.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-gray-100/50 dark:bg-gray-800/50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  No education details added yet. Click the button above to add your education.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects */}
        <Card id="project" className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl dark:text-white">Projects</CardTitle>
            <Button
              onClick={() => openPopup("projects")}
              className="w-full sm:w-auto text-sm bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add new project
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading.projects ? (
              <div className="w-full flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading projects...</span>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {projects.map((project) => {
                  // Function to get a random background color for the avatar
                  const getAvatarColor = () => {
                    const colors = [
                      "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200",
                      "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200",
                      "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200",
                      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200",
                      "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200",
                      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200",
                      "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-200",
                      "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-200",
                    ]

                    // Use the first character of the title to determine the color
                    const index = project.title ? project.title.charCodeAt(0) % colors.length : 0
                    return colors[index]
                  }

                  return (
                    <div
                      key={project.id}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-all hover:shadow-md border border-gray-100 dark:border-gray-600 flex flex-col h-full"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center text-lg font-semibold ${getAvatarColor()}`}
                        >
                          {project.title.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg dark:text-white line-clamp-1">{project.title}</h3>
                            <div className="flex gap-1 ml-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-gray-100 dark:hover:bg-gray-600 h-7 w-7 p-0"
                                onClick={() => openPopup("projects", project)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 h-7 w-7 p-0"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                            {project.company || "Personal Project"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-gray-100/50 dark:bg-gray-800/50">
                          {project.status === "01" ? "In Progress" : "Completed"}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}{" "}
                          - {new Date(project.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">
                        {project.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  No projects added yet. Click the button above to add your projects.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Volunteering Activities */}
        <Card id="volenteering" className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl dark:text-white">Volunteering Activities</CardTitle>
            <Button
              onClick={() => openPopup("volunteering")}
              className="w-full sm:w-auto text-sm bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add activity
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading.volunteering ? (
              <div className="w-full flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading volunteering activities...</span>
              </div>
            ) : volunteering.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {volunteering.map((activity) => {
                  // Function to get a random background color for the avatar
                  const getAvatarColor = () => {
                    const colors = [
                      "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200",
                      "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200",
                      "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200",
                      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200",
                      "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200",
                      "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-200",
                    ]

                    // Use the first character of the activity name to determine the color
                    const index = activity.activity ? activity.activity.charCodeAt(0) % colors.length : 0
                    return colors[index]
                  }

                  return (
                    <div
                      key={activity.id}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-all hover:shadow-md border border-gray-100 dark:border-gray-600 flex flex-col h-full"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center text-lg font-semibold ${getAvatarColor()}`}
                        >
                          {activity.activity.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg dark:text-white line-clamp-1">{activity.activity}</h3>
                            <div className="flex gap-1 ml-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-gray-100 dark:hover:bg-gray-600 h-7 w-7 p-0"
                                onClick={() => openPopup("volunteering", activity)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 h-7 w-7 p-0"
                                onClick={() => handleDeleteVolunteering(activity.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                            {activity.organization || "Personal Initiative"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-gray-100/50 dark:bg-gray-800/50">
                          {activity.status === "01" ? "In Progress" : "Completed"}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(activity.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(activity.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">
                        {activity.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  No volunteering activities added yet. Click the button above to add your volunteering activities.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Preferences */}
        <Card id="location" className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg sm:text-xl dark:text-white">Location Preferences</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => openPopup("preferences")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {preferences.locations.map((location) => (
              <Badge key={location} variant="outline" className="px-3 py-1 text-sm">
                {location}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* Resume */}
        <Card id="resume" className="dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl dark:text-white">Resume</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 dark:border-gray-600 transition-all hover:border-gray-400 dark:hover:border-gray-500">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                      <Download className="h-5 w-5 dark:text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base dark:text-white">Jake Jacob cv_2024.pdf</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Last update on 13-10-2024</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Replace all the popup components at the bottom with this single line */}
      {popup.type && popupComponents[popup.type]}
    </div>
  )
}




