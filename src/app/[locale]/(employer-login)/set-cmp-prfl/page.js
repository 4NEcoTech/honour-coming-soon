"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import CompanyDetails from "./cmp-dtls/CompanyDetails";
import AddressDetails from "./addrss-dtls/AddressDetails";
import SocialLinks from "./socl-lnks/SocialLinks";

export default function Page() {
  const [activeTab, setActiveTab] = useState("company");
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    company: {},
    address: {},
    social: {},
  });

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      updateProgress(parsedData);
    }
  }, []);

  useEffect(() => {
    console.log("Updated Form Data:", formData);
  }, [formData]);

  const updateProgress = (data) => {
    const steps = ["company", "address", "social"];
    const completedSteps = steps.filter(
      (step) => Object.keys(data[step] || {}).length > 0
    ).length;
    setProgress((completedSteps / steps.length) * 100);
  };

  const updateFormData = (step, data) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [step]: data };
      localStorage.setItem("formData", JSON.stringify(newFormData));
      updateProgress(newFormData);
      return newFormData;
    });
  };

  const tabs = [
    { id: "company", label: "Company Details" },
    { id: "address", label: "Address Details" },
    { id: "social", label: "Social Links" },
  ];

  const canNavigateToTab = (tabId) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    return tabs.slice(0, tabIndex).every((tab) => Object.keys(formData[tab.id] || {}).length > 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Complete Company Profile</CardTitle>
            <Button variant="link" className="text-primary">
              Skip for now <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={!canNavigateToTab(tab.id)}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Company Details */}
            <TabsContent value="company">
              <CompanyDetails
                onNext={(data) => {
                  updateFormData("company", data);
                  setActiveTab("address");
                }}
                initialData={formData.company}
              />
            </TabsContent>

            {/* Address Details */}
            <TabsContent value="address">
              <AddressDetails
                onNext={(data) => {
                  updateFormData("address", data);
                  setActiveTab("social");
                }}
                onBack={() => setActiveTab("company")}
                initialData={formData.address}
              />
            </TabsContent>

            {/* Social Links */}
            <TabsContent value="social">
              <SocialLinks
                onSubmit={(data) => {
                  updateFormData("social", data);
                  console.log("Final form data:", { ...formData, social: data });
                }}
                onBack={() => setActiveTab("address")}
                initialData={formData.social}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
