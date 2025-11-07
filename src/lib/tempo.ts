export type TempoZone = "danger" | "warning" | "success";

export interface TempoAnalysis {
  loadPhase: number;
  firePhase: number;
  tempoRatio: number;
  zone: TempoZone;
  cue: string;
}

export class TempoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TempoError";
  }
}

/**
 * Parses a timestamp string into total seconds.
 *
 * Supports any of the following formats:
 * - "12.34" → seconds
 * - "1:12.34" → minutes:seconds
 * - "1:02:03.45" → hours:minutes:seconds
 */
export function parseTimestamp(input: string): number | null {
  if (!input) {
    return null;
  }

  const trimmed = input.trim();
  if (!trimmed || trimmed.startsWith("-")) {
    return null;
  }

  const segments = trimmed.split(":").map((segment) => segment.trim());
  if (segments.some((segment) => segment === "")) {
    return null;
  }

  const secondsSegment = segments.pop()!;
  const seconds = Number.parseFloat(secondsSegment);
  if (Number.isNaN(seconds)) {
    return null;
  }

  let total = seconds;
  let multiplier = 60;

  while (segments.length > 0) {
    const value = Number.parseInt(segments.pop()!, 10);
    if (Number.isNaN(value)) {
      return null;
    }
    total += value * multiplier;
    multiplier *= 60;
  }

  return total;
}

export function analyzeTempo(
  load: number,
  fire: number,
  contact: number,
): TempoAnalysis {
  if (![load, fire, contact].every((value) => Number.isFinite(value))) {
    throw new TempoError("All timestamps must be valid numbers.");
  }

  if (!(load < fire && fire < contact)) {
    throw new TempoError("Timestamps must progress in order: Load < Fire < Contact.");
  }

  const loadPhase = fire - load;
  const firePhase = contact - fire;

  if (loadPhase <= 0 || firePhase <= 0) {
    throw new TempoError("Each phase must have a positive duration.");
  }

  const tempoRatio = loadPhase / firePhase;
  const { zone, cue } = resolveTempoCue(tempoRatio);

  return {
    loadPhase,
    firePhase,
    tempoRatio,
    zone,
    cue,
  };
}

function resolveTempoCue(tempoRatio: number): Pick<TempoAnalysis, "zone" | "cue"> {
  if (tempoRatio < 1.6) {
    return {
      zone: "danger",
      cue: "Stay patient in the load — give yourself more time to gather.",
    };
  }

  if (tempoRatio < 1.8) {
    return {
      zone: "warning",
      cue: "Smooth transition, but keep building coil before firing.",
    };
  }

  if (tempoRatio <= 2.2) {
    return {
      zone: "success",
      cue: "Tour-level tempo — keep trusting your athletic rhythm.",
    };
  }

  if (tempoRatio <= 2.6) {
    return {
      zone: "warning",
      cue: "Contact is lagging — sync up the fire phase for a sharper strike.",
    };
  }

  return {
    zone: "danger",
    cue: "Unleash faster — your fire phase is dragging behind the load.",
  };
}

export function formatSeconds(seconds: number, fractionDigits = 3): string {
  return `${seconds.toFixed(fractionDigits)}s`;
}
