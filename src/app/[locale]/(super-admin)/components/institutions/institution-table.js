"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarFallback } from "../../components/utils"
import { Edit, Trash2 } from "lucide-react"

export function InstitutionTable({
  institutions,
  selectedInstitutions,
  onSelectInstitution,
  onSelectAll,
  onViewInstitution,
  onDeleteInstitution,
}) {
  const allSelected = institutions.length > 0 && selectedInstitutions.length === institutions.length

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-center">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                aria-label="Select all institutions"
              />
            </th>
            <th className="p-4 font-medium">Username</th>
            <th className="p-4 font-medium">Institution Location</th>
            <th className="p-4 font-medium">Administrator and staffs</th>
            <th className="p-4 font-medium">Documents</th>
            <th className="p-4 font-medium">Verification Status</th>
            <th className="p-4 font-medium">Edit</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((institution) => (
            <tr key={institution.id} className="border-b hover:bg-muted/50">
              <td className="p-4 text-center">
                <Checkbox
                  checked={selectedInstitutions.includes(institution.id)}
                  onCheckedChange={(checked) => onSelectInstitution(institution.id, !!checked)}
                  aria-label={`Select ${institution.username}`}
                />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={institution.profileImage} alt={institution.username} />
                    <AvatarFallback>{getAvatarFallback(institution.username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{institution.username}</div>
                    <div className="text-sm text-muted-foreground">{institution.institutionName}</div>
                    {institution.isLoggedIn === false && <div className="text-xs text-amber-500">Not Logged in</div>}
                  </div>
                </div>
              </td>
              <td className="p-4">{institution.location}</td>
              <td className="p-4">
                <div className="flex -space-x-2">
                  {institution.administrators && institution.administrators.length > 0 ? (
                    institution.administrators.slice(0, 3).map((admin, index) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={admin.profileImage} alt={admin.name} />
                        <AvatarFallback>{getAvatarFallback(admin.name || "Admin")}</AvatarFallback>
                      </Avatar>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No administrators</span>
                  )}
                  {institution.administrators && institution.administrators.length > 3 && (
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarFallback>+{institution.administrators.length - 3}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </td>
              <td className="p-4">
                {institution.documents && institution.documents.length > 0 ? (
                  institution.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-1 mb-1">
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
                  <span className="text-sm text-muted-foreground">No documents</span>
                )}
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 text-sm rounded-full ${institution.verificationBadgeColor}`}>
                  {institution.verificationStatus}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewInstitution(institution)}
                    className="h-8 w-8 text-blue-500"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteInstitution(institution.id)}
                    className="h-8 w-8 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

