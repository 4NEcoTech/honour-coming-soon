"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema for password validation
const FormSchema = z
  .object({
    password: z
      .string()
      .min(12, { message: "6023_1 Password must be at least 12 characters." })
      .regex(/[A-Z]/, {
        message: "6023_2 Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "6023_3 Password must contain at least one lowercase letter.",
      })
      .regex(/\d/, {
        message: "6023_4 Password must contain at least one number.",
      })
      .regex(/[@$!%*?&]/, {
        message: "6023_5 Password must contain at least one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "6023_7 Passwords must match.",
    path: ["confirmPassword"],
  });

function CreatePassword() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data) {
    try {
      const res = await fetch("/api/global/v1/gblBrBt90009CreatePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        switch (res.status) {
          case 400: // Bad Request
            console.error("Validation Error:", responseData.message);
            toast({
              title: "Validation error.",
              description: responseData.message,
            });
            break;
          case 500: // Internal Server Error
            console.error("Server Error:", responseData.message);
            toast({
              title: "internal server Error",
              description: responseData.message,
            });
            break;
          // alert("Something went wrong on the server. Please try again later.");
          case 404: // Conflict
            toast({
              title: "Error While saving Password",
              description: responseData.message,
            });
            break;

          default:
            console.error("Unexpected Error:", responseData.message);
            alert("An unexpected error occurred. Please try again.");
            toast({
              title: "An unexpected error occurred.",
              description: responseData.message || "Please try again.",
            });
            break;
        }
      } else {
        toast({
          title: "Success",
          description: "Password Created Successfully!",
        });

        console.log("🔍 Auto-login with:", {
          email: responseData.email,
          role: responseData.role,
        });

        // ✅ Auto-login after password creation
        const loginRes = await signIn("credentials", {
          redirect: false,
          email: responseData.email,
          password: data.password,
          role: responseData.role, // ✅ Pass role correctly
        });

        if (loginRes?.error) {
          toast({ title: "Login Failed", description: loginRes.error });
        } else {
          // Role-based redirection
          const userRole = responseData.role;

          if (["02", "03", "04"].includes(userRole)) {
            router.push("/supr-admn-dshbrd6103");
          } else if (userRole === "05") {
            router.push("/set-studnt-dtls");
          } else if (["06"].includes(userRole)) {
            router.push("/set-admin-dtls");
          } else if (["07", "08", "10", "11"].includes(userRole)) {
            router.push("/set-team-staff-prfl");
          } else if (["09"].includes(userRole)) {
            router.push("/set-admin-dtls");
          } else {
            // Fallback to home page for any other roles
            router.push("/");
          }
        }
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: error.message || "Network error. Try again later.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-white sm:bg-gray-50 flex justify-center items-center">
      <Card className="w-full max-w-lg p-8 rounded-lg sm:shadow-lg sm:border border-none shadow-none sm">
        <CardHeader>
          <CardTitle>Create Password</CardTitle>
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
                      Enter Password <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
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
                            showPassword ? "Hide password" : "Show password"
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
              <p className="text-xs text-pretty my-4 text-gray-500">
                The password must contain at least 12 characters, including one
                special character, one number, one uppercase letter, and one
                lowercase letter.
              </p>
              {/* Confirm Password Input */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      Confirm password{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
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
                              ? "Hide password"
                              : "Show password"
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
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                  type="submit"
                  className="w-full py-2 bg-primary text-white rounded-md">
                  {form.formState.isSubmitting && (
                    <Loader2 className="animate-spin" />
                  )}
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
