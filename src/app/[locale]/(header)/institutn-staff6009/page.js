"use client"

import Image from "next/image"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample data - can be replaced with API data later
const students = [
  { id: 1, name: "Vrittika Kaur", years: "4 Years", image: "/image/institutnstudent/1.svg" },
  { id: 2, name: "Eli Mathew", years: "3 Years", image: "/image/institutnstudent/2.svg" },
  { id: 3, name: "Shyam shekar", years: "4 Years", image: "/image/institutnstudent/3.svg" },
  { id: 4, name: "Dennis paul", years: "2 Years", image: "/image/institutnstudent/4.svg" },
  { id: 5, name: "Margrethe", years: "4 Years", image: "/image/institutnstudent/5.svg" },
  { id: 6, name: "Lima John", years: "3 Years", image: "/image/institutnstudent/6.svg" },
  { id: 7, name: "Sam Alex", years: "4 Years", image: "/image/institutnstudent/7.svg" },
  { id: 8, name: "Fida Melaurin", years: "2 Years", image: "/image/institutnstudent/8.svg" },
  { id: 9, name: "Jyothi Varma", years: "4 Years", image: "/image/institutnstudent/9.svg" },
  { id: 10, name: "Timmy Jose", years: "3 Years", image: "/image/institutnstudent/10.svg" },
  { id: 11, name: "Nithatra Menon", years: "4 Years", image: "/image/institutnstudent/11.svg" },
  { id: 12, name: "Nethra V", years: "2 Years", image: "/image/institutnstudent/12.svg" },
  { id: 13, name: "John", years: "4 Years", image: "/image/institutnstudent/13.svg" },
  { id: 14, name: "Varun R Nair", years: "3 Years", image: "/image/institutnstudent/14.svg" },
  { id: 15, name: "Vimal Kumar", years: "4 Years", image: "/image/institutnstudent/15.svg" },
  { id: 16, name: "Seba Jacob", years: "2 Years", image: "/image/institutnstudent/16.svg" },
  { id: 17, name: "Luke Gills", years: "3 Years", image: "/image/institutnstudent/21.svg" },
  { id: 18, name: "Shivakumar", years: "4 Years", image: "/image/institutnstudent/18.svg" },
  { id: 19, name: "Gauthr G", years: "3 Years", image: "/image/institutnstudent/19.svg" },
  { id: 20, name: "Paul John", years: "4 Years", image: "/image/institutnstudent/20.svg" },
  { id: 21, name: "Ananya Sharma", years: "3 Years" },
  { id: 22, name: "Rohan Mehta", years: "4 Years" },
  { id: 23, name: "Priya Kapoor", years: "2 Years" },
  { id: 24, name: "Aarav Patel", years: "3 Years" },
  { id: 25, name: "Ishika Jain", years: "4 Years" },
  { id: 26, name: "Rahul Singh", years: "4 Years" },
  { id: 27, name: "Neha Gupta", years: "3 Years" },
  { id: 28, name: "Kabir Das", years: "2 Years" },
  { id: 29, name: "Aditi Verma", years: "3 Years" },
  { id: 30, name: "Arjun Nair", years: "4 Years" },
  { id: 31, name: "Meera Iyer", years: "2 Years" },
  { id: 32, name: "Varun Rao", years: "4 Years" },
  { id: 33, name: "Sanya Saxena", years: "3 Years" },
  { id: 34, name: "Kunal Roy", years: "4 Years" },
  { id: 35, name: "Tara Mishra", years: "3 Years" },
  { id: 36, name: "Ritika Bhardwaj", years: "4 Years" },
  { id: 37, name: "Nikhil Chatterjee", years: "3 Years" },
  { id: 38, name: "Simran Kaur", years: "2 Years" },
  { id: 39, name: "Aditya Malhotra", years: "4 Years" },
  { id: 40, name: "Sahil Khurana", years: "3 Years" },
]

export default function Directory() {
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 20

  // Calculate pagination
  const lastStudentIndex = currentPage * studentsPerPage
  const firstStudentIndex = lastStudentIndex - studentsPerPage
  const currentStudents = students.slice(firstStudentIndex, lastStudentIndex)
  const totalPages = Math.ceil(students.length / studentsPerPage)

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Render student card
  const StudentCard = ({ student }) => {
    return (
      <Card className="max-w-64 overflow-hidden transition-shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="flex flex-col items-center p-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={student.image} alt={`${student.name}'s photo`} />
            <AvatarFallback>{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-base font-semibold text-center text-gray-900 dark:text-white">{student.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{student.years}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Cover Photo */}
      <div className="relative h-[300px] w-full">
        <Image src="/image/institutnstudent/cover.jpg" alt="Institution Cover" fill className="object-cover" />
        {/* Profile Picture Container - Positioned relative to cover photo */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 shadow-lg">
            <Image
              src="/image/institutnstudent/logo.svg"
              alt="IIT Delhi Logo"
              fill
              className="rounded-full object-contain p-1"
            />
          </div>
        </div>
      </div>

      {/* Institution Info - Adjusted spacing to account for profile picture */}
      <div className="mt-20 px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IIT Delhi</h1>
        <p className="text-gray-600 dark:text-gray-400">256 Students</p>
      </div>

      {/* Students Grid */}
      <div className="mx-auto max-w-[1600px] p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant={number === currentPage ? "default" : "outline"}
              size="icon"
              className={`h-8 w-8 ${
                number === currentPage
                  ? "dark:bg-gray-700 dark:text-white"
                  : "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              }`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

