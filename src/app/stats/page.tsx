'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Terminal,
  Activity,
  Flame,
  CheckCircle,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useHabitStore, getTodayDateString } from '@/store/useHabitStore';
import { Navbar } from '@/components/Navbar';
import { CreateEditHabitModal } from '@/components/CreateEditHabitModal';
import { snappySpring, statPopVariants } from '@/lib/animations';

// Custom Terminal Tooltip with Nothing OS sharp aesthetic
const TerminalTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#000000] border border-[#FF0000] p-2.5 rounded-none shadow-[0_0_10px_rgba(255,0,0,0.3)] font-mono text-xs">
        <div className="text-[#888888] uppercase border-b border-[#222222] pb-1 mb-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#FF0000]" />
          <span>SYS_LOG :: {label}</span>
        </div>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-white">
            <span className="text-[#888888] uppercase">{item.name}:</span>
            <span className="text-[#FF0000] font-bold">{item.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const habits = useHabitStore((s) => s.habits);
  const logs = useHabitStore((s) => s.logs);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute telemetry metrics
  const stats = useMemo(() => {
    const totalHabits = habits.filter((h) => !h.archived).length;
    const totalCompletions = habits.reduce((acc, h) => acc + (h.totalCompletions || 0), 0);
    const maxStreak = habits.reduce((acc, h) => Math.max(acc, h.bestStreak || 0), 0);
    const currentMaxStreak = habits.reduce((acc, h) => Math.max(acc, h.currentStreak || 0), 0);

    // Calculate completion rate based on active habits
    const globalRate = totalHabits > 0 ? Math.min(100, Math.round((totalCompletions / (totalHabits * 10 || 1)) * 100)) : 0;

    // Calculate unique completed dates for perfect days simulation
    const datesMap = new Map<string, number>();
    logs.forEach((l) => {
      datesMap.set(l.date, (datesMap.get(l.date) || 0) + 1);
    });

    let perfectDays = 0;
    datesMap.forEach((count) => {
      if (totalHabits > 0 && count >= totalHabits) {
        perfectDays++;
      }
    });

    return {
      totalHabits,
      totalCompletions,
      maxStreak,
      currentMaxStreak,
      globalRate,
      perfectDays,
    };
  }, [habits, logs]);

  // Compute last 7 days consistency data
  const last7DaysData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const weekdayName = d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
      
      const totalActive = habits.filter((h) => !h.archived).length;
      const completedOnDate = logs.filter((l) => l.date === dateStr).length;
      const pct = totalActive > 0 ? Math.min(100, Math.round((completedOnDate / totalActive) * 100)) : 0;

      data.push({
        day: `${weekdayName} ${day}`,
        rate: pct,
        completions: completedOnDate,
        isToday: i === 0,
      });
    }
    return data;
  }, [habits, logs]);

  // Performance by Moment (Morning, Afternoon, Night)
  const momentData = useMemo(() => {
    const moments: Array<{ id: 'morning' | 'afternoon' | 'night'; label: string }> = [
      { id: 'morning', label: 'MAÑANA' },
      { id: 'afternoon', label: 'TARDE' },
      { id: 'night', label: 'NOCHE' },
    ];

    return moments.map(({ id, label }) => {
      const momentHabits = habits.filter((h) => !h.archived && h.moment === id);
      const total = momentHabits.length;
      const habitIds = new Set(momentHabits.map((h) => h.id));
      const completedCount = logs.filter((l) => habitIds.has(l.habitId)).length;
      const rate = total > 0 ? Math.min(100, Math.round((completedCount / (total * 5 || 1)) * 100)) : 0;

      return {
        moment: label,
        habitsCount: total,
        completedCount,
        rate,
      };
    });
  }, [habits, logs]);

  // Recent system logs
  const recentLogs = useMemo(() => {
    return [...logs]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 5)
      .map((log) => {
        const habit = habits.find((h) => h.id === log.habitId);
        return {
          id: log.id,
          date: log.date,
          habitName: habit?.name || 'Rutina eliminada',
          time: new Date(log.completedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        };
      });
  }, [logs, habits]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-xs text-[#888888]">
          <span className="glyph-led-red animate-pulse" />
          <span>INICIALIZANDO TERMINAL RECHARTS...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 md:py-12 flex flex-col items-center relative overflow-hidden nothing-dot-grid">
      {/* Background red glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF0000]/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-xl flex flex-col gap-6 relative z-10">
        {/* Top Navbar */}
        <Navbar />

        {/* Terminal Header */}
        <header className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-[#FF0000]" />
            <h1 className="font-ndot text-xl font-bold tracking-widest uppercase text-white">
              SISTEMA // TELEMETRÍA
            </h1>
          </div>
          <span className="font-mono text-[10px] text-[#888888] border border-[#1F1F1F] px-2 py-0.5 rounded uppercase">
            STATUS: ONLINE
          </span>
        </header>

        {/* KPI Terminal Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'TOTAL EXEC', value: stats.totalCompletions, icon: CheckCircle, unit: 'LOGS' },
            { label: 'TASA ÉXITO', value: `${stats.globalRate}%`, icon: TrendingUp, unit: 'GLOBAL' },
            { label: 'RACHA MÁX', value: `${stats.maxStreak}D`, icon: Flame, unit: 'RÉCORD' },
            { label: 'DÍAS 100%', value: stats.perfectDays, icon: Sparkles, unit: 'COMPLETO' },
          ].map((kpi, index) => (
            <motion.div
              key={kpi.label}
              variants={statPopVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.05 }}
              className="bg-[#0A0A0A] border border-[#1F1F1F] p-3.5 rounded-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[#777777]">
                <span className="font-mono text-[10px] uppercase tracking-wider">{kpi.label}</span>
                <kpi.icon className="w-3.5 h-3.5 text-[#FF0000]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-ndot text-2xl font-bold text-white">{kpi.value}</span>
                <span className="font-mono text-[9px] text-[#666666] uppercase">{kpi.unit}</span>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Chart 1: Last 7 Days Consistency (Terminal Sharp Rectilinear Bar Chart) */}
        <section className="nothing-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
            <div className="flex items-center gap-2">
              <span className="glyph-led-red" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-white">
                Consistencia Semanal (Últimos 7 Días)
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#666666] uppercase">
              RECHARTS :: LINEAR
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#1A1A1A" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#555555"
                  tick={{ fill: '#777777', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#222222' }}
                  axisLine={{ stroke: '#222222' }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#555555"
                  tick={{ fill: '#777777', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#222222' }}
                  axisLine={{ stroke: '#222222' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<TerminalTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                <Bar dataKey="rate" name="CUMPLIMIENTO" radius={[0, 0, 0, 0]}>
                  {last7DaysData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.rate === 100 ? '#FF0000' : entry.rate > 0 ? '#FFFFFF' : '#1C1C1C'}
                      stroke={entry.isToday ? '#FF0000' : 'none'}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#666666] pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#FF0000]" /> 100% COMPLETADO
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#FFFFFF]" /> EN CURSO
              </span>
            </div>
            <span>EJE Y: % CUMPLIMIENTO</span>
          </div>
        </section>

        {/* Chart 2: Strict Linear Step Chart (Performance by Moment) */}
        <section className="nothing-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#FF0000]" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-white">
                Distribución por Horarios (Línea Recta Step)
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#666666] uppercase">
              ZERO GRADIENTS
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={momentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#1A1A1A" vertical={false} />
                <XAxis
                  dataKey="moment"
                  stroke="#555555"
                  tick={{ fill: '#888888', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#222222' }}
                  axisLine={{ stroke: '#222222' }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#555555"
                  tick={{ fill: '#777777', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#222222' }}
                  axisLine={{ stroke: '#222222' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<TerminalTooltip />} />
                {/* Strictly straight line with stepAfter type and no smooth bezier curves */}
                <Line
                  type="stepAfter"
                  dataKey="rate"
                  name="RENDIMIENTO"
                  stroke="#FF0000"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#000000', stroke: '#FF0000', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#FF0000', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Terminal Audit Log */}
        <section className="nothing-card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#FF0000]" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-white">
                Registro de Auditoría Terminal
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#666666]">
              {recentLogs.length} EVENTOS
            </span>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2 rounded bg-[#000000] border border-[#1A1A1A]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[#30D158] font-bold">[OK]</span>
                    <span className="text-white truncate">{log.habitName}</span>
                  </div>
                  <span className="text-[#777777] text-[10px] flex-shrink-0">
                    {log.date} @ {log.time}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-[#555555] font-mono text-[11px] border border-dashed border-[#1A1A1A] rounded">
                NO HAY REGISTROS REGISTRADOS AÚN. COMPLETA HÁBITOS EN EL DASHBOARD.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Habit Create/Edit Modal */}
      <CreateEditHabitModal />
    </main>
  );
}
