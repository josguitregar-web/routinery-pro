'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Sunset,
  Moon,
  Pencil,
  Check,
  RotateCcw,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useHabitStore, getTodayDateString } from '@/store/useHabitStore';
import { DotMatrixProgress } from '@/components/DotMatrixProgress';
import { HabitRow } from '@/components/HabitRow';
import { DayMoment } from '@/types/habit';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [inputName, setInputName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const habits = useHabitStore((s) => s.habits);
  const userName = useHabitStore((s) => s.userName);
  const setUserName = useHabitStore((s) => s.setUserName);
  const toggleHabit = useHabitStore((s) => s.toggleHabit);
  const isHabitCompleted = useHabitStore((s) => s.isHabitCompleted);
  const getProgressForDate = useHabitStore((s) => s.getProgressForDate);
  const resetToDefaults = useHabitStore((s) => s.resetToDefaults);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const todayStr = useMemo(() => getTodayDateString(), []);

  // Formatted date string in Nothing OS uppercase style
  const formattedDate = useMemo(() => {
    const d = new Date();
    const weekday = d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
    const year = d.getFullYear();
    return `${weekday}, ${day} ${month} ${year}`;
  }, []);

  // Contextual greeting based on hour of day
  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'BUENOS DÍAS';
    if (hour >= 12 && hour < 20) return 'BUENAS TARDES';
    return 'BUENAS NOCHES';
  }, []);

  const progress = useMemo(() => {
    return getProgressForDate(todayStr);
  }, [getProgressForDate, todayStr, habits]);

  const morningHabits = useMemo(
    () => habits.filter((h) => !h.archived && h.moment === 'morning').sort((a, b) => a.order - b.order),
    [habits]
  );
  const afternoonHabits = useMemo(
    () => habits.filter((h) => !h.archived && h.moment === 'afternoon').sort((a, b) => a.order - b.order),
    [habits]
  );
  const nightHabits = useMemo(
    () => habits.filter((h) => !h.archived && h.moment === 'night').sort((a, b) => a.order - b.order),
    [habits]
  );

  const handleStartEdit = () => {
    setInputName(userName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (inputName.trim()) {
      setUserName(inputName.trim());
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
    }
  };

  const renderSection = (
    title: string,
    moment: DayMoment,
    icon: React.ReactNode,
    timeRange: string,
    sectionHabits: typeof habits
  ) => {
    const completedCount = sectionHabits.filter((h) => isHabitCompleted(h.id, todayStr)).length;
    const isAllDone = sectionHabits.length > 0 && completedCount === sectionHabits.length;

    return (
      <section className="flex flex-col gap-3">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[#FF0000]">{icon}</span>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
              {title}
            </span>
            <span className="font-mono text-[10px] text-[#555555] tracking-wider">
              ({timeRange})
            </span>
          </div>

          <span
            className={`font-mono text-[11px] px-2 py-0.5 rounded ${
              isAllDone
                ? 'bg-[#FF0000]/15 text-[#FF0000] border border-[#FF0000]/30'
                : 'text-[#777777]'
            }`}
          >
            {completedCount}/{sectionHabits.length}
          </span>
        </div>

        {/* Habits List */}
        <div className="flex flex-col gap-2.5">
          <AnimatePresence mode="popLayout">
            {sectionHabits.length > 0 ? (
              sectionHabits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  isCompleted={isHabitCompleted(habit.id, todayStr)}
                  onToggle={() => toggleHabit(habit.id, todayStr)}
                />
              ))
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[#1A1A1A] text-center text-xs font-mono text-[#555555]">
                SIN RUTINAS ASIGNADAS
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    );
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="glyph-led-red animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-[#888888]">
            CARGANDO ROUTINERY PRO...
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 md:py-12 flex flex-col items-center relative overflow-hidden nothing-dot-grid">
      {/* Background ambient red glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF0000]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-xl flex flex-col gap-7 relative z-10">
        {/* Top Bar: Date & Nothing OS branding */}
        <header className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="glyph-led-red animate-pulse" />
            <span className="font-ndot text-xs tracking-widest text-[#888888] uppercase">
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#FF0000] border border-[#FF0000]/30 bg-[#FF0000]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              ROUTINERY PRO
            </span>
            <button
              onClick={resetToDefaults}
              title="Restablecer rutinas de ejemplo"
              className="p-1.5 rounded-lg text-[#555555] hover:text-[#888888] hover:bg-[#141414] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Editable Greeting Section */}
        <section className="flex flex-col gap-1 px-1">
          <span className="font-mono text-xs tracking-widest text-[#777777] uppercase">
            {timeGreeting}
          </span>

          <div className="flex items-center gap-3 min-h-[44px]">
            {isEditingName ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveName}
                  maxLength={24}
                  className="bg-[#0A0A0A] border border-[#FF0000] text-white font-ndot text-2xl px-3 py-1 rounded-lg w-full outline-none focus:ring-1 focus:ring-[#FF0000]"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="p-2 rounded-lg bg-[#FF0000] text-white hover:bg-[#CC0000] transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={handleStartEdit}
                className="group flex items-center gap-2.5 cursor-pointer select-none"
              >
                <h2 className="font-ndot text-3xl font-bold tracking-tight text-white group-hover:text-[#FF0000] transition-colors">
                  {userName}
                </h2>
                <Pencil className="w-4 h-4 text-[#555555] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
          <p className="text-xs text-[#666666] font-sans">
            Haz clic sobre tu nombre para editarlo. Tus hábitos se guardan automáticamente en tu dispositivo.
          </p>
        </section>

        {/* Dot Matrix Circular Progress Widget */}
        <DotMatrixProgress
          completed={progress.completed}
          total={progress.total}
          percentage={progress.percentage}
        />

        {/* Routines by Schedule (Mañana, Tarde, Noche) */}
        <div className="flex flex-col gap-7">
          {renderSection(
            'Mañana',
            'morning',
            <Sun className="w-4 h-4" />,
            '06:00 - 12:00',
            morningHabits
          )}

          {renderSection(
            'Tarde',
            'afternoon',
            <Sunset className="w-4 h-4" />,
            '12:00 - 19:00',
            afternoonHabits
          )}

          {renderSection(
            'Noche',
            'night',
            <Moon className="w-4 h-4" />,
            '19:00 - 00:00',
            nightHabits
          )}
        </div>

        {/* Minimalist Nothing OS Footer */}
        <footer className="flex items-center justify-between border-t border-[#1A1A1A] pt-6 pb-4 text-xs font-mono text-[#555555]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />
            <span>LOCAL STORAGE ACTIVO</span>
          </div>
          <span className="tracking-wider">NOTHING OS · ESTILO RETRO-TECH</span>
        </footer>
      </div>
    </main>
  );
}
