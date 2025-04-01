"use client";

import { roleProfileSteps } from "@/app/utils/roleProfileSteps";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { Rocket, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";


export default function ProfileCompletionPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session, status } = useSession();
  const [profileRoutes, setProfileRoutes] = useState([]);
  const router = useRouter();
  const [incompleteSteps, setIncompleteSteps] = useState([]);

  // useEffect(() => {
  //   if (status === "loading") return; // Wait until session is loaded

  //   if (session?.user) {
  //     fetch(`/api/user-profile/fetch-profile`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.error) {
  //           console.error("Profile Fetch Error:", data.error);
  //           return;
  //         }

  //         const userRole = data.role;
  //         const requiredSteps = roleProfileSteps[userRole]?.steps || [];
  //         const routes = roleProfileSteps[userRole]?.routes || [];

  //         // Find which steps are still incomplete
  //         const missingSteps = requiredSteps.filter(
  //           (step) => !data.profileSteps[step]
  //         );

  //         if (missingSteps.length > 0) {
  //           setIncompleteSteps(missingSteps);
  //           setProfileRoutes(routes);
  //           setIsVisible(true);
  //         }
  //       })
  //       .catch((err) => console.error("Error fetching user profile:", err));
  //   }
  // }, [session, status]);

  const handleCompleteProfile = () => {
    if (profileRoutes.length > 0) {
      router.push(profileRoutes[0]); // Redirect to the first incomplete step
    }
  };

  if (!isVisible || incompleteSteps.length === 0) return null;

  return (
    <div className="dark bg-muted px-4 py-3 text-foreground fixed top-0 left-0 w-full z-50">
      <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 max-md:mt-0.5"
            aria-hidden="true"
          >
            <Rocket className="opacity-80" size={16} strokeWidth={2} />
          </div>

          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-blue-500">Finish Setting Up Your Account</p>
              <p className="text-sm text-muted-foreground">
                Complete the following steps to unlock your full experience.
              </p>
              <ul className="list-disc pl-5 mt-1 text-blue-500 text-xs">
                {incompleteSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 max-md:flex-wrap">
              <Button size="sm" className="text-sm" onClick={handleCompleteProfile}>
                Complete Now
              </Button>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <X
            size={16}
            strokeWidth={2}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
