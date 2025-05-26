"use client";
import { useAbility } from "@/Casl/CaslContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { MailCheck, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SlCalender } from "react-icons/sl";

export default function ProfilePage() {
  // States to hold fetched data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [languages, setLanguages] = useState([]);
  const roleMapping = {
    "06": "Administrator",
    "07": "Team Member",
    "08": "Support Staff",
  };

  const ability = useAbility();

  // console.log('Session Data:', session);
  // console.log('Auth Status:', status);

  useEffect(() => {
    // Prevent API call until session is fully available
    if (status !== "authenticated") return;

    // Fetch profile data from API
    const fetchProfileData = async () => {
      try {
        if (!session || !session.user) {
          console.log("Session Error: User not authenticated");
          setError("Unauthorized: Please log in");
          setLoading(false);
          return;
        }

        const administratorId = session.user.id;

        if (!administratorId) {
          console.log("Administrator ID not found in session");
          setError("User ID not found");
          setLoading(false);
          return;
        }

        console.log("Fetching data for administrator ID:", administratorId);

        const response = await fetch(
          `/api//institution/v1/hcjArET60521FetchAdminData/${administratorId}`
        );

        const data = await response.json();
        console.log("API Response:", data);

        if (!response.ok) {
          setError(data.message || "Failed to load profile data");
        } else {
          setProfileData(data.data);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session, status]); // Runs only when session & auth status changes

  useEffect(() => {
    // Only fetch languages if we have profile data and user ID
    if (
      profileData &&
      profileData.individualDetails &&
      profileData.individualDetails._id
    ) {
      const fetchLanguages = async () => {
        try {
          const individualId = profileData.individualDetails._id;
          const response = await fetch(
            `/api/institution/v1/hcjBrTo60615UserLanguage/${individualId}`
          );
          const data = await response.json();

          if (response.ok && data.success) {
            console.log("Languages data:", data.data);
            setLanguages(data.data);
          } else {
            console.error("Failed to fetch languages:", data.message);
          }
        } catch (err) {
          console.error("Error fetching languages:", err);
        }
      };

      fetchLanguages();
    }
  }, [profileData]);

  // Render loading skeletons
  if (loading || status === "loading") {
    return (
      <div className="max-w-full mx-auto p-5">
        <div className="text-center mb-5">
          <Skeleton className="h-52 w-full" />
        </div>
        <div className="container mx-auto flex flex-col sm:flex-row items-start justify-between mb-5 sm:px-16">
          <div className="flex flex-col items-center sm:items-start">
            <Skeleton className="h-24 w-24 rounded-full mb-2" />
            <Skeleton className="h-6 w-40 mb-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="container mx-auto sm:px-16">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full dark:bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error message
  if (error) {
    return (
      <div className="max-w-full mx-auto p-5 text-center">
        <h2 className="text-xl font-semibold text-red-500">
          Error Loading Profile
        </h2>
        <p className="text-gray-600">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Destructure fetched profile data
  const { user, individualDetails, address, socialLinks, documents } =
    profileData || {};
  const userId = user?._id || "defaultUserId";

  return (
    <div className="max-w-full mx-auto text-pretty mb-10">
      {/* Cover Photo Section */}

      <div className="text-center mb-5 ">
        <div className="relative h-52 bg-gray-200">
          {individualDetails?.ID_Cover_Photo ? (
            <Image
              src={
                `https://drive.google.com/thumbnail?id=${
                  individualDetails.ID_Cover_Photo.split("=")[1]
                }` || "/image/cover.png"
              }
              alt="Cover Photo"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <p className="pt-20 text-lg text-gray-500">Add cover photo</p>
          )}
        </div>
      </div>

      {/* Profile Photo and Basic Info */}
      <div className="container mx-auto flex flex-col sm:flex-row items-start md:items-start justify-between mb-5 sm:px-16 px-5">
        <div className="flex sm:flex-col flex-col items-start sm:items-start ">
          <Image
            src={
              individualDetails?.ID_Profile_Picture
                ? `https://drive.google.com/thumbnail?id=${
                    individualDetails.ID_Profile_Picture.split("=")[1]
                  }`
                : "/image/profile.png"
            }
            alt="Profile Photo"
            width={100}
            height={100}
            className="mr-5 rounded-lg mb-5"
          />
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">
              {individualDetails?.ID_First_Name &&
              individualDetails?.ID_Last_Name
                ? `${individualDetails.ID_First_Name} ${individualDetails.ID_Last_Name}`
                : "Jaya Kumar"}
            </h2>

            <p className="text-gray-600">
              {individualDetails?.ID_Profile_Headline ||
                "Add a short headline that describes you..."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/${userId}`}>
            <button className="w-32 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 hover:text-white">
              Preview
            </button>
          </Link>
          {ability.can("manage", "PersonalInfo") ? (
            <Link href="/institutn-dshbrd6051/my-prfl-edit6061">
              <button className="w-32 px-6 py-2 bg-primary text-white rounded-md">
                Edit
              </button>
            </Link>
          ) : (
            <button className="w-32 px-6 py-2 bg-primary text-white rounded-md">
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-5 sm:px-16">
        {/* Location */}
        <div className="flex items-center mb-3">
          <Image
            src="/image/institutndashboard/dashpage/myprofile/location.svg"
            alt="Location"
            width={24}
            height={24}
            className="mr-2"
          />
          <span>
            {address
              ? `${address.IAD_Address_Line1}, ${address.IAD_Address_Line2}, ${address.IAD_City}, ${address.IAD_State}, ${address.IAD_Pincode}`
              : "Metro, JP Nagar Depot, 25, Old Madras Rd, Bengaluru, Karnataka 560038"}
          </span>
        </div>
        {/* Position */}
        <div className="flex items-center mb-3">
          <Image
            src="/image/institutndashboard/dashpage/myprofile/profession.svg"
            alt="Position"
            width={24}
            height={24}
            className="mr-2"
          />
          <span>
            {individualDetails?.ID_Individual_Designation || "Administrator"}
          </span>
        </div>
        {/* Institution */}
        <div className="flex items-center mb-3">
          <Image
            src="/image/institutndashboard/dashpage/myprofile/institution.svg"
            alt="Institution"
            width={24}
            height={24}
            className="mr-2"
          />
          {/* <span>
            {individualDetails?.ID_Individual_Role === "06"
              ? "Administrator"
              : "Unknown Role"}
          </span> */}
          <span>
            {roleMapping[individualDetails?.ID_Individual_Role] ||
              "Unknown Role"}
          </span>
        </div>
        {/* Language */}
        {languages && languages.length > 0 && (
          <>
            <div className="flex items-center mb-3">
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
                {languages &&
                  languages.length > 0 &&
                  languages.map((lang, index) => (
                    <li key={index} className="mb-3">
                      <div className="text-base font-medium capitalize">
                        {lang.HCJ_JSL_Language}
                      </div>
                      <div className="text-sm text-gray-500">
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
                            {lang.HCJ_JSL_Language_Proficiency.includes("01") &&
                              "Reading "}
                            {lang.HCJ_JSL_Language_Proficiency.includes("02") &&
                              "Writing "}
                            {lang.HCJ_JSL_Language_Proficiency.includes("03") &&
                              "Speaking "}
                          </div>
                        )}
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}

        {/* About */}
        <div className="flex items-center">
          <Image
            src="/image/institutndashboard/dashpage/myprofile/about.svg"
            alt="About"
            width={24}
            height={24}
            className="mr-2"
          />

          <h4 className="text-lg font-semibold">About</h4>
        </div>
        <div className="flex items-center mb-3">
          <p className={"pl-5"}>
            {individualDetails?.ID_About ||
              "Add something about yourself here..."}
          </p>
        </div>
        {/* Contact Information */}
        <div className="mb-3">
          <div className="flex items-center mb-3">
            <Image
              src="/image/institutndashboard/dashpage/myprofile/phone.svg"
              alt="Phone"
              width={24}
              height={24}
              className="mr-2"
            />

            <span>{individualDetails?.ID_Phone || "+91xxxxxxxxxx"}</span>
          </div>
          <div className="flex items-center mb-3">
            <Phone className="w-5 h-5 mr-2 text-primary" />
            <span className="text-gray-500 mr-1">Alternate:</span>
            <span>
              {individualDetails?.ID_Alternate_Phone || "+91xxxxxxxxxx"}
            </span>
          </div>
          <div className="flex items-center mb-3">
            <Image
              src="/image/institutndashboard/dashpage/myprofile/email.svg"
              alt="Email"
              width={24}
              height={24}
              className="mr-2"
            />

            <span>{individualDetails?.ID_Email || "xyz@gmail.com"}</span>
          </div>
          <div className="flex items-center mb-3">
            <MailCheck className="w-5 h-5 mr-2 text-primary" />
            <span className="text-gray-500 mr-1">Alternate:</span>
            <span>
              {individualDetails?.ID_Alternate_Email || "xyz@gmail.com"}
            </span>
          </div>
          <div className="flex items-center mb-3">
            <SlCalender className="w-5 h-5 mr-2 text-primary" />

            <span className="text-gray-500 mr-1">Joined Year</span>
            <span>
              {individualDetails?.createdAt
                ? new Date(individualDetails.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                    }
                  )
                : "N/A"}
            </span>
          </div>
          {socialLinks?.SL_Website_Url && (
            <a
              href={socialLinks.SL_Website_Url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center mb-3">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/www.svg"
                alt="Website"
                width={24}
                height={24}
                className="mr-2 cursor-pointer"
              />
              <span className="text-primary">{socialLinks.SL_Website_Url}</span>
            </a>
          )}
        </div>
        {/* Social Share */}
        <div className="flex flex-col items-start mb-3">
          <div className="flex mb-3">
            <Image
              src="/image/institutndashboard/dashpage/myprofile/share.svg"
              alt="Social Share"
              width={24}
              height={24}
              className="mr-2 cursor-pointer"
            />
            <span>Social Share</span>
          </div>

          <div className="flex gap-2">
            {/* LinkedIn */}
            {socialLinks?.SL_LinkedIn_Profile && (
              <a
                href={socialLinks.SL_LinkedIn_Profile}
                target="_blank"
                rel="noopener noreferrer">
                <Image
                  src="/image/institutndashboard/dashpage/myprofile/linkedin.svg"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                  className="mr-2 cursor-pointer"
                />
              </a>
            )}

            {/* Facebook */}
            {socialLinks?.SL_Facebook_Url && (
              <a
                href={socialLinks.SL_Facebook_Url}
                target="_blank"
                rel="noopener noreferrer">
                <Image
                  src="/image/institutndashboard/dashpage/myprofile/fb.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="mr-2 cursor-pointer"
                />
              </a>
            )}

            {/* Instagram */}
            {socialLinks?.SL_Instagram_Url && (
              <a
                href={socialLinks.SL_Instagram_Url}
                target="_blank"
                rel="noopener noreferrer">
                <Image
                  src="/image/institutndashboard/dashpage/myprofile/ig.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="mr-2 cursor-pointer"
                />
              </a>
            )}

            {/* Portfolio */}
            {socialLinks?.SL_Portfolio_Url && (
              <a
                href={socialLinks.SL_Portfolio_Url}
                target="_blank"
                rel="noopener noreferrer">
                <Image
                  src="/image/institutndashboard/dashpage/myprofile/four.svg"
                  alt="Portfolio"
                  width={24}
                  height={24}
                  className="mr-2 cursor-pointer"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
