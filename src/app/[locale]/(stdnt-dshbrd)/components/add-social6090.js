"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal } from "@/components/ui/modal"
import { X } from "lucide-react"

const socialPlatforms = [
  {
    value: "01",
    label: "LinkedIn",
    icon: "/placeholder.svg?height=24&width=24",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    value: "02",
    label: "GitHub",
    icon: "/placeholder.svg?height=24&width=24",
    placeholder: "https://github.com/username",
  },
  { value: "03", label: "Website", icon: "/placeholder.svg?height=24&width=24", placeholder: "https://example.com" },
  {
    value: "04",
    label: "Instagram",
    icon: "/placeholder.svg?height=24&width=24",
    placeholder: "https://instagram.com/username",
  },
  {
    value: "05",
    label: "Facebook",
    icon: "/placeholder.svg?height=24&width=24",
    placeholder: "https://facebook.com/username",
  },
  {
    value: "06",
    label: "Twitter",
    icon: "/placeholder.svg?height=24&width=24",
    placeholder: "https://twitter.com/username",
  },
  {
    value: "07",
    label: "Medium",
    icon: "/placeholder.svg?height=24&width=24",
    placeholder: "https://medium.com/@username",
  },
  {
    value: "08",
    label: "Dribbble",
    icon: "/placeholder.svg?height=24&width=24",
    placeholder: "https://dribbble.com/username",
  },
  {
    value: "09",
    label: "Behance",
    icon: "/placeholder.svg?height=24&width=24",
    placeholder: "https://behance.net/username",
  },
]

export default function SocialPopup({ isOpen, onClose, onSubmit, initialData = [] }) {
  const [profiles, setProfiles] = useState(initialData)
  const [platform, setPlatform] = useState("")
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const handleAddProfile = () => {
    if (!platform || !url) {
      setError("Please select a platform and enter a URL")
      return
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL")
      return
    }

    const platformInfo = socialPlatforms.find((p) => p.value === platform)

    setProfiles([
      ...profiles,
      {
        platform,
        url,
        label: platformInfo?.label || "",
        icon: platformInfo?.icon || "",
      },
    ])
    setPlatform("")
    setUrl("")
    setError("")
  }

  const handleRemoveProfile = (index) => {
    const newProfiles = [...profiles]
    newProfiles.splice(index, 1)
    setProfiles(newProfiles)
  }

  const handleSubmit = () => {
    if (onSubmit) onSubmit(profiles)
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      animation="slide"
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Social Media Links</h2>
          <p className="text-sm text-muted-foreground">
            Add your social media profiles to connect with others and showcase your online presence.
          </p>
        </div>
      }
    >
      <div className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-primary">Social Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((item) => (
                    <SelectItem
                      value={item.value}
                      key={item.value}
                      disabled={profiles.some((profile) => profile.platform === item.value)}
                    >
                      <div className="flex items-center gap-3">
                        <img className="w-5 h-5 rounded" src={item.icon || "/placeholder.svg"} alt={item.label} />
                        <span>{item.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-primary">Profile URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  platform
                    ? socialPlatforms.find((p) => p.value === platform)?.placeholder
                    : "Paste your social profile URL"
                }
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="button" onClick={handleAddProfile} className="w-full">
            Add Profile
          </Button>

          {profiles.length > 0 && (
            <div className="space-y-3">
              <Label>Your Social Profiles</Label>
              <div className="space-y-2">
                {profiles.map((profile, index) => {
                  const platformInfo = socialPlatforms.find((p) => p.value === profile.platform)
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={profile.icon || platformInfo?.icon || ""}
                          alt={profile.label || platformInfo?.label || ""}
                          className="w-6 h-6 rounded"
                        />
                        <div className="overflow-hidden">
                          <p className="font-medium">{profile.label || platformInfo?.label || ""}</p>
                          <p className="text-sm text-muted-foreground truncate">{profile.url}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveProfile(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={profiles.length === 0}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

