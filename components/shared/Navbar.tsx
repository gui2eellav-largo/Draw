"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Flame, Trophy } from "lucide-react"
import { motion } from "framer-motion"

export function Navbar() {
  // Mock data - sera remplacé par vraies données user
  const user = {
    name: "Largo",
    image: null,
    xp: 1250,
    level: 3,
    streak: 7
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-effect border-b border-white/10"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="relative">
            <Sparkles className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
            <div className="absolute inset-0 blur-xl bg-primary/30 group-hover:bg-primary/50 transition-all" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Eloquent AI
          </span>
        </Link>

        {/* User Stats */}
        <div className="flex items-center gap-6">
          {/* Streak */}
          <div className="hidden md:flex items-center gap-2 glass-effect px-4 py-2 rounded-full">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold">{user.streak} jours</span>
          </div>

          {/* XP / Level */}
          <div className="hidden md:flex items-center gap-2 glass-effect px-4 py-2 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold">Niveau {user.level}</span>
          </div>

          {/* Avatar */}
          <Avatar className="border-2 border-primary/50 cursor-pointer hover:border-primary transition-colors">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </motion.nav>
  )
}
