"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Globe, ChevronLeft, ChevronRight, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

export default function EcoLinkProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/ecolink/v1/profile/${id}`, {
          cache: "no-store", // Important for dynamic data
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch profile")
        }

        const { data } = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err.message)
        console.error("Profile fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  const handleDownloadQR = () => {
    if (!profile?.ECL_EL_Profile_Url) return

    const svg = document.getElementById("qr-code")
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `ecolink-${id}-qr.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  if (error) return <ProfileError error={error} router={router} />
  if (loading) return <ProfileLoading />

  // Get education data from profile if available
  const education = profile?.ECL_EL_Education
    ? [
        {
          degree: profile.ECL_EL_Education_Degree || "Degree",
          institution: profile.ECL_EL_Education_Institution || "Institution",
        },
      ]
    : [
        {
          degree: "BA, Visual Communication",
          institution: "IIT Delhi",
        },
      ]

  // Get social links from profile if available
  const socialLinks = [
    { name: "Facebook", url: profile?.ECL_EL_Facebook || "#", icon: <Facebook size={16} /> },
    { name: "Instagram", url: profile?.ECL_EL_Instagram || "#", icon: <Instagram size={16} /> },
    { name: "Custom", url: "#", icon: "HCJ" },
    { name: "Twitter", url: profile?.ECL_EL_Twitter || "#", icon: <Twitter size={16} /> },
    { name: "LinkedIn", url: profile?.ECL_EL_LinkedIn || "#", icon: <Linkedin size={16} /> },
  ]

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen md:mb-10 md:mt-10 ">
      {/* Header */}
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold">{profile?.ECL_EL_EcoLink_Name || "EcoLink Profile"}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {profile?.ID_Profile_Followers || "500"} Followers · {profile?.ID_Profile_Connections || "500+"} Connections
        </p>
      </div>

      {/* QR Code */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-lg p-4 flex justify-center">
          <div className="relative">
            {profile?.ECL_EL_Profile_Url ? (
              <QRCode
                id="qr-code"
                value={profile.ECL_EL_Profile_Url}
                size={200}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded">
                <p className="text-gray-500">QR Code not available</p>
              </div>
            )}
            {/* Logo overlay in center of QR code */}
            {profile?.ID_Profile_Picture && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-1">
                  <Image
                    src={profile.ID_Profile_Picture || "/placeholder.svg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Education Slider */}
      {education.length > 0 && (
        <div className="px-4 py-2">
          <div className="bg-blue-100 rounded-lg p-3 flex items-center">
            <button
              onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
              className="p-1 text-gray-600"
              disabled={activeSlide === 0}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex-1 text-center">
              <p className="text-sm font-medium">{education[activeSlide]?.degree}</p>
              <p className="text-xs text-gray-600">{education[activeSlide]?.institution}</p>
            </div>
            <button
              onClick={() => setActiveSlide(Math.min(education.length - 1, activeSlide + 1))}
              className="p-1 text-gray-600"
              disabled={activeSlide === education.length - 1}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Featured Content */}
      {profile?.ID_About && (
        <div className="px-4 py-2">
          <div className="bg-blue-100 rounded-lg overflow-hidden">
            <div className="p-2 bg-gray-200">
              <p className="text-xs font-medium">Featured</p>
            </div>
            <div className="p-3">
              <p className="text-sm mb-2">
                {profile.ID_About.substring(0, 100)}
                {profile.ID_About.length > 100 ? "..." : ""}
              </p>
              {profile.ECL_EL_Featured_Image && (
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src={profile.ECL_EL_Featured_Image || "/placeholder.svg"}
                    alt="Featured content"
                    width={400}
                    height={200}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="px-4 py-2 space-y-2">
        {profile?.ECL_EL_Phone && (
          <div className="bg-white rounded-lg p-3 flex items-center">
            <Phone size={18} className="text-blue-500 mr-3" />
            <p className="text-sm">{profile.ECL_EL_Phone}</p>
          </div>
        )}

        {profile?.ID_Email && profile?.ECL_EL_Email_ViewPermission && (
          <div className="bg-white rounded-lg p-3 flex items-center">
            <Mail size={18} className="text-blue-500 mr-3" />
            <a href={`mailto:${profile.ID_Email}`} className="text-sm text-blue-600">
              {profile.ID_Email}
            </a>
          </div>
        )}

        {profile?.ECL_EL_Website && (
          <div className="bg-white rounded-lg p-3 flex items-center">
            <Globe size={18} className="text-blue-500 mr-3" />
            <a
              href={profile.ECL_EL_Website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600"
            >
              {profile.ECL_EL_Website_Display || profile.ECL_EL_Website}
            </a>
          </div>
        )}
      </div>

      {/* Social Media Links */}
      <div className="px-4 py-4">
        <div className="flex justify-center space-x-6">
          {socialLinks.map((social, index) => (
            <Link
              key={index}
              href={social.url}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md"
            >
              {typeof social.icon === "string" ? social.icon : social.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProfileLoading() {
  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-48 bg-gray-200 rounded mx-auto"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

function ProfileError({ error, router }) {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-3">Error</h1>
        <p className="mb-5 text-red-700">{error}</p>
        <div className="space-x-3">
          <Button onClick={() => router.refresh()} variant="outline">
            Try Again
          </Button>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    </div>
  )
}

