"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarFallback } from "../../components/utils"
import { formatDate } from "../../components/utils"
import { Phone, Mail, MapPin, Calendar, FileText, CheckCircle, Globe, Building } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export function InstitutionProfile({
  institution,
  isOpen,
  onClose,
  onDelete,
  onUpdateStatus,
}) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(institution.id, newStatus)
    setIsStatusDropdownOpen(false)
  }

  const handleSendMessage = () => {
    // Implement send message functionality
    console.log("Send message to", institution.username)
  }

  if (!institution) return null

  // Access the raw data for detailed information
  const rawData = institution.rawData || {}
  const companyDetails = rawData.companyDetails || {}
  const companyKYC = rawData.companyKYC || {}
  const companyAddress = rawData.companyAddress || {}
  const administrator = rawData.administrator || {}

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{institution.username}</span>
            <DialogClose />
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={companyDetails.CD_Company_Logo} alt={institution.username} />
            <AvatarFallback className="text-2xl">{getAvatarFallback(institution.username)}</AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h3 className="text-xl font-bold">{companyDetails.CD_Company_Name}</h3>
            {companyKYC.CKD_College_Name && (
              <p className="text-sm text-muted-foreground">{companyKYC.CKD_College_Name}</p>
            )}
          </div>

          <Button className="w-full bg-primary text-white" onClick={handleSendMessage}>
            Send Message
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone Number</p>
              <p className="text-sm">{companyDetails.CD_Phone_Number || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm">{companyDetails.CD_Company_Email || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm">
                {companyAddress.CAD_Address_Line1
                  ? `${companyAddress.CAD_Address_Line1}, ${companyAddress.CAD_City}, ${companyAddress.CAD_State}, ${companyAddress.CAD_Country} - ${companyAddress.CAD_Pincode}`
                  : "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Institution Type</p>
              <p className="text-sm">{companyKYC.CKD_Institution_Type || "Not specified"}</p>
            </div>
          </div>

          {companyKYC.CKD_Affiliated_University && (
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Affiliated University</p>
                <p className="text-sm">{companyKYC.CKD_Affiliated_University}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date Registered</p>
              <p className="text-sm">{institution.createdAt ? formatDate(institution.createdAt) : "Not available"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Documents</p>
              {institution.documents && institution.documents.length > 0 ? (
                institution.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-1 mt-1">
                    <div className={`p-1 rounded ${doc.type === "pdf" ? "bg-blue-100" : "bg-red-100"}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={doc.type === "pdf" ? "text-blue-600" : "text-red-600"}
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <span className="text-xs">{doc.name || "Document"}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No documents available</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Verification Status</p>
              <DropdownMenu open={isStatusDropdownOpen} onOpenChange={setIsStatusDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className={institution.verificationBadgeColor}>
                    {institution.verificationStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={institution.verificationCode || ""}>
                    <DropdownMenuRadioItem value="pending" onClick={() => handleStatusChange("pending")}>
                      Pending
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="verified" onClick={() => handleStatusChange("verified")}>
                      Verified
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="not_verified" onClick={() => handleStatusChange("not_verified")}>
                      Not Verified
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="requested_info" onClick={() => handleStatusChange("requested_info")}>
                      Requested Information
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

