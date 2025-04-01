"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import {
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function BusinessCard({
  name,
  title,
  company,
  education,
  contact,
  socialLinks,
  profileImage,
  qrValue,
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const slides = [
    { title: "Education", content: `${education.degree}` },
    { title: "Institution", content: `${education.institution}` },
    { title: title, content: company || "" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `${name}'s Digital Business Card`,
          url: qrValue,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  return (
    <div className="perspective-1000 w-full max-w-sm mx-auto">
      <div
        className={cn(
          "relative transition-transform duration-700 transform-style-3d w-full",
          isFlipped ? "rotate-y-180" : "",
        )}
      >
        {/* Front of card */}
        <Card className="w-full bg-white shadow-xl rounded-xl overflow-hidden backface-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">{name}</h2>
                {title && company && (
                  <Badge variant="outline" className="bg-blue-700/30 text-white border-blue-300 mt-1">
                    {title} • {company}
                  </Badge>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                View QR
              </Button>
            </div>

            <div className="relative p-4 flex flex-col items-center">
              {/* Profile Image */}
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                <Image src={profileImage || "/placeholder.svg"} alt={name} fill className="object-cover" />
              </div>

              {/* Slider */}
              <div className="w-full bg-gray-50 rounded-lg p-3 mb-6 relative">
                <div className="flex justify-between items-center">
                  <button
                    onClick={prevSlide}
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
                  >
                    <ChevronLeft className="h-4 w-4 text-blue-500" />
                  </button>

                  <div className="w-full text-center px-6">
                    <p className="text-xs text-gray-500">{slides[currentSlide].title}</p>
                    <p className="font-medium text-gray-800">{slides[currentSlide].content}</p>
                  </div>

                  <button
                    onClick={nextSlide}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
                  >
                    <ChevronRight className="h-4 w-4 text-blue-500" />
                  </button>
                </div>

                <div className="flex justify-center mt-2 gap-1">
                  {slides.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full ${
                        currentSlide === index ? "w-4 bg-blue-500" : "w-2 bg-gray-300"
                      } transition-all duration-300`}
                    />
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="w-full space-y-2">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">{contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">{contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">{contact.website}</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex justify-center gap-4 mt-6 w-full border-t pt-4">
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5 text-pink-600 hover:text-pink-800 transition-colors" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5 text-blue-400 hover:text-blue-600 transition-colors" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5 text-blue-700 hover:text-blue-900 transition-colors" />
                  </a>
                )}
                {socialLinks.hcj && (
                  <a
                    href={socialLinks.hcj}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors"
                  >
                    HCJ
                  </a>
                )}
              </div>

              <Button variant="outline" size="sm" className="mt-4 text-blue-600" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back of card (QR Code) */}
        <Card className="absolute inset-0 w-full bg-white shadow-xl rounded-xl overflow-hidden backface-hidden rotate-y-180">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-bold text-center mb-4">{name}</h3>

            <div className="bg-white p-3 rounded-lg shadow-md mb-6">
              <div className="relative">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  bgColor={"#FFFFFF"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={false}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-full p-1">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                      ECO
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-center mb-6">Scan this QR code to save my contact information</p>

            <Button variant="outline" size="sm" onClick={() => setIsFlipped(!isFlipped)}>
              Back to Card
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

