'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Brain,
  CheckSquare,
  Footprints,
  BookOpen,
  Moon,
  PenTool,
  Flame,
  Clock,
  Check,
  Sparkles,
  Heart,
  Zap,
  Coffee,
  Pencil,
  AlertTriangle,
} from 'lucide-react';
import { Habit } from '@/types/habit';
import { useHabitStore, calculateHabitCredit, getTodayDateString } from '@/store/useHabitStore';
import { snappySpring, tapScale } from '@/lib/animations';

interface HabitRowProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Droplets,
  Brain,
  CheckSquare,
  Footprints,
  BookOpen,
  Moon,
  PenTool,
  Clock,
  Flame,
  Heart,
  Zap,
  Coffee,
};

export const HabitRow: React.FC<HabitRowProps> = ({ habit, isCompleted, onToggle }) => {
  const IconComponent = ICON_MAP[habit.icon] || Sparkles;
  const openEditModal = useHabitStore((s) => s.openEditModal);
  const logs = useHabitStore((s) => s.logs);

  const todayStr = getTodayDateString();
  const currentLog = logs.find((l) => l.habitId === habit.id && l.date === todayStr);
  const { isLate } = calculateHabitCredit(habit, currentLog);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={snappySpring}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`group relative flex items-center justify-between p-4 rounded-xl border transition-colors duration-150 cursor-pointer select-none ${
        isCompleted
          ? isLate
            ? 'bg-[#0A0A0A] border-amber-500/35 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
            : 'bg-[#0A0A0A] border-[#FF0000]/35 shadow-[0_0_15px_rgba(255,0,0,0.08)]'
          : 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#2C2C2C] hover:bg-[#0D0D0D]'
      }`}
    >
      {/* Línea lateral de acento */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-r transition-colors duration-150 ${
          isCompleted
            ? isLate
              ? 'bg-amber-500'
              : 'bg-[#FF0000]'
            : 'bg-transparent group-hover:bg-[#2A2A2A]'
        }`}
      />

      <div className="flex items-center gap-3.5 pl-1.5 min-w-0 flex-1">
        {/* Checkbox circular */}
        <motion.button
          type="button"
          whileTap={tapScale}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-150 flex-shrink-0 ${
            isCompleted
              ? isLate
                ? 'bg-amber-500 text-black shadow-[0_0_10px_#f59e0b]'
                : 'bg-[#FF0000] text-white shadow-[0_0_10px_#FF0000]'
              : 'border border-[#333333] group-hover:border-[#555555] bg-transparent'
          }`}
          aria-label={isCompleted ? `Desmarcar ${habit.name}` : `Marcar ${habit.name}`}
        >
          {isCompleted && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={snappySpring}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </motion.div>
          )}
        </motion.button>

        {/* Contenedor del Ícono */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            isCompleted
              ? isLate
                ? 'bg-amber-500/15 text-amber-500'
                : 'bg-[#FF0000]/15 text-[#FF0000]'
              : 'bg-[#141414] text-[#888888] group-hover:text-white'
          }`}
        >
          <IconComponent className="w-4 h-4" />
        </div>

        {/* Nombre y descripción */}
        <div className="flex flex-col min-w-0 pr-2">
          <span
            className={`text-sm font-medium tracking-tight truncate transition-colors ${
              isCompleted ? 'line-through text-[#666666]' : 'text-white'
            }`}
          >
            {habit.name}
          </span>
          {habit.description && (
            <span className="text-xs text-[#777777] truncate font-sans">
              {habit.description}
            </span>
          )}
        </div>
      </div>

      {/* Detalles a la derecha: Tarde, Hora Objetivo y Lápiz de Edición */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isCompleted && isLate && (
          <span className="flex items-center gap-1 font-mono text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" />
            TARDE (+50%)
          </span>
        )}

        {habit.targetTime && (
          <span className="font-mono text-[11px] text-[#666666] border border-[#1A1A1A] px-2 py-0.5 rounded">
            {habit.targetTime}
          </span>
        )}

        <motion.button
          type="button"
          whileTap={tapScale}
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(habit);
          }}
          title="Editar rutina"
          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1.5 rounded-lg text-[#666666] hover:text-white hover:bg-[#1A1A1A] transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
};
