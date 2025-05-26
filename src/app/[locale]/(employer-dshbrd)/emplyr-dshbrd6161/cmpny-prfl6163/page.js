"use client";
import { useAbility } from "@/Casl/CaslContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { CalendarClock, MailCheck, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  // States to hold fetched data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const ability = useAbility();
  // console.log("aman", session)

  const institutionId = session?.user?.individualId;
  const companyId = session?.user?.companyId;

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchProfileData = async () => {
      try {
        if (!session || !session.user) {
          setError("Unauthorized: Please log in");
          setLoading(false);
          return;
        }

        const userRole = session.user.role;
        let apiUrl = "";

        if (userRole === "09") {
          const institutionId = session.user.individualId;
          if (!institutionId) {
            setError("Institution ID not found");
            setLoading(false);
            return;
          }
          apiUrl = `/api/institution/v1/hcjArET60531FetchInstitutionData/${institutionId}`;
        } else if (["10", "11"].includes(userRole)) {
          // const companyId = session.user.company_id;
          const companyId = session?.user?.companyId;
          if (!companyId) {
            setError("Company ID not found");
            setLoading(false);
            return;
          }
          apiUrl = `/api/institution/v1/hcjArET60532FetchInstitutionDataForStaff/${companyId}`;
        } else {
          setError("Invalid user role");
          setLoading(false);
          return;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load data");
        } else {
          setProfileData(data.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session, status]);

  // Wait for authentication state to load
  if (status === "loading") {
    return (
      <div className="max-w-full mx-auto p-5 text-center">
        <h2 className="text-xl font-semibold text-gray-500">
          Loading session...
        </h2>
      </div>
    );
  }

  // Render loading skeletons
  if (loading) {
    return (
      <div className="max-w-full mx-auto p-5">
        {/* Cover Photo Skeleton */}
        <div className="text-center mb-5">
          <Skeleton className="h-52 w-full" />
        </div>

        {/* Profile Info Skeleton */}
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

        {/* Details Section Skeleton */}
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
          Error Loading Institution Data
        </h2>
        <p className="text-gray-600">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Destructure the fetched profile data
  const { companyDetails, companyAddress, socialLinks, companyDocuments } =
    profileData || {};

  return (
    <div className="max-w-full mx-auto text-pretty mb-10">
      <div className="text-center mb-5">
        <div className="relative h-52 bg-gray-200">
          {companyDetails?.CD_Company_Cover_Profile ? (
            <Image
              src={
                companyDetails.CD_Company_Cover_Profile || "/image/cover.png"
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
      <div className="container mx-auto flex flex-col sm:flex-row items-start md:items-start justify-between mb-5 sm:px-16">
        <div className="flex flex-col items-center sm:items-start">
          <Image
            src={companyDetails?.CD_Company_Logo || "/image/profile.png"}
            alt="Profile Photo"
            width={100}
            height={100}
            className="mb-2 rounded-lg"
          />
          <div>
            <h2 className="text-xl font-semibold text-center sm:text-left">
              {companyDetails?.CD_Company_Name || "IIT Delhi"}
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
        
          <Link href={`/cmpny/${companyId}`}>
            <Button className="w-32 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 hover:text-white">
              Preview
            </Button>
          </Link>
          {ability.can("update", "Institution") ? (
            <Link href="/emplyr-dshbrd6161/cmpny-prfl-edit6184">
              <Button className="w-32 px-6 py-2 bg-primary text-white rounded-md">
                Edit
              </Button>
            </Link>
          ) : (
            <Button
              disabled
              className="w-32 px-6 py-2 bg-primary text-white rounded-md">
              Edit
            </Button>
          )}
        </div>
      </div>
      {/* Details Section */}
      <div className="container mx-auto px-5 sm:px-16">
        {/** Establishment Year */}
        <div className="flex items-center">
          <CalendarClock className="w-5 h-5 mr-2 text-primary" />
          <h4 className="text-lg font-semibold">Establishment Year</h4>
        </div>
        <div className="flex items-center mb-3">
          <p>
            {companyDetails?.CD_Company_Establishment_Year ||
              "Add your company's establishment year here.."}
          </p>
        </div>

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
          <p>
            {companyDetails?.CD_Company_About ||
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."}
          </p>
        </div>

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
            {companyAddress
              ? `${companyAddress.CAD_Address_Line1}${
                  companyAddress.CAD_Address_Line2
                    ? ", " + companyAddress.CAD_Address_Line2
                    : ""
                }, ${companyAddress.CAD_City}, ${companyAddress.CAD_State}, ${
                  companyAddress.CAD_Country
                } - ${companyAddress.CAD_Pincode}`
              : "Address not available"}
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
          <span>
            {companyDetails?.CD_Company_Type
              ? `${
                  companyDetails.CD_Company_Type.charAt(0).toUpperCase() +
                  companyDetails.CD_Company_Type.slice(1)
                } Institution`
              : "Institution Type Not Available"}
          </span>
        </div>

        {/* Mission */}
        <div className="flex items-center">
          <Image
            src="/image/institutndashboard/dashpage/myprofile/mission.svg"
            alt="About"
            width={24}
            height={24}
            className="mr-2"
          />
          <h4 className="text-lg font-semibold">Mission</h4>
        </div>
        <div className="flex items-center mb-3">
          <p>
            {companyDetails?.CD_Company_Mission ||
              "Our mission is to foster innovation and excellence in education, preparing students for a future of success and leadership."}
          </p>
        </div>

        {/* Speciliazation */}
        <div className="flex items-center mb-3">
          <Image
            src="/image/institutndashboard/dashpage/myprofile/speciliazation.svg"
            alt="Language"
            width={10}
            height={10}
            className="mr-2"
          />
          <h4 className="text-lg font-semibold">Speciliazation</h4>
        </div>
        <div>
          <ul className="pl-5 list-disc">
            {companyDocuments?.CKD_College_Name
              ? [
                  companyDocuments.CKD_College_Name,
                  companyDocuments.CKD_Affiliated_University,
                ]
                  .filter(Boolean)
                  .map((item, index) => (
                    <li key={index} className="mb-2">
                      {item}
                    </li>
                  ))
              : [
                  "Computer Science",
                  "Information Technology",
                  "Mechanical Engineering",
                ].map((specialization, index) => (
                  <li key={index} className="mb-2">
                    {specialization}
                  </li>
                ))}
          </ul>
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
            <span>{companyDetails?.CD_Phone_Number || "+91xxxxxxxxx"}</span>
          </div>

          <div className="flex items-center mb-3">
            <Phone className="w-5 h-5 mr-2 text-primary" />
            <span className="text-gray-500 mr-1">Alternate:</span>
            <span>
              {companyDetails?.CD_Alternate_Phone_Number || "+91xxxxxxxxx"}
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
            <span>{companyDetails?.CD_Company_Email || "xyz@gmail.com"}</span>
          </div>

          <div className="flex items-center mb-3">
            <MailCheck className="w-5 h-5 mr-2 text-primary" />
            <span className="text-gray-500 mr-1">Alternate:</span>
            <span>
              {companyDetails?.CD_Company_Alternate_Email || "xyz@gmail.com"}
            </span>
          </div>
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
            {companyDetails?.CD_Company_Website && (
              <a
                href={companyDetails.CD_Company_Website}
                target="_blank"
                rel="noopener noreferrer">
                <Image
                  src="/image/institutndashboard/dashpage/myprofile/www.svg"
                  alt="Website"
                  width={24}
                  height={24}
                  className="mr-2 cursor-pointer"
                />
              </a>
            )}

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


