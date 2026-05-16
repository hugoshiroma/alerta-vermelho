"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Phone, User, Shield } from "lucide-react";
import { getContacts, saveContacts } from "@/lib/storage";
import type { EmergencyContact } from "@/lib/types";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function ConfiguracoesPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  function handleAdd() {
    if (!name.trim() || phone.replace(/\D/g, "").length < 10) return;
    const updated = [
      ...contacts,
      { id: generateId(), name: name.trim(), phone: phone.replace(/\D/g, "") },
    ];
    setContacts(updated);
    saveContacts(updated);
    setName("");
    setPhone("");
    setAdding(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleDelete(id: string) {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    saveContacts(updated);
  }

  return (
    <AppShell>
      <div className="px-4 py-4 pb-6 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-xl font-black" style={{ color: "var(--text)" }}>Ajustes</h2>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Preferências e contatos de emergência</p>
        </div>

        {/* Emergency contacts section */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1.5px solid var(--border)", background: "var(--surface)" }}
        >
          {/* Section header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}
          >
            <div className="flex items-center gap-2">
              <Shield size={15} style={{ color: "var(--primary)" }} />
              <p className="text-[12px] font-black uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                Contatos de Emergência
              </p>
            </div>
            {contacts.length < 3 && (
              <button
                onClick={() => setAdding(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
                style={{ background: "var(--primary)" }}
              >
                <Plus size={12} /> Adicionar
              </button>
            )}
          </div>

          {/* Contacts list */}
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {contacts.length === 0 && !adding && (
              <div className="px-4 py-8 text-center">
                <Phone size={32} className="mx-auto mb-2 opacity-30" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                  Nenhum contato cadastrado
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                  Adicione até 3 pessoas de confiança que receberão sua localização em caso de emergência.
                </p>
              </div>
            )}

            {contacts.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--muted)" }}
                >
                  <User size={18} style={{ color: "var(--secondary)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: "var(--text)" }}>{c.name}</p>
                  <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {formatPhone(c.phone)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} style={{ color: "#ef4444" }} />
                </button>
              </motion.div>
            ))}

            {/* Add form */}
            <AnimatePresence>
              {adding && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-4 space-y-3"
                  style={{ background: "var(--muted)" }}
                >
                  <div>
                    <label className="text-[11px] font-bold mb-1 block" style={{ color: "var(--text-muted)" }}>
                      Nome
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Mãe, Irmã, Amiga..."
                      className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                      style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold mb-1 block" style={{ color: "var(--text-muted)" }}>
                      WhatsApp (com DDD)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                      style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setAdding(false); setName(""); setPhone(""); }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: "var(--border)", color: "var(--text-muted)" }}
                    >
                      Cancelar
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAdd}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background: "var(--primary)" }}
                    >
                      Salvar
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {contacts.length >= 3 && (
              <p className="px-4 py-2 text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
                Máximo de 3 contatos atingido.
              </p>
            )}
          </div>
        </div>

        {/* Info card */}
        <div
          className="rounded-2xl p-4 flex gap-3"
          style={{ background: "var(--muted)", border: "1.5px solid var(--border)" }}
        >
          <Shield size={20} className="flex-shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
          <div>
            <p className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>Como usar em emergências</p>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Pressione e segure o botão <span className="font-bold" style={{ color: "var(--primary)" }}>+</span> da barra inferior por 2 segundos para acionar o modo de emergência. O app irá gravar o ambiente, permitir ligar para 190 e enviar sua localização para seus contatos cadastrados.
            </p>
          </div>
        </div>

        {/* App info (disguise) */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
        >
          <p className="text-[12px] font-black uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
            Sobre o app
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Meu Ciclo — Controle Menstrual
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Versão 1.0.0
          </p>
        </div>
      </div>
    </AppShell>
  );
}
