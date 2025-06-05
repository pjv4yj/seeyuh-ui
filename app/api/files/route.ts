import { NextResponse } from "next/server"

// This is a server-side API route that would return the list of files
// In a real application, this would connect to your actual data source

export async function GET() {
  // Mock data - list of macOS apps
  const files = [
    "Safari.app",
    "Mail.app",
    "Messages.app",
    "Maps.app",
    "Photos.app",
    "FaceTime.app",
    "Calendar.app",
    "Contacts.app",
    "Reminders.app",
    "Notes.app",
    "Music.app",
    "Podcasts.app",
    "TV.app",
    "News.app",
    "Stocks.app",
    "Voice Memos.app",
    "Books.app",
    "App Store.app",
    "System Settings.app",
    "Terminal.app",
    "TextEdit.app",
    "Preview.app",
    "Calculator.app",
    "Dictionary.app",
    "Time Machine.app",
  ]

  // In a real application, you would fetch this data from your backend or file system

  return NextResponse.json({ files })
}
