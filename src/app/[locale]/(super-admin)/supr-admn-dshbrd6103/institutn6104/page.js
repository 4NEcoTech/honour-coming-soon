"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { usePagination } from "@/hooks/use-pagination";
import { SearchInput } from "@/components/ui/search-input";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { toast } from "@/hooks/use-toast";
import { InstitutionTable } from "../../components/institutions/institution-table";
import { FilterDropdowns } from "../../components/institutions/filter-dropdowns";
import { InstitutionProfile } from "../../components/institutions/institution-profile";
import { DeleteConfirmationDialog } from "../../components/institutions/delete-confirmation-dialog";
import { MessageDialog } from "../../components/institutions/message-dialog";
import { getVerificationBadgeColor } from "../../components/utils";

export default function InstitutionsPage() {
  const [selectedInstitutions, setSelectedInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState(null);
  const [mappedInstitutions, setMappedInstitutions] = useState([]);
  
  // Filters
  const [userTypeFilter, setUserTypeFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [verificationStatusFilter, setVerificationStatusFilter] = useState(null);

  const {
    items: institutions,
    paginationInfo,
    isLoading,
    error,
    searchText,
    setSearchText,
    goToPage,
    additionalFilters,
    setAdditionalFilters,
    refetch,
    // refresh
  } = usePagination(`/api/super-admin/v1/hcjArET61041FetchInstitutionVerificationData`, {
    pageSize: 10,
    batchSize: 100,
  });

  useEffect(() => {
    // Apply filters
    const filters = {};
    
    if (userTypeFilter) {
      filters.userType = userTypeFilter;
    }
    
    if (dateFilter) {
      filters.registrationDate = dateFilter.toISOString();
    }
    
    if (verificationStatusFilter) {
      filters.verificationStatus = verificationStatusFilter;
    }
    
    setAdditionalFilters(filters);
  }, [userTypeFilter, dateFilter, verificationStatusFilter, setAdditionalFilters]);

  useEffect(() => {
    if (institutions && institutions.length > 0) {
      // const transformedData = institutions.map((institution) => {
      //   // Map verification status from the API response
      //   const verificationStatus = institution?.companyKYC?.CKD_Verification_Status === "verified" 
      //     ? "Verified" 
      //     : institution?.companyKYC?.CKD_Verification_Status === "pending" 
      //       ? "Pending" 
      //       : "Not Verified";
        
      //   // Get admin name if available
      //   const adminName = institution.administrator 
      //     ? `${institution?.administrator.ID_First_Name || ''} ${institution.administrator.ID_Last_Name || ''}`.trim() 
      //     : "No Admin";
        
      //   // Get documents array
      //   const documents = [
      //     ...(institution?.companyKYC?.CKD_Company_Registration_Documents ? [{ 
      //       type: 'pdf', 
      //       name: 'Registration Document',
      //       url: institution?.companyKYC.CKD_Company_Registration_Documents 
      //     }] : []),
      //     ...(institution?.companyKYC?.CKD_Company_Tax_Documents ? [{ 
      //       type: 'pdf', 
      //       name: 'Tax Document',
      //       url: institution?.companyKYC.CKD_Company_Tax_Documents 
      //     }] : [])
      //   ];

      //   return {
      //     id: institution._id,
      //     username: institution.companyDetails?.CD_Company_Name || "N/A",
      //     institutionName: institution.companyDetails?.CD_Company_Name || "Institution",
      //     location: institution.companyDetails?.CD_Company_Location || institution.companyAddress?.CAD_City || "N/A",
      //     email: institution.companyDetails?.CD_Company_Email || "N/A",
      //     phone: institution.companyDetails?.CD_Phone_Number || "N/A",
      //     administrators: institution.administrator ? [
      //       {
      //         name: adminName,
      //         email: institution.administrator.ID_Email,
      //         phone: institution.administrator.ID_Phone,
      //         profileImage: ""
      //       }
      //     ] : [],
      //     documents: documents,
      //     verificationStatus: verificationStatus,
      //     verificationBadgeColor: getVerificationBadgeColor(verificationStatus),
      //     verificationCode: institution?.companyKYC?.CKD_Verification_Status || "pending",
      //     address: institution?.companyAddress ? 
      //       `${institution?.companyAddress?.CAD_Address_Line1 || ''}, ${institution.companyAddress.CAD_City || ''}, ${institution.companyAddress.CAD_State || ''}, ${institution.companyAddress.CAD_Country || ''}` : 
      //       "N/A",
      //     createdAt: institution.createdAt,
      //     profileImage: institution.companyDetails?.CD_Company_Logo || "",
      //     rawData: institution, // Store the raw data for reference
      //   };
      // });

      const transformedData = institutions
  .filter((institution) => institution) // skip null/undefined entries
  .map((institution) => {
    const verificationStatus = institution?.companyKYC?.CKD_Verification_Status === "verified" 
      ? "Verified" 
      : institution?.companyKYC?.CKD_Verification_Status === "pending" 
        ? "Pending" 
        : "Not Verified";

    const admin = institution?.administrator;
    const adminName = admin 
      ? `${admin.ID_First_Name || ''} ${admin.ID_Last_Name || ''}`.trim() 
      : "No Admin";

    const documents = [
      ...(institution?.companyKYC?.CKD_Company_Registration_Documents ? [{ 
        type: 'pdf', 
        name: 'Registration Document',
        url: institution?.companyKYC.CKD_Company_Registration_Documents 
      }] : []),
      ...(institution?.companyKYC?.CKD_Company_Tax_Documents ? [{ 
        type: 'pdf', 
        name: 'Tax Document',
        url: institution?.companyKYC.CKD_Company_Tax_Documents 
      }] : [])
    ];

    return {
      id: institution._id,
      username: institution.companyDetails?.CD_Company_Name || "N/A",
      institutionName: institution.companyDetails?.CD_Company_Name || "Institution",
      location: institution.companyDetails?.CD_Company_Location || institution.companyAddress?.CAD_City || "N/A",
      email: institution.companyDetails?.CD_Company_Email || "N/A",
      phone: institution.companyDetails?.CD_Phone_Number || "N/A",
      administrators: admin ? [{
        name: adminName,
        email: admin.ID_Email,
        phone: admin.ID_Phone,
        profileImage: ""
      }] : [],
      documents,
      verificationStatus,
      verificationBadgeColor: getVerificationBadgeColor(verificationStatus),
      verificationCode: institution?.companyKYC?.CKD_Verification_Status || "pending",
      address: institution?.companyAddress ? 
        `${institution?.companyAddress?.CAD_Address_Line1 || ''}, ${institution.companyAddress.CAD_City || ''}, ${institution.companyAddress.CAD_State || ''}, ${institution.companyAddress.CAD_Country || ''}` : 
        "N/A",
      createdAt: institution.createdAt,
      profileImage: institution.companyDetails?.CD_Company_Logo || "",
      rawData: institution,
    };
  });

      setMappedInstitutions(transformedData);
    } else {
      setMappedInstitutions([]);
    }
  }, [institutions]);

  const handleViewInstitution = (institution) => {
    setSelectedInstitution(institution);
    setIsProfileOpen(true);
  };

  const handleDeleteClick = (institutionId) => {
    setInstitutionToDelete(institutionId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!institutionToDelete) return;
    
    try {
      const response = await fetch(
        `/api/super-admin/v1/deleteInstitution?id=${institutionToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete institution");
      }

      toast({
        title: "Institution Deleted",
        description: "The institution has been removed successfully.",
        variant: "destructive",
      });

      setMappedInstitutions((prev) =>
        prev.filter((institution) => institution.id !== institutionToDelete)
      );
      setIsDeleteDialogOpen(false);
      setIsProfileOpen(false);
      // refresh();
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "Error",
        description: "Failed to delete institution. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateVerificationStatus = async (institutionId, newStatus) => {
    try {
      // If setting to verified, use the verify institution API
      if (newStatus === "verified") {
        const response = await fetch(
          `/api/super-admin/v1/hcjArET61042VerifyInstition`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              institutionId: institutionId,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to verify institution");
        }

        const responseData = await response.json();
        
        toast({
          title: "Status Updated",
          description: responseData.message || "The institution has been verified successfully.",
        });
      } else {
        // For other status updates, use a generic update API
        const response = await fetch(
          `/api/super-admin/v1/updateInstitutionStatus`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: institutionId,
              verificationStatus: newStatus,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update institution status");
        }

        toast({
          title: "Status Updated",
          description: "The institution verification status has been updated.",
        });
      }

      // Update local state
      const statusMap = {
        "pending": "Pending",
        "verified": "Verified",
        "not_verified": "Not Verified",
        "requested_info": "Requested Information"
      };
      
      setMappedInstitutions((prev) =>
        prev.map((institution) => {
          if (institution.id === institutionId) {
            const updatedStatus = statusMap[newStatus] || "Pending";
            const updatedInstitution = {
              ...institution,
              verificationStatus: updatedStatus,
              verificationBadgeColor: getVerificationBadgeColor(updatedStatus),
              verificationCode: newStatus,
            };
            
            // If this is the currently selected institution, update that too
            if (selectedInstitution && selectedInstitution.id === institutionId) {
              setSelectedInstitution(updatedInstitution);
            }
            
            return updatedInstitution;
          }
          return institution;
        })
      );
      
      // refresh();
      refetch();
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update institution status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectInstitution = (institutionId, isSelected) => {
    if (isSelected) {
      setSelectedInstitutions((prev) => [...prev, institutionId]);
    } else {
      setSelectedInstitutions((prev) => prev.filter((id) => id !== institutionId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedInstitutions(mappedInstitutions.map((institution) => institution.id));
    } else {
      setSelectedInstitutions([]);
    }
  };

  const handleSendMessage = () => {
    setIsMessageDialogOpen(true);
  };

  const handleMessageSent = () => {
    setIsMessageDialogOpen(false);
    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedInstitutions.length} institution(s).`,
    });
    setSelectedInstitutions([]);
  };

  const clearFilters = () => {
    setUserTypeFilter(null);
    setDateFilter(null);
    setVerificationStatusFilter(null);
  };

  return (
    <div className="p-5">
      <h1 className="mb-3 text-2xl font-bold">Institutions</h1>
      <h2 className="mb-5 text-lg text-primary">
        All Institutions - Page {paginationInfo.currentPage} of{" "}
        {paginationInfo.totalPages}
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder="Search by name, email..."
            className="w-64"
          />
          
          <FilterDropdowns 
            userTypeFilter={userTypeFilter}
            setUserTypeFilter={setUserTypeFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            verificationStatusFilter={verificationStatusFilter}
            setVerificationStatusFilter={setVerificationStatusFilter}
            clearFilters={clearFilters}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button 
            className="bg-primary text-white"
            onClick={handleSendMessage}
            disabled={selectedInstitutions.length === 0}
          >
            Send Message
          </Button>
          
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 py-8">
          Loading institutions...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
      ) : mappedInstitutions.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No institutions found.
        </p>
      ) : (
        <>
          <InstitutionTable 
            institutions={mappedInstitutions}
            selectedInstitutions={selectedInstitutions}
            onSelectInstitution={handleSelectInstitution}
            onSelectAll={handleSelectAll}
            onViewInstitution={handleViewInstitution}
            onDeleteInstitution={handleDeleteClick}
          />

          <div className="flex justify-between items-center mt-8">
            <PaginationControls
              paginationInfo={paginationInfo}
              onPageChange={goToPage}
            />
          </div>
        </>
      )}

      {/* Institution Profile Dialog */}
      {selectedInstitution && (
        <InstitutionProfile
          institution={selectedInstitution}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onDelete={() => handleDeleteClick(selectedInstitution.id)}
          onUpdateStatus={handleUpdateVerificationStatus}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        institutionUsername={mappedInstitutions.find(i => i.id === institutionToDelete)?.username || ""}
      />

      {/* Message Dialog */}
      <MessageDialog
        isOpen={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        onSend={handleMessageSent}
        recipients={selectedInstitutions.map(id => 
          mappedInstitutions.find(institution => institution.id === id)
        ).filter(Boolean)}
      />
    </div>
  );
}
