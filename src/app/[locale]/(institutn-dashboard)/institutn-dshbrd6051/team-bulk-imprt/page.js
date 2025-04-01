"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";

import { useState } from "react";
import Swal from "sweetalert2";

export default function TeamBulkDataUpload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const router = useRouter();

  const handleUpload = async () => {
    if (!uploadedFile) {
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select a file to upload.',
        confirmButtonText: 'Okay',
      });
      return;
    }
  
    setIsUploading(true);
  
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
  
      // Updated API endpoint for Team Bulk Import
      const response = await fetch('/api/institution/v1/hcjBrBT60582StaffBulkImport', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setUploadedFile(null);
  
        //  Read valid, invalid, and duplicate counts from response
        const { message, validCount = 0, invalidCount = 0, duplicateCount = 0 } = result;
  
        //  Display success modal with details
        Swal.fire({
          icon: 'success',
          title: 'Upload Completed',
          html: `
            <p>${message}</p>
            <p><b>Successfully Imported:</b> ${validCount}</p>
            <p><b>Invalid Entries:</b> ${invalidCount}</p>
            <p><b>Duplicates Skipped:</b> ${duplicateCount}</p>
            <p>What would you like to do next?</p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Add More',
          cancelButtonText: 'Go to Dashboard',
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/institutn-dshbrd6051/team-blk-imprt6056');
          } else {
            router.push('/institutn-dshbrd6051');
          }
        });
      } else {
        throw new Error(result.error || 'Failed to process upload');
      }
    } catch (error) {
      //  Failure modal
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text:
          error.message ||
          'An error occurred while uploading the file. What would you like to do next?',
        showCancelButton: true,
        confirmButtonText: 'Retry Upload',
        cancelButtonText: 'Go to Dashboard',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/institutn-dshbrd6051/team-blk-imprt6056');
        } else {
          router.push('/institutn-dshbrd6051');
        }
      });
    } finally {
      setIsUploading(false);
    }
  };
  

  const handleDownload = () => {
    const filePath = '/assets/staffBulk.csv';
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'teamStaffBulkImport.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-center text-primary mb-4">
        Team Bulk Upload Data
      </h2>
      <div className="text-center mb-6">
        <Button onClick={handleDownload}
        className="w-32 px-6 py-2 bg-transparent text-primary border border-primary font-semibold rounded-lg hover:bg-gray-100">
          <Image
            src="/image/institutndashboard/dashpage/student/import.svg"
            alt="Download Icon"
            width={16}
            height={16}
            className="inline-block mr-2"
          />
          Download
        </Button>
      </div>
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center hover:border-gray-400"
        onClick={() => document.getElementById("uploadFile")?.click()}
      >
        <Image
          src="/image/info/upload.svg"
          alt="Upload Icon"
          width={40}
          height={40}
          className="mx-auto mb-2 w-10 h-10"
        />
        <p className="text-gray-600">
          <span className="text-primary">Click here </span>to upload file or
          drag and drop
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Supported format: Excel, CSV (10mb)
        </p>
        <input
          type="file"
          id="uploadFile"
          accept=".xlsx,.csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {uploadedFile && (
        <p className="text-green-600 mt-2 text-center">
          File uploaded: {uploadedFile.name}
        </p>
      )}
      <div className="mt-6 flex flex-col items-center space-y-3">
        <Button
          className="w-56 px-6 py-2 rounded-md bg-primary text-white flex items-center justify-center"
          onClick={handleUpload}
          disabled={!uploadedFile || isUploading}
        >
          <span className="mr-2">
            {isUploading ? "Uploading..." : "Upload"}
          </span>
          <Image
            src="/image/institutndashboard/dashpage/student/upload.svg"
            alt="Upload Icon"
            width={20}
            height={20}
          />
        </Button>
        <Button
          className="w-64 px-6 py-2 bg-transparent text-primary border border-primary font-semibold rounded-lg hover:bg-gray-100"
          onClick={() => router.push("/institutn-dshbrd6051")}
        >
          Skip to Dashboard
        </Button>
        <p className="text-gray-600 text-sm mt-1">
          Need help? Watch video, call us, or email us
        </p>
        <Link
          href="/cntct6011"
          className="text-primary font-medium text-base sm:text-lg md:text-xl lg:text-2xl hover:text-blue-800 transition-all"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
