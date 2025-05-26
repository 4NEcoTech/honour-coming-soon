"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Building,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function AboutPage() {
  // const [activeTestimonial, setActiveTestimonial] = useState(0)
  const testimonials = [
    {
      quote:
        "As a final-year student, I struggled to find companies that took me seriously. Honour helped me build a verified profile, and I landed a paid internship within a month!",
      name: "Riya Sharma",
      role: "Engineering Student, Delhi",
      imageUrl: "/image/about/1.png?height=100&width=100",
    },
    {
      quote:
        "Thanks to Honour, my skills finally got noticed. I uploaded my projects, verified my documents, and within weeks I got interview calls from three top companies!",
      name: "Aniket Verma",
      role: "B.Tech CSE Graduate",
      imageUrl: "/image/about/2.png?height=100&width=100",
    },
    {
      quote:
        "What I loved about Honour was how easy it was to showcase everything — my academics, achievements, and even my volunteer work. It's more than a resume!",
      name: "Sneha Kapoor",
      role: "MBA Student, Pune",
      imageUrl: "/image/about/3.png?height=100&width=100",
    },
    {
      quote:
        "I was nervous about applying for jobs as a fresher. But Honour gave me confidence, a verified profile, and direct access to real recruiters. Game-changer!",
      name: "Farhan Ali",
      role: "B.Sc IT Student",
      imageUrl: "/image/about/4.png?height=100&width=100",
    },
  ];


  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1, // Since testimonials usually show 1 or 2 at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
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

  // Animated counter hook
  const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            let start = 0;
            const step = end / (duration / 16);
            const timer = setInterval(() => {
              start += step;
              setCount(Math.min(Math.floor(start), end));
              if (start >= end) clearInterval(timer);
            }, 16);

            return () => clearInterval(timer);
          }
        },
        { threshold: 0.5 }
      );

      if (countRef.current) {
        observer.observe(countRef.current);
      }

      return () => {
        if (countRef.current) {
          observer.unobserve(countRef.current);
        }
      };
    }, [end, duration]);

    return [count, countRef];
  };

  // Animated counters
  const [institutionsCount, institutionsRef] = useCounter(500);
  const [studentsCount, studentsRef] = useCounter(50000);
  const [jobFairsCount, jobFairsRef] = useCounter(200);
  const [placementsCount, placementsRef] = useCounter(10000);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <main className="container mx-auto flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className=" relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-sky-50 -z-10">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-violet-300 mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-sky-300 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-indigo-300 mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <motion.div
          className="container mx-auto px-4 md:px-6 relative z-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="flex flex-col items-center space-y-6 text-center"
            variants={fadeIn}
          >
            <div className="inline-block rounded-full bg-white/80 backdrop-blur-sm px-4 py-1 text-sm font-medium text-violet-800 shadow-sm">
              Honour • Career • Journey
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-violet-700 via-indigo-700 to-sky-700 bg-clip-text text-transparent">
                Honouring Every Career Journey
              </h1>
              <p className="mx-auto max-w-[800px] text-slate-700 text-lg md:text-xl lg:text-2xl leading-relaxed">
                Empowering students and institutions to build meaningful career
                pathways through verification, connection, and opportunity.
              </p>
            </div>
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link href="/rgstrtn6021">
                  For Institutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 hover:bg-white/10 transition-all duration-300"
                asChild
              >
                <Link href="/emp-rgstr6151">For Companies</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-16 relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Image
              src="/image/about/11.png?height=400&width=1200"
              alt="Students collaborating in a modern campus setting"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 md:p-8 text-white">
                <p className="text-lg md:text-xl font-medium">
                  Connecting Academia with Industry
                </p>
                <p className="text-sm md:text-base opacity-80">
                  Building bridges for successful career transitions
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="w-full py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500"></div>
        <div className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full bg-sky-50 opacity-70"></div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="space-y-6" variants={fadeIn}>
              <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-900 shadow-sm">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl/tight bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
                Bridging Academia and Industry
              </h2>
              <div className="space-y-4 text-slate-700">
                <p className="text-lg md:text-xl leading-relaxed">
                  Welcome to HCJ, the leading platform designed to connect
                  institutions, students, and the dynamic job market.
                </p>
                <p className="text-lg md:text-xl leading-relaxed">
                  At HCJ, our mission is to streamline and enhance the
                  job-seeking experience by offering institutions a simple and
                  efficient way to upload and manage their student&apos;s
                  profiles. This allows students to showcase their skills and
                  qualifications for job fairs, internships, and a wide range of
                  career opportunities.
                </p>
                <p className="text-lg md:text-xl leading-relaxed">
                  We are committed to bridging the gap between academia and
                  industry by providing a seamless platform where students can
                  gain visibility and access to potential employers, while
                  institutions can play a key role in shaping their
                  student&apos;s career paths. With HCJ, we make the transition
                  from education to employment smoother and more effective.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Image
                src="/image/about/12.png?height=400&width=600"
                alt="Students collaborating in a modern campus setting"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="text-xl font-medium">Our Vision</p>
                  <p className="text-base opacity-90">
                    Creating a world where every student has equal access to
                    career opportunities
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-sky-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-violet-100 opacity-40"></div>
          <div className="absolute bottom-40 left-10 w-72 h-72 rounded-full bg-sky-100 opacity-40"></div>
        </div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="space-y-3" variants={fadeIn}>
              <div className="inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm text-sky-900 shadow-sm">
                Your Journey With Us
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl/tight bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">
                How HCJ Supports Your Career Path
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-700 text-lg md:text-xl">
                From registration to career launch, we&apos;re with you every
                step of the way.
              </p>
            </motion.div>
          </motion.div>

          <div className="relative">
            {/* Desktop timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-400 to-sky-400 -translate-x-1/2"></div>

            <div className="space-y-16 md:space-y-24 relative">
              {/* Step 1 */}
              <motion.div
                className="md:grid md:grid-cols-2 md:gap-8 items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div
                  className="md:text-right space-y-3 pb-8 md:pb-0"
                  variants={fadeIn}
                >
                  <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-900 shadow-sm">
                    Step 1
                  </div>
                  <h3 className="text-2xl font-bold text-violet-800">
                    Student Registration
                  </h3>
                  <p className="text-slate-700 text-lg">
                    Create your profile and join the HCJ community with a simple
                    registration process.
                  </p>
                </motion.div>
                <motion.div className="relative md:pl-8" variants={fadeIn}>
                  {/* Timeline dot - desktop */}
                  <div className="hidden md:block absolute left-0 top-1/2 w-6 h-6 rounded-full bg-violet-500 -translate-x-1/2 -translate-y-1/2 shadow-lg z-10">
                    <div className="absolute inset-0 rounded-full bg-violet-300 animate-ping opacity-75"></div>
                  </div>
                  {/* Timeline dot - mobile */}
                  <div className="md:hidden absolute left-0 top-0 w-6 h-6 rounded-full bg-violet-500 -translate-x-1/2 shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-violet-300 animate-ping opacity-75"></div>
                  </div>
                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-violet-600" />
                    </div>
                    <p className="text-slate-700">
                      Join thousands of students who have already started their
                      journey with HCJ.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="md:grid md:grid-cols-2 md:gap-8 items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div
                  className="md:order-2 space-y-3 pb-8 md:pb-0"
                  variants={fadeIn}
                >
                  <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-900 shadow-sm">
                    Step 2
                  </div>
                  <h3 className="text-2xl font-bold text-violet-800">
                    Document Verification
                  </h3>
                  <p className="text-slate-700 text-lg">
                    We verify your academic credentials with your institution to
                    ensure authenticity.
                  </p>
                </motion.div>
                <motion.div
                  className="md:order-1 relative md:pr-8"
                  variants={fadeIn}
                >
                  {/* Timeline dot - desktop */}
                  <div className="hidden md:block absolute right-0 top-1/2 w-6 h-6 rounded-full bg-violet-500 translate-x-1/2 -translate-y-1/2 shadow-lg z-10">
                    <div className="absolute inset-0 rounded-full bg-violet-300 animate-ping opacity-75"></div>
                  </div>
                  {/* Timeline dot - mobile */}
                  <div className="md:hidden absolute left-0 top-0 w-6 h-6 rounded-full bg-violet-500 -translate-x-1/2 shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-violet-300 animate-ping opacity-75"></div>
                  </div>
                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 md:text-right"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4 md:ml-auto">
                      <CheckCircle className="h-8 w-8 text-violet-600" />
                    </div>
                    <p className="text-slate-700">
                      Our verification process ensures trust and credibility for
                      all parties.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="md:grid md:grid-cols-2 md:gap-8 items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div
                  className="md:text-right space-y-3 pb-8 md:pb-0"
                  variants={fadeIn}
                >
                  <div className="inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm text-sky-900 shadow-sm">
                    Step 3
                  </div>
                  <h3 className="text-2xl font-bold text-sky-800">
                    Profile Building
                  </h3>
                  <p className="text-slate-700 text-lg">
                    Create a comprehensive profile showcasing your skills,
                    achievements, and aspirations.
                  </p>
                </motion.div>
                <motion.div className="relative md:pl-8" variants={fadeIn}>
                  {/* Timeline dot - desktop */}
                  <div className="hidden md:block absolute left-0 top-1/2 w-6 h-6 rounded-full bg-sky-500 -translate-x-1/2 -translate-y-1/2 shadow-lg z-10">
                    <div className="absolute inset-0 rounded-full bg-sky-300 animate-ping opacity-75"></div>
                  </div>
                  {/* Timeline dot - mobile */}
                  <div className="md:hidden absolute left-0 top-0 w-6 h-6 rounded-full bg-sky-500 -translate-x-1/2 shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-sky-300 animate-ping opacity-75"></div>
                  </div>
                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-sky-600" />
                    </div>
                    <p className="text-slate-700">
                      Stand out with a profile that highlights your unique
                      strengths and potential.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                className="md:grid md:grid-cols-2 md:gap-8 items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div
                  className="md:order-2 space-y-3 pb-8 md:pb-0"
                  variants={fadeIn}
                >
                  <div className="inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm text-sky-900 shadow-sm">
                    Step 4
                  </div>
                  <h3 className="text-2xl font-bold text-sky-800">
                    Opportunity Discovery
                  </h3>
                  <p className="text-slate-700 text-lg">
                    Access curated opportunities from verified employers and
                    institutions.
                  </p>
                </motion.div>
                <motion.div
                  className="md:order-1 relative md:pr-8"
                  variants={fadeIn}
                >
                  {/* Timeline dot - desktop */}
                  <div className="hidden md:block absolute right-0 top-1/2 w-6 h-6 rounded-full bg-sky-500 translate-x-1/2 -translate-y-1/2 shadow-lg z-10">
                    <div className="absolute inset-0 rounded-full bg-sky-300 animate-ping opacity-75"></div>
                  </div>
                  {/* Timeline dot - mobile */}
                  <div className="md:hidden absolute left-0 top-0 w-6 h-6 rounded-full bg-sky-500 -translate-x-1/2 shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-sky-300 animate-ping opacity-75"></div>
                  </div>
                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 md:text-right"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-4 md:ml-auto">
                      <Calendar className="h-8 w-8 text-sky-600" />
                    </div>
                    <p className="text-slate-700">
                      Discover opportunities that align with your skills and
                      career aspirations.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Step 5 */}
              <motion.div
                className="md:grid md:grid-cols-2 md:gap-8 items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div
                  className="md:text-right space-y-3"
                  variants={fadeIn}
                >
                  <div className="inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm text-sky-900 shadow-sm">
                    Step 5
                  </div>
                  <h3 className="text-2xl font-bold text-sky-800">
                    Career Launch
                  </h3>
                  <p className="text-slate-700 text-lg">
                    Begin your professional journey with confidence and ongoing
                    support.
                  </p>
                </motion.div>
                <motion.div className="relative md:pl-8" variants={fadeIn}>
                  {/* Timeline dot - desktop */}
                  <div className="hidden md:block absolute left-0 top-1/2 w-6 h-6 rounded-full bg-sky-500 -translate-x-1/2 -translate-y-1/2 shadow-lg z-10">
                    <div className="absolute inset-0 rounded-full bg-sky-300 animate-ping opacity-75"></div>
                  </div>
                  {/* Timeline dot - mobile */}
                  <div className="md:hidden absolute left-0 top-0 w-6 h-6 rounded-full bg-sky-500 -translate-x-1/2 shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-sky-300 animate-ping opacity-75"></div>
                  </div>
                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                      <GraduationCap className="h-8 w-8 text-sky-600" />
                    </div>
                    <p className="text-slate-700">
                      Take the first step in your career with the backing of the
                      HCJ community.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="w-full py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500"></div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="space-y-3" variants={fadeIn}>
              <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-900 shadow-sm">
                Our Impact
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl/tight bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
                HCJ in Numbers
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-700 text-lg md:text-xl">
                Our growing community is making a real difference in career
                development.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-violet-50 to-violet-100 border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 mx-auto rounded-full bg-violet-200 flex items-center justify-center">
                  <Building className="h-8 w-8 text-violet-600" />
                </div>
                <div
                  ref={institutionsRef}
                  className="text-5xl font-bold text-violet-600"
                >
                  {institutionsCount}+
                </div>
                <h3 className="text-xl font-medium text-violet-900">
                  Verified Institutions
                </h3>
                <p className="text-slate-700">
                  Educational partners committed to student success
                </p>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-sky-50 to-sky-100 border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 mx-auto rounded-full bg-sky-200 flex items-center justify-center">
                  <Users className="h-8 w-8 text-sky-600" />
                </div>
                <div
                  ref={studentsRef}
                  className="text-5xl font-bold text-sky-600"
                >
                  {studentsCount}+
                </div>
                <h3 className="text-xl font-medium text-sky-900">
                  Registered Students
                </h3>
                <p className="text-slate-700">
                  Building their career journeys with HCJ
                </p>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-violet-50 to-violet-100 border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 mx-auto rounded-full bg-violet-200 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-violet-600" />
                </div>
                <div
                  ref={jobFairsRef}
                  className="text-5xl font-bold text-violet-600"
                >
                  {jobFairsCount}+
                </div>
                <h3 className="text-xl font-medium text-violet-900">
                  Job Fairs Hosted
                </h3>
                <p className="text-slate-700">
                  Connecting talent with opportunity
                </p>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-sky-50 to-sky-100 border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 mx-auto rounded-full bg-sky-200 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-sky-600" />
                </div>
                <div
                  ref={placementsRef}
                  className="text-5xl font-bold text-sky-600"
                >
                  {placementsCount}+
                </div>
                <h3 className="text-xl font-medium text-sky-900">
                  Career Placements
                </h3>
                <p className="text-slate-700">
                  Successful career launches and counting
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-violet-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-violet-100 opacity-40"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-sky-100 opacity-40"></div>
        </div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="space-y-3" variants={fadeIn}>
              <div className="inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm text-sky-900 shadow-sm">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl/tight bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">
                What Our Community Says
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-700 text-lg md:text-xl">
                Hear from students and institutions who have experienced the HCJ
                difference.
              </p>
            </motion.div>
          </motion.div>

          <div className="relative">
            <motion.div
              className="overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="relative">
                <Slider {...testimonialSettings}>
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="px-4">
                      <TestimonialCard
                        quote={testimonial.quote}
                        name={testimonial.name}
                        role={testimonial.role}
                        imageUrl={testimonial.imageUrl}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-sky-600">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-violet-500 mix-blend-overlay filter blur-xl opacity-50"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-sky-500 mix-blend-overlay filter blur-xl opacity-50"></div>
          </div>
        </div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="grid gap-10 lg:grid-cols-2 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="space-y-6" variants={fadeIn}>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl/tight text-white">
                Ready to Join the HCJ Community?
              </h2>
              <p className="text-white/90 text-lg md:text-xl max-w-[600px]">
                Whether you&apos;re a student starting your career journey or an
                institution looking to connect with verified talent, HCJ is your
                trusted partner.
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={staggerContainer}
              >
                <motion.div
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/emp-rgstr6151">
                      Register as a Company{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full bg-transparent text-white border-white hover:bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/rgstrtn6021">
                      Join as an Institution{" "}
                      <Building className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Image
                src="/image/about/13.png?height=400&width=600"
                alt="Students celebrating graduation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="text-xl font-medium">
                    Start Your Journey Today
                  </p>
                  <p className="text-base opacity-90">
                    Join thousands of students and institutions already on HCJ
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// Testimonial Card Component
function TestimonialCard({ quote, name, role, imageUrl }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="h-full"
    >
      <Card className="p-6 h-full flex flex-col bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-none">
        <div className="flex-1">
          <div className="w-10 h-10 mb-4 text-violet-500 opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.626.41-2.032.76-1.018 1.7-1.52 2.85-1.52.355 0 .672.033.95.1.277.067.677.25 1.2.55L13.868 8.2c-.526-.4-1.06-.734-1.59-1.01-.53-.277-1.23-.415-2.09-.415-1.156 0-2.233.396-3.22 1.186-.988.79-1.48 1.864-1.48 3.22 0 1.225.26 2.244.78 3.06.52.816 1.266 1.39 2.238 1.72.97.33 2.01.495 3.12.495.795 0 1.466-.08 2.01-.24.544-.16.99-.39 1.34-.69.35-.3.61-.65.78-1.05.17-.4.255-.82.255-1.26 0-.6-.085-1.11-.256-1.55-.17-.44-.464-.79-.88-1.05-.415-.26-.935-.39-1.56-.39-.21 0-.41.02-.61.05.17-.38.33-.76.49-1.14.16-.38.273-.76.338-1.14h4.394v-1.65H12.53c-.213.738-.395 1.355-.55 1.85-.154.495-.338.91-.55 1.25-.21.34-.48.635-.81.885-.33.25-.74.425-1.23.525.1-.12.183-.23.247-.335.064-.105.133-.29.205-.55.073-.26.11-.56.11-.91zm-3.5 1.5c-.073-.36-.11-.693-.11-1 0-.25.037-.493.11-.73.073-.237.183-.437.33-.6.146-.163.33-.296.55-.4.22-.103.45-.155.69-.155.372 0 .69.097.957.29.267.193.4.493.4.9 0 .38-.113.683-.34.91-.227.227-.51.34-.85.34-.227 0-.415-.043-.565-.13-.15-.087-.257-.153-.32-.2-.063-.047-.133-.093-.21-.14-.077-.047-.16-.07-.25-.07-.277 0-.468.157-.57.47z" />
            </svg>
          </div>
          <p className="italic text-slate-700 mb-6 text-lg leading-relaxed">
            {quote}
          </p>
        </div>
        <div className="flex items-center mt-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-violet-200">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900">{name}</h4>
            <p className="text-sm text-slate-600">{role}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
