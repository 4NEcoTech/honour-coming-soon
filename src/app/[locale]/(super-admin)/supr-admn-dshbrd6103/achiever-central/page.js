// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye, RefreshCw } from "lucide-react"
// import Image from "next/image"
// import { Skeleton } from "@/components/ui/skeleton"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { format } from "date-fns"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useToast } from "@/hooks/use-toast"
// import { useSession } from "next-auth/react"

// // Type definitions for TypeScript

// export default function AchieverDashboard() {
//   const [achievers, setAchievers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [totalAchievers, setTotalAchievers] = useState(0)
//   const [selectedAchiever, setSelectedAchiever] = useState(null)
//   const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
//   const [verificationLoading, setVerificationLoading] = useState(false)
//   const [viewDialogOpen, setViewDialogOpen] = useState(false)
//   const [statusFilter, setStatusFilter] = useState("all")
//   const {toast} = useToast()
//   const {data: session} = useSession()
//   console.log(session)

//   useEffect(() => {
//     fetchAchievers(currentPage, searchTerm, statusFilter)
//   }, [currentPage, searchTerm, statusFilter])

//   const fetchAchievers = async (page, search, status) => {
//     setLoading(true)
//     try {
//       let url = `/api/super-admin/v1/hcjArET61081AchieverCentral?page=${page}`

//       if (search) {
//         url += `&search=${encodeURIComponent(search)}`
//       }

//       if (status && status !== "all") {
//         url += `&status=${status}`
//       }

//       const response = await fetch(url)

//       if (!response.ok) {
//         throw new Error("Failed to fetch achievers")
//       }

//       const data = await response.json()
//       setAchievers(data.data)
//       setTotalPages(data.totalPages)
//       setTotalAchievers(data.total)
//       setCurrentPage(data.currentPage)
//       setLoading(false)
//     } catch (err) {
//       console.error("Error fetching achievers:", err)
//       setError("Failed to load achievers")
//       setLoading(false)
//     }
//   }

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value)
//     setCurrentPage(1)
//   }

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage)
//     }
//   }

//   const handleVerifyAchiever = async (status) => {
//     if (!selectedAchiever) return

//     setVerificationLoading(true)
//     try {
//       const response = await fetch("/api/super-admin/v1/hcjBrBT61081AchieverCentral", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           achieverId: selectedAchiever._id,
//           status: status,
//           superAdminId: session?.user?.id, 
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to verify achiever")
//       }

//       const result = await response.json()

//       toast({
//         title: "Success",
//         description: result.message || "Achiever status updated successfully",
//       })

//       // Refresh the data
//       fetchAchievers(currentPage, searchTerm, statusFilter)
//       setVerifyDialogOpen(false)
//     } catch (err) {
//       console.error("Error verifying achiever:", err)
//       toast({
//         title: "Error",
//         description: "Failed to update achiever status",
//         variant: "destructive",
//       })
//     } finally {
//       setVerificationLoading(false)
//     }
//   }

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "01":
//         return <Badge className="bg-green-500">Verified</Badge>
//       case "02":
//         return <Badge className="bg-yellow-500">Pending</Badge>
//       case "03":
//         return <Badge className="bg-red-500">Rejected</Badge>
//       default:
//         return <Badge className="bg-gray-500">Unknown</Badge>
//     }
//   }

//   const formatDate = (dateString) => {
//     try {
//       return format(new Date(dateString), "MMM dd, yyyy")
//     } catch (error) {
//       return "Invalid date"
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 md:px-8">
//     <Card className="w-full my-8 border-border bg-background dark:bg-gray-900">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-foreground dark:text-white">Achiever Centrals</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
//           <div className="flex flex-col sm:flex-row gap-4 w-full">
//             <div className="relative w-full sm:w-64">
//               <Input
//                 type="text"
//                 placeholder="Search achievers..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="pl-10 bg-background dark:bg-gray-800 text-foreground dark:text-white border-input"
//               />
//               <Search
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-gray-400"
//                 size={20}
//               />
//             </div>

//             <Select
//               value={statusFilter}
//               onValueChange={(value) => {
//                 setStatusFilter(value)
//                 setCurrentPage(1)
//               }}
//             >
//               <SelectTrigger className="w-full sm:w-40">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="01">Verified</SelectItem>
//                 <SelectItem value="02">Pending</SelectItem>
//                 <SelectItem value="03">Rejected</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <Button
//             className="bg-primary hover:bg-primary/90 text-primary-foreground dark:hover:bg-primary/80 whitespace-nowrap"
//             onClick={() => fetchAchievers(currentPage, searchTerm, statusFilter)}
//           >
//             <RefreshCw className="mr-2 h-4 w-4" />
//             Refresh
//           </Button>
//         </div>

//         {loading ? (
//           <SkeletonTable />
//         ) : error ? (
//           <p className="text-center text-red-500 dark:text-red-400">{error}</p>
//         ) : achievers.length === 0 ? (
//           <div className="text-center py-8 text-muted-foreground">
//             No achievers found. Try adjusting your search or filters.
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="border-border dark:border-gray-700">
//                     <TableHead className="text-muted-foreground dark:text-gray-400">Achiever</TableHead>
//                     <TableHead className="text-muted-foreground dark:text-gray-400">Event</TableHead>
//                     <TableHead className="text-muted-foreground dark:text-gray-400">College</TableHead>
//                     <TableHead className="text-muted-foreground dark:text-gray-400">Event Date</TableHead>
//                     <TableHead className="text-muted-foreground dark:text-gray-400">Status</TableHead>
//                     <TableHead className="text-muted-foreground dark:text-gray-400">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {achievers.map((achiever) => (
//                     <TableRow
//                       key={achiever._id}
//                       className="border-border dark:border-gray-700 hover:bg-muted/50 dark:hover:bg-gray-800/50"
//                     >
//                       <TableCell className="text-foreground dark:text-gray-200 font-medium">
//                         {achiever.HCJ_AC_Achievers_Name}
//                       </TableCell>
//                       <TableCell className="text-foreground dark:text-gray-200">
//                         {achiever.HCJ_AC_Achievers_Event_Name}
//                       </TableCell>
//                       <TableCell className="text-foreground dark:text-gray-200">
//                         {achiever.HCJ_AC_College_Name}
//                       </TableCell>
//                       <TableCell className="text-foreground dark:text-gray-200">
//                         {formatDate(achiever.HCJ_AC_Achievers_Event_Dt)}
//                       </TableCell>
//                       <TableCell className="text-foreground dark:text-gray-200">
//                         {getStatusBadge(achiever.HCJ_AC_Status)}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               setSelectedAchiever(achiever)
//                               setViewDialogOpen(true)
//                             }}
//                           >
//                             <Eye className="h-4 w-4" />
//                             <span className="sr-only">View</span>
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               setSelectedAchiever(achiever)
//                               setVerifyDialogOpen(true)
//                             }}
//                           >
//                             {achiever.HCJ_AC_Status === "01" ? (
//                               <XCircle className="h-4 w-4 text-red-500" />
//                             ) : (
//                               <CheckCircle className="h-4 w-4 text-green-500" />
//                             )}
//                             <span className="sr-only">Verify</span>
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <div className="text-sm text-muted-foreground dark:text-gray-400">
//                 Showing {achievers.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to{" "}
//                 {Math.min(currentPage * 10, totalAchievers)} of {totalAchievers} entries
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="border-input dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//                 <span className="text-sm font-medium text-foreground dark:text-gray-200">
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="border-input dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </>
//         )}
//       </CardContent>

//       {/* View Achiever Details Dialog */}
//       <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
//         <DialogContent className="sm:max-w-[600px] bg-background dark:bg-gray-800 border-border">
//           <DialogHeader>
//             <DialogTitle>Achiever Details</DialogTitle>
//           </DialogHeader>

//           {selectedAchiever && (
//             <Tabs defaultValue="details" className="w-full">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="details">Details</TabsTrigger>
//                 <TabsTrigger value="images">Images</TabsTrigger>
//               </TabsList>

//               <TabsContent value="details" className="space-y-4 mt-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
//                     <p className="text-foreground">{selectedAchiever.HCJ_AC_Achievers_Name}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-muted-foreground">College</h4>
//                     <p className="text-foreground">{selectedAchiever.HCJ_AC_College_Name}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-muted-foreground">Event</h4>
//                     <p className="text-foreground">{selectedAchiever.HCJ_AC_Achievers_Event_Name}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-muted-foreground">Event Date</h4>
//                     <p className="text-foreground">{formatDate(selectedAchiever.HCJ_AC_Achievers_Event_Dt)}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
//                     <p className="text-foreground">{getStatusBadge(selectedAchiever.HCJ_AC_Status)}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-muted-foreground">Publish Date</h4>
//                     <p className="text-foreground">{formatDate(selectedAchiever.HCJ_AC_Publish_Dt)}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="text-sm font-medium text-muted-foreground">Event Description</h4>
//                   <p className="text-foreground">{selectedAchiever.HCJ_AC_Achievers_Event_Description}</p>
//                 </div>

//                 <div>
//                   <h4 className="text-sm font-medium text-muted-foreground">Award Description</h4>
//                   <p className="text-foreground">{selectedAchiever.HCJ_AC_Achievers_Award_Description}</p>
//                 </div>

//                 <div>
//                   <h4 className="text-sm font-medium text-muted-foreground">Detailed Award Description</h4>
//                   <p className="text-foreground">{selectedAchiever.HCJ_AC_Achievers_Award_Detail_Description}</p>
//                 </div>
//               </TabsContent>

//               <TabsContent value="images" className="space-y-4 mt-4">
//                 <div className="flex flex-col items-center">
//                   <h4 className="text-sm font-medium text-muted-foreground mb-2">Award Image</h4>
//                   {selectedAchiever.HCJ_AC_Achievers_Award_Img ? (
//                     <div className="relative w-full h-[300px] rounded-md overflow-hidden">
//                       <Image
//                         src={selectedAchiever.HCJ_AC_Achievers_Award_Img || "/placeholder.svg"}
//                         alt="Award image"
//                         fill
//                         className="object-contain"
//                       />
//                     </div>
//                   ) : (
//                     <p className="text-muted-foreground">No award image available</p>
//                   )}
//                 </div>
//               </TabsContent>
//             </Tabs>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
//               Close
//             </Button>
//             <Button
//               onClick={() => {
//                 setViewDialogOpen(false)
//                 setVerifyDialogOpen(true)
//               }}
//             >
//               {selectedAchiever?.HCJ_AC_Status === "01" ? "Change Status" : "Verify Achiever"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Verify Achiever Dialog */}
//       <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
//         <DialogContent className="sm:max-w-[425px] bg-background dark:bg-gray-800 border-border">
//           <DialogHeader>
//             <DialogTitle>
//               {selectedAchiever?.HCJ_AC_Status === "01" ? "Update Achiever Status" : "Verify Achiever"}
//             </DialogTitle>
//             <DialogDescription>
//               {selectedAchiever?.HCJ_AC_Status === "01"
//                 ? "This achiever is currently verified. Do you want to change their status?"
//                 : "Are you sure you want to verify this achiever?"}
//             </DialogDescription>
//           </DialogHeader>

//           {selectedAchiever && (
//             <div className="py-4">
//               <h3 className="font-medium">{selectedAchiever.HCJ_AC_Achievers_Name}</h3>
//               <p className="text-sm text-muted-foreground mt-1">
//                 {selectedAchiever.HCJ_AC_College_Name} • {selectedAchiever.HCJ_AC_Achievers_Event_Name}
//               </p>
//               <div className="mt-2">Current status: {getStatusBadge(selectedAchiever.HCJ_AC_Status)}</div>
//             </div>
//           )}

//           <DialogFooter className="flex flex-col sm:flex-row gap-2">
//             <Button variant="outline" onClick={() => setVerifyDialogOpen(false)} disabled={verificationLoading}>
//               Cancel
//             </Button>

//             {selectedAchiever?.HCJ_AC_Status === "01" ? (
//               <Button variant="destructive" onClick={() => handleVerifyAchiever("02")} disabled={verificationLoading}>
//                 {verificationLoading ? "Processing..." : "Mark as Pending"}
//               </Button>
//             ) : selectedAchiever?.HCJ_AC_Status === "02" ? (
//               <div className="flex gap-2">
//                 <Button variant="destructive" onClick={() => handleVerifyAchiever("03")} disabled={verificationLoading}>
//                   {verificationLoading ? "Processing..." : "Reject"}
//                 </Button>
//                 <Button
//                   variant="default"
//                   onClick={() => handleVerifyAchiever("01")}
//                   disabled={verificationLoading}
//                   className="bg-green-600 hover:bg-green-700"
//                 >
//                   {verificationLoading ? "Processing..." : "Verify"}
//                 </Button>
//               </div>
//             ) : (
//               <Button
//                 variant="default"
//                 onClick={() => handleVerifyAchiever("01")}
//                 disabled={verificationLoading}
//                 className="bg-green-600 hover:bg-green-700"
//               >
//                 {verificationLoading ? "Processing..." : "Mark as Verified"}
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </Card>
//     </div>
//   )
// }

// function SkeletonTable() {
//   return (
//     <div className="space-y-4">
//       {[...Array(5)].map((_, i) => (
//         <Skeleton key={i} className="h-12 w-full dark:bg-gray-700" />
//       ))}
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

import { DataList } from "@/components/data-list"
import { DataTable } from "@/components/data-table"
import { DataViewToggle } from "@/components/data-view-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { SearchInput } from "@/components/ui/search-input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {usePagination} from "@/hooks/use-pagination"

export default function AchieverDashboard() {
  const { data: session } = useSession()
  const { toast } = useToast()

  const [viewMode, setViewMode] = useState("table")
  const [selectedAchiever, setSelectedAchiever] = useState(null)
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    event: true,
    college: true,
    status: true,
  })

  const {
    items: achievers,
    paginationInfo,
    isLoading,
    searchText,
    setSearchText,
    goToPage,
    setAdditionalFilters,
    refreshData,
  } = usePagination("/api/super-admin/v1/hcjArET61081AchieverCentral", {
    pageSize: 10,
    batchSize: 100,
    searchDelay: 400,
  })

  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    setAdditionalFilters({
      ...(statusFilter !== "all" && { status: statusFilter }),
    })
  }, [statusFilter, setAdditionalFilters])

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }))
  }

  const handleVerifyAchiever = async (status) => {
    if (!selectedAchiever) return

    setVerificationLoading(true)
    try {
      const response = await fetch("/api/super-admin/v1/hcjBrBT61081AchieverCentral", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          achieverId: selectedAchiever._id,
          status: status,
          superAdminId: session?.user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to verify achiever")
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: result.message || "Achiever status updated successfully",
      })

      refreshData()
      setVerifyDialogOpen(false)
    } catch (err) {
      console.error("Error verifying achiever:", err)
      toast({
        title: "Error",
        description: "Failed to update achiever status",
        variant: "destructive",
      })
    } finally {
      setVerificationLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "01":
        return <Badge className="bg-green-500">Verified</Badge>
      case "02":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "03":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  const mappedAchievers = achievers.map((achiever) => ({
    ...achiever,
    id: achiever._id,
    name: achiever.HCJ_AC_Achievers_Name,
    event: achiever.HCJ_AC_Achievers_Event_Name,
    college: achiever.HCJ_AC_College_Name,
    eventDate: formatDate(achiever.HCJ_AC_Achievers_Event_Dt),
    status: achiever.HCJ_AC_Status,
    statusBadge: getStatusBadge(achiever.HCJ_AC_Status),
  }))

  const tableColumns = [
    { key: "name", header: "Achiever", isVisible: visibleColumns.name },
    { key: "event", header: "Event", isVisible: visibleColumns.event },
    { key: "college", header: "College", isVisible: visibleColumns.college },
    { key: "eventDate", header: "Event Date" },
    { key: "statusBadge", header: "Status", isVisible: visibleColumns.status },
    {
      key: "actions",
      header: "Actions",
      render: (achiever) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedAchiever(achiever)
              setViewDialogOpen(true)
            }}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedAchiever(achiever)
              setVerifyDialogOpen(true)
            }}
          >
            {achiever.status === "01" ? "Unverify" : "Verify"}
          </Button>
        </div>
      ),
    },
  ]

  const listFields = [
    { key: "name", label: "Achiever" },
    { key: "event", label: "Event" },
    { key: "college", label: "College" },
    { key: "statusBadge", label: "Status" },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Achiever Central</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border border-green-500 text-green-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Verified Achievers</h2>
            <p className="text-2xl font-bold">
              {paginationInfo.totalStatusCounts?.["01"] || 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-yellow-500 text-yellow-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Pending Achievers</h2>
            <p className="text-2xl font-bold">
              {paginationInfo.totalStatusCounts?.["02"] || 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-red-500 text-red-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Rejected Achievers</h2>
            <p className="text-2xl font-bold">
              {paginationInfo.totalStatusCounts?.["03"] || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="w-full md:w-auto">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Search achievers..."
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="01">Verified</SelectItem>
              <SelectItem value="02">Pending</SelectItem>
              <SelectItem value="03">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {Object.keys(visibleColumns).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  checked={visibleColumns[column]}
                  onCheckedChange={() => handleColumnToggle(column)}
                  className="capitalize"
                >
                  {column}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={refreshData}>
            Refresh
          </Button>
        </div>
      </div>

      {!isLoading && mappedAchievers.length > 0 ? (
        viewMode === "table" ? (
          <DataTable
            data={mappedAchievers}
            columns={tableColumns}
            onRowClick={(achiever) => {
              setSelectedAchiever(achiever)
              setViewDialogOpen(true)
            }}
            isLoading={isLoading}
          />
        ) : (
          <DataList
            data={mappedAchievers}
            fields={listFields}
            onItemClick={(achiever) => {
              setSelectedAchiever(achiever)
              setViewDialogOpen(true)
            }}
            isLoading={isLoading}
          />
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isLoading ? "Loading..." : "No achievers found"}
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <PaginationControls
          paginationInfo={paginationInfo}
          onPageChange={goToPage}
        />
        <DataViewToggle
          viewMode={viewMode}
          onToggle={(mode) => setViewMode(mode)}
        />
      </div>

      {/* View Achiever Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Achiever Details</DialogTitle>
          </DialogHeader>

          {selectedAchiever && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                    <p className="text-foreground">{selectedAchiever.HCJ_AC_Achievers_Name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">College</h4>
                    <p className="text-foreground">{selectedAchiever.HCJ_AC_College_Name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Event</h4>
                    <p className="text-foreground">{selectedAchiever.HCJ_AC_Achievers_Event_Name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Event Date</h4>
                    <p className="text-foreground">{formatDate(selectedAchiever.HCJ_AC_Achievers_Event_Dt)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <p className="text-foreground">{getStatusBadge(selectedAchiever.HCJ_AC_Status)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Publish Date</h4>
                    <p className="text-foreground">{formatDate(selectedAchiever.HCJ_AC_Publish_Dt)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Event Description</h4>
                  <p className="text-foreground">{selectedAchiever.HCJ_AC_Achievers_Event_Description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Award Description</h4>
                  <p className="text-foreground">{selectedAchiever.HCJ_AC_Achievers_Award_Description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Detailed Award Description</h4>
                  <p className="text-foreground">{selectedAchiever.HCJ_AC_Achievers_Award_Detail_Description}</p>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4 mt-4">
                <div className="flex flex-col items-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Award Image</h4>
                  {selectedAchiever.HCJ_AC_Achievers_Award_Img ? (
                    <div className="relative w-full h-[300px] rounded-md overflow-hidden">
                      <img
                        src={selectedAchiever.HCJ_AC_Achievers_Award_Img}
                        alt="Award image"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No award image available</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setViewDialogOpen(false)
                setVerifyDialogOpen(true)
              }}
            >
              {selectedAchiever?.HCJ_AC_Status === "01" ? "Change Status" : "Verify Achiever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Achiever Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAchiever?.HCJ_AC_Status === "01" ? "Update Achiever Status" : "Verify Achiever"}
            </DialogTitle>
            <DialogDescription>
              {selectedAchiever?.HCJ_AC_Status === "01"
                ? "This achiever is currently verified. Do you want to change their status?"
                : "Are you sure you want to verify this achiever?"}
            </DialogDescription>
          </DialogHeader>

          {selectedAchiever && (
            <div className="py-4">
              <h3 className="font-medium">{selectedAchiever.HCJ_AC_Achievers_Name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedAchiever.HCJ_AC_College_Name} • {selectedAchiever.HCJ_AC_Achievers_Event_Name}
              </p>
              <div className="mt-2">Current status: {getStatusBadge(selectedAchiever.HCJ_AC_Status)}</div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setVerifyDialogOpen(false)} disabled={verificationLoading}>
              Cancel
            </Button>

            {selectedAchiever?.HCJ_AC_Status === "01" ? (
              <Button variant="destructive" onClick={() => handleVerifyAchiever("02")} disabled={verificationLoading}>
                {verificationLoading ? "Processing..." : "Mark as Pending"}
              </Button>
            ) : selectedAchiever?.HCJ_AC_Status === "02" ? (
              <div className="flex gap-2">
                <Button variant="destructive" onClick={() => handleVerifyAchiever("03")} disabled={verificationLoading}>
                  {verificationLoading ? "Processing..." : "Reject"}
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleVerifyAchiever("01")}
                  disabled={verificationLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {verificationLoading ? "Processing..." : "Verify"}
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                onClick={() => handleVerifyAchiever("01")}
                disabled={verificationLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {verificationLoading ? "Processing..." : "Mark as Verified"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}