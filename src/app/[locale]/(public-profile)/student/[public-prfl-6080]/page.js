"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import {
  AlignLeft,
  Briefcase,
  Building2,
  Download,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  UserCog,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentPublicProfilePage() {
  const params = useParams();
  const userId = params?.["public-prfl-6080"];

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing in URL");
      setError("User ID is missing in URL");
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `/api/hcj/v1/studentpublicprofile/${userId}`
        );
        const data = await response.json();
        // console.log("aditya", data);
        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile data");
        }

        setProfileData(data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        // Simulate a minimum loading time for better UX
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              Error Loading Profile
            </h2>
            <p className="text-muted-foreground">{error}</p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 pb-20">
      {/* Cover Image */}
      <div className="relative h-[200px] md:h-[300px] w-full bg-gray-100 dark:bg-gray-800">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Image
            src={
              profileData?.individualDetails?.ID_Cover_Photo ||
              "/image/cover.png" 
            }
            alt="Cover"
            className="object-cover"
            fill
            priority
          />
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Section */}
        <div className="relative -mt-24 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            {/* Profile Image */}
            <div className="relative">
              {loading ? (
                <Skeleton className="w-[180px] h-[180px] rounded-lg" />
              ) : (
                <Image
                  src={
                    profileData?.individualDetails?.ID_Profile_Picture ||
                    "/image/profile.png"
                  }
                  alt="Profile"
                  width={180}
                  height={180}
                  className="rounded-lg border-4 border-background dark:border-gray-800 bg-white"
                  priority
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 sm:mt-28">
              <Button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                <Users className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline" className="px-4 py-2 rounded-md">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="px-4 py-2 rounded-md">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Social Links */}
          {!loading && profileData?.socialLinks && (
            <div className="mt-4 sm:absolute sm:top-40 sm:right-0 flex gap-4">
              {profileData.socialLinks.SL_LinkedIn_Profile && (
                <Link
                  href={profileData.socialLinks.SL_LinkedIn_Profile}
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
                >
                  <Image
                    src="/image/institutndashboard/dashpage/myprofile/linkedin.svg"
                    alt="LinkedIn"
                    width={30}
                    height={30}
                    className="w-8 h-8"
                  />
                </Link>
              )}
              {profileData.socialLinks.SL_Facebook_Url && (
                <Link
                  href={profileData.socialLinks.SL_Facebook_Url}
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
                >
                  <Image
                    src="/image/institutndashboard/dashpage/myprofile/fb.svg"
                    alt="Facebook"
                    width={30}
                    height={30}
                    className="w-8 h-8"
                  />
                </Link>
              )}
              {profileData.socialLinks.SL_Instagram_Url && (
                <Link
                  href={profileData.socialLinks.SL_Instagram_Url}
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
                >
                  <Image
                    src="/image/institutndashboard/dashpage/myprofile/ig.svg"
                    alt="Instagram"
                    width={30}
                    height={30}
                    className="w-8 h-8"
                  />
                </Link>
              )}
              {profileData?.socialLinks?.SL_Portfolio_Url && (
                <Link
                  href={profileData.socialLinks.SL_Portfolio_Url}
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
                >
                  <Image
                    src="/image/institutndashboard/dashpage/myprofile/four.svg"
                    alt="Portfolio"
                    width={30}
                    height={30}
                    className="w-8 h-8"
                  />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <Card className="p-6 dark:bg-gray-800 shadow-md">
          {loading ? (
            <ProfileSkeleton />
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold dark:text-white">
                  {profileData?.individualDetails?.ID_First_Name}{" "}
                  {profileData?.individualDetails?.ID_Last_Name}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground dark:text-gray-400 mt-1">
                    {profileData?.individualDetails?.ID_Profile_Headline ||
                      "Student"}
                  </p>
                </div>

                {profileData?.individualDetails?.ID_Individual_Designation && (
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <p className="text-muted-foreground dark:text-gray-400 mt-1">
                      {profileData?.individualDetails
                        ?.ID_Individual_Designation || "Add Designation"}
                    </p>
                  </div>
                )}
                {profileData?.individualDetails?.ID_About && (
                  <div className="flex items-center gap-2">
                    <AlignLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <p className="text-muted-foreground dark:text-gray-400 mt-1">
                      {profileData?.individualDetails?.ID_About || "Add About"}
                    </p>
                  </div>
                )}

                {profileData?.user?.followers && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{profileData?.user?.followers || 0} Followers</span>
                    </div>
                  </div>
                )}

                {profileData?.visibility?.IIV_Phone_Number &&
                  profileData?.individualDetails?.ID_Phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <p className="text-muted-foreground dark:text-gray-400 mt-1">
                        {profileData.individualDetails.ID_Phone}
                      </p>
                    </div>
                  )}

                {profileData?.visibility?.IIV_Email &&
                  profileData?.individualDetails?.ID_Email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <p className="text-muted-foreground dark:text-gray-400 mt-1">
                        {profileData.individualDetails.ID_Email}
                      </p>
                    </div>
                  )}

                {profileData?.visibility?.IIV_Address_Line1 &&
                  profileData?.address?.IAD_Address_Line1 && (
                    <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{profileData.address.IAD_Address_Line1}</span>
                    </div>
                  )}

                {profileData?.visibility?.IIV_Address_Line2 &&
                  profileData?.address?.IAD_Address_Line2 && (
                    <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{profileData.address.IAD_Address_Line2}</span>
                    </div>
                  )}

                {profileData?.visibility?.IIV_Landmark &&
                  profileData?.address?.IAD_Landmark && (
                    <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{profileData.address.IAD_Landmark}</span>
                    </div>
                  )}

                {profileData?.visibility?.IIV_Pincode &&
                  profileData?.address?.IAD_Pincode && (
                    <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{profileData.address.IAD_Pincode}</span>
                    </div>
                  )}

                {profileData?.visibility?.IIV_Website_Url_Visibility &&
                  profileData?.socialLinks?.SL_Website_Url && (
                    <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                      <Globe className="w-4 h-4 shrink-0" />
                      <Link
                        href={profileData.socialLinks.SL_Website_Url}
                        className="text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                      >
                        {profileData.socialLinks.SL_Website_Url}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  )}

                {/* <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <p className="text-muted-foreground dark:text-gray-400 mt-1">
                    {profileData?.individualDetails?.ID_Phone || "+91 xxxxx"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <p className="text-muted-foreground dark:text-gray-400 mt-1">
                    {profileData?.individualDetails?.ID_Email ||
                      "abc@gmail.com"}
                  </p>
                </div> */}

                {/* <div className="space-y-4 gap-2">
                  {profileData?.address && (
                    <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>
                        {profileData.address.IAD_City},{" "}
                        {profileData.address.IAD_State}
                        {profileData.address.IAD_Country
                          ? `, ${profileData.address.IAD_Country}`
                          : ""}
                      </span>
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          )}
        </Card>

        {/* Skills Section */}
        <Card className="mt-6 p-6 dark:bg-gray-800 shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Skills</h2>
          {loading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          ) : profileData?.skills && profileData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profileData.skills.flatMap((skillObj, index) =>
                skillObj.HCJ_SKT_Skills
                  ? skillObj.HCJ_SKT_Skills.map((skill, idx) => (
                      <Badge
                        key={`${index}-${idx}`}
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                      >
                        {skill}
                      </Badge>
                    ))
                  : []
              )}
            </div>
          ) : (
            <p className="text-muted-foreground dark:text-gray-400">
              No skills listed
            </p>
          )}
        </Card>

        {/* Work Experience Section */}
        <Card className="mt-6 p-6 dark:bg-gray-800 shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Work Experience
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : profileData?.experiences && profileData.experiences.length > 0 ? (
            <div className="space-y-6">
              {profileData.experiences.map((exp, index) => {
                const startDate = exp.HCJ_JSX_Start_Date
                  ? new Date(exp.HCJ_JSX_Start_Date)
                  : null;
                const endDate = exp.HCJ_JSX_End_Date
                  ? new Date(exp.HCJ_JSX_End_Date)
                  : null;
                const formatDate = (date) =>
                  date
                    ? date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })
                    : "";
                const duration =
                  startDate && (endDate || exp.HCJ_JSX_Currently_Working)
                    ? `${formatDate(startDate)} - ${
                        exp.HCJ_JSX_Currently_Working
                          ? "Present"
                          : formatDate(endDate)
                      }`
                    : "";

                return (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center dark:text-blue-100 text-xl font-semibold">
                      {exp.HCJ_JSX_Company_Name
                        ? exp.HCJ_JSX_Company_Name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">
                        {exp.HCJ_JSX_Job_Title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {exp.HCJ_JSX_Company_Name || "Unknown Company"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {duration}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exp.HCJ_JSX_City}
                        {exp.HCJ_JSX_Country
                          ? `, ${exp.HCJ_JSX_Country}`
                          : ""}{" "}
                        • {exp.HCJ_JSX_Work_Mode}
                      </p>
                      {exp.HCJ_JSX_Job_Description && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {exp.HCJ_JSX_Job_Description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground dark:text-gray-400">
              No work experience listed
            </p>
          )}
        </Card>

        {/* Education Section */}
        <Card className="mt-6 p-6 dark:bg-gray-800 shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Education
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : profileData?.educations && profileData.educations.length > 0 ? (
            <div className="space-y-6">
              {profileData.educations.map((edu, index) => {
                const startDate = edu.IE_Start_Date
                  ? new Date(edu.IE_Start_Date)
                  : null;
                const endDate = edu.IE_End_Date
                  ? new Date(edu.IE_End_Date)
                  : null;
                const formatDate = (date) =>
                  date
                    ? date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })
                    : "";
                const duration =
                  startDate && endDate
                    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                    : "";

                return (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">
                        {edu.IE_Institute_Name}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {edu.IE_Program_Name}
                        {edu.IE_Specialization
                          ? `, ${edu.IE_Specialization.replace(
                              /^0-/,
                              ""
                            ).replace(/_/g, " ")}`
                          : ""}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {duration}
                      </p>
                      {edu.IE_Score_Grades && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {edu.IE_Score_Grades}: {edu.IE_Score_Grades_Value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground dark:text-gray-400">
              No education listed
            </p>
          )}
        </Card>

        {/* Projects Section */}
        <Card className="mt-6 p-6 dark:bg-gray-800 shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Projects
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : profileData?.projects && profileData.projects.length > 0 ? (
            <div className="space-y-6">
              {profileData.projects.map((project, index) => {
                const startDate = project.HCJ_JSP_Start_Date
                  ? new Date(project.HCJ_JSP_Start_Date)
                  : null;
                const endDate = project.HCJ_JSP_End_Date
                  ? new Date(project.HCJ_JSP_End_Date)
                  : null;
                const formatDate = (date) =>
                  date
                    ? date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })
                    : "";
                const duration =
                  startDate && endDate
                    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                    : "";

                return (
                  <div key={index}>
                    <h3 className="font-semibold text-lg dark:text-white">
                      {project.HCJ_JSP_Project_Name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {project.HCJ_JSP_Company_Name || "Personal Project"} •{" "}
                      {duration}
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {project.HCJ_JSP_Project_Description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground dark:text-gray-400">
              No projects listed
            </p>
          )}
        </Card>

        {/* Volunteering Section */}
        <Card className="mt-6 p-6 dark:bg-gray-800 shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Volunteering
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : profileData?.volunteeringActivities &&
            profileData.volunteeringActivities.length > 0 ? (
            <div className="space-y-6">
              {profileData.volunteeringActivities.map((activity, index) => {
                const startDate = activity.HCJ_JSV_Start_Date
                  ? new Date(activity.HCJ_JSV_Start_Date)
                  : null;
                const endDate = activity.HCJ_JSV_End_Date
                  ? new Date(activity.HCJ_JSV_End_Date)
                  : null;
                const formatDate = (date) =>
                  date
                    ? date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })
                    : "";
                const duration =
                  startDate && endDate
                    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                    : "";

                return (
                  <div key={index}>
                    <h3 className="font-semibold text-lg dark:text-white">
                      {activity.HCJ_JSV_VolunteerActivity_Name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.HCJ_JSV_Company_Name} • {duration}
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {activity.HCJ_JSV_VolunteerActivity_Description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground dark:text-gray-400">
              No volunteering activities listed
            </p>
          )}
        </Card>

        {/* Location Preferences Section */}
        {profileData?.locationPreference && (
          <Card className="mt-6 p-6 dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Location Preferences
            </h2>
            <div className="flex flex-wrap gap-2">
              {profileData.locationPreference
                .split(",")
                .map((location, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-sm whitespace-nowrap bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                  >
                    {location.trim()}
                  </Badge>
                ))}
            </div>
          </Card>
        )}

        {/* Resume Section */}
        {profileData?.resumeUrl && (
          <Card className="mt-6 p-6 dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Resume
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                  <Download className="h-5 w-5 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium dark:text-white">Resume</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click download to view the resume
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => window.open(profileData.resumeUrl, "_blank")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </Card>
        )}

        {/* Languages Section */}
        {profileData?.languages.map((lang, index) => (
          <li key={index}>
            <div className="text-base font-medium capitalize dark:text-white">
              {lang.HCJ_JSL_Language}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Proficiency Level: {lang.HCJ_JSL_Language_Proficiency_Level}
            </div>
            {lang.HCJ_JSL_Language_Proficiency && (
              <div className="text-xs text-gray-400 mt-1">
                {lang.HCJ_JSL_Language_Proficiency.join(", ")}
              </div>
            )}
          </li>
        ))}

        {/* {profileData?.languages && profileData.languages.length > 0 && (
          <Card className="mt-6 p-6 dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Languages</h2>
            <ul className="space-y-4">
              {profileData.languages.map((lang, index) => (
                <li key={index}>
                  <div className="text-base font-medium capitalize dark:text-white">{lang.language}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{lang.proficiencyLevel}</div>
                  {lang.proficiency && <div className="text-xs text-gray-400 mt-1">{lang.proficiency.join(", ")}</div>}
                </li>
              ))}
            </ul>
          </Card>
        )} */}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-full max-w-sm" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-4 w-full max-w-xs" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
