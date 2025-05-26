"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Link, useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Define the form schema
const formSchema = (t) =>
  z.object({
    email: z.string().email({ message: t ? t("6021_1") : "Invalid email address" }),
  })

function CompanyRegistrationForm({ goToNextStep }) {
  const t = useTranslations("ErrorCode")
  const { locale } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/auth/employer/signup", {
        method: "POST",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await res.json()

      if (!res.ok) {
        // Handle specific status codes
        switch (res.status) {
          case 400: // Bad Request
            console.error("Validation Error:", responseData.message)
            toast({
              title: responseData.title || "Validation Error",
              description: responseData.message || "Validation error. Please try again.",
            })
            break

          case 409: // Conflict
            toast({
              title: responseData.title || "Conflict",
              description: t ? t(responseData.code) : responseData.message,
              action: <Button onClick={() => router.push("/login6035")}>Login</Button>,
            })
            form.setError("email", {
              type: "server",
              message: responseData.message,
            })
            break

          case 500: // Internal Server Error
            console.error("Server Error:", responseData.message)
            toast({
              title: responseData.title || "Server Error",
              description: t ? t(responseData.code) : "Something went wrong on the server. Please try again later.",
            })
            break

          default:
            console.error("Unexpected Error:", responseData.message)
            toast({
              title: "An unexpected error occurred.",
              description: t ? t(responseData.code) : "Please try again.",
            })
            break
        }
      } else {
        // Success case
        localStorage.setItem("email", JSON.stringify(form.getValues("email")))
        localStorage.setItem("_id", JSON.stringify(responseData.user._id))
        localStorage.setItem("role", JSON.stringify(responseData.user.UT_User_Role))

        toast({
          title: "Company registered successfully!",
          description: t ? t(responseData.code) : "Check your email for further instructions.",
        })
        goToNextStep()
      }
    } catch (error) {
      // Catch network or unexpected errors
      toast({
        title: "An error occurred:",
        description: error.message || "Network error or unexpected issue. Please try again later.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-transparent sm:bg-transparent flex justify-center items-start mt-10">
      <Card className="w-full max-w-lg p-8 rounded-lg sm:shadow-lg sm:border border-none shadow-none sm">
        <CardHeader>
          <CardTitle className="text-2xl md:text-zxl lg:text-4xl text-center font-thin">Company Registration</CardTitle>
          <CardDescription>If you are a Company Administrator, please proceed with registration.</CardDescription>
        </CardHeader>
        {/* Form */}
        <CardContent className="space-y-4">
          {/* LinkedIn Button */}
          {/*
          <div>
            <Button
              onClick={() => signIn("linkedin")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md"
            >
              <Image src="/image/authmodule/linkedin.svg" alt="LinkedIn" width={30} height={30} />
              Register with LinkedIn
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="border-t w-1/3"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="border-t w-1/3"></div>
          </div>
            */}
          {/* Company Email */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-primary">
                        Company Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your company email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* OTP Information */}
              <div className="text-sm text-gray-500 mb-6">You&apos;ll receive OTP on your email address</div>

              {/* Next Button */}
              <div>
                <Button
                  disabled={form.formState.isSubmitting || !form.formState.isValid}
                  type="submit"
                  className="w-full py-2 bg-primary text-white rounded-md"
                >
                  {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        {/* Footer Text */}
        <CardFooter className="flex flex-col items-start sm:items-start text-sm text-gray-400 text-start sm:text-left w-full text-pretty">
          {/* Login Link */}
          <span className="text-sm mb-0 text-muted-foreground">
            Already have an account?{" "}
            <Link href="/emp-login6152" className="text-primary hover:underline ml-1">
              Click here to log in
            </Link>
          </span>

          {/* Terms Agreement */}
          <span className="text-start sm:text-left text-sm block">
            By creating an account or logging in, you agree with HCJ&apos;{" "}
            <Link href="/prvcy-plcy6014" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            <span>and&nbsp;</span>
            <Link href="/trmsnd-cndtn6015" className="text-primary hover:underline">
              Terms & Conditions
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CompanyRegistrationForm
