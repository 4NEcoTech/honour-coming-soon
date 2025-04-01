"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

function Page() {
  const [userRole, setUserRole] = useState("02");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      role: userRole, 
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

  return (
    <div className="p-6 min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-lg p-8 rounded-lg sm:border sm:shadow shadow-none dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-primary dark:text-blue-400">Super Admin Login</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <Label className="text-primary dark:text-blue-400">Select Role</Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="02"
                  checked={userRole === "02"}
                  onChange={() => setUserRole("02")}
                />
                <span>Super Admin</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="03"
                  checked={userRole === "03"}
                  onChange={() => setUserRole("03")}
                />
                <span>SA - Team</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="04"
                  checked={userRole === "04"}
                  onChange={() => setUserRole("04")}
                />
                <span>SA - Support</span>
              </label>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary dark:text-blue-400">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary dark:text-blue-400">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" {...field} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye /> : <EyeOff />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full mt-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-300">Login</Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col justify-center items-start md:items-center text-sm text-muted-foreground dark:text-gray-400">
        <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/supr-admn-rgstrtn6101" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            By logging in, you agree with HCJ&apos;s <Link href="/prvcy-plcy6014" className="text-primary hover:underline">Privacy Policy</Link> & <Link href="/trmsnd-cndtn6015" className="text-primary hover:underline">Terms and Conditions</Link>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
