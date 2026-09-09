import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Habit, HabitLogEntry, DayMoment } from '@/types/habit';

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_HABITS: Habit[] = [
  // MAÑANA
  {
    id: 'habit-morning-1',
    name: 'Vaso de agua con limón',
    description: 'Hidratar el cuerpo al despertar',
    icon: 'Droplets',
    color: '#FF0000',
    moment: 'morning',
    frequency: { type: 'daily' },
    targetCount: 1,
    unit: 'vaso',
    targetTime: '07:00',
    reminderEnabled: true,
    reminderTime: '07:00',
    createdAt: new Date().toISOString(),
    order: 1,
    currentStreak: 4,
    bestStreak: 7,
    totalCompletions: 12,
  },
  {
    id: 'habit-morning-2',
    name: 'Meditación Glyph',
    description: '10 minutos de respiración y enfoque',
    icon: 'Brain',
    color: '#FF0000',
    moment: 'morning',
    frequency: { type: 'daily' },
    targetCount: 10,
    unit: 'min',
    targetTime: '07:30',
    reminderEnabled: false,
    createdAt: new Date().toISOString(),
    order: 2,
    currentStreak: 2,
    bestStreak: 5,
    totalCompletions: 8,
  },
  {
    id: 'habit-morning-3',
    name: 'Planificar prioridades',
    description: 'Definir las 3 tareas clave del día',
    icon: 'CheckSquare',
    color: '#FFFFFF',
    moment: 'morning',
    frequency: { type: 'weekdays' },
    targetCount: 3,
    unit: 'tareas',
    targetTime: '08:30',
    reminderEnabled: true,
    reminderTime: '08:30',
    createdAt: new Date().toISOString(),
    order: 3,
    currentStreak: 5,
    bestStreak: 14,
    totalCompletions: 21,
  },

  // TARDE
  {
    id: 'habit-afternoon-1',
    name: 'Caminata o pausa activa',
    description: 'Pausa para estirar y resetear la vista',
    icon: 'Footprints',
    color: '#FF0000',
    moment: 'afternoon',
    frequency: { type: 'daily' },
    targetCount: 20,
    unit: 'min',
    targetTime: '14:30',
    reminderEnabled: true,
    reminderTime: '14:30',
    createdAt: new Date().toISOString(),
    order: 4,
    currentStreak: 3,
    bestStreak: 6,
    totalCompletions: 9,
  },
  {
    id: 'habit-afternoon-2',
    name: 'Sesión de lectura técnica',
    description: 'Lectura o aprendizaje continuo',
    icon: 'BookOpen',
    color: '#FFFFFF',
    moment: 'afternoon',
    frequency: { type: 'daily' },
    targetCount: 15,
    unit: 'páginas',
    targetTime: '17:00',
    reminderEnabled: false,
    createdAt: new Date().toISOString(),
    order: 5,
    currentStreak: 1,
    bestStreak: 4,
    totalCompletions: 5,
  },

  // NOCHE
  {
    id: 'habit-night-1',
    name: 'Modo Glyph: Desconectar pantallas',
    description: 'Dejar móvil y pantallas 45 min antes de dormir',
    icon: 'Moon',
    color: '#FF0000',
    moment: 'night',
    frequency: { type: 'daily' },
    targetCount: 1,
    unit: 'sesión',
    targetTime: '22:30',
    reminderEnabled: true,
    reminderTime: '22:30',
    createdAt: new Date().toISOString(),
    order: 6,
    currentStreak: 6,
    bestStreak: 10,
    totalCompletions: 16,
  },
  {
    id: 'habit-night-2',
    name: 'Bitácora y gratitud',
    description: 'Anotar 1 logro y 1 agradecimiento',
    icon: 'PenTool',
    color: '#FFFFFF',
    moment: 'night',
    frequency: { type: 'daily' },
    targetCount: 1,
    unit: 'nota',
    targetTime: '23:00',
    reminderEnabled: false,
    createdAt: new Date().toISOString(),
    order: 7,
    currentStreak: 0,
    bestStreak: 8,
    totalCompletions: 14,
  },
];

export interface HabitStoreState {
  habits: Habit[];
  logs: HabitLogEntry[];
  userName: string;
  isHydrated: boolean;

  // Actions
  toggleHabit: (habitId: string, date?: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'bestStreak' | 'totalCompletions'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  setUserName: (name: string) => void;
  resetToDefaults: () => void;
  setHydrated: (val: boolean) => void;

  // Selectors & Computations
  isHabitCompleted: (habitId: string, date?: string) => boolean;
  getProgressForDate: (date?: string) => { completed: number; total: number; percentage: number };
  getHabitsByMoment: (moment: DayMoment) => Habit[];
}

export const useHabitStore = create<HabitStoreState>()(
  persist(
    (set, get) => ({
      habits: DEFAULT_HABITS,
      logs: [],
      userName: 'NOTHING USER',
      isHydrated: false,

      setHydrated: (val: boolean) => set({ isHydrated: val }),

      setUserName: (name: string) => set({ userName: name.trim() || 'USUARIO' }),

      toggleHabit: (habitId: string, date?: string) => {
        const targetDate = date || getTodayDateString();
        const state = get();
        const existingLogIndex = state.logs.findIndex(
          (log) => log.habitId === habitId && log.date === targetDate
        );

        let newLogs = [...state.logs];
        const isNowCompleted = existingLogIndex === -1;

        if (isNowCompleted) {
          // Add completion entry
          const newEntry: HabitLogEntry = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            habitId,
            date: targetDate,
            completedAt: new Date().toISOString(),
          };
          newLogs.push(newEntry);
        } else {
          // Remove completion entry
          newLogs.splice(existingLogIndex, 1);
        }

        // Update habit streak and statistics
        const updatedHabits = state.habits.map((h) => {
          if (h.id !== habitId) return h;

          const newTotal = isNowCompleted
            ? h.totalCompletions + 1
            : Math.max(0, h.totalCompletions - 1);

          const newStreak = isNowCompleted
            ? h.currentStreak + 1
            : Math.max(0, h.currentStreak - 1);

          const newBestStreak = Math.max(h.bestStreak, newStreak);

          return {
            ...h,
            totalCompletions: newTotal,
            currentStreak: newStreak,
            bestStreak: newBestStreak,
            lastCompletedDate: isNowCompleted ? targetDate : h.lastCompletedDate,
            lastCompletedAt: isNowCompleted ? new Date().toISOString() : h.lastCompletedAt,
          };
        });

        set({
          logs: newLogs,
          habits: updatedHabits,
        });
      },

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          createdAt: new Date().toISOString(),
          currentStreak: 0,
          bestStreak: 0,
          totalCompletions: 0,
        };

        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          logs: state.logs.filter((l) => l.habitId !== id),
        }));
      },

      resetToDefaults: () => {
        set({
          habits: DEFAULT_HABITS,
          logs: [],
          userName: 'NOTHING USER',
        });
      },

      isHabitCompleted: (habitId: string, date?: string) => {
        const targetDate = date || getTodayDateString();
        return get().logs.some((l) => l.habitId === habitId && l.date === targetDate);
      },

      getProgressForDate: (date?: string) => {
        const targetDate = date || getTodayDateString();
        const activeHabits = get().habits.filter((h) => !h.archived);
        const total = activeHabits.length;
        if (total === 0) return { completed: 0, total: 0, percentage: 0 };

        const completed = activeHabits.filter((h) =>
          get().logs.some((l) => l.habitId === h.id && l.date === targetDate)
        ).length;

        const percentage = Math.round((completed / total) * 100);
        return { completed, total, percentage };
      },

      getHabitsByMoment: (moment: DayMoment) => {
        return get()
          .habits.filter((h) => !h.archived && h.moment === moment)
          .sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: 'routinery-pro-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
