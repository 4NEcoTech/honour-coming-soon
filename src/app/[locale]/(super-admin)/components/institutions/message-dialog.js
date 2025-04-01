"use client"
import { useState } from "react"


import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarFallback } from "../../components/utils"
import { PaperclipIcon } from "lucide-react"



export function MessageDialog({ isOpen, onClose, onSend, recipients }) {
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [attachments, setAttachments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSend = () => {
    if (!message.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onSend()
      setMessage("")
      setAttachments([])
    }, 1000)
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>HCJ Chat</span>
            <DialogClose />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="selected">{recipients.length} Selected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipients.map((recipient) => (
                <div key={recipient.id} className="flex items-center gap-1 bg-muted rounded-full px-2 py-1">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">{getAvatarFallback(recipient.username)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{recipient.username}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="selected" className="pt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipients.map((recipient) => (
                <div key={recipient.id} className="flex items-center gap-1 bg-muted rounded-full px-2 py-1">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">{getAvatarFallback(recipient.username)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{recipient.username}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <Textarea
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />

          {attachments.length > 0 && (
            <div className="text-sm text-muted-foreground">{attachments.length} file(s) attached</div>
          )}

          <div className="flex items-center text-sm text-red-500">
            <span>This field is required</span>
          </div>

          <div className="text-xs text-muted-foreground">
            Max File Size: 10MB. File types allowed: .zip, .pdf, .doc, .jpg, .png
          </div>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
              <PaperclipIcon className="h-4 w-4 mr-2" />
              Attach Files
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".zip,.pdf,.doc,.jpg,.png"
              />
            </Button>

            <Button onClick={handleSend} disabled={!message.trim() || isSubmitting} className="bg-primary text-white">
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

