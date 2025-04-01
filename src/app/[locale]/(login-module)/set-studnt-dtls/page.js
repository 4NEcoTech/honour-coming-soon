'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMultiStepForm } from '@/hooks/useMultiStepForm';
import AddressDetails from './addrss-dtls6043/AddressDetails';
import EducationalDetails from './edu-stls6044/EducationalDetails';
import PersonalDetails from './prsnl-dtls6042/PersonalDetails';
import SocialLinks from './socl-lnks6045/SocialLinks';

const tabs = [
  { id: 'personal', label: 'Personal Details' },
  { id: 'address', label: 'Address Details' },
  { id: 'educational', label: 'Educational Details' },
  { id: 'social', label: 'Social Links' },
];

export default function ProfilePage() {
  const { activeTab, formData, isSubmitting, handleStepSubmit, setActiveTab } =
    useMultiStepForm();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <Progress value={Object.keys(formData).length * 25} className="h-2" />
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full">
            <TabsList className="w-full mb-16 grid grid-cols-2 gap-2 sm:flex sm:justify-center">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} forceMount>
              {activeTab === 'personal' && (
                <PersonalDetails
                  initialData={formData}
                  onSubmit={handleStepSubmit}
                />
              )}
              {activeTab === 'address' && (
                <AddressDetails
                  initialData={formData}
                  onSubmit={handleStepSubmit}
                />
              )}
              {activeTab === 'educational' && (
                <EducationalDetails
                  initialData={formData}
                  onSubmit={handleStepSubmit}
                />
              )}
              {activeTab === 'social' && (
                <SocialLinks
                  initialData={formData}
                  onSubmit={handleStepSubmit}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
