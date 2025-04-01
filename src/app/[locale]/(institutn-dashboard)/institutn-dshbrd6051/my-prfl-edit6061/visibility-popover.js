"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function VisibilitySheet() {
  const [settings, setSettings] = useState({
    showPhone: true,
    showEmail: true,
    showAddressLine1: true,
    showAddressLine2: true,
    showLandmark: true,
    showPincode: true,
  })

  const [isSheetOpen, setSheetOpen] = useState(false)

  const toggleSheet = () => {
    setSheetOpen(!isSheetOpen)
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <button
          className="mt-4 right-2 p-2 flex items-center gap-2 rounded bg-blue-100 dark:bg-blue-900 text-xs md:text-xl"
          onClick={toggleSheet}
        >
          <Eye className="h-4 w-4 text-primary dark:text-blue-400" />
          <span className="text-primary dark:text-blue-400">Manage Account Visibility</span>
        </button>
      </SheetTrigger>

      <SheetContent className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-800">
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-white">Visibility Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Visibility of your profile</h4>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Turn on to show this information on your profile
            </p>
          </div>

          <div className="space-y-4">
            <VisibilityToggle
              id="show-phone"
              label="Show Phone Number"
              checked={settings.showPhone}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showPhone: checked }))}
            />
            <VisibilityToggle
              id="show-email"
              label="Show Email"
              checked={settings.showEmail}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showEmail: checked }))}
            />
            <VisibilityToggle
              id="show-address1"
              label="Show Address Line 1"
              checked={settings.showAddressLine1}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showAddressLine1: checked }))}
            />
            <VisibilityToggle
              id="show-address2"
              label="Show Address Line 2"
              checked={settings.showAddressLine2}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showAddressLine2: checked }))}
            />
            <VisibilityToggle
              id="show-landmark"
              label="Show Landmark"
              checked={settings.showLandmark}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showLandmark: checked }))}
            />
            <VisibilityToggle
              id="show-pincode"
              label="Show Pin code"
              checked={settings.showPincode}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showPincode: checked }))}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function VisibilityToggle({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="text-sm text-gray-900 dark:text-white">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

