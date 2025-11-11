"use client"

import { Navbar } from "@/components/shared/Navbar"
import { ExerciseCard } from "@/components/dashboard/ExerciseCard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Play,
  Circle,
  CheckCircle2
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function DashboardPage() {
  // Mock data - sera remplacé par vraies données
  const goals = [
    {
      id: '1',
      description: 'Réduire mots parasites à <3/min',
      completed: false
    },
    {
      id: '2',
      description: 'Maintenir débit 140-160 mots/min',
      completed: false
    },
    {
      id: '3',
      description: 'Pratiquer 15 min/jour',
      completed: true
    }
  ]

  const recentExercises = [
    {
      id: '1',
      subject: 'Histoire de Coca-Cola',
      date: 'Il y a 2h',
      duration: 156,
      score: 76,
      mediaType: 'audio' as const
    },
    {
      id: '2',
      subject: 'Les trous noirs expliqués',
      date: 'Hier',
      duration: 203,
      score: 82,
      mediaType: 'video' as const
    },
    {
      id: '3',
      subject: 'Bitcoin et cryptomonnaies',
      date: 'Il y a 2 jours',
      duration: 187,
      score: 71,
      mediaType: 'audio' as const
    },
    {
      id: '4',
      subject: 'Intelligence artificielle',
      date: 'Il y a 3 jours',
      duration: 245,
      score: 88,
      mediaType: 'video' as const
    },
    {
      id: '5',
      subject: 'Réchauffement climatique',
      date: 'Il y a 4 jours',
      duration: 172,
      score: 79,
      mediaType: 'audio' as const
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            Salut Largo ! 👋
          </h1>
          <p className="text-white/60 text-lg">
            Prêt à améliorer ton éloquence aujourd&apos;hui ?
          </p>
        </motion.div>

        {/* Section Objectifs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-4 text-white/80">
            Mes objectifs principaux
          </h2>

          <div className="space-y-3">
            {goals.map((goal, i) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card className="glass-effect border-white/10 hover:border-primary/30 transition-colors p-4 flex items-center gap-3 border-l-4 border-l-primary">
                  {goal.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/40 flex-shrink-0" />
                  )}
                  <p className={`text-sm ${goal.completed ? 'text-white/60 line-through' : 'text-white'}`}>
                    {goal.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Carrousel Exercices récents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white/80">
              Exercices récents
            </h2>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                Voir tout
              </Button>
            </Link>
          </div>

          {/* Carrousel horizontal */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {recentExercises.map((exercise, i) => (
                <ExerciseCard
                  key={exercise.id}
                  {...exercise}
                  delay={0.5 + i * 0.1}
                />
              ))}
            </div>

            {/* Gradient fade sur les bords */}
            <div className="absolute top-0 right-0 bottom-4 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* CTA Principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center"
        >
          <Link href="/exercise/new" className="w-full max-w-2xl">
            <Button className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group relative overflow-hidden">
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/0 via-white/20 to-accent/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative flex items-center justify-center gap-3">
                <Play className="w-6 h-6 fill-white" />
                <span>Commencer un exercice</span>
              </div>
            </Button>
          </Link>
        </motion.div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
