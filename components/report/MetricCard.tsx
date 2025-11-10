"use client"

import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  unit?: string
  target?: number
  trend?: "up" | "down" | "stable"
  trendValue?: string
  colorScheme?: "green" | "orange" | "red" | "blue" | "purple"
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  target,
  trend,
  trendValue,
  colorScheme = "blue"
}: MetricCardProps) {
  // Determine color based on performance if target is provided
  let performanceColor = colorScheme
  if (typeof value === "number" && target) {
    const percentage = (value / target) * 100
    if (percentage >= 80) performanceColor = "green"
    else if (percentage >= 60) performanceColor = "orange"
    else performanceColor = "red"
  }

  const colorClasses = {
    green: {
      gradient: "from-green-500/20 to-emerald-500/20",
      icon: "text-green-500",
      bar: "bg-green-500"
    },
    orange: {
      gradient: "from-orange-500/20 to-amber-500/20",
      icon: "text-orange-500",
      bar: "bg-orange-500"
    },
    red: {
      gradient: "from-red-500/20 to-rose-500/20",
      icon: "text-red-500",
      bar: "bg-red-500"
    },
    blue: {
      gradient: "from-blue-500/20 to-cyan-500/20",
      icon: "text-blue-500",
      bar: "bg-blue-500"
    },
    purple: {
      gradient: "from-purple-500/20 to-pink-500/20",
      icon: "text-purple-500",
      bar: "bg-purple-500"
    }
  }

  const colors = colorClasses[performanceColor]

  // Calculate progress percentage
  const progressPercentage = typeof value === "number" && target
    ? Math.min((value / target) * 100, 100)
    : 0

  return (
    <Card className="glass-effect border-white/10 p-5 hover:border-white/20 transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br",
          colors.gradient
        )}>
          <Icon className={cn("w-6 h-6", colors.icon)} />
        </div>

        {/* Trend indicator */}
        {trend && trendValue && (
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-semibold",
            trend === "up" && "bg-green-500/20 text-green-500",
            trend === "down" && "bg-red-500/20 text-red-500",
            trend === "stable" && "bg-white/10 text-white/60"
          )}>
            {trend === "up" && "↗"}
            {trend === "down" && "↘"}
            {trend === "stable" && "→"} {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{value}</span>
          {unit && <span className="text-sm text-white/60">{unit}</span>}
        </div>
      </div>

      {/* Label */}
      <p className="text-sm text-white/60 mb-3">{label}</p>

      {/* Progress bar */}
      {target && typeof value === "number" && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>Objectif: {target}{unit}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-500", colors.bar)}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
