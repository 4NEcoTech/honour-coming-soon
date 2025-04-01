'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useRouter } from '@/i18n/routing';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AddressDetailsTab from './addrss-dtls6029/page';
import EducationalDetailsTab from './edu-dtls6028/page';
import SocialLinksTab from './socl-lnkss6030/page';

export default function Page() {
  const [activeTab, setActiveTab] = useState('educationalDetails');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    educationalDetails: null,
    addressDetails: null,
    socialIcons: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();
  // console.log(formData.educationalDetails, ' [formData] ');

  useEffect(() => {
    const savedData = localStorage.getItem('eduProfileData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      updateProgress(parsedData);
    }
  }, []);

  const updateProgress = (data) => {
    const steps = ['educationalDetails', 'addressDetails', 'socialIcons'];
    const completedSteps = steps.filter((step) => data[step] !== null).length;
    setProgress((completedSteps / steps.length) * 100);
  };

  const updateFormData = (step, data) => {
    console.log(` [updateFormData] Updating ${step}:`, data);
    setFormData((prev) => {
      const newFormData = { ...prev, [step]: data };
      localStorage.setItem('eduProfileData', JSON.stringify(newFormData));
      updateProgress(newFormData);
      return newFormData;
    });
  };

  const tabs = [
    { id: 'educationalDetails', label: 'Educational Details' },
    { id: 'addressDetails', label: 'Address Details' },
    { id: 'socialIcons', label: 'Social Links' },
  ];

  const canNavigateToTab = (tabId) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    return tabs.slice(0, tabIndex).every((tab) => formData[tab.id] !== null);
  };

  const handleSkip = () => {
    localStorage.removeItem('eduProfileData');
    router.push('/institutn-dshbrd6051');
  };

  const handleSubmitProfile = async () => {
    if (!formData.educationalDetails || !formData.addressDetails) {
      toast({
        title: 'Missing information',
        description: 'Please complete all required sections before submitting.',
        variant: 'destructive',
      });
      return;
    }

    // Check if socialIcons exists and is valid
    if (
      !Array.isArray(formData.socialIcons) ||
      formData.socialIcons.length === 0
    ) {
      toast({
        title: 'Missing Social Links',
        description:
          'Please add at least one social profile before submitting.',
        variant: 'destructive',
      });
      return;
    }

    // If all validations pass, proceed with submission
    // console.log('📌 [handleSubmitProfile] Submitting formData:', formData);
    submitProfile(formData);
  };

  const submitProfile = async (latestFormData) => {
    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      submitData.append('CD_User_Id', session.user.individualId);
      submitData.append(
        'CD_Company_Name',
        latestFormData.educationalDetails.institutionName
      );
      submitData.append(
        'CD_Company_Type',
        latestFormData.educationalDetails.institutionType
      );
      submitData.append(
        'CD_Company_Establishment_Year',
        latestFormData.educationalDetails.establishmentYear
      );
      submitData.append(
        'CD_Company_Email',
        latestFormData.educationalDetails.institutionEmail
      );
      submitData.append(
        'CD_Phone_Number',
        latestFormData.educationalDetails.phoneNumber
      );
      submitData.append(
        'CD_Company_Website',
        latestFormData.educationalDetails.websiteUrl || ''
      );

      if (latestFormData.educationalDetails.uploadedFile) {
        submitData.append(
          'CD_Company_Logo',
          latestFormData.educationalDetails.uploadedFile
        );
      }

      submitData.append(
        'CAD_Address_Line1',
        latestFormData.addressDetails.addressLine1
      );
      submitData.append('CAD_City', latestFormData.addressDetails.city);
      submitData.append('CAD_State', latestFormData.addressDetails.state);
      submitData.append('CAD_Country', latestFormData.addressDetails.country);
      submitData.append('CAD_Pincode', latestFormData.addressDetails.pincode);

      const profileObject = latestFormData.socialIcons.reduce((acc, item) => {
        acc[item.platform] = item.url; // Set key as platform, value as URL
        return acc;
      }, {});
      if (
        Array.isArray(latestFormData.socialIcons) &&
        latestFormData.socialIcons.length > 0
      ) {
        submitData.append('SL_Social_Profile_Name', 'social Data');
        Object.keys(profileObject).forEach((key) => {
          submitData.append(key, profileObject[key]);
        });
      }

      // console.log('🔍 Logging FormData before submission:');
      // for (const [key, value] of submitData.entries()) {
      //   console.log(`📝 ${key}:`, value);
      // }

      const response = await fetch(
        '/api/institution/v1/hcjBrBT60281CreateInstitutionProfile',
        {
          method: 'POST',
          body: submitData,
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Institution profile created successfully.',
        });

        // Setting Individual_id in the session
        update({
          ...session,
          user: { ...session.user, companyId: result.companyId },
        });

        router.push('/cmpny-dcmnt6031');
        localStorage.removeItem('eduProfileData');
      } else {
        throw new Error(result.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'Failed to create institution profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-2xl">
              Create Educational Institution Profile
            </CardTitle>
            {/* <Button
              variant="link"
              className="text-primary"
              onClick={handleSkip}>
              Skip for now <ChevronRight className="ml-1 h-4 w-4" />
            </Button> */}
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={!canNavigateToTab(tab.id)}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-base">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="educationalDetails">
              <EducationalDetailsTab
                onSubmit={(data) => {
                  updateFormData('educationalDetails', data);
                  setActiveTab('addressDetails');
                }}
                initialData={formData.educationalDetails}
              />
            </TabsContent>

            <TabsContent value="addressDetails">
              <AddressDetailsTab
                onSubmit={(data) => {
                  updateFormData('addressDetails', data);
                  setActiveTab('socialIcons');
                }}
                onBack={() => setActiveTab('educationalDetails')}
                initialData={formData.addressDetails}
              />
            </TabsContent>

            <TabsContent value="socialIcons">
              <SocialLinksTab
                onSubmit={(data) => {
                  updateFormData('socialIcons', data);
                  handleSubmitProfile();
                }}
                onBack={() => setActiveTab('addressDetails')}
                initialData={formData.socialIcons}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
