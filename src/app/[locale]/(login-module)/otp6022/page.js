"use client";

import { Button } from "@/components/ui/button"; // Assuming Button component exists
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming Card component exists
import { Input } from "@/components/ui/input"; // Assuming Input component exists
import { useState } from "react";
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";

function Page() {
  const [otp, setOtp] = useState(["", "", "", ""]); // 4 OTP input fields
  const [isVerified, setIsVerified] = useState(null); // null: neutral, true: success, false: error
  const [errorMessage, setErrorMessage] = useState("");

  const correctOtp = "1234"; // Dummy OTP for testing

  // Handle OTP input
  const handleChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Auto-focus to the next box
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.join("") === correctOtp) {
      setIsVerified(true);
      setErrorMessage("");
    } else {
      setIsVerified(false);
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  const handleResend = () => {
    console.log("Resend OTP"); // Replace this with your resend OTP API logic
  };

  return (
    <div className="min-h-screen bg-transparent sm:bg-transparent flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg p-8 rounded-lg border-none sm:border  shadow-none sm:shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>OTP Verification</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-center text-sm text-gray-500 mb-6">
            Enter the OTP sent to your registered email or phone number.
          </p>

          <form onSubmit={handleVerify}>
            {/* OTP Inputs */}
            <div className="flex justify-center space-x-4 mb-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  className={`w-12 h-12 text-center text-lg border rounded-md focus:ring-2 focus:outline-none ${
                    isVerified === null
                      ? "border-gray-300 focus:ring-blue-600"
                      : isVerified
                      ? "border-green-500 focus:ring-green-500"
                      : "border-red-500 focus:ring-red-500"
                  }`}
                  required
                />
              ))}
            </div>

            {/* Timer and Resend Code */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">Code Expire in : <span className="text-sm text-gray-500 font-semibold mb-1">20s</span></p>
              <p className="font-semibold text-gray-700">Didn’t receive the OTP?</p>
              <Button
                variant="link"
                className="text-primary hover:underline mt-1"
                onClick={handleResend}
              >
                Resend Code
              </Button>
            </div>

            {/* Success/Error Message */}
            {isVerified !== null && (
              <div className="mb-4 text-sm flex items-center justify-center">
                {isVerified ? (
                  <p className="text-green-600 flex items-center">
                    <IoMdCheckmarkCircleOutline className="mr-2 text-lg" />
                    OTP Verified Successfully!
                  </p>
                ) : (
                  <p className="text-red-600 flex items-center">
                    <IoMdCloseCircleOutline className="mr-2 text-lg" />
                    {errorMessage}
                  </p>
                )}
              </div>
            )}

            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full py-2 bg-primary text-white rounded-md"
            >
              Verify
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
