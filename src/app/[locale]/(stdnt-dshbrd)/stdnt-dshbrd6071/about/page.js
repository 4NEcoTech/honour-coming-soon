"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddLanguagePopup from "../../components/add-language6087";
import AddAboutPopup from "../../components/add-about6085";
import AddEducationPopup from "../../components/add-education6086";
import VolunteeringPopup from "../../components/add-volunteering6091";
import WorkExperiencePopup from "../../components/add-work-experience6092";
import SocialPopup from "../../components/add-social6090";
import ProjectPopup from "../../components/add-project6088";
import AddSkillsPopup from "../../components/add-skills6089";

export default function Home() {
  const [activePopup, setActivePopup] = useState(null);

  const openPopup = (popupName) => {
    setActivePopup(popupName);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const handleSubmit = (data) => {
    console.log(`${activePopup} data submitted:`, data);
    closePopup();
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Profile Forms</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button
            onClick={() => openPopup("language")}
            className="h-auto py-6 flex flex-col gap-2"
            variant="outline"
          >
            <span className="text-lg font-medium">Languages</span>
            <span className="text-sm text-muted-foreground">
              Add languages you know
            </span>
          </Button>

          <Button
            onClick={() => openPopup("about")}
            className="h-auto py-6 flex flex-col gap-2"
            variant="outline"
          >
            <span className="text-lg font-medium">About</span>
            <span className="text-sm text-muted-foreground">
              Tell about yourself
            </span>
          </Button>

          <Button
            onClick={() => openPopup("skills")}
            className="h-auto py-6 flex flex-col gap-2"
            variant="outline"
          >
            <span className="text-lg font-medium">Skills</span>
            <span className="text-sm text-muted-foreground">
              Add your professional skills
            </span>
          </Button>

          <Button
            onClick={() => openPopup("education")}
            className="h-auto py-6 flex flex-col gap-2"
            variant="outline"
          >
            <span className="text-lg font-medium">Education</span>
            <span className="text-sm text-muted-foreground">
              Add your educational background
            </span>
          </Button>

          <Button
            onClick={() => openPopup("volunteering")}
            className="h-auto py-6 flex flex-col gap-2"
            variant="outline"
          >
            <span className="text-lg font-medium">Volunteering</span>
            <span className="text-sm text-muted-foreground">
              Add volunteering experience
            </span>
          </Button>

          <Button
            onClick={() => openPopup("work")}
            className="h-auto py-6 flex flex-col gap-2"
            variant="outline"
          >
            <span className="text-lg font-medium">Work Experience</span>
            <span className="text-sm text-muted-foreground">
              Add your work history
            </span>
          </Button>

          <Button
            onClick={() => openPopup("social")}
            className="h-auto py-6 flex flex-col gap-2"
            variant="outline"
          >
            <span className="text-lg font-medium">Social Links</span>
            <span className="text-sm text-muted-foreground">
              Add your social profiles
            </span>
          </Button>

          <Button
            onClick={() => openPopup("project")}
            className="h-auto py-6 flex flex-col gap-2"
            variant="outline"
          >
            <span className="text-lg font-medium">Projects</span>
            <span className="text-sm text-muted-foreground">
              Add your portfolio projects
            </span>
          </Button>
        </div>
      </div>

      {/* Popups */}
      <AddLanguagePopup
        isOpen={activePopup === "language"}
        onClose={closePopup}
        onSubmit={handleSubmit}
      />

      <AddAboutPopup
        isOpen={activePopup === "about"}
        onClose={closePopup}
        onSubmit={handleSubmit}
      />

      <AddSkillsPopup
        isOpen={activePopup === "skills"}
        onClose={closePopup}
        onSave={handleSubmit}
        selectedSkills={[]}
      />

      <AddEducationPopup
        isOpen={activePopup === "education"}
        onClose={closePopup}
        onSubmit={handleSubmit}
      />

      <VolunteeringPopup
        isOpen={activePopup === "volunteering"}
        onClose={closePopup}
        onSubmit={handleSubmit}
      />

      <WorkExperiencePopup
        isOpen={activePopup === "work"}
        onClose={closePopup}
        onSubmit={handleSubmit}
      />

      <SocialPopup
        isOpen={activePopup === "social"}
        onClose={closePopup}
        onSubmit={handleSubmit}
      />

      <ProjectPopup
        isOpen={activePopup === "project"}
        onClose={closePopup}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
