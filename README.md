# Hits Tempo App

A Next.js application for analyzing hitting tempo in sports performance.

## Features

- **Tempo Analysis**: Calculate Load Phase, Fire Phase, and Tempo Ratio from three timestamps
- **Coaching Cues**: Get instant feedback based on your tempo ratio
- **Dark Athletic Design**: Clean, modern UI optimized for performance analysis

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. Enter three timestamps:
   - **Load Time**: When the load phase begins
   - **Fire Time**: When the fire phase begins
   - **Contact Time**: When contact occurs

2. Click "Calculate Tempo" to see:
   - Load Phase duration
   - Fire Phase duration
   - Tempo Ratio (Load:Fire)
   - Coaching cue based on your ratio

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Client-only** - No backend or database required

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main tempo analyzer UI
│   └── globals.css     # Global styles
├── src/
│   └── lib/
│       └── tempo.ts    # Tempo calculation logic
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Build for Production

```bash
npm run build
npm start
```
