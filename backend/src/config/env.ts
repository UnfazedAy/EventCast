import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,

  weatherAI: {
    apiKey: process.env.WEATHER_AI_API_KEY!,
    baseUrl:
      process.env.WEATHER_AI_BASE_URL || "https://api.weather-ai.co/v1",
  },
};