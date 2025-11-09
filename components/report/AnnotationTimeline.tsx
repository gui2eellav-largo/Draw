"use client"

import { Badge } from "@/components/ui/badge"
import { formatDuration } from "@/lib/utils"

interface Annotation {
  timestamp: number
  type: "success" | "warning" | "info"
  message: string
}

interface AnnotationTimelineProps {
  annotations: Annotation[]
}

export function AnnotationTimeline({ annotations }: AnnotationTimelineProps) {
  return (
    <div className="space-y-4">
      {annotations.map((annotation, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${
              annotation.type === "success" ? "bg-success" :
              annotation.type === "warning" ? "bg-warning" :
              "bg-primary"
            }`} />
            {index < annotations.length - 1 && (
              <div className="w-0.5 flex-1 bg-border mt-2" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {formatDuration(annotation.timestamp)}
              </Badge>
            </div>
            <p className="text-sm">{annotation.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
