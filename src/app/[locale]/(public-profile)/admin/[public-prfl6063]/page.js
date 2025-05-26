// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Link } from "@/i18n/routing";
// import {
//   Briefcase,
//   ExternalLink,
//   Globe,
//   Mail,
//   MapPin,
//   MessageSquare,
//   Phone,
//   Share2,
//   Users,
// } from "lucide-react";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function PublicProfilePage() {
//   const params = useParams();
//   const userId = params?.["public-prfl6063"]; // Extract user ID from dynamic route

//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!userId) {
//       console.error("User ID is missing in URL");
//       setError("User ID is missing in URL");
//       setLoading(false);
//       return;
//     }

//     const fetchProfileData = async () => {
//       try {
//         const response = await fetch(`/api/hcj/v1/adminPublicProfile/${userId}`);
//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.message || "Failed to load profile data");
//         }

//         setProfileData(data.data);
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setError(err.message);
//       } finally {
//         // Simulate a minimum loading time for better UX
//         setTimeout(() => setLoading(false), 300);
//       }
//     };

//     fetchProfileData();
//   }, [userId]);

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
//         <Card className="p-8 max-w-md w-full">
//           <div className="text-center space-y-4">
//             <h2 className="text-2xl font-bold text-red-500">
//               Error Loading Profile
//             </h2>
//             <p className="text-muted-foreground">{error}</p>
//             <Button asChild>
//               <Link href="/">Return to Home</Link>
//             </Button>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background dark:bg-gray-900 pb-20">
//       {/* Cover Image */}
//       <div className="relative h-[200px] md:h-[300px] w-full bg-gray-100 dark:bg-gray-800">
//         {loading ? (
//           <Skeleton className="h-full w-full" />
//         ) : (
//           <Image
//             src={
//               profileData?.individualDetails?.ID_Cover_Photo ||
//               "/image/profile.svg"
//             }
//             alt="Cover"
//             className="object-cover"
//             fill
//             priority
//           />
//         )}
//       </div>

//       <div className="max-w-4xl mx-auto px-4">
//         {/* Profile Section */}
//         <div className="relative -mt-24 mb-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
//             {/* Profile Image */}
//             <div className="relative">
//               {loading ? (
//                 <Skeleton className="w-[180px] h-[180px] rounded-lg" />
//               ) : (
//                 <Image
//                   src={
//                     profileData?.individualDetails?.ID_Profile_Picture ||
//                     "/image/user.png"
//                   }
//                   alt="Profile"
//                   width={180}
//                   height={180}
//                   className="rounded-lg border-4 border-background dark:border-gray-800 bg-white"
//                   priority
//                 />
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-2 mt-4 sm:mt-28">
//               <Button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
//                 <MessageSquare className="w-4 h-4 mr-2" />
//                 Send message
//               </Button>
//               <Button variant="outline" className="px-4 py-2 rounded-md">
//                 <Share2 className="w-4 h-4 mr-2" />
//                 Share
//               </Button>
//             </div>
//           </div>

//           {/* Social Links */}
//           {!loading && profileData?.socialLinks && (
//             <div className="mt-4 sm:absolute sm:top-40 sm:right-0 flex gap-4">
//               {profileData.socialLinks.SL_QR_Code && (
//                 <Link
//                   href={profileData.socialLinks.SL_QR_Code}
//                   className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
//                 >
//                   <Image
//                     src="/image/institutndashboard/dashpage/myprofile/four.svg"
//                     alt="QR Code"
//                     width={30}
//                     height={30}
//                     className="w-8 h-8"
//                   />
//                 </Link>
//               )}
//               {profileData.socialLinks.SL_LinkedIn_Url && (
//                 <Link
//                   href={profileData.socialLinks.SL_LinkedIn_Url}
//                   className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
//                 >
//                   <Image
//                     src="/image/institutndashboard/dashpage/myprofile/linkedin.svg"
//                     alt="LinkedIn"
//                     width={30}
//                     height={30}
//                     className="w-8 h-8"
//                   />
//                 </Link>
//               )}
//               {profileData.socialLinks.SL_Facebook_Url && (
//                 <Link
//                   href={profileData.socialLinks.SL_Facebook_Url}
//                   className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
//                 >
//                   <Image
//                     src="/image/institutndashboard/dashpage/myprofile/fb.svg"
//                     alt="Facebook"
//                     width={30}
//                     height={30}
//                     className="w-8 h-8"
//                   />
//                 </Link>
//               )}
//               {profileData.socialLinks.SL_Instagram_Url && (
//                 <Link
//                   href={profileData.socialLinks.SL_Instagram_Url}
//                   className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
//                 >
//                   <Image
//                     src="/image/institutndashboard/dashpage/myprofile/ig.svg"
//                     alt="Instagram"
//                     width={30}
//                     height={30}
//                     className="w-8 h-8"
//                   />
//                 </Link>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Profile Info */}
//         <Card className="p-6 dark:bg-gray-800 shadow-md">
//           {loading ? (
//             <ProfileSkeleton />
//           ) : (
//             <div className="space-y-6">
//               <div>
//                 <h1 className="text-2xl font-bold dark:text-white">
//                   {profileData?.individualDetails?.ID_First_Name}{" "}
//                   {profileData?.individualDetails?.ID_Last_Name}
//                 </h1>
//                 <p className="text-muted-foreground dark:text-gray-400 mt-1">
//                   {profileData?.individualDetails?.ID_Individual_Designation ||
//                     "No designation"}
//                 </p>
//                 <div className="flex items-center gap-4 mt-3">
//                   <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
//                     <Users className="w-4 h-4" />
//                     <span>{profileData?.user?.followers || 0} Followers</span>
//                   </div>
//                   <Button
//                     size="sm"
//                     className="bg-primary text-white dark:bg-blue-600 dark:hover:bg-blue-700"
//                   >
//                     Follow
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {profileData?.address && (
//                   <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
//                     <MapPin className="w-4 h-4 shrink-0" />
//                     <span>
//                       {profileData.address.IAD_City},{" "}
//                       {profileData.address.IAD_State}
//                       {profileData.address.IAD_Country
//                         ? `, ${profileData.address.IAD_Country}`
//                         : ""}
//                     </span>
//                   </div>
//                 )}

//                 {profileData?.individualDetails?.ID_Individual_Designation && (
//                   <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
//                     <Briefcase className="w-4 h-4 shrink-0" />
//                     <span>
//                       {profileData.individualDetails.ID_Individual_Designation}
//                     </span>
//                   </div>
//                 )}

//                 {profileData?.individualDetails?.ID_Bio && (
//                   <div className="flex items-start gap-2 text-muted-foreground dark:text-gray-400">
//                     <Mail className="w-4 h-4 mt-1 shrink-0" />
//                     <p className="leading-relaxed">
//                       {profileData.individualDetails.ID_Bio}
//                     </p>
//                   </div>
//                 )}

//                 {profileData?.socialLinks?.SL_Website_Url && (
//                   <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
//                     <Globe className="w-4 h-4 shrink-0" />
//                     <Link
//                       href={profileData.socialLinks.SL_Website_Url}
//                       className="text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
//                     >
//                       {profileData.socialLinks.SL_Website_Url}
//                       <ExternalLink className="w-3 h-3 ml-1" />
//                     </Link>
//                   </div>
//                 )}

//                 {profileData?.individualDetails?.ID_Phone && (
//                   <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
//                     <Phone className="w-4 h-4 shrink-0" />
//                     <span>{profileData.individualDetails.ID_Phone}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Additional Information Section */}
//               {profileData?.individualDetails?.ID_Additional_Info && (
//                 <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                   <h2 className="text-lg font-semibold mb-2 dark:text-white">
//                     Additional Information
//                   </h2>
//                   <p className="text-muted-foreground dark:text-gray-400">
//                     {profileData.individualDetails.ID_Additional_Info}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// }

// function ProfileSkeleton() {
//   return (
//     <div className="space-y-6 animate-pulse">
//       <div>
//         <Skeleton className="h-8 w-48 mb-2" />
//         <Skeleton className="h-4 w-32 mb-4" />
//         <div className="flex items-center gap-4">
//           <Skeleton className="h-4 w-24" />
//           <Skeleton className="h-8 w-20" />
//         </div>
//       </div>

//       <div className="space-y-4">
//         <Skeleton className="h-4 w-full max-w-md" />
//         <Skeleton className="h-4 w-full max-w-sm" />
//         <div className="flex flex-col gap-2">
//           <Skeleton className="h-4 w-full" />
//           <Skeleton className="h-4 w-full" />
//           <Skeleton className="h-4 w-3/4" />
//         </div>
//         <Skeleton className="h-4 w-full max-w-xs" />
//         <Skeleton className="h-4 w-32" />
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import {
  Briefcase,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SlCalender } from "react-icons/sl";

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params?.["public-prfl6063"]; // your dynamic param

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleMapping = {
    "06": "Administrator",
    "07": "Team Member",
    "08": "Support Staff",
  };

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
          `/api/hcj/v1/adminPublicProfile/${userId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile data");
        }

        setProfileData(data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
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

  const individual = profileData?.individualDetails;
  const address = profileData?.address;
  const social = profileData?.socialLinks;
  const visibility = profileData?.visibility;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 pb-20">
      {/* Cover Image */}
      <div className="relative h-[200px] md:h-[300px] w-full bg-gray-100 dark:bg-gray-800">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Image
            src={individual?.ID_Cover_Photo || "/image/cover.png"}
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
                  src={individual?.ID_Profile_Picture || "/image/profile.png"}
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
                <MessageSquare className="w-4 h-4 mr-2" />
                Send message
              </Button>
              <Button variant="outline" className="px-4 py-2 rounded-md">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Social Links */}
          {!loading && social && (
            <div className="mt-4 sm:absolute sm:top-40 sm:right-0 flex gap-4">
              {social?.SL_QR_Code && (
                <Link href={social.SL_QR_Code} className="hover:text-primary">
                  <Image
                    src="/image/institutndashboard/dashpage/myprofile/four.svg"
                    alt="QR"
                    width={30}
                    height={30}
                  />
                </Link>
              )}
              {social?.SL_LinkedIn_Profile && (
                <Link
                  href={social.SL_LinkedIn_Profile}
                  className="hover:text-primary"
                >
                  <Image
                    src="/image/institutndashboard/dashpage/myprofile/linkedin.svg"
                    alt="LinkedIn"
                    width={30}
                    height={30}
                  />
                </Link>
              )}
              {social?.SL_Facebook_Url && (
                <Link
                  href={social.SL_Facebook_Url}
                  className="hover:text-primary"
                >
                  <Image
                    src="/image/institutndashboard/dashpage/myprofile/fb.svg"
                    alt="Facebook"
                    width={30}
                    height={30}
                  />
                </Link>
              )}
              {social?.SL_Instagram_Url && (
                <Link
                  href={social.SL_Instagram_Url}
                  className="hover:text-primary"
                >
                  <Image
                    src="/image/institutndashboard/dashpage/myprofile/ig.svg"
                    alt="Instagram"
                    width={30}
                    height={30}
                  />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <Card className="mt-0 sm:mt-16 p-6 dark:bg-gray-800 shadow-md">
          {loading ? (
            <ProfileSkeleton />
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold dark:text-white">
                  {individual?.ID_First_Name} {individual?.ID_Last_Name}
                </h1>
                <p className="text-muted-foreground dark:text-gray-400 mt-1">
                  {individual?.ID_Individual_Designation || "No designation"}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{profileData?.user?.followers || 0} Followers</span>
                  </div>
                  <Button size="sm" className="bg-primary text-white">
                    Follow
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {individual?.ID_About && (
                  <div className="mt-4 text-muted-foreground dark:text-gray-300">
                    <h3 className="text-md font-semibold mb-1">About</h3>
                    <p>{individual.ID_About}</p>
                  </div>
                )}

                {individual?.ID_Individual_Role && (
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>
                      {roleMapping[individual.ID_Individual_Role] || "User"}
                    </span>
                  </div>
                )}

                {profileData?.languages?.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold mb-2">Languages</h3>
                    <ul className="text-muted-foreground dark:text-gray-400 list-disc pl-5">
                      {profileData.languages.map((lang, i) => (
                        <li key={i} className="mb-2">
                          <div>
                            {lang.HCJ_JSL_Language} –{" "}
                            {lang.HCJ_JSL_Language_Proficiency_Level === "01" &&
                              "Basic"}
                            {lang.HCJ_JSL_Language_Proficiency_Level === "02" &&
                              "Intermediate"}
                            {lang.HCJ_JSL_Language_Proficiency_Level === "03" &&
                              "Fluent"}
                            {lang.HCJ_JSL_Language_Proficiency_Level === "04" &&
                              "Native"}
                            {!["01", "02", "03", "04"].includes(
                              lang.HCJ_JSL_Language_Proficiency_Level
                            ) && "Unknown"}
                          </div>
                          {lang.HCJ_JSL_Language_Proficiency &&
                            lang.HCJ_JSL_Language_Proficiency.length > 0 && (
                              <div className="text-xs text-gray-400 mt-1">
                                {lang.HCJ_JSL_Language_Proficiency.includes(
                                  "01"
                                ) && "Reading "}
                                {lang.HCJ_JSL_Language_Proficiency.includes(
                                  "02"
                                ) && "Writing "}
                                {lang.HCJ_JSL_Language_Proficiency.includes(
                                  "03"
                                ) && "Speaking "}
                              </div>
                            )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {visibility?.IIV_Address_Line1 &&
                  address?.IAD_Address_Line1 && (
                    <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{address.IAD_Address_Line1}</span>
                    </div>
                  )}

                {visibility?.IIV_Email && individual?.ID_Email && (
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>{individual.ID_Email}</span>
                  </div>
                )}

                {individual?.ID_Alternate_Email && (
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="text-gray-500">Alternate:</span>
                    <span>{individual.ID_Alternate_Email}</span>
                  </div>
                )}

                {visibility?.IIV_Phone_Number && individual?.ID_Phone && (
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{individual.ID_Phone}</span>
                  </div>
                )}

                {individual?.ID_Alternate_Phone && (
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="text-gray-500">Alternate:</span>
                    <span>{individual.ID_Alternate_Phone}</span>
                  </div>
                )}

                {individual?.createdAt && (
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                    <SlCalender className="w-4 h-4 shrink-0" />
                    <span>
                      Joined{" "}
                      {new Date(individual.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )}
                    </span>
                  </div>
                )}

                {social?.SL_Website_Url && (
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                    <Globe className="w-4 h-4 shrink-0" />
                    <Link
                      href={social.SL_Website_Url}
                      className="text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                    >
                      {social.SL_Website_Url}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
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
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full max-w-xs" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
