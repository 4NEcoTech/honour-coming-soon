"use client";
import ProfileCompletionPopup from "@/components/ProfileCompletionPopup";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const dummyachievers = [
  {
    src: "/image/institute/home/achiervercentral/Img1.svg",
    name: "Akhil Raj",
    achievement: "Winner in Chess Tournament’24",
    university: "IIT Delhi",
  },
  {
    src: "/image/institute/home/achiervercentral/Img2.svg",
    name: "Manu Nair",
    achievement: "Fastest Swimmer in India",
    university: "Indian Institute of Aeronautics",
  },
  {
    src: "/image/institute/home/achiervercentral/Img3.svg",
    name: "Nikhila Vimal",
    achievement: "Invented Solar Power Banks",
    university: "Institute of Climate Science, Goa",
  },
  {
    src: "/image/institute/home/achiervercentral/Img12.svg",
    name: "Priya Varrier",
    achievement: "Discovered Deepest Coral in Indian Ocean",
    university: "NIFT, Bombay",
  },
];

export default function Home() {
  const [achievers, setAchievers] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const { data: session } = useSession();
  const t = useTranslations("common.HomePage");
  const dummyInstitutions = [
    { src: "/image/institute/home/7.svg", name: "IIT Delhi" },
    { src: "/image/institute/home/1.svg", name: "NIT Calicut" },
    { src: "/image/institute/home/2.svg", name: "IIM Bangalore" },
    { src: "/image/institute/home/4.svg", name: "IIM Chennai" },
    { src: "/image/institute/home/5.svg", name: "IIT Kanpur" },
    { src: "/image/institute/home/6.svg", name: "IIT MA" },
  ];

  const institutionSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const achieverSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // const getDirectDriveImage = (url) => {
  //   const match = url?.match(/\/d\/(.*?)\//);
  //   if (match && match[1]) {
  //     return `https://drive.google.com/uc?id=${match[1]}`;
  //   } else if (url?.includes("uc?id=")) {
  //     return url;
  //   }
  //   return "/placeholder.svg";
  // };

  const getDirectDriveImage = (url) => {
    if (!url) return "/image/institute/default-logo.svg"; // Fallback

    // Pattern 1: /file/d/<ID>/view
    const match = url.match(/\/d\/([^/]+)\//);
    if (match) {
      return `https://drive.google.com/uc?id=${match[1]}`;
    }

    // Pattern 2: already in uc?id=<ID>
    if (url.includes("uc?id=")) {
      return url;
    }

    return "/image/institute/default-logo.svg";
  };

  useEffect(() => {
    const fetchVerifiedAchievers = async () => {
      try {
        const res = await fetch(
          "/api/super-admin/v1/hcjArET61081AchieverCentral?HCJ_AC_Status=01"
        );
        const data = await res.json();
        //  console.log("data", data);
        const formatted = (data?.data || []).map((item) => ({
          src: getDirectDriveImage(item.HCJ_AC_Achievers_Photo),
          name: item.HCJ_AC_Achievers_Name,
          achievement: item.HCJ_AC_Achievers_Award_Description,
          university: item.HCJ_AC_College_Name,
        }));

        setAchievers(formatted);
      } catch (err) {
        console.error("Failed to fetch achievers:", err);
      }
    };

    fetchVerifiedAchievers();
  }, []);

  useEffect(() => {
    fetch("/api/hcj/v1/hcjArET60021fetchVerifyInstitution")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.data.map((item) => ({
          src: getDirectDriveImage(item.CD_Company_Logo),
          name: item.CD_Company_Name,
        }));
        setInstitutions(mapped);
      })
      .catch((err) => {
        console.error("Failed to load institutions", err);
        setInstitutions(dummyInstitutions);
      });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Profile Completion Popup */}

        <ProfileCompletionPopup />

        {/* Opportunities Section */}
        <section className="container mx-auto py-10 px-4 md:py-16 md:px-8 lg:px-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-4">
            {" "}
            <div className="text-left space-y-6">
              <h1 className="text-left text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
                {/* Opportunities for <br /> every student */}
                {t("Opportunities_for_every_student")}
              </h1>
              <p className="text-lg text-primary dark:text-primary">
                <span className="font-semibold">
                  {t("Projects_Internships_Flexijobs_Regular_Jobs")}
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(
                  "Marketing_Sales_Design_Development_DevOps_Robotics_ML_AI_Finance_Sketch_Artists_VFX_Animation"
                )}
              </p>
              <div>
                <Link href="/rgstrtn6021">
                  <Button className="px-8 py-4 text-sm md:text-xl bg-primary rounded-lg">
                    {t("Register_your_Institution_with_HCJ")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative max-w-sm lg:max-w-md w-full h-auto">
                {" "}
                <Image
                  src="/image/institute/home/hero3.png"
                  alt="Student with laptop"
                  width={500}
                  height={500}
                  className="rounded-md w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* <Hero/> */}

        {/* Job Fair Banner */}
        <section className="py-8 px-4 md:py-12 md:px-8 lg:px-16 bg-gradient-to-r from-primary to-green-500 dark:from-primary/80 dark:to-green-600">
          <div className="container mx-auto text-center lg:text-center md:text-left text-white">
            {" "}
            {/* Added md:text-left */}
            <h1 className="text-3xl font-semibold">
              {t("Take_part_in_India_s_biggest_Job_Fair")}
              {/* Take part in India&apos;s biggest Job Fair */}
            </h1>
            <p className="text-sm mb-5">{t("Nov_10_Nov_20")}</p>
            <Link href={"/job-fair6005"}>
              <Button
                className="px-10 py-4 text-sm md:text-lg bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
                // onClick={handleJobFairClick}
              >
                {t("Register_here")}
              </Button>
            </Link>
          </div>
        </section>
        <section
          id="about"
          className="bg-transparent py-10 px-4 md:py-16 md:px-8 lg:px-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative w-full max-w-md mx-auto">
              <div className="relative">
                <Image
                  src="/image/institute/home/about1.svg"
                  alt="Image 1"
                  width={300}
                  height={300}
                  className="rounded-md shadow-lg w-full sm:w-auto"
                />
              </div>
              <div className="absolute top-1/3 left-1/3 sm:top-40 sm:left-36 mt-24 md:mt-0">
                <Image
                  src="/image/institute/home/about2.svg"
                  alt="Image 2"
                  width={300}
                  height={300}
                  className="rounded-md shadow-lg w-full sm:w-auto"
                />
              </div>
            </div>
            <div className="space-y-6 mt-20 md:mt-36 lg:mt-0">
              <div className=" mt-2 md:mt-0">
                <Image
                  src="/image/institute/home/arrow.svg"
                  alt="Achievers Banner"
                  width={400}
                  height={200}
                  className="block"
                />
              </div>
              <Link href="/about6016">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                {t("About_Us")}
              </h2></Link>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                {t(
                  "Welcome_to_HCJ_the_leading_platform_designed_to_connect_institutions_students_and_the_dynamic_job_market"
                )}
              </p>
              <p className="text-gray-600 text-sm md:text-base dark:text-gray-300">
                {t(
                  "At_HCJ_our_mission_is_to_streamline_and_enhance_the_job_seeking_experience"
                )}
              </p>
              <p className="text-gray-600 text-sm md:text-base dark:text-gray-300">
                {t(
                  "Committed_to_bridging_the_gap_between_academia_and_industry"
                )}
              </p>
              {/* <Button className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition">
                {t("Read_more")}
              </Button> */}
            </div>
          </div>
        </section>

        {/* <section className="container mx-auto p-6 md:p-12 mt-20 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-5xl text-gray-800 dark:text-gray-100">
              {t("Partner_Institutions")}
            </h2>
            <Image
              src="/image/institute/home/arrow.svg"
              alt="Achievers Banner"
              width={400}
              height={200}
              className="hidden md:block"
            />
          </div>

          <Slider {...settings} className="mt-6">
            {institutions.map((institution, index) => (
              <div key={index} className="text-center">
                <div className="relative w-full h-48 mx-auto">
                  <Image
                    src={institution.src}
                    alt={`Partner ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                </div>
                <p className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                  {institution.name}
                </p>
              </div>
            ))}
          </Slider>
        </section> */}

        <section className="container mx-auto p-6 md:p-12 relative">
          <div className="flex justify-between items-center mb-4 px-6 md:px-12">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-800 dark:text-gray-100">
              {t("Partner_Institutions")}
            </h2>
            <Image
              src="/image/institute/home/arrow.svg"
              alt="Arrow Icon"
              width={400}
              height={200}
              className="hidden md:block"
            />
          </div>

          {/* Slider */}
          {institutions.length > 3 ? (
            <Slider {...institutionSettings}>
              {institutions.map((institution, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden p-4 mx-4 sm:mx-2">
                  <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 relative">
                    <Image
                      src={institution.src}
                      alt={institution.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-contain rounded-md bg-white"
                    />
                  </div>
                  <div className="text-left mt-4">
                    <p className="text-xs text-gray-800 dark:text-gray-100">
                      {institution.name}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <Slider {...institutionSettings}>
              {dummyInstitutions.map((institution, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden p-4 mx-4 sm:mx-2">
                  <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 relative">
                    <Image
                      src={institution.src}
                      alt={institution.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-contain rounded-md bg-white"
                    />
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {institution.name}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </section>

        {/* Achiever Central Section */}

        <section className="container mx-auto p-6 md:p-12">
          <div className="flex justify-between items-center">
            <div className="flex px-6 md:px-12 items-center justify-center md:justify-start">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-800 dark:text-gray-100">
                {t("Achievers_Central")}
              </h2>
              <Image
                src="/image/institute/achievercentral/trophy2.svg"
                alt="Trophy Icon"
                width={24}
                height={24}
                className="w-12 h-12 ml-4"
              />
            </div>
            <div className="mt-2 md:mt-0">
              <Image
                src="/image/institute/home/arrow.svg"
                alt="Achievers Banner"
                width={400}
                height={200}
                className="hidden md:block"
              />
            </div>
          </div>

          <div className="flex px-6 md:px-12 flex-col md:flex-row justify-between items-start md:items-center mt-2">
            {/* Left - Heading */}
            <h3 className="text-base md:text-3xl font-semibold text-green-500 dark:text-green-400">
              {t("Featured_Achievers_Of_this_month")}
            </h3>

            {/* Right - Buttons */}
            <div className="flex gap-4 mt-2 md:mt-0">
              <Link href="/achr-cntrl-stdnt">
                <Button className="px-6 w-36 font-medium text-white rounded-md">
                  Send Nomination
                </Button>
              </Link>
              <Link href="/achvr-cntrl6007">
                <Button className="px-6 w-36 bg-white dark:bg-gray-800 border border-primary text-primary dark:text-white hover:bg-[#77C6FA] dark:hover:bg-gray-700 hover:text-primary dark:hover:text-white rounded-md">
                  View All
                </Button>
              </Link>
            </div>
          </div>

          <div className="container mx-auto p-6 md:p-12 relative">
            {/* Fixed Images */}
            <div className="absolute top-4 left-[-20px] w-32 h-32 lg:w-48 lg:h-48 z-10">
              <Image
                src="/image/institute/achievercentral/top2.svg"
                alt="Top Left"
                width={150}
                height={150}
              />
            </div>
            <div className="absolute bottom-4 left-[-20px] w-32 h-32 lg:w-48 lg:h-48 z-10">
              <Image
                src="/image/institute/achievercentral/top3.svg"
                alt="Bottom Left"
                width={150}
                height={150}
              />
            </div>
            <div className="absolute bottom-4 right-[-20px] w-32 h-32 lg:w-48 lg:h-48 z-10">
              <Image
                src="/image/institute/achievercentral/front.svg"
                alt="Bottom Right"
                width={150}
                height={150}
              />
            </div>

            {/* Achievers Slider */}
            {achievers.length > 1 ? (
              <Slider {...achieverSettings}>
                {achievers.map((achiever, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden p-4 mx-4 sm:mx-2">
                    <div className="w-full h-72 sm:h-56 md:h-64 lg:h-72 relative">
                      <Image
                        src={achiever.src || "/placeholder.svg"}
                        alt={`Achiever ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-left ml-4 mb-4 sm:ml-2 sm:mb-2">
                      <p className="text-xl font-bold text-white sm:text-lg md:text-xl">
                        {achiever.name}
                      </p>
                      <p className="text-sm font-medium text-yellow-500 sm:text-xs md:text-sm">
                        {achiever.achievement}
                      </p>
                      <p className="text-xs text-white sm:text-xs">
                        {achiever.university}
                      </p>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <Slider {...achieverSettings}>
                {dummyachievers.map((achiever, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden p-4 mx-4 sm:mx-2">
                    <div className="w-full h-72 sm:h-56 md:h-64 lg:h-72 relative">
                      <Image
                        src={achiever.src || "/placeholder.svg"}
                        alt={`Achiever ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-left text-white ml-4 mb-4 sm:ml-2 sm:mb-2">
                      <p className="text-xl font-bold sm:text-lg md:text-xl">
                        {achiever.name}
                      </p>
                      <p className="text-sm font-medium text-yellow-500 sm:text-xs md:text-sm">
                        {achiever.achievement}
                      </p>
                      <p className="text-xs sm:text-xxs">
                        {achiever.university}
                      </p>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </section>

        {/* Gradient Banner 2 */}
        <section className="py-8 px-4 md:py-12 md:px-8 lg:px-16 bg-gradient-to-r from-blue-500 to-green-500 dark:from-primary/80 dark:to-green-600 text-white">
          <div className="container mx-auto flex flex-col md:flex-row text-center md:text-left items-start md:items-center justify-start md:justify-center gap-4 md:gap-6">
            <h2 className="text-2xl md:text-3xl font-semibold">
              {t("Give_your_students_access_to_real_world_opportunities")}
            </h2>
            <Link href="/rgstrtn6021">
              <Button
                size="lg"
                className="mx-2 px-6 py-3 bg-primary text-sm md:text-lg text-white rounded-md">
                {t("Get_Started")}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
