# Final EduVision Product Suite

Unified repository containing the three EduVision core application services:

1. **`unesco/`** (Frontend web application, Vite + React 19 + TypeScript) — Port `5173`
2. **`neweduvisionkesh/`** (Video generation engine & server, Express + Manim + Groq) — Port `4000`
3. **`eduvision-main/`** (EduVision Trust Center app, Next.js 16 App Router) — Port `3000`

## Quick Start (Run All Services)

To launch all three applications concurrently from the root directory:

```bash
npm run dev:all
```

This starts:
- `http://localhost:5173` — UNESCO Frontend & Marketplace
- `http://localhost:4000` — Video Generator Backend API
- `http://localhost:3000` — Trust Center Application

## Running Apps Individually

You can also run any app independently:

- **Frontend**: `cd unesco && npm run dev`
- **Video Backend**: `cd neweduvisionkesh && npm run serve`
- **Trust Center**: `cd eduvision-main && npm run dev`
