"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/shared/Navbar"
import { MetricCard } from "@/components/report/MetricCard"
import { ProgressComparison } from "@/components/report/ProgressComparison"
import { GoalPlanner } from "@/components/report/GoalPlanner"
import { ProgressRing } from "@/components/dashboard/ProgressRing"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Share2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Target,
  TrendingUp,
  Mic,
  Clock,
  MessageSquare,
  Volume2,
  Waves,
  Network,
  Play
} from "lucide-react"
import Link from "next/link"

interface AnalysisData {
  id: string
  globalScore: number
  rhythmScore: number
  clarityScore: number
  structureScore: number
  wordsPerMin: number
  fillerWords: number
  pausesEffective: number
  modulation: number
  coherence: number
  annotations: Array<{
    timestamp: number
    type: 'success' | 'warning' | 'error'
    message: string
  }>
  insights: {
    strengths: string[]
    improvements: string[]
    tips: string[]
  }
  createdAt: string
}

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger les données depuis localStorage
    const analysisId = params.id as string
    const storedData = localStorage.getItem(`analysis-${analysisId}`)

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)

        // Ajouter les métriques manquantes avec des valeurs par défaut
        const completeData = {
          id: analysisId,
          globalScore: parsedData.globalScore || 0,
          rhythmScore: parsedData.rhythmScore || 0,
          clarityScore: parsedData.clarityScore || 0,
          structureScore: parsedData.structureScore || 0,
          wordsPerMin: parsedData.wordsPerMin || 0,
          fillerWords: parsedData.fillerWords || 0,
          pausesEffective: parsedData.pausesEffective || 0,
          modulation: parsedData.modulation || Math.round((parsedData.clarityScore || 0) * 0.9), // Approximation
          coherence: parsedData.coherence || Math.round((parsedData.structureScore || 0) * 0.95), // Approximation
          annotations: parsedData.annotations || [],
          insights: parsedData.insights || {
            strengths: [],
            improvements: [],
            tips: []
          },
          createdAt: parsedData.createdAt || new Date().toISOString()
        }

        setData(completeData)
      } catch (error) {
        console.error('Error parsing analysis data:', error)
      }
    }

    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-white/60">Chargement de ton rapport...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-white/60">Rapport introuvable</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Retour au dashboard
          </Button>
        </div>
      </div>
    )
  }

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getAnnotationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 border-green-500/30 text-green-500'
      case 'warning': return 'bg-orange-500/20 border-orange-500/30 text-orange-500'
      case 'error': return 'bg-red-500/20 border-red-500/30 text-red-500'
      default: return 'bg-white/10 border-white/20'
    }
  }

  // Data for previous analysis comparison
  const comparisonData = [
    { metric: 'Rythme', previous: 65, current: 68, improvement: 4.6 },
    { metric: 'Clarté', previous: 78, current: 82, improvement: 5.1 },
    { metric: 'Structure', previous: 76, current: 79, improvement: 3.9 },
  ]

  // Metrics for goal planner
  const metricsForGoals = [
    { id: 'fillerWords', name: 'Mots parasites', current: data.fillerWords, unit: '/min', min: 0, max: 20, inverse: true },
    { id: 'rhythm', name: 'Rythme', current: data.rhythmScore, unit: '/100', min: 50, max: 100 },
    { id: 'clarity', name: 'Clarté', current: data.clarityScore, unit: '/100', min: 50, max: 100 },
    { id: 'structure', name: 'Structure', current: data.structureScore, unit: '/100', min: 50, max: 100 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        {/* SECTION 1: Header compact */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm text-white/40">
              {new Date(data.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <Button variant="outline" size="sm" className="hover:bg-white/10">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* SECTION 2: Score global (Hero) */}
        <Card className="glass-effect border-white/10 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Score principal */}
            <div className="flex flex-col items-center">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-6">
                Score Global d'Éloquence
              </h2>
              <ProgressRing score={data.globalScore} size={200} label="" />
            </div>

            {/* Breakdown des scores */}
            <div className="flex-1 w-full grid grid-cols-3 gap-4">
              <div className="text-center p-6 rounded-lg bg-white/5 border border-white/10">
                <div className="text-3xl font-bold mb-2">{data.rhythmScore}</div>
                <div className="text-sm text-white/60">Rythme</div>
                <div className={`h-1.5 mt-3 rounded-full ${data.rhythmScore >= 80 ? 'bg-green-500' : data.rhythmScore >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                     style={{ width: `${data.rhythmScore}%` }} />
              </div>
              <div className="text-center p-6 rounded-lg bg-white/5 border border-white/10">
                <div className="text-3xl font-bold mb-2">{data.clarityScore}</div>
                <div className="text-sm text-white/60">Clarté</div>
                <div className={`h-1.5 mt-3 rounded-full ${data.clarityScore >= 80 ? 'bg-green-500' : data.clarityScore >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                     style={{ width: `${data.clarityScore}%` }} />
              </div>
              <div className="text-center p-6 rounded-lg bg-white/5 border border-white/10">
                <div className="text-3xl font-bold mb-2">{data.structureScore}</div>
                <div className="text-sm text-white/60">Structure</div>
                <div className={`h-1.5 mt-3 rounded-full ${data.structureScore >= 80 ? 'bg-green-500' : data.structureScore >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                     style={{ width: `${data.structureScore}%` }} />
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 3: Métriques dashboard (Dense grid) */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Vue d'ensemble des métriques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              icon={Mic}
              label="Débit de parole"
              value={data.wordsPerMin}
              unit="mots/min"
              target={150}
              trend="up"
              trendValue="+3%"
              colorScheme={data.wordsPerMin >= 140 && data.wordsPerMin <= 160 ? "green" : "orange"}
            />
            <MetricCard
              icon={Clock}
              label="Pauses efficaces"
              value={data.pausesEffective}
              unit="%"
              target={80}
              colorScheme={data.pausesEffective >= 70 ? "green" : "orange"}
            />
            <MetricCard
              icon={MessageSquare}
              label="Mots parasites"
              value={data.fillerWords}
              unit="/min"
              target={5}
              trend="down"
              trendValue="-2"
              colorScheme={data.fillerWords <= 5 ? "green" : data.fillerWords <= 10 ? "orange" : "red"}
            />
            <MetricCard
              icon={Volume2}
              label="Clarté articulation"
              value={data.clarityScore}
              unit="/100"
              target={85}
              trend="up"
              trendValue="+4pts"
              colorScheme="green"
            />
            <MetricCard
              icon={Waves}
              label="Modulation vocale"
              value={data.modulation}
              unit="/100"
              target={80}
              colorScheme="orange"
            />
            <MetricCard
              icon={Network}
              label="Cohérence discours"
              value={data.coherence}
              unit="/100"
              target={80}
              colorScheme="orange"
            />
          </div>
        </div>

        {/* SECTION 4: Timeline annotations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Moments clés de ta vidéo</h2>
          <Card className="glass-effect border-white/10 p-6">
            <div className="space-y-3">
              {data.annotations.map((annotation, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Badge className={`text-xs font-mono ${getAnnotationColor(annotation.type)}`}>
                    {formatTimestamp(annotation.timestamp)}
                  </Badge>

                  <div className="flex-1">
                    <p className="text-sm">{annotation.message}</p>
                  </div>

                  {annotation.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                  {annotation.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />}
                  {annotation.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* SECTION 5: Insights IA (2 colonnes) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Forces */}
          <Card className="glass-effect border-white/10 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              Forces identifiées
            </h3>
            <ul className="space-y-3">
              {data.insights.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">{strength}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Axes d'amélioration */}
          <Card className="glass-effect border-white/10 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-500" />
              </div>
              Axes d'amélioration
            </h3>
            <ul className="space-y-3">
              {data.insights.improvements.map((improvement, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5">
                  <Target className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">{improvement}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Conseils actionnables */}
        <Card className="glass-effect border-primary/20 border-2 p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Conseils personnalisés</h3>
          <div className="space-y-3">
            {data.insights.tips.map((tip, i) => (
              <div key={i} className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Comparison with previous (if exists) */}
        <div className="mb-8">
          <ProgressComparison
            data={comparisonData}
            previousDate="3 mars 2025"
          />
        </div>

        {/* SECTION 6: Planification d'objectif */}
        <div className="mb-8">
          <GoalPlanner
            metrics={metricsForGoals}
            onCreateGoal={(metric, target, duration) => {
              console.log('Goal created:', { metric, target, duration })
              // TODO: Save goal to database
            }}
          />
        </div>

        {/* SECTION 7: Actions finales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            onClick={() => router.push('/exercises')}
            className="h-16 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <Play className="w-5 h-5 mr-2" />
            Faire un exercice ciblé
          </Button>
          <Button
            onClick={() => router.push('/upload')}
            variant="outline"
            className="h-16 text-lg font-semibold hover:bg-white/10"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Nouvelle analyse
          </Button>
        </div>
      </main>
    </div>
  )
}
