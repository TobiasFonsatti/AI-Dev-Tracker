import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Dev Tracker — Monitoramento do Uso de IA no Desenvolvimento",
  description: "Plataforma analítica para acompanhamento da experiência do desenvolvedor e adoção de IA. Laboratório de Engenharia de Software — ADS Fatec Ribeirão Preto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        <NavBar />
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="border-t border-slate-200/80 bg-white/70 py-6 text-center text-xs text-slate-500">
          <p>
            AI Dev Tracker · Laboratório de Engenharia de Software · ADS Fatec Ribeirão Preto
          </p>
        </footer>
      </body>
    </html>
  );
}
