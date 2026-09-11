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

export const DEFAULT_HABITS: Habit[] = [];

export interface HabitStoreState {
  habits: Habit[];
  logs: HabitLogEntry[];
  userName: string;
  isModalOpen: boolean;
  isEditModalOpen: boolean;
  editingHabit: Habit | null;

  // Actions
  openCreateModal: () => void;
  openEditModal: (habit: Habit) => void;
  closeModal: () => void;
  toggleHabit: (habitId: string, date?: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'bestStreak' | 'totalCompletions'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  setUserName: (name: string) => void;
  resetToDefaults: () => void;

  // Selectors
  isHabitCompleted: (habitId: string, date?: string) => boolean;
  getProgressForDate: (date?: string) => { completed: number; total: number; percentage: number };
  getHabitsByMoment: (moment: DayMoment) => Habit[];
}

const safeLocalStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
};

export const useHabitStore = create<HabitStoreState>()(
  persist(
    (set, get) => ({
      habits: DEFAULT_HABITS,
      logs: [],
      userName: 'Usuario',
      isModalOpen: false,
      isEditModalOpen: false,
      editingHabit: null,

      // SOLUCIÓN 1: Al crear, forzamos editingHabit = null
      openCreateModal: () =>
        set({ isModalOpen: true, isEditModalOpen: false, editingHabit: null }),

      // SOLUCIÓN 2: Al editar, activamos isModalOpen = true para que la UI responda
      openEditModal: (habit) =>
        set({ isModalOpen: true, isEditModalOpen: true, editingHabit: habit }),

      closeModal: () =>
        set({ isModalOpen: false, isEditModalOpen: false, editingHabit: null }),

      toggleHabit: (habitId, targetDate) => {
        const date = targetDate || getTodayDateString();
        const { logs, habits } = get();

        const existingLogIndex = logs.findIndex(
          (log) => log.habitId === habitId && log.date === date
        );

        let updatedLogs: HabitLogEntry[];
        if (existingLogIndex >= 0) {
          updatedLogs = logs.filter((_, index) => index !== existingLogIndex);
        } else {
          const newLog: HabitLogEntry = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            habitId,
            date,
            completedAt: new Date().toISOString(),
          };
          updatedLogs = [...logs, newLog];
        }

        const updatedHabits = habits.map((habit) => {
          if (habit.id !== habitId) return habit;
          const habitLogs = updatedLogs.filter((l) => l.habitId === habitId);
          return {
            ...habit,
            totalCompletions: habitLogs.length,
          };
        });

        set({
          logs: updatedLogs,
          habits: updatedHabits,
        });
      },

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: getTodayDateString(),
          currentStreak: 0,
          bestStreak: 0,
          totalCompletions: 0,
        };

        set((state) => ({
          habits: [...state.habits, newHabit],
          isModalOpen: false,
          isEditModalOpen: false,
          editingHabit: null,
        }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
          ),
          isModalOpen: false,
          isEditModalOpen: false,
          editingHabit: null,
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
          logs: state.logs.filter((log) => log.habitId !== id),
        }));
      },

      setUserName: (userName) => set({ userName }),

      resetToDefaults: () => {
        set({
          habits: DEFAULT_HABITS,
          logs: [],
        });
      },

      isHabitCompleted: (habitId, targetDate) => {
        const date = targetDate || getTodayDateString();
        const { logs } = get();
        return logs.some((log) => log.habitId === habitId && log.date === date);
      },

      getProgressForDate: (targetDate) => {
        const date = targetDate || getTodayDateString();
        const { habits, logs } = get();
        if (habits.length === 0) {
          return { completed: 0, total: 0, percentage: 0 };
        }
        const completed = habits.filter((h) =>
          logs.some((log) => log.habitId === h.id && log.date === date)
        ).length;
        const total = habits.length;
        const percentage = Math.round((completed / total) * 100);
        return { completed, total, percentage };
      },

      getHabitsByMoment: (moment) => {
        const { habits } = get();
        return habits.filter((h) => h.moment === moment);
      },
    }),
    {
      name: 'routinery-habit-storage',
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);
