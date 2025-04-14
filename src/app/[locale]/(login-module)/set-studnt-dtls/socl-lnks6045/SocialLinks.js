"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Facebook,
  Globe,
  Instagram,
  Link,
  Linkedin,
  Loader2,
  Twitter,
  User,
  X,
} from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { FaSquarePinterest } from "react-icons/fa6";

const socialPlatforms = [
  {
    value: "linkedin",
    label: "LinkedIn URL",
    icon: <Linkedin className="h-5 w-5 text-blue-600" />,
    placeholder: "https://linkedin.com/in/username",
    apiField: "SL_LinkedIn_Profile",
  },
  {
    value: "website",
    label: "Website URL",
    icon: <Globe className="h-5 w-5 text-blue-500" />,
    placeholder: "https://example.com",
    apiField: "SL_Website_Url",
  },
  {
    value: "instagram",
    label: "Instagram URL",
    icon: <Instagram className="h-5 w-5 text-pink-600" />,
    placeholder: "https://instagram.com/username",
    apiField: "SL_Instagram_Url",
  },
  {
    value: "facebook",
    label: "Facebook URL",
    icon: <Facebook className="h-5 w-5 text-blue-700" />,
    placeholder: "https://facebook.com/username",
    apiField: "SL_Facebook_Url",
  },
  {
    value: "twitter",
    label: "Twitter URL",
    icon: <Twitter className="h-5 w-5 text-blue-400" />,
    placeholder: "https://twitter.com/username",
    apiField: "SL_Twitter_Url",
  },
  {
    value: "pinterest",
    label: "Pinterest URL",
    icon: <FaSquarePinterest className="h-5 w-5 text-red-600" />,
    placeholder: "https://pinterest.com/username",
    apiField: "SL_Pinterest_Url",
  },
  {
    value: "custom",
    label: "Custom URL",
    icon: <Link className="h-5 w-5 text-purple-600" />,
    placeholder: "https://example.com/custom",
    apiField: "SL_Custom_Url",
  },
  {
    value: "portfolio",
    label: "Portfolio URL",
    icon: <User className="h-5 w-5 text-gray-600" />,
    placeholder: "https://example.com/portfolio",
    apiField: "SL_Portfolio_Url",
  },
];

export default function SocialLinks({ initialData, isSubmitting, onSubmit }) {
  const [profiles, setProfiles] = React.useState([]);

  const form = useForm({
    defaultValues: {
      platform: "",
      url: "",
    },
  });

  const handleAddProfile = () => {
    const data = form.getValues();
    if (data.platform && data.url) {
      setProfiles([...profiles, data]);
      form.reset();
    }
  };

  const handleRemoveProfile = (index) => {
    const newProfiles = [...profiles];
    newProfiles.splice(index, 1);
    setProfiles(newProfiles);
  };
  // console.log('object', profiles);

  const profileObject = profiles.reduce((acc, item) => {
    acc[item.platform] = item.url; // Set key as platform, value as URL
    return acc;
  }, {});
  // console.log('profileObject', profileObject);

  const handleSubmit = () => {
    onSubmit("social", profileObject);
  };

  React.useEffect(() => {
    const profilesArray = Object.entries(initialData)
      .filter(([key]) => key.startsWith("SL_"))
      .map(([platform, url]) => ({ platform, url }));
    console.log("profilesArray", profilesArray);
    if (profilesArray.length > 0) setProfiles(profilesArray);
  }, []);
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-primary">
                    Social Profile Name
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="relative ps-9">
                        <SelectValue placeholder="Select Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatforms.map((item, ind) => (
                          <SelectItem
                            value={item.apiField}
                            key={item.value || ind}
                            disabled={profiles.some(
                              (profile) => profile.platform === item.apiField
                            )}>
                            <div className="flex items-center space-x-3">
                              {item.icon}
                              <span className="truncate">{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Profile URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        form.watch("platform")
                          ? socialPlatforms.find(
                              (p) => p.value === form.watch("platform")
                            )?.placeholder
                          : "Paste your social profile url (e.g., social media, website, etc.)"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="button" onClick={handleAddProfile} className="w-full">
            Add
          </Button>
        </form>
      </Form>

      <div className="space-y-2">
        {profiles.map((profile, index) => {
          const platform = socialPlatforms.find(
            (p) => p.apiField === profile.platform
          );
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 overflow-hidden">
                {platform?.icon}
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate w-56 sm:w-full">
                  {profile?.url}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveProfile(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          // onClick={onBack}
          className="flex items-center justify-center gap-1 border-primary text-primary hover:bg-blue-50">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          className="flex items-center justify-center gap-1 text-white"
          onClick={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </div>
    </div>
  );
}
