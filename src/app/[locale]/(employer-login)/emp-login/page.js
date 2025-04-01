"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email({
    message: "6035_1 Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "6035_2 Password must be at least 8 characters long.",
  }),
});

function Page() {
  const [loginType, setLoginType] = useState("institution");
  const [showPassword, setShowPassword] = useState(false);
  const [subRole, setSubRole] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    let role;
  
    // Assign role based on selected login type
    switch (loginType) {
      case "institution":
        role = subRole; // Can be 06, 07, or 08
        break;
      case "student":
        role = "05"; // 05 for Student
        break;
      case "employer":
        role = subRole; // Can be 09, 10, or 11
        break;
      case "jobseeker":
        role = "12"; // 12 for Job Seeker
        break;
      default:
        role = "05";
    }
  
    // ✅ Send selected role to NextAuth for verification
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      role: role, // ✅ Send role in login request
    });
  
    if (res?.error) {
      toast({
        title: "Login Failed",
        description: res.error,
        variant: "destructive",
      });
    } else {
      router.replace("/");
    }
  }

  // If user is already authenticated, redirect them to the home page
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // Set default sub-role based on login type
  useEffect(() => {
    if (loginType === "institution") {
      setSubRole("06"); // 06 for Institution Admin by default
    } else if (loginType === "employer") {
      setSubRole("09"); // 09 for Employer Admin by default
    } else {
      setSubRole("");
    }
  }, [loginType]);

  return (
    <div className="p-6 min-h-screen sm:bg-transparent bg-transparent flex justify-center items-center">
      <Card className="w-full max-w-lg p-8 rounded-lg sm:border sm:shadow shadow-none">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Login Type Selection */}
          <div className="flex justify-around space-x-4 mb-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="institution-login"
                name="login-type"
                checked={loginType === "institution"}
                onChange={() => setLoginType("institution")}
                className="mr-2"
              />
              <Label htmlFor="institution-login">Institution</Label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="student-login"
                name="login-type"
                checked={loginType === "student"}
                onChange={() => setLoginType("student")}
                className="mr-2"
              />
              <Label htmlFor="student-login">Student</Label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="employer-login"
                name="login-type"
                checked={loginType === "employer"}
                onChange={() => setLoginType("employer")}
                className="mr-2"
              />
              <Label htmlFor="employer-login">Employer</Label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="jobseeker-login"
                name="login-type"
                checked={loginType === "jobseeker"}
                onChange={() => setLoginType("jobseeker")}
                className="mr-2"
              />
              <Label htmlFor="jobseeker-login">Job Seeker</Label>
            </div>
          </div>

          {/* LinkedIn Button - Shown Only for Institution Login */}
          {loginType === "institution" && (
            <>
              <div className="mb-4">
                <Button
                  onClick={() => signIn("linkedin")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md"
                >
                  <Image src="/image/authmodule/linkedin.svg" alt="LinkedIn" width={30} height={30} />
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

          {(loginType === "institution" || loginType === "employer") && (
            <div className="mb-4">
              <Label htmlFor="role-select" className="block text-sm font-medium text-primary">
                Select Role
              </Label>
              <select
                id="role-select"
                value={subRole}
                onChange={(e) => setSubRole(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {loginType === "institution" && (
                  <>
                    <option value="06">Institution Administrator</option>
                    <option value="07">Institution Team</option>
                    <option value="08">Institution Support</option>
                  </>
                )}
                {loginType === "employer" && (
                  <>
                    <option value="09">Employer Admin</option>
                    <option value="10">Employer Team</option>
                    <option value="11">Employer Support</option>
                  </>
                )}
              </select>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-primary">
                        {loginType === "institution" ? "Educational Institution Email" : "Email"}{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={
                            loginType === "institution" ? "Enter your educational institution email" : "Enter your email"
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <Eye className="h-4 w-4 text-gray-500" aria-hidden="true" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-500" aria-hidden="true" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Link href="/frgt-psswd6036" className="flex justify-end text-sm text-primary mb-4 font-semibold hover:underline">
                Forgot Password?
              </Link>

              <div className="mb-4">
                <Button type="submit" className="w-full py-2 bg-primary text-white rounded-md">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col text-xs text-left text-gray-400">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/rgstrtn6021" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <span>By creating an account or logging in, you agree with HCJ&apos;s</span>
          <span className="flex items-center">
            <Link href="/prvcy-plcy6014" className="text-primary mr-1">
              Privacy Policy
            </Link>
            <span>and</span>
            <Link href="/trmsnd-cndtn6015" className="text-primary ml-1">
              Terms & Conditions
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
