"use client";
import Image from 'next/image';

const Page = () => {

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Gradient Header Section */}
      <div
        className="w-full  p-4  md:p-8 text-white flex items-center bg-gradient-to-r from-[#029ae5] via-[#4dc6a1] to-[#7ed956]"
        // style={{
        //   background: "linear-gradient(90deg, #029ae5 0%, #4dc6a1 50%, #7ed956 100%)",
        // }}
      >
        <div className="container mx-auto min-h-[250px] relative flex items-center">
        {/* <div className="container mx-auto "> */}
        {/* Centered and Left-Aligned Text */}
        <div className="absolute left-4 md:left-8 lg:left-[150px] space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Cookie Policy</h1>
          <p className="text-sm md:text-base lg:text-lg">Last updated November 2024</p>
        </div>

        {/* Image in the Gradient */}
        <div className="absolute top-[100px] right-4 md:right-8 lg:right-[150px] hidden md:block">
          <Image
            src="/image/info/bro.svg"
            alt="Cookie Illustration"
            width={100}
            height={100}
            className="w-32 md:w-40 lg:w-48 h-auto object-contain"
          />
          </div>
          </div>
        </div>
        {/* </div> */}

      {/* Content Section */}
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Cookie Policy Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">Cookie Policy</h2>

          {/* Introduction */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">1. Introduction</h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              This Cookie Policy explains how we use cookies and similar technologies to enhance your experience on our website
              and to provide services to you. By using our website, you agree to the use of cookies as described in this policy.
            </p>
          </section>

          {/* Types of Cookies */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">2. Types of Cookies We Use</h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              We use both session and persistent cookies. Session cookies are temporary and are erased once you close your
              browser, while persistent cookies remain on your device for a specified period or until deleted.
            </p>
          </section>

          {/* How We Use Cookies */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">3. How We Use Cookies</h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Cookies help us enhance your experience by remembering your preferences, ensuring that our website functions
              correctly, and providing us with data about website performance to improve our services.
            </p>
          </section>

          {/* Managing Cookies */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">4. Managing Your Cookies</h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              You can manage cookies through your browser settings, including blocking or deleting cookies. Please note
              that blocking certain cookies may affect the functionality of our website.
            </p>
          </section>

          {/* Changes to Cookie Policy */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">5. Changes to this Cookie Policy</h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              We may update our Cookie Policy from time to time. Any changes will be posted on this page, and we encourage
              you to review this policy periodically.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
