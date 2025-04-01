"use client";
import { ChevronUp } from "lucide-react";
import Image from "next/image";

const Page = () => {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Gradient Header Section */}
      <div
        className="w-full relative min-h-[250px] p-4 md:p-8 text-white flex items-center  bg-gradient-to-r from-[#029ae5] via-[#4dc6a1] to-[#7ed956]"
        // style={{
        //   background:
        //     "linear-gradient(90deg, #029ae5 0%, #4dc6a1 50%, #7ed956 100%)",
        // }}
      >
         <div className="container mx-auto min-h-[250px] relative flex items-center">
        <div className="absolute left-4 md:left-8 lg:left-[150px] space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Terms and Condition
          </h1>
          <p className="text-sm md:text-base lg:text-lg">
            Last updated November 2024
          </p>
        </div>

        {/* Image in Header */}
        <div className="absolute top-[100px] right-4 md:right-8 lg:right-[150px] hidden md:block">
          <Image
            src="/image/info/bro.svg"
            alt="Privacy Policy Illustration"
            width={200}
            height={200}
            className="w-32 md:w-40 lg:w-48 h-auto object-contain"
          />
        </div>
      </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto p-6 md:flex md:gap-8 md:mt-16 ">
        {/* Right Section (Table of Contents) */}
        <div className="mt-8 md:mt-0 md:w-1/3 md:order-2">
          <div className="bg-[#B3E3DF] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-400">Table of contents</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="#section1" className="hover:text-gray-900 dark:hover:text-gray-200">
                  1: User Eligibility
                </a>
              </li>
              <li>
                <a href="#section2" className="hover:text-gray-900 dark:hover:text-gray-200">
                  2: Account Responsibility
                </a>
              </li>
              <li>
                <a href="#section3" className="hover:text-gray-900 dark:hover:text-gray-200">
                  3: Prohibited Activities
                </a>
              </li>
              <li>
                <a href="#section4" className="hover:text-gray-900 dark:hover:text-gray-200">
                  4: Content Ownership
                </a>
              </li>
              <li>
                <a href="#section5" className="hover:text-gray-900 dark:hover:text-gray-200">
                  5: Limitation of Liability
                </a>
              </li>
              <li>
                <a href="#section6" className="hover:text-gray-900 dark:hover:text-gray-200">
                  6: Termination of Services
                </a>
              </li>
              <li>
                <a href="#section7" className="hover:text-gray-900 dark:hover:text-gray-200">
                  7: Governing Law
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
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-400 mt-2 sm:mt-0">User Agreement</h2>
          <h3 className="mt-6 text-2xl font-bold text-gray-800 dark:text-gray-400">About HCJ</h3>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Honour Career Junction (HCJ) is a job portal designed to connect Students, educational institutions, job
            seekers and employers offering personalized career opportunities and resources. These Terms & Conditions
            govern your use of our platform, services, and features. By registering, you accept these terms in full.
          </p>

          {/* Privacy Summary Section */}
          <div className="mt-8">
            {/* Summary Sections */}
            <section className="space-y-4 mt-4" id="section1">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">1 User Eligibility</h3>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                You must be at least 18 years old or the legal age in your jurisdiction to use HCJ.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                By accessing our platform, you confirm that all the information provided by you is accurate, complete,
                and up to date.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                HCJ reserves the right to suspend or terminate accounts found to be in violation of eligibility
                criteria.
              </p>
            </section>

            <section className="space-y-4 mt-4" id="section2">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">2 Account Responsibility</h3>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                Confidentiality: You are responsible for maintaining the confidentiality of your login credentials.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                Activity Monitoring: You agree to notify HCJ immediately of any unauthorized access to your account.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                Accurate Information: Ensure that the information provided in your profile is truthful and does not
                misrepresent your qualifications or affiliations.
              </p>
            </section>

            <section className="space-y-4 mt-4" id="section3">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">3 Prohibited Activities</h3>
              <p className="text-gray-600 dark:text-gray-400 ml-4">Post fake or misleading job openings or profiles.</p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                Engage in harassment, discrimination, or unethical communication.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                Accurate Information: Ensure that the information provided in your profile is truthful and does not
                misrepresent your qualifications or affiliations.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                Upload viruses, malicious software, or content that violates intellectual property laws.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                Use automated tools (e.g., bots) to extract data or interfere with the platform&apos;s functionality.
              </p>
            </section>

            <section className="space-y-4 mt-4" id="section4">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">4 Content Ownership</h3>
              <p className="text-gray-600 dark:text-gray-400 ml-4 font-semibold">
                User Content: All content uploaded, such as resumes or job descriptions, remains the property of the
                user.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                License: By submitting content, you grant HCJ a non-exclusive, royalty-free license to use the content
                for the platform&apos;s operation and marketing.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                Accurate Information: Ensure that the information provided in your profile is truthful and does not
                misrepresent your qualifications or affiliations.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                Third-party Content: HCJ is not responsible for third-party content shared on the platform
              </p>
            </section>

            <section className="space-y-4 mt-4" id="section5">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">5 Limitation of Liability</h3>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                HCJ is not responsible for disputes arising from employment agreements made via the platform.
              </p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                HCJ is not liable for any data loss, technical failures, or security breaches caused by external factors
                beyond its control.
              </p>
            </section>

            <section className="space-y-4 mt-4" id="section6">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">6 Termination of Services</h3>
              <p className="text-gray-600 dark:text-gray-400 ml-4">HCJ reserves the right to:</p>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                Restrict access to certain features for non-compliance or misconduct.
              </p>
            </section>

            <section className="space-y-4 mt-4" id="section7">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">7 Governing Law</h3>
              <p className="text-gray-600 dark:text-gray-400 ml-4">
                These Terms & Conditions are governed by the laws of [Your Jurisdiction], and disputes will be settled
                through arbitration or in courts of competent jurisdiction.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
