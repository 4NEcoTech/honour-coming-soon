"use client"
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/navigation';
import Image from "next/image";

const ImageList = [
  {
    id: 1,
    img: "/image/institute/home/partner/slider1.svg",
    title: "Opportunity for every student",
    description: "Projects | Internships | Flexijobs | Regular Jobs\nMarketing, Sales, Design, Development, DevOps, Robotics, ML, AI, Finance, Sketch Artists, VFX, Animation",
    buttonText: "Register your Institution with HCJ"
  },
  {
    id: 2,
    img: "/image/institute/home/partner/slider2.svg",
    title: "Register your College on HCJ",
    description: "Give your students opportunities to excel in their career.",
    buttonText: "Register your institution with HCJ"
  },
  {
    id: 3,
    img: "/image/institute/home/partner/slider3.svg",
    title: "Your Gateway to Internships, Jobs, and Job Fairs",
    description: "Discover opportunities, connect with employers, and take the next step in your career journey with HCJ. From internships to job placements and job fairs, we’re here to help you succeed.",
    buttonText: "Register now"
  },
  {
    id: 4,
    img: "/image/institute/home/partner/slider4.svg",
    title: "India’s biggest Job Fair",
    description: "Organized by HCJ",
    buttonText: "Login To Register for this job fair"
  },
];

const Hero = () => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  const router = useRouter();

  const handleRegisterClick = () => {
    router.push('/rgstrtn6021');
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-transparent flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
  {/* background pattern */}
  <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div>
  {/* hero section */}
  <div className="container pb-8 sm:pb-0">
    <Slider {...settings}>
      {ImageList.map((data) => (
        <div key={data.id}>
          <div className="grid grid-cols-1 sm:grid-cols-2 px-4 sm:px-8">
            {/* image section */}
            <div className="order-1 sm:order-2 px-4">
              <div
                data-aos="zoom-in"
                data-aos-once="true"
                className="relative z-10"
              >
                <Image
                  src={data.img}
                  alt=""
                  height={20}
                  width={20}
                  className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 lg:scale-120 object-contain mx-auto"
                />
              </div>
            </div>
            {/* text content section */}
            <div className="order-2 sm:order-1 flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-left relative z-10">
              <h1
                data-aos="zoom-out"
                data-aos-duration="500"
                data-aos-once="true"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold"
              >
                {data.title}
              </h1>
              <p
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay="100"
                className="text-xl text-primary"
              >
                {data.description}
              </p>
              <div
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay="300"
              >
                <button
                  onClick={handleRegisterClick}
                  className="px-6 py-3 bg-primary text-white rounded-md"
                >
                  {data.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  </div>
</div>

  );
};

export default Hero;
