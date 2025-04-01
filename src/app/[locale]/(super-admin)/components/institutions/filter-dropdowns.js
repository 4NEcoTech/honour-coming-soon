"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, X } from "lucide-react"

export function FilterDropdowns({
  userTypeFilter,
  setUserTypeFilter,
  dateFilter,
  setDateFilter,
  verificationStatusFilter,
  setVerificationStatusFilter,
  clearFilters,
}) {
  const [isUserTypeOpen, setIsUserTypeOpen] = useState(false)
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isVerificationStatusOpen, setIsVerificationStatusOpen] = useState(false)

  const hasActiveFilters = userTypeFilter || dateFilter || verificationStatusFilter

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="flex items-center gap-1" onClick={() => setIsUserTypeOpen(!isUserTypeOpen)}>
        <span>User Type</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      <DropdownMenu open={isUserTypeOpen} onOpenChange={setIsUserTypeOpen}>
        <DropdownMenuTrigger asChild>
          <span className="sr-only">Open user type filter</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>User Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={userTypeFilter || ""}
            onValueChange={(value) => setUserTypeFilter(value || null)}
          >
            <DropdownMenuRadioItem value="College">College</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="University">University</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="School">School</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Institute">Institute</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <span>Date Registered on</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateFilter || undefined}
            onSelect={(date) => {
              setDateFilter(date)
              setIsDateOpen(false)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <DropdownMenu open={isVerificationStatusOpen} onOpenChange={setIsVerificationStatusOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <span>Verification Status</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Verification Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={verificationStatusFilter || ""}
            onValueChange={(value) => setVerificationStatusFilter(value || null)}
          >
            <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="verified">Verified</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="not_verified">Not Verified</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="requested_info">Requested Information</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters} className="h-9 w-9">
          <X className="h-4 w-4" />
          <span className="sr-only">Clear filters</span>
        </Button>
      )}
    </div>
  )
}

