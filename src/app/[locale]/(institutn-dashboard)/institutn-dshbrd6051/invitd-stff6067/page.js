// "use client";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Link } from "@/i18n/routing";
// import TeamProfile from "../../components/team-profile";
// import { usePagination } from "@/hooks/use-pagination";
// import { SearchInput } from "@/components/ui/search-input";
// import { PaginationControls } from "@/components/ui/pagination-controls";
// import { toast } from "@/hooks/use-toast";

// export default function Page() {
//   const [mappedStaffMembers, setMappedStaffMembers] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState(null);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const institutionName = "ccs";

//   const {
//     items: staffMembers,
//     paginationInfo,
//     isLoading,
//     error,
//     searchText,
//     setSearchText,
//     goToPage,
//     additionalFilters,
//     setAdditionalFilters,
//   } = usePagination(`/api/institution/v1/hcjBrET60671FetchInvitedAdminTeam`, {
//     pageSize: 10,
//     batchSize: 100,
//   });

//   useEffect(() => {
//     setAdditionalFilters({ CCP_Institute_Name: institutionName });
//   }, [institutionName, setAdditionalFilters]);

//   useEffect(() => {
//     if (staffMembers && staffMembers.length > 0) {
//       const transformedData = staffMembers.map((staff) => ({
//         id: staff._id,
//         firstName: staff.CCP_Contact_Person_First_Name,
//         lastName: staff.CCP_Contact_Person_Last_Name,
//         fullName: `${staff.CCP_Contact_Person_First_Name} ${staff.CCP_Contact_Person_Last_Name}`,
//         role:
//           staff.CCP_Contact_Person_Role === "07"
//             ? "Team Member"
//             : staff.CCP_Contact_Person_Role === "08"
//             ? "Support Staff"
//             : "Unknown Role",
//         email: staff.CCP_Contact_Person_Email,
//         phone: staff.CCP_Contact_Person_Phone,
//         designation: staff.CCP_Contact_Person_Designation || "Not Provided",
//         department: staff.CCP_Contact_Person_Department || "Not Provided",
//         joiningYear: staff.CCP_Contact_Person_Joining_Year || "N/A",
//         country: staff.CCP_Contact_Person_Country,
//         state: staff.CCP_Contact_Person_State,
//         city: staff.CCP_Contact_Person_City,
//         address: staff.CCP_Contact_Person_Address_Line1,
//         pincode: staff.CCP_Contact_Person_Pincode,
//         createdAt: staff.createdAt,
//         ...staff,
//       }));

//       setMappedStaffMembers(transformedData);
//     } else {
//       setMappedStaffMembers([]);
//     }
//   }, [staffMembers]);

//   const handleViewStaff = (staff) => {
//     setSelectedStaff(staff);
//     setIsProfileOpen(true);
//   };

//   // const handleDelete = async (staffId) => {
//   //   try {
//   //     const response = await fetch(`/api/institution/v1/hcjBrBT60582ManageStaff?id=${staffId}`, {
//   //       method: "DELETE",
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error("Failed to delete staff member");
//   //     }

//   //     alert("Staff deleted successfully!");

//   //     // Refresh staff list after deletion
//   //     setMappedStaffMembers(mappedStaffMembers.filter((staff) => staff.id !== staffId));

//   //     setIsProfileOpen(false); // Close popup after deletion
//   //   } catch (error) {
//   //     console.error("Delete failed:", error);
//   //     alert("Error deleting staff member. Please try again.");
//   //   }
//   // };

//   const handleDelete = async (staffId) => {
//     try {
//       const response = await fetch(
//         `/api/institution/v1/hcjBrBT60582ManageStaff?id=${staffId}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete staff member");
//       }

//       toast({
//         title: "Staff Deleted",
//         description: "The staff member has been removed successfully.",
//         variant: "destructive",
//       });

//       setMappedStaffMembers((prev) =>
//         prev.filter((staff) => staff.id !== staffId)
//       );
//       setIsProfileOpen(false);
//     } catch (error) {
//       console.error("Delete failed:", error);
//       toast({
//         title: "Error",
//         description: "Failed to delete staff member. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="p-5">
//       <h1 className="mb-3 text-2xl font-bold">Team</h1>
//       <h3 className="mb-5 text-lg text-primary">
//         Institution Representatives - Page {paginationInfo.currentPage} of{" "}
//         {paginationInfo.totalPages}
//       </h3>

//       <div className="flex items-center justify-between mb-5">
//         <SearchInput
//           value={searchText}
//           onChange={setSearchText}
//           placeholder="Search by Name, Role, or Department"
//           className="w-64"
//         />

//         <Link href="/institutn-dshbrd6051/add-stff-membr6058">
//           <Button className="bg-primary text-white py-2 px-4 rounded">
//             Add Staff Member
//           </Button>
//         </Link>
//       </div>

//       {isLoading ? (
//         <p className="text-center text-gray-500 py-8">
//           Loading staff members...
//         </p>
//       ) : error ? (
//         <p className="text-center text-red-500 py-8">{error}</p>
//       ) : mappedStaffMembers.length === 0 ? (
//         <p className="text-center text-gray-500 py-8">
//           No staff members found.
//         </p>
//       ) : (
//         <>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse mb-5 text-left">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="border-b py-3 px-4">Name</th>
//                   <th className="border-b py-3 px-4">Role</th>
//                   <th className="border-b py-3 px-4">Department</th>
//                   <th className="border-b py-3 px-4">Joining Year</th>
//                   <th className="border-b py-3 px-4">View & Edit</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {mappedStaffMembers.map((staff) => (
//                   <tr key={staff.id} className="hover:bg-gray-50">
//                     <td className="border-b py-3 px-4">
//                       {staff.firstName} {staff.lastName}
//                     </td>
//                     <td className="border-b py-3 px-4">{staff.role}</td>
//                     <td className="border-b py-3 px-4">{staff.department}</td>
//                     <td className="border-b py-3 px-4">{staff.joiningYear}</td>
//                     <td className="border-b py-3 px-4">
//                       <Button
//                         variant="outline"
//                         className="text-primary"
//                         onClick={() => handleViewStaff(staff)}
//                       >
//                         View
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/*  FIXED: Pagination Appears Below */}
//           <div className="flex justify-between items-center mt-8">
//             <PaginationControls
//               paginationInfo={paginationInfo}
//               onPageChange={goToPage}
//             />
//           </div>
//         </>
//       )}

//       <TeamProfile
//         staff={selectedStaff}
//         isOpen={isProfileOpen}
//         onClose={() => setIsProfileOpen(false)}
//         onDelete={handleDelete}
//       />
//     </div>
//   );
// }

'use client';

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
import { toast } from '@/hooks/use-toast';
import useInstitution from '@/hooks/useInstitution';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import TeamProfile from '../../components/team-profile'; // Adjust path if needed

export default function InvitedStaffPage() {
  const pathname = usePathname();
  const isInvited = pathname.includes('invited');
  // const institutionNum = '5001'; // Make dynamic if needed

  const { data: session } = useSession();
  const companyId = session?.user?.companyId; // or whatever field you use
  const { institutionData, loading, error } = useInstitution(companyId);

  const [staff, setStaff] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    role: true,
    department: true,
    year: true,
  });

  useEffect(() => {
    if (!institutionData) return; // ❌ Skip if institutionData is not ready

    const controller = new AbortController();

    const fetchStaff = async () => {
      try {
        const res = await fetch(
          `/api/institution/v1/hcjBrET60671FetchInvitedAdminTeam?status=invited&CCP_Institute_Num=${institutionData?.CD_Company_Num}`,
          { signal: controller.signal }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to fetch staff');
        }

        const mapped = data?.data?.map((person) => ({
          id: person._id,
          name: `${person.CCP_Contact_Person_First_Name} ${person.CCP_Contact_Person_Last_Name}`,
          role:
            person.CCP_Contact_Person_Role === '07'
              ? 'Team Member'
              : person.CCP_Contact_Person_Role === '08'
              ? 'Support Staff'
              : 'Unknown',
          department: person.CCP_Contact_Person_Department || 'N/A',
          joiningYear: person.CCP_Contact_Person_Joining_Year || 'N/A',
          ...person, // Full raw data
        }));

        setStaff(mapped || []);

        setPaginationInfo({
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalItems: data.total || 0,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('❌ Error fetching invited staff:', error);
        }
      }
    };

    fetchStaff();

    return () => controller.abort(); // ✅ Cancel request on unmount/change
  }, [institutionData]); // 👈 Trigger only when institutionData is available

  const filteredStaff = searchText.trim()
    ? staff.filter(
        (person) =>
          person.name.toLowerCase().includes(searchText.toLowerCase()) ||
          person.role.toLowerCase().includes(searchText.toLowerCase()) ||
          person.department.toLowerCase().includes(searchText.toLowerCase())
      )
    : staff;

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
  };

  const handleDelete = async (staffId) => {
    try {
      const response = await fetch(
        `/api/institution/v1/hcjBrBT60582ManageStaff?id=${staffId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete staff');

      toast({
        title: 'Staff Deleted',
        description: 'The staff member has been removed successfully.',
        variant: 'destructive',
      });

      setStaff((prev) => prev.filter((s) => s.id !== staffId));
      setSelectedStaff(null);
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete staff. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const tableColumns = [
    { key: 'name', header: 'Name', isVisible: visibleColumns.name },
    { key: 'role', header: 'Role', isVisible: visibleColumns.role },
    {
      key: 'department',
      header: 'Department',
      isVisible: visibleColumns.department,
    },
    {
      key: 'joiningYear',
      header: 'Joining Year',
      isVisible: visibleColumns.year,
    },
    {
      key: 'actions',
      header: 'View',
      render: (staff) => (
        <button
          className="text-primary hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            handleViewStaff(staff);
          }}>
          View
        </button>
      ),
    },
  ];

  const listFields = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'joiningYear', label: 'Joining Year' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invited Staff</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border border-blue-500 text-blue-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Invited Staff</h2>
            <p className="text-2xl font-bold">{paginationInfo.totalItems}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="w-full md:w-auto">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by Name, Role, Department"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-green-500 text-white hover:bg-green-600">
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
            className="bg-blue-500 text-white hover:bg-blue-600">
            Export to Excel
          </Button>
        </div>
      </div>

      {filteredStaff.length > 0 ? (
        viewMode === 'table' ? (
          <DataTable
            data={filteredStaff}
            columns={tableColumns}
            onRowClick={handleViewStaff}
            isLoading={false}
          />
        ) : (
          <DataList
            data={filteredStaff}
            fields={listFields}
            onItemClick={handleViewStaff}
            isLoading={false}
          />
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          No invited staff found
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <PaginationControls
          paginationInfo={paginationInfo}
          onPageChange={() => {}}
        />
        <DataViewToggle
          viewMode={viewMode}
          onToggle={(mode) => setViewMode(mode)}
        />
      </div>

      {selectedStaff && (
        <TeamProfile
          staff={selectedStaff}
          isOpen={Boolean(selectedStaff)}
          onClose={() => setSelectedStaff(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
