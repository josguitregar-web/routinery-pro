'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Droplets,
  Brain,
  CheckSquare,
  Footprints,
  BookOpen,
  Moon,
  PenTool,
  Flame,
  Heart,
  Zap,
  Coffee,
  Sun,
  Sunset,
  Trash2,
  Check,
} from 'lucide-react';
import { useHabitStore } from '@/store/useHabitStore';
import { DayMoment } from '@/types/habit';
import { modalVariants, backdropVariants, tapScale } from '@/lib/animations';

interface FormValues {
  name: string;
  description?: string;
  moment: DayMoment;
  icon: string;
  targetTime: string;
  targetCount: number;
  unit: string;
}

const AVAILABLE_ICONS = [
  { name: 'Droplets', icon: Droplets, label: 'Agua' },
  { name: 'Brain', icon: Brain, label: 'Mente' },
  { name: 'CheckSquare', icon: CheckSquare, label: 'Tareas' },
  { name: 'Footprints', icon: Footprints, label: 'Pasos' },
  { name: 'BookOpen', icon: BookOpen, label: 'Lectura' },
  { name: 'Moon', icon: Moon, label: 'Descanso' },
  { name: 'PenTool', icon: PenTool, label: 'Notas' },
  { name: 'Flame', icon: Flame, label: 'Fuego' },
  { name: 'Heart', icon: Heart, label: 'Salud' },
  { name: 'Zap', icon: Zap, label: 'Energía' },
  { name: 'Coffee', icon: Coffee, label: 'Café' },
];

export const CreateEditHabitModal: React.FC = () => {
  const isModalOpen = useHabitStore((s) => s.isModalOpen);
  const editingHabit = useHabitStore((s) => s.editingHabit);
  const closeModal = useHabitStore((s) => s.closeModal);
  const addHabit = useHabitStore((s) => s.addHabit);
  const updateHabit = useHabitStore((s) => s.updateHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      moment: 'morning',
      icon: 'Droplets',
      targetTime: '08:00',
      targetCount: 1,
      unit: 'vez',
    },
  });

  // Reacciona tanto a cambios en editingHabit como al abrir isModalOpen
  useEffect(() => {
    if (isModalOpen) {
      if (editingHabit) {
        reset({
          name: editingHabit.name || '',
          description: editingHabit.description || '',
          moment: editingHabit.moment || 'morning',
          icon: editingHabit.icon || 'Droplets',
          targetTime: editingHabit.targetTime || '08:00',
          targetCount: editingHabit.targetCount || 1,
          unit: editingHabit.unit || 'vez',
        });
      } else {
        reset({
          name: '',
          description: '',
          moment: 'morning',
          icon: 'Droplets',
          targetTime: '08:00',
          targetCount: 1,
          unit: 'vez',
        });
      }
    }
  }, [editingHabit, isModalOpen, reset]);

  const onSubmit = (data: FormValues) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, {
        name: data.name.trim(),
        description: data.description?.trim(),
        moment: data.moment,
        icon: data.icon,
        targetTime: data.targetTime,
        targetCount: Number(data.targetCount) || 1,
        unit: data.unit.trim() || 'vez',
      });
    } else {
      addHabit({
        name: data.name.trim(),
        description: data.description?.trim(),
        moment: data.moment,
        icon: data.icon,
        color: '#FF0000',
        frequency: { type: 'daily' },
        targetTime: data.targetTime,
        targetCount: Number(data.targetCount) || 1,
        unit: data.unit.trim() || 'vez',
        reminderEnabled: false,
        order: Date.now(),
      });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (editingHabit) {
      deleteHabit(editingHabit.id);
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 shadow-2xl z-10 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="glyph-led-red" />
                <h3 className="font-ndot text-lg font-bold tracking-wider uppercase text-white">
                  {editingHabit ? 'EDITAR RUTINA' : 'NUEVA RUTINA'}
                </h3>
              </div>
              <motion.button
                type="button"
                whileTap={tapScale}
                onClick={closeModal}
                className="p-1 rounded-lg text-[#666666] hover:text-white hover:bg-[#141414] transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#888888] uppercase tracking-wider">
                  Nombre de la Rutina *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Meditación matutina"
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                  })}
                  className="bg-[#111111] border border-[#1F1F1F] focus:border-[#FF0000] rounded-xl px-3.5 py-2.5 text-sm text-white font-sans outline-none transition-colors"
                />
                {errors.name && (
                  <span className="font-mono text-[11px] text-[#FF0000]">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#888888] uppercase tracking-wider">
                  Descripción (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. 10 minutos de respiración y calma"
                  {...register('description')}
                  className="bg-[#111111] border border-[#1F1F1F] focus:border-[#FF0000] rounded-xl px-3.5 py-2.5 text-sm text-white font-sans outline-none transition-colors"
                />
              </div>

              {/* Moment Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#888888] uppercase tracking-wider">
                  Horario de Ejecución
                </label>
                <Controller
                  name="moment"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'morning', label: 'Mañana', icon: Sun },
                        { id: 'afternoon', label: 'Tarde', icon: Sunset },
                        { id: 'night', label: 'Noche', icon: Moon },
                      ].map(({ id, label, icon: Icon }) => {
                        const isSelected = field.value === id;
                        return (
                          <motion.button
                            type="button"
                            key={id}
                            whileTap={tapScale}
                            onClick={() => field.onChange(id)}
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-mono uppercase tracking-wider transition-colors ${
                              isSelected
                                ? 'bg-[#FF0000]/15 border-[#FF0000] text-[#FF0000]'
                                : 'bg-[#111111] border-[#1F1F1F] text-[#888888] hover:text-white'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              {/* Icon Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#888888] uppercase tracking-wider">
                  Icono Representativo
                </label>
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_ICONS.map(({ name, icon: Icon, label }) => {
                        const isSelected = field.value === name;
                        return (
                          <motion.button
                            type="button"
                            key={name}
                            whileTap={tapScale}
                            title={label}
                            onClick={() => field.onChange(name)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-[#FF0000] border-[#FF0000] text-white shadow-[0_0_8px_#FF0000]'
                                : 'bg-[#111111] border-[#1F1F1F] text-[#888888] hover:text-white hover:border-[#333333]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              {/* Target Time & Target Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-[#888888] uppercase tracking-wider">
                    Hora Objetivo
                  </label>
                  <input
                    type="time"
                    {...register('targetTime')}
                    className="bg-[#111111] border border-[#1F1F1F] focus:border-[#FF0000] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-[#888888] uppercase tracking-wider">
                    Meta y Unidad
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      {...register('targetCount', { min: 1 })}
                      className="w-16 bg-[#111111] border border-[#1F1F1F] focus:border-[#FF0000] rounded-xl px-2.5 py-2.5 text-sm text-white font-mono outline-none transition-colors text-center"
                    />
                    <input
                      type="text"
                      placeholder="min / ml"
                      {...register('unit')}
                      className="flex-1 bg-[#111111] border border-[#1F1F1F] focus:border-[#FF0000] rounded-xl px-3 py-2.5 text-sm text-white font-sans outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-[#1A1A1A] pt-4 mt-2">
                {editingHabit ? (
                  <motion.button
                    type="button"
                    whileTap={tapScale}
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 text-xs font-mono text-[#888888] hover:text-[#FF0000] p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ELIMINAR</span>
                  </motion.button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    whileTap={tapScale}
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl border border-[#222222] text-xs font-mono uppercase tracking-wider text-[#888888] hover:text-white transition-colors"
                  >
                    CANCELAR
                  </motion.button>

                  <motion.button
                    type="submit"
                    whileTap={tapScale}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#FF0000] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#CC0000] shadow-[0_0_12px_rgba(255,0,0,0.3)] transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingHabit ? 'GUARDAR' : 'CREAR'}</span>
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
