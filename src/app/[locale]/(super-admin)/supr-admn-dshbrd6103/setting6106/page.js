"use client"

import { useState } from "react"
import Image from "next/image"
import { Bell, ChevronRight, Mail, Pencil, Trash, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  // State for user profile
  const [profilePicture, setProfilePicture] = useState("/placeholder.svg?height=100&width=100")
  const [profileName, setProfileName] = useState("Rama Chandra")
  const [email, setEmail] = useState("Ramchandra@gmail.com")

  // State for editing modes
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [tempName, setTempName] = useState(profileName)
  const [tempEmail, setTempEmail] = useState(email)

  // State for notification settings
  const [pushNotification, setPushNotification] = useState(true)
  const [emailNotification, setEmailNotification] = useState(true)

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfilePicture(e.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle profile picture delete
  const handleProfilePictureDelete = () => {
    setProfilePicture("/placeholder.svg?height=100&width=100")
  }

  // Handle name edit
  const saveProfileName = () => {
    setProfileName(tempName)
    setIsEditingName(false)
  }

  // Handle email edit
  const saveEmail = () => {
    setEmail(tempEmail)
    setIsEditingEmail(false)
  }

  // Handle save changes
  const handleSaveChanges = () => {
    // Here you would typically send the data to your backend
    console.log("Saving changes:", {
      profileName,
      email,
      pushNotification,
      emailNotification,
    })

    // Show a success message or notification
    alert("Changes saved successfully!")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      {/* Account Settings Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Profile picture</p>
            <div className="relative w-20 h-20">
              {profilePicture === "/placeholder.svg?height=100&width=100" ? (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border">
                  <User className="h-10 w-10 text-blue-500" />
                </div>
              ) : (
                <Image
                  src={profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full object-cover border"
                />
              )}
              <div className="absolute -bottom-1 -right-1 flex space-x-1">
                <label
                  htmlFor="profile-upload"
                  className="cursor-pointer bg-white p-1 rounded-full border shadow-sm text-blue-500 hover:text-blue-600"
                >
                  <Pencil size={16} />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </label>
                <button
                  onClick={handleProfilePictureDelete}
                  className="bg-white p-1 rounded-full border shadow-sm text-red-500 hover:text-red-600"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Name */}
          <div>
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <User className="text-blue-500 h-5 w-5" />
                <div className="flex-1">
                  <Input value={tempName} onChange={(e) => setTempName(e.target.value)} className="border-blue-500" />
                </div>
                <button onClick={saveProfileName} className="text-blue-500 hover:text-blue-600">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setIsEditingName(false)} className="text-red-500 hover:text-red-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="text-blue-500 h-5 w-5" />
                  <div>
                    <p className="font-medium">Profile Name</p>
                    <p className="text-sm text-muted-foreground">Change your profile name</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTempName(profileName)
                    setIsEditingName(true)
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Update Email */}
          <div>
            {isEditingEmail ? (
              <div className="flex items-center space-x-2">
                <Mail className="text-blue-500 h-5 w-5" />
                <div className="flex-1">
                  <Input
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="border-blue-500"
                    type="email"
                  />
                </div>
                <button onClick={saveEmail} className="text-blue-500 hover:text-blue-600">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setIsEditingEmail(false)} className="text-red-500 hover:text-red-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="text-blue-500 h-5 w-5" />
                  <div>
                    <p className="font-medium">Update Email</p>
                    <p className="text-sm text-muted-foreground">Change your email address</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTempEmail(email)
                    setIsEditingEmail(true)
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Push Notification */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="text-blue-500 h-5 w-5" />
              <div>
                <p className="font-medium">Push Notification</p>
                <p className="text-sm text-muted-foreground">Turn ON or OFF push notification</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-500">{pushNotification ? "Enable" : "Disable"}</span>
              <Switch
                checked={pushNotification}
                onCheckedChange={setPushNotification}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>

          {/* Email Notification */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="text-blue-500 h-5 w-5" />
              <div>
                <p className="font-medium">Email Notification</p>
                <p className="text-sm text-muted-foreground">Turn ON or OFF Email notification</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-500">{emailNotification ? "Enable" : "Disable"}</span>
              <Switch
                checked={emailNotification}
                onCheckedChange={setEmailNotification}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} className="bg-blue-500 hover:bg-blue-600">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

