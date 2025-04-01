"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import SkillsModal from "../../components/add-skills6089";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export default function SkillsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillsRecord, setSkillsRecord] = useState(null);
  const { toast } = useToast();
  const {data : session} =useSession()
  console.log(session)

  const searchParams = useSearchParams();
  // const individualId = searchParams.get("HCJ_SKT_Individual_Id");
  const individualId = session?.user?.individualId;

  // Fetch skills on component mount or when individualId changes
  useEffect(() => {
    const fetchSkills = async () => {
      if (!individualId) {
        setLoading(false);
        setError("Individual ID is required.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/student/v1/hcjBrBT60891AddSkills?HCJ_SKT_Individual_Id=${individualId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }

        const data = await response.json();

        if (data.success && data.skills && data.skills.length > 0) {
          // Get the most recent skills record
          const latestSkillsRecord = data.skills[data.skills.length - 1];
          setSkillsRecord(latestSkillsRecord);
          setSkills(latestSkillsRecord.HCJ_SKT_Skills || []);
        } else {
          // No skills found for this user
          setSkills([]);
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load skills. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [individualId, toast]);

  const handleSaveSkills = async (updatedSkills) => {
    if (!individualId) {
      toast({
        title: "Error",
        description: "Individual ID is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;
      if (skillsRecord) {
        // Update existing skills
        response = await fetch(
          `/api/student/v1/hcjBrBT60891AddSkills/${skillsRecord._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              HCJ_SKT_Skills: updatedSkills,
              HCJ_SKT_Industry: skillsRecord.HCJ_SKT_Industry || "General",
              HCJ_SKT_Session_Id:
                skillsRecord.HCJ_SKT_Session_Id || `session_${Date.now()}`,
            }),
          },
        );
      } else {
        // Create new skills
        response = await fetch("/api/student/v1/hcjBrBT60891AddSkills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            HCJ_SKT_Individual_Id: individualId,
            HCJ_SKT_Industry: "General",
            HCJ_SKT_Skills: updatedSkills,
            HCJ_SKT_Session_Id: `session_${Date.now()}`,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save skills");
      }

      const data = await response.json();

      if (data.success) {
        // Refetch skills to get the updated record
        const fetchResponse = await fetch(
          `/api/student/v1/hcjBrBT60891AddSkills?HCJ_SKT_Individual_Id=${individualId}`,
        );
        const fetchData = await fetchResponse.json();

        if (fetchData.success && fetchData.skills && fetchData.skills.length > 0) {
          const latestSkillsRecord = fetchData.skills[fetchData.skills.length - 1];
          setSkillsRecord(latestSkillsRecord);
          setSkills(updatedSkills);
        }

        toast({
          title: "Success",
          description: "Skills saved successfully!",
        });
      }
    } catch (err) {
      console.error("Error saving skills:", err);
      setError("Failed to save skills. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to save skills. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {/* Skills Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-primary">Skills</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit Skills
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading skills...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* No Individual ID Warning */}
        {!individualId && !loading && (
          <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
            No individual ID provided. Please include an HCJ_SKT_Individual_Id query parameter.
          </div>
        )}

        {/* Skills List */}
        {!loading && !error && (
          <div className="space-y-4">
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-800"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No skills added yet.</div>
            )}
          </div>
        )}

        {/* Skills Modal */}
        <SkillsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedSkills={skills}
          onSave={handleSaveSkills}
          isLoading={loading}
        />
      </div>
    </div>
  );
}