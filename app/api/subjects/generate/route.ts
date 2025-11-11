import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Configuration
export const runtime = 'nodejs'
export const maxDuration = 30

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

export async function GET(request: NextRequest) {
  try {
    // Vérifier que l'API key est configurée
    if (!process.env.GEMINI_API_KEY || !genAI) {
      console.error('GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API Gemini non configurée' },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Génère 3 sujets de présentation orale variés et engageants pour s'entraîner à l'éloquence.

Critères :
- Sujets actuels, intéressants et accessibles
- Variété de difficulté : Facile, Moyen, Difficile
- Durée suggérée : 2-4 minutes
- Sujets qui permettent de structurer un discours clair

Retourne UNIQUEMENT un objet JSON valide avec cette structure (sans markdown) :

{
  "subjects": [
    {
      "title": "Titre court et accrocheur (max 5 mots)",
      "difficulty": "Facile",
      "duration": 2,
      "preview": "Phrase d'accroche captivante en 15-20 mots"
    },
    {
      "title": "Titre",
      "difficulty": "Moyen",
      "duration": 3,
      "preview": "Phrase d'accroche"
    },
    {
      "title": "Titre",
      "difficulty": "Difficile",
      "duration": 4,
      "preview": "Phrase d'accroche"
    }
  ]
}

Sois créatif et propose des sujets variés (histoire, tech, société, science, culture, etc.).`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parser le JSON (nettoyer les markdown si présents)
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const data = JSON.parse(cleanedText)

    return NextResponse.json(data)

  } catch (error) {
    console.error('Erreur génération sujets:', error)

    return NextResponse.json(
      {
        error: 'Erreur lors de la génération des sujets',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
