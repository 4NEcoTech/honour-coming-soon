"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EmployerRegistration({goToNextStep}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter a corporate email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/employer/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en", // Ensures localized error messages
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("OTP sent successfully! Check your email.");
        goToNextStep(); // Redirects to OTP verification page
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold dark:text-white">
            Employer Registration
          </CardTitle>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            If you are an Employer,
            <br />
            please proceed with registration.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Image
              src="/image/authmodule/linkedin.svg"
              alt="LinkedIn"
              width={30}
              height={30}
            />
            Register with LinkedIn
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="dark:bg-gray-700"/>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground dark:bg-gray-800 dark:text-gray-400">
                OR
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <label className="dark:text-blue-400 text-sm font-medium text-primary" htmlFor="email">
              Corporate Email Id <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your corporate email id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              You&apos;ll receive OTP on your email address
            </p>

            <Button type="submit" className="w-full bg-primary dark:bg-blue-600 dark:hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? "Sending OTP..." : "Next"}
            </Button>
          </form>

          <div className="text-left sm:text-center text-sm text-muted-foreground dark:text-gray-400">
            <p>
              Already have an account?{" "}
              <Link href="/emp-login" className="text-primary hover:underline">
                Click here to log in
              </Link>
              .
            </p>
            By creating an account or logging in, you agree with HCJ&apos;s{" "}
            <Link href="/prvcy-plcy6014" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            &{" "}
            <Link href="/trmsndcndtn6015" className="text-primary hover:underline">
              Terms and conditions
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
