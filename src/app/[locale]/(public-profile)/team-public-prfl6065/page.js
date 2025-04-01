import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { Briefcase, Globe, Mail, MapPin, Phone, Users } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 pb-20">
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

      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Section */}
        <div className="relative -mt-24 mb-8">
          <div className="flex justify-between items-start">
            {/* Profile Image */}
            <div className="relative">
              <Image
                src="/image/institutndashboard/dashpage/myprofile/profile.svg"
                alt="Profile"
                width={180}
                height={180}
                className="rounded-lg border-4 border-background dark:border-gray-800"
                priority
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-28">
              <Button className="w-32 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 hover:text-gray-100 dark:bg-green-600 dark:hover:bg-green-700">
                Send message
              </Button>
              <Button className="w-32 px-6 py-2 rounded-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Edit
              </Button>
            </div>
          </div>

          {/* Social Links */}
          <div className="absolute top-40 right-0 flex gap-4">
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

        {/* Profile Info */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">Jaya Kumar</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>5997 Followers</span>
                </div>
                <Button
                  size="lg"
                  className="bg-primary text-white max-h-8 dark:bg-blue-600 dark:hover:bg-blue-700">
                  Follow
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Bangalore, Karnataka</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                <Briefcase className="w-4 h-4" />
                <span>Administrator, IIT Delhi</span>
              </div>

              <div className="flex items-start gap-2 text-muted-foreground dark:text-gray-400">
                <Mail className="w-4 h-4 mt-1" />
                <p className="leading-relaxed">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a Lorem ipsum is simply dummy text of the
                  printing and typesetting industry.
                </p>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                <Globe className="w-4 h-4" />
                <Link
                  href="#"
                  className="text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                  www.website.com
                </Link>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+91-9851234556</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
