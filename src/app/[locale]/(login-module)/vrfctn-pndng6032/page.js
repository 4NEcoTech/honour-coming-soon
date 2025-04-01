// 'use client';

// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Link } from '@/i18n/routing';
// import { IoArrowBack, IoInformationCircleOutline } from 'react-icons/io5';
// function Page() {
//   return (
//     <div className="min-h-screen flex justify-center items-center bg-transparent px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-lg p-6 rounded-lg shadow-lg">
//         {/* Back Arrow */}
//         <div className="flex justify-start mb-4">
//           <Button
//             variant="ghost"
//             className="p-0 text-gray-600 hover:text-gray-900"
//             onClick={() => console.log('Go back')}>
//             <IoArrowBack size={24} />
//           </Button>
//         </div>

//         {/* Verification Title */}
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-semibold text-yellow-600 flex items-center justify-center">
//             Verification Pending{' '}
//             <IoInformationCircleOutline size={24} className="ml-2" />
//           </CardTitle>
//         </CardHeader>

//         {/* Message Content */}
//         <CardContent className="text-center">
//           <p className="text-gray-600 text-sm mb-4">
//             Thank you for submitting your details. Your account is under review
//             and pending verification. If we need any additional information, we
//             will contact you within 48 hours.
//           </p>
//           <p className="font-semibold text-gray-700">
//             You&apos;ll receive an email from us once your account gets
//             verified.
//           </p>
//         </CardContent>

//         {/* Footer with Button */}
//         <CardFooter className="flex justify-center">
//           <Link href="/">
//             <Button
//               href="/"
//               className="w-full bg-primary text-white py-2 px-4 rounded-md">
//               Go to homepage
//             </Button>
//           </Link>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

// export default Page;


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, ArrowLeft, CheckCircle2, AlertCircle, Mail, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function VerificationPendingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(90)
  const [timeRemaining, setTimeRemaining] = useState("48 hours")

  // Simulate progress for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(90)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-background to-muted/30 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md border-muted/20 shadow-lg">
        {/* Status indicator at the top */}
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-t-lg p-3 flex items-center justify-center gap-2 border-b border-amber-200 dark:border-amber-800">
          <Clock className="h-5 w-5 text-amber-500" />
          <span className="text-amber-700 dark:text-amber-400 font-medium text-sm">Verification in progress</span>
        </div>

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-full">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Go back</span>
          </Button>
        </div>

        <CardHeader className="pt-8 pb-2">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">Verification Pending</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Your account is currently under review
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Verification progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Submitted</span>
              <span>In Review</span>
              <span>Verified</span>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <p className="text-sm">
              Thank you for submitting your details. Our team is currently reviewing your information.
            </p>
            <div className="flex items-start gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                Estimated time remaining: <span className="font-medium text-foreground">{timeRemaining}</span>
              </p>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                You&apos;ll receive an email notification once your account is verified.
              </p>
            </div>
          </div>

          {/* Next steps */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">What happens next?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>We&apos;ll review your submitted information</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>You&apos;ll receive an email with the verification result</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Once verified, you&apos;ll have full access to your account</span>
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => (window.location.href = "thehonourenterprise@gmail.com")}
                >
                  Contact Support
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Have questions? We&apos;re here to help!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link href="/" className="w-full sm:w-auto sm:ml-auto">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Additional information */}
      <p className="text-center text-xs text-muted-foreground mt-4 max-w-md">
        If you don&apos;t receive any update within 48 hours, please contact our support team at{" "}
        <a href="thehonourenterprise@gmail.com" className="underline hover:text-primary">
        thehonourenterprise@gmail.com
        </a>
      </p>
    </div>
  )
}

