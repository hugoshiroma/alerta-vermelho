"use client";

import AppShell from "@/components/AppShell";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { saveCycleDay } from "@/lib/storage";
import type { CycleDay } from "@/lib/types";

const SYMPTOMS = [
  "😣 Cólica", "🤢 Náusea", "😴 Cansaço", "😤 Irritada",
  "😢 Triste", "🥰 Feliz", "😰 Ansiosa", "🤯 Dor de cabeça",
  "🫠 Inchaço", "🍫 Desejo por doces", "💧 Fluxo leve",
  "💧💧 Fluxo moderado", "💧💧💧 Fluxo intenso",
];

const FLOW_TYPES: Array<{ value: CycleDay["type"]; label: string; color: string }> = [
  { value: "period", label: "Menstruação", color: "var(--primary)" },
  { value: "fertile", label: "Fértil", color: "#16a34a" },
  { value: "ovulation", label: "Ovulação", color: "#9333ea" },
  { value: "note", label: "Apenas anotação", color: "var(--secondary)" },
];

export default function AnotarPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [selected, setSelected] = useState<string[]>([]);
  const [type, setType] = useState<CycleDay["type"]>("note");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  function toggle(s: string) {
    setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function handleSave() {
    saveCycleDay({ date: today, type, symptoms: selected, note });
    setSaved(true);
    setTimeout(() => router.push("/"), 1200);
  }

  return (
    <AppShell>
      <div className="px-4 py-4 pb-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black" style={{ color: "var(--text)" }}>Anotar hoje</h2>
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <button onClick={() => router.push("/")} className="text-[12px] font-semibold" style={{ color: "var(--text-muted)" }}>
            Cancelar
          </button>
        </div>

        {/* Type selector */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
        >
          <p className="text-[12px] font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Tipo de dia</p>
          <div className="grid grid-cols-2 gap-2">
            {FLOW_TYPES.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => setType(value)}
                className="py-2.5 px-3 rounded-xl text-[12px] font-bold transition-all"
                style={{
                  background: type === value ? color : "var(--muted)",
                  color: type === value ? "white" : "var(--text)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
        >
          <p className="text-[12px] font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Sintomas</p>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map((s) => (
              <button
                key={s}
                onClick={() => toggle(s)}
                className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                style={{
                  background: selected.includes(s) ? "var(--primary)" : "var(--muted)",
                  color: selected.includes(s) ? "white" : "var(--text)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
        >
          <p className="text-[12px] font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Nota livre</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Como você está se sentindo hoje?"
            rows={3}
            className="w-full px-3 py-2 rounded-xl text-sm border outline-none resize-none"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg)",
              color: "var(--text)",
            }}
          />
        </div>

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saved}
          className="w-full py-4 rounded-2xl font-black text-white text-base"
          style={{ background: saved ? "#16a34a" : "var(--primary)", boxShadow: "0 4px 16px var(--shadow)" }}
        >
          {saved ? "✓ Anotação salva!" : "Salvar anotação"}
        </motion.button>
      </div>
    </AppShell>
  );
}
