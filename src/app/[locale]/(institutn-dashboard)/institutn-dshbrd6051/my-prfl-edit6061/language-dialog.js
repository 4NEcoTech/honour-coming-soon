// "use client"

// import { useState } from "react"
// import { Eye, Trash2, Plus } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"

// const languages = [
//   "Hindi",
//   "English",
//   "Kannada",
//   "Marathi",
//   "Gujarati"
// ]

// const proficiencyLevels = [
//   "Elementary Proficiency",
//   "Limited Working Proficiency",
//   "Professional Working Proficiency",
//   "Full Professional Proficiency",
//   "Native / Bilingual Proficiency"
// ]

// export function LanguageDialog({ onSave, initialLanguages = [] }) {
//   const [open, setOpen] = useState(false)
//   const [entries, setEntries] = useState(initialLanguages.length > 0 ? initialLanguages : [{
//     language: "",
//     proficiency: "",
//     read: false,
//     write: false,
//     speak: false
//   }]);

//   const handleSave = () => {
//     if (onSave) {
//       onSave(entries.filter(entry => entry.language && entry.proficiency));
//     }
//     setOpen(false);
//   };

//   const addAnotherLanguage = () => {
//     setEntries([...entries, {
//       language: "",
//       proficiency: "",
//       read: false,
//       write: false,
//       speak: false
//     }])
//   }

//   const updateEntry = (index, field, value) => {
//     const newEntries = [...entries]
//     newEntries[index] = { ...newEntries[index], [field]: value }
//     setEntries(newEntries)
//   }

//   const removeEntry = (index) => {
//     setEntries(entries.filter((_, i) => i !== index))
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <Button variant="outline" onClick={() => setOpen(true)}>
//         Add Language
//       </Button>
//       <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Language</DialogTitle>
//         </DialogHeader>

//         {entries.map((entry, index) => (
//           <div key={index} className="grid grid-cols-2 gap-4 py-4">
//             <div>
//               <Select
//                 value={entry.language}
//                 onValueChange={(value) => updateEntry(index, "language", value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select language" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {languages.map((language) => (
//                     <SelectItem key={language} value={language}>
//                       {language}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <div className="flex gap-4 mt-2">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     checked={entry.read}
//                     onCheckedChange={(checked) => updateEntry(index, "read", checked)}
//                   />
//                   <label className="text-sm">Read</label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     checked={entry.write}
//                     onCheckedChange={(checked) => updateEntry(index, "write", checked)}
//                   />
//                   <label className="text-sm">Write</label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     checked={entry.speak}
//                     onCheckedChange={(checked) => updateEntry(index, "speak", checked)}
//                   />
//                   <label className="text-sm">Speak</label>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col items-start gap-2">
//               <Select
//                 value={entry.proficiency}
//                 onValueChange={(value) => updateEntry(index, "proficiency", value)}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select proficiency" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {proficiencyLevels.map((level) => (
//                     <SelectItem key={level} value={level}>
//                       {level}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <div className="flex gap-2 mt-2">
//                 <Button variant="ghost" size="icon">
//                   <Eye className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => removeEntry(index)}
//                   disabled={entries.length === 1}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ))}

//         <Button
//           variant="outline"
//           onClick={addAnotherLanguage}
//           className="w-full mt-4"
//         >
//           <Plus className="h-4 w-4 mr-2" /> Add Another Language
//         </Button>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => setOpen(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave}>Save</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }


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

