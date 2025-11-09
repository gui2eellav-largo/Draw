"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/shared/Navbar"
import { ProgressRing } from "@/components/dashboard/ProgressRing"
import { MetricSlider } from "@/components/report/MetricSlider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  TrendingUp,
  Lightbulb,
  Target,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Download
} from "lucide-react"
import { motion } from "framer-motion"
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
    // TODO: Fetch real data from API
    // Simuler fetch de données
    setTimeout(() => {
      setData({
        id: params.id as string,
        globalScore: 72,
        rhythmScore: 68,
        clarityScore: 82,
        structureScore: 79,
        wordsPerMin: 145,
        fillerWords: 12,
        pausesEffective: 68,
        annotations: [
          { timestamp: 23, type: 'success', message: 'Excellente ouverture captivante' },
          { timestamp: 74, type: 'warning', message: 'Débit trop rapide (-15%)' },
          { timestamp: 165, type: 'error', message: '6 "euh" en 20 secondes' },
          { timestamp: 230, type: 'success', message: 'Pause stratégique parfaite' }
        ],
        insights: {
          strengths: [
            'Articulation claire et prononciation excellente',
            'Bonne modulation vocale qui maintient l\'attention'
          ],
          improvements: [
            'Réduire les mots de remplissage (12/min → objectif 5/min)',
            'Mieux gérer les pauses pour donner plus d\'impact'
          ],
          tips: [
            'Pratique "Le pouvoir du silence" : remplace les "euh" par des micro-pauses de 1-2 secondes',
            'Entraîne-toi avec un métronome à 140 BPM pour stabiliser ton débit'
          ]
        },
        createdAt: new Date().toISOString()
      })
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-white/60">Chargement du rapport...</p>
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

  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Ton rapport d&apos;éloquence
              </h1>
              <p className="text-white/60">
                Analysé le {new Date(data.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="glass-effect border-white/10 p-8 sticky top-24">
              <h2 className="text-xl font-semibold mb-6 text-center">Score Global</h2>
              <ProgressRing score={data.globalScore} size={240} label="Éloquence" />

              <div className="mt-8 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Rythme</span>
                  <span className="font-semibold">{data.rhythmScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Clarté</span>
                  <span className="font-semibold">{data.clarityScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Structure</span>
                  <span className="font-semibold">{data.structureScore}/100</span>
                </div>
              </div>

              <Separator className="my-6 bg-white/10" />

              <Button className="w-full" onClick={() => router.push('/upload')}>
                Nouvelle analyse
              </Button>
            </Card>
          </motion.div>

          {/* Détails & Insights */}
          <div className="lg:col-span-2 space-y-8">
            {/* Métriques détaillées */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Analyse détaillée
              </h2>

              <div className="space-y-4">
                <MetricSlider
                  label="Débit de parole"
                  value={(data.wordsPerMin / 160) * 100}
                  target={{ min: 70, max: 85 }}
                  info="Objectif : 140-160 mots/minute pour une écoute confortable"
                  delay={0.3}
                />

                <MetricSlider
                  label="Pauses efficaces"
                  value={data.pausesEffective}
                  info="Utilisation stratégique des silences pour renforcer ton message"
                  delay={0.4}
                />

                <MetricSlider
                  label="Mots parasites"
                  value={Math.max(0, 100 - (data.fillerWords * 8))}
                  info={`Tu dis "euh", "donc", etc. environ ${data.fillerWords} fois par minute`}
                  delay={0.5}
                />
              </div>
            </motion.div>

            {/* Timeline Annotations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">Timeline de ta vidéo</h2>

              <Card className="glass-effect border-white/10 p-6">
                <div className="space-y-4">
                  {data.annotations.map((annotation, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getAnnotationIcon(annotation.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {formatTimestamp(annotation.timestamp)}
                          </Badge>
                        </div>
                        <p className="text-sm">{annotation.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Forces */}
              <Card className="glass-effect border-white/10 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-green-500">
                  <TrendingUp className="w-5 h-5" />
                  Tes forces
                </h3>
                <ul className="space-y-3">
                  {data.insights.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Axes d'amélioration */}
              <Card className="glass-effect border-white/10 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-yellow-500">
                  <Target className="w-5 h-5" />
                  À améliorer
                </h3>
                <ul className="space-y-3">
                  {data.insights.improvements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Tips pratiques */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="glass-effect border-primary/20 border-2 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Conseils personnalisés
                </h3>
                <ul className="space-y-4">
                  {data.insights.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 rounded-lg bg-primary/10">
                      <span className="text-2xl">💡</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* CTA Final */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <Card className="glass-effect border-white/10 p-8">
                <h3 className="text-xl font-bold mb-2">Prochaine étape</h3>
                <p className="text-white/60 mb-6">
                  Refais une analyse dans 3 jours pour mesurer tes progrès !
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/exercises')}>
                    Faire un exercice
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/upload')}>
                    Nouvelle analyse
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
