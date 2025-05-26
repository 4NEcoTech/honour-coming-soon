"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Briefcase,
  CheckCircle,
  Share2,
  Bookmark,
  Building,
  Users,
  Award,
  Star,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function JobDescriptionPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
   console.log("Aditya", session)
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState("not_applied");
  const [saved, setSaved] = useState(false);
  const { jobId } = useParams();
  const { toast } = useToast();

  useEffect(() => {
const fetchJobDetails = async () => {
  setLoading(true);
  try {
    const response = await fetch(`/api/employee/v1/hcjBrBT61821JobPostings/${jobId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch job details");
    }

    const data = await response.json();

    if (data.data) {
      setJob(data.data);

      if (data.data.HCJ_JP_Opportunity_Type || data.data.HCJ_JP_Job_Skills) {
        fetchSimilarJobs(data.data);
      }

      checkSavedStatus(jobId);
      checkApplicationStatus(jobId);
    } else {
      console.error("No job data found");
    }
  } catch (error) {
    console.error("Error fetching job details:", error);
    toast.error("Failed to load job details");
  } finally {
    setLoading(false);
  }
};

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchSimilarJobs = async (currentJob) => {
    try {
      // Fetch similar jobs based on job type and skills
      const type = currentJob.HCJ_JP_Opportunity_Type || "";
      const skill = currentJob.HCJ_JP_Job_Skills?.[0] || "";

      const response = await fetch(
        `/api/employee/v1/hcjArET60031getAllJobPostings?type=${type}${
          skill ? `&skills=${skill}` : ""
        }`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch similar jobs");
      }

      const data = await response.json();
      // Filter out the current job and limit to 3 similar jobs
      if (data.data && data.data.length > 0) {
        const filtered = data.data
          .filter((job) => job._id !== currentJob._id)
          .slice(0, 3);
        setSimilarJobs(filtered);
      }
    } catch (error) {
      console.error("Error fetching similar jobs:", error);
    }
  };

  const checkSavedStatus = async (jobId) => {
    // This would typically check if the job is saved in the user's profile
    // For now, we'll just use a mock implementation
    setSaved(false);
  };

  const checkApplicationStatus = async (jobId) => {
  if (!session?.user?.individualId) return;

  try {
    const res = await fetch(`/api/employee/v1/hcjArET60032CheckApplicationStatus?userId=${session.user.individualId}&jobId=${jobId}`);
    const data = await res.json();

    if (res.ok && data.status) {
      setApplicationStatus(data.status);
    } else {
      setApplicationStatus("not_applied");
    }
  } catch (err) {
    console.error("Error checking application status", err);
    setApplicationStatus("not_applied");
  }
};


  const handleApply = async () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply for this job.",
        variant: "destructive",
      });
      return;
    }

    try {
      const applicationData = {
        HCJ_AT_Applicant_Id: session.user.id,
        HCJ_AT_Job_Id: jobId,
        HCJ_AT_Applicant_First_Name: session.user.first_name || "First Name",
        HCJ_AT_Applicant_Last_Name: session.user.last_name || "Last Name",
        HCJ_AT_Applicant_Email: session.user.email || "email@example.com",
        HCJ_AT_Applicant_Phone_Number: session.user.phone || "+911234567890",
        HCJ_AT_Applicant_Type: session.user.role,
        HCJ_JA_Job_Created_By: job.HCJ_JP_Company_Id || "admin",
        HCJ_Job_JA_Applied_By: session.user.id,
      };

      const response = await fetch(
        "/api/employee/v1/hcjBrBT60061ApplyJobApplications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });

      setApplicationStatus("applied");
    } catch (error) {
      console.error("Error applying for job:", error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong while submitting your application.",
        variant: "destructive",
      });
    }
  };

  const handleSaveJob = async () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save this job.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Toggle saved state
      const newSavedState = !saved;
      setSaved(newSavedState);

      toast({
        title: newSavedState ? "Job Saved" : "Job Unsaved",
        description: newSavedState
          ? "This job has been added to your saved list."
          : "This job has been removed from your saved list.",
      });
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Save Failed",
        description: "Something went wrong while saving the job.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    try {
      const date = new Date(dateString);
      return format(date, "MMMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error calculating time ago:", error);
      return "";
    }
  };

  const getOpportunityType = (type) => {
    switch (type) {
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

  const getMatchScore = () => {
    // This would typically calculate a match score based on user skills and job requirements
    // For now, we'll just return a random score between 60 and 95
    return Math.floor(Math.random() * (95 - 60 + 1)) + 60;
  };

  if (loading) {
    return <JobDetailsSkeleton />;
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-4">
            The job you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push("/")}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  const matchScore = getMatchScore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 text-gray-600"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job header card */}
            <Card className="overflow-hidden">
              <div className="bg-primary/5 p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-white border flex items-center justify-center">
                      {job.company ? (
                        <Image
                          src={
                            job.company.CD_Company_Logo_URL ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={job.company.CD_Company_Name || "Company logo"}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      ) : (
                        <Building className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">
                        {job.HCJ_JP_Job_Title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                        <span className="font-medium">
                          {job.company?.CD_Company_Name || "Company"}
                        </span>
                        <span>•</span>
                        <span>
                          {job.HCJ_JDT_Job_Location || "Location not specified"}
                        </span>
                        <span>•</span>
                        <span>{getTimeAgo(job.HCJ_JDT_Posted_DtTym)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-full h-9 w-9 ${
                        saved ? "text-primary border-primary" : ""
                      }`}
                      onClick={handleSaveJob}
                    >
                      <Bookmark
                        className="h-4 w-4"
                        fill={saved ? "currentColor" : "none"}
                      />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    {getOpportunityType(job.HCJ_JP_Opportunity_Type)}
                  </Badge>
                  {job.HCJ_JP_Job_Skills?.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 bg-white"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium">
                        {job.displaySalary || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {job.HCJ_JDT_Job_Location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="font-medium">
                        {formatDate(job.HCJ_JDT_Application_Deadline)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleApply}
                    disabled={
                      applicationStatus === "applied" ||
                      applicationStatus === "received"
                    }
                  >
                    {applicationStatus === "applied" ||
                    applicationStatus === "received" ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Applied
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="lg"
                    onClick={handleSaveJob}
                  >
                    {saved ? "Saved" : "Save for Later"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Job details tabs */}
            <Card>
              <Tabs defaultValue="description">
                <TabsList className="w-full border-b rounded-none p-0">
                  <TabsTrigger
                    value="description"
                    className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="company"
                    className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Company
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="p-6">
                  {/* Job description */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                      Job Description
                    </h2>
                    <div className="prose max-w-none text-gray-700">
                      <p>
                        {job.HCJ_JP_Job_Description ||
                          "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  {job.HCJ_JP_Responsibility && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">
                        Responsibilities
                      </h2>
                      <div className="space-y-3">
                        {job.HCJ_JP_Responsibility.split("\n")
                          .filter((item) => item.trim())
                          .map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <p className="text-gray-700">{item}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Additional preferences */}
                  {job.HCJ_JP_Additional_Preferences && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">
                        Additional Preferences
                      </h2>
                      <div className="space-y-3">
                        {job.HCJ_JP_Additional_Preferences.split("\n")
                          .filter((item) => item.trim())
                          .map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <p className="text-gray-700">{item}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Perks */}
                  {job.HCJ_JP_Perks && job.HCJ_JP_Perks.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">
                        Perks & Benefits
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.HCJ_JP_Perks.map((perk, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-gray-50 p-3 rounded-md"
                          >
                            <Award className="h-5 w-5 text-primary" />
                            <p className="text-gray-700 capitalize">
                              {perk.replace(/-/g, " ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Application deadline */}
                  {job.HCJ_JDT_Application_Deadline && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-800">
                          Application Deadline
                        </p>
                        <p className="text-sm text-yellow-700">
                          Applications close on{" "}
                          {formatDate(job.HCJ_JDT_Application_Deadline)}
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="company" className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-white border flex items-center justify-center">
                      {job.company ? (
                        <Image
                          src={
                            job.company.CD_Company_Logo_URL ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={job.company.CD_Company_Name || "Company logo"}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      ) : (
                        <Building className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {job.company?.CD_Company_Name || "Company"}
                      </h2>
                      <p className="text-gray-600">
                        {job.HCJ_JDT_Job_Location || "Location not specified"}
                      </p>
                    </div>
                  </div>

                  {job.company?.CD_Company_Website && (
                    <div className="mb-6">
                      <a
                        href={job.company.CD_Company_Website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary flex items-center gap-1 hover:underline"
                      >
                        Visit company website
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <p className="text-gray-700">
                      This company has posted{" "}
                      {Math.floor(Math.random() * 10) + 1} active opportunities
                      on our platform.
                    </p>
                  </div>

                  <Button variant="outline" className="w-full">
                    View All Jobs from this Company
                  </Button>
                </TabsContent>

                <TabsContent value="reviews" className="p-6">
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                    <p className="text-gray-500 mb-4">
                      Be the first to review your experience with this company
                    </p>
                    <Button>Write a Review</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Similar jobs */}
            {similarJobs.length > 0 && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Similar Opportunities
                  </h2>
                  <div className="space-y-4">
                    {similarJobs.map((similarJob) => (
                      <div
                        key={similarJob._id}
                        className="flex items-start gap-4 p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/job/${similarJob._id}`)}
                      >
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-white border flex items-center justify-center">
                          <Building className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">
                            {similarJob.HCJ_JP_Job_Title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                            <span>
                              {similarJob.company?.CD_Company_Name || "Company"}
                            </span>
                            <span>•</span>
                            <span>
                              {similarJob.HCJ_JDT_Job_Location ||
                                "Location not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {getOpportunityType(
                                similarJob.HCJ_JP_Opportunity_Type
                              )}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {similarJob.displaySalary ||
                                "Salary not specified"}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            {/* Match score card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Your Match Score</h2>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Match</span>
                    <span className="font-medium">{matchScore}%</span>
                  </div>
                  <Progress value={matchScore} className="h-2" />
                </div>

                <div
                  className={`p-3 rounded-md ${
                    matchScore > 80
                      ? "bg-green-50 text-green-800"
                      : matchScore > 60
                      ? "bg-yellow-50 text-yellow-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {matchScore > 80
                      ? "Great match! Your profile aligns well with this opportunity."
                      : matchScore > 60
                      ? "Good match. You meet many of the requirements."
                      : "You may need additional skills for this role."}
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Skills match</span>
                    <Badge
                      variant={matchScore > 70 ? "success" : "outline"}
                      className="text-xs"
                    >
                      {Math.min(100, matchScore + 10)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Experience match</span>
                    <Badge
                      variant={matchScore > 60 ? "success" : "outline"}
                      className="text-xs"
                    >
                      {Math.max(40, matchScore - 15)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Location match</span>
                    <Badge variant="success" className="text-xs">
                      100%
                    </Badge>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={handleApply}
                  disabled={
                    applicationStatus === "applied" ||
                    applicationStatus === "received"
                  }
                >
                  {applicationStatus === "applied" ||
                  applicationStatus === "received"
                    ? "Applied"
                    : "Apply Now"}
                </Button>
              </CardContent>
            </Card>

            {/* Job insights */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Job Insights</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Posted</p>
                      <p className="font-medium">
                        {getTimeAgo(job.HCJ_JDT_Posted_DtTym)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Applicants</p>
                      <p className="font-medium">
                        {Math.floor(Math.random() * 50) + 10} applicants
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Job Type</p>
                      <p className="font-medium">
                        {getOpportunityType(job.HCJ_JP_Opportunity_Type)}
                      </p>
                    </div>
                  </div>

                  {job.HCJ_JP_Internship_Duration && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">
                          {job.HCJ_JP_Internship_Duration}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company reviews */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Company Reviews</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                  <span className="text-sm text-gray-500">
                    4.0 (24 reviews)
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">John Doe</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      &quot;Great company culture and work-life balance. Learned a
                      lot during my time here.&quot;
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const JobDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-10 w-24 bg-gray-200 rounded mb-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-100 p-6 border-b">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-8 w-3/4 rounded mb-2" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-20 rounded" />
                  <Skeleton className="h-6 w-20 rounded" />
                  <Skeleton className="h-6 w-20 rounded" />
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-16 rounded mb-1" />
                        <Skeleton className="h-5 w-24 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Skeleton className="h-12 flex-1 rounded" />
                  <Skeleton className="h-12 flex-1 rounded" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b">
                <div className="flex">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-10 flex-1 rounded-none" />
                  ))}
                </div>
              </div>
              <div className="p-6">
                <Skeleton className="h-7 w-48 rounded mb-4" />
                <div className="space-y-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full rounded" />
                  ))}
                </div>

                <Skeleton className="h-7 w-48 rounded mb-4" />
                <div className="space-y-3 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                      <Skeleton className="h-4 w-full rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <Skeleton className="h-7 w-40 rounded mb-4" />
                  <div className="space-y-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                        <Skeleton className="h-4 w-full rounded" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
