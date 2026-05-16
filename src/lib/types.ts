export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface CycleDay {
  date: string;
  type: "period" | "fertile" | "ovulation" | "pms" | "note";
  symptoms?: string[];
  note?: string;
}

export interface AppState {
  contacts: EmergencyContact[];
  cycleDays: CycleDay[];
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: string | null;
}
