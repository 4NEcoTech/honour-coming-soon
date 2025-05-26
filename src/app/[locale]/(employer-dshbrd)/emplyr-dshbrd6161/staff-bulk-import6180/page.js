"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { useSession } from "next-auth/react";
import useInstitution from "@/hooks/useInstitution";
import { useState, useRef } from "react";
import Swal from "sweetalert2";

export default function TeamBulkDataUpload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { data: session } = useSession();
  const companyId = session?.user?.companyId;
  const individualId = session?.user?.individualId;
  const { institutionData, loading, error } = useInstitution(companyId);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx)$/i)) {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please upload a CSV or Excel file.",
          confirmButtonText: "Okay",
        });
        return;
      }

      if (file.size > maxSize) {
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "Maximum file size is 10MB.",
          confirmButtonText: "Okay",
        });
        return;
      }

      setUploadedFile(file);
    }
  };

  const router = useRouter();

  const handleUpload = async () => {
    if (!uploadedFile) {
      Swal.fire({
        icon: "error",
        title: "No File Selected",
        text: "Please select a file to upload.",
        confirmButtonText: "Okay",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("institutionNum", institutionData?.CD_Company_Num || "");
      formData.append("institutionName", institutionData?.CD_Company_Name || "");
      formData.append("companyId", companyId || "");
      formData.append("adminInviteeId", individualId || "");

      // Create an abort controller for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout

      // Track upload progress
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      const response = await fetch(
        "/api/employee/v1/staff-bulk-upload",
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setUploadedFile(null);
      setUploadProgress(0);

      // Display success modal with details
      Swal.fire({
        icon: "success",
        title: "Upload Completed",
        html: `
          <p>${result.message}</p>
          <p><b>Successfully Imported:</b> ${result.validCount}</p>
          <p><b>Invalid Entries:</b> ${result.invalidCount}</p>
          <p><b>Duplicates Skipped:</b> ${result.duplicateCount}</p>
          <p>What would you like to do next?</p>
        `,
        showCancelButton: true,
        confirmButtonText: "Add More",
        cancelButtonText: "Go to Dashboard",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          router.push("/institutn-dshbrd6051");
        }
      });
    } catch (error) {
      console.error("Upload error:", error);

      let errorMessage = "An error occurred while uploading the file.";
      if (error.name === 'AbortError') {
        errorMessage = "The upload took too long and was aborted. Please try again with a smaller file or check your network connection.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: errorMessage,
        showCancelButton: true,
        confirmButtonText: "Retry Upload",
        cancelButtonText: "Go to Dashboard",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Reset for retry
          setUploadProgress(0);
          setIsUploading(false);
        } else {
          router.push("/institutn-dshbrd6051");
        }
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    const filePath = "/assets/staffbulk.xlsx";
    const link = document.createElement("a");
    link.href = filePath;
    link.download = "teamStaffBulkImport.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-lg shadow-md p-6 mb-10">
      {/* Institution Info Block */}
      {loading ? (
        <p className="text-center text-gray-500 mb-4">
          Loading institution info...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 mb-4">
          Error: {error}
        </p>
      ) : institutionData && (
        <div className="text-center mb-6">
          <p className="text-xl font-bold text-primary">
            {institutionData.CD_Company_Name}
          </p>
          <p className="text-sm text-gray-600">
            Institution Number: {institutionData.CD_Company_Num}
          </p>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-center text-primary mb-4">
        Team Bulk Upload Data
      </h2>
      <div className="text-center mb-6">
        <Button
          onClick={handleDownload}
          className="w-32 px-6 py-2 bg-transparent text-primary border border-primary font-semibold rounded-lg hover:bg-gray-100"
        >
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
        className={`relative border-2 border-dashed rounded-lg p-6 cursor-pointer text-center hover:border-gray-400 transition-colors ${
          isUploading ? 'border-blue-500' : 'border-gray-300'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-600">
              Uploading... {uploadProgress}% complete
            </p>
            <p className="text-sm text-gray-500">
              Please don&nbsp;t close this window
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
        <input
          type="file"
          id="uploadFile"
          ref={fileInputRef}
          accept=".xlsx,.csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
      {uploadedFile && !isUploading && (
        <div className="mt-2 text-center">
          <p className="text-green-600">
            File ready: {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
          </p>
          <button
            onClick={() => {
              setUploadedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-red-500 text-xs hover:underline"
          >
            Remove file
          </button>
        </div>
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
          disabled={isUploading}
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
