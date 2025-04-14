// "use client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Building,
//   Calendar,
//   CheckCircle,
//   FileText,
//   Globe,
//   Mail,
//   MapPin,
//   Phone,
// } from "lucide-react";
// import { useState } from "react";
// import { formatDate, getAvatarFallback } from "../../components/utils";
// import { ScrollArea } from "@/components/ui/scroll-area";

// export function InstitutionProfile({
//   institution,
//   isOpen,
//   onClose,
//   onDelete,
//   onUpdateStatus,
// }) {
//   const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

//   const handleStatusChange = (newStatus) => {
//     onUpdateStatus(institution.id, newStatus);
//     setIsStatusDropdownOpen(false);
//   };

//   const handleSendMessage = () => {
//     // Implement send message functionality
//     console.log("Send message to", institution.username);
//   };

//   if (!institution) return null;

//   // Access the raw data for detailed information
//   const rawData = institution.rawData || {};
//   const companyDetails = rawData.companyDetails || {};
//   const companyKYC = rawData.companyKYC || {};
//   const companyAddress = rawData.companyAddress || {};
//   const administrator = rawData.administrator || {};

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center justify-between">
//             {/* <span>{institution.username}</span> */}
//             <DialogClose />
//           </DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="h-auto pr-4">
//           <div className="flex flex-col items-center gap-4 py-4">
//             <div className=" w-full flex flex-row items-center justify-between text-left gap-4 py-4">
//               <Avatar className="h-24 w-24">
//                 <AvatarImage
//                   src={companyDetails.CD_Company_Logo}
//                   alt={institution.username}
//                 />
//                 <AvatarFallback className="text-2xl">
//                   {getAvatarFallback(institution.username)}
//                 </AvatarFallback>
//               </Avatar>
//               <Button
//                 className=" bg-primary text-white"
//                 onClick={handleSendMessage}>
//                 Send Message
//               </Button>
//             </div>
//             <div className="">
//               <h3 className="text-lg font-semibold">
//                 {companyDetails.CD_Company_Name}
//               </h3>
//               {companyKYC.CKD_College_Name && (
//                 <p className="text-sm text-muted-foreground">
//                   {companyKYC.CKD_College_Name}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center gap-3">
//               <Phone className="h-5 w-5 text-muted-foreground" />
//               <div>
//                 <p className="text-sm font-medium">Phone Number</p>
//                 <p className="text-sm">
//                   {companyDetails.CD_Phone_Number || "Not provided"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <Mail className="h-5 w-5 text-muted-foreground" />
//               <div>
//                 <p className="text-sm font-medium">Email</p>
//                 <p className="text-sm">
//                   {companyDetails.CD_Company_Email || "Not provided"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <MapPin className="h-5 w-5 text-muted-foreground" />
//               <div>
//                 <p className="text-sm font-medium">Address</p>
//                 <p className="text-sm">
//                   {companyAddress.CAD_Address_Line1
//                     ? `${companyAddress.CAD_Address_Line1}, ${companyAddress.CAD_City}, ${companyAddress.CAD_State}, ${companyAddress.CAD_Country} - ${companyAddress.CAD_Pincode}`
//                     : "Not provided"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <Building className="h-5 w-5 text-muted-foreground" />
//               <div>
//                 <p className="text-sm font-medium">Institution Type</p>
//                 <p className="text-sm">
//                   {companyKYC.CKD_Institution_Type || "Not specified"}
//                 </p>
//               </div>
//             </div>

//             {companyKYC.CKD_Affiliated_University && (
//               <div className="flex items-center gap-3">
//                 <Globe className="h-5 w-5 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm font-medium">Affiliated University</p>
//                   <p className="text-sm">
//                     {companyKYC.CKD_Affiliated_University}
//                   </p>
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center gap-3">
//               <Calendar className="h-5 w-5 text-muted-foreground" />
//               <div>
//                 <p className="text-sm font-medium">Date Registered</p>
//                 <p className="text-sm">
//                   {institution.createdAt
//                     ? formatDate(institution.createdAt)
//                     : "Not available"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <FileText className="h-5 w-5 text-muted-foreground" />
//               <div>
//                 <p className="text-sm font-medium">Documents</p>
//                 {institution.documents && institution.documents.length > 0 ? (
//                   institution.documents.map((doc, index) => (
//                     <div key={index} className="flex items-center gap-1 mt-1">
//                       <div
//                         className={`p-1 rounded ${
//                           doc.type === "pdf" ? "bg-blue-100" : "bg-red-100"
//                         }`}>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="16"
//                           height="16"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className={
//                             doc.type === "pdf"
//                               ? "text-blue-600"
//                               : "text-red-600"
//                           }>
//                           <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
//                           <polyline points="14 2 14 8 20 8" />
//                         </svg>
//                       </div>
//                       <span className="text-xs">{doc.name || "Document"}</span>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-muted-foreground">
//                     No documents available
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <CheckCircle className="h-5 w-5 text-muted-foreground" />
//               <div className="flex items-center gap-2">
//                 <p className="text-sm font-medium">Verification Status</p>
//                 <DropdownMenu
//                   open={isStatusDropdownOpen}
//                   onOpenChange={setIsStatusDropdownOpen}>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className={institution.verificationBadgeColor}>
//                       {institution.verificationStatus}
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent>
//                     <DropdownMenuRadioGroup
//                       value={institution.verificationCode || ""}>
//                       <DropdownMenuRadioItem
//                         value="pending"
//                         onClick={() => handleStatusChange("pending")}>
//                         Pending
//                       </DropdownMenuRadioItem>
//                       <DropdownMenuRadioItem
//                         value="verified"
//                         onClick={() => handleStatusChange("verified")}>
//                         Verified
//                       </DropdownMenuRadioItem>
//                       <DropdownMenuRadioItem
//                         value="not_verified"
//                         onClick={() => handleStatusChange("not_verified")}>
//                         Not Verified
//                       </DropdownMenuRadioItem>
//                       <DropdownMenuRadioItem
//                         value="requested_info"
//                         onClick={() => handleStatusChange("requested_info")}>
//                         Requested Information
//                       </DropdownMenuRadioItem>
//                     </DropdownMenuRadioGroup>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <Button variant="destructive" onClick={onDelete}>
//               Delete
//             </Button>
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogCloseButton,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/responsive-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building,
  Calendar,
  CheckCircle,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";

// Mock utility functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getAvatarFallback = (name) => {
  if (!name) return "IN";
  const parts = name.split(/\s+/);
  if (parts.length === 1) {
    return name.substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function InstitutionProfile({
  institution,
  isOpen,
  onClose,
  onDelete,
  onUpdateStatus,
}) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(institution.id, newStatus);
    setIsStatusDropdownOpen(false);
  };

  const handleSendMessage = () => {
    // Implement send message functionality
    console.log("Send message to", institution.username);
  };

  if (!institution) return null;

  // Access the raw data for detailed information
  const rawData = institution.rawData || {};
  const companyDetails = rawData.companyDetails || {};
  const companyKYC = rawData.companyKYC || {};
  const companyAddress = rawData.companyAddress || {};

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogCloseButton />
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {/* {companyDetails.CD_Company_Name || institution.username} */}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody>
          <div className="flex flex-row justify-between items-center gap-4 pb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={companyDetails.CD_Company_Logo}
                alt={institution.username}
              />
              <AvatarFallback className="text-xl">
                {getAvatarFallback(institution.username)}
              </AvatarFallback>
            </Avatar>
            <Button
              className="bg-primary text-white"
              onClick={handleSendMessage}>
              Send Message
            </Button>
          </div>
          {companyDetails.CD_Company_Name || institution.username}
          {companyKYC.CKD_College_Name && (
            <p className="text-sm text-muted-foreground mb-4">
              {companyKYC.CKD_College_Name}
            </p>
          )}

          <div className="space-y-4 mt-2">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-sm">
                  {companyDetails.CD_Phone_Number || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm break-words">
                  {companyDetails.CD_Company_Email || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm">
                  {companyAddress.CAD_Address_Line1
                    ? `${companyAddress.CAD_Address_Line1}, ${companyAddress.CAD_City}, ${companyAddress.CAD_State}, ${companyAddress.CAD_Country} - ${companyAddress.CAD_Pincode}`
                    : "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Institution Type</p>
                <p className="text-sm">
                  {companyKYC.CKD_Institution_Type || "Not specified"}
                </p>
              </div>
            </div>

            {companyKYC.CKD_Affiliated_University && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Affiliated University</p>
                  <p className="text-sm">
                    {companyKYC.CKD_Affiliated_University}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date Registered</p>
                <p className="text-sm">
                  {institution.createdAt
                    ? formatDate(institution.createdAt)
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Documents</p>
                <div className="mt-1">
                  {institution.documents && institution.documents.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {institution.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <div
                            className={`p-1 rounded ${
                              doc.type === "pdf" ? "bg-blue-100" : "bg-red-100"
                            }`}>
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
                              className={
                                doc.type === "pdf"
                                  ? "text-blue-600"
                                  : "text-red-600"
                              }>
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs truncate hover:underline text-blue-600">
                            {doc.name || "Document"}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No documents available
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Verification Status</p>
                <div className="mt-1">
                  <DropdownMenu
                    open={isStatusDropdownOpen}
                    onOpenChange={setIsStatusDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={institution.verificationBadgeColor}>
                        {institution.verificationStatus}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuRadioGroup
                        value={institution.verificationCode || ""}>
                        <DropdownMenuRadioItem
                          value="pending"
                          onClick={() => handleStatusChange("pending")}>
                          Pending
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="verified"
                          onClick={() => handleStatusChange("verified")}>
                          Verified
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="not_verified"
                          onClick={() => handleStatusChange("not_verified")}>
                          Not Verified
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="requested_info"
                          onClick={() => handleStatusChange("requested_info")}>
                          Requested Information
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveDialogBody>
        <ResponsiveDialogFooter>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
