/**
 * Mutable singleton for diagnostic metrics.
 * Written by components, read by DiagnosticPanel.
 * Does NOT use React state — zero re-renders caused by this module.
 */

export interface DiagError {
  time: number;
  msg: string;
}

interface DiagState {
  clockLastUpdate: number;
  weatherLastUpdate: number;
  renderCount: number;
  errorCount: number;
  errors: DiagError[];
  pageLoadTime: number;
  prevReloadTime: number; // when the page was loaded in the previous session
}

const state: DiagState = {
  clockLastUpdate: 0,
  weatherLastUpdate: 0,
  renderCount: 0,
  errorCount: 0,
  errors: [],
  pageLoadTime: Date.now(),
  prevReloadTime: 0,
};

// Read previous reload time, then record this load — runs only in browser
if (typeof window !== 'undefined') {
  try {
    const prev = localStorage.getItem('alhuda_last_reload');
    if (prev) state.prevReloadTime = parseInt(prev, 10);
    localStorage.setItem('alhuda_last_reload', String(state.pageLoadTime));
  } catch {}
}

export function recordClockUpdate() {
  state.clockLastUpdate = Date.now();
}

export function recordWeatherUpdate() {
  state.weatherLastUpdate = Date.now();
}

export function recordRender() {
  state.renderCount++;
}

export function recordError(msg: string) {
  state.errorCount++;
  const entry: DiagError = { time: Date.now(), msg: String(msg).slice(0, 250) };
  // Keep last 10 errors
  state.errors = state.errors.slice(-9).concat(entry);
  console.error('[Diag]', msg);
}

export function getState(): Readonly<DiagState> {
  return state;
}
