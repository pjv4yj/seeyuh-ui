"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AppWindow } from "lucide-react"

interface FileListProps {
  files: string[]
  selectedFile: string | null
  onSelectFile: (file: string) => void
}

export function FileList({ files, selectedFile, onSelectFile }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>No files available</p>
      </div>
    )
  }

  return (
    <div>
      <ScrollArea className="h-[500px]">
        <RadioGroup value={selectedFile || ""} onValueChange={onSelectFile} className="p-6">
          {files.map((file) => (
            <div
              key={file}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 hover:bg-gray-800/50 ${
                selectedFile === file ? "bg-blue-900/30 border border-blue-700/50" : ""
              }`}
            >
              <RadioGroupItem value={file} id={file} className="text-blue-400 border-gray-600" />
              <Label htmlFor={file} className="flex items-center cursor-pointer w-full text-gray-300">
                <AppWindow className="h-4 w-4 mr-3 text-gray-500" />
                <span className="font-light">{file}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </ScrollArea>
    </div>
  )
}
