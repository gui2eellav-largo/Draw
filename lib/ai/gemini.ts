import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function analyzeVideo(transcript: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

  const prompt = `
    Analyse cette transcription d'un discours et fournis :
    1. Un score global sur 100
    2. Un score de rythme sur 100
    3. Un score de clarté sur 100
    4. Un score de structure sur 100
    5. Le nombre de mots de remplissage ("euh", "donc", "alors", etc.)
    6. Des annotations avec timestamps et conseils

    Transcription:
    ${transcript}

    Réponds au format JSON avec cette structure:
    {
      "globalScore": number,
      "rhythmScore": number,
      "clarityScore": number,
      "structureScore": number,
      "fillerWords": number,
      "annotations": [
        {"timestamp": number, "type": "success" | "warning" | "info", "message": string}
      ]
    }
  `

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  try {
    return JSON.parse(text)
  } catch (error) {
    console.error("Failed to parse Gemini response:", error)
    throw new Error("Invalid response from AI")
  }
}
