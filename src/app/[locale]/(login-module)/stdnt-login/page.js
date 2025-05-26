"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link } from "@/i18n/routing"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
})

export default function StudentLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status, router])

  async function onSubmit(data) {
    // Send role to NextAuth for verification
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      role: "05", // 05 for Student
    })

    if (res?.error) {
      toast({
        title: "Login Failed",
        description: res.error,
        variant: "destructive",
      })
    } else if (res?.url) {
      router.replace(res.url)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <Card className="w-full max-w-lg rounded-lg shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-center">Student Login</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Student Login Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-primary">
                        Student Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your student email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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

                <div className="flex justify-end">
                  <Link href="/frgt-psswd6036" className="text-sm text-primary font-semibold hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full py-2 bg-primary text-white rounded-md"
                >
                  {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Login
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start text-sm text-gray-500 pt-2">
          <p className="mb-2">
            Don&apos;t have an account?{" "}
            <Link href="/rgstrtn6021" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <div className="text-xs">
            <p>By creating an account or logging in, you agree with HCJ&apos;s</p>
            <div className="flex flex-wrap gap-1">
              <Link href="/prvcy-plcy6014" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              <span>and</span>
              <Link href="/trmsnd-cndtn6015" className="text-primary hover:underline">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
