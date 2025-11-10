"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ComparisonData {
  metric: string
  previous: number
  current: number
  improvement: number
}

interface ProgressComparisonProps {
  data: ComparisonData[]
  previousDate: string
}

export function ProgressComparison({ data, previousDate }: ProgressComparisonProps) {
  // Calculate overall progress
  const averageImprovement = data.reduce((sum, item) => sum + item.improvement, 0) / data.length

  return (
    <Card className="glass-effect border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Évolution de tes performances</h3>
          <p className="text-sm text-white/60">Comparaison avec l'analyse du {previousDate}</p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20">
          {averageImprovement > 0 ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
          <span className="font-semibold">
            {averageImprovement > 0 ? "+" : ""}{averageImprovement.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="metric"
              stroke="rgba(255,255,255,0.4)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.4)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={2}
              name="Précédente"
              dot={{ fill: 'rgba(255,255,255,0.3)', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#6366F1"
              strokeWidth={3}
              name="Actuelle"
              dot={{ fill: '#6366F1', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Improvements list */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.map((item, i) => (
          <div
            key={i}
            className="p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <p className="text-xs text-white/60 mb-1">{item.metric}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">{item.current}</span>
              <span className={`text-xs font-semibold ${
                item.improvement > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {item.improvement > 0 ? "+" : ""}{item.improvement}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
