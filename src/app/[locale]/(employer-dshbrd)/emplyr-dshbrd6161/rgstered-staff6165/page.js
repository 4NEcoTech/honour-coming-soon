"use client";

import { Link } from "@/i18n/routing";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAbility } from "@/Casl/CaslContext";
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
import { usePagination } from "@/hooks/use-pagination";
import useInstitution from "@/hooks/useInstitution";
import RegisteredTeamPopup from "../../components/cmpltd-team-prfl";

export default function Page() {
  const pathname = usePathname();
  const status = pathname.includes("invited") ? "invited" : "registered";
  const ability = useAbility();

  const [viewMode, setViewMode] = useState("table");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    role: true,
    department: true,
    joiningYear: true,
    email: true,
  });

  const { data: session } = useSession();
  const companyId = session?.user?.companyId;
  const { institutionData, loading: institutionLoading } =
    useInstitution(companyId);

  const {
    items: staff,
    paginationInfo,
    isLoading,
    searchText,
    setSearchText,
    goToPage,
    setAdditionalFilters,
    refreshData,
  } = usePagination("/api/institution/v1/hcjBrET60671FetchInvitedAdminTeam", {
    pageSize: 10,
    batchSize: 100,
    searchDelay: 400,
    initialFilters: {
      status: status,
    },
  });

  useEffect(() => {
    if (institutionData?.CD_Company_Num) {
      setAdditionalFilters({
        CCP_Institute_Num: institutionData.CD_Company_Num,
        status: 'registered',
      });
    }
  }, [institutionData, setAdditionalFilters]);

  // Map the staff data to match the expected format
  const mappedStaff = staff.map((staffMember) => ({
    id: staffMember._id,
    name: `${staffMember.CCP_Contact_Person_First_Name} ${staffMember.CCP_Contact_Person_Last_Name}`,
    role:
      staffMember.CCP_Contact_Person_Role === "10"
        ? "Team Member"
        : staffMember.CCP_Contact_Person_Role === "11"
        ? "Support Staff"
        : "Unknown",
    department: staffMember.CCP_Contact_Person_Department || "N/A",
    joiningYear: staffMember.CCP_Contact_Person_Joining_Year || "-",
    email: staffMember.CCP_Contact_Person_Email,
    ...staffMember, // Include all raw data
  }));

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
  };

  const tableColumns = [
    { key: "name", header: "Name", isVisible: visibleColumns.name },
    { key: "role", header: "Role", isVisible: visibleColumns.role },
    {
      key: "department",
      header: "Department",
      isVisible: visibleColumns.department,
    },
    {
      key: "joiningYear",
      header: "Joining Year",
      isVisible: visibleColumns.joiningYear,
    },
    { key: "email", header: "Email", isVisible: visibleColumns.email },
    {
      key: "actions",
      header: "View",
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
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "department", label: "Department" },
    { key: "email", label: "Email" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {status === "invited" ? "Invited Staff" : "Registered Staff"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-blue-500 text-white">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Registered Staff</h2>
            <p className="text-2xl font-bold">
              {status === "registered" ? paginationInfo.total || 0 : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-blue-500 mb-6">Institution Representatives</h2>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="w-full md:w-auto">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by name, role, department..."
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Customize Columns</Button>
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
          {ability.can("create", "Staff") ? (
            <Link href="/institutn-dshbrd6051/add-stff-membr6058">
              <Button className="bg-primary text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Staff Member
              </Button>
            </Link>
          ) : (
            <Button
              className="bg-primary text-white cursor-not-allowed"
              disabled
              type="button">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Staff Member
            </Button>
          )}
        </div>
      </div>

      {!isLoading && mappedStaff.length > 0 ? (
        viewMode === "table" ? (
          <DataTable
            data={mappedStaff}
            columns={tableColumns}
            onRowClick={handleViewStaff}
            isLoading={isLoading}
          />
        ) : (
          <DataList
            data={mappedStaff}
            fields={listFields}
            onItemClick={handleViewStaff}
            isLoading={isLoading}
          />
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isLoading ? "Loading..." : "No staff members found"}
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

      <RegisteredTeamPopup
        staff={selectedStaff}
        isOpen={Boolean(selectedStaff)}
        onClose={() => setSelectedStaff(null)}
      />
    </div>
  );
}