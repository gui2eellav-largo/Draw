"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Video } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface ExerciseCardProps {
  id: string
  subject: string
  date: string
  duration: number
  score: number
  mediaType: "audio" | "video"
  delay?: number
}

export function ExerciseCard({
  id,
  subject,
  date,
  duration,
  score,
  mediaType,
  delay = 0
}: ExerciseCardProps) {
  const scoreColor = score >= 80 ? "text-green-500" : score >= 60 ? "text-orange-500" : "text-red-500"
  const scoreBg = score >= 80 ? "bg-green-500/20" : score >= 60 ? "bg-orange-500/20" : "bg-red-500/20"

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex-shrink-0 w-[280px]"
    >
      <Link href={`/exercise/report/${id}`}>
        <Card className="glass-effect border-white/10 p-5 hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer group h-full">
          {/* Header avec icon média */}
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${mediaType === 'video' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
              {mediaType === 'video' ? (
                <Video className={`w-4 h-4 ${mediaType === 'video' ? 'text-purple-500' : 'text-blue-500'}`} />
              ) : (
                <Mic className="w-4 h-4 text-blue-500" />
              )}
            </div>

            <Badge className={`${scoreBg} ${scoreColor} border-0`}>
              {score}/100
            </Badge>
          </div>

          {/* Sujet */}
          <h4 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {subject}
          </h4>

          {/* Métadonnées */}
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span>{date}</span>
            <span>•</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
