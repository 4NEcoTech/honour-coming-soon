"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Trash2, Upload, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast"; // Using your unified toast
import { useSession } from "next-auth/react";

export default function ResumeUploadCard() {
  const { data: session } = useSession();
  const individualId = session?.user?.individualId;

  const [resumeUrl, setResumeUrl] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch resume on mount
  useEffect(() => {
    if (!individualId) return;

    fetch(`/api/student/v1/hcjBrBT60722FetchResume/${individualId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.resumeUrl) {
          setResumeUrl(data.data.resumeUrl);
          setLastUpdated(new Date().toLocaleDateString());
        }
      })
      .catch((err) => {
        console.error("Resume fetch failed", err);
        toast({
          title: "Error",
          description: "Failed to load resume.",
          variant: "destructive",
        });
      });
  }, [individualId]);

  // Handle Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !individualId) return;

    const formData = new FormData();
    formData.append("userId", individualId);
    formData.append("file", file);

    try {
      const res = await fetch("/api/student/v1/hcjBrBT60721AddResume", {
        method: "PATCH",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setResumeUrl(result.url);
        setLastUpdated(new Date().toLocaleDateString());
        toast({
          title: "Success",
          description: "Resume uploaded successfully!",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      toast({
        title: "Error",
        description: "Something went wrong during upload.",
        variant: "destructive",
      });
    }
  };

 // Delete resume via API
const handleDelete = async () => {
  if (!individualId) return;

  const confirmDelete = confirm("Are you sure you want to delete your resume?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `/api/student/v1/hcjBrBT60725DeleteResume/${individualId}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (data.success) {
      setResumeUrl(null);
      setLastUpdated(null);
      toast({
        title: "Deleted",
        description: "Resume removed successfully.",
      });
    } else {
      throw new Error(data.message || "Failed to delete resume");
    }
  } catch (error) {
    console.error("Error deleting resume:", error);
    toast({
      title: "Error",
      description: error.message || "Something went wrong during deletion.",
      variant: "destructive",
    });
  }
};


  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Resume</h1>

          {resumeUrl ? (
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-base font-medium">Resume File</p>
                  <p className="text-xs text-gray-500">
                    Last updated on {lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-2">
              No resume uploaded yet.
            </p>
          )}

          <div
            className="mt-6 border-2 border-dashed border-primary rounded-lg p-6 text-center cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-primary text-sm font-medium">
              Click or drag to upload your resume
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, DOC, DOCX (max 2MB)
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
