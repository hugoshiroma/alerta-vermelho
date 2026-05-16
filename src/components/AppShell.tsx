"use client";

import { ReactNode, useEffect, useState } from "react";
import BottomNav from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  // Solicita permissão do microfone na abertura do app para não bloquear
  // a gravação de emergência com um popup no momento crítico
  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((stream) => stream.getTracks().forEach((t) => t.stop()))
      .catch(() => {});
  }, []);

  return (
    // Outer: centraliza no desktop, full-screen no mobile via CSS (.app-frame override)
    <div className="min-h-screen flex items-center justify-center">
      {/* Phone Frame — no mobile vira full-screen via .app-frame no globals.css */}
      <div
        className="app-frame relative flex flex-col overflow-hidden"
        style={{
          width: "min(390px, 100vw)",
          height: "min(844px, 100dvh)",
          borderRadius: "44px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.35)",
          background: "var(--bg)",
        }}
      >
        {/* Status bar simulada — escondida no mobile via .status-bar-sim */}
        <div
          className="status-bar-sim flex-shrink-0 flex items-center justify-between px-7 pt-3 pb-1"
          style={{ background: "var(--surface)", color: "var(--text)" }}
        >
          <span className="text-[13px] font-bold">{time}</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="4" width="3" height="8" rx="0.5" fill="currentColor" fillOpacity="0.3" />
              <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5" fill="currentColor" fillOpacity="0.5" />
              <rect x="9" y="1" width="3" height="11" rx="0.5" fill="currentColor" fillOpacity="0.7" />
              <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 2.5C9.8 2.5 11.4 3.2 12.6 4.4L14 3C12.4 1.4 10.3 0.5 8 0.5C5.7 0.5 3.6 1.4 2 3L3.4 4.4C4.6 3.2 6.2 2.5 8 2.5Z" fill="currentColor" fillOpacity="0.4" />
              <path d="M8 5.5C9.1 5.5 10.1 5.9 10.8 6.7L12.2 5.3C11.1 4.2 9.6 3.5 8 3.5C6.4 3.5 4.9 4.2 3.8 5.3L5.2 6.7C5.9 5.9 6.9 5.5 8 5.5Z" fill="currentColor" fillOpacity="0.7" />
              <circle cx="8" cy="9.5" r="1.5" fill="currentColor" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.4" />
              <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" />
              <path d="M23 4v4a2 2 0 000-4z" fill="currentColor" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Conteúdo — .app-content recebe padding-top da safe area no mobile */}
        <div
          className="app-content flex-1 overflow-y-auto overflow-x-hidden"
          style={{ background: "var(--bg)" }}
        >
          {children}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
