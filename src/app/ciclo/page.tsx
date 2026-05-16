"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Droplets, Moon, Sun, RotateCcw, ChevronRight } from "lucide-react";
import { getCycleConfig, saveCycleConfig } from "@/lib/storage";

const symptoms = [
  "Cólica", "Inchaço", "Dor de cabeça", "Cansaço", "Acne",
  "Humor instável", "Sensibilidade nos seios", "Desejo por doces",
];

export default function CicloPage() {
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [lastPeriod, setLastPeriod] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cfg = getCycleConfig();
    setCycleLength(cfg.cycleLength);
    setPeriodLength(cfg.periodLength);
    setLastPeriod(cfg.lastPeriodStart ?? "");
  }, []);

  function handleSave() {
    saveCycleConfig(cycleLength, periodLength, lastPeriod || null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const stats = [
    { icon: RotateCcw, color: "var(--primary)", bg: "var(--muted)", label: "Duração do ciclo", value: `${cycleLength} dias` },
    { icon: Droplets, color: "var(--secondary)", bg: "#fff0f5", label: "Duração do fluxo", value: `${periodLength} dias` },
    { icon: Sun, color: "#16a34a", bg: "#f0fdf4", label: "Janela fértil", value: "6 dias" },
    { icon: Moon, color: "#7c3aed", bg: "#f5f3ff", label: "Fase lútea", value: "14 dias" },
  ];

  return (
    <AppShell>
      <div className="px-4 py-4 pb-6 space-y-5">
        <div>
          <h2 className="text-xl font-black" style={{ color: "var(--text)" }}>Meu Ciclo</h2>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Personalize suas informações</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, color, bg, label, value }) => (
            <div
              key={label}
              className="rounded-2xl p-3 flex items-center gap-3"
              style={{ background: bg, border: `1.5px solid ${color}22` }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}20` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>{label}</p>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Config form */}
        <div
          className="rounded-2xl p-4 space-y-4"
          style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
        >
          <h3 className="font-bold text-sm" style={{ color: "var(--primary)" }}>Configurações do ciclo</h3>

          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: "var(--text-muted)" }}>
              Início da última menstruação
            </label>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-medium border outline-none focus:ring-2"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
              }}
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-2 block" style={{ color: "var(--text-muted)" }}>
              Duração do ciclo: <span style={{ color: "var(--primary)" }}>{cycleLength} dias</span>
            </label>
            <input
              type="range"
              min={21}
              max={40}
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px]" style={{ color: "var(--text-muted)" }}>
              <span>21 dias</span><span>40 dias</span>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold mb-2 block" style={{ color: "var(--text-muted)" }}>
              Duração do fluxo: <span style={{ color: "var(--secondary)" }}>{periodLength} dias</span>
            </label>
            <input
              type="range"
              min={2}
              max={8}
              value={periodLength}
              onChange={(e) => setPeriodLength(Number(e.target.value))}
              className="w-full secondary"
            />
            <div className="flex justify-between text-[10px]" style={{ color: "var(--text-muted)" }}>
              <span>2 dias</span><span>8 dias</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="w-full py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: saved ? "#16a34a" : "var(--primary)" }}
          >
            {saved ? "✓ Salvo!" : "Salvar configurações"}
          </motion.button>
        </div>

        {/* Symptoms section */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Sintomas comuns</h3>
            <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
          </div>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: "var(--muted)", color: "var(--primary)" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Heart rate widget (visual) */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: "var(--muted)", border: "1.5px solid var(--border)" }}
        >
          <Heart size={28} className="flex-shrink-0" style={{ color: "var(--primary)" }} />
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Bem-estar emocional</p>
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Registre seu humor diariamente em Anotar</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
