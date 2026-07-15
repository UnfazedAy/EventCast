import axios, { AxiosError, AxiosResponse } from "axios";
import { ResolvedLocation } from "../interfaces/location.interface";
import { AppError } from "../utils/AppError";

interface GeocodingResult {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

const RETRYABLE_NETWORK_CODES = new Set([
  "EAI_AGAIN",
  "ENOTFOUND",
  "ETIMEDOUT",
  "ECONNABORTED",
]);

function isRetryableNetworkError(error: unknown): boolean {
  return (
    error instanceof AxiosError &&
    !error.response &&
    RETRYABLE_NETWORK_CODES.has(error.code ?? "")
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class LocationService {
  async resolve(location: string): Promise<ResolvedLocation> {
    const { data } = await this.fetchGeocoding(location);

    if (!data.results?.length) {
      throw new AppError(404, `Unable to resolve "${location}"`);
    }

    const result = data.results[0];

    return {
      latitude: result.latitude,
      longitude: result.longitude,
      city: result.name,
      country: result.country,
    };
  }

  private async fetchGeocoding(
    location: string,
    attempt = 1,
  ): Promise<AxiosResponse<GeocodingResponse>> {
    try {
      return await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        {
          params: {
            name: location,
            count: 1,
          },
          timeout: 10_000,
        },
      );
    } catch (error) {
      if (isRetryableNetworkError(error) && attempt < 3) {
        await delay(500 * attempt);
        return this.fetchGeocoding(location, attempt + 1);
      }

      throw error;
    }
  }
}