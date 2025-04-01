'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { SearchInput } from '@/components/ui/search-input';
import { usePagination } from '@/hooks/use-pagination';
import { toast } from '@/hooks/use-toast';
import { FileIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BiError } from 'react-icons/bi';
import { IoMdCloseCircle } from 'react-icons/io';
import {
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5';
import { MdErrorOutline } from 'react-icons/md';

import { DeleteConfirmation } from '../components/users/delete-confirmation';
import { MessageComposer } from '../components/users/message-composer';
import { UserFilters } from '../components/users/user-filters';
import { UserProfile } from '../components/users/user-profile';
import {
  formatDate,
  getUserType,
  getVerificationBadgeColor,
  getVerificationStatus,
} from '../components/utils';

export default function UsersPage() {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToDeleteName, setUserToDeleteName] = useState('this user');
  const [filters, setFilters] = useState({
    userType: '',
    dateRegistered: '',
    verificationStatus: '',
  });

  const {
    items: usersData,
    paginationInfo,
    isLoading,
    error,
    searchText,
    setSearchText,
    goToPage,
    additionalFilters,
    setAdditionalFilters,
    refetch,
  } = usePagination(
    `/api/super-admin/v1/hcjArET61031FetchAllVerificationData`,
    {
      pageSize: 10,
      batchSize: 100,
    }
  );

  // Process the nested user data and filter out invalid entries
  const users = (usersData || []).filter(
    (userData) => userData && userData.user
  );

  useEffect(() => {
    setAdditionalFilters({
      userType: filters.userType,
      dateRegistered: filters.dateRegistered,
      verificationStatus: filters.verificationStatus,
    });
  }, [filters, setAdditionalFilters]);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(
        users.map((user) => user.user?.UT_User_Id).filter(Boolean)
      );
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  const handleOpenDelete = (userId, userName = 'this user') => {
    setUserToDelete(userId);
    setUserToDeleteName(userName);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(
        `/api/super-admin/v1/deleteUser?id=${userToDelete}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast({
        title: 'User Deleted',
        description: 'The user has been removed successfully.',
        variant: 'destructive',
      });

      // Close modals and refresh
      setIsDeleteOpen(false);
      setUserToDelete(null);
      setIsProfileOpen(false);

      // Remove from selected users if it was selected
      setSelectedUsers((prev) => prev.filter((id) => id !== userToDelete));

      // Refresh the data
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenMessage = () => {
    if (selectedUsers.length === 0) return;
    setIsMessageOpen(true);
  };

  const handleSendMessage = async (message) => {
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast({
        title: 'Message Sent',
        description: `Message sent to ${selectedUsers.length} user(s).`,
      });

      setIsMessageOpen(false);
      // Clear selections after sending
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateVerificationStatus = async (userId, status) => {
    try {
      const response = await fetch(
        `/api/super-admin/v1/hcjArET61032VerifyAllUsers`,
        {
          method: 'PATCH', //  Use PATCH
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            verificationStatus: status,
          }),
        }
      );

      //  Check if response has content before parsing JSON
      let result;
      if (response.status !== 204) {
        result = await response.json();
      }

      if (!response.ok) {
        throw new Error(
          result?.message || 'Failed to update verification status'
        );
      }

      toast({
        title: 'Status Updated',
        description: 'User verification status has been updated.',
      });

      //  Instead of fetchUsers(), use refetch() from usePagination
      if (typeof refetch === 'function') {
        refetch(); //  Refresh users list
      } else {
        console.warn('refetch is not available');
      }

      setIsProfileOpen(false);
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to update verification status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-5 bg-gray-100 h-full">
      {/* <h1 className="mb-3 text-2xl font-bold">Users</h1> */}
      <h3 className="mb-5 text-lg text-primary">
        All Users - Page {paginationInfo.currentPage} of{' '}
        {paginationInfo.totalPages}
      </h3>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by name, email, etc..."
            className="w-full sm:w-64"
          />

          <UserFilters filters={filters} setFilters={setFilters} />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            onClick={handleOpenMessage}
            disabled={selectedUsers.length === 0}
            className="bg-primary text-white py-2 px-4 rounded w-full md:w-auto">
            Send Message
          </Button>
        </div>
      </div>
      <div className="text-balance grid place-items-stretch items-stretch justify-items-center  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3  gap-2  mb-5 w-full">
        <div className="max-w-[300px] w-full">
          <article className="flex items-center gap-4 rounded-lg border border-gray-500/50   bg-white px-6">
            <span className=" rounded-lg bg-green-600 p-2 text-green-100 text-md">
              <IoCheckmarkCircleOutline />
            </span>
            <div>
              <p className="text-md font-semibold text-gray-900">
                Verified Users
              </p>
              <p className="text-xl text-gray-900 font-semibold">400</p>
            </div>
          </article>
        </div>
        <div className=" max-w-[300px] w-full">
          <article className="flex items-center gap-4 rounded-lg border border-gray-500/50 bg-white px-6">
            <span className="rounded-lg bg-orange-600 p-2 text-orange-100 text-md">
              <MdErrorOutline />
            </span>
            <div>
              <p className="text-md font-semibold text-gray-900">
                Pending Users
              </p>

              <p className="text-xl text-gray-900 font-semibold">100</p>
            </div>
          </article>
        </div>
        <div className=" max-w-[300px] w-full">
          <article className="flex items-center gap-4 rounded-lg border border-gray-500/50 bg-white px-6">
            <span className="rounded-lg bg-red-600 p-2 text-red-100 text-md">
              <IoMdCloseCircle />
            </span>
            <div>
              <p className="text-md font-semibold text-gray-900">
                Not Verified Users
              </p>

              <p className="text-xl text-gray-900 font-semibold">59</p>
            </div>
          </article>
        </div>
        {/* <div className=" max-w-[300px] w-full">
          <article className="flex items-center gap-4 rounded-lg border border-gray-500/50 bg-white px-6">
            <span className="rounded-lg bg-blue-600 p-2 text-blue-100 text-2xl">
              <IoInformationCircleOutline />
            </span>
            <div>
              <p className="text-md font-semibold text-gray-900">
                Required Information
              </p>

              <p className="text-xl text-gray-900 font-semibold">15</p>
            </div>
          </article>
        </div>
        <div className=" max-w-[300px] w-full">
          <article className="flex items-center gap-4 rounded-lg border border-gray-500/50 bg-white px-6">
            <span className="rounded-lg bg-gray-600 p-2 text-gray-100 text-2xl">
              <BiError />
            </span>
            <div>
              <p className="text-md font-semibold text-gray-900">
                Required Information
              </p>

              <p className="text-xl text-gray-900 font-semibold">15</p>
            </div>
          </article>
        </div> */}
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 py-8">Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No users found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse mb-5 text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4">
                    <Checkbox
                      checked={
                        selectedUsers.length === users.length &&
                        users.length > 0
                      }
                      onCheckedChange={handleSelectAllUsers}
                      aria-label="Select all users"
                    />
                  </th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date Registered on</th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4">Edit</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userData) => {
                  if (!userData || !userData.user) return null;

                  const user = userData.user;
                  const individualDetails = userData.individualDetails || {};
                  const individualAddress = userData.individualAddress || {};
                  const documents = userData.documents || {};

                  const verificationStatus = getVerificationStatus(user);
                  const badgeColor =
                    getVerificationBadgeColor(verificationStatus);
                  const userType = getUserType(user);

                  const fullName = `${individualDetails.ID_First_Name || ''} ${
                    individualDetails.ID_Last_Name || ''
                  }`;
                  const location = individualAddress.IAD_City || 'N/A';
                  const documentType = documents.IDD_Document1_Type || 'N/A';

                  return (
                    <tr
                      key={user.UT_User_Id}
                      className="hover:bg-gray-50 border-b">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedUsers.includes(user.UT_User_Id)}
                          onCheckedChange={() =>
                            handleSelectUser(user.UT_User_Id)
                          }
                          aria-label={`Select ${fullName}`}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {(fullName || 'U').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{fullName}</div>
                            <div className="text-xs text-muted-foreground">
                              {userType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{location}</td>
                      <td className="py-3 px-4">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        {documents.IDD_Individual1_Document ? (
                          <div className="flex items-center">
                            <FileIcon className="h-4 w-4 mr-1 text-red-500" />
                            <span>{documentType}.pdf format</span>
                          </div>
                        ) : (
                          <span>No documents</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={badgeColor}>
                          {verificationStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewUser(userData)}
                            className="h-8 w-8 text-blue-500">
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleOpenDelete(
                                user.UT_User_Id,
                                individualDetails.ID_First_Name || 'this user'
                              )
                            }
                            className="h-8 w-8 text-red-500">
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-8">
            <PaginationControls
              paginationInfo={paginationInfo}
              onPageChange={goToPage}
            />
          </div>
        </>
      )}

      {selectedUser && (
        <UserProfile
          userData={selectedUser}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onUpdateStatus={handleUpdateVerificationStatus}
          onDelete={() => {
            const userId = selectedUser.user?.UT_User_Id;
            const userName =
              selectedUser.individualDetails?.ID_First_Name || 'this user';
            if (userId) {
              handleOpenDelete(userId, userName);
            }
          }}
        />
      )}

      <MessageComposer
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        onSend={handleSendMessage}
        recipientCount={selectedUsers.length}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        userName={userToDeleteName}
      />
    </div>
  );
}
