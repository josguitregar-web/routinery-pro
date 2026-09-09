'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, BarChart2 } from 'lucide-react';
import { useHabitStore } from '@/store/useHabitStore';
import { tapScale, snappySpring } from '@/lib/animations';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const openCreateModal = useHabitStore((s) => s.openCreateModal);

  const navItems = [
    { label: '01 // RUTINAS', href: '/', icon: CheckCircle2 },
    { label: '02 // MÉTRICAS', href: '/stats', icon: BarChart2 },
  ];

  return (
    <nav className="w-full max-w-xl flex items-center justify-between border-b border-[#1A1A1A] pb-3 mb-2">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-[#0A0A0A] border border-[#1F1F1F] p-1 rounded-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={tapScale}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer ${
                  isActive ? 'text-white font-semibold' : 'text-[#777777] hover:text-[#AAAAAA]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg -z-0"
                    transition={snappySpring}
                  />
                )}
                <item.icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Quick Add Habit Button */}
      <motion.button
        type="button"
        whileTap={tapScale}
        whileHover={{ scale: 1.02 }}
        onClick={openCreateModal}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF0000] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#CC0000] shadow-[0_0_12px_rgba(255,0,0,0.25)] transition-colors"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>NUEVA RUTINA</span>
      </motion.button>
    </nav>
  );
};
