"use client"

import { getUserById } from "@/app/utils/indexDB"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "@/i18n/routing"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import AddressDetails from "./addrss-dtls/page"
import PersonalDetails from "./prsnl-dtls/page"
import SocialLinks from "./socl-lnks/page"

export default function Page() {
  const [activeTab, setActiveTab] = useState("personal")
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    personal: null,
    address: null,
    social: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: session, update } = useSession()
  const router = useRouter()

  // Function to check if an object has CCP_ prefixed fields
  const hasCCPFields = (obj) => {
    return obj && typeof obj === "object" && Object.keys(obj).some((key) => key.startsWith("CCP_"))
  }

  // Function to map CCP data to form structure
  const mapCCPDataToFormStructure = (ccpData) => {
    // Map personal data
    const personal = {
      firstName: ccpData.CCP_Contact_Person_First_Name || "",
      lastName: ccpData.CCP_Contact_Person_Last_Name || "",
      corporateEmail: ccpData.CCP_Contact_Person_Email || "",
      alternateEmail: ccpData.CCP_Contact_Person_Alternate_Email || "",
      phone: ccpData.CCP_Contact_Person_Phone || "",
      alternatePhone: ccpData.CCP_Contact_Person_Alternate_Phone || "",
      designation: ccpData.CCP_Contact_Person_Designation || "",
      profileHeadline: "", // Not available in token
      gender: ccpData.CCP_Contact_Person_Gender || "",
      dob: ccpData.CCP_Contact_Person_DOB ? new Date(ccpData.CCP_Contact_Person_DOB).toISOString().split("T")[0] : "",
      department: ccpData.CCP_Contact_Person_Department || "",
    }

    // Map address data
    const address = {
      addressLine1: ccpData.CCP_Contact_Person_Address_Line1 || "",
      addressLine2: "", // Not available in token
      landmark: "", // Not available in token
      country: ccpData.CCP_Contact_Person_Country || "India",
      pincode: ccpData.CCP_Contact_Person_Pincode || "",
      state: ccpData.CCP_Contact_Person_State || "",
      city: ccpData.CCP_Contact_Person_City || "",
    }

    // Initialize social data as empty array
    const social = []

    return { personal, address, social }
  }

  // Load data from localStorage first
  useEffect(() => {
    const savedData = localStorage.getItem("formData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
        updateProgress(parsedData)
      } catch (error) {
        console.error("Error parsing saved form data:", error)
      }
    }
  }, [])

  // Check for CCP data in session or directly in formData
  useEffect(() => {
    // If formData already has CCP fields, map it to the correct structure
    if (hasCCPFields(formData)) {
      console.log("Found CCP data in formData, mapping to form structure")
      const mappedData = mapCCPDataToFormStructure(formData)
      setFormData(mappedData)
      updateProgress(mappedData)
      return
    }

    // Check if session has token data
    if (session?.user?.token && hasCCPFields(session.user.token)) {
      console.log("Found CCP data in session token, mapping to form structure")
      const mappedData = mapCCPDataToFormStructure(session.user.token)
      setFormData(mappedData)
      updateProgress(mappedData)
      return
    }

    // Check if session itself has CCP fields
    if (session && hasCCPFields(session)) {
      console.log("Found CCP data in session, mapping to form structure")
      const mappedData = mapCCPDataToFormStructure(session)
      setFormData(mappedData)
      updateProgress(mappedData)
      return
    }

    // Check if session.user has CCP fields
    if (session?.user && hasCCPFields(session.user)) {
      console.log("Found CCP data in session.user, mapping to form structure")
      const mappedData = mapCCPDataToFormStructure(session.user)
      setFormData(mappedData)
      updateProgress(mappedData)
      return
    }

    // If no CCP data found, try to get from IndexDB
    const tempId = localStorage.getItem("temp_team_member_id")
    if (tempId) {
      getUserById(tempId)
        .then((data) => {
          if (data) {
            // Check if IndexDB data has CCP fields
            if (hasCCPFields(data)) {
              console.log("Found CCP data in IndexDB, mapping to form structure")
              const mappedData = mapCCPDataToFormStructure(data)
              setFormData(mappedData)
              updateProgress(mappedData)
            } else {
              // Data is already in the correct structure
              setFormData(data)
              updateProgress(data)
            }
          }
          console.log("data from IndexDB:", data)
        })
        .catch((err) => console.error("Error fetching user:", err))
        .finally(() => setIsSubmitting(false))
    } else {
      setIsSubmitting(false)
    }
  }, [session])

  console.log("formData", formData)
  const updateProgress = (data) => {
    const steps = ["personal", "address", "social"]
    const completedSteps = steps.filter((step) => data[step] !== null).length
    setProgress((completedSteps / steps.length) * 100)
  }

  const updateFormData = (step, data) => {
    setFormData((prev) => {
      // For social step, data is already an array of profiles
      const newFormData = { ...prev, [step]: data }
      localStorage.setItem("formData", JSON.stringify(newFormData))
      updateProgress(newFormData)
      return newFormData
    })
  }

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "address", label: "Address Details" },
    { id: "social", label: "Social Links" },
  ]

  const canNavigateToTab = (tabId) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
    return tabs.slice(0, tabIndex).every((tab) => formData[tab.id] !== null)
  }

  const handleSubmitProfile = async () => {
    if (!formData.personal || !formData.address) {
      toast({
        title: "Missing information",
        description: "Please complete all required sections before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData object for multipart/form-data submission
      const submitData = new FormData()

      // Add personal details
      submitData.append("ID_User_Id", session.user.id)
      submitData.append("ID_First_Name", formData.personal.firstName)
      submitData.append("ID_Last_Name", formData.personal.lastName)
      submitData.append("ID_Phone", formData.personal.phone)
      submitData.append("ID_Email", formData.personal.corporateEmail)
      submitData.append("ID_Gender", formData.personal.gender || "Not Specified")
      submitData.append("ID_DOB", formData.personal.dob || "")

      if (formData.personal.designation) {
        submitData.append("ID_Individual_Designation", formData.personal.designation)
      }

      if (formData.personal.profileHeadline) {
        submitData.append("ID_Profile_Headline", formData.personal.profileHeadline)
      }

      // Add profile picture if available
      if (formData.personal.photo instanceof File) {
        submitData.append("ID_Profile_Picture", formData.personal.photo)
      }

      // Add address details
      submitData.append("IAD_Address_Line1", formData.address.addressLine1)
      submitData.append("IAD_City", formData.address.city)
      submitData.append("IAD_State", formData.address.state)
      submitData.append("IAD_Country", formData.address.country)
      submitData.append("IAD_Pincode", formData.address.pincode)

      if (formData.address.addressLine2) {
        submitData.append("IAD_Address_Line2", formData.address.addressLine2)
      }

      if (formData.address.landmark) {
        submitData.append("IAD_Landmark", formData.address.landmark)
      }

      const profileObject = formData.social.reduce((acc, item) => {
        acc[item.platform] = item.url // Set key as platform, value as URL
        return acc
      }, {})

      // Add social links if available
      if (Array.isArray(formData.social) && formData.social.length > 0) {
        submitData.append("SL_Social_Profile_Name", "social Data")
        Object.keys(profileObject).forEach((key) => {
          submitData.append(key, profileObject[key])
        })
      }

      // Submit to API
      const response = await fetch("/api/institution/v1/hcjBrBT60241CreateAdminProfile", {
        method: "POST",
        body: submitData,
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success!",
          description: "Your profile has been created successfully.",
        })

        // Clear local storage after successful submission
        localStorage.removeItem("formData")

        // Optional: redirect to dashboard or another page

        // Setting Individual_id in the session
        update({
          ...session,
          user: { ...session.user, individualId: result.individualId },
        })
        router.push("/admin-dcmnt6027")
      } else {
        throw new Error(result.message || "Failed to create profile")
      }
    } catch (error) {
      console.error("Error submitting profile:", error)
      toast({
        title: "Error",
        description: error.message || "There was a problem creating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            {/* <Button variant="link" className="text-primary">
              Skip for now <ChevronRight className="ml-1 h-4 w-4" />
            </Button> */}
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={!canNavigateToTab(tab.id)}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-base"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="personal">
              <PersonalDetails
                onSubmit={(data) => {
                  updateFormData("personal", data)
                  setActiveTab("address")
                }}
                initialData={formData.personal}
                isSubmitting={false}
              />
            </TabsContent>

            <TabsContent value="address">
              <AddressDetails
                onSubmit={(data) => {
                  updateFormData("address", data)
                  setActiveTab("social")
                }}
                onBack={() => setActiveTab("personal")}
                initialData={formData.address}
                isSubmitting={false}
              />
            </TabsContent>

            <TabsContent value="social">
              <SocialLinks
                onSubmit={(data) => {
                  updateFormData("social", data)
                  handleSubmitProfile()
                }}
                onBack={() => setActiveTab("address")}
                initialData={formData.social}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

