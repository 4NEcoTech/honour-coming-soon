"use client";

import { useState, useEffect } from "react";
import { X, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";

export default function SkillsPopup({
  isOpen,
  onClose,
  selectedSkills = [],
  onSave,
  isLoading = false,
}) {
  const [skills, setSkills] = useState(selectedSkills);
  const [searchQuery, setSearchQuery] = useState("");

  // Update local skills when selectedSkills prop changes
  useEffect(() => {
    setSkills(selectedSkills);
  }, [selectedSkills]);

  const suggestedSkills = [
    "Financial Modeling",
    "Tally",
    "SAP FICO",
    "Taxation",
    "GST Filing",
    "Budgeting",
    "Auditing",
    "CFA",
    "CPA",
    "QuickBooks",
    "Supply Chain Management",
    "Logistics",
    "Inventory Management",
    "Procurement",
    "Lean Manufacturing",
    "Warehouse Management",
    "English Proficiency",
    "Spanish",
    "French",
    "German",
    "Mandarin",
    "Hindi",
    "Arabic",
    "Translation",
    "Strategic Planning",
    "Team Management",
    "Conflict Resolution",
    "Change Management",
    "Stakeholder Engagement",
    "Risk Management",
    "Retail Management",
    "Hospitality",
    "Tourism Management",
    "Aviation",
    "Banking Operations",
    "Insurance",
    "Blockchain",
    "IoT",
    "Quantum Computing",
    "5G Technology",
    "AR/VR Development",
    "Metaverse",
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "PHP",
    "Django",
    "Ruby on Rails",
    "Bootstrap",
    "RESTful APIs",
    "Digital Marketing",
    "Content Marketing",
    "SEO",
    "SEM",
    "Social Media Marketing",
    "Google Ads",
    "Email Marketing",
    "Branding",
    "CRM",
    "Property Management",
    "Real Estate Sales",
    "Valuation",
    "Site Supervision",
    "Construction Management",
    "Communication",
    "Problem-Solving",
    "Teamwork",
    "Emotional Intelligence",
    "Adaptability",
    "Critical Thinking",
    "Time Management",
    "Machine Learning",
    "Data Analysis",
    "Data Visualization",
    "Power BI",
    "Tableau",
    "R",
    "AI",
    "NLP",
    "Big Data (Hadoop, Spark)",
    "Statistics",
    "Customer Relationship Management",
    "Escalation Handling",
    "Call Center Management",
    "Conflict Resolution",
    "Customer Retention",
    "Corporate Law",
    "Contract Management",
    "Legal Research",
    "Compliance",
    "Intellectual Property",
    "Drafting",
    "Negotiations",
    "Networking",
    "Ethical Hacking",
    "Linux",
    "Kubernetes",
    "Docker",
    "VMware",
    "Automation Tools",
    "Android Development (Java, Kotlin)",
    "iOS Development (Swift, Objective-C)",
    "Flutter",
    "React Native",
    "AutoCAD",
    "MATLAB",
    "SolidWorks",
    "CAD",
    "Embedded Systems",
    "Electronics Design",
    "Robotics",
    "Circuit Design",
    "Graphic Design",
    "UI/UX Design",
    "Video Editing",
    "Motion Graphics",
    "3D Modeling",
    "Adobe Suite (Photoshop, Illustrator, After Effects)",
    "Figma",
    "Nursing",
    "Clinical Research",
    "Medical Coding",
    "Health Informatics",
    "Pharmacy",
    "Biomedical Engineering",
    "Lead Generation",
    "B2B Sales",
    "B2C Sales",
    "Account Management",
    "Negotiation",
    "Salesforce",
    "HubSpot",
    "Market Research",
    "Recruitment",
    "Talent Acquisition",
    "Payroll Management",
    "HR Analytics",
    "Employee Engagement",
    "Organizational Development",
    "Python",
    "Java",
    "C++",
    "SQL",
    "C#",
    ".NET",
    "Full Stack Development",
    "Cloud Computing (AWS, Azure, GCP)",
    "Cybersecurity",
    "SAP",
    "DevOps",
    "Teaching",
    "Curriculum Development",
    "E-Learning",
    "Instructional Design",
    "Training Facilitation",
    "PMP",
    "Six Sigma",
    "AWS Certified Solutions Architect",
    "ITIL",
    "CISSP",
    "CFA",
    "Google Ads Certification",
    "Scrum Master (CSM)",
  ].filter(
    (skill) =>
      !skills.includes(skill) &&
      (searchQuery === "" ||
        skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddSkill = (skill) => {
    if (skills.length < 10) {
      setSkills([...skills, skill]);
      setSearchQuery("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = () => {
    onSave(skills);
  };

  const handleAddCustomSkill = () => {
    if (searchQuery && !skills.includes(searchQuery) && skills.length < 10) {
      setSkills([...skills, searchQuery]);
      setSearchQuery("");
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      animation="zoom"
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Skills</h2>
          <p className="text-sm text-muted-foreground">
            You can add up to 10 skills. Remove selected skills and add new
            ones.
          </p>
        </div>
      }
    >
      <div className="p-6">
        <div className="space-y-6">
          {/* Selected Skills */}
          <div>
            <label className="font-medium block mb-3 text-primary">
              Your Skills
            </label>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {skills.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No skills selected yet
                </p>
              ) : (
                skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm gap-1.5 group hover:bg-muted/80"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="opacity-60 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove ${skill}`}
                      disabled={isLoading}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="font-medium block text-primary">
              Search or Add Skills
            </label>
            <div className="relative">
              <Input
                placeholder="Type to search or add a new skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchQuery &&
                !suggestedSkills.some(
                  (skill) => skill.toLowerCase() === searchQuery.toLowerCase()
                ) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 text-xs"
                    onClick={handleAddCustomSkill}
                    disabled={skills.length >= 10 || isLoading}
                  >
                    Add
                  </Button>
                )}
            </div>
            {skills.length >= 10 && (
              <p className="text-amber-500 text-sm">
                Maximum 10 skills allowed
              </p>
            )}
          </div>

          {/* Suggested Skills */}
          {suggestedSkills.length > 0 && (
            <div className="space-y-2">
              <label className="font-medium block text-primary">
                Suggested Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.slice(0, 12).map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    className="gap-1 h-8"
                    onClick={() => handleAddSkill(skill)}
                    disabled={skills.length >= 10 || isLoading}
                  >
                    {skill}
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
