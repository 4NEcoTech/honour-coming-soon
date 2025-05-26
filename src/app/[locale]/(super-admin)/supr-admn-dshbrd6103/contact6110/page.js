// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, ChevronLeft, ChevronRight } from "lucide-react";
// import Image from "next/image";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// export default function ContactDashboard() {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalSubmissions, setTotalSubmissions] = useState(0);
//   const [batchStartPage, setBatchStartPage] = useState(1);
//   const [batchEndPage, setBatchEndPage] = useState(1);

//   useEffect(() => {
//     fetchSubmissions(currentPage, searchTerm);
//   }, [currentPage, searchTerm]);

//   const fetchSubmissions = async (page, search) => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `/api/super-admin/v1/hcjArET60112FetchContact?page=${page}&search=${search}`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch submissions");
//       }
//       const data = await response.json();
//       setSubmissions(data.data);
//       setTotalPages(data.totalPages);
//       setTotalSubmissions(data.total);
//       setBatchStartPage(data.batchStartPage);
//       setBatchEndPage(data.batchEndPage);
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to load submissions");
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= batchStartPage && newPage <= batchEndPage) {
//       setCurrentPage(newPage);
//     } else {
//       fetchSubmissions(newPage, searchTerm);
//     }
//   };

//   return (
//     <Card className="w-full max-w-7xl mx-auto my-8 border-border bg-background dark:bg-gray-900">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-foreground dark:text-white">
//           Contact Submissions
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
//           <div className="relative w-full sm:w-64">
//             <Input
//               type="text"
//               placeholder="Search submissions..."
//               value={searchTerm}
//               onChange={handleSearch}
//               className="pl-10 bg-background dark:bg-gray-800 text-foreground dark:text-white border-input"
//             />
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-gray-400"
//               size={20}
//             />
//           </div>
//           <Button
//             className="bg-primary hover:bg-primary/90 text-primary-foreground dark:hover:bg-primary/80"
//             onClick={() => fetchSubmissions(currentPage, searchTerm)}
//           >
//             Refresh
//           </Button>
//         </div>

//         {loading ? (
//           <SkeletonTable />
//         ) : error ? (
//           <p className="text-center text-red-500 dark:text-red-400">{error}</p>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="border-border dark:border-gray-700">
//                     <TableHead className="text-muted-foreground dark:text-gray-400">
//                       Name
//                     </TableHead>
//                     <TableHead className="text-muted-foreground dark:text-gray-400">
//                       Email
//                     </TableHead>
//                     <TableHead className="text-muted-foreground dark:text-gray-400">
//                       Phone
//                     </TableHead>
//                     <TableHead className="text-muted-foreground dark:text-gray-400">
//                       Location
//                     </TableHead>
//                     <TableHead className="text-muted-foreground dark:text-gray-400">
//                       Date
//                     </TableHead>
//                     <TableHead className="text-muted-foreground dark:text-gray-400">
//                       Screenshot
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {submissions.map((submission) => (
//                     <TableRow
//                       key={submission._id}
//                       className="border-border dark:border-gray-700 hover:bg-muted/50 dark:hover:bg-gray-800/50"
//                     >
//                       <TableCell className="text-foreground dark:text-gray-200">
//                         {`${submission.firstName} ${submission.lastName}`}
//                       </TableCell>
//                       <TableCell className="text-foreground dark:text-gray-200">
//                         {submission.email}
//                       </TableCell>
//                       <TableCell className="text-foreground dark:text-gray-200">
//                         {submission.phoneNumber}
//                       </TableCell>
//                       <TableCell className="text-foreground dark:text-gray-200">
//                         {`${submission.city}, ${submission.state}, ${submission.country}`}
//                       </TableCell>
//                       <TableCell className="text-foreground dark:text-gray-200">
//                         {new Date(submission.createdAt).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button
//                               variant="link"
//                               className="p-0 h-auto font-normal text-primary dark:text-blue-400 hover:text-primary/90 dark:hover:text-blue-300"
//                             >
//                               View Image
//                             </Button>
//                           </DialogTrigger>
//                           <VisuallyHidden>
//                             <DialogContent className="sm:max-w-[425px] bg-background dark:bg-gray-800 border-border">
//                               <Image
//                                 src={submission.logo || "/placeholder.svg"}
//                                 alt="Uploaded image"
//                                 width={400}
//                                 height={400}
//                                 className="w-full h-auto"
//                               />
//                             </DialogContent>
//                           </VisuallyHidden>
//                         </Dialog>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <div className="text-sm text-muted-foreground dark:text-gray-400">
//                 Showing {(currentPage - 1) * 10 + 1} to{" "}
//                 {Math.min(currentPage * 10, totalSubmissions)} of{" "}
//                 {totalSubmissions} entries
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
//                   <span className="sr-only">Previous Page</span>
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
//                   <span className="sr-only">Next Page</span>
//                 </Button>
//               </div>
//             </div>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// function SkeletonTable() {
//   return (
//     <div className="space-y-4">
//       {[...Array(5)].map((_, i) => (
//         <Skeleton key={i} className="h-12 w-full dark:bg-gray-700" />
//       ))}
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { DataList } from '@/components/data-list';
import { DataTable } from '@/components/data-table';
import { DataViewToggle } from '@/components/data-view-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { SearchInput } from '@/components/ui/search-input';
import { usePagination } from '@/hooks/use-pagination';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function ContactDashboard() {
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState('table');
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    phone: true,
    location: true,
    date: true,
  });

  const {
    items: submissions,
    paginationInfo,
    isLoading,
    searchText,
    setSearchText,
    goToPage,
    refreshData,
  } = usePagination('/api/super-admin/v1/hcjArET60112FetchContact', {
    pageSize: 10,
    batchSize: 100,
    searchDelay: 400,
  });

  const mappedSubmissions = submissions.map((submission) => ({
    id: submission._id,
    firstName: submission.firstName,
    lastName: submission.lastName,
    name: `${submission.firstName} ${submission.lastName}`,
    email: submission.email,
    phoneNumber: submission.phoneNumber,
    country: submission.country,
    state: submission.state,
    city: submission.city,
    pincode: submission.pincode,
    message: submission.message,
    logo: submission.logo,
    createdAt: submission.createdAt,
  }));

  const tableColumns = [
    { key: 'name', header: 'Name', isVisible: visibleColumns.name },
    { key: 'email', header: 'Email', isVisible: visibleColumns.email },
    { key: 'phoneNumber', header: 'Phone', isVisible: visibleColumns.phone },
    { 
      key: 'location', 
      header: 'Location',
      render: (sub) => `${sub.city}, ${sub.state}, ${sub.country}`,
      isVisible: visibleColumns.location 
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (sub) => new Date(sub.createdAt).toLocaleDateString(),
      isVisible: visibleColumns.date,
    },
    {
      key: 'logo',
      header: 'Screenshot',
      render: (sub) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-primary hover:text-primary/90">
              View Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Image
              src={sub.logo || "/placeholder.svg"}
              alt="Uploaded screenshot"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  const listFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'location', label: 'Location' },
    { key: 'createdAt', label: 'Date' },
  ];

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Submissions</h1>

      <div className="grid grid-cols-1 mb-6">
        <Card className="border border-blue-500 text-blue-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Total Submissions</h2>
            <p className="text-2xl font-bold">{paginationInfo.total || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="w-full md:w-auto">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by name, email, or location"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600">
                Customize Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Choose Columns</DropdownMenuLabel>
              {Object.keys(visibleColumns).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  checked={visibleColumns[column]}
                  onCheckedChange={() => handleColumnToggle(column)}
                  className="capitalize">
                  {column}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={refreshData}>
            Refresh
          </Button>
        </div>
      </div>

      {!isLoading && mappedSubmissions.length > 0 ? (
        viewMode === 'table' ? (
          <DataTable
            data={mappedSubmissions}
            columns={tableColumns}
            isLoading={isLoading}
          />
        ) : (
          <DataList
            data={mappedSubmissions}
            fields={listFields}
            isLoading={isLoading}
          />
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isLoading ? 'Loading...' : 'No contact submissions found'}
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
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full dark:bg-gray-700" />
      ))}
    </div>
  );
}