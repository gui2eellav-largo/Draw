"use client"

import { Navbar } from "@/components/shared/Navbar"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { ProgressRing } from "@/components/dashboard/ProgressRing"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Upload,
  TrendingUp,
  Clock,
  Target,
  Flame,
  Play,
  ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function DashboardPage() {
  // Mock data - sera remplacé par vraies données
  const userData = {
    globalScore: 72,
    xp: 1250,
    level: 3,
    streak: 7,
    totalAnalyses: 12,
    avgImprovement: 18,
    lastAnalysisDate: "Il y a 2 jours",
    nextExerciseIn: "4h 23min"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            Salut Largo ! 👋
          </h1>
          <p className="text-white/60 text-lg">
            Prêt à améliorer ton éloquence aujourd&apos;hui ?
          </p>
        </motion.div>

        {/* Main CTA - Upload Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Link href="/upload">
            <Card className="relative overflow-hidden glass-effect border-primary/50 hover:border-primary transition-all duration-300 cursor-pointer group">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent glow-primary">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Analyser une nouvelle vidéo</h2>
                    <p className="text-white/60">Dépose ta vidéo et reçois ton rapport en 90 secondes</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Score Principal + Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Score Principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="glass-effect border-white/10 p-8 flex flex-col items-center">
              <ProgressRing score={userData.globalScore} size={220} />
              <p className="text-white/60 text-sm mt-4 text-center">
                Dernière analyse : {userData.lastAnalysisDate}
              </p>
              <Button className="mt-4 w-full" variant="outline">
                Voir le rapport complet
              </Button>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard
              title="Analyses totales"
              value={userData.totalAnalyses}
              icon={Target}
              subtitle="Depuis le début"
              delay={0.3}
            />

            <StatsCard
              title="Amélioration moyenne"
              value={`+${userData.avgImprovement}%`}
              icon={TrendingUp}
              trend={{ value: userData.avgImprovement, isPositive: true }}
              gradient="from-green-500/20 to-emerald-500/20"
              delay={0.4}
            />

            <StatsCard
              title="Série en cours"
              value={`${userData.streak} 🔥`}
              icon={Flame}
              subtitle="Jours consécutifs"
              gradient="from-orange-500/20 to-red-500/20"
              delay={0.5}
            />

            <StatsCard
              title="Prochain exercice"
              value={userData.nextExerciseIn}
              icon={Clock}
              subtitle="Exercice quotidien"
              gradient="from-blue-500/20 to-purple-500/20"
              delay={0.6}
            />
          </div>
        </div>

        {/* Progression XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass-effect border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Niveau {userData.level}</h3>
                <p className="text-sm text-white/60">{userData.xp} / 1500 XP</p>
              </div>
              <div className="text-sm text-white/60">
                {1500 - userData.xp} XP avant niveau {userData.level + 1}
              </div>
            </div>

            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(userData.xp / 1500) * 100}%` }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent rounded-full"
                style={{ boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' }}
              />
            </div>
          </Card>
        </motion.div>

        {/* Historique récent - TODO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12"
        >
          <h3 className="text-xl font-bold mb-6">Historique récent</h3>
          <Card className="glass-effect border-white/10 p-6 text-center text-white/40">
            Tes analyses apparaîtront ici...
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
