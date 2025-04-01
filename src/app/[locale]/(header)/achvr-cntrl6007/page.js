import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "@/i18n/routing";
import Image from 'next/image';


export const metadata = {
   title: 'Achiever Central | HCJ',
  openGraph: {
     title: 'Achiever Central | HCJ',
  },
}


function Page() {
  return (
    <div className="bg-transparent p-8">
      <section className=" container mx-auto flex flex-col md:flex-row justify-between items-center mb-16">
        <div className="text-center md:text-left mx-4 md:mx-8 lg:mx-16 max-w-xl">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <h2 className="text-3xl font-semibold text-foreground">
              Achievers Central
            </h2>
            <Image
              src="/image/institute/achievercentral/trophy2.svg"
              alt="Trophy Icon"
              width={24}
              height={24}
              className="w-6 h-6 ml-2"
            />
          </div>
          <h1 className="text-[24px] font-bold text-green-600 dark:text-green-400 mb-6">
            Every month we feature best performers on HCJ as achievers central.
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Please send achievers name, their achievement, photo, and your name
            and contact information if you are nominating someone else.
          </p>
          <Link href="achr-cntrl-stdnt">
          <Button className="px-6 py-2 rounded-lg transition-all">
            Send Nominations
          </Button></Link>
        </div>

        <div className="mt-8 md:mt-0">
          <Image
            src="/image/institute/achievercentral/trophy.svg"
            alt="Trophy"
            width={400}
            height={400}
            className="w-full max-w-sm mx-auto md:max-w-md"
          />
        </div>
      </section>

      {/* November 2024 Section */}
      <section className=" container mx-auto mb-16 px-4 lg:px-8 relative">
        {/* Top Right Image */}
        <Image
          src="/image/institute/achievercentral/top1.svg"
          alt="Top Right"
          width={400}
          height={400}
          className="absolute top-[-20px] right-[-20px] w-28 h-28 lg:w-40 lg:h-40"
        />

        {/* Section Title */}
        <h3 className="text-2xl font-semibold text-foreground mb-6">
          November 2024
        </h3>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Individual Divs */}
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/akhilraj.svg"
              alt="Akhil Raj"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/manunair.svg"
              alt="Manu Nair"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/nikhilaverma.svg"
              alt="Nikhila Vimal"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/priya.svg"
              alt="Priya Varrier"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Bottom Left Image */}
        <Image
          src="/image/institute/achievercentral/bottom2.svg"
          alt="Bottom Left"
          width={200}
          height={200}
          className="absolute bottom-[-20px] left-[-20px] w-28 h-28 lg:w-40 lg:h-40"
        />
      </section>

      {/* October 2024 Section */}
      <section className=" container mx-auto mb-16 px-4 lg:px-8 relative">
        {/* Section Title */}
        <h3 className="text-2xl font-semibold text-foreground mb-6">
          October 2024
        </h3>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Individual Divs */}
          <Image
            src="/image/institute/achievercentral/top2.svg"
            alt="Top Right"
            width={200}
            height={200}

            className="absolute top-10 right-[-20px] w-60 h-60 lg:w-80 lg:h-80"
          />
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/amaladavid.svg"
              alt="Amala David"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/jitintom.svg"
              alt="Jithin Tom"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/shreyamanoj.svg"
              alt="Shreya Manoj"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/alakamathew.svg"
              alt="Alina Mathew"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Bottom Left Image */}
        <Image
          src="/image/institute/achievercentral/top3.svg"
          alt="Bottom Left"
          width={200}
          height={200}
          className="absolute bottom-[-20px] left-[-20px] w-40 h-40 lg:w-40 lg:h-40"
        />
      </section>

      {/* September 2024 Section */}
      <section className=" container mx-auto mb-16 px-4 lg:px-8 relative">
        <h3 className="text-2xl font-semibold text-foreground mb-6">
          September 2024
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/domonic.svg"
              alt="Dominic"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/glenpaul.svg"
              alt="Glen Paul"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/vibhajoseph.svg"
              alt="Viba Joseph"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
          <div className="p-4 rounded-lg">
            <Image
              src="/image/institute/achievercentral/janentjohn.svg"
              alt="Joseph Mathew"
              width={200}
              height={200}
              className="w-full h-100 object-cover rounded-lg"
            />
          </div>
        </div>
        <Image
          src="/image/institute/achievercentral/bottom3.svg"
          alt="Top Right"
          width={200}
          height={200}
          className="absolute top-[250px] right-[-20px] w-40 h-40 lg:w-60 lg:h-60"
        />
      </section>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>

          {/* Page 1 */}
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>

          {/* Page 2 (Active) */}
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>

          {/* Page 3 */}
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>

          {/* Ellipsis for more pages */}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
    </div>
  );
}

export default Page;
