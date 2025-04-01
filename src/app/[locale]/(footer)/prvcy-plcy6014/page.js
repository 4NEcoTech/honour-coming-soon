"use client";
import { ChevronUp } from "lucide-react";
import Image from "next/image";

const Page = () => {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    {/* Gradient Header Section */}
    <div className="w-full relative min-h-[250px] p-4 md:p-8 text-white flex items-center bg-gradient-to-r from-[#029ae5] via-[#4dc6a1] to-[#7ed956]">
      <div className="container mx-auto min-h-[250px] relative flex items-center">
        <div className="absolute left-4 md:left-8 lg:left-[150px] space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-sm md:text-base lg:text-lg">Last updated November 2024</p>
        </div>

        {/* Image in Header */}
        <div className="absolute top-[100px] right-4 md:right-8 lg:right-[150px] hidden md:block">
          <Image
            src="/image/info/pana.svg"
            alt="Privacy Policy Illustration"
            width={200}
            height={200}
            className="w-32 md:w-40 lg:w-48 h-auto object-contain"
          />
        </div>
      </div>
    </div>

    {/* Main Content Section */}
    <div className="max-w-6xl mx-auto p-6 md:flex md:gap-8 md:mt-16">
      {/* Right Section (Table of Contents) */}
      <div className="mt-8 md:mt-0 md:w-1/3 md:order-2">
        <div className="bg-[#B3E3DF] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Table of contents</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <a href="#section1" className="hover:text-gray-900 dark:hover:text-gray-200">
                1: What Personal Information We Collect
              </a>
            </li>
            <li>
              <a href="#section2" className="hover:text-gray-900 dark:hover:text-gray-200">
                2: How We Use Your Information
              </a>
            </li>
            <li>
              <a href="#section3" className="hover:text-gray-900 dark:hover:text-gray-200">
                3: Data Sharing
              </a>
            </li>
            <li>
              <a href="#section4" className="hover:text-gray-900 dark:hover:text-gray-200">
                4: Cookies Policy
              </a>
            </li>
            <li>
              <a href="#section5" className="hover:text-gray-900 dark:hover:text-gray-200">
                5: Copyright Policy
              </a>
            </li>
            <li>
              <a href="#section6" className="hover:text-gray-900 dark:hover:text-gray-200">
                6: Data Security
              </a>
            </li>
            <li>
              <a href="#section7" className="hover:text-gray-900 dark:hover:text-gray-200">
                7: Your Rights
              </a>
            </li>
            <li>
              <a href="#section8" className="hover:text-gray-900 dark:hover:text-gray-200">
                8: Children&apos;s Privacy
              </a>
            </li>
            <li>
              <a href="#section9" className="hover:text-gray-900 dark:hover:text-gray-200">
                9: Changes to This Privacy Policy
              </a>
            </li>
            <li>
              <a href="#section10" className="hover:text-gray-900 dark:hover:text-gray-200">
                10: Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Back to Top Button */}
        <div className="mt-6 text-left">
          <div className="flex items-center justify-start mx-auto space-x-2">
            <span className="text-gray-900 dark:text-gray-200">Back to Top</span>
            <ChevronUp
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-5 h-5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Left Section: Privacy Introduction */}
      <div className="md:w-2/3 md:order-1">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2 sm:mt-0">
          This privacy policy will help you better understand how we collect, use and share your personal information
        </h2>
        <h3 className="mt-6 text-2xl font-bold text-gray-800 dark:text-gray-200">About HCJ</h3>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Honour Career Junction (HCJ) values your privacy and is committed to safeguarding the personal data you
          share with us. This Privacy Policy explains how we collect, use, and secure your data.
        </p>

        {/* Privacy Summary Section */}
        <div className="mt-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">Privacy Summary</h2>

          {/* Summary Sections */}
          <section className="space-y-4 mt-4" id="section1">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              1 What personal information we collect :
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Personal Information: Name, email, contact number, address, educational background, work experience.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Technical Information: IP address, device details, browser type, and cookies data.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Behavioural Data: Job searches, applications submitted, and preferences.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Third-party Data: Information from LinkedIn, Google, or other integrated services upon your consent.
            </p>
          </section>

          <section className="space-y-4 mt-4" id="section2">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              2 How We Use Your Information:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              To match job seekers with relevant opportunities.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              To enhance user experience and recommend tailored resources.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Users may share content with proper attribution and permission
              from HCJ.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              To send notifications, newsletters, and promotional content
              (opt-in required)
            </p>
          </section>

          <section className="space-y-4 mt-4" id="section3">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              3 Data Sharing:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              With Employers: To facilitate job applications.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              With Institutions: For academic tracking or verification
              purposes.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Legal Compliance: If required by law or for legal proceedings.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Third-party Services: For analytics, email marketing, and
              payment processing (only with contractual assurances of data
              security).
            </p>
          </section>

          <section className="space-y-4 mt-4" id="section4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              4 Cookies Policy:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4 font-semibold">
              HCJ uses cookies to:
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">Store user preferences.</p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Analyze user behavior to improve platform design.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Enhance security by identifying unauthorized activities.You can
              manage your cookie preferences through browser settings.
            </p>
          </section>

          <section className="space-y-4 mt-4" id="section5">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              5 Copyright Policy:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              HCJ owns all proprietary content, including logos, designs, and
              trademarks.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Any unauthorized reproduction, distribution, or use of
              HCJ&apos;s intellectual property is strictly prohibited.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Users may share content with proper attribution and permission
              from HCJ.
            </p>
          </section>

          <section className="space-y-4 mt-4" id="section6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              6 Data Security:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Encryption: All sensitive data, such as passwords and payment
              details, are encrypted.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Access Control: Only authorized personnel have access to
              sensitive user information.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Regular Audits: Security protocols are periodically reviewed and
              updated to prevent breaches.
            </p>
          </section>

          <section className="space-y-4 mt-4" id="section7">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              7 Your Rights:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Access: Request a copy of the personal data we hold about you.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Correction: Update or correct inaccuracies in your information.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Deletion: Request account deletion and associated data removal
              (subject to legal requirements).
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Withdraw Consent: Opt-out of marketing or data-sharing
              initiatives.
            </p>
          </section>

          <section className="space-y-4 mt-4" id="section8">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              8 Children&apos;s Privacy:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              HCJ does not knowingly collect data from individuals under the
              age of 18.
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              Parents or guardians may contact us if they believe a minor has
              registered on our platform.
            </p>
          </section>

          <section className="space-y-4 mt-4" id="section9">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              9 Changes to This Privacy Policy:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              HCJ may update this Privacy Policy to reflect new practices or
              services. Changes will be communicated via email or platform
              notifications 30 days before implementation.
            </p>
          </section>


          <section className="space-y-4 mt-4" id="section10">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">10 Contact Us:</h3>
            <p className="text-gray-600 dark:text-gray-400 ml-4">
              If you have questions or concerns regarding these policies, please contact us
            </p>
            <p className="text-gray-600 dark:text-gray-400 ml-4">Email: thehonourenterprise@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Page;
