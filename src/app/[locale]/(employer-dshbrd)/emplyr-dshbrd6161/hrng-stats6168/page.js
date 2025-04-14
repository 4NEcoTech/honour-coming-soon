"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Download, Users, UserCheck, CalendarClock, UserCheck2 } from "lucide-react"

// Sample data
const hiringData = [
  { id: 1, role: "UI Designer", status: "Live", applications: 563, shortlisted: 205, interviews: 20, hired: 4 },
  { id: 2, role: "Developer", status: "Live", applications: 563, shortlisted: 205, interviews: 20, hired: 4 },
  { id: 3, role: "UI Designer", status: "Live", applications: 563, shortlisted: 225, interviews: 25, hired: 4 },
  { id: 4, role: "UI Designer", status: "Live", applications: 563, shortlisted: 205, interviews: 20, hired: 4 },
  { id: 5, role: "UI Designer", status: "Closed", applications: 563, shortlisted: 205, interviews: 20, hired: 4 },
  { id: 6, role: "Graphic Designer", status: "Drafts", applications: 0, shortlisted: 0, interviews: 0, hired: 0 },
]

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm">
    <div className="bg-blue-50 p-2 rounded-lg">
      <Icon className="h-5 w-5 text-blue-500" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
)

export default function HiringStatsPage() {
  const [filterValue, setFilterValue] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Calculate totals
  const totals = hiringData.reduce(
    (acc, curr) => ({
      applications: acc.applications + curr.applications,
      shortlisted: acc.shortlisted + curr.shortlisted,
      interviews: acc.interviews + curr.interviews,
      hired: acc.hired + curr.hired,
    }),
    { applications: 0, shortlisted: 0, interviews: 0, hired: 0 },
  )

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Hiring Stats</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Application Received" value={totals.applications} />
        <StatCard icon={UserCheck} label="Shortlisted Candidates" value={totals.shortlisted} />
        <StatCard icon={CalendarClock} label="Interview Schedule" value={totals.interviews} />
        <StatCard icon={UserCheck2} label="Hired Candidates" value={totals.hired} />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Opportunity"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filter</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={filterValue} onValueChange={setFilterValue}>
                <DropdownMenuRadioItem value="all">All Opportunities</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="live">Live</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="drafts">Drafts</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="closed">Closed</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="free">Free</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="premium">Premium</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Download className="h-4 w-4 mr-2" />
            Export to excel
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opportunity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Application Received</TableHead>
              <TableHead className="text-right">Shortlisted</TableHead>
              <TableHead className="text-right">Interview Scheduled</TableHead>
              <TableHead className="text-right">Hired</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hiringData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.role}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        row.status === "Live" ? "bg-green-500" : row.status === "Closed" ? "bg-red-500" : "bg-blue-500"
                      }`}
                    />
                    <span
                      className={`${
                        row.status === "Live"
                          ? "text-green-500"
                          : row.status === "Closed"
                            ? "text-red-500"
                            : "text-blue-500"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{row.applications}</TableCell>
                <TableCell className="text-right">{row.shortlisted}</TableCell>
                <TableCell className="text-right">{row.interviews}</TableCell>
                <TableCell className="text-right">{row.hired}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

