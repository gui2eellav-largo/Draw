"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ProgressRingProps {
  score: number // 0-100
  size?: number
  strokeWidth?: number
  label?: string
  animated?: boolean
}

export function ProgressRing({
  score,
  size = 200,
  strokeWidth = 12,
  label = "Score Global",
  animated = true
}: ProgressRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedScore(score), 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedScore(score)
    }
  }, [score, animated])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedScore / 100) * circumference

  // Couleur dynamique selon le score
  const getColor = (score: number) => {
    if (score >= 80) return "#10B981" // Vert
    if (score >= 60) return "#F59E0B" // Orange
    return "#EF4444" // Rouge
  }

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-white/10"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
            filter: `drop-shadow(0 0 8px ${getColor(score)}40)`
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-center"
        >
          <div className="text-5xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
            {Math.round(animatedScore)}
          </div>
          <div className="text-sm text-white/60 mt-1">{label}</div>
        </motion.div>
      </div>
    </div>
  )
}
