"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/shared/Navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  MessageSquare,
  Pause,
  Mic,
  Video,
  Quote,
  FileText,
  Target,
  Lightbulb
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

export default function ExerciseReportPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const analysisId = params.id as string

    console.log('=== LOADING FROM LOCALSTORAGE ===')
    console.log('Analysis ID:', analysisId)

    // Charger depuis localStorage
    const savedData = localStorage.getItem(`analysis-${analysisId}`)

    if (savedData) {
      const parsedData = JSON.parse(savedData)
      console.log('Loaded data:', parsedData)
      setData(parsedData)
    } else {
      console.log('No data found for this ID')
    }

    setLoading(false)
  }, [params.id])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20'
    if (score >= 60) return 'bg-orange-500/20'
    return 'bg-red-500/20'
  }

  const getTrendIcon = (value: number, ideal: number) => {
    if (Math.abs(value - ideal) <= ideal * 0.1) return <Minus className="w-4 h-4 text-white/60" />
    return value > ideal ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Chargement du rapport...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card className="glass-effect border-white/10 p-8 text-center">
            <p className="text-white/60 mb-4">Rapport non trouvé</p>
            <Link href="/dashboard">
              <Button>Retour au dashboard</Button>
            </Link>
          </Card>
        </main>
      </div>
    )
  }

  const scoreData = [
    { name: 'Rythme', value: data.rhythmScore || 0 },
    { name: 'Clarté', value: data.clarityScore || 0 },
    { name: 'Structure', value: data.structureScore || 0 }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{data.subject}</h1>
              <div className="flex items-center gap-3 text-white/60 text-sm mt-1">
                {data.mediaType === 'video' ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                <span>{Math.floor(data.duration / 60)}:{(data.duration % 60).toString().padStart(2, '0')}</span>
                <span>•</span>
                <span>{new Date(data.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          <Link href="/exercise/new">
            <Button className="gap-2">
              Nouvel exercice
            </Button>
          </Link>
        </div>

        {/* Score global */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="glass-effect border-white/10 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative">
              <p className="text-white/60 text-sm mb-2">Score global</p>
              <div className={`text-7xl font-bold ${getScoreColor(data.globalScore)}`}>
                {Math.round(data.globalScore)}
              </div>
              <p className="text-white/60 text-sm mt-2">sur 100</p>
            </div>
          </Card>
        </motion.div>

        {/* Scores détaillés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="glass-effect border-white/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Rythme</h3>
              <Badge className={`${getScoreBg(data.rhythmScore)} ${getScoreColor(data.rhythmScore)} border-0`}>
                {Math.round(data.rhythmScore)}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Débit</span>
                <div className="flex items-center gap-1">
                  <span>{data.wordsPerMin} mots/min</span>
                  {getTrendIcon(data.wordsPerMin, 150)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Pauses</span>
                <span>{Math.round(data.pausesEffective)}%</span>
              </div>
            </div>
          </Card>

          <Card className="glass-effect border-white/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Clarté</h3>
              <Badge className={`${getScoreBg(data.clarityScore)} ${getScoreColor(data.clarityScore)} border-0`}>
                {Math.round(data.clarityScore)}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Mots parasites</span>
                <div className="flex items-center gap-1">
                  <span>{data.fillerWords}</span>
                  {data.fillerWords <= 3 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-effect border-white/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Structure</h3>
              <Badge className={`${getScoreBg(data.structureScore)} ${getScoreColor(data.structureScore)} border-0`}>
                {Math.round(data.structureScore)}
              </Badge>
            </div>
            <p className="text-sm text-white/60">
              Cohérence et organisation du discours
            </p>
          </Card>
        </motion.div>

        {/* Graphique d'évolution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-effect border-white/10 p-6">
            <h3 className="text-lg font-bold mb-4">Répartition des scores</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={scoreData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Citations clés */}
        {data.keyQuotes && data.keyQuotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="glass-effect border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Quote className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-bold">Citations marquantes</h3>
              </div>
              <div className="space-y-4">
                {data.keyQuotes.map((quote: string, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
                    <p className="text-sm italic leading-relaxed">"{quote}"</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Annotations */}
        {data.annotations && data.annotations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="glass-effect border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4">Timeline des observations</h3>
              <div className="space-y-3">
                {data.annotations.map((annotation: any, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-16 text-sm text-white/60 font-mono">
                      {Math.floor(annotation.timestamp / 60)}:{(annotation.timestamp % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <Badge
                        className={`mb-1 ${
                          annotation.type === 'success'
                            ? 'bg-green-500/20 text-green-500'
                            : annotation.type === 'warning'
                            ? 'bg-orange-500/20 text-orange-500'
                            : 'bg-red-500/20 text-red-500'
                        } border-0`}
                      >
                        {annotation.type === 'success' ? 'Bien' : annotation.type === 'warning' ? 'Attention' : 'À améliorer'}
                      </Badge>
                      <p className="text-sm text-white/80">{annotation.message}</p>
                      {annotation.quote && (
                        <p className="text-xs text-white/60 italic mt-1">"{annotation.quote}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Insights */}
        {data.insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 grid md:grid-cols-2 gap-6"
          >
            {/* Forces */}
            {data.insights.strengths && data.insights.strengths.length > 0 && (
              <Card className="glass-effect border-green-500/30 p-6 bg-green-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-bold">Points forts</h3>
                </div>
                <ul className="space-y-2">
                  {data.insights.strengths.map((strength: string, i: number) => (
                    <li key={i} className="text-sm text-white/80 leading-relaxed flex items-start gap-2">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Axes d'amélioration */}
            {data.insights.improvements && data.insights.improvements.length > 0 && (
              <Card className="glass-effect border-orange-500/30 p-6 bg-orange-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-bold">Axes d'amélioration</h3>
                </div>
                <ul className="space-y-2">
                  {data.insights.improvements.map((improvement: string, i: number) => (
                    <li key={i} className="text-sm text-white/80 leading-relaxed flex items-start gap-2">
                      <span className="text-orange-500 flex-shrink-0">→</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </motion.div>
        )}

        {/* Conseils */}
        {data.insights?.tips && data.insights.tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Card className="glass-effect border-primary/30 p-6 bg-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Conseils pour progresser</h3>
              </div>
              <ul className="space-y-2">
                {data.insights.tips.map((tip: string, i: number) => (
                  <li key={i} className="text-sm text-white/80 leading-relaxed">
                    • {tip}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* Transcription */}
        {data.transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <Card className="glass-effect border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-white/60" />
                <h3 className="text-lg font-bold">Transcription complète</h3>
              </div>
              <div className="p-4 rounded-lg bg-white/5 max-h-64 overflow-y-auto">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.transcript}</p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4"
        >
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full">
              Retour au dashboard
            </Button>
          </Link>
          <Link href="/exercise/new" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-primary to-accent">
              Recommencer un exercice
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
