// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/hooks/use-toast";
// import { useSession } from "next-auth/react";
// import { useRouter } from "@/i18n/routing";
// import CompanyDetails from "./cmp-dtls5153/CompanyDetails";
// import AddressDetails from "./addrss-dtls6154/AddressDetails";
// import SocialLinks from "./socl-lnks6155/SocialLinks";

// export default function Page() {
//   const [activeTab, setActiveTab] = useState("company");
//   const [progress, setProgress] = useState(0);
//   const [formData, setFormData] = useState({
//     company: {},
//     address: {},
//     social: {},
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: session, update } = useSession();
//   const router = useRouter();

//   const getSizeCode = (label) => {
//     const mapping = {
//       "1-10 employees": 1,
//       "11-50 employees": 2,
//       "51-200 employees": 3,
//       "201-500 employees": 4,
//       "501-1000 employees": 5,
//       "1001-5000 employees": 6,
//       "5000+ employees": 7,
//     };
//     return mapping[label] || 0;
//   };

//   useEffect(() => {
//     const savedData = localStorage.getItem("companyProfileData");
//     if (savedData) {
//       const parsed = JSON.parse(savedData);
//       setFormData(parsed);
//       updateProgress(parsed);
//     }
//   }, []);

//   const updateProgress = (data) => {
//     const steps = ["company", "address", "social"];
//     const completed = steps.filter(step => Object.keys(data[step] || {}).length > 0).length;
//     setProgress((completed / steps.length) * 100);
//   };

//   const updateFormData = (step, data) => {
//     const updated = { ...formData, [step]: data };
//     setFormData(updated);
//     localStorage.setItem("companyProfileData", JSON.stringify(updated));
//     updateProgress(updated);
//   };

//   const canNavigateToTab = (tabId) => {
//     const currentIndex = tabs.findIndex(tab => tab.id === tabId);
//     return tabs.slice(0, currentIndex).every(tab => Object.keys(formData[tab.id] || {}).length > 0);
//   };

//   const handleFinalSubmit = async (latestSocialData) => {
//     const finalData = {
//       ...formData,
//       // social: latestSocialData,
//       social: latestSocialData?.profiles || [],
//     };

//     if (!finalData.company || !finalData.address) {
//       toast({
//         title: "Missing Information",
//         description: "Please complete all sections before submitting.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const submissionPayload = {
//         CD_User_Id: session?.user?.individualId,
//         CD_Company_Name: finalData.company.companyName,
//         CD_Company_Type: finalData.company.companyType,
//         // CD_Company_Size: finalData.company.companySize,
//         CD_Company_Size: getSizeCode(finalData.company.companySize),
//         CD_Company_Email: finalData.company.companyEmail,
//         CD_Company_Alternate_Email: finalData.company.alternateEmail || "",
//         CD_Phone_Number: finalData.company.phone,
//         CD_Alternate_Phone_Number: finalData.company.alternatePhone || "",

//         CD_Company_Website: finalData.company.companyWebsite || "",
//         CD_Company_Logo: finalData.company.logo?.url || "",

//         CD_Company_About: finalData.company.aboutCompany || "",
//         CD_Company_Mission: finalData.company.missionCompany || "",
//         CD_Company_Industry: finalData.company.industry || "",
//         CD_Company_Industry_SubCategory: finalData.company.subIndustry || "",

//         CAD_Address_Line1: finalData.address.addressLine1,
//         CAD_Address_Line2: finalData.address.addressLine2 || "",
//         CAD_Landmark: finalData.address.landmark || "",
//         CAD_City: finalData.address.city,
//         CAD_State: finalData.address.state,
//         CAD_Country: finalData.address.country,
//         CAD_Pincode: finalData.address.pincode,

//         SL_Social_Profile_Name: finalData.company.companyName,
//         ...(finalData.social?.reduce((acc, item) => {
//           if (item.platform && item.url) {
//             acc[`SL_${item.platform}_Url`] = item.url;
//           }
//           return acc;
//         }, {}) || {}),

//         lang: router.locale || "en",
//         route: "company-ecolink"
//       };

//        //  Log before submission
//     console.log("📤 Submission Payload:", submissionPayload);

//       const res = await fetch("/api/employee/v1/hcjBrBT60152CreateCompanyProfile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(submissionPayload),
//       });

//       const result = await res.json();

//       console.log("API Response:", result);

//       if (!res.ok) throw new Error(result.message || "Failed to submit profile");

//       toast({
//         title: "Success!",
//         description: "Company profile created successfully.",
//       });

//       await update({
//         ...session,
//         user: {
//           ...session.user,
//           companyId: result.companyId,
//           hasLogo: !!finalData.company.logo,
//         },
//       });

//       localStorage.removeItem("companyProfileData");
//       router.push("/cmp-dcmnt6156");

//     } catch (error) {
//       console.error("Submission error:", error);
//       toast({
//         title: "Error",
//         description: error.message || "Something went wrong.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const tabs = [
//     { id: "company", label: "Company Details" },
//     { id: "address", label: "Address" },
//     { id: "social", label: "Social Links" },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 py-8 px-4">
//       <Card className="max-w-3xl mx-auto">
//         <CardHeader className="space-y-1">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-2xl">Create Company Profile</CardTitle>
//           </div>
//           <Progress value={progress} className="h-2" />
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-3 mb-8">
//               {tabs.map((tab) => (
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

//             <TabsContent value="company">
//               <CompanyDetails
//                 onNext={(data) => {
//                   updateFormData("company", data);
//                   setActiveTab("address");
//                 }}
//                 initialData={formData.company}
//                 isSubmitting={isSubmitting}
//               />
//             </TabsContent>

//             <TabsContent value="address">
//               <AddressDetails
//                 onNext={(data) => {
//                   updateFormData("address", data);
//                   setActiveTab("social");
//                 }}
//                 onBack={() => setActiveTab("company")}
//                 initialData={formData.address}
//               />
//             </TabsContent>

//             <TabsContent value="social">
//               <SocialLinks
//                 onSubmit={(data) => handleFinalSubmit(data)}
//                 onBack={() => setActiveTab("address")}
//                 initialData={formData.social}
//                 isSubmitting={isSubmitting}
//               />
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AddressDetails from "./addrss-dtls6154/AddressDetails";
import CompanyDetails from "./cmp-dtls5153/CompanyDetails";
import SocialLinks from "./socl-lnks6155/SocialLinks";

export default function Page() {
  const [activeTab, setActiveTab] = useState("company");
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    company: null,
    address: null,
    social: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, update } = useSession();
  const router = useRouter();

  const getSizeCode = (label) => {
    const mapping = {
      "1-10 employees": 1,
      "11-50 employees": 2,
      "51-200 employees": 3,
      "201-500 employees": 4,
      "501-1000 employees": 5,
      "1001-5000 employees": 6,
      "5000+ employees": 7,
    };
    return mapping[label] || 0;
  };

  useEffect(() => {
    const savedData = localStorage.getItem("companyProfileData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed);
      updateProgress(parsed);
    }
  }, []);

  const updateProgress = (data) => {
    const steps = ["company", "address", "social"];
    const completed = steps.filter((step) => data[step] !== null).length;
    setProgress((completed / steps.length) * 100);
  };

  const updateFormData = (step, data) => {
    const updated = { ...formData, [step]: data };
    setFormData(updated);
    localStorage.setItem("companyProfileData", JSON.stringify(updated));
    updateProgress(updated);
  };

  const canNavigateToTab = (tabId) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === tabId);
    return tabs
      .slice(0, currentIndex)
      .every((tab) => formData[tab.id] !== null);
  };

  const handleFinalSubmit = async (socialData) => {
    if (!formData.company || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please complete all sections before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Initialize all social fields as empty strings
      const socialFields = {
        SL_Social_Profile_Name: formData.company.companyName,
        SL_LinkedIn_Profile: "",
        SL_Website_Url: "",
        SL_Instagram_Url: "",
        SL_Facebook_Url: "",
        SL_Twitter_Url: "",
        SL_Pinterest_Url: "",
        SL_Custom_Url: "",
        SL_Portfolio_Url: "",
      };

      // Populate social fields from the form data
      socialData.forEach((item) => {
        if (item?.platform && item?.url) {
          socialFields[item.platform] = item.url;
        }
      });

      const submissionPayload = {
        CD_User_Id: session?.user?.individualId,
        CD_Company_Name: formData.company.companyName,
        CD_Company_Type: formData.company.companyType,
        CD_Company_Size: getSizeCode(formData.company.companySize),
        CD_Company_Email: formData.company.companyEmail,
        CD_Company_Alternate_Email: formData.company.alternateEmail || "",
        CD_Phone_Number: formData.company.phone,
        CD_Alternate_Phone_Number: formData.company.alternatePhone || "",

        CD_Company_Website: formData.company.companyWebsite || "",
        CD_Company_Logo: formData.company?.logoUrl || "",

        CD_Company_About: formData.company.aboutCompany || "",
        CD_Company_Mission: formData.company.missionCompany || "",
        CD_Company_Industry: formData.company.industry || "",
        CD_Company_Industry_SubCategory: formData.company.subIndustry || "",

        CAD_Address_Line1: formData.address.addressLine1,
        CAD_Address_Line2: formData.address.addressLine2 || "",
        CAD_Landmark: formData.address.landmark || "",
        CAD_City: formData.address.city,
        CAD_State: formData.address.state,
        CAD_Country: formData.address.country,
        CAD_Pincode: formData.address.pincode,

        ...socialFields,

        lang: router.locale || "en",
        route: "company-ecolink",
      };

      console.log("📤 Submission Payload:", submissionPayload);

      const res = await fetch(
        "/api/employee/v1/hcjBrBT60152CreateCompanyProfile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionPayload),
        }
      );

      const result = await res.json();

      console.log("API Response:", result);

      if (!res.ok)
        throw new Error(result.message || "Failed to submit profile");

      toast({
        title: "Success!",
        description: "Company profile created successfully.",
      });

      await update({
        ...session,
        user: {
          ...session.user,
          companyId: result.companyId,
          hasLogo: !!formData.company.logoUrl,
        },
      });

      localStorage.removeItem("companyProfileData");
      router.push("/cmp-dcmnt6156");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "company", label: "Company Details" },
    { id: "address", label: "Address" },
    { id: "social", label: "Social Links" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Create Company Profile</CardTitle>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={!canNavigateToTab(tab.id)}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-base">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="company">
              <CompanyDetails
                onNext={(data) => {
                  updateFormData("company", data);
                  setActiveTab("address");
                }}
                initialData={formData.company}
                isSubmitting={isSubmitting}
              />
            </TabsContent>

            <TabsContent value="address">
              <AddressDetails
                onNext={(data) => {
                  updateFormData("address", data);
                  setActiveTab("social");
                }}
                onBack={() => setActiveTab("company")}
                initialData={formData.address}
              />
            </TabsContent>

            <TabsContent value="social">
              <SocialLinks
                onSubmit={(socialData) => {
                  updateFormData("social", socialData);
                  handleFinalSubmit(socialData);
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
  );
}
