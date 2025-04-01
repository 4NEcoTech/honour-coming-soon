"use client"
import { useState } from "react"
import { Shield, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MdMoney } from "react-icons/md"
import { SlCalender } from "react-icons/sl"
import { FcOvertime } from "react-icons/fc"
import { IoMdShareAlt } from "react-icons/io"
import { IoBagOutline } from "react-icons/io5"
import { IoLogoApple } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi"

// Generate 12 jobs for each category
const generateJobs = (prefix) => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `${prefix} ${i + 1}`,
    salary: `₹ ${20 + i} LPA - ₹ ${26 + i} LPA`,
    experience: `${2 + Math.floor(i / 3)}+ Years experience`,
    skill: ["React", "Angular", "Vue", "Node.js"][i % 4],
    location: ["Bangalore", "Mumbai", "Delhi", "Hyderabad"][i % 4],
    applicants: `${150 + i * 10}+ Applicants`,
    company: `Tech Corp ${i + 1}`,
    postedDate: "12/01/2025",
    closingDate: "30/01/2025",
  }))
}

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden relative hover:shadow-lg transition-shadow duration-200 flex flex-col h-[280px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <div
            className="bg-gradient-to-r from-green-500 to-primary p-2 px-6 rounded-r-md text-white"
            style={{ clipPath: "polygon(0 0, 100% 0%, 90% 100%, 0% 100%)" }}
          >
            <div className="flex items-center gap-2">
              <MdMoney className="w-4 h-4" />
              <span className="text-sm font-medium">{job.salary}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mx-2">
          <div className="rounded-full p-1.5 border-gray-300">
            {/* <img src="/placeholder.svg?height=24&width=24" alt="Company Logo" className="w-6 h-6" /> */}
              <IoLogoApple className="h-4 w-4" />
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
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
            <HiOutlineLightBulb className="h-4 w-4" />
            <span className="text-sm">Skill: {job.skill}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{job.applicants}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Apply
            </Button>
            <Button size="sm" variant="outline" className="border-primary">
              Save
            </Button>
          </div>
          <Shield className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center bg-gray-50">
        <div
          className="bg-gradient-to-r from-primary to-green-500 p-2 px-6 rounded-r-md text-xs text-white font-medium"
          style={{ clipPath: "polygon(0 0, 100% 0%, 90% 100%, 0% 100%)" }}
        >
          {job.company}
        </div>
        <div className="text-gray-600 text-xs mx-4">
          <div className="flex items-center gap-1">
            <SlCalender className="h-3 w-3" />
            <span>Posted: {job.postedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <FcOvertime className="h-3 w-3" />
            <span>Closes: {job.closingDate}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
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
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

const JobsPage = () => {
  const [activeTab, setActiveTab] = useState("Recommended")
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 6

  const jobLists = {
    Recommended: generateJobs("Software Engineer"),
    Saved: generateJobs("Product Designer"),
    Applied: generateJobs("Full Stack Developer"),
  }

  const currentJobs = jobLists[activeTab].slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  )

  const totalPages = Math.ceil(jobLists[activeTab].length / jobsPerPage)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-6">
        {["Recommended", "Saved", "Applied"].map((tab) => (
          <Button
            key={tab}
            onClick={() => handleTabChange(tab)}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
          >
            {tab}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">{activeTab} Jobs</h1>
        <span className="text-sm text-gray-500">
          Showing {(currentPage - 1) * jobsPerPage + 1}-
          {Math.min(currentPage * jobsPerPage, jobLists[activeTab].length)} of {jobLists[activeTab].length} jobs
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}

export default JobsPage
