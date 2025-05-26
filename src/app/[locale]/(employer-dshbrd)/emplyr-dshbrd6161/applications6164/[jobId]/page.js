"use client"

import { useEffect, useState } from "react"
import { Check, ChevronDown, Search, X, MoreVertical, SortAsc, SortDesc, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePagination } from "@/hooks/use-pagination"
import { toast } from "@/hooks/use-toast"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { SearchInput } from "@/components/ui/search-input"

// Mock data for filters
const locations = [
  { value: "singapore", label: "Singapore" },
  { value: "bangalore", label: "Bangalore" },
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
]

const skills = [
  { value: "ui", label: "UI" },
  { value: "figma", label: "Figma" },
  { value: "react", label: "React" },
  { value: "js", label: "JS" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
]

const branches = [
  { value: "computer-science", label: "Computer Science" },
  { value: "information-technology", label: "Information Technology" },
  { value: "electronics", label: "Electronics" },
  { value: "mechanical", label: "Mechanical" },
]

const experiences = [
  { value: "0-1", label: "0-1 Years" },
  { value: "1-2", label: "1-2 Years" },
  { value: "2-3", label: "2-3 Years" },
  { value: "3-5", label: "3-5 Years" },
  { value: "5+", label: "5+ Years" },
]

export default function Page({ params }) {
  const [selectedTab, setSelectedTab] = useState("Received")
  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    skills: [],
    branch: [],
    experience: [],
  })
  const [nameFilterEnabled, setNameFilterEnabled] = useState(false)
  const [sortDirection, setSortDirection] = useState("asc")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [statusCounts, setStatusCounts] = useState({
    Received: 0,
    Shortlisted: 0,
    Hired: 0,
    Rejected: 0,
  })
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  // Get the job ID from params
  const jobId = params?.jobId || "682afc96d14e8f16bf2fae04" // Default job ID for testing

  // Use the pagination hook to fetch job applications
  const {
    items: applicants,
    paginationInfo,
    isLoading,
    searchText,
    setSearchText,
    goToPage,
    setAdditionalFilters,
    refreshData,
  } = usePagination(`/api/employee/v1/hcjArET60062getAllJobApplicant/${jobId}`, {
    pageSize: 10,
    batchSize: 100,
    searchDelay: 400,
    initialFilters: {
      status: selectedTab,
    },
  })

  // Update filters when tab changes
  useEffect(() => {
    setAdditionalFilters({
      status: selectedTab,
    })
  }, [selectedTab, setAdditionalFilters])

  // Fetch status counts
  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        // Fetch counts for each status
        const statuses = ["Received", "Shortlisted", "Hired", "Rejected"]
        const counts = {}

        for (const status of statuses) {
          const response = await fetch(`/api/employee/v1/hcjArET60062getAllJobApplicant/${jobId}?status=${status}`)
          if (response.ok) {
            const data = await response.json()
            counts[status] = data.total || 0
          }
        }

        setStatusCounts(counts)
      } catch (error) {
        console.error("Error fetching status counts:", error)
      }
    }

    if (jobId) {
      fetchStatusCounts()
    }
  }, [jobId])

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    if (isUpdatingStatus) return

    setIsUpdatingStatus(true)
    try {
      const response = await fetch("/api/employee/v1/hcjBrBT61681UpdateApplicationStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      // Show success toast
      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}`,
      })

      // Refresh data to show updated status
      refreshData()

      // Update counts
      setStatusCounts((prev) => ({
        ...prev,
        [selectedTab]: Math.max(0, prev[selectedTab] - 1),
        [newStatus]: prev[newStatus] + 1,
      }))
    } catch (error) {
      console.error("Error updating application status:", error)
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Filter toggle handlers
  const toggleFilter = (type, value) => {
    setSelectedFilters((prev) => {
      const current = [...prev[type]]
      const index = current.indexOf(value)

      if (index === -1) {
        current.push(value)
      } else {
        current.splice(index, 1)
      }

      return {
        ...prev,
        [type]: current,
      }
    })
  }

  // Clear all filters of a specific type
  const clearFilters = (type) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: [],
    }))
  }

  const toggleNameFilter = () => {
    setNameFilterEnabled((prev) => !prev)
  }

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const handleViewApplicant = (applicant) => {
    setSelectedApplicant(applicant)
    setIsPopupOpen(true)
  }

  // Map applicants data for rendering
  const mappedApplicants = applicants.map((applicant) => ({
    id: applicant._id,
    name: `${applicant.HCJ_AT_Applicant_First_Name} ${applicant.HCJ_AT_Applicant_Last_Name}`,
    email: applicant.HCJ_AT_Applicant_Email,
    phone: applicant.HCJ_AT_Applicant_Phone_Number,
    type: applicant.HCJ_AT_Applicant_Type,
    status: applicant.HCJ_AT_Application_Status,
    appliedAt: new Date(applicant.HCJ_AT_Applied_At).toLocaleDateString(),
    ...applicant, // Include all original data
  }))

  // Define action buttons based on current tab
  const getActionButtons = (applicant) => {
    switch (selectedTab) {
      case "Received":
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200"
              onClick={() => updateApplicationStatus(applicant._id, "Shortlisted")}
              disabled={isUpdatingStatus}
            >
              Shortlist
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
              onClick={() => updateApplicationStatus(applicant._id, "Rejected")}
              disabled={isUpdatingStatus}
            >
              Reject
            </Button>
          </div>
        )
      case "Shortlisted":
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-green-100 text-green-600 border-green-200 hover:bg-green-200"
              onClick={() => updateApplicationStatus(applicant._id, "Hired")}
              disabled={isUpdatingStatus}
            >
              Hire
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
              onClick={() => updateApplicationStatus(applicant._id, "Rejected")}
              disabled={isUpdatingStatus}
            >
              Reject
            </Button>
          </div>
        )
      case "Hired":
        return (
          <Button variant="outline" size="sm" className="bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200">
            Contact
          </Button>
        )
      case "Rejected":
        return (
          <Button
            variant="outline"
            size="sm"
            className="bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200"
            onClick={() => updateApplicationStatus(applicant._id, "Shortlisted")}
            disabled={isUpdatingStatus}
          >
            Reconsider
          </Button>
        )
      default:
        return null
    }
  }

  // Render applicant card
  const renderApplicantCard = (applicant) => (
    <Card key={applicant._id} className="p-4">
      <div className="flex items-start gap-4">
        <Checkbox id={`select-${applicant._id}`} />
        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {applicant.HCJ_AT_Applicant_First_Name?.charAt(0) || "A"}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-semibold">
              {applicant.HCJ_AT_Applicant_First_Name} {applicant.HCJ_AT_Applicant_Last_Name}
            </h3>
            {getActionButtons(applicant)}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span>Email:</span>
              <span className="font-medium">{applicant.HCJ_AT_Applicant_Email}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Phone:</span>
              <span className="font-medium">{applicant.HCJ_AT_Applicant_Phone_Number}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Applied:</span>
              <span className="font-medium">{new Date(applicant.HCJ_AT_Applied_At).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Type:</span>
              <span className="font-medium">{applicant.HCJ_AT_Applicant_Type}</span>
            </div>
          </div>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600"
              onClick={() => handleViewApplicant(applicant)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 relative">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 right-4 z-20 bg-white p-2 rounded-md shadow-md"
          aria-label="Toggle Filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">UI Designer</h1>
          <p className="text-sm text-gray-500">{paginationInfo.total || 0} Applicants</p>
        </div>

        {/* Status Tabs */}
        <Tabs defaultValue="Received" className="mb-6" onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="Received" className="flex items-center gap-2">
              Received{" "}
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                ({statusCounts.Received})
              </span>
            </TabsTrigger>
            <TabsTrigger value="Shortlisted" className="flex items-center gap-2">
              Shortlisted{" "}
              <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs">
                ({statusCounts.Shortlisted})
              </span>
            </TabsTrigger>
            <TabsTrigger value="Hired" className="flex items-center gap-2">
              Hired{" "}
              <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs">
                ({statusCounts.Hired})
              </span>
            </TabsTrigger>
            <TabsTrigger value="Rejected" className="flex items-center gap-2">
              Rejected{" "}
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                ({statusCounts.Rejected})
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Search Bar */}
          <div className="relative mt-6 mb-4">
            <SearchInput value={searchText} onChange={setSearchText} placeholder="Search by name, email, phone..." />
          </div>

          {/* Applicants List */}
          <TabsContent value="Received" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">Loading applicants...</div>
            ) : mappedApplicants.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No applicants found</div>
            ) : (
              mappedApplicants.map(renderApplicantCard)
            )}
          </TabsContent>

          <TabsContent value="Shortlisted" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">Loading applicants...</div>
            ) : mappedApplicants.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No shortlisted applicants found</div>
            ) : (
              mappedApplicants.map(renderApplicantCard)
            )}
          </TabsContent>

          <TabsContent value="Hired" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">Loading applicants...</div>
            ) : mappedApplicants.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No hired applicants found</div>
            ) : (
              mappedApplicants.map(renderApplicantCard)
            )}
          </TabsContent>

          <TabsContent value="Rejected" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">Loading applicants...</div>
            ) : mappedApplicants.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No rejected applicants found</div>
            ) : (
              mappedApplicants.map(renderApplicantCard)
            )}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {!isLoading && mappedApplicants.length > 0 && (
          <div className="flex justify-between items-center mt-8">
            <PaginationControls paginationInfo={paginationInfo} onPageChange={goToPage} />
          </div>
        )}
      </div>

      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-l-md shadow-md"
        aria-label="Toggle Filters"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide ${sidebarOpen ? "lucide-chevron-right" : "lucide-chevron-left"}`}
        >
          {sidebarOpen ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
        </svg>
      </button>

      {/* Right Sidebar */}
      <div
        className={`w-full md:w-80 p-4 border-l border-gray-200 bg-white fixed md:relative right-0 top-0 h-full z-10 transition-all duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0 md:w-0 md:p-0 md:opacity-0"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Filters</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open filter menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Name Filter</span>
                </div>
                <Switch checked={nameFilterEnabled} onCheckedChange={toggleNameFilter} />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleSortDirection} className="cursor-pointer">
                {sortDirection === "asc" ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
                <span>Sort by {sortDirection === "asc" ? "A-Z" : "Z-A"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Location Filter */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Location</h3>
            {selectedFilters.location.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-blue-600 hover:text-blue-800"
                onClick={() => clearFilters("location")}
              >
                Clear
              </Button>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {selectedFilters.location.length > 0
                  ? `${selectedFilters.location.length} selected`
                  : "Select location"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search location..." />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {locations.map((location) => (
                      <CommandItem
                        key={location.value}
                        onSelect={() => toggleFilter("location", location.value)}
                        className="flex items-center gap-2"
                      >
                        <Checkbox checked={selectedFilters.location.includes(location.value)} className="mr-2" />
                        {location.label}
                        {selectedFilters.location.includes(location.value) && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {selectedFilters.location.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedFilters.location.map((loc) => {
                const locationLabel = locations.find((l) => l.value === loc)?.label
                return (
                  <div key={loc} className="flex items-center bg-blue-50 text-blue-700 text-xs rounded px-2 py-1">
                    {locationLabel}
                    <button onClick={() => toggleFilter("location", loc)} className="ml-1 focus:outline-none">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Skills Filter */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Skills</h3>
            {selectedFilters.skills.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-blue-600 hover:text-blue-800"
                onClick={() => clearFilters("skills")}
              >
                Clear
              </Button>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {selectedFilters.skills.length > 0 ? `${selectedFilters.skills.length} selected` : "Select skills"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search skills..." />
                <CommandList>
                  <CommandEmpty>No skill found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {skills.map((skill) => (
                      <CommandItem
                        key={skill.value}
                        onSelect={() => toggleFilter("skills", skill.value)}
                        className="flex items-center gap-2"
                      >
                        <Checkbox checked={selectedFilters.skills.includes(skill.value)} className="mr-2" />
                        {skill.label}
                        {selectedFilters.skills.includes(skill.value) && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {selectedFilters.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedFilters.skills.map((skill) => {
                const skillLabel = skills.find((s) => s.value === skill)?.label
                return (
                  <div key={skill} className="flex items-center bg-blue-50 text-blue-700 text-xs rounded px-2 py-1">
                    {skillLabel}
                    <button onClick={() => toggleFilter("skills", skill)} className="ml-1 focus:outline-none">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Branch Filter */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Branch/Specialization</h3>
            {selectedFilters.branch.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-blue-600 hover:text-blue-800"
                onClick={() => clearFilters("branch")}
              >
                Clear
              </Button>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {selectedFilters.branch.length > 0 ? `${selectedFilters.branch.length} selected` : "Select branch"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search branch..." />
                <CommandList>
                  <CommandEmpty>No branch found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {branches.map((branch) => (
                      <CommandItem
                        key={branch.value}
                        onSelect={() => toggleFilter("branch", branch.value)}
                        className="flex items-center gap-2"
                      >
                        <Checkbox checked={selectedFilters.branch.includes(branch.value)} className="mr-2" />
                        {branch.label}
                        {selectedFilters.branch.includes(branch.value) && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {selectedFilters.branch.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedFilters.branch.map((branch) => {
                const branchLabel = branches.find((b) => b.value === branch)?.label
                return (
                  <div key={branch} className="flex items-center bg-blue-50 text-blue-700 text-xs rounded px-2 py-1">
                    {branchLabel}
                    <button onClick={() => toggleFilter("branch", branch)} className="ml-1 focus:outline-none">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Experience Filter */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Experience</h3>
            {selectedFilters.experience.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-blue-600 hover:text-blue-800"
                onClick={() => clearFilters("experience")}
              >
                Clear
              </Button>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {selectedFilters.experience.length > 0
                  ? `${selectedFilters.experience.length} selected`
                  : "Select experience"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search experience..." />
                <CommandList>
                  <CommandEmpty>No experience range found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {experiences.map((exp) => (
                      <CommandItem
                        key={exp.value}
                        onSelect={() => toggleFilter("experience", exp.value)}
                        className="flex items-center gap-2"
                      >
                        <Checkbox checked={selectedFilters.experience.includes(exp.value)} className="mr-2" />
                        {exp.label}
                        {selectedFilters.experience.includes(exp.value) && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {selectedFilters.experience.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedFilters.experience.map((exp) => {
                const expLabel = experiences.find((e) => e.value === exp)?.label
                return (
                  <div key={exp} className="flex items-center bg-blue-50 text-blue-700 text-xs rounded px-2 py-1">
                    {expLabel}
                    <button onClick={() => toggleFilter("experience", exp)} className="ml-1 focus:outline-none">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Selected Filters */}
        {Object.values(selectedFilters).some((arr) => arr.length > 0) && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Selected Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setSelectedFilters({
                    location: [],
                    skills: [],
                    branch: [],
                    experience: [],
                  })
                }}
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(selectedFilters).flatMap(([type, values]) =>
                values.map((value) => {
                  let label = ""
                  switch (type) {
                    case "location":
                      label = locations.find((l) => l.value === value)?.label || value
                      break
                    case "skills":
                      label = skills.find((s) => s.value === value)?.label || value
                      break
                    case "branch":
                      label = branches.find((b) => b.value === value)?.label || value
                      break
                    case "experience":
                      label = experiences.find((e) => e.value === value)?.label || value
                      break
                  }
                  return (
                    <div
                      key={`${type}-${value}`}
                      className="flex items-center bg-blue-50 text-blue-700 text-xs rounded px-2 py-1"
                    >
                      {label}
                      <button onClick={() => toggleFilter(type, value)} className="ml-1 focus:outline-none">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                }),
              )}
            </div>
          </div>
        )}
        {nameFilterEnabled && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-700">Name Filter</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-blue-600 hover:text-blue-800 p-0"
                onClick={() => setNameFilterEnabled(false)}
              >
                <X className="h-3 w-3 mr-1" />
                Disable
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-3 w-3 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-8 pr-3 py-1.5 border border-blue-200 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Filter by name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="mt-2 text-xs text-blue-600">{sortDirection === "asc" ? "Sorting A-Z" : "Sorting Z-A"}</div>
          </div>
        )}
      </div>
    </div>
  )
}
