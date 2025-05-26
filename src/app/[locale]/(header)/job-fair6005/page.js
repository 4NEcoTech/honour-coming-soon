// 'use client';
// import { Button } from '@/components/ui/button';
// import { Link } from '@/i18n/routing';
// import Image from 'next/image';
// import { useSession } from 'next-auth/react';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick-theme.css';
// import 'slick-carousel/slick/slick.css';

// const partners = ['IBM', 'Google', 'OLA', 'Uber', 'Zepto', 'Amazon'];
// const Page = () => {
//   const { data: session } = useSession();
//   const isLoggedIn = !!session;

//   const settings = {
//     dots: true,
//     arrows: false,
//     infinite: true,
//     speed: 500,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     cssEase: 'linear',
//     pauseOnHover: true,
//     pauseOnFocus: true,
//     responsive: [
//       {
//         breakpoint: 10000,
//         settings: {
//           slidesToShow: 6,
//           slidesToScroll: 1,
//           infinite: true,
//         },
//       },
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 4,
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 640,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="font-sans">
//       {/* First Section */}
//       <div
//         className="relative bg-cover bg-center py-20 px-4 sm:px-6"
//         style={{
//           backgroundImage: "url('/image/institute/jobfair/banner.svg')",
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//           height: '100vh',
//           width: '100%',
//         }}>
//         <div className="max-w-[95%] sm:max-w-xl md:max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 flex flex-col justify-center h-full">
//           <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-black leading-tight">
//             India's biggest Job Fair
//           </h1>
//           <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-green-500 mt-2 sm:mt-4">
//             Organized by HCJ
//           </h2>
//           <p className="text-base sm:text-lg md:text-xl mt-2 sm:mt-4">
//             Welcome to our Job Fair portal, where opportunities meet talent!
//             This platform connects job seekers with top employers in various
//             industries, providing a seamless experience to explore available
//             positions, network with potential employers, and apply for roles
//             that fit your skills and career aspirations.
//           </p>

//           <p className="text-base sm:text-lg md:text-2xl font-bold mt-2 sm:mt-4">
//             November 10 - November 20
//           </p>

//           {isLoggedIn ? (
//             <Link href="/rgstrtn6021">
//               <Button className="bg-primary px-4 py-2 rounded-md mt-2 sm:mt-4 text-sm w-full sm:w-[250px] md:w-[300px] lg:w-[400px] mx-auto">
//                 Register for this job fair
//               </Button>
//             </Link>
//           ) : (
//             <>
//               <Link href="/login6035">
//                 <Button className="bg-primary px-4 py-2 rounded-md mt-2 sm:mt-4 text-sm w-full sm:w-[250px] md:w-[300px] lg:w-[400px] mx-auto">
//                   Login To Register for this job fair
//                 </Button>
//               </Link>

//               <p className="text-sm sm:text-lg md:text-xl mt-2 sm:mt-4">
//                 Not Registered on HCJ?{' '}
//                 <Link href="/job-frm6006">
//                   <span className="text-primary cursor-pointer hover:underline">
//                     Click here
//                   </span>
//                 </Link>
//               </p>
//             </>
//           )}

//           <p className="text-sm sm:text-lg md:text-xl mt-2 sm:mt-4">
//             Share this job fair:
//           </p>
//           <div className="flex justify-center space-x-4 mt-2 sm:mt-4">
//             <a href="#" className="hover:opacity-80">
//               <Image
//                 src="/image/institute/jobfair/linkedin2.svg"
//                 alt="LinkedIn"
//                 width={32}
//                 height={32}
//                 className="w-6 h-6 sm:w-8 sm:h-8"
//               />
//             </a>
//             <a href="#" className="hover:opacity-80">
//               <Image
//                 src="/image/institute/jobfair/instagram.svg"
//                 alt="Instagram"
//                 width={32}
//                 height={32}
//                 className="w-6 h-6 sm:w-8 sm:h-8"
//               />
//             </a>
//             <a href="#" className="hover:opacity-80">
//               <Image
//                 src="/image/institute/jobfair/facebook2.svg"
//                 alt="Facebook"
//                 width={32}
//                 height={32}
//                 className="w-6 h-6 sm:w-8 sm:h-8"
//               />
//             </a>
//             <a href="#" className="hover:opacity-80">
//               <Image
//                 src="/image/institute/jobfair/ecolink.svg"
//                 alt="Eco Link"
//                 width={32}
//                 height={32}
//                 className="w-6 h-6 sm:w-8 sm:h-8"
//               />
//             </a>
//           </div>
//         </div>
//       </div>

//       <div className="bg-transparent py-10 container mx-auto">
//         <div className="flex items-center justify-center px-4 mb-6">
//           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center">
//             Our Partners
//           </h2>
//         </div>

//         <Slider {...settings}>
//           {partners.map((partner, index) => (
//             <div key={index} className="flex justify-center my-6">
//               <div className="flex-shrink-0 w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 flex justify-center">
//                 <Image
//                   src={`/image/institute/jobfair/${partner}.svg`}
//                   alt={partner}
//                   width={400}
//                   height={400}
//                 />
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </div>

//       {/* Banner Section */}
//       <div
//         className="py-16 px-6 bg-gradient-to-r from-blue-600 to-green-400 text-white"
//         style={{
//           backgroundImage: "url('/image/institute/jobfair/banner2.svg')",
//         }}>
//         <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-left md:items-center">
//           <div className="md:flex-1 text-left space-y-4">
//             <h2 className="text-2xl md:text-4xl font-bold">
//               Don't miss this opportunity, apply now
//             </h2>
//             <p className="text-md md:text-lg">
//               Register now for this amazing job fair and explore exciting
//               opportunities.
//             </p>
//           </div>
//           <div className="mt-6 md:mt-0 md:flex-shrink-0">
//             <Link href={isLoggedIn ? "/rgstrtn6021" : "/login6035"}>
//               <Button className="px-8">
//                 {isLoggedIn ? "Register for this job fair" : "Register now"}
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

"use client"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useSession } from "next-auth/react"
import Slider from "react-slick"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import { useState, useEffect } from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

const partners = ["IBM", "Google", "OLA", "Uber", "Zepto", "Amazon"]

// Define the form validation schema with Zod
const formSchema = z.object({
  institutionName: z.string().min(2, {
    message: "Institution name must be at least 2 characters.",
  }),
  institutionAddress: z.string().min(3, {
    message: "Institution address must be at least 3 characters.",
  }),
  institutionEmail: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .or(z.literal("")),
  institutionPhone: z.string().optional(),
  adminPhone: z.string().optional(),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  userPhone: z.string().min(6, {
    message: "Please enter a valid phone number.",
  }),
})

export default function Page() {
  const { data: session } = useSession()
  const isLoggedIn = !!session
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)
 const { toast } = useToast()
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
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
  }

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institutionName: "",
      institutionAddress: "",
      institutionEmail: "",
      institutionPhone: "",
      adminPhone: "",
      firstName: "",
      lastName: "",
      email: "",
      userPhone: "",
    },
    mode: "onBlur", // Changed to onBlur for better UX
  })

  // Reset form state when dialog closes
  useEffect(() => {
    if (!showForm) {
      setFormError(null)
      setFormSuccess(null)
    }
  }, [showForm])

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true)
      setFormError(null)

      // Simulate a network delay for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await fetch("/api/hcj/v1/hcjJBrBT60051JobFairForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (response.ok) {
        // Show success message using toast instead of Swal
        setFormSuccess({
          title: data.title || "Success",
          message: data.message || "Your form has been submitted successfully.",
        })

        toast({
          title: data.title || "Success",
          description: data.message || "Your form has been submitted successfully.",
          // variant: "success",
        })

        // Reset form after successful submission
        form.reset()

        // Close the dialog after a short delay
        setTimeout(() => {
          setShowForm(false)
        }, 2000)
      } else {
        // Show error message
        setFormError({
          title: data.title || "Error",
          message: data.message || "Something went wrong. Please try again.",
        })

        toast({
          title: data.title || "Error",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)

      // Show error message for network/unexpected errors
      setFormError({
        title: "Error",
        message: "Network error or server is unavailable. Please try again later.",
      })

      toast({
        title: "Error",
        description: "Network error or server is unavailable. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="font-sans relative">
      <Toaster />

      {/* First Section */}
      <div
        className="relative bg-cover bg-center py-20 px-4 sm:px-6"
        style={{
          backgroundImage: "url('/image/institute/jobfair/banner.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          width: "100%",
        }}
      >
        <div className="max-w-[95%] sm:max-w-xl md:max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 flex flex-col justify-center h-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-black leading-tight"
          >
            India&apos;s biggest Job Fair
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-medium text-green-500 mt-2 sm:mt-4"
          >
            Organized by HCJ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl mt-2 sm:mt-4"
          >
            Welcome to our Job Fair portal, where opportunities meet talent! This platform connects job seekers with top
            employers in various industries, providing a seamless experience to explore available positions, network
            with potential employers, and apply for roles that fit your skills and career aspirations.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base sm:text-lg md:text-2xl font-bold mt-2 sm:mt-4"
          >
            November 10 - November 20
          </motion.p>

          {isLoggedIn ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="/rgstrtn6021">
                <Button className="bg-primary px-4 py-2 rounded-md mt-2 sm:mt-4 text-sm w-full sm:w-[250px] md:w-[300px] lg:w-[400px] mx-auto hover:bg-primary/90 transition-all duration-300 hover:shadow-lg">
                  Register for this job fair
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link href="/login6035">
                  <Button className="bg-primary px-4 py-2 rounded-md mt-2 sm:mt-4 text-sm w-full sm:w-[250px] md:w-[300px] lg:w-[400px] mx-auto hover:bg-primary/90 transition-all duration-300 hover:shadow-lg">
                    Login To Register for this job fair
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="text-sm sm:text-lg md:text-xl mt-2 sm:mt-4"
              >
                Not Registered on HCJ?{" "}
                <span
                  className="text-primary cursor-pointer hover:underline font-medium"
                  onClick={() => setShowForm(true)}
                >
                  Click here
                </span>
              </motion.p>
            </>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-sm sm:text-lg md:text-xl mt-2 sm:mt-4"
          >
            Share this job fair:
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex justify-center space-x-4 mt-2 sm:mt-4"
          >
            <a href="#" className="hover:opacity-80 transition-opacity duration-300 transform hover:scale-110">
              <Image
                src="/image/institute/jobfair/linkedin2.svg"
                alt="LinkedIn"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity duration-300 transform hover:scale-110">
              <Image
                src="/image/institute/jobfair/instagram.svg"
                alt="Instagram"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity duration-300 transform hover:scale-110">
              <Image
                src="/image/institute/jobfair/facebook2.svg"
                alt="Facebook"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity duration-300 transform hover:scale-110">
              <Image
                src="/image/institute/jobfair/ecolink.svg"
                alt="Eco Link"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Form Modal using shadcn Dialog with React Hook Form */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open)
          if (!open) {
            // Reset form when dialog is closed
            form.reset()
            setFormError(null)
            setFormSuccess(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed sm:leading-normal">
              If you are a student, you can request your institution to register on HCJ by filling the form below:
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-2 max-h-[80vh] overflow-y-auto">
            {/* Form Error Message */}
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6"
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{formError.title}</AlertTitle>
                    <AlertDescription>{formError.message}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Institution Details Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="text-lg font-semibold mb-6 text-center">Your Institution Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="institutionName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-primary">
                            Institution Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Institution name"
                              {...field}
                              className="transition-all duration-200"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="institutionAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-primary">
                            Institution Address <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Bangalore"
                              {...field}
                              className="transition-all duration-200"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="institutionEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-primary">Institution Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Institution email"
                              {...field}
                              className="transition-all duration-200"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="institutionPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-primary">Institution Phone Number</FormLabel>
                          <FormControl>
                            <div className="mt-1">
                              <PhoneInput
                                country={"in"}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                inputStyle={{
                                  width: "100%",
                                  height: "40px",
                                  borderRadius: "5px",
                                  border: "1px solid #ccc",
                                }}
                                containerClass="hover:opacity-90 transition-opacity"
                                disabled={isSubmitting}
                                inputProps={{
                                  name: "institutionPhone",
                                  required: false,
                                  autoFocus: false,
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adminPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-primary">Admin Contact Number</FormLabel>
                          <FormControl>
                            <div className="mt-1">
                              <PhoneInput
                                country={"in"}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                inputStyle={{
                                  width: "100%",
                                  height: "40px",
                                  borderRadius: "5px",
                                  border: "1px solid #ccc",
                                }}
                                containerClass="hover:opacity-90 transition-opacity"
                                disabled={isSubmitting}
                                inputProps={{
                                  name: "adminPhone",
                                  required: false,
                                  autoFocus: false,
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>

                {/* Your Details Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-6 text-center">Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-primary">
                            First Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="First name"
                              {...field}
                              className="transition-all duration-200"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-primary">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Last name"
                              {...field}
                              className="transition-all duration-200"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-primary">
                            Email ID <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email ID"
                              {...field}
                              className="transition-all duration-200"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="userPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-primary">
                            Phone Number <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="mt-1">
                              <PhoneInput
                                country={"in"}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                inputStyle={{
                                  width: "100%",
                                  height: "40px",
                                  borderRadius: "5px",
                                  border: "1px solid #ccc",
                                }}
                                containerClass="hover:opacity-90 transition-opacity"
                                disabled={isSubmitting}
                                inputProps={{
                                  name: "userPhone",
                                  required: true,
                                  autoFocus: false,
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-center mt-8"
                >
                  <Button
                    type="submit"
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 w-full md:w-1/3 text-lg transition-all duration-300 hover:shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-transparent py-10 container mx-auto">
        <div className="flex items-center justify-center px-4 mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center"
          >
            Our Partners
          </motion.h2>
        </div>

        <Slider {...settings}>
          {partners.map((partner, index) => (
            <div key={index} className="flex justify-center my-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 flex justify-center"
              >
                <Image
                  src={`/image/institute/jobfair/${partner}.svg`}
                  alt={partner}
                  width={400}
                  height={400}
                  className="transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Banner Section */}
      <div
        className="py-16 px-6 bg-gradient-to-r from-blue-600 to-green-400 text-white"
        style={{
          backgroundImage: "url('/image/institute/jobfair/banner2.svg')",
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-left md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:flex-1 text-left space-y-4"
          >
            <h2 className="text-2xl md:text-4xl font-bold">Don&apos;t miss this opportunity, apply now</h2>
            <p className="text-md md:text-lg">
              Register now for this amazing job fair and explore exciting opportunities.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0 md:flex-shrink-0"
          >
            <Link href={isLoggedIn ? "/rgstrtn6021" : "/login6035"}>
              <Button className="px-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
                {isLoggedIn ? "Register for this job fair" : "Register now"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
