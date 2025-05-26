"use client";

import {
  MapPin,
  DollarSign,
  Clock,
  Star,
  Edit,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function OpportunityPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get opportunity type from URL
  const type = searchParams.get("type") || "job";
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchOpportunity = async () => {
      setLoading(true);
      try {
        // First try to get data from localStorage (from the form)
        const storedData = localStorage.getItem("previewOpportunity");

        if (storedData) {
          const formData = JSON.parse(storedData);

          // Transform form data to match the preview format
          const transformedData = transformFormDataToPreview(formData);
          setOpportunity(transformedData);
          setLoading(false);
          return;
        }

        // If no localStorage data and we have an ID, try to fetch from API
        if (id) {
          const response = await fetch(
            `/api/employee/v1/hcjBrBT61821JobPostings/${id}`,
            {
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch opportunity");
          }

          const data = await response.json();
          if (data.success && data.data) {
            const apiData = data.data;
            // Transform API data to match the preview format
            const transformedData = transformApiDataToPreview(apiData);
            setOpportunity(transformedData);
          }
        } else {
          // Fallback to mock data if no localStorage or API data
          const mockData = getMockData(type);
          setOpportunity(mockData);
        }
      } catch (error) {
        console.error("Failed to fetch opportunity:", error);
        toast({
          title: "Error",
          description: "Failed to load opportunity data",
          variant: "destructive",
        });

        // Fallback to mock data on error
        const mockData = getMockData(type);
        setOpportunity(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [type, id, toast]);

  // Transform form data to preview format
  const transformFormDataToPreview = (formData) => {
    // Get labels for skills
    const skillsList = [
      { id: "ui-design", label: "UI Design" },
      { id: "ux-design", label: "UX Design" },
      { id: "research", label: "Research" },
      { id: "figma", label: "Figma" },
      { id: "sketch", label: "Sketch" },
      { id: "adobe-xd", label: "Adobe XD" },
      { id: "graphic-design", label: "Graphic Design" },
      { id: "motion-design", label: "Motion Design" },
      { id: "prototyping", label: "Prototyping" },
      { id: "wireframing", label: "Wireframing" },
      { id: "user-testing", label: "User Testing" },
      { id: "front-end", label: "Front-end" },
      { id: "html", label: "HTML" },
      { id: "css", label: "CSS" },
      { id: "javascript", label: "JavaScript" },
      { id: "react", label: "React" },
      { id: "visual-design", label: "Visual Design" },
    ];

    // Get labels for perks
    const perksList = [
      { id: "flexible-hours", label: "Flexible Work Hours" },
      { id: "health-insurance", label: "Health Insurance" },
      { id: "paid-time-off", label: "Paid Time Off" },
      { id: "remote-work", label: "Remote Work Option" },
      { id: "professional-development", label: "Professional Development" },
      { id: "performance-based", label: "Performance based" },
      { id: "informal-dress-code", label: "Informal dress code" },
    ];

    // Get labels for who can apply
    const whoCanApplyList = [
      { id: "differently-abled", label: "Differently Abled" },
      { id: "students", label: "Students" },
      { id: "lgbtqia", label: "LGBTQIA+" },
      { id: "mothers", label: "Mothers" },
      { id: "women", label: "Women" },
      { id: "sports-person", label: "Sports Person" },
      { id: "single-parent", label: "Single Parent" },
      { id: "returning-from-illness", label: "Returning From Illness" },
      { id: "veterans", label: "Veterans" },
      { id: "racial-biased", label: "Racial Biased" },
      { id: "seniors", label: "Seniors" },
    ];

    // Get labels for additional requirements
    const additionalRequirementsList = [
      { id: "night-shift", label: "Night Shift" },
      { id: "weekend-work", label: "Weekend Work" },
      { id: "travel-required", label: "Travel Required" },
      { id: "relocation-assistance", label: "Relocation Assistance" },
      { id: "valid-visa", label: "Valid work visa" },
      { id: "fixed", label: "Fixed" },
      { id: "remote-working", label: "Remote working" },
      { id: "need-to-walk-a-lot", label: "Need to walk a lot" },
      { id: "resume-job", label: "Resume job" },
      { id: "bring-your-own-device", label: "Bring your own device" },
    ];

    // Format responsibilities as array
    const responsibilities = formData.responsibilities
      ? formData.responsibilities
          .split("\n")
          .filter((item) => item.trim() !== "")
      : [];

    // Format additional preferences as array
    const preferences = formData.additionalPreferences
      ? formData.additionalPreferences
          .split("\n")
          .filter((item) => item.trim() !== "")
      : [];

    // Get skill labels
    const skills = (formData.skillsRequired || []).map((skillId) => {
      const skill = skillsList.find((s) => s.id === skillId);
      return skill ? skill.label : skillId;
    });

    // Get perk labels
    const perks = (formData.perks || []).map((perkId) => {
      const perk = perksList.find((p) => p.id === perkId);
      return perk ? perk.label : perkId;
    });

    // Add salary type to perks if it's not fixed
    if (formData.salaryType === "negotiable") {
      perks.unshift("Negotiable salary");
    } else if (formData.salaryType === "performance-based") {
      perks.unshift("Performance based salary");
    }

    // Get who can apply labels
    const whoCanApply = (formData.whoCanApply || []).map((id) => {
      const item = whoCanApplyList.find((w) => w.id === id);
      return item ? item.label : id;
    });

    // Get additional requirements labels
    const requirements = (formData.additionalRequirements || []).map((id) => {
      const item = additionalRequirementsList.find((r) => r.id === id);
      return item ? item.label : id;
    });

    // Add standard requirements
    if (!requirements.includes("Valid work visa")) {
      requirements.push("Valid work visa");
    }
    if (!requirements.includes("Resume job")) {
      requirements.push("Resume job");
    }

    // Format salary
    let salary = "";
    if (formData.salaryType === "fixed" && formData.salaryAmount) {
      const currency =
        formData.salaryCurrency === "USD"
          ? "$"
          : formData.salaryCurrency === "EUR"
          ? "€"
          : formData.salaryCurrency === "GBP"
          ? "£"
          : formData.salaryCurrency === "INR"
          ? "₹"
          : "";

      salary = `${currency}${formData.salaryAmount} / ${
        formData.salaryDuration || "month"
      }`;
    } else if (formData.salaryType === "negotiable") {
      salary = "Negotiable";
    } else if (formData.salaryType === "performance-based") {
      salary = "Performance based";
    }

    // Format type label
    let typeLabel = "";
    if (formData.opportunityType === "job") {
      typeLabel =
        formData.duration === "permanent"
          ? "Full-time position"
          : "Contract position";
    } else if (formData.opportunityType === "internship") {
      typeLabel = "Internship";
      if (formData.durationValue && formData.durationType) {
        typeLabel += ` (${formData.durationValue} ${formData.durationType})`;
      }
    } else if (formData.opportunityType === "project") {
      typeLabel = "Project";
      if (formData.projectDuration) {
        typeLabel += ` (${formData.projectDuration})`;
      }
    }

    // Format location
    let location = formData.location || "Remote";
    if (formData.opportunityType === "job" && formData.jobType === "remote") {
      location =
        "Remote" + (formData.location ? ` (${formData.location})` : "");
    } else if (
      formData.opportunityType === "internship" &&
      formData.internshipType === "remote"
    ) {
      location =
        "Remote" + (formData.location ? ` (${formData.location})` : "");
    }

    // Format duration
    let duration = "";
    if (formData.opportunityType === "job") {
      duration = formData.duration === "permanent" ? "Full-time" : "Contract";
    } else if (
      formData.opportunityType === "internship" &&
      formData.durationValue &&
      formData.durationType
    ) {
      duration = `${formData.durationValue} ${formData.durationType}`;
    } else if (
      formData.opportunityType === "project" &&
      formData.projectDuration
    ) {
      duration = formData.projectDuration;
    }

    // Company info
    const company = {
      name: "IBM",
      logo: "/placeholder.svg?height=40&width=40",
      location: location,
      employees: "10,000+ employees",
    };

    return {
      id: id || "new",
      title: formData.title || "Untitled Opportunity",
      type: typeLabel,
      location: location,
      salary: salary,
      duration: duration,
      description: formData.description || "",
      responsibilities: responsibilities,
      skills: skills,
      whoCanApply: whoCanApply,
      preferences: preferences,
      perks: perks,
      requirements: requirements,
      closingDate: formData.closingDate,
      isEqualOpportunity: formData.isEqualOpportunity,
      status: "draft",
      opportunityType: formData.opportunityType,
      formData: formData, // Store original form data for publishing
      assessmentQuestions: formData.assessmentQuestions || [],
      company: company,
    };
  };

  // Transform API data to preview format
  const transformApiDataToPreview = (apiData) => {
    // Format responsibilities as array
    const responsibilities = apiData.HCJ_JP_Responsibility
      ? apiData.HCJ_JP_Responsibility.split("\n").filter(
          (item) => item.trim() !== ""
        )
      : [];

    // Format additional preferences as array
    const preferences = apiData.HCJ_JP_Additional_Preferences
      ? apiData.HCJ_JP_Additional_Preferences.split("\n").filter(
          (item) => item.trim() !== ""
        )
      : [];

    // Format who can apply
    const whoCanApply = apiData.HCJ_JP_Who_Can_Apply
      ? apiData.HCJ_JP_Who_Can_Apply.split(", ").filter(
          (item) => item.trim() !== ""
        )
      : [];

    // Format additional requirements
    const requirements = apiData.HCJ_JP_Additional_Requirement
      ? apiData.HCJ_JP_Additional_Requirement.split(", ").filter(
          (item) => item.trim() !== ""
        )
      : [];

    // Add standard requirements
    if (!requirements.includes("Valid work visa")) {
      requirements.push("Valid work visa");
    }
    if (!requirements.includes("Resume job")) {
      requirements.push("Resume job");
    }

    // Format type label
    let typeLabel = "";
    if (apiData.HCJ_JP_Opportunity_Type === "job") {
      typeLabel =
        apiData.HCJ_JP_Job_Duration === "permanent"
          ? "Full-time position"
          : "Contract position";
    } else if (apiData.HCJ_JP_Opportunity_Type === "internship") {
      typeLabel = "Internship";
    } else if (apiData.HCJ_JP_Opportunity_Type === "project") {
      typeLabel = "Project";
    }

    // Format salary
    let salary = "";
    if (apiData.HCJ_JP_Salary_Flag) {
      salary = `$${apiData.HCJ_JDT_Salary || "0"} / month`;
    } else {
      salary = "Negotiable";
    }

    // Company info
    const company = {
      name: "IBM",
      logo: "/placeholder.svg?height=40&width=40",
      location: apiData.HCJ_JDT_Job_Location || "Remote",
      employees: "10,000+ employees",
    };

    return {
      id: apiData._id,
      title: apiData.HCJ_JP_Job_Title || "Untitled Opportunity",
      type: typeLabel,
      location: apiData.HCJ_JDT_Job_Location || "Remote",
      salary: salary,
      duration:
        apiData.HCJ_JP_Job_Duration === "permanent" ? "Full-time" : "Contract",
      description: apiData.HCJ_JP_Job_Description || "",
      responsibilities: responsibilities,
      skills: apiData.HCJ_JP_Job_Skills || [],
      whoCanApply: whoCanApply,
      preferences: preferences,
      perks: apiData.HCJ_JP_Perks || [],
      requirements: requirements,
      closingDate: apiData.HCJ_JP_Closing_Date,
      isEqualOpportunity: apiData.HCJ_JP_Equal_Opportunity_Flag,
      status: apiData.HCJ_JDT_Job_Status || "draft",
      opportunityType: apiData.HCJ_JP_Opportunity_Type,
      company: company,
    };
  };

  // Get mock data for fallback
  const getMockData = (type) => {
    // Company info
    const company = {
      name: "IBM",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Remote (Anywhere in the US)",
      employees: "10,000+ employees",
    };

    const mockData = {
      job: {
        id: "mock-job",
        title: "UI Designer",
        type: "Full-time position",
        location: "Remote (Anywhere in the US)",
        salary: "$80k - $100k / year",
        duration: "Full-time",
        postedDate: "Posted 2 weeks ago",
        employees: "11-50 employees",
        positions: "1 position",
        description:
          "We are currently hiring a passionate, user-centered UI Designer to join a collaborative and innovative team. You will be responsible for designing digital products that enhance user experience.",
        responsibilities: [
          "Creating user-centered designs by understanding business requirements and user feedback",
          "Creating user flows, wireframes, prototypes and mockups",
          "Identifying requirements for user guides, design systems, UI pattern libraries",
          "Designing UI elements such as input controls, navigational components",
        ],
        skills: [
          "Figma",
          "Adobe XD",
          "HTML",
          "CSS",
          "JavaScript",
          "React",
          "Visual Design",
          "Wireframing",
        ],
        whoCanApply: [
          "Recently Graduated",
          "Mid-level Designer",
          "Design/Creative Background",
        ],
        preferences: [
          "Ability to design software like Canva",
          "A keen eye for detail and passion for creating visually appealing graphics",
          "Good understanding of design principles and brand identity",
          "Strong communication and collaboration skills",
        ],
        perks: [
          "Performance based",
          "Flexible Work Hours",
          "Health Insurance",
          "Paid time off",
          "Informal dress code",
        ],
        requirements: [
          "Valid work visa",
          "Fixed",
          "Resume job",
          "Need to walk a lot",
          "Remote working",
          "Bring your own device",
        ],
        closingDate: "2023-12-01",
        isEqualOpportunity: true,
        status: "draft",
        opportunityType: "job",
        company: company,
      },
      internship: {
        id: "mock-internship",
        title: "UI/UX Design Intern",
        type: "Summer Internship",
        location: "New York, NY",
        salary: "$25 - $30 / hour",
        duration: "3 months",
        startDate: "June 2024",
        description:
          "Join our design team as an intern and gain hands-on experience with real projects.",
        responsibilities: [
          "Assist with user research and testing",
          "Create wireframes and prototypes",
          "Participate in design reviews",
        ],
        skills: ["Figma", "User Research", "HTML", "CSS", "JavaScript"],
        whoCanApply: ["Current Students", "Recent Graduates"],
        preferences: [
          "Portfolio demonstrating design skills",
          "Basic understanding of UX principles",
        ],
        perks: ["Mentorship", "Flexible schedule", "Potential full-time offer"],
        requirements: [
          "Must be enrolled in a design program",
          "Valid work visa",
          "Resume job",
        ],
        closingDate: "2024-04-15",
        isEqualOpportunity: true,
        status: "draft",
        opportunityType: "internship",
        company: company,
      },
      project: {
        id: "mock-project",
        title: "Mobile App Redesign",
        type: "Contract Project",
        location: "Remote",
        salary: "$5,000 fixed price",
        duration: "6 weeks",
        description:
          "Redesign the user interface for our mobile application to improve usability.",
        responsibilities: [
          "Create new UI designs",
          "Work with developers to implement changes",
          "Conduct user testing",
        ],
        skills: ["Figma", "UI Design", "Prototyping", "Mobile Design"],
        whoCanApply: ["Freelancers", "Design Agencies"],
        preferences: [
          "Experience with mobile design patterns",
          "Strong visual design skills",
        ],
        perks: ["Flexible timeline", "Potential for future work"],
        requirements: [
          "Portfolio required",
          "Availability for weekly check-ins",
          "Valid work visa",
          "Resume job",
        ],
        closingDate: "2024-03-01",
        isEqualOpportunity: true,
        status: "draft",
        opportunityType: "project",
        company: company,
      },
    };

    return mockData[type] || mockData.job;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-foreground">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 text-foreground">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <p>Opportunity not found</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/emplyr-dshbrd6161/post-oppartunity6182?id=${id || ""}`);
  };

  const handlePublish = async () => {
    try {
      // If we have form data from preview, use it to publish
      if (opportunity.formData) {
        const formData = opportunity.formData;

        // Prepare the API request based on whether we're editing or creating
        const url = id
          ? `/api/employee/v1/hcjBrBT61821JobPostings/${id}`
          : "/api/employee/v1/hcjBrBT61821JobPostings";

        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        const result = await res.json();

        if (res.ok) {
          toast({
            title: "Success!",
            description: id
              ? "Opportunity updated successfully."
              : "Opportunity published successfully.",
          });

          // Clear preview data
          localStorage.removeItem("previewOpportunity");

          // Redirect to opportunities page
          router.push("/emplyr-dshbrd6161/opprtnty6166");
        } else {
          toast({
            title: "Failed",
            description: result.message || "Something went wrong.",
            variant: "destructive",
          });
        }
      } else {
        // If no form data, show error
        toast({
          title: "Error",
          description: "No form data available for publishing",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      if (opportunity.formData) {
        const formData = opportunity.formData;

        // Set status to draft explicitly
        formData.status = "draft";

        // Prepare the API request based on whether we're editing or creating
        const url = id
          ? `/api/employee/v1/hcjBrBT61821JobPostings/${id}`
          : "/api/employee/v1/hcjBrBT61821JobPostings";

        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        const result = await res.json();

        if (res.ok) {
          toast({
            title: "Success!",
            description: "Opportunity saved as draft.",
          });

          // Clear preview data
          localStorage.removeItem("previewOpportunity");

          // Redirect to opportunities page
          router.push("/emplyr-dshbrd6161/opprtnty6166");
        } else {
          toast({
            title: "Failed",
            description: result.message || "Something went wrong.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "No form data available for saving",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const getTypeLabel = () => {
    switch (opportunity.opportunityType) {
      case "job":
        return "Job";
      case "internship":
        return "Internship";
      case "project":
        return "Project";
      default:
        return "Opportunity";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-foreground">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Header with back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 mb-4"
            onClick={() => router.push("/emplyr-dshbrd6161/opprtnty6166")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to opportunities
          </Button>

          {/* Status Notice */}
          {opportunity.status === "draft" && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                This is a preview. It won&apos;t be visible to applicants until
                published.
              </p>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Job header */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={
                      opportunity.company?.logo ||
                      "/placeholder.svg?height=48&width=48"
                    }
                    alt={opportunity.company?.name || "Company"}
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">{opportunity.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span>{opportunity.company?.name || "Company"}</span>
                    <span>•</span>
                    <span>{opportunity.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{opportunity.location}</span>
              </div>
              {opportunity.salary && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>{opportunity.salary}</span>
                </div>
              )}
              {opportunity.duration && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{opportunity.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Left column */}
            <div>
              {/* Job Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Job Description</h2>
                <p className="text-sm leading-relaxed text-gray-700">
                  {opportunity.description}
                </p>
              </div>

              {/* Skills Required */}
              {opportunity.skills && opportunity.skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3">
                    Skills Required
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Preferences */}
              {opportunity.preferences &&
                opportunity.preferences.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">
                      Additional Preferences
                    </h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {opportunity.preferences.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Additional Details/Requirements */}
              {opportunity.requirements &&
                opportunity.requirements.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">
                      Additional Details/Requirement
                    </h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {opportunity.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {opportunity.assessmentQuestions &&
                opportunity.assessmentQuestions.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">
                      Assessment Questions
                    </h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {opportunity.assessmentQuestions.map((q, index) => (
                        <li key={index}>
                          {q.question}
                          {q.isMandatory && (
                            <span className="text-red-500 ml-1">
                              (Mandatory)
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            {/* Right column */}
            <div>
              {/* Key Responsibilities */}
              {opportunity.responsibilities &&
                opportunity.responsibilities.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">
                      Key responsibilities
                    </h2>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {opportunity.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 text-blue-500">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Who can apply */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Who can apply</h2>
                <div className="p-3 bg-blue-50 rounded-md mb-3">
                  <p className="text-sm text-blue-800 font-medium">
                    {opportunity.isEqualOpportunity
                      ? "Equal employment opportunity"
                      : "Specific requirements apply"}
                  </p>
                </div>
                {opportunity.whoCanApply &&
                  opportunity.whoCanApply.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {opportunity.whoCanApply.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
              </div>

              {/* Salary and perks */}
              {opportunity.perks && opportunity.perks.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3">
                    Salary and perks
                  </h2>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {opportunity.perks.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1 text-blue-500">
                          <Check className="h-4 w-4" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Application Deadline */}
          {opportunity.closingDate && (
            <div className="p-6 border-t bg-gray-50">
              <p className="text-center font-medium">
                Publication will close on{" "}
                {format(new Date(opportunity.closingDate), "MMMM dd, yyyy")}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" size="lg" onClick={handlePublish}>
              Publish Now
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              size="lg"
              onClick={handleSaveAsDraft}
            >
              Save as Draft
            </Button>
          </div>
          <div className="mt-4 text-xs text-center text-gray-500">
            <p>Your post will stay as a draft until it is published.</p>
            <p>
              Once published, it will be visible to all potential candidates.
            </p>
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="mt-6 mb-6">
          <Card className="p-6 border-blue-200 bg-white">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2">
                  Upgrade to a paid opportunity for just $5
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Unlock these premium benefits for this{" "}
                  {getTypeLabel().toLowerCase()}:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-green-500">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      Unlimited applications per day
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-green-500">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      Job highlighted in search results
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-green-500">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      Access to the hiring content for help
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-green-500">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      Premium analytics and tracking tools
                    </span>
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  Upgrade to Paid Opportunity for $5
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Text */}
        <div className="text-xs text-center text-gray-500 mb-8">
          <p>
            Your job will go live immediately and be visible to job seekers for
            30 days.
          </p>
          <p>
            Ensure your listing is complete and accurate before you publish.
          </p>
        </div>
      </div>
    </div>
  );
}
