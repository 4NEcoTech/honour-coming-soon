"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/ui/modal"

export default function AboutPopup({ isOpen, onClose, onSubmit }) {
  const [description, setDescription] = useState("")
  const [wordCount, setWordCount] = useState(0)

  const handleChange = (e) => {
    const value = e.target.value
    setDescription(value)

    // Calculate word count
    const words = value.trim() ? value.trim().split(/\s+/).length : 0
    setWordCount(words)
  }

  const handleSubmit = () => {
    if (onSubmit) onSubmit({ description })
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      animation="slide"
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">About You</h2>
          <p className="text-sm text-muted-foreground">
            Enhance your profile by adding a brief about yourself, allowing employers to get to know you better.
          </p>
        </div>
      }
    >
      <div className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="description" className="font-medium block">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={handleChange}
              placeholder="Tell us about yourself, your experience, skills, and what makes you unique..."
              className="min-h-[200px] resize-y"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{wordCount} words</span>
              <span className={wordCount > 1000 ? "text-red-500" : ""}>
                {wordCount > 1000 ? "Exceeds" : "Less than"} 1000 words
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={wordCount > 1000 || wordCount === 0}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

