'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmojiPicker from 'emoji-picker-react';
import {
  Check,
  CheckCheck,
  File,
  ImageIcon,
  Paperclip,
  Send,
  Smile,
} from 'lucide-react';
import Image from 'next/image';

export default function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-auto">
          {[1, 2, 3].map((id) => (
            <div key={id} className="p-4 border-b cursor-pointer hover:bg-accent">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src="/image/institutndashboard/dashpage/myprofile/profile.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium truncate">User {id}</p>
                    <span className="text-xs text-muted-foreground">12:30 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">Last message preview...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/image/institutndashboard/dashpage/myprofile/profile.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium">Selected User</h2>
              <p className="text-sm text-muted-foreground">typing...</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4">
          {[1, 2, 3].map((id) => (
            <div key={id} className="flex gap-3 mb-4 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/image/institutndashboard/dashpage/myprofile/profile.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 max-w-[80%] bg-accent">
                <p>Sample message {id}</p>
                <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                  <span>12:30 PM</span>
                  <Check className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <File className="w-4 h-4 mr-2" />
                  Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon">
              <Smile className="w-5 h-5" />
            </Button>

            <Input placeholder="Type a message..." className="flex-1" />
            <Button>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
