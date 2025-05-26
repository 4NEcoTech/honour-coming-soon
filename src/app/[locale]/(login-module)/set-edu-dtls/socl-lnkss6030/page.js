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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  Facebook,
  Globe,
  Instagram,
  Link,
  Linkedin,
  PlusCircle,
  Twitter,
  User,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const socialSchema = (t) =>
  z.object({
    platform: z.string().min(1, t("6030_1")),
    url: z.string().url(t("6030_2")),
  });

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
    icon: <Globe className="h-5 w-5 text-bg-primary" />,
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
    icon: <Link className="h-5 w-5 text-red-600" />,
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

export default function SocialLinksTab({
  initialData,
  isSubmitting,
  onSubmit,
  onBack,
}) {
  const [profiles, setProfiles] = React.useState(initialData?.profiles || []);
  const tForm = useTranslations("formErrors");

  const form = useForm({
    resolver: zodResolver(socialSchema(tForm)),
    mode: "onChange",
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

  const handleSubmit = () => {
    // Pass the profiles array directly, not wrapped in an object
    onSubmit(profiles);
  };

  return (
    <div className="space-y-6 p-2 sm:p-4 max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-1">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-bg-primary font-medium">
                    Social Profile Name
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="relative w-full rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400">
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

            <div className="grid gap-4 sm:grid-cols-1">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bg-primary font-medium">
                      Profile URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={
                          form.watch("platform")
                            ? socialPlatforms.find(
                                (p) => p.value === form.watch("platform")
                              )?.placeholder
                            : "Paste your social profile URL"
                        }
                        className="w-full rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddProfile}
            className="w-full flex items-center justify-center gap-2"
            disabled={!form.watch("platform") || !form.watch("url")}>
            <PlusCircle className="h-4 w-4" /> Add Profile
          </Button>
        </form>
      </Form>

      <div className="space-y-3 mt-8">
        <h3 className="text-gray-700 font-medium">Added Profiles</h3>
        {profiles.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No profiles added yet</p>
        ) : (
          profiles.map((profile, index) => {
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
          })
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center justify-center gap-1 border border-primary">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          className="flex items-center justify-center gap-1 bg-primary"
          onClick={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Complete Profile"}
        </Button>
      </div>
    </div>
  );
}
