"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { DataList } from "@/components/data-list";
import { DataTable } from "@/components/data-table";
import { DataViewToggle } from "@/components/data-view-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { toast } from "@/hooks/use-toast";
import StudentDetailsPopup from "@/app/[locale]/(institutn-dashboard)/components/stdnt-prfl";

export default function SuperAdminStudentsPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("invited");
  const [viewMode, setViewMode] = useState("table");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    institution: true,
    specialization: true,
    program: true,
    year: true,
    status: true,
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
  } = usePagination("/api/super-admin/v1/hcjArET61081FetchInvitedStudent", {
    pageSize: 10,
    batchSize: 100,
    searchDelay: 400,
    initialFilters: {
      status: "invited",
    },
  });

  useEffect(() => {
    setAdditionalFilters({
      status: activeTab,
    });
  }, [activeTab, setAdditionalFilters]);

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
        title: "Error",
        description: "Student ID is missing. Unable to delete.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/super-admin/v1/students?id=${studentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete student");

      toast({
        title: "Student Deleted",
        description: "The student has been removed successfully.",
        variant: "destructive",
      });

      refreshData();
      setIsPopupOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    status: student.HCJ_ST_Individual_Id ? "Registered" : "Invited",
    ...student,
  }));

  const tableColumns = [
    { key: "name", header: "Name", isVisible: visibleColumns.name },
    {
      key: "institutionName",
      header: "Institution",
      isVisible: visibleColumns.institution,
    },
    {
      key: "branchSpecialization",
      header: "Specialization",
      isVisible: visibleColumns.specialization,
    },
    {
      key: "programName",
      header: "Program",
      isVisible: visibleColumns.program,
    },
    {
      key: "enrollmentYear",
      header: "Enrollment Year",
      isVisible: visibleColumns.year,
    },
    {
      key: "status",
      header: "Status",
      isVisible: visibleColumns.status,
    },
    {
      key: "actions",
      header: "View",
      render: (student) => (
        <button
          className="text-primary hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            handleViewStudent(student);
          }}
        >
          View
        </button>
      ),
    },
  ];

  const listFields = [
    { key: "name", label: "Name" },
    { key: "institutionName", label: "Institution" },
    { key: "branchSpecialization", label: "Specialization" },
    { key: "programName", label: "Program" },
    { key: "enrollmentYear", label: "Enrollment Year" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Students</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="invited">Invited Students</TabsTrigger>
          <TabsTrigger value="registered">Registered Students</TabsTrigger>
          <TabsTrigger value="all">All Students</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border border-blue-500 text-blue-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Total Students</h2>
            <p className="text-2xl font-bold">{paginationInfo.total || 0}</p>
          </CardContent>
        </Card>
        <Card className="border border-green-500 text-green-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Registered</h2>
            <p className="text-2xl font-bold">
              {activeTab === "registered" 
                ? paginationInfo.total || 0 
                : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-orange-500 text-orange-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Invited</h2>
            <p className="text-2xl font-bold">
              {activeTab === "invited" 
                ? paginationInfo.total || 0 
                : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="w-full md:w-auto">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by Name, Institution or Specialization"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-green-500 text-white hover:bg-green-600"
              >
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
                  className="capitalize"
                >
                  {column}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {!isLoading && mappedStudents.length > 0 ? (
        viewMode === "table" ? (
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
          {isLoading ? "Loading..." : `No ${activeTab} students found`}
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
          isSuperAdmin={true}
        />
      )}
    </div>
  );
}