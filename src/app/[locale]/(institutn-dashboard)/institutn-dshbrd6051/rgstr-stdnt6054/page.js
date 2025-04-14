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
import useInstitution from '@/hooks/useInstitution';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import RegisteredStudentPopup from '../../components/cmpltd-student-Profile';

export default function StudentsPage() {
  const pathname = usePathname();
  const status = pathname.includes('invited') ? 'invited' : 'registered';

  const [students, setStudents] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    specialization: true,
    program: true,
    year: true,
  });

  const [searchText, setSearchText] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const { data: session } = useSession();
  const companyId = session?.user?.companyId; // or whatever field you use
  // console.log(companyId);
  const { institutionData, loading, error } = useInstitution(companyId);

  // useEffect(() => {

  // }, [institutionData]);

  // Fetch students from API
  useEffect(() => {
    if (!institutionData) return; // Don't fetch if not ready

    const controller = new AbortController();

    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `/api/institution/v1/hcjBrET60661FetchInvitedStudent?status=${status}&HCJ_ST_InstituteNum=${institutionData?.CD_Company_Num}`,
          { signal: controller.signal }
        );

        const data = await res.json();

        const mapped = data?.data?.map((student, index) => ({
          id: index + 1,
          name: `${student.HCJ_ST_Student_First_Name} ${student.HCJ_ST_Student_Last_Name}`,
          branchSpecialization: student.HCJ_ST_Student_Branch_Specialization,
          programName: student.HCJ_ST_Student_Program_Name,
          enrollmentYear: student.HCJ_ST_Enrollment_Year,
        }));

        setStudents(mapped || []);
        setPaginationInfo({
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalItems: data.total || 0,
          pageSize: 10,
          hasNextPage: data.currentPage < data.totalPages,
          hasPreviousPage: data.currentPage > 1,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch students:', error);
        }
      }
    };

    fetchStudents();

    return () => controller.abort(); //  Cleanup fetch on unmount or deps change
  }, [status, institutionData]);

  // Filter by search
  const filteredStudents = searchText.trim()
    ? students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchText.toLowerCase()) ||
          student.branchSpecialization
            .toLowerCase()
            .includes(searchText.toLowerCase())
      )
    : students;

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    console.log('View student:', student);
  };

  const goToPage = (page) => {
    console.log('Navigate to page:', page);
    // To be implemented with real pagination
  };

  const tableColumns = [
    { key: 'name', header: 'Name', isVisible: visibleColumns.name },
    {
      key: 'branchSpecialization',
      header: 'Branch/Specialization',
      isVisible: visibleColumns.specialization,
    },
    {
      key: 'enrollmentYear',
      header: 'Program Enrolled Year',
      isVisible: visibleColumns.year,
    },
    {
      key: 'programName',
      header: 'Program Name',
      isVisible: visibleColumns.program,
    },
    {
      key: 'actions',
      header: 'View & Edit',
      render: (student) => (
        <button
          className="text-primary hover:underline px-4 py-1 rounded"
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
      <h1 className="text-2xl font-bold mb-4">
        {status === 'invited' ? 'Invited Students' : 'Registered Students'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-blue-500 text-white">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Registered Students</h2>
            <p className="text-2xl font-bold">
              {status === 'registered' ? paginationInfo.totalItems : '-'}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-blue-500 text-blue-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Invited Students</h2>
            <p className="text-2xl font-bold">
              {status === 'invited' ? paginationInfo.totalItems : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="w-full md:w-auto">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Name, Specialization"
            className="w-full"
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
                  className="capitalize"
                  checked={visibleColumns[column]}
                  onCheckedChange={() => handleColumnToggle(column)}>
                  {column.charAt(0).toUpperCase() + column.slice(1)}
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

      {filteredStudents.length > 0 ? (
        viewMode === 'table' ? (
          <DataTable
            data={filteredStudents}
            columns={tableColumns}
            onRowClick={handleViewStudent}
            isLoading={false}
          />
        ) : (
          <DataList
            data={filteredStudents}
            fields={listFields}
            onItemClick={handleViewStudent}
            isLoading={false}
          />
        )
      ) : (
        <div className="text-center py-8 text-gray-500">No students found</div>
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
        <RegisteredStudentPopup
          student={selectedStudent}
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
