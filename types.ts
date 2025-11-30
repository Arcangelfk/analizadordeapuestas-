export interface MatchAnalysis {
  teamHome: string;
  teamAway: string;
  score: string;
  competition: string;
  date: string;
  winProbability: {
    home: number;
    draw: number;
    away: number;
  };
  goalProjections: {
    over1_5: number; // Changed to standard betting market
    over2_5: number; // Changed to standard betting market
  };
  btts: number; // Both Teams To Score (Full match)
  predictedScore: string; // e.g. "2-1"
  predictedScoreProbability: number; // % confidence in this score
  
  // Specific object for the "Recommended" Green Card
  recommendation: {
    market: string; // e.g. "Over 2.5", "Gana Local"
    selection: string; // e.g. "Total de Goles", "Resultado Final"
    probability: number;
    insight: string; // Short reasoning text
  };

  // New: Conservative Prediction (Safe bet)
  conservativePrediction: {
    market: string;
    selection: string;
    probability: number;
    insight: string; // Reasoning
  };

  // New: Risky Prediction (High value/risk)
  riskyPrediction: {
    market: string;
    selection: string;
    probability: number;
    insight: string; // Reasoning
  };

  statisticalTips: string[];
}

export interface AnalysisState {
  isLoading: boolean;
  data: MatchAnalysis | null;
  error: string | null;
}
