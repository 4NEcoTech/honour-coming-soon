'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CompanyDetails({ initialData, isSubmitting, onNext }) {
  const [uploadedFile, setUploadedFile] = React.useState(null);

  const form = useForm({
    defaultValues: {
      companyName: initialData?.companyName || '',
      logo: null,
      aboutCompany: initialData?.aboutCompany || '',
      companySize: initialData?.companySize || '',
      companyType: initialData?.companyType || 'private',
      companyEmail: initialData?.companyEmail || '',
      alternateEmail: initialData?.alternateEmail || '',
      phone: initialData?.phone || '',
      alternatePhone: initialData?.alternatePhone || '',
      industry: initialData?.industry || '',
      subIndustry: initialData?.subIndustry || '',
      companyWebsite: initialData?.companyWebsite || '',
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onNext(data))} className="space-y-4 p-4 max-w-xl mx-auto">
        <FormField control={form.control} name="companyName" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>Company Name <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input {...field} placeholder="Your company name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="uploadLogo" className="text-primary">
                Upload Logo
              </FormLabel>
              <FormControl>
                <div
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center"
                  onClick={() => document.getElementById('uploadLogo')?.click()}
                >
                  <Image
                    src="/image/info/upload.svg"
                    alt="Upload Icon"
                    width={32}
                    height={32}
                    className="mx-auto mb-2 w-8 h-8"
                  />
                  <p className="text-gray-600">
                    <span className='text-primary'>Click to upload</span> or drag and drop
                  </p>
                  <p className="text-gray-400 text-xs mt-1">JPG, JPEG, PNG less than 2MB</p>
                  <input
                    type="file"
                    id="uploadLogo"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                      handleFileChange(e);
                      field.onChange(e.target.files?.[0]);
                    }}
                    className="hidden"
                  />
                </div>
              </FormControl>
              {uploadedFile && <p className="text-green-600 mt-2">File uploaded: {uploadedFile.name}</p>}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField control={form.control} name="aboutCompany" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>About Your Company <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Say something about your company" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="companySize" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>Company Size (Number of employees) *</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-500">201-500</SelectItem>
                <SelectItem value="501+">501+</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="companyType" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>Company Type <span className="text-destructive">*</span></FormLabel>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input type="radio" {...field} value="private" checked={field.value === 'private'} />
                <span>Private</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" {...field} value="public" checked={field.value === 'public'} />
                <span>Public</span>
              </label>
            </div>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="companyEmail" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>Company Email <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Enter your company email address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="alternateEmail" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>Alternate Email <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Enter your alternate email address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>Phone Number <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <PhoneInput
                country={'in'}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                inputStyle={{ width: '100%', height: '40px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="alternatePhone" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>Alternate Phone Number</FormLabel>
            <FormControl>
              <PhoneInput
                country={'in'}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                inputStyle={{ width: '100%', height: '40px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="industry" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>Industry <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter industry" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="subIndustry" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>Sub Industry <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter sub industry" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="companyWebsite" render={({ field }) => (
          <FormItem>
            <FormLabel className='text-primary'>Company Website</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Paste your website link" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-end">
          <Button type="submit" className="w-full bg-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Next'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
