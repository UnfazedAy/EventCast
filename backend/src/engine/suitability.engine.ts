import { EventProfile } from "../constants/event-profiles";
import { AssessmentResult } from "../interfaces/assessment.interface";
import { WeatherData } from "../interfaces/weather.interface";

interface EvaluationContext {
  score: number;
  risks: string[];
  recommendations: string[];
}

export class SuitabilityEngine {
  evaluate(profile: EventProfile, weather: WeatherData): AssessmentResult {
    const context = this.createContext();

    this.evaluateTemperature(context, weather);
    this.evaluatePrecipitation(context, weather);
    this.evaluateWind(context, weather);
    this.applyProfileAdjustments(context, profile, weather);

    return this.buildResult(context);
  }

  private createContext(): EvaluationContext {
    return {
      score: 100,
      risks: [],
      recommendations: [],
    };
  }

  private evaluateTemperature(
    context: EvaluationContext,
    weather: WeatherData,
  ): void {
    if (weather.maxTemperature >= 20 && weather.maxTemperature <= 30) {
      context.recommendations.push(
        "Comfortable temperature for outdoor activities.",
      );
    }

    if (weather.maxTemperature > 35) {
      context.score -= 20;
      context.risks.push("High temperatures may cause discomfort.");
      context.recommendations.push(
        "Provide shaded areas and drinking water.",
      );
    }

    if (weather.maxTemperature < 15) {
      context.score -= 15;
      context.risks.push("Cold temperatures expected.");
      context.recommendations.push("Advise attendees to dress warmly.");
    }
  }

  private evaluatePrecipitation(
    context: EvaluationContext,
    weather: WeatherData,
  ): void {
    if (weather.precipitation > 10) {
      context.score -= 40;
      context.risks.push("Heavy rainfall expected.");
      context.recommendations.push(
        "Move the event indoors or prepare waterproof shelter.",
      );
    } else if (weather.precipitation > 2) {
      context.score -= 20;
      context.risks.push("Moderate rainfall possible.");
      context.recommendations.push("Prepare tents or umbrellas.");
    }
  }

  private evaluateWind(
    context: EvaluationContext,
    weather: WeatherData,
  ): void {
    if (weather.windSpeed > 30) {
      context.score -= 15;
      context.risks.push("Strong winds may affect outdoor setups.");
      context.recommendations.push(
        "Secure decorations and temporary structures.",
      );
    }
  }

  private applyProfileAdjustments(
    context: EvaluationContext,
    profile: EventProfile,
    weather: WeatherData,
  ): void {
    switch (profile) {
      case EventProfile.FORMAL:
        if (weather.precipitation > 2) {
          context.score -= 15;
          context.recommendations.push(
            "Consider arranging an indoor backup venue.",
          );
        }
        break;

      case EventProfile.SPORTS:
        if (weather.precipitation <= 5) {
          context.score += 5;
          context.recommendations.push(
            "Light rain is generally acceptable for sports.",
          );
        }
        break;

      case EventProfile.ADVENTURE:
        if (weather.maxTemperature < 18) {
          context.score -= 10;
          context.recommendations.push(
            "Participants should bring warm clothing.",
          );
        }
        break;

      case EventProfile.CASUAL:
        if (weather.precipitation > 5) {
          context.score -= 10;
          context.risks.push("Wet conditions may reduce comfort at informal gatherings.");
          context.recommendations.push(
            "Consider a covered area for food and seating.",
          );
        }
        break;

      case EventProfile.ENTERTAINMENT:
        if (weather.precipitation > 2) {
          context.score -= 10;
          context.risks.push(
            "Rain may affect stage equipment and audience comfort.",
          );
          context.recommendations.push(
            "Ensure sound and lighting equipment is weather-protected.",
          );
        }

        if (weather.windSpeed > 25) {
          context.score -= 10;
          context.risks.push("Wind may affect stage setups and large screens.");
          context.recommendations.push(
            "Secure staging, banners, and temporary structures.",
          );
        }
        break;

      case EventProfile.GENERAL:
        break;
    }
  }

  private buildResult(context: EvaluationContext): AssessmentResult {
    const score = Math.max(0, Math.min(context.score, 100));
    const rating = this.resolveRating(score);
    const summary = this.resolveSummary(rating);

    return {
      score,
      rating,
      summary,
      risks: context.risks,
      recommendations: context.recommendations,
    };
  }

  private resolveRating(score: number): AssessmentResult["rating"] {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  }

  private resolveSummary(rating: AssessmentResult["rating"]): string {
    switch (rating) {
      case "Excellent":
        return "Excellent weather conditions for this event.";
      case "Good":
        return "Weather conditions are generally favorable.";
      case "Fair":
        return "Weather conditions may impact parts of the event.";
      case "Poor":
        return "Weather conditions are unfavorable for outdoor activities.";
    }
  }
}
