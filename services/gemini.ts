import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MatchAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    market: { type: Type.STRING, description: "Main title, e.g. 'Doble Oportunidad', 'Over 3.5'" },
    selection: { type: Type.STRING, description: "Specific selection e.g. '1X', 'Local gana al descanso'" },
    probability: { type: Type.NUMBER, description: "Estimated probability percentage" },
    insight: { type: Type.STRING, description: "Reasoning why this bet was chosen" },
  },
  required: ["market", "selection", "probability", "insight"],
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    teamHome: { type: Type.STRING, description: "Name of the home team" },
    teamAway: { type: Type.STRING, description: "Name of the away team" },
    score: { type: Type.STRING, description: "Current score e.g., '1-0' or '0-0'" },
    competition: { type: Type.STRING, description: "Competition name" },
    date: { type: Type.STRING, description: "Date of match" },
    winProbability: {
      type: Type.OBJECT,
      properties: {
        home: { type: Type.NUMBER, description: "Win Home %" },
        draw: { type: Type.NUMBER, description: "Draw %" },
        away: { type: Type.NUMBER, description: "Win Away %" },
      },
      required: ["home", "draw", "away"],
    },
    goalProjections: {
      type: Type.OBJECT,
      properties: {
        over1_5: { type: Type.NUMBER, description: "Probability % of Over 1.5 Goals" },
        over2_5: { type: Type.NUMBER, description: "Probability % of Over 2.5 Goals" },
      },
      required: ["over1_5", "over2_5"],
    },
    btts: { type: Type.NUMBER, description: "Probability % Both Teams To Score (Full Time)" },
    predictedScore: { type: Type.STRING, description: "Most likely exact final score (e.g. '2-1')" },
    predictedScoreProbability: { type: Type.NUMBER, description: "Probability % of this exact score happening" },
    
    recommendation: { ...predictionSchema, description: "The single best statistical recommendation (High prob/value balance)" },
    conservativePrediction: { ...predictionSchema, description: "A very safe prediction with high probability (low risk)" },
    riskyPrediction: { ...predictionSchema, description: "A riskier prediction with lower probability but higher potential return" },

    statisticalTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5 key tips",
    },
  },
  required: ["teamHome", "teamAway", "score", "competition", "date", "winProbability", "goalProjections", "btts", "predictedScore", "predictedScoreProbability", "recommendation", "conservativePrediction", "riskyPrediction", "statisticalTips"],
};

export const analyzeMatchImage = async (base64Image: string, mimeType: string): Promise<MatchAnalysis> => {
  try {
    const prompt = `
      Analiza la imagen de este partido de fútbol.
      1. Identifica equipos, marcador, competición.
      2. Genera un análisis estadístico predictivo completo.
      3. Proporciona:
         - Probabilidades de victoria y goles.
         - "Recomendación Principal": La mejor apuesta balanceada.
         - "Predicción Reservada": Una apuesta muy segura (alta probabilidad, cuota baja).
         - "Predicción Arriesgada": Una apuesta difícil pero posible (ej. resultado exacto, ganador y ambos marcan, over alto).
         - Para cada predicción, proporciona un "insight" breve explicando el MOTIVO estadístico de la elección.
      
      Estructura la respuesta estrictamente en JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data received from Gemini");

    return JSON.parse(jsonText) as MatchAnalysis;

  } catch (error) {
    console.error("Error analyzing match:", error);
    throw error;
  }
};
