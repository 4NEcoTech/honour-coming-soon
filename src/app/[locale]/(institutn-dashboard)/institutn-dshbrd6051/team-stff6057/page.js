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
import { Link } from '@/i18n/routing';
import { PlusCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import RegisteredTeamPopup from '../../components/cmpltd-team-prfl';

export default function StaffPage() {
  const pathname = usePathname();
  const status = pathname.includes('invited') ? 'invited' : 'registered';
  // const institutionNum = '5001'; // Replace with dynamic value if needed

  const [staffList, setStaffList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const { data: session } = useSession();
  const companyId = session?.user?.companyId; // or whatever field you use
  // console.log(companyId);
  const { institutionData, loading, error } = useInstitution(companyId);

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    role: true,
    department: true,
    joiningYear: true,
    email: true,
  });

  useEffect(() => {
    if (!institutionData) return; // ⛔ Skip if institutionData not ready

    const controller = new AbortController();

    const fetchStaff = async () => {
      try {
        const res = await fetch(
          `/api/institution/v1/hcjBrET60671FetchInvitedAdminTeam?status=${status}&CCP_Institute_Num=${institutionData?.CD_Company_Num}`,
          { signal: controller.signal }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to fetch staff');
        }

        const mapped = data?.data?.map((staff, index) => ({
          id: staff._id,
          name: `${staff.CCP_Contact_Person_First_Name} ${staff.CCP_Contact_Person_Last_Name}`,
          role:
            staff.CCP_Contact_Person_Role === '07'
              ? 'Team Member'
              : staff.CCP_Contact_Person_Role === '08'
              ? 'Support Staff'
              : 'Unknown',
          department: staff.CCP_Contact_Person_Department || 'N/A',
          joiningYear: staff.CCP_Contact_Person_Joining_Year || '-',
          email: staff.CCP_Contact_Person_Email,
        }));

        setStaffList(mapped || []);

        setPaginationInfo({
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalItems: data.total || 0,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('❌ Failed to fetch staff:', error);
        }
      }
    };

    fetchStaff();

    return () => controller.abort(); // ✅ Cleanup on unmount or change
  }, [status, institutionData]); // 👈 Both `status` & `institutionData` as dependencies

  const filteredStaff = searchText.trim()
    ? staffList.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchText.toLowerCase()) ||
          staff.role.toLowerCase().includes(searchText.toLowerCase()) ||
          staff.department.toLowerCase().includes(searchText.toLowerCase())
      )
    : staffList;

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    console.log('View staff:', staff);
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
      isVisible: visibleColumns.joiningYear,
    },
    { key: 'email', header: 'Email', isVisible: visibleColumns.email },
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
    { key: 'email', label: 'Email' },
  ];

  const goToPage = (page) => {
    console.log('Navigate to page:', page);
    // Implement real pagination if backend supports page param
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {status === 'invited' ? 'Invited Staff' : 'Registered Staff'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-blue-500 text-white">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Registered Staff</h2>
            <p className="text-2xl font-bold">
              {status === 'registered' ? paginationInfo.totalItems : '-'}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-blue-500 text-blue-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Invited Staff</h2>
            <p className="text-2xl font-bold">
              {status === 'invited' ? paginationInfo.totalItems : '-'}
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

          <Link href="/institutn-dshbrd6051/add-stff-membr6058">
            <Button className="bg-primary text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Staff Member
            </Button>
          </Link>
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
          No staff members found
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
