'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { z } from 'zod';

import Otp from '@/components/otp';
import PasswordResetSuccess from '@/components/password-reset-success';
import ResetPassword from '@/components/reset-password';
import { useRouter, useSearchParams } from 'next/navigation';

const schema = z.object({
  email: z.string().email({ message: '6036_1 Invalid email address.' }),
});
function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  console.log(searchParams.get('step'));
  const step = Number(searchParams.get('step') || 0);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  // Function to navigate to the next step
  const goToNextStep = () => {
    const nextStep = step + 1;
    router.push(`?step=${nextStep}`, { shallow: true });
  };
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await fetch('/api/global/v1/gblBrBTForgotPasswordSendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        switch (res.status) {
          case 400: // Bad Request
            console.error('Validation Error:', responseData.message);
            console.error('Error in onSubmit:', error.message);
            Swal.fire({
              icon: 'error',
              title: 'Validation error.',
              text:
                responseData.message || 'Validation error. Please try again.',
            });

            break;

          case 500: // Internal Server Error
            console.error('Server Error:', responseData.message);
            // alert("Something went wrong on the server. Please try again later.");
            // Conflict
            Swal.fire({
              icon: 'error',
              title: 'Server Error!',
              text:
                responseData.message ||
                'Something went wrong on the server. Please try again later.',
            });
            break;

          default:
            console.error('Unexpected Error:', responseData.message);
            Swal.fire({
              icon: 'error',
              title: 'An unexpected error occurred.',
              text: responseData.message || 'Please try again.',
            });
            break;
        }
      } else {
        router.push(
          `/frgt-psswd6036?step=1&email=${encodeURIComponent(data.email)}`,
          { shallow: true }
        );

        Swal.fire({
          icon: 'success',
          title: 'OTP sent successfully.',
          text: 'Please check your email for OTP.',
        });
      }
    } catch (error) {
      console.error('Error in onSubmit:', error.message);
    }
  };

  console.log('step', step);
  return (
    <>
      {step === 0 && (
        <div className="min-h-screen sm:bg-transparent  bg-transparent flex justify-center items-center">
          <Card className="w-full max-w-lg p-8 rounded-lg sm:shadow-lg sm:border border-none  shadow-none sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-normal">
                Forgot Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-lg text-gray-500 mb-4">
                Please enter the email address you used to register at HCJ to
                get OTP
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-primary">
                            {' '}
                            Educational Institution Email ID{' '}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your educational institution email"
                              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Button
                      type="submit"
                      className="w-full py-2 bg-primary text-white rounded-md ">
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 1 && <Otp goToNextStep={goToNextStep} />}
      {/* {step === 1 && <Otp goToNextStep={goToNextStep} />} */}
      {step === 2 && <ResetPassword goToNextStep={goToNextStep} />}
      {step === 3 && <PasswordResetSuccess />}
    </>
  );
}

export default ForgotPasswordPage;
