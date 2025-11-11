"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/shared/Navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Circle,
  Square,
  Pause,
  Play,
  RotateCcw,
  Send,
  Loader2,
  Mic,
  Video as VideoIcon
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped'

export default function RecordPage() {
  const router = useRouter()
  const [subject, setSubject] = useState<any>(null)
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('audio')
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [elapsedTime, setElapsedTime] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const videoPreviewRef = useRef<HTMLVideoElement>(null)
  const recordedBlobRef = useRef<Blob | null>(null)

  useEffect(() => {
    // Charger les données de l'exercice
    const briefData = localStorage.getItem('exerciseBrief')
    const savedMediaType = localStorage.getItem('exerciseMediaType') as 'audio' | 'video'

    if (!briefData) {
      router.push('/exercise/new')
      return
    }

    const { subject: subjectData } = JSON.parse(briefData)
    setSubject(subjectData)
    setMediaType(savedMediaType || 'audio')

    // Cleanup
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startRecording = async () => {
    try {
      // Demander l'accès média
      const constraints = mediaType === 'video'
        ? { video: true, audio: true }
        : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      // Si vidéo, afficher le preview
      if (mediaType === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream
        videoPreviewRef.current.play()
      }

      // Créer le MediaRecorder
      const mimeType = mediaType === 'video'
        ? 'video/webm;codecs=vp8,opus'
        : 'audio/webm;codecs=opus'

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaType === 'video' ? 'video/webm' : 'audio/webm'
        })
        recordedBlobRef.current = blob
      }

      mediaRecorder.start(1000) // Collecter les données toutes les secondes
      setRecordingState('recording')
      startTimer()

    } catch (error) {
      console.error('Erreur démarrage enregistrement:', error)
      alert('Impossible d\'accéder au micro/caméra. Vérifiez les permissions.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause()
      setRecordingState('paused')
      stopTimer()
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume()
      setRecordingState('recording')
      startTimer()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecordingState('stopped')
      stopTimer()

      // Arrêter le stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }

  const resetRecording = () => {
    chunksRef.current = []
    recordedBlobRef.current = null
    setRecordingState('idle')
    setElapsedTime(0)

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null
    }
  }

  const submitRecording = async () => {
    if (!recordedBlobRef.current) return

    try {
      setAnalyzing(true)

      // Préparer le FormData
      const formData = new FormData()
      const fileName = `recording-${Date.now()}.${mediaType === 'video' ? 'webm' : 'webm'}`
      formData.append('video', recordedBlobRef.current, fileName)

      // Envoyer à l'API d'analyse
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse')
      }

      const analysisData = await response.json()

      // Sauvegarder les données dans localStorage
      const exerciseData = {
        ...analysisData,
        subject: subject.title,
        mediaType,
        duration: elapsedTime,
        createdAt: new Date().toISOString()
      }

      localStorage.setItem(`analysis-${analysisData.analysisId}`, JSON.stringify(exerciseData))

      // Rediriger vers le rapport
      router.push(`/exercise/report/${analysisData.analysisId}`)

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error)
      alert('Erreur lors de l\'analyse. Veuillez réessayer.')
      setAnalyzing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
          <Link href="/exercise/brief">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{subject.title}</h1>
            <p className="text-white/60 text-sm mt-1">
              {mediaType === 'video' ? 'Enregistrement vidéo' : 'Enregistrement audio'}
            </p>
          </div>
        </div>

        {/* Zone d'enregistrement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="glass-effect border-white/10 p-8">
            {/* Preview vidéo ou visualisation audio */}
            <div className="relative mb-8 rounded-xl overflow-hidden bg-black/30 aspect-video flex items-center justify-center">
              {mediaType === 'video' ? (
                <video
                  ref={videoPreviewRef}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Mic className={`w-16 h-16 ${recordingState === 'recording' ? 'text-red-500 animate-pulse' : 'text-white/40'}`} />
                  <p className="text-white/60">
                    {recordingState === 'idle' && 'Clique sur Démarrer pour commencer'}
                    {recordingState === 'recording' && 'Enregistrement en cours...'}
                    {recordingState === 'paused' && 'Enregistrement en pause'}
                    {recordingState === 'stopped' && 'Enregistrement terminé'}
                  </p>
                </div>
              )}

              {/* Indicateur d'enregistrement */}
              {recordingState === 'recording' && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/90 px-3 py-2 rounded-full">
                  <Circle className="w-3 h-3 fill-white animate-pulse" />
                  <span className="text-white text-sm font-semibold">REC</span>
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="text-center mb-8">
              <div className="text-6xl font-bold font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {formatTime(elapsedTime)}
              </div>
              <p className="text-white/60 text-sm mt-2">
                Durée cible : {subject.duration} min
              </p>
            </div>

            {/* Contrôles d'enregistrement */}
            <div className="flex justify-center gap-4">
              {recordingState === 'idle' && (
                <Button
                  onClick={startRecording}
                  className="h-16 px-8 text-lg bg-gradient-to-r from-primary to-accent gap-3"
                >
                  <Circle className="w-5 h-5 fill-white" />
                  Démarrer l'enregistrement
                </Button>
              )}

              {recordingState === 'recording' && (
                <>
                  <Button
                    onClick={pauseRecording}
                    variant="outline"
                    className="h-16 px-8 gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </Button>
                  <Button
                    onClick={stopRecording}
                    className="h-16 px-8 bg-red-500 hover:bg-red-600 gap-2"
                  >
                    <Square className="w-5 h-5" />
                    Arrêter
                  </Button>
                </>
              )}

              {recordingState === 'paused' && (
                <>
                  <Button
                    onClick={resumeRecording}
                    className="h-16 px-8 bg-gradient-to-r from-primary to-accent gap-2"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Reprendre
                  </Button>
                  <Button
                    onClick={stopRecording}
                    variant="outline"
                    className="h-16 px-8 gap-2"
                  >
                    <Square className="w-5 h-5" />
                    Arrêter
                  </Button>
                </>
              )}

              {recordingState === 'stopped' && (
                <>
                  <Button
                    onClick={resetRecording}
                    variant="outline"
                    className="h-16 px-8 gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Recommencer
                  </Button>
                  <Button
                    onClick={submitRecording}
                    disabled={analyzing}
                    className="h-16 px-8 bg-gradient-to-r from-primary to-accent gap-2"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Analyser ma présentation
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Conseils pendant l'enregistrement */}
        {recordingState !== 'stopped' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect border-primary/30 p-6 bg-primary/5">
              <h3 className="font-semibold mb-3">Conseils pour un bon enregistrement</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Parle clairement et à un rythme naturel (140-160 mots/min)</li>
                <li>• Utilise des pauses stratégiques pour respirer et marquer les transitions</li>
                <li>• Évite les mots parasites comme "euh", "donc", "en fait"</li>
                <li>• Reste naturel et authentique dans ton discours</li>
                <li>• Fais attention à ton articulation et ta posture</li>
              </ul>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
