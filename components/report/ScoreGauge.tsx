"use client"

import { motion } from "framer-motion"

interface ScoreGaugeProps {
  score: number
  label: string
}

export function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const rotation = (score / 100) * 180 - 90

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-32 h-16 overflow-hidden">
        <div className="absolute inset-0 border-4 border-muted rounded-t-full" />
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-16 origin-bottom bg-primary"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{score}/100</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}
