# HITS Tempo Analyzer

A client-only tempo calculator that turns swing timestamps into actionable feedback. Plug in the load, fire, and contact moments from a swing capture and get instant phase lengths, tempo ratio, and a single coaching cue—wrapped in a dark, athletic Tailwind UI.

## Tech Stack

- [Next.js 16 App Router](https://nextjs.org/docs/app) with React 19 and TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (no custom build tooling required)
- Client-only experience—no database or API calls

## Getting Started

Install dependencies (already installed when scaffolding, but included here for reference):

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the analyzer. The app hot-reloads as you edit files.

## Using the Analyzer

1. Capture three timestamps from your swing video or launch monitor:
   - **Load** – top of the backswing
   - **Fire** – first move initiating the downswing
   - **Contact** – impact with the ball
2. Enter each timestamp as seconds (`23.08`) or `mm:ss.sss` (`0:23.080`).
3. The app computes:
   - Load phase duration
   - Fire phase duration
   - Tempo ratio (load ÷ fire)
   - A color-coded tempo zone with one coaching cue

Everything runs in the browser; no data leaves the page.

## Project Structure

- `app/page.tsx` – Tempo analyzer UI
- `app/layout.tsx` – Global layout and metadata
- `app/globals.css` – Tailwind import and dark theme tokens
- `src/lib/tempo.ts` – Timestamp parsing and tempo logic
- `tailwind.config.js` / `postcss.config.js` – Styling setup

## Available Scripts

- `npm run dev` – Start the Next.js dev server
- `npm run build` – Create a production build
- `npm run start` – Launch the production server
- `npm run lint` – Run ESLint

## License

MIT © HITS Tempo Lab
