'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

import { useState } from 'react';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('institution');
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const student = [
    {
      id: 1,
      title: 'Create your profile',
      description:
        'Create your profile on HCJ by completing all required forms using the email ID provided by your institution.',
      image: '/image/institute/howitworks/mobile/student02.svg',
    },
    {
      id: 2,
      title: 'Connect with institution',
      description:
        'Connect with your institution and other educational institutions on the platform. This connection grants you access to institution-specific opportunities, events, and guidance.',
      image: '/image/institute/howitworks/mobile/student01.svg',
    },
    {
      id: 3,
      title: 'Search for jobfair',
      description:
        'Search for job fairs and job opportunities on the platform, and register for any job fairs that interest you.',
      image: '/image/institute/howitworks/mobile/student03.svg',
    },
    {
      id: 4,
      title: 'Apply for job',
      description: 'Apply for jobs or connect with employers directly on HCJ.',
      image: '/image/institute/howitworks/mobile/institute03.svg',
    },
    {
      id: 5,
      title: 'Get hired',
      description:
        'Secure a position with reputable employers or through job fairs on HCJ.',
      image: '/image/institute/howitworks/mobile/institute05.svg',
    },
  ];
  const steps = [
    {
      id: 1,
      title: 'Create admin profile',
      description:
        "Begin by setting up an admin profile for your institution. This includes adding essential contact information. As the administrator you'll have access to manage your institution's profile and onboard students.",
      image: '/image/institute/howitworks/mobile/institute01.svg',
    },
    {
      id: 2,
      title: 'Create institution profile',
      description:
        'Update the institution profile and upload required documents of your institute. Highlights its mission and specialization.',
      image: '/image/institute/howitworks/mobile/institute02.svg',
    },
    {
      id: 3,
      title: 'Onboard students',
      description:
        'Invite and onboard student by doing a bulk upload on the platform. Uploading students data encourage students to create individual profiles which gives them direct access to the job portal.',
      image: '/image/institute/howitworks/mobile/institute03.svg',
    },
    {
      id: 4,
      title: 'Drive student hiring',
      description:
        'Help your students get hired through employers and job fairs on the platform.',
      image: '/image/institute/howitworks/mobile/institute04.svg',
    },
    {
      id: 5,
      title: 'Get Jobs & jobfair access',
      description:
        'Get access to job & jobfairs hosted on the platform Institutions are also invited to participate in job fairs, allowing students to explore various employment options and engage with potential employers.',
      image: '/image/institute/howitworks/mobile/institute05.svg',
    },
  ];

  const faqs = [
    {
      category: 'General',
      items: [
        {
          question: 'Why do I need to upload my IDs on HCJ ?',
          answer:
            'This is to have only verified and authentic users on our platform, keeping it free from spam.',
        },
        {
          question: 'How do I update my profile ?',
          answer:
            'Log in to your account and navigate to the <b>profile</b> section in the dashboard. Click the <b>Edit</b> button, make the necessary updates, and save your changes.',
        },
      ],
    },
    {
      category: 'Students',
      items: [
        {
          question: 'How do I create an account ?',
          answer:
            'Your institution will be initiating the process of your registration by uploading some of your information on HCJ.You will be getting an email to register and complete the remaining steps to create your account on HCJ.',
        },
        {
          question: 'How do I register for a job fair ?',
          answer:
            "If you are an existing user, it's just a one-click registration for you. Go to the job fair page and register for the available job fairs on the platform. If you're not a registered user, request your institution to join HCJ by filling up a form available on the job fair page and be part of India's biggest job fair.",
        },
        {
          question: 'How do I edit my details ?',
          answer:
            'To edit your details, log in to your account and go to your profile. Click <b>Edit</b>, update the information you want to change, and click <b>Save</b>.',
        },
      ],
    },
    {
      category: 'Institute',
      items: [
        {
          question: 'How do I create an account ?',
          answer:
            'To create an account, click on the <b>Institution Registration</b> button at the top right corner of the page.Enter your details, including name,educational institutional email Id,documents and password, or register using your LinkedIn. Follow the instructions to verify your account.',
        },
        {
          question: 'How can I bulk upload students data on HCJ ?',
          answer:
            "To upload multiple student or staff details, log in to your institutional account. Go to the <b>Bulk Upload</b> section under the dashboard, download the provided template, fill in all the details, and upload the file. The system will process the data and notify you once it's done.",
        },
        {
          question: 'How can my institute join HCJ ?',
          answer:
            'To register your institution on HCJ, click on the <b>Institution Registration</b> button at the top right corner of the homepage. Fill out the required details during the registration, upload the necessary documents, and submit the form. Our team will review & verify the information and you’ll receive email from us once your account gets verified. If we need any additional information, we will contact you.',
        },
      ],
    },
  ];

  return (
    <div className="dark:bg-gray-900">
      {/* Section 1: Hero Section */}
      <section
        // className="bg-gradient-to-r from-teal-500 to-blue-500 text-white"
        className="text-white bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-600 dark:to-blue-600"
        style={{
          backgroundImage: "url('image/institute/howitworks/background.png')",

          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center py-24">
          {/* Right Image */}
          {/* <div className="w-full md:w-1/2 mb-8 md:mb-0 md:flex justify-center md:order-2 hidden ">
            <Image
              src="/image/institute/howitworks/wrong.svg"
              alt="Illustration"
              width={700}
              height={700}
              className="w-3/4 md:w-full"
            />
          </div> */}
          {/* Left Text */}
          {/* w-full text-center md:text-left md:w-1/2 md:ml-12 space-y-6 */}
          <div className="w-full text-left md:text-left px-5 sm:px-0 md:w-1/2 md:ml-12 space-y-6">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl leading-snug">
              Your Gateway to Internships, Jobs, and Job Fairs
            </h1>
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
              Discover opportunities, connect with employers, and take the next
              step in your career journey with HCJ. From internships to job
              placements and job fairs, we&apos;re here to help you succeed.
            </p>
            <Link href="/rgstrtn6021">
              <Button className="md:px-6 md:py-3 mt-4 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                Register now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: How HCJ Works */}
      <section className="py-10 bg-transparent px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-4 dark:text-white">
            How{' '}
            <span className="text-green-600 dark:text-green-400">
              HCJ Works
            </span>
          </h2>
          <p className="max-w-5xl mx-auto text-gray-600 dark:text-gray-300  leading-relaxed text-center text-sm sm:text-base lg:text-lg">
            <strong>HCJ simplifies</strong> the connection between{' '}
            <strong>students</strong>,<strong>institutions</strong>, and{' '}
            <strong>employers</strong>. <strong>Institutions</strong> can create{' '}
            <strong> profiles</strong> to <strong>add their students</strong> to
            the platform, enabling seamless connections with{' '}
            <strong>job opportunities</strong> and upcoming{' '}
            <strong>job fairs</strong>. By logging in with their{' '}
            <strong>institutional email</strong>, students gain access to a{' '}
            <strong>tailored dashboard</strong> where they can explore{' '}
            <strong>job listings</strong> and discover{' '}
            <strong>job fairs</strong> relevant to their field of study.{' '}
            <strong>HCJ streamlines</strong> the{' '}
            <strong>job search process</strong>, fostering valuable connections
            between students and employers while{' '}
            <strong>helping institutions</strong> support their students&apos;{' '}
            <strong>transition </strong>
            from <strong>academics</strong> to{' '}
            <strong>professional careers</strong>.
          </p>
        </div>
      </section>

      {/* Section 3: Tab Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="container mx-auto">
          {/* Toggle Buttons */}
          <div className="flex flex-col items-center mt-4">
            {/* Buttons and Line Container */}
            <div className="relative inline-block">
              {/* Buttons */}
              <div className="flex space-x-4 sm:space-x-8">
                <button
                  className={`text-base sm:text-lg font-semibold pb-2 ${
                    activeTab === 'institution'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  onClick={() => setActiveTab('institution')}>
                  Institution
                </button>
                <button
                  className={`text-base sm:text-lg font-semibold pb-2 ${
                    activeTab === 'student'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  onClick={() => setActiveTab('student')}>
                  Student
                </button>
              </div>

              {/* Line */}
              <div className="relative mt-2">
                {/* Background Line */}
                <div className="h-0.5 bg-gray-300 dark:bg-gray-700"></div>
                {/* Active Line */}
                <div
                  className={`absolute h-0.5 bg-blue-600 dark:bg-blue-400  transition-all duration-300 ${
                    activeTab === 'institution'
                      ? 'w-[100px] left-0'
                      : 'w-[100px] right-0'
                  }`}></div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mt-8 sm:flex justify-center  ">
            {activeTab === 'institution' ? (
              <div className="container mx-auto px-4 py-16">
                <div className="grid gap-16">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center ${
                        index % 2 === 0 ? '' : 'md:[&>*:first-child]:order-2'
                      }`}>
                      <Card className="border-none shadow-none dark:bg-gray-800">
                        <CardContent className="p-0">
                          <div className="space-y-4">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                              <span className="text-xl font-thin bg-slate-200 dark:bg-gray-700 p-1 rounded-sm text-blue-600 dark:text-blue-400">
                                #{step.id}
                              </span>
                              <div>
                                <h2 className="text-2xl font-bold sm:text-3xl dark:text-white">
                                  {step.title}
                                </h2>
                                <p className="text-muted-foreground dark:text-gray-300 mt-2">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <div
                        className={`flex justify-center ${
                          index % 2 === 0
                            ? 'md:justify-start'
                            : 'md:justify-end'
                        }`}>
                        <div className="relative aspect-[4/3] w-full max-w-md xl:max-w-md 2xl:max-w-lg overflow-hidden rounded-lg min-h-[200px]">
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1280px) 384px, (min-width: 1024px) 288px, (min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="container mx-auto px-4 py-16">
                <div className="grid gap-16">
                  {student.map((step, index) => (
                    <div
                      key={step.id}
                      className={`grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center ${
                        index % 2 === 0 ? '' : 'md:[&>*:first-child]:order-2'
                      }`}>
                      <Card className="border-none shadow-none dark:bg-gray-800">
                        <CardContent className="p-0">
                          <div className="space-y-4">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                              <span className="text-xl font-thin bg-slate-200 dark:bg-gray-700 p-1 rounded-sm text-blue-600 dark:text-blue-400">
                                #{step.id}
                              </span>
                              <div>
                                <h2 className="text-2xl font-bold sm:text-3xl dark:text-white">
                                  {step.title}
                                </h2>
                                <p className="text-muted-foreground dark:text-gray-300 mt-2">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <div
                        className={`flex justify-center ${
                          index % 2 === 0
                            ? 'md:justify-start'
                            : 'md:justify-end'
                        }`}>
                        <div className="relative aspect-[4/3] w-full max-w-md xl:max-w-md 2xl:max-w-lg overflow-hidden rounded-lg min-h-[200px]">
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1280px) 384px, (min-width: 1024px) 288px, (min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* mobile visible  */}
        </div>
      </section>

      <section className="py-8 px-4 md:py-12 md:px-8 lg:px-16 bg-gradient-to-r from-blue-500 to-green-500 dark:from-blue-600 dark:to-green-600">
        <div className="container mx-auto text-center lg:text-center md:text-left text-white">
          {' '}
          {/* Added md:text-left */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-4 text-pretty">
            Please refer to the FAQ page for more information or contact us if
            you have any questions.
          </h1>
          <div className="flex flex-row  items-center md:items-center justify-center  ">
            <Link href="/faq6013">
              <Button className="px-8 m-4 w-40 bg-white dark:bg-gray-800 border border-primary text-primary dark:text-white hover:bg-[#77C6FA] dark:hover:bg-gray-700 hover:text-primary dark:hover:text-white rounded-md">
                FAQs
              </Button>
            </Link>
            <Link href="/cntct6011">
              <Button className="px-8 m-4 w-40 font-medium rounded-md dark:hover:bg-gray-800">
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
