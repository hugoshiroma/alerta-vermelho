# CLAUDE.md — alerta-vermelho

## Contexto do Projeto

Aplicação web que simula 100% um app mobile, desenvolvida como projeto acadêmico.
**Conceito:** App de segurança feminina disfarçado de calendário menstrual.
**Nome público (disfarce):** Meu Ciclo — Controle Menstrual
**Nome real:** Alerta Vermelho
**Deploy:** Cloudflare Pages (static export)

---

## Propósito Real vs. Disfarce

| Tela visível | Função real |
|---|---|
| Calendário menstrual | Tela principal (disfarce) |
| Meu Ciclo | Configurações do ciclo (disfarce) |
| Anotar | Log de sintomas (disfarce) |
| Ajustes | Cadastrar contatos de emergência |
| Botão `+` na nav (segurar 2s) | **Acessa o painel de emergência** |
| /emergencia | Painel SOS real |

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript 5
- **Estilo:** Tailwind CSS v4
- **Animações:** Framer Motion
- **Ícones:** Lucide React
- **Fontes:** Nunito (Google Fonts)
- **Storage:** localStorage (sem backend)
- **Deploy:** Cloudflare Pages (`output: "export"`)

---

## Estrutura

```
src/
  app/
    layout.tsx              # Root layout (Nunito + viewport)
    page.tsx                # Home — calendário menstrual
    globals.css             # CSS vars, Nunito, mobile overflow
    ciclo/page.tsx          # Meu Ciclo — config do ciclo
    anotar/page.tsx         # Anotar sintomas
    configuracoes/page.tsx  # Ajustes + contatos emergência
    emergencia/page.tsx     # PAINEL SOS — modo emergência real

  components/
    AppShell.tsx        # Frame de celular + status bar
    BottomNav.tsx       # Navegação inferior com gatilho secreto
    CalendarView.tsx    # Calendário menstrual completo
    CycleInsight.tsx    # Card de insight do ciclo atual

  lib/
    types.ts            # Tipos TypeScript
    storage.ts          # localStorage helpers
    geolocation.ts      # Geoloc + reverse geocoding + WhatsApp
    audio.ts            # MediaRecorder — gravação de voz
```

---

## Funcionalidades de Emergência

### Gatilho secreto
- Botão `+` na barra inferior — toque normal = /anotar (disfarce)
- **Segurar 2 segundos = abre /emergencia**
- Animação visual: anel vermelho cresce durante o hold

### Painel de emergência (/emergencia)
1. **Ligar 190** — `tel:190`
2. **Enviar localização** — Geolocation API + Nominatim + WhatsApp para contatos
3. **Gravação de voz** — MediaRecorder API — download automático ao parar
4. **Sair** — toque duplo (confirmação)

### Contatos de emergência
- Até 3 contatos em localStorage
- Recebem WhatsApp com endereço + link Google Maps

---

## Design System

```
--primary:    #c41e3a  (vermelho profundo)
--secondary:  #ff6b9d  (rosa)
--muted:      #fde8ef  (fundo rosa suave)
--bg:         #fff5f7
--surface:    #ffffff
Font: Nunito (Google Fonts)
```

---

## Deploy — Cloudflare Pages

**Build command:** `npm run build`
**Output directory:** `out`
**Node version:** 18+

---

## Status

- [x] Scaffold + design system
- [x] CalendarView + CycleInsight
- [x] BottomNav com gatilho secreto
- [x] AppShell mobile frame
- [x] /ciclo, /anotar, /configuracoes, /emergencia
- [x] lib/geolocation, audio, storage
- [ ] Testes em dispositivo real
- [ ] Deploy Cloudflare Pages
