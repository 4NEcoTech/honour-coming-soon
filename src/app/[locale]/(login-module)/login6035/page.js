'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Link } from '@/i18n/routing';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  email: z.string().email({
    message: '6035_1 Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: '6035_2 Password must be at least 8 characters long.',
  }),
});

function Page() {
  const [loginType, setLoginType] = useState('institution');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data) {
    let role;

    // Assign role based on selected login type
    if (loginType === 'institution') {
      role = '06'; // 06 for Institution Admin by default
    } else if (loginType === 'student') {
      role = '05'; // 05 for Student
    }

    // Send selected role to NextAuth for verification
    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
      role: role, // Send role in login request
    });

    if (res?.error) {
      toast({
        title: 'Login Failed',
        description: res.error,
        variant: 'destructive',
      });
    } else if (res?.url) {
      router.replace(res.url);
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, router]);
  return (
    <div className="min-h-screen sm:bg-transparent bg-transparent flex justify-center items-start mb-0 md:mb-16 mt-0 md:mt-10">
      <Card className="w-full max-w-lg p-8 rounded-lg sm:shadow-lg sm:border border-none  shadow-none sm">
        <CardHeader className="flex justify-center">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Login Type Selection */}
          <div className="flex justify-around space-x-4 mb-4">
            <div className="flex  items-center">
              <input
                type="radio"
                id="institution-login"
                name="login-type"
                checked={loginType === 'institution'}
                onChange={() => setLoginType('institution')}
                className="mr-2"
              />
              <Label htmlFor="institution-login">Institution login</Label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="student-login"
                name="login-type"
                checked={loginType === 'student'}
                onChange={() => setLoginType('student')}
                className="mr-2"
              />
              <Label htmlFor="student-login">Student login</Label>
            </div>
          </div>

          {/* LinkedIn Button - Shown Only for Institution Login */}
          {loginType === 'institution' && (
            <>
              <div className="mb-4">
                <Button
                  onClick={() => signIn('linkedin')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md">
                  <Image
                    src="/image/authmodule/linkedin.svg"
                    alt="LinkedIn"
                    width={30}
                    height={30}
                  />
                  Login with LinkedIn
                </Button>
              </div>

              {/* Divider for OR */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="border-t w-1/3"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="border-t w-1/3"></div>
              </div>
            </>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Educational Institution Email */}
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-primary">
                        {loginType === 'institution'
                          ? 'Educational Institution Email'
                          : 'Email'}{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={
                            loginType === 'institution'
                              ? 'Enter your educational institution email'
                              : 'Enter your email'
                          }
                          className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-primary">
                        Password <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3  py-2 hover:bg-transparent"
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
              </div>

              {/* Login Button */}
              <Link
                href={'/frgt-psswd6036'}
                className="flex justify-end text-sm text-primary mb-4 font-semibold hover:underline">
                Forgot Password?
              </Link>
              <div className="mb-0">
                <Button
                  type="submit"
                  disable={form.formState.isSubmitting}
                  className="w-full py-2 bg-primary text-white rounded-md ">
                  {form.formState.isSubmitting && (
                    <Loader2 className="animate-spin" />
                  )}
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        {/* Footer Text */}
        <CardFooter className="flex flex-col items-start sm:items-start text-xs text-gray-400 text-center sm:text-left w-full">
          {/* Sign-up Link */}
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/rgstrtn6021" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          {/* Terms Agreement */}
          <span className="text-start text-sm sm:text-left">
            By creating an account or logging in, you agree with HCJ&apos;s
          </span>

          {/* Privacy Policy & Terms */}
          <div className="flex flex-wrap items-start justify-start sm:justify-start gap-1">
            <Link
              href="/prvcy-plcy6014"
              className="text-primary hover:underline">
              Privacy Policy
            </Link>
            <span>and</span>
            <Link
              href="/trmsnd-cndtn6015"
              className="text-primary hover:underline">
              Terms & Conditions
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
