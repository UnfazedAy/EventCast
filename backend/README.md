# EventCast Backend

EventCast is a TypeScript/Express API that evaluates whether weather conditions are suitable for an outdoor event. It geocodes a location, fetches a forecast for the event date, classifies the event into a profile, and runs a rules-based suitability engine to produce a score, rating, risks, and recommendations.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Endpoints](#endpoints)
- [Request Validation](#request-validation)
- [Event Profiles & Suitability Engine](#event-profiles--suitability-engine)
- [Example Request & Response](#example-request--response)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Tech Stack](#tech-stack)
- [Production](#production)

---

## Features

- **Location resolution** via Open-Meteo Geocoding API
- **Weather forecasts** via Weather AI API
- **Event classification** from event name keywords (formal, casual, sports, etc.)
- **Suitability scoring engine** with temperature, rain, wind, and profile-specific rules
- **Zod request validation** with structured 400 error responses
- **OpenAPI 3.0 / Swagger UI** generated directly from Zod schemas (single source of truth)
- **Operational error handling** for external service failures, 404s, and validation errors

---

## Prerequisites

- **Node.js** 18 or later
- **npm**
- A valid **Weather AI API key** ([Weather AI](https://api.weather-ai.co))

---

## Quick Start

1. **Install dependencies**

```bash
cd backend
npm install
```

2. **Configure environment**

```bash
cp .env.example .env
```

Edit `.env` and set your Weather AI credentials:

```env
PORT=3000
NODE_ENV=development
WEATHER_AI_API_KEY=wai_live_your_key_here
WEATHER_AI_BASE_URL=https://api.weather-ai.co/v1
```

> Store only the raw API key (no `Bearer` prefix). The client adds the prefix automatically.

3. **Start the development server**

```bash
npm run dev
```

The API runs at **http://localhost:3000** (or the port set in `PORT`).

4. **Open Swagger UI**

Visit **http://localhost:3000/api-docs** to explore and test endpoints interactively.

---

## Environment Variables

| Variable | Required | Description | Default |
| -------- | -------- | ----------- | ------- |
| `PORT` | No | HTTP port for the server | `3000` |
| `NODE_ENV` | No | `development` or `production` | `development` |
| `WEATHER_AI_API_KEY` | **Yes** | Weather AI API key | — |
| `WEATHER_AI_BASE_URL` | No | Weather AI API base URL | `https://api.weather-ai.co/v1` |

See `.env.example` for the full template.

---

## API Documentation (Swagger)

OpenAPI documentation is generated from the same Zod schemas used for runtime validation via [`@asteasolutions/zod-to-openapi`](https://github.com/asteasolutions/zod-to-openapi).

| Resource | URL |
| -------- | --- |
| Swagger UI | http://localhost:3000/api-docs |
| OpenAPI JSON | http://localhost:3000/api-docs/openapi.json |

Schemas, request bodies, and response shapes stay in sync with validation because both are derived from Zod.

---

## Endpoints

### `GET /`

Welcome message.

### `GET /health`

Health check — confirms the API process is running.

**Response:**

```json
{
  "success": true,
  "message": "EventCast API is running."
}
```

### `POST /api/v1/events/assess`

Assess weather suitability for an event.

**Request body:**

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `eventName` | string | Yes | Name of the event (used for profile classification) |
| `location` | string | Yes | City or place name to geocode |
| `eventDate` | string | Yes | Event date in `YYYY-MM-DD` format |

**Success response:** `200 OK` with assessment payload (see [Example](#example-request--response)).

**Error responses:**

| Status | When |
| ------ | ---- |
| `400` | Invalid or missing request fields |
| `404` | Location not found, or no forecast for the given date |
| `502` | External geocoding or weather service unavailable |

---

## Request Validation

Validation lives in `src/validators/` and is applied via the `validate` middleware.

**`assessEventSchema` rules:**

- `eventName` — required, trimmed, 1–200 characters
- `location` — required, trimmed, 1–200 characters
- `eventDate` — required, must match `YYYY-MM-DD` and be a valid date

**Example validation error (`400`):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "eventName": ["Event name is required"],
    "eventDate": ["Event date must be in YYYY-MM-DD format"]
  }
}
```

---

## Event Profiles & Suitability Engine

Events are classified into one of six profiles based on keywords in the event name (`src/constants/event-profiles.ts`):

| Profile | Example keywords | Profile-specific engine behavior |
| ------- | ---------------- | -------------------------------- |
| `formal` | wedding, conference, graduation | Extra rain penalty; indoor backup recommendation |
| `casual` | birthday, picnic, party, bbq | Penalty for heavy rain (> 5 mm); covered seating advice |
| `sports` | football, marathon, volleyball | Light rain tolerance bonus (≤ 5 mm precipitation) |
| `adventure` | camping, hiking, trek | Cold-weather clothing recommendation (< 18°C) |
| `entertainment` | concert, festival, show | Rain and wind penalties for stage/equipment risk |
| `general` | (fallback) | Base rules only — no extra profile adjustments |

### Base scoring rules (all profiles)

| Condition | Score impact | Output |
| --------- | ------------ | ------ |
| Max temp 20–30°C | — | Comfortable temperature recommendation |
| Max temp > 35°C | −20 | Heat risk + shade/water advice |
| Max temp < 15°C | −15 | Cold risk + dress warmly advice |
| Precipitation > 10 mm | −40 | Heavy rain risk + indoor/shelter advice |
| Precipitation > 2 mm | −20 | Moderate rain risk + tent/umbrella advice |
| Wind speed > 30 km/h | −15 | Strong wind risk + secure structures advice |

Score is clamped to **0–100**, then mapped to a rating:

| Score | Rating |
| ----- | ------ |
| ≥ 85 | Excellent |
| ≥ 70 | Good |
| ≥ 50 | Fair |
| < 50 | Poor |

Engine implementation: `src/engine/suitability.engine.ts`

---

## Example Request & Response

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/events/assess \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Wedding Ceremony",
    "location": "Lekki",
    "eventDate": "2026-07-20"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "event": {
      "name": "Wedding Ceremony",
      "profile": "formal",
      "date": "2026-07-20"
    },
    "location": {
      "city": "Lekki",
      "country": "Nigeria"
    },
    "weather": {
      "date": "2026-07-20",
      "maxTemperature": 27,
      "minTemperature": 24.8,
      "precipitation": 3,
      "windSpeed": 13,
      "weatherCode": 53
    },
    "assessment": {
      "score": 65,
      "rating": "Fair",
      "summary": "Weather conditions may impact parts of the event.",
      "risks": ["Moderate rainfall possible."],
      "recommendations": [
        "Comfortable temperature for outdoor activities.",
        "Prepare tents or umbrellas.",
        "Consider arranging an indoor backup venue."
      ]
    }
  }
}
```

---

## Error Handling

Centralized in `src/middleware/errorHandler.ts`:

| Error type | Status | Behavior |
| ---------- | ------ | -------- |
| `ZodError` | 400 | Returns `Validation failed` with field errors |
| `AppError` | varies | Operational errors (404 location, etc.) |
| `AxiosError` | 502 / upstream | External API failures with safe user-facing messages |
| Unknown | 500 | Generic message in production; details in development |

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts                  # Express app, middleware, route mounting
│   ├── server.ts               # Entry point
│   ├── config/
│   │   └── env.ts              # Environment configuration
│   ├── routes/
│   │   └── event-routes.ts     # Event routes + validation middleware
│   ├── controllers/
│   │   └── event.controller.ts # HTTP handlers
│   ├── services/
│   │   ├── event.service.ts    # Orchestrates assess flow
│   │   ├── location.service.ts # Geocoding (Open-Meteo)
│   │   ├── weather.service.ts  # Weather AI forecast
│   │   └── event-classifier.service.ts
│   ├── engine/
│   │   └── suitability.engine.ts  # Scoring rules engine
│   ├── validators/
│   │   └── event.validator.ts  # Zod schemas (validation + OpenAPI)
│   ├── openapi/
│   │   ├── document.ts         # OpenAPI registry & document generator
│   │   └── swagger.ts          # Swagger UI routes
│   ├── lib/
│   │   └── zod.ts              # Zod + OpenAPI extension bootstrap
│   ├── clients/
│   │   └── weather-ai-client.ts
│   ├── middleware/
│   │   ├── validate.ts         # Generic Zod validation middleware
│   │   └── errorHandler.ts     # Centralized error responses
│   ├── interfaces/             # TypeScript interfaces
│   ├── constants/
│   │   └── event-profiles.ts   # Profile enum + keyword map
│   ├── dto/
│   │   └── event.dto.ts        # Re-exports from validators
│   └── utils/
│       ├── AppError.ts
│       └── logger.ts
├── .env.example
├── tsconfig.json
└── package.json
```

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start dev server with hot reload (`ts-node-dev`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm test` | Tests (not configured yet) |

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| Validation | Zod 4 |
| API docs | `@asteasolutions/zod-to-openapi` + Swagger UI |
| HTTP client | Axios |
| Security | Helmet, CORS |
| Logging | Morgan + custom logger |

---

## Production

```bash
npm run build
NODE_ENV=production npm start
```

- Set `NODE_ENV=production` to suppress internal error details in 500 responses.
- Ensure `WEATHER_AI_API_KEY` and `WEATHER_AI_BASE_URL` are configured in your deployment environment.
- Swagger UI is available at `/api-docs` in all environments; restrict access in production if needed.

---

## External Services

| Service | Purpose | Docs |
| ------- | ------- | ---- |
| Open-Meteo Geocoding | Resolve location strings to coordinates | [geocoding-api.open-meteo.com](https://open-meteo.com/en/docs/geocoding-api) |
| Weather AI | 7-day weather forecast | [api.weather-ai.co](https://api.weather-ai.co) |

Both services are called server-side; no API keys are exposed to the client.
