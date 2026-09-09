import React from 'react';
import { Flame, CheckCircle2, Calendar, BarChart3, Clock, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center relative overflow-hidden nothing-dot-grid">
      {/* Red ambient glyph glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF0000]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl flex flex-col gap-8 relative z-10">
        {/* Header with Nothing OS typography */}
        <header className="flex items-center justify-between border-b border-[#1F1F1F] pb-6">
          <div className="flex items-center gap-3">
            <span className="glyph-led-red animate-pulse" />
            <h1 className="font-ndot text-2xl font-bold tracking-widest uppercase text-white">
              ROUTINERY <span className="text-[#FF0000]">PRO</span>
            </h1>
          </div>
          <span className="font-mono text-xs text-[#888888] border border-[#1F1F1F] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Nothing OS v1.0
          </span>
        </header>

        {/* Hero Card */}
        <section className="nothing-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#888888] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#FF0000]" />
              <span>Routinery Status</span>
            </div>
            <span className="text-[10px] font-mono bg-[#FF0000]/10 text-[#FF0000] border border-[#FF0000]/30 px-2 py-0.5 rounded-full">
              ACTIVE
            </span>
          </div>

          <p className="text-xl font-medium tracking-tight text-white/90">
            Seguimiento de hábitos y rutinas con estética minimalista monocromática y acento carmesí.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-xl p-3 flex flex-col">
              <span className="text-[10px] font-mono text-[#888888] uppercase">Fondo</span>
              <span className="text-xs font-mono text-white mt-1">#000000</span>
            </div>
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-xl p-3 flex flex-col">
              <span className="text-[10px] font-mono text-[#888888] uppercase">Tarjetas</span>
              <span className="text-xs font-mono text-white mt-1">#0A0A0A</span>
            </div>
            <div className="bg-[#141414] border border-[#FF0000]/30 rounded-xl p-3 flex flex-col">
              <span className="text-[10px] font-mono text-[#FF0000] uppercase">Acento</span>
              <span className="text-xs font-mono text-[#FF0000] mt-1 font-bold">#FF0000</span>
            </div>
          </div>
        </section>

        {/* Modules status overview */}
        <section className="grid grid-cols-2 gap-4">
          <div className="nothing-card p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#888888]">
              <Sparkles className="w-4 h-4 text-[#FF0000]" />
              <span className="text-xs font-mono uppercase">Estructura</span>
            </div>
            <span className="text-sm font-semibold text-white">src/</span>
            <span className="text-xs text-[#888888]">
              /components, /store, /types, /hooks
            </span>
          </div>

          <div className="nothing-card p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#888888]">
              <Flame className="w-4 h-4 text-[#FF0000]" />
              <span className="text-xs font-mono uppercase">Tipos Iniciales</span>
            </div>
            <span className="text-sm font-semibold text-white">habit.ts</span>
            <span className="text-xs text-[#888888]">
              Habit, FrequencyConfig, Logs
            </span>
          </div>
        </section>

        {/* Footer info */}
        <footer className="flex items-center justify-between text-xs font-mono text-[#555555] pt-4 border-t border-[#1F1F1F]">
          <span>App Router · Next.js 15</span>
          <span>TailwindCSS · Zustand · Framer Motion</span>
        </footer>
      </div>
    </main>
  );
}
