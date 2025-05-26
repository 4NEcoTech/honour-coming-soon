'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
import { usePagination } from '@/hooks/use-pagination';
import TeamProfile from '@/app/[locale]/(institutn-dashboard)/components/team-profile';

export default function SuperAdminStaffPage() {
  const [activeTab, setActiveTab] = useState('invited');
  const [viewMode, setViewMode] = useState('table');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    institution: true,
    role: true,
    department: true,
    year: true,
    status: true,
  });

  const {
    items: staff,
    paginationInfo,
    isLoading,
    searchText,
    setSearchText,
    goToPage,
    setAdditionalFilters,
    refreshData,
  } = usePagination('/api/super-admin/v1/hcjArET61091FetchInvitedStaff', {
    pageSize: 10,
    batchSize: 100,
    searchDelay: 400,
    initialFilters: {
      status: 'invited',
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

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setIsPopupOpen(true);
  };

  const handleDelete = async (staffId) => {
    if (!staffId) {
      toast({
        title: 'Error',
        description: 'Staff ID is missing. Unable to delete.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/super-admin/v1/staff?id=${staffId}`,
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

      refreshData();
      setIsPopupOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete staff. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const mappedStaff = staff.map((person) => ({
    id: person._id,
    name: `${person.CCP_Contact_Person_First_Name} ${person.CCP_Contact_Person_Last_Name}`,
    role: getRoleName(person.CCP_Contact_Person_Role),
    department: person.CCP_Contact_Person_Department || 'N/A',
    joiningYear: person.CCP_Contact_Person_Joining_Year || 'N/A',
    institutionName: person.CCP_Institute_Name || 'N/A',
    status: person.CCP_Individual_Id ? 'Registered' : 'Invited',
    ...person,
  }));

  function getRoleName(roleCode) {
    switch(roleCode) {
      case '07': return 'Team Member';
      case '08': return 'Support Staff';
      case '09': return 'Administrator';
      default: return 'Unknown';
    }
  }

  const tableColumns = [
    { key: 'name', header: 'Name', isVisible: visibleColumns.name },
    { 
      key: 'institutionName', 
      header: 'Institution', 
      isVisible: visibleColumns.institution 
    },
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
      key: 'status',
      header: 'Status',
      isVisible: visibleColumns.status,
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
          }}
        >
          View
        </button>
      ),
    },
  ];

  const listFields = [
    { key: 'name', label: 'Name' },
    { key: 'institutionName', label: 'Institution' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'joiningYear', label: 'Joining Year' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Staff Members</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="invited">Invited Staff</TabsTrigger>
          <TabsTrigger value="registered">Registered Staff</TabsTrigger>
          <TabsTrigger value="all">All Staff</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border border-blue-500 text-blue-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Total Staff</h2>
            <p className="text-2xl font-bold">{paginationInfo.total || 0}</p>
          </CardContent>
        </Card>
        <Card className="border border-green-500 text-green-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Registered</h2>
            <p className="text-2xl font-bold">
              {activeTab === 'registered' ? paginationInfo.total || 0 : 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-orange-500 text-orange-500">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-1">Invited</h2>
            <p className="text-2xl font-bold">
              {activeTab === 'invited' ? paginationInfo.total || 0 : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="w-full md:w-auto">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by Name, Institution, or Department"
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
          <Button
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Export to Excel
          </Button>
        </div>
      </div>

      {!isLoading && mappedStaff.length > 0 ? (
        viewMode === 'table' ? (
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
          {isLoading ? 'Loading...' : `No ${activeTab} staff found`}
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

      {selectedStaff && (
        <TeamProfile
          staff={selectedStaff}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onDelete={handleDelete}
          isSuperAdmin={true}
        />
      )}
    </div>
  );
}