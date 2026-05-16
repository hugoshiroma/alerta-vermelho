"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Mic, MicOff, X, AlertTriangle, CheckCircle, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { getContacts } from "@/lib/storage";
import { getCurrentLocation, buildEmergencyMessage, openWhatsApp } from "@/lib/geolocation";
import { AudioRecorder } from "@/lib/audio";
import type { EmergencyContact } from "@/lib/types";

type ActionStatus = "idle" | "loading" | "done" | "error";

export default function EmergenciaPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [locationStatus, setLocationStatus] = useState<ActionStatus>("idle");
  const [locationMsg, setLocationMsg] = useState("");
  const recorderRef = useRef<AudioRecorder | null>(null);
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [exitConfirm, setExitConfirm] = useState(false);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  // Auto start recording when page mounts
  useEffect(() => {
    startRecording();
    return () => {
      if (recorderRef.current?.isRecording) recorderRef.current.stop();
      if (recTimerRef.current) clearInterval(recTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startRecording() {
    try {
      const rec = new AudioRecorder();
      await rec.start();
      recorderRef.current = rec;
      setIsRecording(true);
      recTimerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    } catch {
      // Permission denied or not supported — fail silently, still show panel
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    setIsRecording(false);
  }

  async function handleShareLocation() {
    setLocationStatus("loading");
    setLocationMsg("");
    try {
      const loc = await getCurrentLocation();
      const msg = buildEmergencyMessage(loc);

      if (contacts.length === 0) {
        setLocationMsg(`📍 ${loc.address}`);
        setLocationStatus("done");
        // Open maps for police reference
        window.open(loc.mapsUrl, "_blank");
        return;
      }

      contacts.forEach((c) => openWhatsApp(c.phone, msg));
      setLocationMsg(`Localização enviada para ${contacts.length} contato(s) via WhatsApp`);
      setLocationStatus("done");
    } catch {
      setLocationStatus("error");
      setLocationMsg("Não foi possível obter a localização. Verifique as permissões.");
    }
  }

  function handleCall190() {
    const a = document.createElement("a");
    a.href = "tel:190";
    a.click();
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  function handleExit() {
    if (exitConfirm) {
      stopRecording();
      router.push("/");
    } else {
      setExitConfirm(true);
      setTimeout(() => setExitConfirm(false), 3000);
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{
        background: "linear-gradient(160deg, #8b0000 0%, #c41e3a 50%, #e63556 100%)",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Exit button (subtle, top left) */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start px-4 pt-14 z-10">
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <X size={14} className="text-white/70" />
          <span className="text-[11px] font-semibold text-white/70">
            {exitConfirm ? "Toque novamente para sair" : "Sair"}
          </span>
        </button>

        {/* Recording indicator */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 rounded-full bg-white"
              />
              <span className="text-[11px] font-bold text-white">
                REC {formatTime(recSeconds)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Alert icon */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mb-6"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.5)" }}
          >
            <AlertTriangle size={48} className="text-white" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-black text-white mb-1 tracking-tight">
          ALERTA VERMELHO
        </h1>
        <p className="text-white/70 text-sm mb-8 text-center">
          Modo emergência ativo. Acione as ações abaixo.
        </p>

        {/* SOS — Call 190 */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleCall190}
          className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl mb-3"
          style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--primary)" }}
          >
            <Phone size={22} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-black text-base" style={{ color: "#8b0000" }}>Ligar para 190</p>
            <p className="text-xs font-medium" style={{ color: "#c41e3a" }}>Polícia Militar · Emergência</p>
          </div>
          <div className="ml-auto text-2xl font-black" style={{ color: "var(--primary)" }}>190</div>
        </motion.button>

        {/* Share location */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleShareLocation}
          disabled={locationStatus === "loading"}
          className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl mb-3"
          style={{
            background: locationStatus === "done" ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.3)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {locationStatus === "loading" ? (
              <Loader size={22} className="text-white animate-spin" />
            ) : locationStatus === "done" ? (
              <CheckCircle size={22} className="text-green-300" />
            ) : (
              <MapPin size={22} className="text-white" />
            )}
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-black text-base text-white leading-tight">
              {locationStatus === "done" ? "Localização enviada ✓" : "Enviar localização"}
            </p>
            <p className="text-xs font-medium text-white/70 truncate">
              {locationMsg || (contacts.length > 0
                ? `${contacts.length} contato(s) de emergência via WhatsApp`
                : "Nenhum contato cadastrado — abre o mapa")}
            </p>
          </div>
        </motion.button>

        {/* Voice recording */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={isRecording ? stopRecording : startRecording}
          className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl mb-6"
          style={{
            background: isRecording ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)",
            border: isRecording ? "1.5px solid rgba(255,255,255,0.6)" : "1.5px solid rgba(255,255,255,0.3)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: isRecording ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)" }}
          >
            {isRecording ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                <Mic size={22} className="text-white" />
              </motion.div>
            ) : (
              <MicOff size={22} className="text-white/60" />
            )}
          </div>
          <div className="text-left">
            <p className="font-black text-base text-white">
              {isRecording ? "Gravando... (toque para parar e salvar)" : "Iniciar gravação de voz"}
            </p>
            <p className="text-xs font-medium text-white/70">
              {isRecording ? formatTime(recSeconds) : "Áudio salvo automaticamente no dispositivo"}
            </p>
          </div>
        </motion.button>

        {/* No contacts warning */}
        {contacts.length === 0 && (
          <div
            className="w-full px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <AlertTriangle size={16} className="text-yellow-300 flex-shrink-0" />
            <p className="text-[11px] text-white/70">
              Nenhum contato cadastrado. Vá em{" "}
              <button onClick={() => router.push("/configuracoes")} className="font-bold text-white underline">
                Ajustes
              </button>{" "}
              para adicionar contatos de emergência.
            </p>
          </div>
        )}
      </div>

      {/* Home indicator com safe area */}
      <div
        className="flex justify-center"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
      >
        <div className="w-32 h-1 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
