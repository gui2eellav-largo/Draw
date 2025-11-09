"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm">Propulsé par Gemini AI</span>
          </motion.div>

          {/* Hero Title */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent leading-tight">
            Deviens un orateur
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              exceptionnel
            </span>
          </h1>

          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            Analyse tes vidéos avec l&apos;IA, reçois des feedbacks personnalisés,
            et améliore ton éloquence jour après jour.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
              Voir une démo
            </Button>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-white/40 text-sm"
          >
            ⭐️ Rejoint par 8,342 personnes ce mois-ci
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto"
        >
          {[
            { emoji: "🎯", title: "Analyse précise", desc: "Débit, clarté, structure évalués en détail" },
            { emoji: "📈", title: "Progrès mesurables", desc: "Track ton évolution semaine après semaine" },
            { emoji: "💪", title: "Exercices quotidiens", desc: "Entraînements adaptés à tes faiblesses" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass-effect border border-white/10 p-8 rounded-2xl text-center hover:border-primary/50 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
