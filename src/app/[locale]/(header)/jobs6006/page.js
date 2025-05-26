"use client"; 
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Shield,
  MapPin,
  Users,
  Filter,
  Link2,
  Bookmark,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdMoney } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { FcOvertime } from "react-icons/fc";
import { IoMdShareAlt } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";
import { IoLogoApple } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";

const JobCard = ({ job }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/job/${job._id}`);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getOpportunityType = (type) => {
    switch (type) {
      case "job":
        return "Job";
      case "internship":
        return "Internship";
      case "project":
        return "Project";
      default:
        return "Opportunity";
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden relative hover:shadow-lg transition-shadow duration-200 flex flex-col h-full min-h-[280px]"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <div
            className="bg-gradient-to-r from-green-500 to-primary p-2 px-6 rounded-r-md text-white"
            style={{ clipPath: "polygon(0 0, 100% 0%, 90% 100%, 0% 100%)" }}
          >
            <div className="flex items-center gap-2">
              <MdMoney className="w-4 h-4" />
              <span className="text-sm font-medium">
                {job.displaySalary || "Salary not specified"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mx-2">
          <div className="rounded-full p-1.5 border border-gray-300">
            <IoLogoApple className="h-4 w-4" />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard");
            }}
          >
            <IoMdShareAlt className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-grow space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium line-clamp-2">
            {job.HCJ_JP_Job_Title}
          </h3>
          <Badge variant="outline" className="text-xs">
            {getOpportunityType(job.HCJ_JP_Opportunity_Type)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-gray-600">
          <div className="flex items-center gap-2">
            <IoBagOutline className="h-4 w-4" />
            <span className="text-sm">
              {job.HCJ_JP_Internship_Duration ||
                job.HCJ_Project_Duration ||
                "Duration varies"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineLightBulb className="h-4 w-4" />
            <span className="text-sm">
              {job.HCJ_JP_Job_Skills?.[0] || "Skills required"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {job.HCJ_JDT_Job_Location || "Location not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              {job.HCJ_JP_Interns_Required
                ? `${job.HCJ_JP_Interns_Required} openings`
                : "Multiple openings"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Apply
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary"
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
          <Shield className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center bg-gray-50 p-2 mt-auto">
        <div
          className="bg-gradient-to-r from-primary to-green-500 p-2 px-6 rounded-r-md text-xs text-white font-medium"
          style={{ clipPath: "polygon(0 0, 100% 0%, 90% 100%, 0% 100%)" }}
        >
          {job.company?.CD_Company_Name || "Company"}
        </div>
        <div className="text-gray-600 text-xs mx-4">
          <div className="flex items-center gap-1">
            <SlCalender className="h-3 w-3" />
            <span>Posted: {formatDate(job.postedDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FcOvertime className="h-3 w-3" />
            <span>Closes: {formatDate(job.deadlineDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({
  locations,
  skills,
  selectedTypes,
  setSelectedTypes,
  selectedLocation,
  setSelectedLocation,
  salaryRange,
  setSalaryRange,
  setAdditionalFilters,
  searchText,
  setSearchText,
}) => {
  const handleFilterChange = useCallback(() => {
    const newFilters = {
      HCJ_JDT_Job_Status: "active",
      withCompany: "true"
    };

    // Add type filter if not empty
    if (selectedTypes.length > 0) {
      newFilters.type = selectedTypes.join(',');
    }

    // Add location filter if not "all"
    if (selectedLocation !== "all") {
      newFilters.location = selectedLocation;
    }

    // Add salary filters
    if (salaryRange[0] > 0 || salaryRange[1] < 100) {
      newFilters.minSalary = salaryRange[0] * 1000;
      newFilters.maxSalary = salaryRange[1] * 1000;
    }

    // Add search text if exists
    if (searchText) {
      newFilters.search = searchText;
    }

    setAdditionalFilters(newFilters);
  }, [selectedTypes, selectedLocation, salaryRange, searchText, setAdditionalFilters]);

  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  const toggleTypeSelection = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="w-[250px] min-h-screen border-r border-gray-200 flex flex-col">
      {/* Filters - Moved to the top */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </h3>

        <div className="space-y-4">
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Job title, skills..."
                className="pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Opportunity Type
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="job-checkbox"
                  checked={selectedTypes.includes('job')}
                  onChange={() => toggleTypeSelection('job')}
                />
                <label htmlFor="job-checkbox">Jobs</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="internship-checkbox"
                  checked={selectedTypes.includes('internship')}
                  onChange={() => toggleTypeSelection('internship')}
                />
                <label htmlFor="internship-checkbox">Internships</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="project-checkbox"
                  checked={selectedTypes.includes('project')}
                  onChange={() => toggleTypeSelection('project')}
                />
                <label htmlFor="project-checkbox">Projects</label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Location</label>
            <Select
              value={selectedLocation}
              onValueChange={(value) => {
                setSelectedLocation(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Salary Range (₹K)
            </label>
            <div className="px-1">
              <Slider
                value={salaryRange}
                onValueChange={(value) => {
                  setSalaryRange(value);
                }}
                min={0}
                max={100}
                step={1}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  ₹{salaryRange[0]}K
                </span>
                <span className="text-xs text-gray-500">
                  ₹{salaryRange[1]}K
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Skills</label>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="outline" className="cursor-pointer">
                  {skill}
                </Badge>
              ))}
              {skills.length > 5 && (
                <Badge variant="outline" className="cursor-pointer">
                  +{skills.length - 5}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links - Moved to the bottom */}
      <div className="mt-auto py-2 border-t border-gray-200">
        <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
          <Link2 className="h-5 w-5 text-gray-500" />
          <span className="text-sm">Connections</span>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-[280px]"
        >
          <div className="p-4 space-y-4">
            <Skeleton className="h-6 w-3/4 rounded" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded" />
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
          <div className="p-2 bg-gray-50 mt-auto">
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function JobsPage() {
  const { data: session } = useSession();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [salaryRange, setSalaryRange] = useState([0, 100]);
  const [locations, setLocations] = useState([]);
  const [skills, setSkills] = useState([]);

  const {
    items: jobs,
    paginationInfo,
    isLoading,
    searchText,
    setSearchText,
    goToPage,
    setAdditionalFilters,
    refreshData,
  } = usePagination("/api/employee/v1/hcjArET60031getAllJobPostings", {
    pageSize: 6,
    batchSize: 100,
    searchDelay: 400,
    initialFilters: {
      HCJ_JDT_Job_Status: "active",
      withCompany: "true",
    },
  });

  useEffect(() => {
    if (jobs.length > 0) {
      // Extract unique locations
      const uniqueLocations = [
        ...new Set(jobs.map((job) => job.HCJ_JDT_Job_Location)),
      ].filter(Boolean);
      setLocations(uniqueLocations);

      // Extract unique skills
      const allSkills = jobs.flatMap((job) => job.HCJ_JP_Job_Skills || []);
      const uniqueSkills = [...new Set(allSkills)].filter(Boolean);
      setSkills(uniqueSkills);
    }
  }, [jobs]);

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please sign in to view job opportunities</p>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar with filters at the top */}
      <Sidebar
        locations={locations}
        skills={skills}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        salaryRange={salaryRange}
        setSalaryRange={setSalaryRange}
        setAdditionalFilters={setAdditionalFilters}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Find Opportunities For You
          </h1>
          <p className="text-gray-500">
            Discover jobs, internships and projects tailored for you
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedTypes.length === 0 ? "default" : "outline"}
            onClick={() => setSelectedTypes([])}
            className="whitespace-nowrap"
          >
            All Opportunities
          </Button>
          <Button
            variant={selectedTypes.includes('job') ? "default" : "outline"}
            onClick={() => toggleType('job')}
            className="whitespace-nowrap"
          >
            Jobs
          </Button>
          <Button
            variant={selectedTypes.includes('internship') ? "default" : "outline"}
            onClick={() => toggleType('internship')}
            className="whitespace-nowrap"
          >
            Internships
          </Button>
          <Button
            variant={selectedTypes.includes('project') ? "default" : "outline"}
            onClick={() => toggleType('project')}
            className="whitespace-nowrap"
          >
            Projects
          </Button>
        </div>

        {/* Jobs Count */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {paginationInfo.total} Opportunities Found
          </h2>
          <div className="text-sm text-gray-500">
            Page {paginationInfo.currentPage} of{" "}
            {paginationInfo.totalPages || 1}
          </div>
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <PaginationControls
                paginationInfo={paginationInfo}
                onPageChange={goToPage}
              />
            </div>
          </>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No opportunities found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filters to find what you&apos;re looking
              for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
