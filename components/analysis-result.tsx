"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Info, XCircle, Code, Activity } from "lucide-react"

interface AnalysisResultProps {
  result: string
  fileName: string | null
  traceUrl: string | null
}

export function AnalysisResult({ result, fileName, traceUrl }: AnalysisResultProps) {
  const getThreatLevel = (result: string) => {
    if (result.toLowerCase().includes("high") && result.toLowerCase().includes("risk")) {
      return { level: "high", color: "text-red-400", bgColor: "bg-red-950/50", icon: XCircle }
    }
    if (result.toLowerCase().includes("medium") && result.toLowerCase().includes("risk")) {
      return { level: "medium", color: "text-yellow-400", bgColor: "bg-yellow-950/50", icon: AlertTriangle }
    }
    if (result.toLowerCase().includes("low") && result.toLowerCase().includes("risk")) {
      return { level: "low", color: "text-green-400", bgColor: "bg-green-950/50", icon: CheckCircle }
    }
    return { level: "analysis", color: "text-blue-400", bgColor: "bg-blue-950/50", icon: Info }
  }

  const threat = getThreatLevel(result)
  const ThreatIcon = threat.icon

  const formatAnalysisContent = (content: string) => {
    const lines = content.split("\n")
    const formatted = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith("### ")) {
        formatted.push(
          <h3 key={i} className="text-lg font-semibold text-white mt-6 mb-3 border-b border-gray-700 pb-2">
            {line.replace("### ", "")}
          </h3>,
        )
      } else if (line.startsWith("#### ")) {
        formatted.push(
          <h4 key={i} className="text-base font-medium text-blue-300 mt-4 mb-2">
            {line.replace("#### ", "")}
          </h4>,
        )
      } else if (line.startsWith("- **") && line.includes(":**")) {
        const match = line.match(/- \*\*(.*?):\*\*(.*)/)
        if (match) {
          formatted.push(
            <div key={i} className="flex mb-2">
              <span className="text-gray-300 font-medium min-w-[140px]">{match[1]}:</span>
              <span className="text-gray-400 ml-2">{match[2]}</span>
            </div>,
          )
        }
      } else if (line.startsWith("- ")) {
        formatted.push(
          <div key={i} className="flex items-start mb-1">
            <span className="text-blue-400 mr-2 mt-1">•</span>
            <span className="text-gray-400">{line.replace("- ", "")}</span>
          </div>,
        )
      } else if (line.match(/^\d+\./)) {
        formatted.push(
          <div key={i} className="flex items-start mb-2">
            <span className="text-blue-400 mr-2 font-medium">{line.match(/^\d+\./)?.[0]}</span>
            <span className="text-gray-400">{line.replace(/^\d+\.\s*/, "")}</span>
          </div>,
        )
      } else if (line.startsWith("`") && line.endsWith("`")) {
        formatted.push(
          <div key={i} className="bg-black/50 border border-gray-700 rounded p-3 my-2 font-mono text-sm text-green-400">
            {line.replace(/`/g, "")}
          </div>,
        )
      } else if (line.includes("**") && line.includes(":**")) {
        const parts = line.split("**")
        formatted.push(
          <div key={i} className="mb-2">
            {parts.map((part, idx) =>
              idx % 2 === 1 ? (
                <span key={idx} className="text-white font-medium">
                  {part}
                </span>
              ) : (
                <span key={idx} className="text-gray-400">
                  {part}
                </span>
              ),
            )}
          </div>,
        )
      } else if (line.trim()) {
        formatted.push(
          <p key={i} className="text-gray-400 mb-2 leading-relaxed">
            {line}
          </p>,
        )
      }
    }

    return formatted
  }

  const handleTrace = () => {
    if (traceUrl) {
      window.open(traceUrl, "_blank")
    } else {
      console.log("No trace URL available")
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-3 text-white font-light">
              <ThreatIcon className={`w-6 h-6 ${threat.color}`} />
              Analysis Complete
            </CardTitle>
            <p className="text-gray-400 font-light mt-1">{fileName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`capitalize ${threat.color} border-gray-700`}>
              {threat.level}
            </Badge>
            <Button
              onClick={handleTrace}
              disabled={!traceUrl}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Activity className="w-4 h-4 mr-2" />
              Trace
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-black/30 rounded-lg border border-gray-800">
          <ScrollArea className="h-[500px] p-6">
            <div className="space-y-2">{formatAnalysisContent(result)}</div>
          </ScrollArea>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-blue-950/30 to-purple-950/30 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <Code className="w-4 h-4" />
            <span className="font-medium">SEEYUH AI Analysis Engine</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Advanced binary analysis with machine learning threat detection</p>
        </div>
      </CardContent>
    </Card>
  )
}
