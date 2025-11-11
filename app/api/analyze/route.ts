import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/db/prisma'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'

// Configuration
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds max

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'API key est configurée
    if (!process.env.GEMINI_API_KEY || !genAI) {
      console.error('GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API Gemini non configurée. Contactez l\'administrateur.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('video') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    console.log(`Received file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`)

    // Sauvegarder temporairement le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const tempPath = join('/tmp', `${Date.now()}-${file.name}`)
    await writeFile(tempPath, buffer)

    // Préparer le fichier pour Gemini
    const videoBuffer = buffer.toString('base64')

    // Analyser avec Gemini 2.5 Flash (meilleur pour l'analyse vidéo)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Tu es un expert en communication orale et éloquence. Analyse cette vidéo de présentation et fournis une évaluation détaillée.

IMPORTANT : Inclus des citations EXACTES du discours (verbatims) dans les annotations et insights pour illustrer tes observations.

Retourne UNIQUEMENT un objet JSON valide avec cette structure exacte (sans markdown, sans texte avant ou après) :

{
  "globalScore": <number 0-100>,
  "rhythmScore": <number 0-100>,
  "clarityScore": <number 0-100>,
  "structureScore": <number 0-100>,
  "wordsPerMin": <number>,
  "fillerWords": <number>,
  "pausesEffective": <number 0-100>,
  "transcript": "<transcription complète du discours>",
  "keyQuotes": [
    "<citation marquante 1>",
    "<citation marquante 2>",
    "<citation marquante 3>"
  ],
  "annotations": [
    {
      "timestamp": <seconds>,
      "type": "success|warning|error",
      "message": "<observation courte>",
      "quote": "<citation exacte si pertinent>"
    }
  ],
  "insights": {
    "strengths": [
      "<force 1 avec citation exacte entre guillemets si possible>",
      "<force 2 avec citation exacte entre guillemets si possible>"
    ],
    "improvements": [
      "<axe 1 avec exemple/citation précise>",
      "<axe 2 avec exemple/citation précise>"
    ],
    "tips": [
      "<conseil actionnable 1>",
      "<conseil actionnable 2>"
    ]
  }
}

Critères d'évaluation :
- Rythme : débit de parole (objectif 140-160 mots/min), pauses stratégiques
- Clarté : articulation, projection vocale, mots parasites ("euh", "donc", etc.)
- Structure : cohérence du discours, utilisation de connecteurs logiques

RÈGLES IMPORTANTES :
1. Transcris TOUT le discours dans "transcript"
2. Extrais 3-4 citations marquantes dans "keyQuotes"
3. Dans les annotations, ajoute des "quote" pour les moments clés
4. Dans strengths et improvements, cite des EXEMPLES PRÉCIS tirés du discours
5. Mets les citations entre guillemets : "exemple de citation"

Sois précis dans les scores et observations, et base-toi sur des éléments concrets du discours.`

    const result = await model.generateContent([
      {
        inlineData: {
          data: videoBuffer,
          mimeType: file.type
        }
      },
      { text: prompt }
    ])

    const response = await result.response
    const analysisText = response.text()

    // Parser le JSON (nettoyer les markdown si présents)
    const cleanedText = analysisText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const analysisData = JSON.parse(cleanedText)

    // Sauvegarder dans la base de données (si disponible)
    let analysisId = 'mock-analysis-' + Date.now()

    if (prisma) {
      try {
        // Extraire les principales forces et faiblesses
        const mainStrength = analysisData.insights?.strengths?.[0] || 'Bonne prestation générale'
        const mainWeakness = analysisData.insights?.improvements?.[0] || 'Continue à t\'entraîner'
        const recommendation = analysisData.insights?.tips?.[0] || 'Pratique régulièrement'

        const exercise = await prisma.exercise.create({
          data: {
            userId: 'mock-user-id', // TODO: remplacer par vrai user ID après auth
            subject: 'Présentation enregistrée', // Sera remplacé par le vrai sujet
            briefContent: '', // Pas de brief pour les uploads directs
            mediaType: file.type.includes('video') ? 'video' : 'audio',
            mediaUrl: tempPath,
            duration: 120, // TODO: extraire durée réelle
            globalScore: analysisData.globalScore,
            wordsPerMin: analysisData.wordsPerMin,
            fillerWords: analysisData.fillerWords,
            pausesAvg: analysisData.pausesEffective || 0,
            clarity: analysisData.clarityScore,
            mainStrength: mainStrength,
            mainWeakness: mainWeakness,
            recommendation: recommendation,
            timestamps: JSON.stringify(analysisData.annotations || [])
          }
        })
        analysisId = exercise.id
      } catch (dbError) {
        console.warn('Database save failed, continuing without persistence:', dbError)
      }
    }

    // Nettoyer le fichier temporaire après quelques secondes
    setTimeout(async () => {
      try {
        await unlink(tempPath)
      } catch (e) {
        console.error('Erreur suppression fichier:', e)
      }
    }, 5000)

    return NextResponse.json({
      analysisId,
      ...analysisData
    })

  } catch (error) {
    console.error('Erreur analyse complète:', error)

    // Message d'erreur détaillé
    let errorMessage = 'Erreur lors de l\'analyse'
    let errorDetails = ''

    if (error instanceof Error) {
      errorDetails = error.message

      // Erreurs spécifiques
      if (error.message.includes('API key')) {
        errorMessage = 'Clé API Gemini invalide'
      } else if (error.message.includes('quota')) {
        errorMessage = 'Quota API Gemini dépassé'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Temps d\'analyse dépassé'
      } else if (error.message.includes('size')) {
        errorMessage = 'Fichier trop volumineux'
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails || 'Erreur inconnue',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
