import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { updateUser } from "@/app/utils/indexDB";

export default function TeamMemberRegistrationForm({ goToNextStep }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Token is missing in the URL");
      return;
    }

    try {
      const decoded = jwt.decode(token);
      console.log("🔍 Decoded Token:", decoded);

      if (decoded && typeof decoded !== "string") {
        if (
          decoded.CCP_Contact_Person_Email &&
          decoded.CCP_Contact_Person_Role
        ) {
          setEmail(decoded.CCP_Contact_Person_Email);

          //  Convert Role Number to Readable Label
          const roleMapping = {
            "07": "Team Member",
            "08": "Support Staff",
          };

          setRole(
            roleMapping[decoded.CCP_Contact_Person_Role] || "Unknown Role"
          );

          // Store data in IndexedDB
          updateUser(decoded)
            .then(() => {
              console.log(" Token data stored in IndexedDB");
              localStorage.setItem("temp_team_member_id", decoded?.id);
            })
            .catch((err) => {
              console.error(" Error storing data in IndexedDB:", err);
            });
        } else {
          setError("Email or role not found in token");
        }
      } else {
        setError("Invalid token format");
      }
    } catch (err) {
      console.error(" JWT Decoding Error:", err);
      setError("Failed to decode token");
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Map human-readable roles back to role IDs
    const roleMapping = {
      "Team Member": "07",
      "Support Staff": "08",
    };

    const roleId = roleMapping[role] || role; // Ensure we send the correct ID

    try {
      const response = await fetch("/api/auth/institution-staff/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: roleId }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("signupEmail", email);
        localStorage.setItem("signupRole", role);
        goToNextStep();
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md sm:border sm:border-border sm:shadow-sm border-0 shadow-none">
        <CardContent className="pt-6 px-6 mb-20">
          <div className="sm:text-center text-left space-y-2 mb-6 mt-10">
            <h1 className="text-2xl font-medium">Welcome to HCJ</h1>
            <p className="text-sm text-muted-foreground">
              You&apos;ve been invited to join HCJ. Please proceed to complete
              your profile.
            </p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="space-y-4">
            <div className="space-y-2 relative">
              <label
                htmlFor="email"
                className="text-sm text-primary font-medium"
              >
                Email
              </label>
              <div className="flex items-center">
                <Image
                  src="/image/employerdashboard/db/4.svg"
                  alt="Email Icon"
                  width={20}
                  height={20}
                  className="absolute left-3"
                />
                <Input
                  id="email"
                  type="email"
                  className="w-full pl-10"
                  value={email}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label
                htmlFor="role"
                className="text-sm text-primary font-medium"
              >
                Role
              </label>
              <div className="flex items-center">
                <Image
                  src="/image/institutndashboard/dashboard/myprofile.svg"
                  alt="Role Icon"
                  width={20}
                  height={20}
                  className="absolute left-3"
                />
                <Input
                  id="role"
                  type="text"
                  className="w-full pl-10"
                  value={role}
                  disabled
                />
              </div>
            </div>

            <Button
              className="w-full bg-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Next"}
            </Button>
            {/* Footer Text */}
            <CardFooter className="flex flex-col items-start sm:items-start text-sm text-gray-400 text-start sm:text-left w-full text-pretty">
              {/* Login Link */}
              <span className="text-sm mb-0 text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login6035"
                  className="text-primary hover:underline ml-1"
                >
                  Click here to log in
                </Link>
              </span>

              {/* Terms Agreement */}
              <span className="text-start sm:text-left text-sm block">
                By creating an account or logging in, you agree with HCJ&apos;{" "}
                <Link
                  href="/prvcy-plcy6014"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                <span>and&nbsp;</span>
                <Link
                  href="/trmsnd-cndtn6015"
                  className="text-primary hover:underline"
                >
                  Terms & Conditions
                </Link>
              </span>
            </CardFooter>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
