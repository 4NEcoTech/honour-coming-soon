"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
export default function RegistrationWithCredentialForm({ goToNextStep }) {
  const { toast } = useToast();
  const [role, setRole] = useState("");
  const [ formData, setFormData ] = useState({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.email || !role) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/super-admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const result = await response.json();
      if (!response.ok) {
        setIsSubmitting(false);
        toast({ title: result.title || "Error", description: result.message });
        return;
      }

      localStorage.setItem("email", JSON.stringify(formData.email));
      localStorage.setItem("_id", JSON.stringify(result.user._id));
      toast({ title: "Success", description: "OTP Sent. Check your email." });
      setIsSubmitting(false);
      goToNextStep();
    } catch (error) {
      console.error("Error during registration:", error);
setIsSubmitting(false);

      toast({ title: "Network Error", description: "Please try again later." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md dark:bg-gray-800">
        <CardHeader className="space-y-1 text-left sm:text-center">
          <CardTitle className="text-2xl font-bold dark:text-white">
            Super Admin Registration
          </CardTitle>
          <CardDescription className="text-xl dark:text-gray-300">
            Register with HCJ as super admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-primary dark:text-blue-400"
              >
                Super Admin Email Id <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email id"
                required
                value={formData.email}
                onChange={handleChange}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="text-sm text-muted-foreground dark:text-gray-400">
              You&apos;ll receive OTP on your email address
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-primary dark:text-blue-400">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectGroup>
                    <SelectItem value="02">Super Admin</SelectItem>
                    <SelectItem value="03">Super Admin Team</SelectItem>
                    <SelectItem value="04">Super Admin Staff</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              disabled={isSubmitting}

            >
               {isSubmitting ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mr-2 text-white" />
                    Next...
                  </>
                ) : (
              "Next"
                )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-xs text-gray-500 gap-2">
          <p className="text-sm flex items-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/supr-admn-login6102"
              className="text-primary ml-1 hover:underline"
            >
              Click here to log in
            </Link>
          </p>

          <p className="text-center text-xs">
            By creating an account or logging in, you agree to HCJ&apos;s
          </p>

          <div className="flex items-center gap-1">
            <Link
              href="/prvcy-plcy6014"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            <span>and</span>
            <Link
              href="/trmsnd-cndtn6015"
              className="text-primary hover:underline"
            >
              Terms & Conditions
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
