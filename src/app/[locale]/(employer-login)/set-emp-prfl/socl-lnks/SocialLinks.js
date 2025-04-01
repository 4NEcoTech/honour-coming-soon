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
  X,
  Linkedin,
  Instagram,
  Globe,
  Facebook,
  Twitter,
  Pinterest,
  Link,
  User,
} from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

const socialPlatforms = [
  {
    value: "linkedin",
    label: "LinkedIn URL",
    icon: <Linkedin className="h-5 w-5" />,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    value: "eco",
    label: "Eco Link",
    icon: <Globe className="h-5 w-5" />,
    placeholder: "https://example.com/eco-link",
  },
  {
    value: "website",
    label: "Website URL",
    icon: <Globe className="h-5 w-5" />,
    placeholder: "https://example.com",
  },
  {
    value: "instagram",
    label: "Instagram URL",
    icon: <Instagram className="h-5 w-5" />,
    placeholder: "https://instagram.com/username",
  },
  {
    value: "facebook",
    label: "Facebook URL",
    icon: <Facebook className="h-5 w-5" />,
    placeholder: "https://facebook.com/username",
  },
  {
    value: "twitter",
    label: "Twitter URL",
    icon: <Twitter className="h-5 w-5" />,
    placeholder: "https://twitter.com/username",
  },
  {
    value: "pinterest",
    label: "Pinterest URL",
    icon: <Link className="h-5 w-5" />,
    placeholder: "https://pinterest.com/username",
  },
  {
    value: "custom",
    label: "Custom URL",
    icon: <Link className="h-5 w-5" />,
    placeholder: "https://example.com/custom",
  },
  {
    value: "portfolio",
    label: "Portfolio URL",
    icon: <User className="h-5 w-5" />,
    placeholder: "https://example.com/portfolio",
  },
];

export default function SocialLinks({
  initialData,
  isSubmitting,
  onSubmit,
  onBack,
}) {
  const [profiles, setProfiles] = React.useState(initialData?.profiles || []);

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

  const handleSubmit = () => {
    onSubmit({ profiles });
  };

  return (
    <div className="space-y-6 p-4 max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-primary'>Social Profile Name</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="relative w-full">
                        <SelectValue placeholder="Select Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatforms.map((item, ind) => (
                          <SelectItem
                            value={item.value}
                            key={item.value || ind}
                            disabled={profiles.some(
                              (profile) => profile.platform === item.value
                            )}
                          >
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
                    <FormLabel className='text-primary'>Profile URL</FormLabel>
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
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="button" onClick={handleAddProfile} className="w-full">
            Add
          </Button>
        </form>
      </Form>

      <div className="space-y-2">
        {profiles.map((profile, index) => {
          const platform = socialPlatforms.find(
            (p) => p.value === profile.platform
          );
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {platform?.icon}
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate w-56 sm:w-full">
                  {profile.url}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveProfile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
        <Button
          type="button"
          className="w-full sm:w-auto bg-primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting" : "Complete Profile"}
        </Button>
      </div>
    </div>
  );
}
