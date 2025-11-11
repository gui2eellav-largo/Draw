import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const maxDuration = 30

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY || !genAI) {
      return NextResponse.json(
        { error: 'API Gemini non configurée' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { subject, duration } = body

    if (!subject) {
      return NextResponse.json(
        { error: 'Sujet manquant' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Tu es un expert en rhétorique et communication orale. Génère un plan de présentation structuré pour le sujet suivant.

SUJET : ${subject}
DURÉE CIBLE : ${duration} minutes

Retourne UNIQUEMENT un objet JSON valide avec cette structure (sans markdown) :

{
  "introduction": {
    "hook": "Une phrase d'accroche captivante (question, fait surprenant, citation)",
    "context": "Contexte en 2-3 phrases pour situer le sujet",
    "announcement": "Annonce claire du plan en 1 phrase"
  },
  "mainPoints": [
    {
      "title": "Titre du point 1 (court et impactant)",
      "keyIdeas": ["Idée clé 1", "Idée clé 2", "Idée clé 3"],
      "example": "Un exemple concret pour illustrer"
    },
    {
      "title": "Titre du point 2",
      "keyIdeas": ["Idée clé 1", "Idée clé 2", "Idée clé 3"],
      "example": "Un exemple concret pour illustrer"
    },
    {
      "title": "Titre du point 3",
      "keyIdeas": ["Idée clé 1", "Idée clé 2", "Idée clé 3"],
      "example": "Un exemple concret pour illustrer"
    }
  ],
  "conclusion": {
    "summary": "Synthèse des points principaux en 2 phrases",
    "impact": "Message final percutant ou appel à l'action"
  },
  "tips": [
    "Conseil pratique pour la présentation 1",
    "Conseil pratique pour la présentation 2"
  ]
}

CONSIGNES :
- Adapte le niveau de détail à la durée cible
- Utilise un langage clair et engageant
- Propose des transitions fluides entre les parties
- Fournis des exemples concrets et pertinents
- Donne des conseils actionnables`

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
    console.error('Erreur génération brief:', error)

    let errorMessage = 'Erreur lors de la génération du brief'
    if (error instanceof Error) {
      console.error('Details:', error.message)
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
