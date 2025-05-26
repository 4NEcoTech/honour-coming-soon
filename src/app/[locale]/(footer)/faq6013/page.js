"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";

const staticFaqs = [
  {
    category: "General",
    items: [
      {
        question: "Why do I need to upload my IDs on HCJ ?",
        answer:
          "This is to have only verified and authentic users on our platform, keeping it free from spam.",
      },
      {
        question: "How do I update my profile ?",
        answer:
          "Log in to your account and navigate to the <b>profile</b> section in the dashboard. Click the <b>Edit</b> button, make the necessary updates, and save your changes.",
      },
    ],
  },
  {
    category: "Students",
    items: [
      {
        question: "How do I create an account ?",
        answer:
          "Your institution will be initiating the process of your registration by uploading some of your information on HCJ.You will be getting an email to register and complete the remaining steps to create your account on HCJ.",
      },
      {
        question: "How do I register for a job fair ?",
        answer:
          "If you are an existing user, it's just a one-click registration for you. Go to the job fair page and register for the available job fairs on the platform. If you're not a registered user, request your institution to join HCJ by filling up a form available on the job fair page and be part of India's biggest job fair.",
      },
      {
        question: "How do I edit my details ?",
        answer:
          "To edit your details, log in to your account and go to your profile. Click <b>Edit</b>, update the information you want to change, and click <b>Save</b>.",
      },
    ],
  },
  {
    category: "Institute",
    items: [
      {
        question: "How do I create an account ?",
        answer:
          "To create an account, click on the <b>Institution Registration</b> button at the top right corner of the page.Enter your details, including name,educational institutional email Id,documents and password, or register using your LinkedIn. Follow the instructions to verify your account.",
      },
      {
        question: "How can I bulk upload students data on HCJ ?",
        answer:
          "To upload multiple student or staff details, log in to your institutional account. Go to the <b>Bulk Upload</b> section under the dashboard, download the provided template, fill in all the details, and upload the file. The system will process the data and notify you once it's done.",
      },
      {
        question: "How can my institute join HCJ ?",
        answer:
          "To register your institution on HCJ, click on the <b>Institution Registration</b> button at the top right corner of the homepage. Fill out the required details during the registration, upload the necessary documents, and submit the form. Our team will review & verify the information and you'll receive email from us once your account gets verified. If we need any additional information, we will contact you.",
      },
    ],
  },
];

export default function Page() {
  const searchParams = useSearchParams();
  const queryFromURL = searchParams.get("q") || "";
  const [search, setSearch] = useState(queryFromURL);

  const [suggestions, setSuggestions] = useState([]);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`/api/hcj/v1/hcjArET60131fetchFaq?search=${search}`)
        .then((res) => res.json())
        .then((json) => {
          const faqs = json.data || [];
          setSuggestions(faqs);

          // If the query was passed and no selectedFaq yet, auto-select the first match
          if (queryFromURL && faqs.length > 0 && !selectedFaq) {
            setSelectedFaq(faqs[0]);
            setSearch("");
          }
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // useEffect(() => {
  //   if (!search.trim()) {
  //     setSuggestions([]);
  //     return;
  //   }

  //   const timeout = setTimeout(() => {
  //     fetch(`/api/hcj/v1/hcjArET60131fetchFaq?search=${search}`)
  //       .then((res) => res.json())
  //       .then((json) => setSuggestions(json.data || []));
  //   }, 300);

  //   return () => clearTimeout(timeout);
  // }, [search]);

  const handleClick = () => router.push("/cntct6011");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Bar Section */}
      <section
        className="text-white text-center py-12 px-4 relative"
        style={{
          backgroundImage: 'url("/image/info/faq/bacckground.svg")',
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">FAQs</h1>
          <h2 className="text-lg font-medium mb-6">How can we help you?</h2>

          <div className="relative max-w-md mx-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by keywords"
              className="w-full pl-4 pr-12 py-3 rounded-full bg-white/10 border-2 border-white/70 text-white"
            />
            <Image
              src="/image/info/faq/search.svg"
              alt="Search Icon"
              width={48}
              height={48}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md z-50 text-left text-gray-800 max-h-64 overflow-y-auto">
                {suggestions.map((faq, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedFaq(faq);
                      setSearch("");
                      setSuggestions([]);
                    }}
                  >
                    {faq.question}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Selected Dynamic FAQ */}
      {selectedFaq && (
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              Answer:
            </h2>
            <Accordion
              type="single"
              collapsible
              className="space-y-6"
              value="selected-faq"
            >
              <AccordionItem
                value="selected-faq"
                className="border rounded-lg shadow-sm overflow-hidden mb-4 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 dark:text-gray-100">
                  {selectedFaq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedFaq.answer }}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      )}

      {/* Static Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Info Message */}
          <section className="py-8 px-4 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
              If you have questions that aren&apos;t answered below, please feel
              free to contact us!
            </p>
          </section>

          {/* Accordion Section */}
          <Accordion type="single" collapsible className="space-y-6">
            {staticFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  {category.category}
                </h3>
                {category.items.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${categoryIndex}-${index}`}
                    className="border rounded-lg shadow-sm overflow-hidden mb-4 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
                  >
                    <AccordionTrigger className="flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 dark:text-gray-100">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      <p dangerouslySetInnerHTML={{ __html: item.answer }}></p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-stretch">
          {/* Left Section (Image) */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src="/image/info/faq/image.svg"
              alt="Contact Us"
              className="w-full h-auto object-contain"
              width="600"
              height="400"
            />
          </div>

          {/* Right Section (Text and Button) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center bg-teal-100/50 dark:bg-teal-900/20 p-6 md:p-12 lg:p-12 rounded-lg">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed text-start sm:text-center lg:text-left text-gray-800 dark:text-gray-100">
              If you have questions that aren&apos;t answered below, please feel
              free to contact us!
            </h2>
            <div className="mt-6 flex justify-start sm:justify-start">
              <button
                className="bg-primary text-white px-6 py-3 rounded-lg shadow-md 
                  hover:bg-[hsl(206,_100%,_30%)] dark:hover:bg-primary/80 dark:hover:text-white 
                  transition-all duration-200"
                onClick={handleClick}
              >
                Contact us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
