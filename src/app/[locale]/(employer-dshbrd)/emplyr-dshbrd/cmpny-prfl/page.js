import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Users, Mail, ChevronRight, CheckCircle } from "lucide-react"

export default function CompanyProfile() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Cover Photo Section */}
      <div className="relative w-full h-48 md:h-64 lg:h-80 bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <span>Add cover photo</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 -mt-16 sm:-mt-20">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-4 border-white bg-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Company Logo"
                  width={128}
                  height={128}
                  className="rounded-lg"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">VEBTO</h1>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Verified</span>
                    <span className="mx-2">•</span>
                    <span>Active</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">Follow</button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm">Message</button>
                  <div className="flex">
                    <button className="bg-gray-200 p-2 rounded-l-md">
                      <Image src="/placeholder.svg?height=20&width=20" alt="Share" width={20} height={20} />
                    </button>
                    <button className="bg-gray-200 p-2">
                      <Image src="/placeholder.svg?height=20&width=20" alt="LinkedIn" width={20} height={20} />
                    </button>
                    <button className="bg-gray-200 p-2 rounded-r-md">
                      <Image src="/placeholder.svg?height=20&width=20" alt="Twitter" width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* About & Contact */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-sm text-gray-600">
                    We are a technology company focused on creating innovative solutions for businesses and individuals.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>50-100 employees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>contact@vebto.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Section */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Staff</h2>
            <Link href="#" className="text-blue-500 text-sm flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=48&width=48&text=${i + 1}`}
                    alt={`Staff member ${i + 1}`}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <span className="text-xs mt-1 text-center">
                  {["John", "Sarah", "Mike", "Emma", "Alex", "Lisa", "David", "Anna", "Mark"][i]}
                </span>
                <span className="text-xs text-gray-500">
                  {["CEO", "CTO", "CFO", "Designer", "Developer", "HR", "Marketing", "Sales", "Support"][i]}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">+10</span>
              </div>
              <span className="text-xs mt-1 text-gray-500">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities Section */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Opportunities</h2>
            <Link href="#" className="text-blue-500 text-sm flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "UI Designer", location: "Remote", date: "Posted Jan 15, 2023" },
              { title: "UX/UI Designer", location: "Hybrid", date: "Posted Jan 10, 2023" },
              { title: "UI Designer", location: "On-site", date: "Posted Jan 5, 2023" },
            ].map((job, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                <p className="text-xs text-gray-400 mt-2">{job.date}</p>
                <button className="mt-4 text-blue-500 text-sm">Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fairs Registered Section */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Fairs Registered</h2>
            <Link href="#" className="text-blue-500 text-sm flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Global Tech Talent Fair", location: "Online", date: "Feb 15, 2023" },
              { title: "Creative Career Fair at XYZ University", location: "New York", date: "Mar 10, 2023" },
              { title: "Digital Tech Talent Fair", location: "San Francisco", date: "Apr 5, 2023" },
            ].map((fair, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-semibold">{fair.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{fair.location}</p>
                <p className="text-xs text-gray-400 mt-2">{fair.date}</p>
                <button className="mt-4 text-blue-500 text-sm">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Events</h2>
            <Link href="#" className="text-blue-500 text-sm flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Webinar: Design Trends", location: "Online", date: "Feb 20, 2023" },
              { title: "Career Fair at XYZ University", location: "New York", date: "Mar 15, 2023" },
              { title: "Digital Tech Summit", location: "San Francisco", date: "Apr 10, 2023" },
            ].map((event, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                <p className="text-xs text-gray-400 mt-2">{event.date}</p>
                <button className="mt-4 text-blue-500 text-sm">Register</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Institutions Slider */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Partner Institutions</h2>
            <Link href="#" className="text-blue-500 text-sm flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4">
            {[
              { name: "MIT", image: "/placeholder.svg?height=120&width=120&text=MIT" },
              { name: "Stanford", image: "/placeholder.svg?height=120&width=120&text=Stanford" },
              { name: "Harvard", image: "/placeholder.svg?height=120&width=120&text=Harvard" },
              { name: "Oxford", image: "/placeholder.svg?height=120&width=120&text=Oxford" },
              { name: "Cambridge", image: "/placeholder.svg?height=120&width=120&text=Cambridge" },
              { name: "Yale", image: "/placeholder.svg?height=120&width=120&text=Yale" },
            ].map((institution, i) => (
              <div key={i} className="flex-shrink-0 w-32">
                <div className="border rounded-lg overflow-hidden">
                  <Image
                    src={institution.image || "/placeholder.svg"}
                    alt={institution.name}
                    width={120}
                    height={120}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-sm text-center mt-2">{institution.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campus Placement Drive */}
      <div className="container mx-auto px-4 mt-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Campus Placement Drive</h2>
            <Link href="#" className="text-blue-500 text-sm flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Stanford University", location: "California", date: "Mar 15, 2023" },
              { name: "Harvard University", location: "Massachusetts", date: "Apr 10, 2023" },
              { name: "MIT (Massachusetts Institute of Technology)", location: "Massachusetts", date: "May 5, 2023" },
            ].map((campus, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-semibold">{campus.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{campus.location}</p>
                <p className="text-xs text-gray-400 mt-2">{campus.date}</p>
                <button className="mt-4 text-blue-500 text-sm">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

