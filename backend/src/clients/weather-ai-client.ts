import axios from "axios";
import { env } from "../config/env";

function toBearerToken(apiKey: string): string {
  const trimmed = apiKey.trim();
  return trimmed.startsWith("Bearer ") ? trimmed : `Bearer ${trimmed}`;
}

export const weatherAIClient = axios.create({
  baseURL: env.weatherAI.baseUrl,
  timeout: 10000,
  headers: {
    Authorization: toBearerToken(env.weatherAI.apiKey),
    Accept: "application/json",
  },
});