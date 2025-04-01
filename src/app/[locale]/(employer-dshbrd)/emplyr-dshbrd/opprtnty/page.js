"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, ChevronRight, MoreVertical, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data for opportunities
const opportunitiesData = [
  { id: 1, type: "Internship", title: "UI Designer", location: "Bangalore, Karnataka, India", status: "Live" },
  { id: 2, type: "Job", title: "UI Designer", location: "Bangalore, Karnataka, India", status: "Draft" },
  { id: 3, type: "Internship", title: "UI Designer", location: "Bangalore, Karnataka, India", status: "Expired" },
  { id: 4, type: "Internship", title: "UI Designer", location: "Bangalore, Karnataka, India", status: "Live" },
  { id: 5, type: "Internship", title: "UI Designer", location: "Bangalore, Karnataka, India", status: "Draft" },
  { id: 6, type: "Internship", title: "UI Designer", location: "Bangalore, Karnataka, India", status: "Expired" },
]

const OpportunityCard = ({ opportunity }) => {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs text-blue-600 font-medium">{opportunity.type}</span>
          <h3 className="text-lg font-semibold mt-1">{opportunity.title}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center text-gray-500 mb-4">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-sm">{opportunity.location}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {opportunity.status === "Live" && (
            <span className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm text-green-500">Live</span>
            </span>
          )}
          {opportunity.status === "Draft" && (
            <span className="flex items-center">
              <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm text-blue-500">Draft</span>
            </span>
          )}
          {opportunity.status === "Expired" && (
            <span className="flex items-center">
              <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
              <span className="text-sm text-red-500">Expired</span>
            </span>
          )}
        </div>

        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 p-0">
          <span className="mr-1">Edit</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("All")

  // Filter opportunities based on active tab
  const filteredOpportunities = opportunitiesData.filter((opportunity) => {
    if (activeTab === "All") return true
    if (activeTab === "Live") return opportunity.status === "Live"
    if (activeTab === "Drafts") return opportunity.status === "Draft"
    if (activeTab === "Expired/Closed") return opportunity.status === "Expired"
    return true
  })

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Opportunities</h1>
        <div className="flex gap-3">
          <Button className="bg-blue-500 hover:bg-blue-600">Add new opportunity</Button>
          <Button variant="outline" className="flex items-center gap-1">
            Filters
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["All", "Live", "Drafts", "Expired/Closed"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            variant={activeTab === tab ? "default" : "outline"}
            className={`${
              activeTab === tab ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-white text-gray-700"
            } rounded-md`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Opportunities grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  )
}

