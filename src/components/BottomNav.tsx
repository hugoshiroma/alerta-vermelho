"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, TrendingUp, Settings } from "lucide-react";

const HOLD_DURATION = 2000;

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrame = useRef<number | null>(null);
  const holdStart = useRef<number>(0);

  const startHold = useCallback(() => {
    holdStart.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - holdStart.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(progress);

      if (progress < 1) {
        animFrame.current = requestAnimationFrame(tick);
      } else {
        router.push("/emergencia");
      }
    };

    animFrame.current = requestAnimationFrame(tick);
  }, [router]);

  const cancelHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
    setHoldProgress(0);
  }, []);

  const tabs = [
    { href: "/", label: "Calendário", icon: Calendar },
    { href: "/ciclo", label: "Meu Ciclo", icon: TrendingUp },
    { href: "/configuracoes", label: "Ajustes", icon: Settings },
  ];

  return (
    <div
      className="flex-shrink-0 flex items-center justify-around px-2 pt-2 pb-5"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Left tabs */}
      {tabs.slice(0, 2).map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all no-select"
          >
            <Icon
              size={22}
              style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}
            >
              {label}
            </span>
          </button>
        );
      })}

      {/* Central SOS trigger (disguised as Anotar) */}
      <div className="relative flex flex-col items-center">
        {/* Progress ring */}
        <AnimatePresence>
          {holdProgress > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ zIndex: 10 }}
            >
              <svg
                className="absolute inset-0 -rotate-90"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                style={{ top: "-8px", left: "-8px" }}
              >
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - holdProgress)}`}
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="flex flex-col items-center justify-center w-12 h-12 rounded-full no-select"
          style={{
            background: holdProgress > 0
              ? `color-mix(in srgb, var(--primary) ${holdProgress * 100}%, var(--secondary))`
              : "var(--primary)",
            boxShadow: "0 4px 16px var(--shadow)",
            transform: `scale(${1 + holdProgress * 0.1})`,
            transition: "background 0.1s",
          }}
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={(e) => {
            e.preventDefault();
            startHold();
          }}
          onTouchEnd={cancelHold}
          onTouchCancel={cancelHold}
          onClick={() => {
            if (holdProgress === 0) router.push("/anotar");
          }}
        >
          <span className="text-white text-2xl font-light leading-none select-none">
            +
          </span>
        </button>
        <span
          className="text-[10px] font-semibold mt-0.5"
          style={{ color: "var(--primary)" }}
        >
          Anotar
        </span>
      </div>

      {/* Right tabs */}
      {tabs.slice(2).map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all no-select"
          >
            <Icon
              size={22}
              style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
