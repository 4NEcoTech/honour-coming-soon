// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { toast } from "@/hooks/use-toast"
// import { useRouter } from "@/i18n/routing"
// import { useSession } from "next-auth/react"
// import { useEffect, useState } from "react"
// import AddressDetailsTab from "./addrss-dtls6029/page"
// import EducationalDetailsTab from "./edu-dtls6028/page"
// import SocialLinksTab from "./socl-lnkss6030/page"

// export default function Page() {
//   const [activeTab, setActiveTab] = useState("educationalDetails")
//   const [progress, setProgress] = useState(0)
//   const [formData, setFormData] = useState({
//     educationalDetails: null,
//     addressDetails: null,
//     socialIcons: null,
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const { data: session, update } = useSession()
//   const router = useRouter()

//   // Load saved form data from localStorage
//   useEffect(() => {
//     const savedData = localStorage.getItem("institutionProfileData")
//     if (savedData) {
//       try {
//         const parsedData = JSON.parse(savedData)
//         setFormData(parsedData)
//         updateProgress(parsedData)
//       } catch (error) {
//         console.error("Error parsing saved form data:", error)
//       }
//     }
//   }, [])

//   // Update progress based on completed steps
//   const updateProgress = (data) => {
//     const steps = ["educationalDetails", "addressDetails", "socialIcons"]
//     const completedSteps = steps.filter(step => data[step] !== null).length
//     setProgress((completedSteps / steps.length) * 100)
//   }

//   // Update form data and save to localStorage
//   const updateFormData = (step, data) => {
//     setFormData(prev => {
//       const newFormData = { ...prev, [step]: data }
//       localStorage.setItem("institutionProfileData", JSON.stringify(newFormData))
//       updateProgress(newFormData)
//       return newFormData
//     })
//   }

//   // Tab configuration
//   const tabs = [
//     { id: "educationalDetails", label: "Institution Details" },
//     { id: "addressDetails", label: "Address" },
//     { id: "socialIcons", label: "Social Links" },
//   ]

//   // Check if user can navigate to a specific tab
//   const canNavigateToTab = (tabId) => {
//     const tabIndex = tabs.findIndex(tab => tab.id === tabId)
//     return tabs.slice(0, tabIndex).every(tab => formData[tab.id] !== null)
//   }

//   // Validate and submit the profile
//   const handleSubmitProfile = async () => {
//     if (!formData.educationalDetails || !formData.addressDetails) {
//       toast({
//         title: "Missing information",
//         description: "Please complete all required sections before submitting.",
//         variant: "destructive",
//       })
//       return
//     }

//     // Check if socialIcons exists and is valid
//     // if (!Array.isArray(formData.socialIcons) || formData.socialIcons.length === 0) {
//     //   toast({
//     //     title: "Missing Social Links",
//     //     description: "Please add at least one social profile before submitting.",
//     //     variant: "destructive",
//     //   })
//     //   return
//     // }

//     // If all validations pass, proceed with submission
//     submitProfile(formData)
//   }

//   const submitProfile = async (latestFormData) => {
//     setIsSubmitting(true)

//     try {
//       // Prepare submission data
//       const submissionData = {
//         // Institution details
//         CD_User_Id: session.user.individualId,
//         CD_Company_Name: formData.educationalDetails.institutionName,
//         CD_Company_Type: formData.educationalDetails.institutionType,
//         CD_Company_Establishment_Year: formData.educationalDetails.establishmentYear,
//         CD_Company_Email: formData.educationalDetails.institutionEmail,
//         CD_Company_Alternate_Email: formData.educationalDetails.alternateEmail,
//         CD_Phone_Number: formData.educationalDetails.phoneNumber,
//         CD_Alternate_Phone_Number: formData.educationalDetails.alternatePhoneNumber,
//         CD_Company_Website: formData.educationalDetails.websiteUrl || "",
//         CD_Company_Logo: formData.educationalDetails.logoUrl || "",
//         CD_Company_About: formData.educationalDetails.about || "Tell us about your institution!",
//         CD_Company_Mission: formData.educationalDetails.mission || "Tell us about your institution mission!",


//         // Address details
//         CAD_Address_Line1: formData.addressDetails.addressLine1,
//         CAD_Address_Line2: formData.addressDetails.addressLine2 || "",
//         CAD_Landmark: formData.addressDetails.landmark || "",
//         CAD_City: formData.addressDetails.city,
//         CAD_State: formData.addressDetails.state,
//         CAD_Country: formData.addressDetails.country,
//         CAD_Pincode: formData.addressDetails.pincode,

//         // Social links
//         SL_Social_Profile_Name: formData.educationalDetails.institutionName,
//         ...(formData.socialIcons?.reduce((acc, item) => {
//           if (item?.platform && item?.url) {
//             acc[`SL_${item.platform}_Url`] = item.url
//           }
//           return acc
//         }, {}) || {}),

//         // Routing info
//         lang: router.locale || "en",
//         route: "institution-ecolink"
//       }

//       // Submit to API
//       const response = await fetch("/api/institution/v1/hcjBrBT60281CreateInstitutionProfile", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(submissionData),
//       })

//       const result = await response.json()

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to create institution profile")
//       }

//       // Handle success
//       toast({
//         title: "Success!",
//         description: "Institution profile created successfully.",
//       })

//       // Update session with company ID
//       await update({
//         ...session,
//         user: {
//           ...session.user,
//           companyId: result.companyId,
//           hasLogo: !!formData.educationalDetails.logoUrl,
//         },
//       })

//       // Clear form data and redirect
//       localStorage.removeItem("institutionProfileData")
//       router.push("/cmpny-dcmnt6031")

//     } catch (error) {
//       console.error("Profile submission error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "An error occurred while creating your profile.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 py-8 px-4">
//       <Card className="max-w-3xl mx-auto">
//         <CardHeader className="space-y-1">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-2xl">Create Institution Profile</CardTitle>
//           </div>
//           <Progress value={progress} className="h-2" />
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-3 mb-8">
//               {tabs.map(tab => (
//                 <TabsTrigger
//                   key={tab.id}
//                   value={tab.id}
//                   disabled={!canNavigateToTab(tab.id)}
//                   className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-base"
//                 >
//                   {tab.label}
//                 </TabsTrigger>
//               ))}
//             </TabsList>

//             <TabsContent value="educationalDetails">
//               <EducationalDetailsTab
//                 onSubmit={(data) => {
//                   updateFormData("educationalDetails", data)
//                   setActiveTab("addressDetails")
//                 }}
//                 initialData={formData.educationalDetails}
//               />
//             </TabsContent>

//             <TabsContent value="addressDetails">
//               <AddressDetailsTab
//                 onSubmit={(data) => {
//                   updateFormData("addressDetails", data)
//                   setActiveTab("socialIcons")
//                 }}
//                 onBack={() => setActiveTab("educationalDetails")}
//                 initialData={formData.addressDetails}
//               />
//             </TabsContent>

//             <TabsContent value="socialIcons">
//               <SocialLinksTab
//                 onSubmit={(data) => {
//                   updateFormData("socialIcons", data)
//                   handleSubmitProfile()
//                 }}
//                 onBack={() => setActiveTab("addressDetails")}
//                 initialData={formData.socialIcons}
//                 isSubmitting={isSubmitting}
//               />
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "@/i18n/routing"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import AddressDetailsTab from "./addrss-dtls6029/page"
import EducationalDetailsTab from "./edu-dtls6028/page"
import SocialLinksTab from "./socl-lnkss6030/page"

export default function Page() {
  const [activeTab, setActiveTab] = useState("educationalDetails")
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    educationalDetails: null,
    addressDetails: null,
    socialIcons: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session, update } = useSession()
  const router = useRouter()

  useEffect(() => {
    const savedData = localStorage.getItem("institutionProfileData")
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

  const updateProgress = (data) => {
    const steps = ["educationalDetails", "addressDetails", "socialIcons"]
    const completedSteps = steps.filter(step => data[step] !== null).length
    setProgress((completedSteps / steps.length) * 100)
  }

  const updateFormData = (step, data) => {
    setFormData(prev => {
      const newFormData = { ...prev, [step]: data }
      localStorage.setItem("institutionProfileData", JSON.stringify(newFormData))
      updateProgress(newFormData)
      return newFormData
    })
  }

  const tabs = [
    { id: "educationalDetails", label: "Institution Details" },
    { id: "addressDetails", label: "Address" },
    { id: "socialIcons", label: "Social Links" },
  ]

  const canNavigateToTab = (tabId) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId)
    return tabs.slice(0, tabIndex).every(tab => formData[tab.id] !== null)
  }

  const handleSubmitProfile = async () => {
    if (!formData.educationalDetails || !formData.addressDetails) {
      toast({
        title: "Missing information",
        description: "Please complete all required sections before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare base submission data
      let submitData = {
        // Institution details
        CD_User_Id: session.user.individualId,
        CD_Company_Name: formData.educationalDetails.institutionName,
        CD_Company_Type: formData.educationalDetails.institutionType,
        CD_Company_Establishment_Year: formData.educationalDetails.establishmentYear,
        CD_Company_Email: formData.educationalDetails.institutionEmail,
        CD_Company_Alternate_Email: formData.educationalDetails.alternateEmail,
        CD_Phone_Number: formData.educationalDetails.phoneNumber,
        CD_Alternate_Phone_Number: formData.educationalDetails.alternatePhoneNumber,
        CD_Company_Website: formData.educationalDetails.websiteUrl || "",
        CD_Company_Logo: formData.educationalDetails.logoUrl || "",
        CD_Company_About: formData.educationalDetails.about || "Tell us about your institution!",
        CD_Company_Mission: formData.educationalDetails.mission || "Tell us about your institution mission!",

        // Address details
        CAD_Address_Line1: formData.addressDetails.addressLine1,
        CAD_Address_Line2: formData.addressDetails.addressLine2 || "",
        CAD_Landmark: formData.addressDetails.landmark || "",
        CAD_City: formData.addressDetails.city,
        CAD_State: formData.addressDetails.state,
        CAD_Country: formData.addressDetails.country,
        CAD_Pincode: formData.addressDetails.pincode,

        // Initialize all social fields as empty
        SL_Social_Profile_Name: formData.educationalDetails.institutionName,
        SL_LinkedIn_Profile: "",
        SL_Website_Url: "",
        SL_Instagram_Url: "",
        SL_Facebook_Url: "",
        SL_Twitter_Url: "",
        SL_Pinterest_Url: "",
        SL_Custom_Url: "",
        SL_Portfolio_Url: "",

        // URL configuration
        lang: router.locale || "en",
        route: "institution-ecolink"
      }

      const allowedSocialKeys = new Set([
        "SL_LinkedIn_Profile",
        "SL_Website_Url",
        "SL_Instagram_Url",
        "SL_Facebook_Url",
        "SL_Twitter_Url",
        "SL_Pinterest_Url",
        "SL_Custom_Url",
        "SL_Portfolio_Url",
      ])
      
      formData.socialIcons.forEach(item => {
        if (item?.platform && item?.url && allowedSocialKeys.has(item.platform)) {
          submitData[item.platform] = item.url
        }
      })

      console.log("Submitting data:", JSON.stringify(submitData, null, 2))

      const response = await fetch("/api/institution/v1/hcjBrBT60281CreateInstitutionProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to create institution profile")
      }

      toast({
        title: "Success!",
        description: "Institution profile created successfully.",
      })

      await update({
        ...session,
        user: {
          ...session.user,
          companyId: result.companyId,
          hasLogo: !!formData.educationalDetails.logoUrl,
        },
      })

      localStorage.removeItem("institutionProfileData")
      router.push("/cmpny-dcmnt6031")

    } catch (error) {
      console.error("Profile submission error:", error)
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating your profile.",
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
            <CardTitle className="text-2xl">Create Institution Profile</CardTitle>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {tabs.map(tab => (
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

            <TabsContent value="educationalDetails">
              <EducationalDetailsTab
                onSubmit={(data) => {
                  updateFormData("educationalDetails", data)
                  setActiveTab("addressDetails")
                }}
                initialData={formData.educationalDetails}
              />
            </TabsContent>

            <TabsContent value="addressDetails">
              <AddressDetailsTab
                onSubmit={(data) => {
                  updateFormData("addressDetails", data)
                  setActiveTab("socialIcons")
                }}
                onBack={() => setActiveTab("educationalDetails")}
                initialData={formData.addressDetails}
              />
            </TabsContent>

            <TabsContent value="socialIcons">
              <SocialLinksTab
                onSubmit={(data) => {
                  updateFormData("socialIcons", data)
                  handleSubmitProfile()
                }}
                onBack={() => setActiveTab("addressDetails")}
                initialData={formData.socialIcons}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}