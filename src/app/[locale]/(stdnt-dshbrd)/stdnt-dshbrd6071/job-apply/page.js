"use client"

import React, { useState } from 'react';
import { MapPin, Globe, X } from 'lucide-react';
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function JobApplication() {
  const [resume, setResume] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume({
        name: file.name,
        lastModified: new Date(file.lastModified).toLocaleDateString(),
      });
    }
  };

  const handleRemoveResume = () => {
    setResume(null);
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-4 mt-10 mb-10">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 dark:text-white shadow-sm border border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary text-white p-6">
          <Link href="#">
            <Button className="bg-primary/50 backdrop-brightness-150 text-white p-2 m-2">
              <FaArrowLeft className='h-4 w-4' />
            </Button>Back to all job openings
          </Link>
          <h1 className="text-2xl font-bold text-center mt-4">UI DESIGN</h1>
          <div className="flex justify-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1"><MapPin size={16} /> Bangalore, Karnataka, India</div>
            <div className="flex items-center gap-1"> ₹ 25000/month</div>
            <div className="flex items-center gap-1"><Globe size={16} /> Remote</div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-center mb-6">Apply for this job</h2>

          {/* Upload Resume */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Resume</label>
            {resume ? (
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex items-center justify-between bg-gray-100 dark:bg-gray-700">
                <div>
                  <p className="text-gray-800 dark:text-white font-semibold">{resume.name}</p>
                  <p className="text-gray-500 text-sm">Last updated: {resume.lastModified}</p>
                </div>
                <button onClick={handleRemoveResume} className="text-gray-500 hover:text-red-500">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="border-dashed border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 relative">
                <Input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                />
                <p className="text-blue-500">Click here to upload your resume or drag and drop</p>
                <p className="text-gray-400 text-sm">Supported format: PDF/DOC/DOCX (2MB)</p>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Availability</label>
            <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700">
              <option>Immediately</option>
              <option>Within 1 week</option>
              <option>Within 2 weeks</option>
              <option>Within 1 month</option>
            </select>
          </div>

          {/* Skills and Experience */}
          <div className="mb-4">
            <Label className="block text-gray-700 dark:text-gray-300 mb-2">What relevant skills or experience make you a great fit for this position?</Label>
            <textarea className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700" rows="4" placeholder="Type here"></textarea>
            <p className="text-gray-400 text-sm">Less than 1000 words</p>
          </div>

          <h2 className='text-primary text-lg font-semibold mb-2'>Current Salary</h2>

          {/* Current Salary */}
          <div className="mb-4 grid grid-cols-3 gap-4">
            <div>
              <Label className="block text-gray-700 dark:text-gray-300 mb-2">Currency</Label>
              <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700">
                <option>₹</option>
                <option>$</option>
                <option>€</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label className="block text-gray-700 dark:text-gray-300 mb-2">Amount</Label>
              <Input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700" placeholder="50000" />
            </div>
          </div>

          <h2 className='text-primary text-lg font-semibold mb-2'>Expected Salary</h2>

          {/* Expected Salary */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div>
              <Label className="block text-gray-700 dark:text-gray-300 mb-2">Currency</Label>
              <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700">
                <option>₹</option>
                <option>$</option>
                <option>€</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label className="block text-gray-700 dark:text-gray-300 mb-2">Amount</Label>
              <Input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700" placeholder="50000" />
            </div>
          </div>

          {/* Apply Button */}
          <Button className="w-full bg-primary text-white py-3 rounded-lg text-lg font-semibold transition duration-300">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
