"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronDown, X } from "lucide-react"
import { format } from "date-fns"

export function UserFilters({ filters, setFilters }) {
  const [date, setDate] = useState(undefined)

  const handleClearFilters = () => {
    setFilters({
      userType: "",
      dateRegistered: "",
      verificationStatus: "",
    })
    setDate(undefined)
  }

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    if (selectedDate) {
      setFilters({
        ...filters,
        dateRegistered: format(selectedDate, "dd/MM/yyyy"),
      })
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* User Type Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center justify-between min-w-[150px]">
            <span>{filters.userType || "User Type"}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">User Type</h4>
            <RadioGroup value={filters.userType} onValueChange={(value) => setFilters({ ...filters, userType: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Students" id="students" />
                <Label htmlFor="students">Students</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Institution" id="institution" />
                <Label htmlFor="institution">Institution</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Administrator" id="administrator" />
                <Label htmlFor="administrator">Administrator</Label>
              </div>
            </RadioGroup>
          </div>
        </PopoverContent>
      </Popover>

      {/* Date Registered Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center justify-between min-w-[180px]">
            <span>{filters.dateRegistered || "Date Registered on"}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
        </PopoverContent>
      </Popover>

      {/* Verification Status Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center justify-between min-w-[180px]">
            <span>{filters.verificationStatus || "Verification Status"}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Verification Status</h4>
            <RadioGroup
              value={filters.verificationStatus}
              onValueChange={(value) => setFilters({ ...filters, verificationStatus: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Pending" id="pending" />
                <Label htmlFor="pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Verified" id="verified" />
                <Label htmlFor="verified">Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Not Verified" id="not-verified" />
                <Label htmlFor="not-verified">Not Verified</Label>
              </div>
            </RadioGroup>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters Button - Only show if any filter is active */}
      {(filters.userType || filters.dateRegistered || filters.verificationStatus) && (
        <Button variant="ghost" size="icon" onClick={handleClearFilters} className="h-9 w-9">
          <X className="h-4 w-4" />
          <span className="sr-only">Clear filters</span>
        </Button>
      )}
    </div>
  )
}

