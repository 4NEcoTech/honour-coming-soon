// 'use client';

// import { DataList } from '@/components/data-list';
// import { DataTable } from '@/components/data-table';
// import { DataViewToggle } from '@/components/data-view-toggle';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { PaginationControls } from '@/components/ui/pagination-controls';
// import { SearchInput } from '@/components/ui/search-input';
// import { usePathname } from 'next/navigation';
// import { useEffect, useState } from 'react';

// import { toast } from '@/hooks/use-toast';
// import useInstitution from '@/hooks/useInstitution';
// import { useSession } from 'next-auth/react';
// import StudentDetailsPopup from '../../components/stdnt-prfl';

// export default function InvitedStudentsPage() {
//   const pathname = usePathname();
//   const isInvited = pathname.includes('invited');
//   // const institutionNum = "1001"; // Use dynamic if needed

//   const { data: session } = useSession();
//   const companyId = session?.user?.companyId; // or whatever field you use

//   const { institutionData, loading, error } = useInstitution(companyId);

//   const [students, setStudents] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [viewMode, setViewMode] = useState('table');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   const [paginationInfo, setPaginationInfo] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//   });

//   const [visibleColumns, setVisibleColumns] = useState({
//     name: true,
//     specialization: true,
//     program: true,
//     year: true,
//   });

//   useEffect(() => {
//     if (!institutionData) return; // ❌ Skip fetch if no institution num

//     const controller = new AbortController();

//     const fetchStudents = async () => {
//       try {
//         const res = await fetch(
//           `/api/institution/v1/hcjBrET60661FetchInvitedStudent?status=invited&HCJ_ST_InstituteNum=${institutionData?.CD_Company_Num}`,
//           { signal: controller.signal }
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data?.error || 'Failed to fetch students');
//         }

//         const mapped = data?.data?.map((student) => ({
//           id: student._id,
//           firstName: student.HCJ_ST_Student_First_Name,
//           lastName: student.HCJ_ST_Student_Last_Name,
//           name: `${student.HCJ_ST_Student_First_Name} ${student.HCJ_ST_Student_Last_Name}`,
//           email: student.HCJ_ST_Educational_Email,
//           phone: student.HCJ_ST_Phone_Number,
//           gender: student.HCJ_ST_Gender,
//           dob: student.HCJ_ST_DOB,
//           institutionName: student.HCJ_ST_Institution_Name,
//           institutionNumber: student.HCJ_ST_InstituteNum,
//           country: student.HCJ_ST_Student_Country,
//           state: student.HCJ_ST_Student_State,
//           city: student.HCJ_ST_Student_City,
//           pincode: student.HCJ_ST_Student_Pincode,
//           programName: student.HCJ_ST_Student_Program_Name,
//           branchSpecialization: student.HCJ_ST_Student_Branch_Specialization,
//           enrollmentYear: student.HCJ_ST_Enrollment_Year,
//           gradeScore: student.HCJ_ST_Score_Grade_Type,
//           gradeValue: student.HCJ_ST_Score_Grade,
//           documentType: student.HCJ_ST_Student_Document_Type,
//           documentNumber: student.HCJ_ST_Student_Document_Number,
//           ...student, // 🧠 raw data if needed
//         }));

//         setStudents(mapped || []);

//         setPaginationInfo({
//           currentPage: data.currentPage || 1,
//           totalPages: data.totalPages || 1,
//           totalItems: data.total || 0,
//         });
//       } catch (error) {
//         if (error.name !== 'AbortError') {
//           console.error('❌ Error fetching invited students:', error);
//         }
//       }
//     };

//     fetchStudents();

//     return () => controller.abort(); // ✅ cancel request on unmount/change
//   }, [institutionData]); // 👈 run when institutionNum changes

//   const filteredStudents = searchText.trim()
//     ? students.filter(
//         (student) =>
//           student.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//           student.branchSpecialization
//             ?.toLowerCase()
//             .includes(searchText.toLowerCase())
//       )
//     : students;

//   const handleColumnToggle = (column) => {
//     setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
//   };

//   const handleViewStudent = (student) => {
//     setSelectedStudent(student);
//     setIsPopupOpen(true);
//   };

//   const handleDelete = async (studentId) => {
//     if (!studentId) {
//       toast({
//         title: 'Error',
//         description: 'Student ID is missing. Unable to delete.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       const response = await fetch(
//         `/api/institution/v1/hcjBrBT60552ManageStudents?id=${studentId}`,
//         {
//           method: 'DELETE',
//         }
//       );

//       if (!response.ok) throw new Error('Failed to delete student');

//       toast({
//         title: 'Student Deleted',
//         description: 'The student has been removed successfully.',
//         variant: 'destructive',
//       });

//       setStudents((prev) => prev.filter((student) => student.id !== studentId));
//       setIsPopupOpen(false);
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to delete student. Please try again.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const tableColumns = [
//     { key: 'name', header: 'Name', isVisible: visibleColumns.name },
//     {
//       key: 'branchSpecialization',
//       header: 'Specialization',
//       isVisible: visibleColumns.specialization,
//     },
//     {
//       key: 'programName',
//       header: 'Program',
//       isVisible: visibleColumns.program,
//     },
//     {
//       key: 'enrollmentYear',
//       header: 'Enrollment Year',
//       isVisible: visibleColumns.year,
//     },
//     {
//       key: 'actions',
//       header: 'View',
//       render: (student) => (
//         <button
//           className="text-primary hover:underline"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleViewStudent(student);
//           }}>
//           View
//         </button>
//       ),
//     },
//   ];

//   const listFields = [
//     { key: 'name', label: 'Name' },
//     { key: 'branchSpecialization', label: 'Specialization' },
//     { key: 'programName', label: 'Program' },
//     { key: 'enrollmentYear', label: 'Enrollment Year' },
//   ];

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Invited Students</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <Card className="border border-blue-500 text-blue-500">
//           <CardContent className="p-4">
//             <h2 className="text-sm font-medium mb-1">Invited Students</h2>
//             <p className="text-2xl font-bold">{paginationInfo.totalItems}</p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//         <div className="w-full md:w-auto">
//           <SearchInput
//             value={searchText}
//             onChange={setSearchText}
//             placeholder="Search by Name or Specialization"
//           />
//         </div>

//         <div className="flex gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="outline"
//                 className="bg-green-500 text-white hover:bg-green-600">
//                 Customize Columns
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Choose Columns</DropdownMenuLabel>
//               {Object.keys(visibleColumns).map((column) => (
//                 <DropdownMenuCheckboxItem
//                   key={column}
//                   checked={visibleColumns[column]}
//                   onCheckedChange={() => handleColumnToggle(column)}
//                   className="capitalize">
//                   {column}
//                 </DropdownMenuCheckboxItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <Button
//             variant="outline"
//             className="bg-blue-500 text-white hover:bg-blue-600">
//             Export to Excel
//           </Button>
//         </div>
//       </div>

//       {filteredStudents.length > 0 ? (
//         viewMode === 'table' ? (
//           <DataTable
//             data={filteredStudents}
//             columns={tableColumns}
//             onRowClick={handleViewStudent}
//             isLoading={false}
//           />
//         ) : (
//           <DataList
//             data={filteredStudents}
//             fields={listFields}
//             onItemClick={handleViewStudent}
//             isLoading={false}
//           />
//         )
//       ) : (
//         <div className="text-center py-8 text-gray-500">
//           No invited students found
//         </div>
//       )}

//       <div className="flex justify-between items-center mt-8">
//         <PaginationControls
//           paginationInfo={paginationInfo}
//           onPageChange={() => {}}
//         />
//         <DataViewToggle
//           viewMode={viewMode}
//           onToggle={(mode) => setViewMode(mode)}
//         />
//       </div>

//       {selectedStudent && (
//         <StudentDetailsPopup
//           student={selectedStudent}
//           isOpen={isPopupOpen}
//           onClose={() => setIsPopupOpen(false)}
//           onDelete={handleDelete}
//         />
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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
import StudentDetailsPopup from '../../components/stdnt-prfl';

import useInstitution from '@/hooks/useInstitution';
import { toast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/use-pagination';

export default function Page() {
  const pathname = usePathname();
  const isInvited = pathname.includes('invited');

  const { data: session } = useSession();
  const companyId = session?.user?.companyId;
  const { institutionData, loading: institutionLoading } = useInstitution(companyId);

  const [viewMode, setViewMode] = useState('table');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    specialization: true,
    program: true,
    year: true,
  });

  const {
    items: students,
    paginationInfo,
    isLoading,
    searchText,
    setSearchText,
    goToPage,
    setAdditionalFilters,
    refreshData,
  } = usePagination('/api/institution/v1/hcjBrET60661FetchInvitedStudent', {
    pageSize: 10,
    batchSize: 100,
    searchDelay: 400,
    initialFilters: {
      status: 'invited',
    },
  });

  useEffect(() => {
    if (institutionData?.CD_Company_Num) {
      setAdditionalFilters({
        HCJ_ST_InstituteNum: institutionData.CD_Company_Num,
      });
    }
  }, [institutionData, setAdditionalFilters]);

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsPopupOpen(true);
  };

  const handleDelete = async (studentId) => {
    if (!studentId) {
      toast({
        title: 'Error',
        description: 'Student ID is missing. Unable to delete.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/institution/v1/hcjBrBT60552ManageStudents?id=${studentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete student');

      toast({
        title: 'Student Deleted',
        description: 'The student has been removed successfully.',
        variant: 'destructive',
      });

      refreshData(); // Refetch after delete
      setIsPopupOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete student. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Map the students data to match the expected format
  const mappedStudents = students.map((student) => ({
    id: student._id,
    firstName: student.HCJ_ST_Student_First_Name,
    lastName: student.HCJ_ST_Student_Last_Name,
    name: `${student.HCJ_ST_Student_First_Name} ${student.HCJ_ST_Student_Last_Name}`,
    email: student.HCJ_ST_Educational_Email,
    phone: student.HCJ_ST_Phone_Number,
    gender: student.HCJ_ST_Gender,
    dob: student.HCJ_ST_DOB,
    institutionName: student.HCJ_ST_Institution_Name,
    institutionNumber: student.HCJ_ST_InstituteNum,
    country: student.HCJ_ST_Student_Country,
    state: student.HCJ_ST_Student_State,
    city: student.HCJ_ST_Student_City,
    pincode: student.HCJ_ST_Student_Pincode,
    programName: student.HCJ_ST_Student_Program_Name,
    branchSpecialization: student.HCJ_ST_Student_Branch_Specialization,
    enrollmentYear: student.HCJ_ST_Enrollment_Year,
    gradeScore: student.HCJ_ST_Score_Grade_Type,
    gradeValue: student.HCJ_ST_Score_Grade,
    documentType: student.HCJ_ST_Student_Document_Type,
    documentNumber: student.HCJ_ST_Student_Document_Number,
    ...student,
  }));

  const tableColumns = [
    { key: 'name', header: 'Name', isVisible: visibleColumns.name },
    {
      key: 'branchSpecialization',
      header: 'Specialization',
      isVisible: visibleColumns.specialization,
    },
    {
      key: 'programName',
      header: 'Program',
      isVisible: visibleColumns.program,
    },
    {
      key: 'enrollmentYear',
      header: 'Enrollment Year',
      isVisible: visibleColumns.year,
    },
    {
      key: 'actions',
      header: 'View',
      render: (student) => (
        <button
          className="text-primary hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            handleViewStudent(student);
          }}>
          View
        </button>
      ),
    },
  ];

  const listFields = [
    { key: 'name', label: 'Name' },
    { key: 'branchSpecialization', label: 'Specialization' },
    { key: 'programName', label: 'Program' },
    { key: 'enrollmentYear', label: 'Enrollment Year' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invited Students</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border border-blue-500 text-blue-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Invited Students</h2>
            <p className="text-2xl font-bold">{paginationInfo.total || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="w-full md:w-auto">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by Name or Specialization"
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

      {!isLoading && mappedStudents.length > 0 ? (
        viewMode === 'table' ? (
          <DataTable
            data={mappedStudents}
            columns={tableColumns}
            onRowClick={handleViewStudent}
            isLoading={isLoading}
          />
        ) : (
          <DataList
            data={mappedStudents}
            fields={listFields}
            onItemClick={handleViewStudent}
            isLoading={isLoading}
          />
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isLoading ? 'Loading...' : 'No invited students found'}
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

      {selectedStudent && (
        <StudentDetailsPopup
          student={selectedStudent}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}