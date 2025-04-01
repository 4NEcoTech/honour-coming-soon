'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Swal from 'sweetalert2';

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

  const router = useRouter();

  const handleClickHereClick = () => {
    router.push('/rgstrtn6021');
  };

  const [formData, setFormData] = useState({
    institutionName: '',
    institutionAddress: '',
    institutionEmail: '',
    institutionPhone: '',
    adminPhone: '',
    firstName: '',
    lastName: '',
    email: '',
    userPhone: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePhoneChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/hcj/v1/hcjJBrBT60051JobFairForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data=await response.json()
      console.log(data)
      if (response.ok) {
     
        Swal.fire(
          // 'Success!',
          // 'You have been registered successfully.',
          // 'success'
          
          data.title,
          data.message,
          'success'
        );
        // Reset formData to clear input fields
        setFormData({
          institutionName: '',
          institutionAddress: '',
          institutionEmail: '',
          institutionPhone: '',
          adminPhone: '',
          firstName: '',
          lastName: '',
          email: '',
          userPhone: '',
        });
      } else {
        Swal.fire(data.title, data.message, 'error');
      }
    } catch (error) {
      Swal.fire( data.title, data.message, 'error');
    }
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

          <p className="text-sm sm:text-lg md:text-2xl font-bold mt-2 sm:mt-4">
            Are you an Institution{' '}
            <span
              className="text-primary cursor-pointer hover:underline"
              onClick={handleClickHereClick}>
              Register here
            </span>
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

      {/* Registration Form Section */}
      <div className="bg-transparent py-10">
        <h2 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-6 leading-relaxed sm:leading-normal max-w-3xl mx-auto">
          If you are a student, you can request your institution to register on
          HCJ by filling the form below:
        </h2>

        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-transparent p-6 rounded-lg shadow-lg">
          {/* Institution Details Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-6 text-center">
              Your Institution Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="institutionName"
                  className="block font-medium text-primary">
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="institutionName"
                  placeholder="Your Institution name"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.institutionName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="institutionAddress"
                  className="block font-medium text-primary">
                  Institution Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="institutionAddress"
                  placeholder="e.g. Bangalore"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.institutionAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="institutionEmail"
                  className="block font-medium text-primary">
                  Institution Email
                </label>
                <input
                  type="email"
                  id="institutionEmail"
                  placeholder="Institution email"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.institutionEmail}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="institutionPhone"
                  className="block font-medium text-primary">
                  Institution Phone Number
                </label>
                <PhoneInput
                  country={'in'}
                  value={formData.institutionPhone}
                  onChange={(value) =>
                    handlePhoneChange('institutionPhone', value)
                  }
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="adminPhone"
                  className="block font-medium text-primary">
                  Admin Contact Number
                </label>
                <PhoneInput
                  country={'in'}
                  value={formData.adminPhone}
                  onChange={(value) => handlePhoneChange('adminPhone', value)}
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Your Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-center">
              Your Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block font-medium text-primary">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block font-medium text-primary">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last name"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block font-medium text-primary">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email ID"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="userPhone"
                  className="block font-medium text-primary">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={'in'}
                  value={formData.userPhone}
                  onChange={(value) => handlePhoneChange('userPhone', value)}
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-8">
            <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 w-full md:w-1/4">
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Our Partners Section (Slider) */}

      <div className="bg-transparent py-10 container mx-auto">
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
                  className="w-20 md:w-64"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Page;
