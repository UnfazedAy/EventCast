export interface AssessmentResult {
    score: number;
    rating: "Excellent" | "Good" | "Fair" | "Poor";
    summary: string;
    risks: string[];
    recommendations: string[];
  }