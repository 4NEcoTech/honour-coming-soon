"use client"
import { useState } from "react"
import { MapPin, Users, Search, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MdMoney } from "react-icons/md"
import { SlCalender } from "react-icons/sl"
import { IoMdShareAlt } from "react-icons/io"
import { IoBagOutline } from "react-icons/io5"

// Generate 12 jobs for each category
const generateJobs = (prefix) => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: "UI/UX Designer and Illustrator",
    salary: `₹ ${20 + i} LPA - ₹ ${26 + i} LPA`,
    experience: `${2 + Math.floor(i / 3)}+ Years experience`,
    skill: ["React", "Angular", "Vue", "Node.js"][i % 4],
    location: ["Bangalore", "Mumbai", "Delhi", "Hyderabad"][i % 4],
    applicants: `${150 + i * 10}+ Applicants`,
    company: `Tech Corp ${i + 1}`,
    postedDate: "12/01/2025",
    closingDate: "30/01/2025",
    status: ["Live", "Draft", "Paused"][i % 3],
    views: Math.floor(Math.random() * 500) + 100,
  }))
}

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden relative hover:shadow-lg transition-shadow duration-200 flex flex-col h-[280px]">
      {/* Header with status and actions */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 p-2 px-6 rounded-r-md text-white"
            style={{ clipPath: "polygon(0 0, 100% 0%, 90% 100%, 0% 100%)" }}
          >
            <div className="flex items-center gap-2">
              <MdMoney className="w-4 h-4" />
              <span className="text-sm font-medium">{job.salary}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mx-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <IoMdShareAlt className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-grow space-y-4">
        <h3 className="text-lg font-medium line-clamp-2">{job.title}</h3>
        <div className="grid grid-cols-2 gap-3 text-gray-600">
          <div className="flex items-center gap-2">
            <IoBagOutline className="h-4 w-4" />
            <span className="text-sm">{job.experience}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <SlCalender className="h-4 w-4" />
            <span className="text-sm">{job.postedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{job.views} views</span>
          </div>
        </div>

        {/* Application stats */}
        <div className="text-sm text-blue-600">
          <span>{job.applicants} have applied. </span>
          <a href="#" className="underline">
            Click here
          </a>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="flex justify-between items-center p-3 bg-gray-50">
        <Button size="sm" variant="outline">
          View
        </Button>
        <Button size="sm" variant="outline">
          Edit
        </Button>
        <Button
          size="sm"
          className={job.status === "Live" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}
        >
          {job.status === "Live" ? "Live" : job.status === "Draft" ? "Post Job" : "Activate"}
        </Button>
      </div>
    </div>
  )
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        className="text-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          variant={currentPage === i + 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        variant="outline"
        className="text-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  )
}

const JobsPage = () => {
  const [activeTab, setActiveTab] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const jobsPerPage = 9

  const allJobs = generateJobs("UI/UX Designer")

  const filteredJobs = allJobs
    .filter((job) => {
      if (activeTab === "All") return true
      if (activeTab === "Live") return job.status === "Live"
      if (activeTab === "Draft") return job.status === "Draft"
      if (activeTab === "Paused") return job.status === "Paused"
      return true
    })
    .filter((job) => searchQuery === "" || job.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Manage Job Postings</h1>
        <Button className="bg-blue-500 hover:bg-blue-600">Post Job</Button>
      </div>

      {/* Search bar */}
      <div className="mb-6 relative max-w-md">
        <div className="relative">
          <Input
            placeholder="Search by job title/keyword/location"
            className="pl-10 pr-4 py-2 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          Search
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Live", "Draft", "Paused"].map((tab) => (
          <Button
            key={tab}
            onClick={() => handleTabChange(tab)}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            className={activeTab === tab ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Job grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}

export default JobsPage

