import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "../lib/zod";
import { assessEventSchema } from "../validators/event.validator";

const eventProfileSchema = z
  .enum([
    "formal",
    "casual",
    "sports",
    "adventure",
    "entertainment",
    "general",
  ])
  .openapi("EventProfile");

const assessmentResultSchema = z
  .object({
    score: z.number().int().min(0).max(100).openapi({ example: 85 }),
    rating: z
      .enum(["Excellent", "Good", "Fair", "Poor"])
      .openapi({ example: "Good" }),
    summary: z
      .string()
      .openapi({ example: "Weather conditions are generally favorable." }),
    risks: z
      .array(z.string())
      .openapi({ example: ["Moderate rainfall possible."] }),
    recommendations: z
      .array(z.string())
      .openapi({ example: ["Prepare tents or umbrellas."] }),
  })
  .openapi("AssessmentResult");

const weatherDataSchema = z
  .object({
    date: z.string().openapi({ example: "2026-07-20" }),
    maxTemperature: z.number().openapi({ example: 27.5 }),
    minTemperature: z.number().openapi({ example: 24.3 }),
    precipitation: z.number().openapi({ example: 0.9 }),
    windSpeed: z.number().openapi({ example: 13 }),
    weatherCode: z.number().int().openapi({ example: 51 }),
  })
  .openapi("WeatherData");

const assessEventDataSchema = z
  .object({
    event: z.object({
      name: z.string().openapi({ example: "Wedding Ceremony" }),
      profile: eventProfileSchema,
      date: z.string().openapi({ example: "2026-07-20" }),
    }),
    location: z.object({
      city: z.string().openapi({ example: "Lekki" }),
      country: z.string().openapi({ example: "Nigeria" }),
    }),
    weather: weatherDataSchema,
    assessment: assessmentResultSchema,
  })
  .openapi("AssessEventData");

const assessEventRequestSchema = assessEventSchema.openapi("AssessEventRequest");

const assessEventSuccessSchema = z
  .object({
    success: z.literal(true),
    data: assessEventDataSchema,
  })
  .openapi("AssessEventSuccessResponse");

const errorResponseSchema = z
  .object({
    success: z.literal(false),
    message: z.string().openapi({ example: "Validation failed" }),
    errors: z.record(z.string(), z.array(z.string())).optional(),
  })
  .openapi("ErrorResponse");

const healthResponseSchema = z
  .object({
    success: z.literal(true),
    message: z.string().openapi({ example: "EventCast API is running." }),
  })
  .openapi("HealthResponse");

const registry = new OpenAPIRegistry();

registry.registerPath({
  method: "get",
  path: "/health",
  tags: ["System"],
  summary: "Health check",
  description: "Returns the current health status of the API.",
  responses: {
    200: {
      description: "API is running",
      content: {
        "application/json": {
          schema: healthResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/events/assess",
  tags: ["Events"],
  summary: "Assess event weather suitability",
  description:
    "Resolves a location, fetches weather for the event date, classifies the event profile, and returns a suitability assessment.",
  request: {
    body: {
      description: "Event details used for weather suitability assessment",
      required: true,
      content: {
        "application/json": {
          schema: assessEventRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Assessment generated successfully",
      content: {
        "application/json": {
          schema: assessEventSuccessSchema,
        },
      },
    },
    400: {
      description: "Validation failed",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: "Location or weather forecast not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    502: {
      description: "External geocoding or weather service unavailable",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "EventCast API",
      version: "1.0.0",
      description:
        "EventCast evaluates outdoor event suitability by combining geocoded location data, weather forecasts, event classification, and a rules-based scoring engine.",
      contact: {
        name: "EventCast",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development",
      },
    ],
    tags: [
      { name: "System", description: "Health and operational endpoints" },
      { name: "Events", description: "Event weather assessment endpoints" },
    ],
  });
}
