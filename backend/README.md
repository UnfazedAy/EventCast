# EventCast Backend

TypeScript/Express API for EventCast.

## Prerequisites

- Node.js 18+
- npm

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

3. Start the development server:

```bash
npm run dev
```

The API runs at `http://localhost:3000` by default (or the port set in `PORT`).

## Scripts

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| `npm run dev`  | Start dev server with hot reload         |
| `npm run build`| Compile TypeScript to `dist/`            |
| `npm start`    | Run the compiled production build        |
| `npm test`     | Run tests (not configured yet)           |

## Environment Variables

| Variable               | Description                          | Default       |
| ---------------------- | ------------------------------------ | ------------- |
| `PORT`                 | Server port                          | `3000`        |
| `NODE_ENV`             | Environment (`development` / `production`) | `development` |
| `WEATHER_AI_API_KEY`   | Weather AI API key                   | —             |
| `WEATHER_AI_BASE_URL`  | Weather AI API base URL              | —             |

See `.env.example` for the full template.

## API Endpoints

### Health Check

```
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "EventCast API is running."
}
```

## Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server entry point
│   ├── config/             # Configuration
│   ├── routes/             # Route definitions
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── clients/            # External API clients
│   ├── engine/             # Core processing engine
│   ├── evaluators/         # Evaluation logic
│   ├── builders/           # Object builders
│   ├── validators/         # Input validation (Zod)
│   ├── middleware/         # Express middleware
│   ├── interfaces/         # TypeScript interfaces
│   ├── constants/          # App constants
│   └── utils/              # Shared utilities (e.g. logger)
├── tests/                  # Test files
├── .env.example            # Environment template
├── tsconfig.json
└── package.json
```

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript
- **Validation:** Zod
- **HTTP Client:** Axios
- **Security:** Helmet, CORS
- **Logging:** Morgan (HTTP), custom logger (`src/utils/logger.ts`)

## Production

```bash
npm run build
npm start
```

Set `NODE_ENV=production` in your environment for production logging levels.
