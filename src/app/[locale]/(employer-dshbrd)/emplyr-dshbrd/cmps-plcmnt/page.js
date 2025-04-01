import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CampusPlacement() {
  // Sample data for placements
  const upcomingPlacements = [
    {
      university: "Stanford University",
      location: "Stanford, California",
      date: "March 5, 2024",
      participants: "500+ Participants",
    },
    {
      university: "Stanford University",
      location: "Stanford, California",
      date: "March 5, 2024",
      participants: "500+ Participants",
    },
    {
      university: "Stanford University",
      location: "Stanford, California",
      date: "March 5, 2024",
      participants: "500+ Participants",
    },
  ]

  const ongoingPlacements = [
    {
      university: "Stanford University",
      location: "Stanford, California",
      date: "March 5, 2024",
      participants: "500+ Participants",
    },
    {
      university: "Stanford University",
      location: "Stanford, California",
      date: "March 5, 2024",
      participants: "500+ Participants",
    },
    {
      university: "Stanford University",
      location: "Stanford, California",
      date: "March 5, 2024",
      participants: "500+ Participants",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Campus Placement</h1>

      {/* Upcoming Placements Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-6">Upcoming Placements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingPlacements.map((placement, index) => (
            <PlacementCard key={index} placement={placement} />
          ))}
        </div>
      </section>

      {/* Ongoing Placements Section */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Ongoing Placements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoingPlacements.map((placement, index) => (
            <PlacementCard key={index} placement={placement} />
          ))}
        </div>
      </section>
    </div>
  )
}

// Placement Card Component
function PlacementCard({ placement }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-3">{placement.university}</h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>{placement.location}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>{placement.date}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          <span>{placement.participants}</span>
        </div>
      </div>

      <Link
        href="#"
        className="text-blue-500 text-sm font-medium flex items-center hover:text-blue-600 transition-colors"
      >
        View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </Link>
    </div>
  )
}

