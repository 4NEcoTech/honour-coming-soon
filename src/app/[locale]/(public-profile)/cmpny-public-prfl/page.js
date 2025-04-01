import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Users, Mail, ChevronRight, Calendar, Building, Clock, ArrowRight } from "lucide-react"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Cover Photo and Profile Section */}
      <div className="relative">
        <div className="h-48 md:h-64 w-full bg-blue-50 relative">
          <Image
            src="/placeholder.svg?height=300&width=1200"
            alt="Cover Photo"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 relative z-10">
            <div className="w-32 h-32 rounded-lg border-4 border-white bg-white overflow-hidden shadow-md">
              <Image
                src="/placeholder.svg?height=128&width=128"
                alt="Profile Logo"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>

            <div className="flex flex-col md:flex-row md:justify-between w-full mt-4 md:mt-0 md:ml-4 md:pb-4">
              <div>
                <h1 className="text-xl font-bold">Udemy X</h1>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>New York, USA</span>
                </div>
              </div>

              <div className="flex mt-4 md:mt-0 space-x-2">
                <Button size="sm" variant="outline">
                  Follow
                </Button>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  Message
                </Button>
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" className="px-2">
                    <Image src="/placeholder.svg?height=20&width=20" alt="Twitter" width={20} height={20} />
                  </Button>
                  <Button size="sm" variant="ghost" className="px-2">
                    <Image src="/placeholder.svg?height=20&width=20" alt="LinkedIn" width={20} height={20} />
                  </Button>
                  <Button size="sm" variant="ghost" className="px-2">
                    <Image src="/placeholder.svg?height=20&width=20" alt="Facebook" width={20} height={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* About Tabs Section */}
          <div className="mt-6">
            <Tabs defaultValue="about">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto pb-0">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-2"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-2"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="photos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-2"
                >
                  Photos
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-2"
                >
                  Videos
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-2"
                >
                  Events
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          Udemy X is a leading educational platform offering courses in technology, business, and
                          creative fields. Our mission is to connect students with top instructors and provide
                          high-quality learning experiences.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contact Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">contact@udemyx.com</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">New York, USA</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Team</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">25 team members</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="posts">
                <div className="text-center py-8 text-gray-500">No posts to display</div>
              </TabsContent>

              <TabsContent value="photos">
                <div className="text-center py-8 text-gray-500">No photos to display</div>
              </TabsContent>

              <TabsContent value="videos">
                <div className="text-center py-8 text-gray-500">No videos to display</div>
              </TabsContent>

              <TabsContent value="events">
                <div className="text-center py-8 text-gray-500">No events to display</div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Team Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Team</h2>
              <Link href="#" className="text-blue-600 text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=56&width=56&text=${i + 1}`}
                      alt={`Team Member ${i + 1}`}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs mt-1 text-center">Name {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Opportunities</h2>
              <Link href="#" className="text-blue-600 text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "UX Designer", location: "Remote", type: "Full-time" },
                { title: "Web Developer", location: "New York", type: "Contract" },
                { title: "Content Writer", location: "London", type: "Part-time" },
                { title: "Product Manager", location: "San Francisco", type: "Full-time" },
              ].map((job, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{job.type}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Fairs Registered Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Fairs Registered</h2>
              <Link href="#" className="text-blue-600 text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Digital Tech Talent Fair 2023", date: "Oct 15, 2023", location: "New York" },
                { title: "Global Career Expo", date: "Nov 5, 2023", location: "San Francisco" },
                { title: "Education Summit 2023", date: "Dec 10, 2023", location: "Chicago" },
                { title: "Tech Fair 2.0", date: "Jan 20, 2024", location: "Boston" },
              ].map((fair, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{fair.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{fair.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{fair.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Events Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Events</h2>
              <Link href="#" className="text-blue-600 text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Webinar: Design Thinking", date: "Oct 20, 2023", time: "2:00 PM EST" },
                { title: "Content Series Part 4", date: "Oct 25, 2023", time: "1:00 PM EST" },
                { title: "Digital Tech Town Hall", date: "Nov 2, 2023", time: "11:00 AM EST" },
                { title: "Career Fair 1.0", date: "Nov 15, 2023", time: "10:00 AM EST" },
              ].map((event, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{event.time}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Partner Institutions Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Partner Institutions</h2>
              <Link href="#" className="text-blue-600 text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Stanford University", location: "California", programs: 12 },
                { name: "Harvard University", location: "Massachusetts", programs: 8 },
                { name: "MIT (Massachusetts Institute of Technology)", location: "Massachusetts", programs: 15 },
              ].map((institution, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{institution.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{institution.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Building className="h-3 w-3 mr-1" />
                      <span>{institution.programs} Programs</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Campus Placement Drive Section */}
          <div className="mt-8 mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Campus Placement Drive</h2>
              <Link href="#" className="text-blue-600 text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { image: "/placeholder.svg?height=200&width=300&text=CS+Event", title: "CS Event", count: "25+ Jobs" },
                {
                  image: "/placeholder.svg?height=200&width=300&text=IT+Seminar",
                  title: "IT Seminar",
                  count: "40+ Jobs",
                },
                {
                  image: "/placeholder.svg?height=200&width=300&text=AI+Convention",
                  title: "AI Convention",
                  count: "15+ Jobs",
                },
                {
                  image: "/placeholder.svg?height=200&width=300&text=ML+Workshop",
                  title: "ML Workshop",
                  count: "30+ Jobs",
                },
              ].map((drive, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-40 relative">
                    <Image src={drive.image || "/placeholder.svg"} alt={drive.title} fill className="object-cover" />
                  </div>
                  <CardContent className="pt-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{drive.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {drive.count}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost" className="p-0 h-auto">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

