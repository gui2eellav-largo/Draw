"use client"

import { Slider } from "@/components/ui/slider"

interface MetricSliderProps {
  label: string
  value: number
  max?: number
  description?: string
}

export function MetricSlider({
  label,
  value,
  max = 100,
  description
}: MetricSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-muted-foreground">{value}/{max}</span>
      </div>
      <Slider value={[value]} max={max} disabled className="cursor-default" />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
