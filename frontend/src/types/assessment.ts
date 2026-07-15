export type EventProfile =
  | "formal"
  | "casual"
  | "sports"
  | "adventure"
  | "entertainment"
  | "general";

export type AssessmentRating = "Excellent" | "Good" | "Fair" | "Poor";

export interface AssessEventRequest {
  eventName: string;
  location: string;
  eventDate: string;
}

export interface AssessmentResult {
  score: number;
  rating: AssessmentRating;
  summary: string;
  risks: string[];
  recommendations: string[];
}

export interface AssessEventData {
  event: {
    name: string;
    profile: EventProfile;
    date: string;
  };
  location: {
    city: string;
    country: string;
  };
  weather: {
    date: string;
    maxTemperature: number;
    minTemperature: number;
    precipitation: number;
    windSpeed: number;
    weatherCode: number;
  };
  assessment: AssessmentResult;
}

export interface ApiSuccessResponse {
  success: true;
  data: AssessEventData;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
