"use client";

import { getUserById, updateUser } from "@/app/utils/indexDB";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useMultiStepForm(initialStep = "personal") {
  const [activeTab, setActiveTab] = useState(initialStep);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    const tempId = localStorage.getItem("temp_student_id");
    if (tempId) {
      getUserById(tempId)
        .then((data) => data && setFormData(data))
        .catch((err) => console.error("Error fetching user:", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleStepSubmit = async (step, data) => {
    setIsSubmitting(true);
    try {
      const updatedData = { ...formData, ...data };

      //  Ensure profile picture is not lost
      if (!updatedData.ID_Profile_Picture && data.ID_Profile_Picture) {
        updatedData.ID_Profile_Picture = data.ID_Profile_Picture;
      }
      
      setFormData(updatedData);

      await updateUser(updatedData);

      const nextStep = getNextStep(step);
      if (nextStep) {
        setActiveTab(nextStep);
      } else {
        await handleFinalSubmit(updatedData);
      }
    } catch (error) {
      console.error("Error submitting step:", error);
      toast.error("Submission Error", {
        description: error.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Create a JSON object for submission
      const jsonData = {};

      // Exclude these fields
      const excludedKeys = ["exp", "iat", "id", "photo"];

      // Map frontend field names to API field names
      const fieldMappings = {
        // Personal Details
        HCJ_ST_Student_First_Name: "ID_First_Name",
        HCJ_ST_Student_Last_Name: "ID_Last_Name",
        HCJ_ST_Phone_Number: "ID_Phone",
        HCJ_ST_Alternate_Phone_Number: "ID_Alternate_Phone",
        HCJ_ST_Educational_Email: "ID_Email",
        HCJ_ST_Educational_Alternate_Email: "ID_Alternate_Email",
        HCJ_ST_DOB: "ID_DOB",
        HCJ_ST_Gender: "ID_Gender",
        ID_About: "ID_Profile_Headline",
        ID_Profile_Picture: "ID_Profile_Picture", // This will now be a URL

        // Address Details
        HCJ_ST_Student_Country: "IAD_Country",
        HCJ_ST_Student_State: "IAD_State",
        HCJ_ST_Student_City: "IAD_City",
        HCJ_ST_Student_Pincode: "IAD_Pincode",
        HCJ_ST_Address: "IAD_Address_Line1",

        // Educational Details
        HCJ_ST_Institution_Name: "IE_Institute_Name",
        HCJ_ST_Student_Program_Name: "IE_Program_Name",
        HCJ_ST_Student_Branch_Specialization: "IE_Specialization",
        HCJ_ST_Enrollment_Year: "IE_Start_Date",
        HCJ_ST_Class_Of_Year: "IE_End_Date",
        year: "IE_Year",
        HCJ_ST_Score_Grade_Type: "IE_Score_Grades",
        HCJ_ST_Score_Grade: "IE_Score_Grades_Value",
      };

      // Add User ID
      jsonData["UT_User_Id"] = session?.user?.id || "";

      // Add User Role
      jsonData["ID_Individual_Role"] = session?.user?.role || "";

      // Add program status for education
      jsonData["IE_Program_Status"] = "02";

      // Add EcoLink parameters
      jsonData["lang"] = "en"; // Default language
      jsonData["route"] = "student-ecolink"; // Specific route for student EcoLinks

      // Map fields using the mapping
      Object.entries(formData).forEach(([key, value]) => {
        if (!excludedKeys.includes(key)) {
          // Check if this key has a mapping
          if (fieldMappings[key]) {
            // Format date values properly
            if (key === "HCJ_ST_DOB" && value instanceof Date) {
              jsonData[fieldMappings[key]] = value.toISOString().split("T")[0];
            } else {
              jsonData[fieldMappings[key]] = value;
            }
          }
          // Handle social links separately (they already have the correct prefix)
          else if (key.startsWith("SL_")) {
            jsonData[key] = value;
          }
        }
      });

      // Add social profile name if any social links exist
      if (Object.keys(formData).some((key) => key.startsWith("SL_"))) {
        jsonData["SL_Social_Profile_Name"] = "Social Profiles";
      }

      // Make the API call with JSON data
      const res = await fetch(
        "/api/student/v1/hcjBrBT60421StudentProfileCreate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        handleApiError(res.status, data.message || data.error);
        throw new Error(data.message || data.error || "Upload failed");
      } else {
        toast.success("Profile Created Successfully", {
          description: "Your profile has been created successfully!",
        });

        // Update session with new IDs
        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            individualId: data.individualId,
            jobSeekerId: data.jobSeekerId,
            // Add EcoLink specific fields if needed
            hasEcoLink: true,
            ecoLinkType: "student",
          },
        };

        await update(updatedSession);

        // Store in localStorage if needed
        localStorage.setItem("student_profile_created", "true");
        localStorage.removeItem("temp_student_id");

        router.push("/stdnt-dcmnt6046");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload Failed", {
        description: error.message || "Something went wrong during upload.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (status, errorMessage) => {
    console.log("inside handleApiError", status, errorMessage);
    if (status === 400) {
      toast.error("Missing Fields", { description: errorMessage });
    } else if (status === 409) {
      toast.error("Conflict", { description: errorMessage });
    } else if (status === 500) {
      toast.error("Server Error", {
        description: "Something went wrong on the server.",
      });
    } else {
      toast.error("Upload Failed", {
        description: "An unexpected error occurred.",
      });
    }
  };

  const getNextStep = (step) => {
    const steps = ["personal", "address", "educational", "social"];
    const currentIndex = steps.indexOf(step);
    return steps[currentIndex + 1] || null;
  };

  return {
    activeTab,
    formData,
    isSubmitting,
    handleStepSubmit,
    setActiveTab,
    isLoading,
  };
}
