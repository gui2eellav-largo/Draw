"use client"

import { useState, useCallback } from "react"
import { Navbar } from "@/components/shared/Navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Video, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile)
      setError(null)
    } else {
      setError("Veuillez sélectionner un fichier vidéo valide")
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // Simuler progression upload
      for (let i = 0; i <= 50; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Créer FormData
      const formData = new FormData()
      formData.append('video', file)

      // Upload et analyse
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse')
      }

      const data = await response.json()

      // Simuler fin de progression
      setUploadProgress(100)
      await new Promise(resolve => setTimeout(resolve, 500))

      // Rediriger vers le rapport
      router.push(`/report/${data.analysisId}`)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Analyse ta présentation
            </h1>
            <p className="text-white/60 text-lg">
              Dépose ta vidéo pour recevoir un rapport détaillé en 90 secondes
            </p>
          </div>

          {/* Upload Zone */}
          <Card className="glass-effect border-white/10 p-8">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="relative"
                >
                  <input
                    type="file"
                    id="video-input"
                    accept="video/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />

                  <label
                    htmlFor="video-input"
                    className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                  >
                    <div className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="w-12 h-12 text-primary" />
                    </div>

                    <h3 className="text-xl font-semibold mb-2">
                      Clique ou glisse ta vidéo ici
                    </h3>

                    <p className="text-white/60 text-center max-w-md">
                      Formats acceptés : MP4, MOV, AVI<br />
                      Taille max : 500 MB · Durée max : 10 minutes
                    </p>
                  </label>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {/* File Preview */}
                  <div className="flex items-start gap-4 mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <Video className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate mb-1">{file.name}</h3>
                      <p className="text-sm text-white/60">{formatFileSize(file.size)}</p>
                    </div>

                    {!isUploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
                        className="hover:bg-red-500/10 hover:text-red-500"
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-8"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-white/60">
                          {uploadProgress < 60 ? 'Upload en cours...' : 'Analyse par Gemini...'}
                        </span>
                        <span className="text-sm font-semibold">{uploadProgress}%</span>
                      </div>

                      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent"
                          style={{ boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' }}
                        />
                      </div>

                      <div className="flex items-center gap-2 mt-4 text-sm text-white/60">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Notre IA analyse ton éloquence...</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-500 mb-1">Erreur</p>
                        <p className="text-sm text-white/80">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  {!isUploading && (
                    <Button
                      onClick={handleUpload}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Analyser ma vidéo
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: "⚡", title: "Rapide", desc: "Résultats en 90 secondes" },
              { icon: "🎯", title: "Précis", desc: "IA entraînée sur 100K+ vidéos" },
              { icon: "🔒", title: "Privé", desc: "Vidéos supprimées après analyse" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Card className="glass-effect border-white/10 p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
