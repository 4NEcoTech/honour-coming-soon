'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  X,
} from 'lucide-react';
import { useState } from 'react';
import {
  formatDate,
  getUserType,
  getVerificationBadgeColor,
  getVerificationStatus,
} from '../utils';
export function UserProfile({
  userData,
  isOpen,
  onClose,
  onUpdateStatus,
  onDelete,
}) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  if (!userData || !userData.user) return null;

  const user = userData.user;
  const individualDetails = userData.individualDetails || {};
  const individualAddress = userData.individualAddress || {};
  const documents = userData.documents || {};
  const education = userData.education || {};

  const verificationStatus = getVerificationStatus(user);
  const badgeColor = getVerificationBadgeColor(verificationStatus);
  const userType = getUserType(user);

  const fullName = `${individualDetails.ID_First_Name || ''} ${
    individualDetails.ID_Last_Name || ''
  }`;
  const location = individualAddress.IAD_City
    ? `${individualAddress.IAD_City}, ${individualAddress.IAD_Country || ''}`
    : 'N/A';
  const documentType = documents.IDD_Document1_Type || 'N/A';
  const documentUrl = documents.IDD_Individual1_Document || '';

  const handleEditStatus = () => {
    setSelectedStatus(user.UT_User_Verification_Status || '01'); // Default to Pending
    setIsEditingStatus(true);
  };

  const handleSaveStatus = () => {
    onUpdateStatus(user.UT_User_Id, selectedStatus);
    setIsEditingStatus(false);
  };

  const statusOptions = [
    { label: 'Verified', value: '02' },
    { label: 'Pending', value: '01' },
    { label: 'Not Verified', value: '03' },
    { label: 'Requested Information', value: '04' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{fullName}</span>
            <DialogClose className="h-4 w-4">
              {/* <X className="h-4 w-4" /> */}
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback>
                {(fullName || 'U').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h3 className="text-lg font-semibold">{fullName}</h3>
            <div className="text-sm text-muted-foreground">{userType}</div>

            <Button
              variant="outline"
              className="text-blue-500 border-blue-500"
              onClick={() => {
                // Implement send message to single user
                onClose();
              }}>
              Send Message
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Phone Number</span>
              <span className="ml-auto">
                {individualDetails.ID_Phone || 'N/A'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email</span>
              <span className="ml-auto">
                {individualDetails.ID_Email || 'N/A'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Address</span>
              <span className="ml-auto">{location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Date Registered</span>
              <span className="ml-auto">{formatDate(user.createdAt)}</span>
            </div>

            {/* Show education details for students */}
            {user.UT_User_Role === '05' &&
              education &&
              Object.keys(education).length > 0 && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Education</span>
                  <div className="ml-auto text-right">
                    <div>{education.IE_Program_Name || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">
                      {education.IE_Institute_Name || ''}
                    </div>
                  </div>
                </div>
              )}

            {/* Show document details */}
            {documentUrl && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Documents</span>
                <div className="ml-auto flex items-center">
                  <div className="flex items-center">
                    <div className="h-5 w-5 bg-red-500 rounded-sm flex items-center justify-center mr-1">
                      <span className="text-white text-xs">PDF</span>
                    </div>
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline">
                      {documentType}.pdf
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="font-medium">Verification Status</span>
              {!isEditingStatus ? (
                <div className="ml-auto flex items-center gap-2">
                  <Badge className={badgeColor}>{verificationStatus}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditStatus}
                    className="h-8 px-2">
                    Edit
                  </Button>
                </div>
              ) : (
                <div className="ml-auto">
                  <RadioGroup
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                    className="flex flex-col space-y-1">
                    {statusOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option.value}
                          id={`status-${option.value}`}
                        />
                        <Label htmlFor={`status-${option.value}`}>
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingStatus(false)}
                      className="mr-2">
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveStatus}>
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end mt-4">
          <Button variant="destructive" onClick={onDelete}>
            Delete User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
