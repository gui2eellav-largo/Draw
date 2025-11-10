"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Target, Calendar, TrendingUp } from "lucide-react"

interface Metric {
  id: string
  name: string
  current: number
  unit: string
  min: number
  max: number
  inverse?: boolean // true if lower is better (e.g., filler words)
}

interface GoalPlannerProps {
  metrics: Metric[]
  onCreateGoal?: (metric: string, target: number, duration: number) => void
}

export function GoalPlanner({ metrics, onCreateGoal }: GoalPlannerProps) {
  const [selectedMetric, setSelectedMetric] = useState<Metric>(metrics[0])
  const [targetValue, setTargetValue] = useState<number>(
    selectedMetric.inverse
      ? selectedMetric.current * 0.7 // Reduce by 30% for inverse metrics
      : selectedMetric.current * 1.3 // Increase by 30%
  )
  const [duration, setDuration] = useState<number>(14)

  const handleMetricChange = (metricId: string) => {
    const metric = metrics.find(m => m.id === metricId)
    if (metric) {
      setSelectedMetric(metric)
      setTargetValue(
        metric.inverse
          ? metric.current * 0.7
          : metric.current * 1.3
      )
    }
  }

  const handleCreateGoal = () => {
    if (onCreateGoal) {
      onCreateGoal(selectedMetric.id, targetValue, duration)
    }
  }

  const improvement = selectedMetric.inverse
    ? ((selectedMetric.current - targetValue) / selectedMetric.current) * 100
    : ((targetValue - selectedMetric.current) / selectedMetric.current) * 100

  return (
    <Card className="relative overflow-hidden border-white/10 p-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Fixe ton objectif</h3>
            <p className="text-sm text-white/60">Choisis une métrique à améliorer et définis ta cible</p>
          </div>
        </div>

        {/* Metric selector */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-white/80 mb-3 block">
            Métrique à améliorer
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => handleMetricChange(metric.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedMetric.id === metric.id
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <p className="font-semibold text-sm mb-1">{metric.name}</p>
                <p className="text-xs text-white/60">
                  Actuel: {metric.current}{metric.unit}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Target slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white/80">
              Cible à atteindre
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{Math.round(targetValue)}</span>
              <span className="text-sm text-white/60">{selectedMetric.unit}</span>
            </div>
          </div>

          <Slider
            value={[targetValue]}
            onValueChange={(value) => setTargetValue(value[0])}
            min={selectedMetric.min}
            max={selectedMetric.max}
            step={1}
            className="mb-3"
          />

          <div className="flex items-center justify-between text-xs text-white/40">
            <span>{selectedMetric.min}{selectedMetric.unit}</span>
            <span>{selectedMetric.max}{selectedMetric.unit}</span>
          </div>
        </div>

        {/* Duration selector */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-white/80 mb-3 block flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Durée du challenge
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setDuration(days)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  duration === days
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <p className="font-bold">{days} jours</p>
              </button>
            ))}
          </div>
        </div>

        {/* Progress preview */}
        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Progression visée</span>
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${improvement > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`font-bold ${improvement > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {improvement > 0 ? '+' : ''}{Math.round(improvement)}%
              </span>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${Math.min(Math.abs(improvement), 100)}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={handleCreateGoal}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Target className="w-5 h-5 mr-2" />
          Créer mon plan d'entraînement
        </Button>
      </div>
    </Card>
  )
}
