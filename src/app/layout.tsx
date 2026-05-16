import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meu Ciclo — Controle Menstrual",
  description: "Acompanhe seu ciclo menstrual, sintomas e ovulação de forma simples e intuitiva.",
  keywords: ["ciclo menstrual", "menstruação", "ovulação", "calendário menstrual"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fff5f7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
