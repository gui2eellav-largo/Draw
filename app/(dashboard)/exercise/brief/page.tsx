"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/shared/Navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Clock,
  Mic,
  Video,
  Lightbulb,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Brief {
  introduction: {
    hook: string
    context: string
    announcement: string
  }
  mainPoints: Array<{
    title: string
    keyIdeas: string[]
    example: string
  }>
  conclusion: {
    summary: string
    impact: string
  }
  tips: string[]
}

export default function BriefPage() {
  const router = useRouter()
  const [subject, setSubject] = useState<any>(null)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('audio')

  useEffect(() => {
    // Charger le sujet depuis localStorage
    const savedSubject = localStorage.getItem('selectedSubject')
    if (!savedSubject) {
      router.push('/exercise/new')
      return
    }

    const parsedSubject = JSON.parse(savedSubject)
    setSubject(parsedSubject)

    // Générer le brief
    generateBrief(parsedSubject)
  }, [])

  const generateBrief = async (subject: any) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/brief/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.title,
          duration: subject.duration
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du brief')
      }

      const data = await response.json()
      setBrief(data)

      // Sauvegarder le brief pour la page d'enregistrement
      localStorage.setItem('exerciseBrief', JSON.stringify({
        subject,
        brief: data
      }))

    } catch (err) {
      console.error('Erreur:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const handleStartRecording = () => {
    // Sauvegarder le type de média choisi
    localStorage.setItem('exerciseMediaType', mediaType)
    router.push('/exercise/record')
  }

  if (!subject) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/exercise/new">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{subject.title}</h1>
            <div className="flex items-center gap-2 text-white/60 text-sm mt-1">
              <Clock className="w-4 h-4" />
              <span>Durée cible : {subject.duration} minutes</span>
            </div>
          </div>
        </div>

        {loading ? (
          <Card className="glass-effect border-white/10 p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-white/60">Génération de ton plan de présentation...</p>
          </Card>
        ) : error ? (
          <Card className="glass-effect border-red-500/30 p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => generateBrief(subject)} variant="outline">
              Réessayer
            </Button>
          </Card>
        ) : brief ? (
          <>
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="glass-effect border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h2 className="text-xl font-bold">Introduction</h2>
                </div>

                <div className="space-y-4 ml-10">
                  <div>
                    <p className="text-sm text-white/60 mb-1">Accroche</p>
                    <p className="text-white">{brief.introduction.hook}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1">Contexte</p>
                    <p className="text-white/80 text-sm leading-relaxed">{brief.introduction.context}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1">Annonce du plan</p>
                    <p className="text-white/80 text-sm leading-relaxed">{brief.introduction.announcement}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Points principaux */}
            {brief.mainPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 1) * 0.1 }}
                className="mb-6"
              >
                <Card className="glass-effect border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent font-bold">{i + 2}</span>
                    </div>
                    <h2 className="text-xl font-bold">{point.title}</h2>
                  </div>

                  <div className="space-y-3 ml-10">
                    <div>
                      <p className="text-sm text-white/60 mb-2">Idées clés</p>
                      <ul className="space-y-2">
                        {point.keyIdeas.map((idea, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-white/80">{idea}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-white/60 mb-1">Exemple</p>
                      <p className="text-white/80 text-sm italic leading-relaxed">
                        {point.example}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Conclusion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <Card className="glass-effect border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">{brief.mainPoints.length + 2}</span>
                  </div>
                  <h2 className="text-xl font-bold">Conclusion</h2>
                </div>

                <div className="space-y-4 ml-10">
                  <div>
                    <p className="text-sm text-white/60 mb-1">Synthèse</p>
                    <p className="text-white/80 text-sm leading-relaxed">{brief.conclusion.summary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1">Message final</p>
                    <p className="text-white font-medium">{brief.conclusion.impact}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Tips */}
            {brief.tips && brief.tips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <Card className="glass-effect border-primary/30 p-6 bg-primary/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold">Conseils pour ta présentation</h2>
                  </div>

                  <ul className="space-y-2 ml-7">
                    {brief.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-white/80 leading-relaxed">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {/* Choix du type de média et CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="sticky bottom-8"
            >
              <Card className="glass-effect border-white/10 p-6 bg-background/95 backdrop-blur-xl">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-white/60 mb-3">Type d'enregistrement</p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setMediaType('audio')}
                        variant={mediaType === 'audio' ? 'default' : 'outline'}
                        className="flex-1 gap-2"
                      >
                        <Mic className="w-4 h-4" />
                        Audio seulement
                      </Button>
                      <Button
                        onClick={() => setMediaType('video')}
                        variant={mediaType === 'video' ? 'default' : 'outline'}
                        className="flex-1 gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Vidéo + Audio
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleStartRecording}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity gap-3"
                  >
                    {mediaType === 'video' ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                    Commencer l'enregistrement
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        ) : null}
      </main>
    </div>
  )
}
