import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1
}

export function xpToNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  return currentLevel * 500 - currentXp
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
