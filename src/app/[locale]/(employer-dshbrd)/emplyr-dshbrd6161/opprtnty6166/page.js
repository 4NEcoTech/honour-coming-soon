"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight, MoreVertical, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const OpportunityCard = ({ opportunity, onEdit, onDelete }) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/employee/v1/hcjBrBT61821JobPostings/${opportunity._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Opportunity deleted successfully",
        });
        onDelete(opportunity._id);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete opportunity",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the opportunity",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs text-primary font-medium capitalize">
            {opportunity.HCJ_JP_Opportunity_Type}
          </span>
          <h3 className="text-lg font-semibold mt-1">
            {opportunity.HCJ_JP_Job_Title}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(opportunity._id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center text-gray-500 mb-4">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-sm">{opportunity.HCJ_JDT_Job_Location}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {opportunity.HCJ_JDT_Job_Status === "active" && (
            <span className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm text-green-500">Live</span>
            </span>
          )}
          {opportunity.HCJ_JDT_Job_Status === "draft" && (
            <span className="flex items-center">
              <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm text-primary">Draft</span>
            </span>
          )}
          {["expired", "closed", "deleted"].includes(
            opportunity.HCJ_JDT_Job_Status
          ) && (
            <span className="flex items-center">
              <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
              <span className="text-sm text-red-500 capitalize">
                {opportunity.HCJ_JDT_Job_Status}
              </span>
            </span>
          )}
        </div>

        {/* <Button
          variant="ghost"
          size="sm"
          className="text-primary p-0"
          onClick={() => onEdit(opportunity._id)}
        >
          <span className="mr-1">Edit</span>
          <ChevronRight className="h-4 w-4" />
        </Button> */}

        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-600 hover:bg-blue-50 mt-3"
          onClick={() => router.push(`/emplyr-dshbrd6161/applications6164/${opportunity._id}`)}
        >
          View Applications
        </Button>
      </div>
    </div>
  );
};

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch opportunities from API
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);

        const statusMap = {
          All: "all", // ← will not apply status filter
          Live: "active",
          Drafts: "draft",
          Expired: "deleted", // ← new tab
        };

        const status = statusMap[activeTab];
        const url =
          "/api/employee/v1/hcjBrBT61821JobPostings" +
          (status ? `?status=${status}` : "");

        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setOpportunities(data);
        } else if (Array.isArray(data.data)) {
          setOpportunities(data.data);
        } else {
          setOpportunities([]); // fallback
        }
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [activeTab]);

  const handleAddNew = () => {
    router.push("/emplyr-dshbrd6161/post-oppartunity6182");
  };

  const handleEdit = (id) => {
    router.push(`/emplyr-dshbrd6161/post-oppartunity6182?id=${id}`);
  };

  const handleDelete = (id) => {
    setOpportunities((prev) => prev.filter((opp) => opp._id !== id));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {["All", "Live", "Drafts", "Expired/Closed"].map((tab) => (
            <Skeleton key={tab} className="h-10 w-20" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Error loading opportunities
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Opportunities</h1>
        <div className="flex gap-3">
          <Button className="bg-primary" onClick={handleAddNew}>
            Add new opportunity
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            Filters
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["All", "Live", "Drafts", "Expired"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            variant={activeTab === tab ? "default" : "outline"}
            className={`${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-white text-gray-700"
            } rounded-md`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Opportunities grid */}

      {opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity._id}
              opportunity={opportunity}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No opportunities found</h3>
          <p className="text-gray-500 mb-4">
            {activeTab === "All"
              ? "You haven't created any opportunities yet"
              : `You don't have any ${activeTab.toLowerCase()} opportunities`}
          </p>
          <Button onClick={handleAddNew}>Create New Opportunity</Button>
        </div>
      )}
    </div>
  );
}
