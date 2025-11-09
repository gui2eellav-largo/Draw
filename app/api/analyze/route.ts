import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/db/prisma'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Sauvegarder temporairement le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const tempPath = join('/tmp', `${Date.now()}-${file.name}`)
    await writeFile(tempPath, buffer)

    // Préparer le fichier pour Gemini
    const videoBuffer = buffer.toString('base64')

    // Analyser avec Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    const prompt = `Tu es un expert en communication orale et éloquence. Analyse cette vidéo de présentation et fournis une évaluation détaillée.

Retourne UNIQUEMENT un objet JSON valide avec cette structure exacte (sans markdown, sans texte avant ou après) :

{
  "globalScore": <number 0-100>,
  "rhythmScore": <number 0-100>,
  "clarityScore": <number 0-100>,
  "structureScore": <number 0-100>,
  "wordsPerMin": <number>,
  "fillerWords": <number>,
  "pausesEffective": <number 0-100>,
  "transcript": "<texte transcrit>",
  "annotations": [
    {
      "timestamp": <seconds>,
      "type": "success|warning|error",
      "message": "<observation courte>"
    }
  ],
  "insights": {
    "strengths": ["<force 1>", "<force 2>"],
    "improvements": ["<axe 1>", "<axe 2>"],
    "tips": ["<conseil 1>", "<conseil 2>"]
  }
}

Critères d'évaluation :
- Rythme : débit de parole (objectif 140-160 mots/min), pauses stratégiques
- Clarté : articulation, projection vocale, mots parasites ("euh", "donc", etc.)
- Structure : cohérence du discours, utilisation de connecteurs logiques

Sois précis dans les scores et les observations.`

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

    // Sauvegarder dans la base de données
    const analysis = await prisma.analysis.create({
      data: {
        userId: 'mock-user-id', // TODO: remplacer par vrai user ID après auth
        videoUrl: tempPath, // TODO: uploader sur cloud storage
        duration: 120, // TODO: extraire durée réelle
        globalScore: analysisData.globalScore,
        rhythmScore: analysisData.rhythmScore,
        clarityScore: analysisData.clarityScore,
        structureScore: analysisData.structureScore,
        wordsPerMin: analysisData.wordsPerMin,
        fillerWords: analysisData.fillerWords,
        pausesEffective: analysisData.pausesEffective,
        transcript: analysisData.transcript,
        annotations: JSON.stringify(analysisData.annotations)
      }
    })

    // Nettoyer le fichier temporaire après quelques secondes
    setTimeout(async () => {
      try {
        await unlink(tempPath)
      } catch (e) {
        console.error('Erreur suppression fichier:', e)
      }
    }, 5000)

    return NextResponse.json({
      analysisId: analysis.id,
      ...analysisData
    })

  } catch (error) {
    console.error('Erreur analyse:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
