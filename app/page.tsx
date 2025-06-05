"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getFiles, analyzeFile } from "@/lib/api"
import { FileList } from "@/components/file-list"
import { AnalysisResult } from "@/components/analysis-result"
import { VideoPlayer } from "@/components/video-player"
import { AlertCircle, Loader2, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  const [files, setFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [traceUrl, setTraceUrl] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load static files immediately
    setFiles(getFiles())
  }, [])

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setAnalyzing(true)
    setAnalysisResult(null)
    setTraceUrl(null)
    setError(null)

    try {
      const { result, traceUrl } = await analyzeFile(selectedFile)
      setAnalysisResult(result)
      setTraceUrl(traceUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze file. Please try again.")
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-light tracking-wide text-white">SEEYUH</h1>
              <p className="text-sm text-gray-400 font-light">Software security is only as strong as its foundation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-8 max-w-4xl mx-auto bg-red-950/50 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left Side - File List */}
          <div className="space-y-8">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-0">
                <FileList files={files} selectedFile={selectedFile} onSelectFile={setSelectedFile} />
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || analyzing}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-lg font-light text-lg transition-all duration-200"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
          </div>

          {/* Right Side - Video */}
          <div>
            <VideoPlayer />
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="max-w-7xl mx-auto mt-16">
            <AnalysisResult result={analysisResult} fileName={selectedFile} traceUrl={traceUrl} />
          </div>
        )}
      </main>
    </div>
  )
}
