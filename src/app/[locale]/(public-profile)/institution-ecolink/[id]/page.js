"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Globe, Facebook, Instagram, Linkedin, Twitter, Download, RotateCcw, MapPin, Shield, Share2, CheckCircle, Loader2, Building2, Calendar, Users, Briefcase, Award } from 'lucide-react'
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { useRouter } from "@/i18n/routing"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function InstitutionEcoLinkPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const router = useRouter()
  const [institution, setInstitution] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("vertical")
  const profileCardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [followed, setFollowed] = useState(false)

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/ecolink/v1/institution-ecolink/${id}`, {
          cache: "no-store",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch institution")
        }

        const { data } = await response.json()
        setInstitution(data)
        console.log("Institution data:", data)
      } catch (err) {
        setError(err.message)
        console.error("Institution fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInstitution()
  }, [id])

  const handleDownloadCard = async () => {
    if (!profileCardRef.current) return

    try {
      setDownloading(true)

      const element = profileCardRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")

      // Create PDF with proper orientation
      const pdf = new jsPDF({
        orientation: viewMode === "horizontal" ? "landscape" : "portrait",
        unit: "mm",
      })

      // Calculate dimensions to fit the image properly
      const imgWidth = pdf.internal.pageSize.getWidth() - 20 // margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)
      pdf.save(`institution-ecolink-${id}-card.pdf`)

      toast({
        title: "Success!",
        description: "Institution EcoLink card has been downloaded.",
      })
    } catch (err) {
      console.error("Error generating PDF:", err)
      toast({
        title: "Download failed",
        description: "There was an error downloading the card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleShareCard = async () => {
    if (!profileCardRef.current || !institution) return

    try {
      setSharing(true)

      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: `${institution.ecoLinkData.name}'s EcoLink Card`,
          text: `Check out ${institution.ecoLinkData.name}'s Institution EcoLink Card!`,
          url: window.location.href,
        })

        toast({
          title: "Shared successfully!",
          description: "Institution EcoLink card has been shared.",
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href)

        toast({
          title: "Link copied!",
          description: "Institution link copied to clipboard. You can now share it manually.",
        })
      }
    } catch (err) {
      console.error("Error sharing:", err)
      toast({
        title: "Sharing failed",
        description: "There was an error sharing the card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSharing(false)
    }
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "vertical" ? "horizontal" : "vertical")
  }

  const handleFollow = () => {
    setFollowed(!followed)
    toast({
      title: followed ? "Unfollowed" : "Followed!",
      description: followed 
        ? "You have unfollowed this institution" 
        : "You are now following this institution",
    })
  }

  if (error) return <InstitutionError error={error} router={router} />
  if (loading) return <InstitutionLoading viewMode={viewMode} />

  // Get social links from institution
  const socialLinks = [
    { name: "LinkedIn", url: institution?.socialLinks?.linkedin || "#", icon: <Linkedin size={16} /> },
    { name: "Instagram", url: institution?.socialLinks?.instagram || "#", icon: <Instagram size={16} /> },
    { name: "Facebook", url: institution?.socialLinks?.facebook || "#", icon: <Facebook size={16} /> },
    { name: "Twitter", url: institution?.socialLinks?.twitter || "#", icon: <Twitter size={16} /> },
    { name: "Website", url: institution?.socialLinks?.website || "#", icon: <Globe size={16} /> },
  ].filter((link) => link.url && link.url !== "#")

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-gray-50 to-white min-h-screen p-4 md:p-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-between mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleViewMode} 
          className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
        >
          <RotateCcw size={16} className="text-blue-600" />
          <span className="hidden sm:inline">{viewMode === "vertical" ? "Switch to Horizontal" : "Switch to Vertical"}</span>
          <span className="sm:hidden">{viewMode === "vertical" ? "Horizontal" : "Vertical"}</span>
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareCard}
            disabled={sharing}
            className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
          >
            {sharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} className="text-blue-600" />}
            <span className="hidden sm:inline">{sharing ? "Sharing..." : "Share Card"}</span>
            <span className="sm:hidden">Share</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadCard}
            disabled={downloading}
            className="flex items-center gap-2"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span className="hidden sm:inline">{downloading ? "Generating..." : "Download Card"}</span>
            <span className="sm:hidden">Download</span>
          </Button>
        </div>
      </div>

      {/* Institution Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          ref={profileCardRef}
          className={cn(
            "bg-white rounded-lg shadow-lg overflow-hidden mx-auto border border-gray-200",
            viewMode === "vertical" ? "max-w-[360px]" : "max-w-[700px]",
            viewMode === "horizontal" ? "md:flex" : "block"
          )}
        >
          {viewMode === "vertical" ? (
            <VerticalCard institution={institution} socialLinks={socialLinks} followed={followed} onFollow={handleFollow} />
          ) : (
            <HorizontalCard institution={institution} socialLinks={socialLinks} followed={followed} onFollow={handleFollow} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Mobile View Instructions */}
      <div className="mt-6 text-center text-sm text-gray-500 md:hidden">
        <p>Rotate your device for better view of horizontal card</p>
      </div>
    </div>
  )
}

function VerticalCard({ institution, socialLinks, followed, onFollow }) {
  return (
    <div className="flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Building2 size={18} className="text-blue-600 mr-2" />
          <h1 className="text-lg font-bold text-gray-800 line-clamp-1">Institution</h1>
        </div>
        <Button 
          variant={followed ? "outline" : "default"}
          size="sm" 
          onClick={onFollow}
          className={cn(
            "transition-all flex items-center gap-1.5",
            followed 
              ? "border-green-500 text-green-600 hover:bg-green-50" 
              : " text-white"
          )}
        >
          {followed ? <CheckCircle size={14} /> : null}
          {followed ? "Following" : "Follow"}
        </Button>
      </div>

     

      {/* QR Code */}
      <div className="relative w-[180px] h-[180px] mb-6 shadow-md rounded-lg overflow-hidden">
        {institution?.ecoLinkData?.qrCode ? (
          <Image
            src={institution.ecoLinkData.qrCode || "/placeholder.svg"}
            alt="QR Code"
            fill
            className="object-contain bg-white p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">QR Code not available</p>
          </div>
        )}
      </div>

      {/* Institution Name */}
      <h2 className="text-xl font-bold text-center mb-2 text-gray-800 px-2">
        {institution?.ecoLinkData?.name || "Institution Name"}
      </h2>

      {/* Location */}
      {(institution?.ecoLinkData?.city || institution?.ecoLinkData?.state) && (
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin size={14} className="mr-1" />
          <span>
            {institution.ecoLinkData.city}
            {institution.ecoLinkData.state ? `, ${institution.ecoLinkData.state}` : ''}
          </span>
        </div>
      )}

       {/* Institution Logo */}
       <div className="relative w-[130px] h-[130px] mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <Image
            src={institution?.ecoLinkData?.profilePicture || "/placeholder.svg?height=130&width=130"}
            alt="Institution Logo"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
          <Shield className="text-blue-600" size={22} />
        </div>
      </div>

      {/* Institution Details */}
      <div className="w-full space-y-3 mb-6">
        {institution?.establishmentYear && (
          <div className="flex items-center text-sm group">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <Calendar size={16} className="text-blue-600" />
            </div>
            <span className="text-gray-700">Est. {institution.establishmentYear}</span>
          </div>
        )}

        {institution?.companySize && (
          <div className="flex items-center text-sm group">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <Users size={16} className="text-blue-600" />
            </div>
            <span className="text-gray-700">{institution.companySize} employees</span>
          </div>
        )}

        {institution?.specialization && (
          <div className="flex items-center text-sm group">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <Briefcase size={16} className="text-blue-600" />
            </div>
            <span className="text-gray-700">{institution.specialization}</span>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="w-full space-y-3 mb-6">
        {institution?.ecoLinkData?.phone && (
          <div className="flex items-center text-sm group">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <Phone size={16} className="text-blue-600" />
            </div>
            <a 
              href={`tel:${institution.ecoLinkData.phone}`}
              className="text-gray-700 group-hover:text-blue-600 transition-colors"
            >
              {institution.ecoLinkData.phone}
            </a>
          </div>
        )}

        {institution?.ecoLinkData?.email && (
          <div className="flex items-center text-sm group">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <Mail size={16} className="text-blue-600" />
            </div>
            <a 
              href={`mailto:${institution.ecoLinkData.email}`}
              className="text-gray-700 group-hover:text-blue-600 transition-colors truncate"
            >
              {institution.ecoLinkData.email}
            </a>
          </div>
        )}

        {institution?.ecoLinkData?.website && (
          <div className="flex items-center text-sm group">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <Globe size={16} className="text-blue-600" />
            </div>
            <a 
              href={institution.ecoLinkData.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 group-hover:text-blue-600 transition-colors truncate"
            >
              {institution.ecoLinkData.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="flex justify-center space-x-3 mt-2">
          {socialLinks.map((social, index) => (
            <Link
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all transform hover:scale-110"
            >
              {social.icon}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function HorizontalCard({ institution, socialLinks, followed, onFollow }) {
  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Left Section - Institution Info */}
      <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-blue-200">
        {/* Institution Logo */}
        <div className="relative w-[120px] h-[120px] mb-4">
          <div className="absolute inset-0 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={institution?.ecoLinkData?.profilePicture || "/placeholder.svg?height=120&width=120"}
              alt="Institution Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
            <Shield className="text-blue-600" size={22} />
          </div>
        </div>

        {/* Institution Name */}
        <h1 className="text-lg font-bold text-center mb-1 text-gray-800 px-2">
          {institution?.ecoLinkData?.name || "Institution Name"}
        </h1>

        {/* Location */}
        {(institution?.ecoLinkData?.city || institution?.ecoLinkData?.state) && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin size={14} className="mr-1" />
            <span>
              {institution.ecoLinkData.city}
              {institution.ecoLinkData.state ? `, ${institution.ecoLinkData.state}` : ''}
            </span>
          </div>
        )}

        {/* Follow Button */}
        <Button 
          variant={followed ? "outline" : "default"}
          size="sm" 
          onClick={onFollow}
          className={cn(
            "transition-all w-full mb-4 flex items-center justify-center gap-1.5",
            followed 
              ? "border-green-500 text-green-600 hover:bg-green-50" 
              : " text-white"
          )}
        >
          {followed ? <CheckCircle size={14} /> : null}
          {followed ? "Following" : "Follow"}
        </Button>

        {/* Institution Details */}
        <div className="w-full space-y-2 mb-4">
          {institution?.establishmentYear && (
            <div className="flex items-center text-sm">
              <Calendar size={14} className="text-blue-600 mr-2" />
              <span className="text-gray-700">Est. {institution.establishmentYear}</span>
            </div>
          )}

          {institution?.companySize && (
            <div className="flex items-center text-sm">
              <Users size={14} className="text-blue-600 mr-2" />
              <span className="text-gray-700">{institution.companySize} employees</span>
            </div>
          )}

          {institution?.specialization && (
            <div className="flex items-center text-sm">
              <Award size={14} className="text-blue-600 mr-2" />
              <span className="text-gray-700 line-clamp-2">{institution.specialization}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 mt-auto">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all transform hover:scale-110 shadow-sm"
                title={social.name}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Right Section - QR and Contact */}
      <div className="w-full md:w-2/3 p-6 flex flex-col">
        <div className="flex flex-col md:flex-row h-full">
          {/* QR Code Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center pb-6 md:pb-0 md:pr-6 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="relative w-[180px] h-[180px] mb-3 shadow-md rounded-lg overflow-hidden">
              {institution?.ecoLinkData?.qrCode ? (
                <Image
                  src={institution.ecoLinkData.qrCode || "/placeholder.svg"}
                  alt="QR Code"
                  fill
                  className="object-contain bg-white p-2"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">QR Code not available</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">Scan to connect</p>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center pt-6 md:pt-0 md:pl-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Contact Information
            </h3>

            <div className="space-y-4">
              {institution?.ecoLinkData?.phone && (
                <div className="flex items-center text-sm group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <Phone size={16} className="text-blue-600" />
                  </div>
                  <a 
                    href={`tel:${institution.ecoLinkData.phone}`} 
                    className="text-gray-700 group-hover:text-blue-600 transition-colors"
                  >
                    {institution.ecoLinkData.phone}
                  </a>
                </div>
              )}

              {institution?.ecoLinkData?.email && (
                <div className="flex items-center text-sm group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <a 
                    href={`mailto:${institution.ecoLinkData.email}`} 
                    className="text-gray-700 group-hover:text-blue-600 transition-colors truncate"
                  >
                    {institution.ecoLinkData.email}
                  </a>
                </div>
              )}

              {institution?.ecoLinkData?.website && (
                <div className="flex items-center text-sm group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <Globe size={16} className="text-blue-600" />
                  </div>
                  <a 
                    href={institution.ecoLinkData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 group-hover:text-blue-600 transition-colors truncate"
                  >
                    {institution.ecoLinkData.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}

              {/* Additional Institution Info */}
              {institution?.specialization && (
                <div className="flex items-start text-sm group mt-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 mt-0.5">
                    <Briefcase size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Specialization</p>
                    <p className="text-gray-600">{institution.specialization}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InstitutionLoading({ viewMode = "vertical" }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between mb-6">
        <div className="h-9 bg-gray-200 rounded w-40 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-9 bg-gray-200 rounded w-28 animate-pulse"></div>
          <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      <div
        className={`mx-auto animate-pulse bg-white rounded-lg shadow-md overflow-hidden
        ${viewMode === "vertical" ? "max-w-[360px]" : "max-w-[700px]"}
        ${viewMode === "horizontal" ? "md:flex" : "block"}`}
      >
        {viewMode === "vertical" ? (
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="h-7 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>

            {/* Institution Logo */}
            <div className="h-[120px] bg-gray-200 rounded-full mx-auto w-[120px]"></div>

            {/* Institution Name */}
            <div className="h-6 bg-gray-200 rounded w-40 mx-auto"></div>

            {/* Location */}
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>

            {/* QR Code */}
            <div className="h-[180px] bg-gray-200 rounded mx-auto w-[180px]"></div>

            {/* Institution Details */}
            <div className="space-y-3 w-full">
              <div className="h-5 bg-gray-200 rounded w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 w-full">
              <div className="h-5 bg-gray-200 rounded w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row w-full">
            {/* Left Section */}
            <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-200 space-y-4">
              <div className="h-[120px] bg-gray-200 rounded-full mx-auto w-[120px]"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="space-y-2 w-full">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-7 h-7 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-2/3 p-6 flex flex-col md:flex-row">
              {/* QR Code */}
              <div className="w-full md:w-1/2 pb-6 md:pb-0 md:pr-6 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col items-center">
                <div className="h-[180px] bg-gray-200 rounded w-[180px] mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>

              {/* Contact Info */}
              <div className="w-full md:w-1/2 pt-6 md:pt-0 md:pl-6 space-y-4">
                <div className="h-5 bg-gray-200 rounded w-40"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InstitutionError({ error, router }) {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-3">Error</h1>
        <p className="mb-5 text-red-700">{error}</p>
        <div className="space-x-3">
          <Button onClick={() => router.refresh()} variant="outline" className="hover:bg-red-50">
            Try Again
          </Button>
          <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  )
}
