import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background dark:bg-gray-900 pb-10">
      {/* Cover Photo Section */}
      <div className="relative h-[180px] sm:h-[240px] md:h-[320px]">
        <Image
          src="/image/institutnstudent/cover.jpg"
          alt="Cover Photo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute -bottom-16 sm:-bottom-20 left-4 sm:left-6 md:left-20">
          <div className="rounded-full border-4 border-white dark:border-gray-800 shadow-lg">
            <Image
              src="/image/institutnstudent/user.svg"
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full sm:w-[140px] sm:h-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="container px-4 mt-20 sm:mt-24 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 px-2 sm:px-6 md:px-20">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Vrithika Kaur
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400">
              Student at IIITB
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {['linkedin', 'fb', 'ig', 'four'].map((icon, index) => (
              <Link
                key={index}
                href="#"
                className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white">
                <Image
                  src={`/image/institutndashboard/dashpage/myprofile/${icon}.svg`}
                  alt={icon}
                  width={24}
                  height={24}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Details */}
        <section className="mt-6 sm:mt-10 mx-2 sm:mx-20">
          <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-none border-none bg-white dark:bg-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { icon: '1', text: 'Bangalore, Karnataka, India' },
                { icon: '2', text: '+91 7778889999' },
                { icon: '3', text: 'IIIT Bangalore' },
                { icon: '4', text: 'vrithika@gmail.com' },
                { icon: '5', text: '47 Followers' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Image
                    src={`/image/institutnstudent/icon/${item.icon}.svg`}
                    alt="icon"
                    width={16}
                    height={16}
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8">
              <Button
                size="sm"
                className="flex-1 max-w-full sm:max-w-32 min-h-8 sm:height-auto">
                Follow
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 max-w-full min-h-8 sm:height-auto sm:max-w-32 bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
                Send Message
              </Button>
            </div>
          </Card>
        </section>

        {/* Skills Section */}
        <section className="mt-6 sm:mt-10 mx-2 sm:mx-20">
          <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white dark:bg-gray-800">
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 p-1">
                {[
                  'UI design',
                  'Programming',
                  'Coding',
                  'Graphic Design',
                  'User Interface Design',
                  'Developing',
                  'UX Research',
                  'Logo Design',
                  'Branding',
                  'Research',
                ].map((skill, index) => (
                  <Badge
                    key={index}
                    className="px-2 py-1 text-xs sm:text-sm bg-gray-100 text-black dark:bg-gray-700 dark:text-white">
                    {skill}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Card>
        </section>

        {/* Experience Section */}
        <section className="mt-6 sm:mt-10 mx-2 sm:mx-20">
          <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white dark:bg-gray-800">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">
              Work Experience
            </h2>
            {['p1', 'p2'].map((icon, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-muted dark:bg-gray-700">
                  <Image
                    src={`/image/institutnstudent/icon/${icon}.svg`}
                    alt="Company Logo"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                    UI Designer
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    {index === 0 ? 'McTech' : 'Amazon'}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mt-1">
                    Part Time
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                    Bangalore, Karnataka, India
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </section>

        {/* Projects Section */}
        <section className="mt-6 sm:mt-10 mx-2 sm:mx-20">
          <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">
              Projects/Volunteering Activities
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'UX Case Study',
                  description:
                    'User research and analysis for improving mobile app experience',
                },
                {
                  title: 'Self-paced Designer (ePhase)',
                  description:
                    'Designed and implemented user interface improvements',
                },
              ].map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mt-1">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Resume Section */}
        <section className="mt-6 sm:mt-10 mx-2 sm:mx-20">
          <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">
              Resume
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2">
                <Image
                  src="/image/info/upload.svg"
                  alt="Upload Icon"
                  width={16}
                  height={16}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base text-gray-900 dark:text-white">
                    Jake Jacob cv_2024.pdf
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                    Last Updated on 13-10-2024
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Download
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
