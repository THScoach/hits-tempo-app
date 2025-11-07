export type TempoInputsTime = {
  mode: "time";
  loadStart: number;
  fireStart: number;
  contact: number;
};

export type TempoInputsFrames = {
  mode: "frames";
  fps: number;
  loadFrame: number;
  fireFrame: number;
  contactFrame: number;
};

export type TempoInputs = TempoInputsTime | TempoInputsFrames;

export type TempoResultBucket = "rushed" | "green" | "yellow" | "drifty";

export type TempoResult = {
  loadPhase: number;      // seconds
  firePhase: number;      // seconds
  tempoRatio: number;     // loadPhase / firePhase
  bucket: TempoResultBucket;
  label: string;
  cue: string;
};

export function calculateTempo(inputs: TempoInputs): TempoResult {
  let loadStart: number;
  let fireStart: number;
  let contact: number;

  if (inputs.mode === "frames") {
    const { fps, loadFrame, fireFrame, contactFrame } = inputs;
    if (!fps || fps <= 0) {
      throw new Error("FPS must be greater than 0.");
    }
    loadStart = loadFrame / fps;
    fireStart = fireFrame / fps;
    contact = contactFrame / fps;
  } else {
    loadStart = inputs.loadStart;
    fireStart = inputs.fireStart;
    contact = inputs.contact;
  }

  if (
    !isFinite(loadStart) ||
    !isFinite(fireStart) ||
    !isFinite(contact)
  ) {
    throw new Error("All values must be valid numbers.");
  }

  if (!(loadStart < fireStart && fireStart < contact)) {
    throw new Error(
      "Timestamps must be in order: Load < Fire < Contact."
    );
  }

  const loadPhase = fireStart - loadStart;
  const firePhase = contact - fireStart;

  if (firePhase <= 0) {
    throw new Error(
      "Fire to Contact duration must be greater than 0."
    );
  }

  const tempoRatio = Number((loadPhase / firePhase).toFixed(2));

  let bucket: TempoResultBucket;
  if (tempoRatio < 1.8) bucket = "rushed";
  else if (tempoRatio <= 2.6) bucket = "green";
  else if (tempoRatio <= 3.2) bucket = "yellow";
  else bucket = "drifty";

  let label: string;
  let cue: string;

  switch (bucket) {
    case "rushed":
      label = "Red – Rushed. You're firing before you're anchored.";
      cue =
        "Slow down your gather. Let the load breathe before you fire.";
      break;
    case "green":
      label = "Green – Efficient, game-ready tempo.";
      cue =
        "Stay here. This is a strong attack window. Keep your move simple.";
      break;
    case "yellow":
      label =
        "Yellow – Slightly slow commit. Good for some patterns, but monitor drift.";
      cue =
        "Tighten up your move. Start your load earlier so you don't float.";
      break;
    case "drifty":
      label =
        "Red – Drifty / slow. You're stretching the commit window too long.";
      cue =
        "Control your forward move. Anchor before launch instead of drifting.";
      break;
  }

  return {
    loadPhase,
    firePhase,
    tempoRatio,
    bucket,
    label,
    cue,
  };
}
