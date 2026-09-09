'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DotMatrixProgressProps {
  completed: number;
  total: number;
  percentage: number;
}

export const DotMatrixProgress: React.FC<DotMatrixProgressProps> = ({
  completed,
  total,
  percentage,
}) => {
  // 36 LED dots around the circle for a precision Nothing OS Glyph dial
  const TOTAL_DOTS = 36;
  const radius = 80;
  const center = 100;

  const dots = Array.from({ length: TOTAL_DOTS }, (_, i) => {
    // Start from -90 deg (12 o'clock)
    const angle = (i * (360 / TOTAL_DOTS) - 90) * (Math.PI / 180);
    const cx = center + radius * Math.cos(angle);
    const cy = center + radius * Math.sin(angle);
    const activeFraction = (i + 1) / TOTAL_DOTS;
    const isActive = percentage > 0 && activeFraction <= percentage / 100;

    return { i, cx, cy, isActive };
  });

  return (
    <div className="nothing-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background ambient red glow when progress is high */}
      {percentage > 0 && (
        <div
          className="absolute w-40 h-40 bg-[#FF0000]/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-700"
          style={{ opacity: Math.min(1, percentage / 80) }}
        />
      )}

      <div className="w-full flex items-center justify-between border-b border-[#1F1F1F] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="glyph-led-red" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#888888]">
            Progreso Diario
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase text-[#888888] tracking-wider">
          Glyph Interface
        </span>
      </div>

      {/* Circular Dot Matrix Dial */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Subtle concentric track rings */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#141414"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <circle
            cx={center}
            cy={center}
            r={radius - 12}
            fill="none"
            stroke="#141414"
            strokeWidth="1"
          />

          {/* Radial LED Matrix Dots */}
          {dots.map(({ i, cx, cy, isActive }) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={isActive ? 3.5 : 2.5}
              initial={false}
              animate={{
                fill: isActive ? '#FF0000' : '#1C1C1C',
                filter: isActive ? 'drop-shadow(0px 0px 4px #FF0000)' : 'none',
                scale: isActive ? 1.15 : 1,
              }}
              transition={{ duration: 0.25, delay: i * 0.005 }}
            />
          ))}
        </svg>

        {/* Center Content with Nothing OS Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <motion.span
            key={percentage}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="font-ndot text-4xl font-bold tracking-wider text-white"
          >
            {percentage}%
          </motion.span>
          <span className="font-mono text-[11px] text-[#888888] uppercase tracking-wider mt-1">
            {completed} de {total} completados
          </span>
        </div>
      </div>

      {/* Status Pill */}
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`font-mono text-[10px] px-3 py-1 rounded-full border tracking-widest uppercase ${
            percentage === 100
              ? 'bg-[#FF0000]/15 text-[#FF0000] border-[#FF0000]/40'
              : percentage > 0
              ? 'bg-white/5 text-white/90 border-[#1F1F1F]'
              : 'bg-transparent text-[#555555] border-[#1A1A1A]'
          }`}
        >
          {percentage === 100
            ? '● OBJETIVO CUMPLIDO'
            : percentage > 0
            ? 'EN CURSO'
            : 'SIN INICIAR'}
        </span>
      </div>
    </div>
  );
};
