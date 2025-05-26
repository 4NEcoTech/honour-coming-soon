"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SuperAdminBulkUploadPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(true);
  const { toast } = useToast();
  const { data: session } = useSession();
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Verify super admin role (02, 03, or 04)
  useEffect(() => {
    if (session && !["02", "03", "04"].includes(session.user?.role)) {
      router.push("/unauthorized");
    }
  }, [session, router]);

  // Fetch institutions list
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch(
          "/api/super-admin/v1/institutionDetailsGet"
        );
        if (!response.ok) throw new Error("Failed to fetch institutions");
        const data = await response.json();

        if (data.success) {
          // Transform the API response to match our expected structure
          const transformedInstitutions = data.data.map((inst) => ({
            _id: inst.company_id,
            CD_Company_Num: inst.company_num,
            CD_Company_Name: inst.company_name,
            individual_id: inst.individual_id,
          }));

          setInstitutions(transformedInstitutions);
        } else {
          throw new Error("Failed to load institutions");
        }
      } catch (error) {
        console.error("Error fetching institutions:", error);
        toast({
          title: "Error",
          description: "Failed to load institutions list",
          variant: "destructive",
        });
      } finally {
        setIsLoadingInstitutions(false);
      }
    };

    if (["02", "03", "04"].includes(session?.user?.role)) {
      fetchInstitutions();
    }
  }, [session, toast]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (
        !validTypes.includes(file.type) &&
        !file.name.match(/\.(csv|xlsx)$/i)
      ) {
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

    if (!selectedInstitution) {
      Swal.fire({
        icon: "error",
        title: "No Institution Selected",
        text: "Please select an institution to upload students for.",
        confirmButtonText: "Okay",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      // Get institution details from the selected institution
      const institution = institutions.find(
        (inst) => inst._id === selectedInstitution
      );
      if (institution) {
        formData.append("institutionNum", institution.CD_Company_Num);
        formData.append("institutionName", institution.CD_Company_Name);
        // Add any other required fields from the institution data
      }

      // Track upload progress
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      });

      // Use the INSTITUTION endpoint instead of super admin endpoint
      const response = await fetch(
        "/api/institution/v1/hcjBrBT60561StudentBulkUpload", // Changed to institution endpoint
        {
          method: "POST",
          body: formData,
        }
      );

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
            fileInputRef.current.value = "";
          }
        } else {
          router.push("/supr-admn-dshbrd6103");
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "An error occurred while uploading the file.";
      if (error.name === "AbortError") {
        errorMessage =
          "The upload took too long and was aborted. Please try again with a smaller file or check your network connection.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
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

  const handleDashboardClick = (e) => {
    router.push("/supr-admn-dshbrd6103");
  };

  const handleDownload = () => {
    const filePath = "/assets/studentbulk.xlsx";
    const link = document.createElement("a");
    link.href = filePath;
    link.download = "studentBulkImport.xlsx";
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
      <h2 className="text-2xl font-semibold text-center text-primary mb-4">
        Super Admin - Student Bulk Upload
      </h2>

      {/* Institution Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Institution
        </label>
        <Select
          onValueChange={setSelectedInstitution}
          disabled={isLoadingInstitutions || isUploading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoadingInstitutions
                  ? "Loading institutions..."
                  : "Select an institution"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {institutions.map((institution) => (
              <SelectItem key={institution._id} value={institution._id}>
                {institution.CD_Company_Name} ({institution.CD_Company_Num})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-center text-gray-500 mb-4">
        Download template with sample data
      </p>
      <div className="text-center mb-6">
        <Button
          onClick={handleDownload}
          className="w-32 px-6 py-2 bg-transparent text-primary border border-primary font-semibold rounded-lg hover:bg-gray-100"
          disabled={isUploading}
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
      <p className="text-sm font-semibold mb-2">
        Please upload an Excel file (10mb) of student&apos;s details here
      </p>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 cursor-pointer text-center hover:border-gray-400 transition-colors ${
          isUploading ? "border-blue-500" : "border-gray-300"
        }`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
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
              Please don&apos;t close this window
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
            File ready: {uploadedFile.name} (
            {Math.round(uploadedFile.size / 1024)} KB)
          </p>
          <button
            onClick={() => {
              setUploadedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
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
          disabled={!uploadedFile || !selectedInstitution || isUploading}
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
          onClick={handleDashboardClick}
          disabled={isUploading}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
