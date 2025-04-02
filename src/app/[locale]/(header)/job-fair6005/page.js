'use client';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const partners = ['IBM', 'Google', 'OLA', 'Uber', 'Zepto', 'Amazon'];
const Page = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="font-sans">
      {/* First Section */}
      <div
        className="relative bg-cover bg-center py-20 px-4 sm:px-6"
        style={{
          backgroundImage: "url('/image/institute/jobfair/banner.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          width: '100%',
        }}>
        <div className="max-w-[95%] sm:max-w-xl md:max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 flex flex-col justify-center h-full">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-black leading-tight">
            India’s biggest Job Fair
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-green-500 mt-2 sm:mt-4">
            Organized by HCJ
          </h2>
          <p className="text-base sm:text-lg md:text-xl mt-2 sm:mt-4">
            Welcome to our Job Fair portal, where opportunities meet talent!
            This platform connects job seekers with top employers in various
            industries, providing a seamless experience to explore available
            positions, network with potential employers, and apply for roles
            that fit your skills and career aspirations.
          </p>

          <p className="text-base sm:text-lg md:text-2xl font-bold mt-2 sm:mt-4">
            November 10 - November 20
          </p>
          <Link href="/rgstrtn6021">
            <Button className="bg-primary px-4 py-2 rounded-md mt-2 sm:mt-4 text-sm w-full sm:w-[250px] md:w-[300px] lg:w-[400px] mx-auto">
              Login To Register for this job fair
            </Button>
          </Link>

          <p className="text-sm sm:text-lg md:text-xl mt-2 sm:mt-4">
            Not Registered on HCJ?{' '}
            <Link href="/job-frm6006">
              <span className="text-primary cursor-pointer hover:underline">
                Click here
              </span>
            </Link>
          </p>
          <p className="text-sm sm:text-lg md:text-xl mt-2 sm:mt-4">
            Share this job fair:
          </p>
          <div className="flex justify-center space-x-4 mt-2 sm:mt-4">
            <a href="#" className="hover:opacity-80">
              <Image
                src="/image/institute/jobfair/linkedin2.svg"
                alt="LinkedIn"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </a>
            <a href="#" className="hover:opacity-80">
              <Image
                src="/image/institute/jobfair/instagram.svg"
                alt="Instagram"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </a>
            <a href="#" className="hover:opacity-80">
              <Image
                src="/image/institute/jobfair/facebook2.svg"
                alt="Facebook"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </a>
            <a href="#" className="hover:opacity-80">
              <Image
                src="/image/institute/jobfair/ecolink.svg"
                alt="Eco Link"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </a>
          </div>
        </div>
      </div>

   {/*    <div className="bg-transparent py-10 container mx-auto">
        <div className="flex items-center justify-center px-4 mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center">
            Our Partners
          </h2>
        </div>

        <Slider {...settings}>
          {partners.map((partner, index) => (
            <div key={index} className="flex justify-center my-6">
              <div className="flex-shrink-0 w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 flex justify-center">
                <Image
                  src={`/image/institute/jobfair/${partner}.svg`}
                  alt={partner}
                  width={400}
                  height={400}
                  // className="w-20 md:w-64 lg:w-full"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div> */}

      {/* Banner Section */}
      <div
        className="py-16 px-6 bg-gradient-to-r from-blue-600 to-green-400 text-white"
        style={{
          backgroundImage: "url('/image/institute/jobfair/banner2.svg')",
        }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-left md:items-center">
          <div className="md:flex-1 text-left space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold">
              Dont miss this opportunity, apply now
            </h2>
            <p className="text-md md:text-lg">
              Register now for this amazing job fair and explore exciting
              opportunities.
            </p>
          </div>
          <div className="mt-6 md:mt-0 md:flex-shrink-0 ">
            <Link href="/rgstrtn6021">
              <Button className="px-8">Register now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
