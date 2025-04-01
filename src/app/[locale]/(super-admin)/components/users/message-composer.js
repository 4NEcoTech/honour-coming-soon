"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Send } from "lucide-react"


export function MessageComposer({ isOpen, onClose, onSend, recipientCount }) {
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSend = () => {
    if (!message.trim()) {
      setError("This field is required")
      return
    }

    onSend(message)
    setMessage("")
    setError("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Send Message</span>
            <DialogClose className="h-4 w-4">
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <div className="text-sm font-medium mb-1">Message to:</div>
            <div className="text-sm text-muted-foreground">
              {recipientCount} {recipientCount === 1 ? "user" : "users"} selected
            </div>
          </div>

          <Textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              if (e.target.value.trim()) setError("")
            }}
            placeholder="Write a message..."
            className="min-h-[120px]"
          />

          {error && (
            <div className="mt-2 text-sm text-red-500 flex items-center">
              <span className="text-red-500 mr-1">●</span>
              {error}
            </div>
          )}

          <div className="mt-2 text-xs text-muted-foreground">Max 500 chars. Plain text only. No tags allowed.</div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSend} className="w-full sm:w-auto">
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

