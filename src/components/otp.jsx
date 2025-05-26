// 'use client';
// // get email from useSearchParams and send as props to otp component
// import { Button } from '@/components/ui/button'; // Assuming Button component exists
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Card component exists
// import { useEffect, useState } from 'react';
// import {
//   IoMdCheckmarkCircleOutline,
//   IoMdCloseCircleOutline,
// } from 'react-icons/io';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/hooks/use-toast';
// import { useSearchParams } from 'next/navigation';

// const formSchema = z.object({
//   pin: z
//     .string()
//     .length(4, { message: ' PIN must be 4 digits' })
//     .regex(/^\d+$/, { message: 'PIN must contain only numbers' }),
// });
// function Otp({ goToNextStep }) {
//   const searchParams = useSearchParams();
//   const [otp, setOtp] = useState(['', '', '', '']); // 4 OTP input fields
//   const [isVerified, setIsVerified] = useState(false); // null: neutral, true: success, false: error
//   const [timer, setTimer] = useState(20);
//   const { toast } = useToast();
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       pin: '',
//     },
//   });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleChange = (value, index) => {
//     if (!/^\d*$/.test(value)) return; // Only allow digits

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     form.setValue('pin', newOtp.join(''), { shouldValidate: true });

//     // Move to next input
//     if (value && index < 3) {
//       const nextInput = document.getElementById(`otp-${index + 1}`);
//       if (nextInput) nextInput.focus();
//     }
//   };
//   async function onSubmit(data) {
//     // console.log("data",data)
//     try {
//       const response = await fetch('/api/hcjAuTO60222VerifyOtp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ otp, email: searchParams.get('email') }),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         // Handle specific status codes
//         switch (response.status) {
//           case 400: // Bad Request
//             console.error('Validation Error:', responseData.message);
//             // Show a specific error to the user (e.g., invalid input)
//             toast({
//               title: 'OTP Error.',
//               description: responseData.message,
//             });
//             break;

//           case 500: // Internal Server Error
//             console.error('Server Error:', responseData.message);
//           // alert("Something went wrong on the server. Please try again later.");
//           case 409: // Conflict
//             toast({
//               title: 'Server Error!.',
//               description:
//                 responseData.message ||
//                 'Something went wrong on the server. Please try again later.',
//             });
//             break;

//           default:
//             console.error('Unexpected Error:', responseData.message);
//             alert('An unexpected error occurred. Please try again.');
//             toast({
//               title: 'An unexpected error occurred.',
//               description: responseData.message || 'Please try again.',
//             });
//             break;
//         }
//       } else {
//         toast({
//           title: responseData.title,
//           description:
//             responseData.message ||
//             'Check your email for further instructions.',
//         });
//         setIsVerified(true);

//         setTimeout(() => {
//           goToNextStep();
//         }, 1000);
//       }
//     } catch (error) {
//       // Catch network or unexpected errors
//       toast({
//         title: 'Error in onSubmit:',
//         description:
//           responseData.message ||
//           'Network error or unexpected issue. Please try again later.',
//       });
//     }
//   }

//   // const correctOtp = "1234"; // Dummy OTP for testing

//   const handleBackspace = (e, index) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       const prevInput = document.getElementById(`otp-${index - 1}`);
//       if (prevInput) prevInput.focus();
//     }
//   };

//   const handleResend = async () => {
//     try {
//       const response = await fetch('/api/hcjAuTO60221ResentOtp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: searchParams.get('email') }),
//       });

//       const responseData = await response.json();
//       console.log(responseData.message);
//       toast({
//         title: 'OTP Sent Successfully!.',
//         description: responseData.message,
//       });

//       setTimer(20); // Reset timer
//       setOtp(['', '', '', '']);
//       form.reset();
//       setIsVerified(false);
//     } catch (error) {
//       toast({
//         title: 'Error in  the generating OTP:',
//         description:
//           'Network error or unexpected issue. Please try again later.',
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white sm:bg-gray-50 flex justify-center items-center px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-lg p-8 rounded-lg border-none sm:border  shadow-none sm:shadow-lg">
//         <CardHeader className="text-center">
//           <CardTitle>OTP Verification</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <p className="text-center text-sm text-gray-500 mb-6">
//             Enter the OTP sent to your registered email or phone number.
//           </p>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="pin"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <div className="flex justify-center space-x-4 mb-4">
//                         {otp.map((digit, index) => (
//                           <Input
//                             key={index}
//                             id={`otp-${index}`}
//                             type="text"
//                             inputMode="numeric"
//                             pattern="[0-9]*"
//                             maxLength={1}
//                             value={digit}
//                             onChange={(e) =>
//                               handleChange(e.target.value, index)
//                             }
//                             onKeyDown={(e) => handleBackspace(e, index)}
//                             className={`w-12 h-12 text-center text-lg border rounded-md focus:ring-2 focus:outline-none ${
//                               isVerified === false
//                                 ? 'border-input focus:ring-ring'
//                                 : isVerified
//                                 ? 'border-green-500 focus:ring-green-500'
//                                 : 'border-destructive focus:ring-destructive'
//                             }`}
//                             required
//                             aria-label={`OTP digit ${index + 1}`}
//                           />
//                         ))}
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-center" />
//                   </FormItem>
//                 )}
//               />

//               {/* Timer and Resend Code */}
//               {isVerified === false && (
//                 <div className="text-center">
//                   {/* <p className="text-sm text-muted-foreground mb-1">
//                     Code expires in:{' '}
//                     <span className="font-semibold">{timer}s</span>
//                   </p> */}
//                   <p className="font-semibold text-foreground">
//                     Didn&apos;t receive the OTP?
//                   </p>
//                   <Button
//                     type="button"
//                     variant="link"
//                     className="text-primary hover:underline mt-1"
//                     onClick={handleResend}
//                     disabled={timer > 0}>
//                     Resend Code :<span className="font-semibold">{timer}s</span>
//                   </Button>
//                 </div>
//               )}
//               {/* Success/Error Message */}
//               {isVerified !== false && (
//                 <div className="text-sm flex items-center justify-center">
//                   {isVerified ? (
//                     <p className="text-green-600 flex items-center">
//                       <IoMdCheckmarkCircleOutline className="mr-2 text-lg " />
//                       OTP Verified Successfully!
//                     </p>
//                   ) : (
//                     <p className="text-destructive flex items-center">
//                       <IoMdCloseCircleOutline className="mr-2 text-lg" />
//                       Invalid OTP. Please try again.
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Verify Button */}
//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={!form.formState.isValid || isVerified === true}>
//                 Verify
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default Otp;

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

const formSchema = (t) =>
  z.object({
    pin: z
      .string()
      .length(4, { message: t("6022_16") })
      .regex(/^\d+$/, { message: t("6022_17") }),
  });

function Otp({ goToNextStep }) {
  const t = useTranslations("formErrors");
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState(["", "", "", ""]); // 4 OTP input fields
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(20);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    form.setValue("pin", newOtp.join(""), { shouldValidate: true });

    // Move to next input if available
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  async function onSubmit(data) {
    try {
      const response = await fetch("/api/global/v1/gblBrBt90008VerifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass email and role (from URL query parameters) along with OTP
        body: JSON.stringify({
          otp,
          email: searchParams.get("email"),
          role: searchParams.get("role"),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle specific status codes
        switch (response.status) {
          case 400:
            console.error("Validation Error:", responseData.message);
            toast({
              title: "OTP Error.",
              description: t(responseData.code),
            });
            break;
          case 500:
            console.error("Server Error:", responseData.message);
          // fallthrough
          case 409:
            toast({
              title: "Server Error!.",
              description: t(responseData.code),
              // responseData.message ||
              // 'Something went wrong on the server. Please try again later.',
            });
            break;
          default:
            console.error("Unexpected Error:", responseData.message);
            toast({
              title: "An unexpected error occurred.",
              description: t(responseData.code),
              // description: responseData.message || 'Please try again.',
            });
            break;
        }
      } else {
        toast({
          title: responseData.title,
          description: t(responseData.code),
          // responseData.message ||
          // 'Check your email for further instructions.',
        });
        setIsVerified(true);
        setTimeout(() => {
          goToNextStep();
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Error in onSubmit:",
        description: t(responseData.code),
      });
    }
  }

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResend = async () => {
    // console.log(
    //   "email:",
    //   localStorage.getItem("email"),
    //   "role:",
    //   localStorage.getItem("role")
    // );
    try {
      const response = await fetch("/api/global/v1/gblBrBt90007ResentOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass email and role for resend endpoint
        body: JSON.stringify({
          email: searchParams.get("email"),
        }),
      });

      const responseData = await response.json();
      console.log(responseData.message);
      toast({
        title: "OTP Sent Successfully!.",
        description: t(responseData.code),
      });
      setTimer(20); // Reset timer
      setOtp(["", "", "", ""]);
      form.reset();
      setIsVerified(false);
    } catch (error) {
      toast({
        title: "Error generating OTP:",
        description:
          "Network error or unexpected issue. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white sm:bg-gray-50 flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg p-8 rounded-lg border-none sm:border shadow-none sm:shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>OTP Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-500 mb-6">
            Enter the OTP sent to your registered email or phone number.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center space-x-4 mb-4">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleBackspace(e, index)}
                            className={`w-12 h-12 text-center text-lg border rounded-md focus:ring-2 focus:outline-none ${
                              isVerified === false
                                ? "border-input focus:ring-ring border-gray-500"
                                : isVerified
                                ? "border-green-500 focus:ring-green-500"
                                : "border-destructive focus:ring-destructive"
                            }`}
                            required
                            aria-label={`OTP digit ${index + 1}`}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              {/* Timer and Resend Code */}
              {isVerified === false && (
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    Didn&apos;t receive the OTP?
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary hover:underline mt-1"
                    onClick={handleResend}
                    disabled={timer > 0}>
                    Resend Code :<span className="font-semibold">{timer}s</span>
                  </Button>
                </div>
              )}

              {/* Success/Error Message */}
              {isVerified !== false && (
                <div className="text-sm flex items-center justify-center">
                  {isVerified ? (
                    <p className="text-green-600 flex items-center">
                      <IoMdCheckmarkCircleOutline className="mr-2 text-lg " />
                      OTP Verified Successfully!
                    </p>
                  ) : (
                    <p className="text-destructive flex items-center">
                      <IoMdCloseCircleOutline className="mr-2 text-lg" />
                      Invalid OTP. Please try again.
                    </p>
                  )}
                </div>
              )}

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }>
                {form.formState.isSubmitting && (
                  <Loader2 className="animate-spin" />
                )}
                Verify
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Otp;
