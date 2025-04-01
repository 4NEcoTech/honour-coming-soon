'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useRouter } from '@/i18n/routing';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AddressDetails from './addrss-dtls6025/page';
import PersonalDetails from './prsnl-dtls6024/page';
import SocialLinks from './socl-lnks6026/page';

export default function Page() {
  const [activeTab, setActiveTab] = useState('personal');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    personal: null,
    address: null,
    social: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, update } = useSession();
  // console.log(session)

  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      updateProgress(parsedData);
    }
  }, []);

  const updateProgress = (data) => {
    const steps = ['personal', 'address', 'social'];
    const completedSteps = steps.filter((step) => data[step] !== null).length;
    setProgress((completedSteps / steps.length) * 100);
  };

  const updateFormData = (step, data) => {
    setFormData((prev) => {
      // For social step, data is already an array of profiles
      const newFormData = { ...prev, [step]: data };
      localStorage.setItem('formData', JSON.stringify(newFormData));
      updateProgress(newFormData);
      return newFormData;
    });
  };

  const tabs = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'address', label: 'Address Details' },
    { id: 'social', label: 'Social Links' },
  ];

  const canNavigateToTab = (tabId) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    return tabs.slice(0, tabIndex).every((tab) => formData[tab.id] !== null);
  };

  const handleSubmitProfile = async () => {
    if (!formData.personal || !formData.address) {
      toast({
        title: 'Missing information',
        description: 'Please complete all required sections before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object for multipart/form-data submission
      const submitData = new FormData();

      // Add personal details
      submitData.append('ID_User_Id', session.user.id);
      submitData.append('ID_First_Name', formData.personal.firstName);
      submitData.append('ID_Last_Name', formData.personal.lastName);
      submitData.append('ID_Phone', formData.personal.phone);
      submitData.append('ID_Email', formData.personal.corporateEmail);
      submitData.append(
        'ID_Gender',
        formData.personal.gender || 'Not Specified'
      );
      submitData.append('ID_DOB', formData.personal.dob || '');

      if (formData.personal.designation) {
        submitData.append(
          'ID_Individual_Designation',
          formData.personal.designation
        );
      }

      if (formData.personal.profileHeadline) {
        submitData.append(
          'ID_Profile_Headline',
          formData.personal.profileHeadline
        );
      }

      // Add profile picture if available
      if (formData.personal.photo instanceof File) {
        submitData.append('ID_Profile_Picture', formData.personal.photo);
      }

      // Add address details
      submitData.append('IAD_Address_Line1', formData.address.addressLine1);
      submitData.append('IAD_City', formData.address.city);
      submitData.append('IAD_State', formData.address.state);
      submitData.append('IAD_Country', formData.address.country);
      submitData.append('IAD_Pincode', formData.address.pincode);

      if (formData.address.addressLine2) {
        submitData.append('IAD_Address_Line2', formData.address.addressLine2);
      }

      if (formData.address.landmark) {
        submitData.append('IAD_Landmark', formData.address.landmark);
      }

      console.log('before social', formData.social);
      if (formData.social) {
        const profileObject = formData.social.reduce((acc, item) => {
          acc[item.platform] = item.url; // Set key as platform, value as URL
          return acc;
        }, {});

        // Add social links if available
        if (Array.isArray(formData.social) && formData.social.length > 0) {
          submitData.append('SL_Social_Profile_Name', 'social Data');
          Object.keys(profileObject).forEach((key) => {
            submitData.append(key, profileObject[key]);
          });
        }
      }

      // Submit to API
      const response = await fetch(
        '/api/institution/v1/hcjBrBT60241CreateAdminProfile',
        {
          method: 'POST',
          body: submitData,
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Your profile has been created successfully.',
        });

        // Clear local storage after successful submission
        localStorage.removeItem('formData');

        // Optional: redirect to dashboard or another page

        // Setting Individual_id in the session
        update({
          ...session,
          user: {
            ...session.user,
            individualId: result.individualId,
            profileUrl: result.profileUrl,
            qrCodeUrl: result.qrCodeUrl,
            hasProfilePicture: result.hasProfilePicture,
          },
        });
        router.push('/admin-dcmnt6027');
      } else {
        throw new Error(result.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      toast({
        title: 'Error',
        description:
          error.message ||
          'There was a problem creating your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
console.log(formData?.social);
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            {/* <Button variant="link" className="text-primary">
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

            <TabsContent value="personal">
              <PersonalDetails
                onSubmit={(data) => {
                  updateFormData('personal', data);
                  setActiveTab('address');
                }}
                initialData={formData.personal}
                isSubmitting={false}
              />
            </TabsContent>

            <TabsContent value="address">
              <AddressDetails
                onSubmit={(data) => {
                  updateFormData('address', data);
                  setActiveTab('social');
                }}
                onBack={() => setActiveTab('personal')}
                initialData={formData.address}
                isSubmitting={false}
              />
            </TabsContent>

            <TabsContent value="social">
              <SocialLinks
                onSubmit={(data) => {
                  updateFormData('social', data);
                  handleSubmitProfile();
                }}
                onBack={() => setActiveTab('address')}
                initialData={formData.social}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
