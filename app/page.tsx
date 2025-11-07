"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  TempoAnalysis,
  TempoError,
  TempoZone,
  analyzeTempo,
  formatSeconds,
  parseTimestamp,
} from "@/lib/tempo";

type FieldKey = "load" | "fire" | "contact";

const FIELD_DEFINITIONS: Array<{
  key: FieldKey;
  label: string;
  sublabel: string;
  placeholder: string;
}> = [
  {
    key: "load",
    label: "Load",
    sublabel: "Top of backswing",
    placeholder: "0:18.250",
  },
  {
    key: "fire",
    label: "Fire",
    sublabel: "Start of downswing",
    placeholder: "0:21.640",
  },
  {
    key: "contact",
    label: "Contact",
    sublabel: "Impact with ball",
    placeholder: "0:23.020",
  },
];

const ZONE_STYLES: Record<
  TempoZone,
  { label: string; badge: string; card: string; accent: string }
> = {
  success: {
    label: "Locked In",
    badge: "border-success/50 bg-success/10 text-success",
    card: "border-success/40 shadow-[0_0_36px_rgba(34,197,94,0.18)]",
    accent: "text-success",
  },
  warning: {
    label: "Close",
    badge: "border-warning/60 bg-warning/10 text-warning",
    card: "border-warning/40 shadow-[0_0_36px_rgba(250,204,21,0.18)]",
    accent: "text-warning",
  },
  danger: {
    label: "Reset Rhythm",
    badge: "border-danger/50 bg-danger/10 text-danger",
    card: "border-danger/40 shadow-[0_0_36px_rgba(239,68,68,0.2)]",
    accent: "text-danger",
  },
};

type TimestampState = Record<FieldKey, string>;

function buildInitialState(): TimestampState {
  return {
    load: "",
    fire: "",
    contact: "",
  };
}

export default function HomePage() {
  const [timestamps, setTimestamps] =
    useState<TimestampState>(buildInitialState());

  const parsed = useMemo<Record<FieldKey, number | null>>(
    () => ({
      load: parseTimestamp(timestamps.load),
      fire: parseTimestamp(timestamps.fire),
      contact: parseTimestamp(timestamps.contact),
    }),
    [timestamps],
  );

  const fieldErrors = useMemo<Partial<Record<FieldKey, string>>>(() => {
    const errors: Partial<Record<FieldKey, string>> = {};

    (Object.keys(timestamps) as FieldKey[]).forEach((key) => {
      if (timestamps[key] && parsed[key] === null) {
        errors[key] = "Use seconds or mm:ss.sss format.";
      }
    });

    return errors;
  }, [timestamps, parsed]);

  const tempoState = useMemo<{
    analysis: TempoAnalysis | null;
    error: string | null;
  }>(() => {
    if (
      parsed.load === null ||
      parsed.fire === null ||
      parsed.contact === null
    ) {
      return { analysis: null, error: null };
    }

    try {
      return {
        analysis: analyzeTempo(
          parsed.load as number,
          parsed.fire as number,
          parsed.contact as number,
        ),
        error: null,
      };
    } catch (error) {
      if (error instanceof TempoError) {
        return { analysis: null, error: error.message };
      }
      return {
        analysis: null,
        error: "Unable to compute tempo — try adjusting the timestamps.",
      };
    }
  }, [parsed]);

  const zoneTokens = tempoState.analysis
    ? ZONE_STYLES[tempoState.analysis.zone]
    : null;

  const handleChange =
    (field: FieldKey) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[^0-9:.,]/g, "").replace(",", ".");
      setTimestamps((previous) => ({
        ...previous,
        [field]: value,
      }));
    };

  const handleReset = () => {
    setTimestamps(buildInitialState());
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-12 px-5 py-12 sm:px-8 lg:px-10">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-muted">
            Hits Tempo Lab
          </p>
          <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">
            Tempo Analyzer
          </h1>
          <p className="max-w-2xl text-base text-muted sm:text-lg">
            Drop in the key timestamps from your swing capture. We&apos;ll break
            down the load and fire phases and give you one focused cue to stay
            athletic through contact.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-surface/80 p-8 shadow-[0_40px_120px_-60px_rgba(56,189,248,0.25)] backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Timestamp Breakdown
              </h2>
              <p className="text-sm text-muted">
                Enter each moment as seconds or{" "}
                <span className="font-mono text-foreground/80">mm:ss.sss</span>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="self-start rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted transition hover:border-white/30 hover:text-foreground"
            >
              Reset
            </button>
          </div>
          <form className="mt-8 grid gap-6 md:grid-cols-3">
            {FIELD_DEFINITIONS.map(({ key, label, sublabel, placeholder }) => (
              <label
                key={key}
                className="group flex flex-col gap-3 rounded-xl border border-white/5 bg-surface-raised/80 p-5 transition hover:border-accent/50 hover:shadow-[0_30px_60px_-40px_rgba(56,189,248,0.45)]"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                    {label}
                  </span>
                  <span className="text-sm text-foreground/80">{sublabel}</span>
                </div>
                <input
                  name={key}
                  value={timestamps[key]}
                  onChange={handleChange(key)}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={placeholder}
                  spellCheck={false}
                  aria-invalid={Boolean(fieldErrors[key])}
                  className="w-full rounded-lg border border-white/10 bg-background/60 px-4 py-3 text-lg font-semibold tracking-wide text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
                />
                <span className="text-xs text-muted">
                  {fieldErrors[key] ?? "Example: 0:21.640"}
                </span>
              </label>
            ))}
          </form>
        </section>

        <section className="space-y-6">
          <div
            className={[
              "rounded-2xl border bg-surface/70 p-8 transition-all",
              zoneTokens?.card ?? "border-white/10 shadow-[0_30px_60px_-50px_rgba(15,23,42,0.7)]",
            ].join(" ")}
          >
            {tempoState.analysis ? (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted">
                      Tempo Ratio
                    </p>
                    <p className="mt-3 text-5xl font-semibold text-foreground sm:text-6xl">
                      {tempoState.analysis.tempoRatio.toFixed(2)}
                    </p>
                    <p className={`mt-3 text-sm ${zoneTokens?.accent ?? ""}`}>
                      {zoneTokens?.label}
                    </p>
                  </div>
                  <span
                    className={[
                      "inline-flex h-10 items-center justify-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.3em]",
                      zoneTokens?.badge ?? "border-white/20 text-muted",
                    ].join(" ")}
                  >
                    {zoneTokens?.label ?? "Awaiting Data"}
                  </span>
                </div>
                <p className="mt-6 text-lg text-foreground/80">
                  {tempoState.analysis.cue}
                </p>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Metric
                    label="Load Phase"
                    helper="Load → Fire"
                    value={formatSeconds(tempoState.analysis.loadPhase)}
                  />
                  <Metric
                    label="Fire Phase"
                    helper="Fire → Contact"
                    value={formatSeconds(tempoState.analysis.firePhase)}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4 text-muted">
                <p className="text-lg font-medium text-foreground/80">
                  Enter all three timestamps to see your tempo.
                </p>
                <p className="text-sm">
                  Track the moment you finish loading, when you first fire the
                  downswing, and when you strike the ball. We’ll keep everything
                  client-side.
                </p>
              </div>
            )}
          </div>
          {tempoState.error && (
            <div className="rounded-xl border border-danger/50 bg-danger/10 px-5 py-4 text-sm text-danger">
              {tempoState.error}
            </div>
          )}
          <div className="rounded-xl border border-white/5 bg-surface/60 px-6 py-5 text-sm text-muted">
            <p>
              Tip: Pair these timestamps with video frame markers from your
              launch monitor. Ideal tour tempo sits around 3:1 (load to fire).
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({
  label,
  helper,
  value,
}: {
  label: string;
  helper: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-background/80 px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-xs text-muted">{helper}</p>
    </div>
  );
}
