"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export function InstitutionVisibilitySheet() {
  const [settings, setSettings] = useState({
    showPhone: false,
    showEmail: false,
    showWebsite: false,
    showAddressLine1: false,
    showAddressLine2: false,
    showLandmark: false,
    showPincode: false,
  });

  const [loading, setLoading] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { data: session } = useSession();

  const fieldMap = {
    showPhone: "CIV_Phone_Number",
    showEmail: "CIV_Email",
    showWebsite: "CIV_Website_URL",
    showAddressLine1: "CIV_Address_Line1",
    showAddressLine2: "CIV_Address_Line2",
    showLandmark: "CIV_Landmark",
    showPincode: "CIV_Pincode",
  };

  // Load settings
  useEffect(() => {
    if (!isSheetOpen || !session?.user?.companyId) return;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/institution/v1/hcjBrTo60626fetchInstitutionVisibilitySettings/${session.user.companyId}`
        );
        const json = await res.json();
        if (res.ok && json.success) {
          const updated = {};
          const data = json.data || {};
          for (const key in fieldMap) {
            updated[key] = Boolean(data[fieldMap[key]]);
          }
          setSettings(updated);
        } else {
          toast({
            title: "Error",
            description: json.message || "Failed to fetch settings",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("GET failed", err);
        toast({
          title: "Error",
          description: "Failed to fetch visibility settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [isSheetOpen, session]);

  // Update individual toggle
  const handleToggle = async (fieldKey, value) => {
    setSettings((prev) => ({ ...prev, [fieldKey]: value }));

    try {
      const res = await fetch(
        `/api/institution/v1/hcjBrTo60625updateInstituionVisibilitySettings/${session.user.companyId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [fieldKey]: value }),
        }
      );
      const json = await res.json();
      if (res.ok && json.success) {
        toast({ title: "Success", description: "Visibility updated" });
      } else {
        toast({
          title: "Error",
          description: json.message || "Update failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("PATCH failed", err);
      toast({
        title: "Error",
        description: "Network error",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <button
          onClick={() => setSheetOpen(!isSheetOpen)}
          className="mt-4 right-2 p-2 flex items-center gap-2 rounded bg-blue-100 dark:bg-blue-900 text-xs md:text-xl"
        >
          <Eye className="h-4 w-4 text-primary dark:text-blue-400" />
          <span className="text-primary dark:text-blue-400">
            Manage Institution Visibility
          </span>
        </button>
      </SheetTrigger>

      <SheetContent className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-800">
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-white">
            Institution Visibility Settings
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <p className="text-center mt-8 text-muted-foreground">Loading...</p>
        ) : (
          <div className="mt-6 space-y-4">
            {Object.keys(fieldMap).map((fieldKey) => (
              <VisibilityToggle
                key={fieldKey}
                id={fieldKey}
                label={toLabel(fieldKey)}
                checked={settings[fieldKey]}
                onCheckedChange={(val) => handleToggle(fieldKey, val)}
              />
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function VisibilityToggle({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="text-sm text-gray-900 dark:text-white">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function toLabel(fieldKey) {
  return fieldKey
    .replace(/^show/, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
