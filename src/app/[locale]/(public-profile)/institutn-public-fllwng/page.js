'use client';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';
import { Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const userList = [
  {
    id: 1,
    name: 'Alice Smith',
    designation: 'UI Designer',
    location: 'New York',
    mutualFriends: 5,
    profileImage: '/image/institutnstudent/1.svg',
  },
  {
    id: 2,
    name: 'Bob Johnson',
    designation: 'Frontend Developer',
    location: 'San Francisco',
    mutualFriends: 3,
    profileImage: '/image/institutnstudent/2.svg',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    designation: 'Backend Developer',
    location: 'London',
    mutualFriends: 7,
    profileImage: '/image/institutnstudent/3.svg',
  },
  {
    id: 4,
    name: 'Diana Davis',
    designation: 'Data Scientist',
    location: 'Paris',
    mutualFriends: 2,
    profileImage: '/image/institutnstudent/4.svg',
  },
  {
    id: 5,
    name: 'Eve Evans',
    designation: 'UX Researcher',
    location: 'Berlin',
    mutualFriends: 9,
    profileImage: '/image/institutnstudent/5.svg',
  },
  {
    id: 6,
    name: 'Frank Garcia',
    designation: 'Product Manager',
    location: 'Tokyo',
    mutualFriends: 4,
    profileImage: '/image/institutnstudent/6.svg',
  },
  {
    id: 7,
    name: 'Grace Hernandez',
    designation: 'Software Engineer',
    location: 'Sydney',
    mutualFriends: 6,
    profileImage: '/image/institutnstudent/7.svg',
  },
  {
    id: 8,
    name: 'Henry Jackson',
    designation: 'Mobile Developer',
    location: 'Toronto',
    mutualFriends: 1,
    profileImage: '/image/institutnstudent/8.svg',
  },
  {
    id: 9,
    name: 'Ivy King',
    designation: 'Web Developer',
    location: 'New York',
    mutualFriends: 8,
    profileImage: '/image/institutnstudent/9.svg',
  },
  {
    id: 10,
    name: 'Jack Lewis',
    designation: 'DevOps Engineer',
    location: 'San Francisco',
    mutualFriends: 3,
    profileImage: '/image/institutnstudent/10.svg',
  },
  {
    id: 11,
    name: 'Katie Miller',
    designation: 'UI/UX Designer',
    location: 'London',
    mutualFriends: 5,
    profileImage: '/image/institutnstudent/11.svg',
  },
  {
    id: 12,
    name: 'Liam Nelson',
    designation: 'Full Stack Developer',
    location: 'Paris',
    mutualFriends: 7,
    profileImage: '/image/institutnstudent/12.svg',
  },
  {
    id: 13,
    name: 'Mia Olsen',
    designation: 'Data Analyst',
    location: 'Berlin',
    mutualFriends: 2,
    profileImage: '/image/institutnstudent/13.svg',
  },
  {
    id: 14,
    name: 'Noah Parker',
    designation: 'Machine Learning Engineer',
    location: 'Tokyo',
    mutualFriends: 9,
    profileImage: '/image/institutnstudent/14.svg',
  },
  {
    id: 15,
    name: 'Olivia Quinn',
    designation: 'Cloud Engineer',
    location: 'Sydney',
    mutualFriends: 4,
    profileImage: '/image/institutnstudent/15.svg',
  },
  {
    id: 16,
    name: 'Peter Roberts',
    designation: 'Security Engineer',
    location: 'Toronto',
    mutualFriends: 6,
    profileImage: '/image/institutnstudent/16.svg',
  },
  {
    id: 17,
    name: 'Quinn Smith',
    designation: 'Game Developer',
    location: 'New York',
    mutualFriends: 1,
    profileImage: '/image/institutnstudent/17.svg',
  },
  {
    id: 18,
    name: 'Ryan Thomas',
    designation: 'Blockchain Developer',
    location: 'San Francisco',
    mutualFriends: 8,
    profileImage: '/image/institutnstudent/18.svg',
  },
  {
    id: 19,
    name: 'Sophia Williams',
    designation: 'AR/VR Developer',
    location: 'London',
    mutualFriends: 3,
    profileImage: '/image/institutnstudent/19.svg',
  },
  {
    id: 20,
    name: 'Tina White',
    designation: 'AI Researcher',
    location: 'Oslo',
    mutualFriends: 1,
    profileImage: '/image/institutnstudent/20.svg',
  },
];

function UserList({ users }) {
  return (
    <div className="p-6">
      <div className="grid gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="flex items-start gap-3 w-full sm:w-auto">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={user.profileImage || '/placeholder.svg'}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-base dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  {user.designation}
                </p>
                <div className="flex flex-col text-sm text-muted-foreground dark:text-gray-400 mt-1">
                  <span>{user.location}</span>
                  <span className="flex items-center gap-1">
                    • <Users className="h-3 w-3" /> {user.mutualFriends} mutual
                  </span>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="hcj"
              className="w-full sm:w-24 bg-primary text-white mt-2 sm:mt-0 dark:bg-blue-600 dark:hover:bg-blue-700">
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center p-6 mt-10">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={currentPage === index + 1}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(index + 1);
                }}
                className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default function ProfilePage() {
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(userList.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Cover Image */}
      <div className="relative h-[200px] md:h-[300px] w-full">
        <Image
          src="/image/profile/administration/cover.jpg?height=300&width=1200"
          alt="Cover"
          className="object-cover"
          fill
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Profile Section */}
        <div className="relative -mt-16 sm:-mt-24 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div className="flex flex-col items-start gap-4">
              <div className="relative">
                <Image
                  src="/image/institutndashboard/dashboard/dashboardlogo.svg"
                  alt="Profile"
                  width={180}
                  height={180}
                  className="rounded-lg border-4 border-background dark:border-gray-800"
                  priority
                />
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold dark:text-white">
                  IIT Delhi
                </h1>
                <div className="flex gap-4 text-sm">
                  <div className="flex">
                    <Image
                      src="/image/institutndashboard/dashpage/popup/follower.svg"
                      alt="Followers"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    <span className="mt-2 dark:text-gray-300">
                      1.2K Followers
                    </span>
                  </div>
                  <Button className="w-32 px-6 py-2 rounded-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                    Following
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 sm:mt-28 w-full sm:w-auto">
              <Button className="flex-1 sm:w-32 px-4 sm:px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 hover:text-gray-100 dark:bg-green-600 dark:hover:bg-green-700">
                Send message
              </Button>
              <Button className="flex-1 sm:w-32 px-4 sm:px-6 py-2 rounded-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Edit
              </Button>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-4 sm:absolute sm:top-40 sm:right-0 flex gap-4 justify-center sm:justify-start">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/four.svg"
                alt="QR Code"
                width={30}
                height={30}
                className="w-8 h-8"
              />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/linkedin.svg"
                alt="LinkedIn"
                width={30}
                height={30}
                className="w-8 h-8"
              />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/fb.svg"
                alt="Facebook"
                width={30}
                height={30}
                className="w-8 h-8"
              />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/ig.svg"
                alt="Instagram"
                width={30}
                height={30}
                className="w-8 h-8"
              />
            </Link>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-4 mx-auto max-w-4xl">
          <Tabs defaultValue="followers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger
                value="followers"
                className="text-gray-600 data-[state=active]:bg-primary data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600">
                Followers
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="text-gray-600 data-[state=active]:bg-primary data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600">
                Following
              </TabsTrigger>
            </TabsList>
            <TabsContent value="followers" className="dark:bg-gray-800">
              <UserList users={currentUsers} />
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>
            <TabsContent value="following" className="dark:bg-gray-800">
              <UserList users={[...currentUsers].reverse()} />
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
