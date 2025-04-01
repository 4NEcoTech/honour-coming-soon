'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/routing';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

// Custom arrow components for the slider
const NextArrow = ({ onClick }) => (
  <Button
    variant="outline"
    size="icon"
    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
    onClick={onClick}>
    <ChevronRight className="h-4 w-4" />
  </Button>
);

const PrevArrow = ({ onClick }) => (
  <Button
    variant="outline"
    size="icon"
    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
    onClick={onClick}>
    <ChevronLeft className="h-4 w-4" />
  </Button>
);

const students = [
  {
    name: 'Ben Thomas',
    image: '/image/institution/s1.svg?height=200&width=300',
  },
  { name: 'Lisa', image: '/image/institution/s2.svg?height=200&width=300' },
  {
    name: 'Julie Antony',
    image: '/image/institution/s3.svg?height=200&width=300',
  },
  {
    name: 'Jaswall Dev',
    image: '/image/institution/s4.svg?height=200&width=300',
  },
  {
    name: 'Nikas Goel',
    image: '/image/institution/s5.svg?height=200&width=300',
  },
  {
    name: 'Deepak Shankar',
    image: '/image/institution/s6.svg?height=200&width=300',
  },
  {
    name: 'Tom Augustus',
    image: '/image/institution/s7.svg?height=200&width=300',
  },
];

// Add this static data for team members
const teamMembers = [
  {
    name: 'John Doe',
    role: 'Vice Principal',
    image: '/image/institution/t1.svg?height=200&width=300',
  },
  {
    name: 'Mary Jane',
    role: 'Head Teacher',
    image: '/image/institution/t2.svg?height=200&width=300',
  },
  {
    name: 'Anna Hathway',
    role: 'Senior Counselor',
    image: '/image/institution/t3.svg?height=200&width=300',
  },
  {
    name: 'Jack Summers',
    role: 'Faculty',
    image: '/image/institution/t4.svg?height=200&width=300',
  },
];

export default function InstitutionPublicProfilePage() {
  const params = useParams();
  const institutionId = params?.['public-prfl6064']; // Extract institution ID from dynamic route

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!institutionId) {
      console.error('Institution ID is missing in URL');
      setError('Institution ID is missing in URL');
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      console.log('Fetching profile for Institution ID:', institutionId);
      try {
        const response = await fetch(
          `/api/hcj/v1/institutionPublicProfile/${institutionId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to load institution profile data'
          );
        }
        console.log('Profile Data:', data);
        setProfileData(data.data);
      } catch (err) {
        console.error('Error fetching institution profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [institutionId]);

  // Slider settings for students section (if available)
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const { companyDetails, companyAddress, socialLinks } = profileData || {};

  // Calculate follower count display (example: 1.2K for 1200)
  const formatFollowerCount = (count = 0) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  const followerCount = formatFollowerCount(
    companyDetails?.CD_Follower_Count || 0
  );
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 pb-20">
      {/* Cover Image */}
      <div className="relative h-[200px] md:h-[300px] w-full">
        <Image
          src={
            companyDetails?.CD_Company_Cover_Profile ||
            '/image/profile/default-cover.jpg'
          }
          alt="Cover"
          className="object-cover"
          fill
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="relative -mt-16 sm:-mt-24 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div className="flex flex-col items-start gap-4">
              <div className="relative">
                <Image
                  src={
                    companyDetails?.CD_Company_Logo ||
                    '/image/default-profile.svg'
                  }
                  alt="Institution Logo"
                  width={180}
                  height={180}
                  className="rounded-lg border-4 border-background dark:border-gray-800"
                  priority
                />
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold dark:text-white">
                  {companyDetails?.CD_Company_Name || 'Institution Name'}
                </h1>
                <div className="flex gap-4 text-sm mt-2">
                  <div className="flex items-center">
                    <Image
                      src="/image/institutndashboard/dashpage/popup/follower.svg"
                      alt="Followers"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    <span className="dark:text-gray-300">
                      {followerCount} Followers
                    </span>
                  </div>
                  <Button className="px-6 py-2 rounded-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                    Follow
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 sm:mt-28 w-full sm:w-auto">
              <Button className="flex-1 sm:w-32 px-4 sm:px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
                Send message
              </Button>
              <Button className="flex-1 sm:w-32 px-4 sm:px-6 py-2 rounded-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Contact
              </Button>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-4 sm:absolute sm:top-40 sm:right-0 flex gap-4 justify-center sm:justify-start">
            {socialLinks?.SL_QR_Code && (
              <Link
                href={socialLinks.SL_QR_Code}
                className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white">
                <Image
                  src="/image/institutndashboard/dashpage/myprofile/four.svg"
                  alt="QR Code"
                  width={30}
                  height={30}
                  className="w-8 h-8"
                />
              </Link>
            )}
            {socialLinks?.SL_LinkedIn_Url && (
              <Link
                href={socialLinks.SL_LinkedIn_Url}
                className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white">
                <Image
                  src="/image/institutndashboard/dashpage/myprofile/linkedin.svg"
                  alt="LinkedIn"
                  width={30}
                  height={30}
                  className="w-8 h-8"
                />
              </Link>
            )}
            {socialLinks?.SL_Facebook_Url && (
              <Link
                href={socialLinks.SL_Facebook_Url}
                className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white">
                <Image
                  src="/image/institutndashboard/dashpage/myprofile/fb.svg"
                  alt="Facebook"
                  width={30}
                  height={30}
                  className="w-8 h-8"
                />
              </Link>
            )}
            {socialLinks?.SL_Instagram_Url && (
              <Link
                href={socialLinks.SL_Instagram_Url}
                className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white">
                <Image
                  src="/image/institutndashboard/dashpage/myprofile/ig.svg"
                  alt="Instagram"
                  width={30}
                  height={30}
                  className="w-8 h-8"
                />
              </Link>
            )}
          </div>
        </div>

        <div className="container mx-auto sm:px-4 md:px-8 lg:px-16">
          {/* About Section */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/about.svg"
                alt="About"
                width={24}
                height={24}
                className="mr-2"
              />
              <h4 className="text-lg font-semibold dark:text-white">About</h4>
            </div>
            <p className="dark:text-gray-300 ml-8">
              {companyDetails?.CD_Company_Description ||
                'No description available.'}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center mb-3">
            <MapPin className="w-5 h-5 mr-3 text-muted-foreground" />
            <span className="dark:text-gray-300">
              {companyAddress
                ? `${companyAddress.CAD_Address_Line1}${
                    companyAddress.CAD_Address_Line2
                      ? ', ' + companyAddress.CAD_Address_Line2
                      : ''
                  }, ${companyAddress.CAD_City}, ${companyAddress.CAD_State}, ${
                    companyAddress.CAD_Postal_Code
                  }`
                : 'Location not available'}
            </span>
          </div>

          {/* Position/Type */}
          <div className="flex items-center mb-3">
            <Briefcase className="w-5 h-5 mr-3 text-muted-foreground" />
            <span className="dark:text-gray-300">
              {companyDetails?.CD_Company_Type || 'Type not available'}
            </span>
          </div>

          {/* Student Count (if available) */}
          {companyDetails?.CD_Student_Count && (
            <div className="flex items-center mb-3">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/student.svg"
                alt="Students"
                width={24}
                height={24}
                className="mr-3"
              />
              <span className="dark:text-gray-300">
                {companyDetails.CD_Student_Count}+ Students
              </span>
            </div>
          )}

          {/* Contact Information */}
          <div className="mb-8">
            {socialLinks?.SL_Website_Url && (
              <div className="flex items-center mb-3">
                <Globe className="w-5 h-5 mr-3 text-muted-foreground" />
                <Link
                  href={socialLinks.SL_Website_Url}
                  className="dark:text-gray-300 hover:text-primary dark:hover:text-blue-400">
                  {socialLinks.SL_Website_Url}
                </Link>
              </div>
            )}

            {companyDetails?.CD_Phone_Number && (
              <div className="flex items-center mb-3">
                <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="dark:text-gray-300">
                  {companyDetails.CD_Phone_Number}
                </span>
              </div>
            )}

            {companyDetails?.CD_Company_Email && (
              <div className="flex items-center mb-3">
                <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="dark:text-gray-300">
                  {companyDetails.CD_Company_Email}
                </span>
              </div>
            )}
          </div>

          {/* Team Members Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h4 className="text-lg font-semibold dark:text-white">
                  Team Members
                </h4>
                <span className="ml-2 text-sm text-muted-foreground dark:text-gray-400">
                  ({teamMembers.length})
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-card dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-105">
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        member.image || '/placeholder.svg?height=200&width=300'
                      }
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h5 className="font-medium dark:text-white">
                      {member.name}
                    </h5>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Students Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h4 className="text-lg font-semibold dark:text-white">
                  Students
                </h4>
                <span className="ml-2 text-sm text-muted-foreground dark:text-gray-400">
                  (250+)
                </span>
              </div>
              <Link
                href={`/institutn-stdnt6008?id=${institutionId}`}
                className="text-sm text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                View All
              </Link>
            </div>
            <div className="relative px-8">
              <Slider {...sliderSettings}>
                {students.map((student, index) => (
                  <div key={index} className="px-2">
                    <div className="flex flex-col bg-card dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-105">
                      <div className="relative h-48 w-full">
                        <Image
                          src={
                            student.image ||
                            '/placeholder.svg?height=200&width=300'
                          }
                          alt={student.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h5 className="font-medium text-center dark:text-white">
                          {student.name}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 pb-20">
      {/* Cover Image Skeleton */}
      <Skeleton className="h-[200px] md:h-[300px] w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section Skeleton */}
        <div className="relative -mt-16 sm:-mt-24 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div className="flex flex-col items-start gap-4">
              <Skeleton className="h-[180px] w-[180px] rounded-lg" />
              <div className="mb-2 space-y-2">
                <Skeleton className="h-8 w-64" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2 mt-4 sm:mt-28 w-full sm:w-auto">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Social Links Skeleton */}
          <div className="mt-4 sm:absolute sm:top-40 sm:right-0 flex gap-4 justify-center sm:justify-start">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>

        <div className="container mx-auto sm:px-4 md:px-8 lg:px-16">
          {/* About Section Skeleton */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Skeleton className="h-6 w-6 mr-2" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-16 w-full ml-8" />
          </div>

          {/* Contact Information Skeleton */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-3" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-3" />
              <Skeleton className="h-5 w-1/3" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-3" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
