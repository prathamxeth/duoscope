/**
 * Performance metrics gathered during the fold/unfold viewport transition.
 */
export interface ContinuityMetric {
  transitionDurationMs: number;
  mainThreadHitchDurationMs: number;
  droppedFrameCount: number;
  targetFrameRate: number;      // e.g., 60 or 120 (ProMotion)
  actualAverageFrameRate: number;
  peakMemoryDeltaMb: number;
  layoutSubviewsPassCount: number;
  isPerceptibleHitch: boolean;  // Hitch > 16.6ms threshold
}

/**
 * Detailed timeline of a viewport transition event.
 */
export interface TransitionFrameTrace {
  timestampRelativeMs: number;
  frameDurationMs: number;
  mainThreadStallMs: number;
  state: 'FOLDED' | 'TRANSITIONING' | 'UNFOLDED';
}
