"use client"

import { useState, useEffect } from "react"
import { MapPin, DollarSign, Clock, Calendar, Users, Briefcase, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"


export default function ProjectPostingPage() {
  const [mounted, setMounted] = useState(false)

  // Ensure hydration completes before rendering to avoid mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
              <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">UI Designer</h1>
              <p className="text-sm text-muted-foreground">Project Name</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
 
            <Button size="sm" variant="default">
              Edit
            </Button>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Remote</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>$500 - $1000</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Part-time</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Posted 3 days ago</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>1-10 employees</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>1 position</span>
          </div>
        </div>

        {/* Application Notice */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Only 15 applications from our website can allowed.</p>
        </div>

        {/* About the Project */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">About the Project</h2>
          <p className="text-sm leading-relaxed mb-3">
            We are currently hiring a passionate, user-centered UI Designer to join a collaborative and innovative team.
            You will be responsible for designing digital products that enhance user experience.
          </p>
        </div>

        {/* Key Responsibilities */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Key responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Creating user-centered designs by understanding business requirements and user feedback</li>
            <li>Creating user flows, wireframes, prototypes and mockups</li>
            <li>
              Identifying requirements for user guides, design systems, UI pattern libraries and interactive user
              interfaces
            </li>
            <li>Designing UI elements such as input controls, navigational components and informational components</li>
          </ul>
        </div>

        {/* Skills Required */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Skills Required</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">Figma</Badge>
            <Badge variant="secondary">Adobe XD</Badge>
          </div>
        </div>

        {/* Who can apply */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Who can apply</h2>
          <p className="text-sm mb-2">This is an equal employment opportunity.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Recently Graduated</li>
            <li>Mid-level Designer</li>
            <li>Design/Creative Background</li>
          </ul>
        </div>

        {/* Additional Preferences */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Additional Preference</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Ability to design software like Canva</li>
            <li>A keen eye for detail and passion for creating visually appealing graphics</li>
            <li>Good understanding of design principles and brand identity</li>
            <li>Strong communication and collaboration skills</li>
            <li>Ability to think creatively and develop innovative</li>
          </ul>
        </div>

        {/* Salary and perks */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Salary and perks</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Performance based</li>
            <li>Flexible Work Hours</li>
            <li>Health Insurance</li>
            <li>Paid time off</li>
            <li>Inclusive work environment (Equal opportunity will be provided)</li>
          </ul>
        </div>

        {/* Additional Details/Requirements */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Additional Details/Requirements</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Valid work visa</li>
            <li>Portfolio link</li>
            <li>Resume</li>
            <li>Cover letter</li>
            <li>Samples should be of while working</li>
            <li>Bring your own device</li>
          </ul>
        </div>

        {/* Application Deadline */}
        <div className="mb-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <p className="text-center font-medium">Application will close on 12/01/2023</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button className="flex-1" size="lg">
            Apply Now
          </Button>
          <Button className="flex-1" variant="outline" size="lg">
            Save Job
          </Button>
        </div>

        {/* Footer Banner */}
        <Card className="p-4 mb-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">Upgrade to a paid opportunity for just $5</h3>
              <p className="text-sm text-muted-foreground mb-2">Unlock these benefits for this Project:</p>
              <ul className="text-xs space-y-1 mb-3">
                <li className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  <span>Unlimited application per day</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  <span>Access to the hiring team for any questions/help</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  <span>Premium support and follow-ups</span>
                </li>
              </ul>
              <Button size="sm" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                Upgrade Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer Text */}
        <div className="text-xs text-center text-muted-foreground">
          <p>You will be the first candidate, and others might try to contact for this project.</p>
          <p>Your post will stay as a draft until it is published.</p>
        </div>
      </div>
    </div>
  )
}

