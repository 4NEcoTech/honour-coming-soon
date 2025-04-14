"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AddressDetails from "./addrss-dtls6025/page";
import PersonalDetails from "./prsnl-dtls6024/page";
import SocialLinks from "./socl-lnks6026/page";

export default function Page() {
  const [activeTab, setActiveTab] = useState("personal");
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    personal: null,
    address: null,
    social: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      updateProgress(parsedData);
    }
  }, []);

  const updateProgress = (data) => {
    const steps = ["personal", "address", "social"];
    const completedSteps = steps.filter((step) => data[step] !== null).length;
    setProgress((completedSteps / steps.length) * 100);
  };

  const updateFormData = (step, data) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [step]: data };
      localStorage.setItem("formData", JSON.stringify(newFormData));
      updateProgress(newFormData);
      return newFormData;
    });
  };

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "address", label: "Address Details" },
    { id: "social", label: "Social Links" },
  ];

  const canNavigateToTab = (tabId) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    return tabs.slice(0, tabIndex).every((tab) => formData[tab.id] !== null);
  };

  const handleSubmitProfile = async () => {
    // Validate required fields
    if (!formData.personal || !formData.address) {
      toast({
        title: "Missing information",
        description: "Please complete all required sections before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare the submission data
      const submitData = {
        // Basic personal info
        ID_User_Id: session.user.id,
        ID_First_Name: formData.personal.firstName,
        ID_Last_Name: formData.personal.lastName,
        ID_Phone: formData.personal.phone,
        ID_Email: formData.personal.corporateEmail,
        ID_Gender: formData.personal.gender || "01", // Default gender code
        ID_DOB: formData.personal.dob || "",
        ID_Profile_Picture: formData.personal.photoUrl || "",

        // Professional info
        ID_Individual_Designation: formData.personal.designation || "",
        ID_Profile_Headline: formData.personal.profileHeadline || "",
        ID_About: formData.personal.about || "",

        // Address info
        IAD_Address_Line1: formData.address.addressLine1,
        IAD_City: formData.address.city,
        IAD_State: formData.address.state,
        IAD_Country: formData.address.country,
        IAD_Pincode: formData.address.pincode,
        IAD_Address_Line2: formData.address.addressLine2 || "",
        IAD_Landmark: formData.address.landmark || "",

        // Social info - initialize all possible fields
        SL_Social_Profile_Name: `${formData.personal.firstName} ${formData.personal.lastName}`,
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
        route: "ecolink",
      };

      // 2. Process social links if they exist

      if (formData.social?.length) {
        submitData = formData.social.reduce((acc, item) => {
          try {
            if (item?.url && item?.platform) {
              const platformKey = `SL_${item.platform}_Url`;
              if (Object.prototype.hasOwnProperty.call(acc, platformKey)) {
                acc[platformKey] = item.url;
              }
            }
          } catch (error) {
            console.warn("Error processing social link:", item, error);
          }
          return acc;
        }, submitData);
      }

      // 3. Submit to API
      const response = await fetch("/api/institution/v1/hcjBrBT60241CreateAdminProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create profile");
      }

      // 4. Handle success
      toast({
        title: "Success!",
        description: "Your profile has been created successfully.",
      });

      // Clear form data from local storage
      localStorage.removeItem("formData");

      // Update session with the new individualId
      await update({
        ...session,
        user: {
          ...session.user,
          individualId: result.individualId,
          hasProfilePicture: !!formData.personal.photoUrl,
          first_name: result.first_name,
          last_name: result.last_name,
        },
      });

      // 5. Redirect to next page
      router.push("/admin-dcmnt6027");
    } catch (error) {
      console.error("Profile submission error:", error);

      toast({
        title: "Error",
        description:
          error.message || "An error occurred while creating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
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
                  updateFormData("personal", data);
                  setActiveTab("address");
                }}
                initialData={formData.personal}
                isSubmitting={false}
              />
            </TabsContent>

            <TabsContent value="address">
              <AddressDetails
                onSubmit={(data) => {
                  updateFormData("address", data);
                  setActiveTab("social");
                }}
                onBack={() => setActiveTab("personal")}
                initialData={formData.address}
                isSubmitting={false}
              />
            </TabsContent>

            <TabsContent value="social">
              <SocialLinks
                onSubmit={(data) => {
                  updateFormData("social", data);
                  handleSubmitProfile();
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
