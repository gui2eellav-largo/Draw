"use client"

import { motion } from "framer-motion"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MetricSliderProps {
  label: string
  value: number // 0-100
  target?: { min: number; max: number }
  info?: string
  unit?: string
  delay?: number
}

export function MetricSlider({
  label,
  value,
  target,
  info,
  unit = "%",
  delay = 0
}: MetricSliderProps) {
  const getColor = (val: number) => {
    if (target) {
      if (val >= target.min && val <= target.max) return "bg-green-500"
      if (val >= target.min - 10 && val <= target.max + 10) return "bg-yellow-500"
    }
    if (val >= 80) return "bg-green-500"
    if (val >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusEmoji = (val: number) => {
    if (target && val >= target.min && val <= target.max) return "🟢"
    if (val >= 80) return "🟢"
    if (val >= 60) return "🟡"
    return "🔴"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="space-y-3 p-4 rounded-xl glass-effect border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {info && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-white/40 hover:text-white/60 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{info}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">{getStatusEmoji(value)}</span>
          <span className="text-xl font-bold">{Math.round(value)}{unit}</span>
        </div>
      </div>

      {/* Slider visuel (non interactif) */}
      <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: delay + 0.2, duration: 1, ease: "easeOut" }}
          className={`absolute left-0 top-0 h-full ${getColor(value)} rounded-full`}
          style={{
            boxShadow: `0 0 10px ${value >= 80 ? '#10B981' : value >= 60 ? '#F59E0B' : '#EF4444'}40`
          }}
        />

        {/* Target range indicator */}
        {target && (
          <div
            className="absolute top-0 h-full bg-white/20 border-x-2 border-white/40"
            style={{
              left: `${target.min}%`,
              width: `${target.max - target.min}%`
            }}
          />
        )}
      </div>

      {/* Target info */}
      {target && (
        <div className="text-xs text-white/50">
          Objectif : {target.min}-{target.max}{unit}
        </div>
      )}
    </motion.div>
  )
}
