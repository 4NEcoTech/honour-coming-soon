import React from 'react';
import { Button } from '@/components/ui/button';
import { FaMapMarkerAlt, FaMoneyBillWave, FaClipboardList, FaBuilding, FaClock } from 'react-icons/fa';

export default function JobDescription() {
    return (
        <div className="min-h-screen py-10 px-4 md:px-10 lg:px-20 xl:px-32 bg-[#F0F4F3] dark:bg-gray-900 text-gray-800 dark:text-gray-100 max-w-5xl">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="px-3 py-1 bg-primary text-white dark:bg-gray-700 rounded-lg text-sm mb-2 inline-block">Job</span>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">UI Designer</h1>
                        <div className="space-y-2">
                            <p className="flex items-center gap-2"><FaMapMarkerAlt /> Bangalore, Karnataka, India</p>
                            <p className="flex items-center gap-2"><FaMoneyBillWave /> ₹ 25000/month</p>
                            <p className="flex items-center gap-2"><FaClipboardList /> Contract</p>
                            <p className="flex items-center gap-2"><FaBuilding /> On-site</p>
                            <p className="flex items-center gap-2"><FaClock /> Immediately</p>
                        </div>
                    </div>
                    <Button className="px-6 py-2 bg-primary text-white rounded-lg dark:bg-gray-700">Apply Now</Button>
                </div>

                {/* Main Content Sections */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">About the jobs</h2>
                    <p>We are currently hiring a passionate, user-centered UI Designer to join a collaborative and innovative team to create visually delightful and easy-to-use digital products in a fast-paced environment.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Key responsibilities</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Creating user-centered designs by understanding business requirements and user feedback</li>
                        <li>Creating user flows, wireframes, prototypes, and mockups</li>
                        <li>Translating requirements into style guides, design systems, and attractive UI interfaces</li>
                        <li>Designing UI elements such as input controls, navigational components, and informational components</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Skills Required</h2>
                    <div className="flex space-x-3">
                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg">Canva </span>
                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg">Figma </span>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Who can apply</h2>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Hearing/Speech Challenged</li>
                        <li>Visually Challenged</li>
                        <li>LGBTQ+</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Additional Preference</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Proficiency in design software like Canva</li>
                        <li>A keen eye for detail and passion for visually appealing graphics</li>
                        <li>Excellent understanding of design principles and brand identity</li>
                        <li>Strong communication and collaboration skills</li>
                        <li>Ability to think creatively and develop innovative solutions</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Salary and perks</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>₹ 25000</li>
                        <li>Fixed</li>
                        <li>2 months probation</li>
                        <li>Flexible work hours</li>
                        <li>Informal dress code</li>
                        <li>Free snacks</li>
                        <li>Assistive device for differently-abled people will be provided</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Additional Details/Requirements</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Night shift</li>
                        <li>Fixed</li>
                        <li>Standing job</li>
                        <li>Need to walk a lot</li>
                        <li>Camera should be on while working</li>
                        <li>GPS Tracking</li>
                        <li>Bring your own device</li>
                    </ul>
                </section>

                {/* Bottom Section */}
                <div className="flex space-x-4 justify-center mt-10">
                    <Button className="px-6 py-2 bg-primary text-white rounded-lg dark:bg-gray-700">Apply</Button>
                    <Button variant="outline" className="border border-primary text-primary dark:bg-gray-800 dark:text-gray-100">Save</Button>
                </div>
                <p className="text-center text-gray-500 dark:text-gray-400 mt-6">[Application will close on 22:01:2025]</p>

                {/* Other Opportunities */}
                <section className="mt-12 p-6 bg-white dark:bg-gray-800 shadow-sm rounded-2xl">
                    <h2 className="text-2xl font-semibold mb-6">Other Opportunities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow dark:border-gray-700">
                                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm mb-2 inline-block">
                                    {index % 2 === 0 ? 'Internship' : 'Job'}
                                </span>
                                <h3 className="text-lg font-semibold mb-2">
                                    {index % 2 === 0 ? 'UI Designer' : 'UI/UX Designer'}
                                </h3>
                                <div className="space-y-1 border-t pt-2 dark:border-gray-600">
                                    <p className="flex items-center gap-2"><FaMapMarkerAlt /> Bangalore, Karnataka, India</p>
                                    <p className="flex items-center gap-2"><FaMoneyBillWave /> ₹ {index % 2 === 0 ? '25000/month' : '200000 - ₹ 500000/year'}</p>
                                    <p className="flex items-center gap-2"><FaClock /> 6 Months</p>
                                </div>
                                <Button variant="link" className="text-primary dark:text-blue-400 mt-3 font-medium">View Details →</Button>
                            </div>
                        ))}
                    </div>
                    <div className="text-right mt-6">
                        <Button variant="link" className="text-primary dark:text-blue-400 font-medium">View All →</Button>
                    </div>
                </section>
        </div>
    );
}
