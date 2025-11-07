export interface TempoResult {
  loadPhase: number
  firePhase: number
  tempoRatio: number
}

/**
 * Calculate tempo metrics from three timestamps
 * @param loadTime - Timestamp when load phase begins
 * @param fireTime - Timestamp when fire phase begins
 * @param contactTime - Timestamp when contact occurs
 * @returns TempoResult with load phase, fire phase, and tempo ratio
 */
export function calculateTempo(
  loadTime: number,
  fireTime: number,
  contactTime: number
): TempoResult {
  const loadPhase = fireTime - loadTime
  const firePhase = contactTime - fireTime
  const tempoRatio = loadPhase / firePhase

  return {
    loadPhase,
    firePhase,
    tempoRatio,
  }
}

/**
 * Get coaching cue based on tempo ratio
 * @param ratio - Tempo ratio (load phase / fire phase)
 * @returns Coaching cue string
 */
export function getCoachingCue(ratio: number): string {
  if (ratio >= 2.0) {
    return '✓ Excellent tempo! Maintain this rhythm.'
  } else if (ratio >= 1.5) {
    return '⚠ Good tempo. Try to extend your load phase slightly.'
  } else {
    return '✗ Tempo too fast. Focus on slowing down your load phase.'
  }
}
