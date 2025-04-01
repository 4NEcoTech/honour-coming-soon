"use client";
import { Button } from "@/components/ui/button"; // Assuming Button component exists
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming Card component exists
import { Input } from "@/components/ui/input"; // Assuming Input component exists
import { Label } from "@/components/ui/label"; // Assuming Label component exists
import { Eye, EyeOff } from "lucide-react"; // Icon for password visibility toggle
import { useState } from "react";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    // Add logic to submit the passwords
  };

  return (
    <div className="min-h-screen sm:bg-transparent  bg-transparent flex justify-center items-center p-4 sm:p-8">
      <Card className="w-full max-w-lg p-8 rounded-lg sm:shadow-lg sm:border border-none  shadow-none sm ">
        <CardHeader className="text-center">
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div className="mb-4">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-primary"
              >
                Enter Your New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-primary" />
                  ) : (
                    <Eye className="w-5 h-5 text-primary" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                The password must contain at least 8 characters, including one
                special character, one number, one uppercase letter, and one lowercase letter.
              </p>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4">
              <Label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-primary"
              >
                Confirm Your Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  name="confirm-password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-primary" />
                  ) : (
                    <Eye className="w-5 h-5 text-primary" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                className="w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary"
              >
                Next
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPasswordPage;
