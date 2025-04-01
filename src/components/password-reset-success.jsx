"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function PasswordResetSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-transparent sm:bg-transparent px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 rounded-lg  sm:border border-none  shadow-none sm:shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-green-600">Password Changed!</CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-gray-600 text-sm">Your password has been changed successfully!</p>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            className="w-full bg-primary text-white py-2 px-4 rounded-md"
            onClick={() => router.push("/login")}
          >
            Proceed to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PasswordResetSuccess;
