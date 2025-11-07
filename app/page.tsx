"use client";

import { useState } from "react";
import {
  calculateTempo,
  TempoInputs,
  TempoResult,
} from "@/lib/tempo";

type Mode = "time" | "frames";

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("time");

  // time mode inputs
  const [loadStart, setLoadStart] = useState("");
  const [fireStart, setFireStart] = useState("");
  const [contact, setContact] = useState("");

  // frames mode inputs
  const [fps, setFps] = useState("240");
  const [loadFrame, setLoadFrame] = useState("");
  const [fireFrame, setFireFrame] = useState("");
  const [contactFrame, setContactFrame] = useState("");

  const [result, setResult] = useState<TempoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onCalculate = () => {
    try {
      setError(null);
      setResult(null);

      let inputs: TempoInputs;

      if (mode === "time") {
        inputs = {
          mode: "time",
          loadStart: Number(loadStart),
          fireStart: Number(fireStart),
          contact: Number(contact),
        };
      } else {
        inputs = {
          mode: "frames",
          fps: Number(fps),
          loadFrame: Number(loadFrame),
          fireFrame: Number(fireFrame),
          contactFrame: Number(contactFrame),
        };
      }

      const res = calculateTempo(inputs);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Check your inputs.");
    }
  };

  const currentYear = new Date().getFullYear();

  const modeButton =
    "px-4 py-2 rounded-full text-sm font-medium border transition";
  const active =
    "bg-emerald-500 text-slate-950 border-emerald-400";
  const inactive =
    "bg-slate-900/70 text-slate-300 border-slate-700 hover:border-emerald-400";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold">
            HITS Tempo Analyzer (MVP)
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            A simple free tool from{" "}
            <span className="font-semibold">The Hitting Skool</span>{" "}
            to measure your swing tempo using video timestamps.
          </p>
        </header>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setMode("time")}
            className={`${modeButton} ${
              mode === "time" ? active : inactive
            }`}
          >
            Use Time (seconds)
          </button>
          <button
            onClick={() => setMode("frames")}
            className={`${modeButton} ${
              mode === "frames" ? active : inactive
            }`}
          >
            Use Frames (with FPS)
          </button>
        </div>

        {/* Inputs */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
          {mode === "time" ? (
            <>
              <Field
                label="Load Start (seconds)"
                value={loadStart}
                onChange={setLoadStart}
              />
              <Field
                label="Fire Start / Launch (seconds)"
                value={fireStart}
                onChange={setFireStart}
              />
              <Field
                label="Contact (seconds)"
                value={contact}
                onChange={setContact}
              />
              <Hint>
                Mark the moment your move begins (Load), the start of
                your forward launch (Fire), and the frame of Contact.
              </Hint>
            </>
          ) : (
            <>
              <Field
                label="Frames Per Second (FPS)"
                value={fps}
                onChange={setFps}
              />
              <Field
                label="Load Start Frame"
                value={loadFrame}
                onChange={setLoadFrame}
              />
              <Field
                label="Fire Start / Launch Frame"
                value={fireFrame}
                onChange={setFireFrame}
              />
              <Field
                label="Contact Frame"
                value={contactFrame}
                onChange={setContactFrame}
              />
              <Hint>
                Use your video editor or app to read frame numbers.
                Common slo-mo clips are 120–240 FPS.
              </Hint>
            </>
          )}

          <button
            onClick={onCalculate}
            className="w-full mt-2 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm md:text-base hover:bg-emerald-400 transition"
          >
            Calculate Tempo
          </button>

          {error && (
            <div className="mt-2 text-xs text-red-400">
              {error}
            </div>
          )}
        </section>

        {/* Results */}
        {result && (
          <section
            className={`rounded-2xl border p-4 space-y-2 ${
              result.bucket === "green"
                ? "bg-emerald-500/10 border-emerald-500/60"
                : result.bucket === "yellow"
                ? "bg-yellow-500/10 border-yellow-500/60"
                : "bg-red-500/10 border-red-500/60"
            }`}
          >
            <h2 className="text-lg font-semibold">
              Tempo Result
            </h2>
            <p className="text-sm text-slate-300">
              Tempo Ratio:{" "}
              <span className="font-bold text-emerald-400">
                {result.tempoRatio.toFixed(2)} : 1
              </span>
            </p>
            <p className="text-sm">{result.label}</p>
            <p className="text-sm text-slate-300">
              Coaching Cue:{" "}
              <span className="text-slate-100">
                {result.cue}
              </span>
            </p>
            <p className="text-[10px] text-slate-500 pt-1">
              This is an estimated timing model from your video.
              It does not replace in-person coaching or full
              biomechanical reports.
            </p>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-2 text-center text-[10px] text-slate-500">
          © {currentYear} The Hitting Skool. Built as a free starter
          tool.
        </footer>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs text-slate-300 space-y-1">
      <span>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        placeholder="e.g. 0.42"
      />
    </label>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] text-slate-500 mt-1">
      {children}
    </p>
  );
}
