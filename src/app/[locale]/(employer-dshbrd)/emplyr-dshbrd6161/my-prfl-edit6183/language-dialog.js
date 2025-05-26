"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"


export function LanguageDialog({ onSave, initialLanguages = [] }) {
  const [open, setOpen] = useState(false)
  const [languages, setLanguages] = useState(initialLanguages)
  const [currentLanguage, setCurrentLanguage] = useState("")
  const [currentProficiency, setCurrentProficiency] = useState("")

  const handleAddLanguage = () => {
    if (currentLanguage && currentProficiency) {
      const newLanguage = {
        name: currentLanguage,
        proficiency: currentProficiency,
      }

      const updatedLanguages = [...languages, newLanguage]
      setLanguages(updatedLanguages)
      setCurrentLanguage("")
      setCurrentProficiency("")
    }
  }

  const handleRemoveLanguage = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index)
    setLanguages(updatedLanguages)
  }

  const handleSave = () => {
    onSave(languages)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          Add Languages
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Languages</DialogTitle>
          <DialogDescription>Add languages you know and your proficiency level.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
                <SelectItem value="Telugu">Telugu</SelectItem>
                <SelectItem value="Kannada">Kannada</SelectItem>
                <SelectItem value="Malayalam">Malayalam</SelectItem>
                <SelectItem value="Bengali">Bengali</SelectItem>
                <SelectItem value="Marathi">Marathi</SelectItem>
                <SelectItem value="Gujarati">Gujarati</SelectItem>
                <SelectItem value="Punjabi">Punjabi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={currentProficiency} onValueChange={setCurrentProficiency}>
              <SelectTrigger>
                <SelectValue placeholder="Proficiency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Native">Native</SelectItem>
                <SelectItem value="Fluent">Fluent</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddLanguage}
            disabled={!currentLanguage || !currentProficiency}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>

          {/* Display added languages */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Added Languages:</h4>
            {languages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No languages added yet.</p>
            ) : (
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <div>
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">({lang.proficiency})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLanguage(index)}
                      className="h-8 w-8 p-0"
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

