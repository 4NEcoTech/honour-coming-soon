"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useParams } from "next/navigation"
import { Link } from "@/i18n/routing"

export default function PrivacyPolicyPage() {
  const [accepted, setAccepted] = useState(false)
  const {locale} = useParams()
  // const router = useRouter()

  // const handleAccept = () => {
  //   if (accepted) {
  //     router.push("/video-kyc")
  //   }
  // }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold dark:text-white">Start video KYC</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Before starting the Video KYC process, please read the Privacy Policy and Terms and Conditions below, and
            agree to proceed further.
          </p>
        </div>

        <div className="space-y-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <section>
            <h2 className="text-xl font-semibold dark:text-white">Privacy policy explanation</h2>
            <p className="text-muted-foreground dark:text-gray-400 mt-2">
              We value your privacy and are committed to protecting your personal information. As part of the Video KYC
              process, we will collect and process the following data
            </p>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="font-medium dark:text-white">1. Personal Information</h3>
              <ul className="list-disc pl-5 text-muted-foreground dark:text-gray-400">
                <li>Name, contact details, and date of birth</li>
                <li>ID proof documents (e.g., Passport, Driver&apos;s License, or National ID)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium dark:text-white">2. Biometric Data</h3>
              <ul className="list-disc pl-5 text-muted-foreground dark:text-gray-400">
                <li>Live video feed for identity verification</li>
                <li>Photographs captured during the video session</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium dark:text-white">3. Device Information</h3>
              <ul className="list-disc pl-5 text-muted-foreground dark:text-gray-400">
                <li>IP address, device type, and browser details for security and compliance</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold dark:text-white">How We Use Your Data</h2>

            <div>
              <h3 className="font-medium dark:text-white">1. Identity Verification</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                • To confirm your identity and validate the authenticity of your documents
              </p>
            </div>

            <div>
              <h3 className="font-medium dark:text-white">2. Compliance</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                • To adhere to regulatory requirements and prevent fraudulent activities
              </p>
            </div>

            <div>
              <h3 className="font-medium dark:text-white">3. Service Enhancement</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                • To improve the efficiency and security of our services
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold dark:text-white">Data Security</h2>
            <ul className="list-disc pl-5 text-muted-foreground dark:text-gray-400">
              <li>
                All collected data is securely encrypted and stored in compliance with applicable laws and regulations
              </li>
              <li>
                Our information will not be shared with third parties except as required by law or for regulatory
                purposes
              </li>
            </ul>
          </section>

          <div className="flex items-start space-x-2 pt-4">
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked)}
              className="dark:border-gray-600 dark:bg-white dark:text-primary"
            />
            <label
              htmlFor="terms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300"
            >
              By proceeding, you agree to the collection and use of your information as outlined above
            </label>
          </div>

      <Link href="/video-kyc" locale={locale}>
          <Button
            className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white mt-2"
            size="lg"
            disabled={!accepted}
            // onClick={handleAccept}
          >
            Click here to start your video KYC
          </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

