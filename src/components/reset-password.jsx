'use client';
import { Button } from '@/components/ui/button'; // Assuming Button component exists
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Card component exists
import { Input } from '@/components/ui/input'; // Assuming Input component exists
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const FormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: '6037_1 Password must be at least 8 characters.' })
      .regex(/[A-Z]/, {
        message: '6037_2 Password must contain at least one uppercase letter.',
      })
      .regex(/[a-z]/, {
        message: '6037_3 Password must contain at least one lowercase letter.',
      })
      .regex(/\d/, {
        message: '6037_4 Password must contain at least one number.',
      })
      .regex(/[@$!%*?&]/, {
        message: '6037_5 Password must contain at least one special character.',
      }),
    confirmPassword: z.string().min(8, {
      message: '6037_6 Confirm Password must be at least 8 characters.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '6037_7 Passwords must match.',
    path: ['confirmPassword'], // Specifies where the error should appear
  });

function CreatePassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  async function onSubmit(data) {
    try {
      const res = await fetch('/api/global/v1/gblBrBT90009CreatePassword', {
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
            toast({
              title: 'Validation error.',
              description: responseData.message,
            });
            break;
          case 500: // Internal Server Error
            console.error('Server Error:', responseData.message);
            toast({
              title: 'internal server Error',
              description: responseData.message,
            });
            break;
          // alert("Something went wrong on the server. Please try again later.");
          case 404: // Conflict
            toast({
              title: 'Error While saving Password',
              description: responseData.message,
            });
            break;

          default:
            console.error('Unexpected Error:', responseData.message);
            alert('An unexpected error occurred. Please try again.');
            toast({
              title: 'An unexpected error occurred.',
              description: responseData.message || 'Please try again.',
            });
            break;
        }
      } else {
        toast({
          title: 'Password Created successfully!.',
          description: responseData.message,
        });
        router.push('/login6035', undefined, { shallow: true });
      }
    } catch (error) {
      // Catch network or unexpected errors
      toast({
        title: 'Error in onSubmit:',
        description:
          responseData.message ||
          'Network error or unexpected issue. Please try again later.',
      });
      // console.error("Error in onSubmit:", error.message);
      // alert("Network error or unexpected issue. Please try again later.");
    }
  }
  return (
    <div className="min-h-screen  bg-white sm:bg-gray-50 flex justify-center items-center">
      <Card className="w-full max-w-lg p-8 rounded-lg sm:shadow-lg sm:border border-none  shadow-none sm">
        <CardHeader>
          <CardTitle className="text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {' '}
                      Enter Password <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }>
                          {showPassword ? (
                            <Eye
                              className="h-4 w-4 text-gray-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <EyeOff
                              className="h-4 w-4 text-gray-500"
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className=" text-xs text-pretty  my-4 text-gray-500">
                The password must contain at least 12 characters, including one
                special character,one number, one uppercase letter, and one
                lowercase letter.
              </p>
              {/* Confirm Password Input */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Confirm password{' '}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          aria-label={
                            showConfirmPassword
                              ? 'Hide password'
                              : 'Show password'
                          }>
                          {showConfirmPassword ? (
                            <Eye
                              className="h-4 w-4 text-gray-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <EyeOff
                              className="h-4 w-4 text-gray-500"
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="mt-4">
                <Button
                  type="submit"
                  className="w-full py-2 bg-primary text-white rounded-md">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreatePassword;
