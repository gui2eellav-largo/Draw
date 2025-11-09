"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  gradient?: string
  delay?: number
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  gradient = "from-primary/20 to-accent/20",
  delay = 0
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="relative overflow-hidden glass-effect border-white/10 hover:border-primary/50 transition-all duration-300 group">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        <div className="relative p-6">
          {/* Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110 transition-transform">
              <Icon className="w-5 h-5 text-primary" />
            </div>

            {trend && (
              <div className={`text-sm font-semibold ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>

          {/* Value */}
          <div className="text-3xl font-bold mb-1">
            {value}
          </div>

          {/* Title */}
          <div className="text-sm text-white/60">
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div className="text-xs text-white/40 mt-2">
              {subtitle}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
