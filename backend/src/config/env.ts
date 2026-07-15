import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  publicApiUrl: process.env.API_PUBLIC_URL?.replace(/\/$/, ""),

  weatherAI: {
    apiKey: process.env.WEATHER_AI_API_KEY!,
    baseUrl:
      process.env.WEATHER_AI_BASE_URL || "https://api.weather-ai.co/v1",
  },
};