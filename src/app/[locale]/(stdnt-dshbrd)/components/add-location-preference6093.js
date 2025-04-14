"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function LocationPreferencePopup({ open, onClose, onSave, initialLocations = [] }) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);

  //  Update selectedLocations when popup opens
  useEffect(() => {
    if (open) {
      setSelectedLocations(initialLocations);
    }
  }, [open, initialLocations]);

  const staticSuggestions = [
    "Bengaluru", "Hyderabad", "Delhi", "Mumbai", "Noida",
    "Chennai", "Pune", "Jaipur", "Ahmedabad",
  ];

  const toggleLocation = (loc) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const handleFinalSave = () => {
    if (selectedLocations.length === 0) {
      toast({ title: "Select at least one location" });
      return;
    }
    onSave(selectedLocations);
    toast({
      title: "Saved",
      description: `Location preference updated`,
    });
    setSearchTerm("");
    setSelectedLocations([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Location Preference</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 mt-4 max-h-40 overflow-y-auto">
          {staticSuggestions
            .filter((loc) =>
              loc.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((loc) => (
              <Badge
                key={loc}
                className={`cursor-pointer px-3 py-1 ${
                  selectedLocations.includes(loc)
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={() => toggleLocation(loc)}
              >
                {loc}
              </Badge>
            ))}
        </div>

        {selectedLocations.length > 0 && (
          <div className="text-sm mt-2 text-muted-foreground">
            Selected: {selectedLocations.join(", ")}
          </div>
        )}

        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleFinalSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
