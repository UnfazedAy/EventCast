# EventCast Frontend

Simple React + Vite single-page app for assessing outdoor event weather suitability.

## Prerequisites

- Node.js 18+
- EventCast backend running on `http://localhost:3000`

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## Environment

Copy `.env.example` to `.env` if you need to point at a different API host:

```env
VITE_API_URL=http://localhost:3000
```

In development, leave `VITE_API_URL` empty to use the Vite dev proxy.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
