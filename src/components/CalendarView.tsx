"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import { getCycleConfig, getCycleDays } from "@/lib/storage";
import type { CycleDay } from "@/lib/types";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function computeCycleDates(lastPeriodStart: string | null, cycleLength: number, periodLength: number) {
  if (!lastPeriodStart) return { period: new Set<string>(), fertile: new Set<string>(), ovulation: new Set<string>(), next: new Set<string>() };

  const period = new Set<string>();
  const fertile = new Set<string>();
  const ovulation = new Set<string>();
  const next = new Set<string>();

  const start = new Date(lastPeriodStart + "T12:00:00");

  // Generate 3 cycles worth of data
  for (let cycle = 0; cycle < 3; cycle++) {
    const cycleStart = new Date(start);
    cycleStart.setDate(cycleStart.getDate() + cycle * cycleLength);

    // Period days
    for (let d = 0; d < periodLength; d++) {
      const day = new Date(cycleStart);
      day.setDate(day.getDate() + d);
      period.add(day.toISOString().slice(0, 10));
    }

    // Ovulation day (cycle - 14 days)
    const ovDay = new Date(cycleStart);
    ovDay.setDate(ovDay.getDate() + cycleLength - 14);
    ovulation.add(ovDay.toISOString().slice(0, 10));

    // Fertile window (-5 to +1 from ovulation)
    for (let d = -5; d <= 1; d++) {
      const fDay = new Date(ovDay);
      fDay.setDate(fDay.getDate() + d);
      if (!period.has(fDay.toISOString().slice(0, 10))) {
        fertile.add(fDay.toISOString().slice(0, 10));
      }
    }

    // Next period prediction (cycle 1+ only)
    if (cycle >= 1) {
      for (let d = 0; d < periodLength; d++) {
        const day = new Date(cycleStart);
        day.setDate(day.getDate() + d);
        next.add(day.toISOString().slice(0, 10));
      }
    }
  }

  return { period, fertile, ovulation, next };
}

interface DayInfo {
  type: "period" | "fertile" | "ovulation" | "next" | "normal";
  hasLog?: boolean;
}

export default function CalendarView() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [cycleDates, setCycleDates] = useState<{
    period: Set<string>;
    fertile: Set<string>;
    ovulation: Set<string>;
    next: Set<string>;
  }>({ period: new Set(), fertile: new Set(), ovulation: new Set(), next: new Set() });
  const [loggedDays, setLoggedDays] = useState<Map<string, CycleDay>>(new Map());

  useEffect(() => {
    const config = getCycleConfig();
    const days = getCycleDays();
    setCycleDates(computeCycleDates(config.lastPeriodStart, config.cycleLength, config.periodLength));
    setLoggedDays(new Map(days.map((d) => [d.date, d])));
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const todayISO = today.toISOString().slice(0, 10);

  function getDayInfo(iso: string): DayInfo {
    if (cycleDates.period.has(iso)) return { type: "period", hasLog: loggedDays.has(iso) };
    if (cycleDates.ovulation.has(iso)) return { type: "ovulation", hasLog: loggedDays.has(iso) };
    if (cycleDates.fertile.has(iso)) return { type: "fertile", hasLog: loggedDays.has(iso) };
    if (cycleDates.next.has(iso)) return { type: "next", hasLog: loggedDays.has(iso) };
    return { type: "normal", hasLog: loggedDays.has(iso) };
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: Array<{ day: number | null; iso: string | null }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null, iso: null });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, iso: toISO(viewYear, viewMonth, d) });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, iso: null });

  const typeStyles: Record<string, { bg: string; text: string; ring?: string }> = {
    period: { bg: "var(--primary)", text: "white" },
    ovulation: { bg: "#9333ea", text: "white" },
    fertile: { bg: "#86efac", text: "#166534" },
    next: { bg: "var(--muted)", text: "var(--primary)", ring: "var(--primary)" },
    normal: { bg: "transparent", text: "var(--text)" },
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-5 pt-4 pb-3 flex-shrink-0"
        style={{ background: "var(--surface)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors">
            <ChevronLeft size={20} style={{ color: "var(--text-muted)" }} />
          </button>
          <div className="text-center">
            <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>
              {MONTHS[viewMonth]} {viewYear}
            </h2>
          </div>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors">
            <ChevronRight size={20} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mt-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-[11px] font-bold py-1" style={{ color: "var(--text-muted)" }}>
              {w}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 px-3 py-2 overflow-hidden">
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((cell, idx) => {
            if (!cell.day || !cell.iso) {
              return <div key={`empty-${idx}`} />;
            }
            const info = getDayInfo(cell.iso);
            const styles = typeStyles[info.type];
            const isToday = cell.iso === todayISO;

            return (
              <motion.div
                key={cell.iso}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center relative"
                  style={{
                    background: styles.bg,
                    outline: isToday ? `2px solid var(--primary)` : styles.ring ? `2px dashed ${styles.ring}` : "none",
                    outlineOffset: "2px",
                  }}
                >
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: styles.text }}
                  >
                    {cell.day}
                  </span>
                  {info.hasLog && (
                    <div
                      className="absolute bottom-0.5 w-1 h-1 rounded-full"
                      style={{ background: info.type === "normal" ? "var(--secondary)" : "rgba(255,255,255,0.8)" }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        className="px-5 py-3 flex flex-wrap gap-x-4 gap-y-1.5 flex-shrink-0"
        style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
      >
        {[
          { color: "var(--primary)", label: "Menstruação" },
          { color: "#86efac", label: "Fértil" },
          { color: "#9333ea", label: "Ovulação" },
          { color: "var(--muted)", label: "Próximo ciclo", dashed: true },
        ].map(({ color, label, dashed }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                background: color,
                outline: dashed ? `1.5px dashed var(--primary)` : "none",
                outlineOffset: "1px",
              }}
            />
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <Droplets size={12} style={{ color: "var(--secondary)" }} />
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Anotação</span>
        </div>
      </div>
    </div>
  );
}
