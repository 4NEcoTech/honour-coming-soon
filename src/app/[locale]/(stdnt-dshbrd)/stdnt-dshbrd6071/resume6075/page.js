"use client"

import { useState } from "react"
import { Download, Trash2, Upload, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

export default function Page() {
  const [file, setFile] = useState({
    name: "Jake Jacob cv_2024.pdf",
    lastUpdated: "13-10-2024",
  })

  const handleDragOver = (e) => e.preventDefault()

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && ["application/pdf", "application/msword"].includes(droppedFile.type)) {
      setFile({ name: droppedFile.name, lastUpdated: new Date().toLocaleDateString() })
      toast.success("Resume uploaded successfully!")
    } else {
      toast.error("Invalid file format. Please upload a PDF or DOC.")
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && ["application/pdf", "application/msword"].includes(selectedFile.type)) {
      setFile({ name: selectedFile.name, lastUpdated: new Date().toLocaleDateString() })
      toast.success("Resume uploaded successfully!")
    } else {
      toast.error("Invalid file format. Please upload a PDF or DOC.")
    }
  }

  const handleDownload = () => {
    toast.success("Downloading resume...")
  }

  const handleDelete = () => {
    setFile(null)
    toast.success("Resume deleted successfully!")
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 xl:p-10 max-w-4xl mx-auto">
      <Card className="w-full border border-gray-200 rounded-lg shadow-sm">
        <CardContent className="p-4 md:p-6 lg:p-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-6">Resume</h1>

          {file ? (
            <div className="flex flex-col md:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-base font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">Last updated on {file.lastUpdated}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}

          <p className="text-lg font-semibold text-primary mt-6 mb-4">Upload Your Resume</p>

          <div
            className="border-2 border-dashed border-primary rounded-lg p-6 text-center cursor-pointer transition-all"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <label htmlFor="file-upload" className="text-sm text-primary cursor-pointer">
                Click here
              </label>
              <span className="text-sm text-gray-500">to upload your resume or drag and drop</span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500">Supported formats: PDF, DOC (Max 2MB)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
