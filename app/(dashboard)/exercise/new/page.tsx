"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/shared/Navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Clock,
  Upload,
  ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Subject {
  title: string
  difficulty: string
  duration: number
  preview: string
}

export default function NewExercisePage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [customSubject, setCustomSubject] = useState("")
  const [customDuration, setCustomDuration] = useState("2")
  const [showCustomInput, setShowCustomInput] = useState(false)

  // Charger les sujets au montage
  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subjects/generate')
      const data = await response.json()

      if (data.subjects) {
        setSubjects(data.subjects)
      }
    } catch (error) {
      console.error('Erreur chargement sujets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    setRegenerating(true)
    await loadSubjects()
    setRegenerating(false)
  }

  const handleSelectSubject = (subject: Subject) => {
    // Sauvegarder le sujet dans localStorage
    localStorage.setItem('selectedSubject', JSON.stringify(subject))
    // Rediriger vers la page brief
    router.push('/exercise/brief')
  }

  const handleCustomSubject = () => {
    if (!customSubject.trim()) return

    const subject: Subject = {
      title: customSubject,
      difficulty: "Personnalisé",
      duration: parseInt(customDuration),
      preview: `Présenter ${customSubject} de manière claire et structurée`
    }

    handleSelectSubject(subject)
  }

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile':
        return 'bg-green-500/20 text-green-500 border-green-500/30'
      case 'Moyen':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30'
      case 'Difficile':
        return 'bg-red-500/20 text-red-500 border-red-500/30'
      default:
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header avec bouton retour */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Choisis un sujet</h1>
            <p className="text-white/60 text-sm mt-1">
              Sélectionne un sujet généré ou crée le tien
            </p>
          </div>
        </div>

        {/* Sujets générés */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Sujets générés par IA
            </h2>
            <Button
              onClick={handleRegenerate}
              disabled={regenerating}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
              Régénérer
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="glass-effect border-white/10 p-6 animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-white/10 rounded w-full mb-2" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {subjects.map((subject, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    onClick={() => handleSelectSubject(subject)}
                    className="glass-effect border-white/10 p-6 hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {subject.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${difficultyColor(subject.difficulty)} border`}>
                        {subject.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-white/60">
                        <Clock className="w-4 h-4" />
                        <span>{subject.duration} min</span>
                      </div>
                    </div>

                    <p className="text-white/60 text-sm leading-relaxed">
                      {subject.preview}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sujet personnalisé */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="glass-effect border-white/10 p-6">
            <h2 className="text-lg font-semibold mb-4">Ou crée ton propre sujet</h2>

            {!showCustomInput ? (
              <Button
                onClick={() => setShowCustomInput(true)}
                variant="outline"
                className="w-full gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Créer un sujet personnalisé
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Titre du sujet
                  </label>
                  <Input
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Ex: Les enjeux de l'intelligence artificielle"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Durée cible (minutes)
                  </label>
                  <Input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    min="1"
                    max="10"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleCustomSubject}
                    disabled={!customSubject.trim()}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    Continuer
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCustomInput(false)
                      setCustomSubject("")
                      setCustomDuration("2")
                    }}
                    variant="outline"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Import document (futur) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect border-white/10 p-6 opacity-50">
            <div className="flex items-center gap-3 text-white/40">
              <Upload className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Importer un document</h3>
                <p className="text-sm">PDF ou image - Bientôt disponible</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
