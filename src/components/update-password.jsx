"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useChangePassword } from "@/hooks/useChangePassword"; //  Using API Hook

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  });

export default function PasswordForm({ setPasswordChange }) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const { changePassword, loading } = useChangePassword(); //  Use custom API hook
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData) => {
    const userId = session?.user?.email;
    if (!userId) {
      toast({ title: "Error", description: "User ID not found. Please log in again.", variant: "destructive" });
      return;
    }

    const response = await changePassword(userId, formData);

    if (response.success) {
      toast({ title: "Success", description: "Password updated successfully!", variant: "success" });
      form.reset();
      setPasswordChange(false); //  Close the form after successful update
    } else {
      toast({ title: "Error", description: response.data?.error || "Something went wrong.", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
      {/* Current Password */}
      <div>
        <Label className="text-sm font-medium text-primary dark:text-blue-400">Enter Current Password</Label>
        <div className="relative">
          <Input
            {...form.register("currentPassword")}
            type={showPassword.current ? "text" : "password"}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm pr-10"
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
          >
            {showPassword.current ? <EyeOff className="h-5 w-5 text-primary" /> : <Eye className="h-5 w-5 text-primary" />}
          </span>
        </div>
        <p className="text-red-500 text-sm">{form.formState.errors.currentPassword?.message}</p>
      </div>

      {/* New Password */}
      <div>
        <Label className="text-sm font-medium text-primary dark:text-blue-400">Enter New Password</Label>
        <div className="relative">
          <Input
            {...form.register("newPassword")}
            type={showPassword.new ? "text" : "password"}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm pr-10"
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
          >
            {showPassword.new ? <EyeOff className="h-5 w-5 text-primary" /> : <Eye className="h-5 w-5 text-primary" />}
          </span>
        </div>
        <p className="text-red-500 text-sm">{form.formState.errors.newPassword?.message}</p>
      </div>

      {/* Confirm Password */}
      <div>
        <Label className="text-sm font-medium text-primary dark:text-blue-400">Confirm New Password</Label>
        <div className="relative">
          <Input
            {...form.register("confirmPassword")}
            type={showPassword.confirm ? "text" : "password"}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm pr-10"
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
          >
            {showPassword.confirm ? <EyeOff className="h-5 w-5 text-primary" /> : <Eye className="h-5 w-5 text-primary" />}
          </span>
        </div>
        <p className="text-red-500 text-sm">{form.formState.errors.confirmPassword?.message}</p>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
