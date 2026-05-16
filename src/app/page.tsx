import AppShell from "@/components/AppShell";
import CalendarView from "@/components/CalendarView";
import CycleInsight from "@/components/CycleInsight";

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* App Header */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h1 className="text-lg font-black" style={{ color: "var(--primary)" }}>
              Meu Ciclo
            </h1>
            <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
              Calendário menstrual
            </p>
          </div>
          <img src="/logo.svg" alt="Meu Ciclo" className="w-9 h-9 rounded-full" />
        </div>

        {/* Cycle insight card */}
        <CycleInsight />

        {/* Calendar */}
        <div className="flex-1 overflow-hidden">
          <CalendarView />
        </div>
      </div>
    </AppShell>
  );
}
