import type { AppState, EmergencyContact, CycleDay } from "./types";

const KEY = "alerta-vermelho-data";

const DEFAULT: AppState = {
  contacts: [],
  cycleDays: [],
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: null,
};

export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function getContacts(): EmergencyContact[] {
  return loadState().contacts;
}

export function saveContacts(contacts: EmergencyContact[]): void {
  const state = loadState();
  saveState({ ...state, contacts });
}

export function getCycleDays(): CycleDay[] {
  return loadState().cycleDays;
}

export function saveCycleDay(day: CycleDay): void {
  const state = loadState();
  const existing = state.cycleDays.filter((d) => d.date !== day.date);
  saveState({ ...state, cycleDays: [...existing, day] });
}

export function getCycleConfig() {
  const { cycleLength, periodLength, lastPeriodStart } = loadState();
  return { cycleLength, periodLength, lastPeriodStart };
}

export function saveCycleConfig(
  cycleLength: number,
  periodLength: number,
  lastPeriodStart: string | null
): void {
  const state = loadState();
  saveState({ ...state, cycleLength, periodLength, lastPeriodStart });
}
