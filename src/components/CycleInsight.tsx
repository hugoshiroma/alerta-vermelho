"use client";

import { useEffect, useState } from "react";
import { Heart, Moon, Sun, Zap } from "lucide-react";
import { getCycleConfig } from "@/lib/storage";

interface InsightData {
  label: string;
  value: string;
  sub: string;
  icon: typeof Heart;
  color: string;
  bg: string;
}

function computeInsight(lastPeriodStart: string | null, cycleLength: number, periodLength: number): InsightData {
  if (!lastPeriodStart) {
    return {
      label: "Configure seu ciclo",
      value: "--",
      sub: "Vá em Ajustes para começar",
      icon: Heart,
      color: "var(--secondary)",
      bg: "var(--muted)",
    };
  }

  const start = new Date(lastPeriodStart + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const daysSinceStart = Math.round((today.getTime() - start.getTime()) / 86400000);
  const dayInCycle = ((daysSinceStart % cycleLength) + cycleLength) % cycleLength + 1;
  const ovulationDay = cycleLength - 14;
  const nextPeriodDays = cycleLength - dayInCycle + 1;

  if (dayInCycle <= periodLength) {
    return {
      label: "Fase Menstrual",
      value: `Dia ${dayInCycle}`,
      sub: `Ainda ${periodLength - dayInCycle + 1} dia(s) de fluxo`,
      icon: Zap,
      color: "var(--primary)",
      bg: "var(--muted)",
    };
  } else if (dayInCycle >= ovulationDay - 5 && dayInCycle <= ovulationDay + 1) {
    return {
      label: "Janela Fértil",
      value: dayInCycle === ovulationDay ? "Ovulação!" : `Dia ${dayInCycle}`,
      sub: "Alta chance de gravidez",
      icon: Sun,
      color: "#16a34a",
      bg: "#f0fdf4",
    };
  } else if (dayInCycle > ovulationDay) {
    return {
      label: "Fase Lútea",
      value: `Dia ${dayInCycle}`,
      sub: `Próxima menstruação em ${nextPeriodDays} dia(s)`,
      icon: Moon,
      color: "#7c3aed",
      bg: "#f5f3ff",
    };
  } else {
    return {
      label: "Fase Folicular",
      value: `Dia ${dayInCycle}`,
      sub: "Energia crescente! ✨",
      icon: Heart,
      color: "var(--secondary)",
      bg: "var(--muted)",
    };
  }
}

export default function CycleInsight() {
  const [insight, setInsight] = useState<InsightData>({
    label: "Carregando...",
    value: "",
    sub: "",
    icon: Heart,
    color: "var(--secondary)",
    bg: "var(--muted)",
  });

  useEffect(() => {
    const { lastPeriodStart, cycleLength, periodLength } = getCycleConfig();
    setInsight(computeInsight(lastPeriodStart, cycleLength, periodLength));
  }, []);

  const Icon = insight.icon;

  return (
    <div
      className="mx-4 mt-3 mb-1 rounded-2xl p-4 flex items-center gap-4"
      style={{ background: insight.bg, border: `1.5px solid ${insight.color}22` }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${insight.color}20` }}
      >
        <Icon size={22} style={{ color: insight.color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: insight.color }}>
          {insight.label}
        </p>
        <p className="text-xl font-bold leading-tight" style={{ color: "var(--text)" }}>
          {insight.value}
        </p>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          {insight.sub}
        </p>
      </div>
    </div>
  );
}
