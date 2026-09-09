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
      userName: 'Alex',
      isModalOpen: false,
      isEditModalOpen: false,
      editingHabit: null,

      openCreateModal: () => set({ isModalOpen: true }),
      openEditModal: (habit) => set({ isEditModalOpen: true, editingHabit: habit }),
      closeModal: () => set({ isModalOpen: false, isEditModalOpen: false, editingHabit: null }),

      toggleHabit: (habitId, date = getTodayDateString()) => {
        const { logs } = get();
        const existingLogIndex = logs.findIndex(
          (log) => log.habitId === habitId && log.completedAt === date
        );

        if (existingLogIndex >= 0) {
          const newLogs = logs.filter((_, index) => index !== existingLogIndex);
          set({ logs: newLogs });
        } else {
          const newLog: HabitLogEntry = {
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            habitId,
            completedAt: date,
          };
          set({ logs: [...logs, newLog] });
        }
      },

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: getTodayDateString(),
          currentStreak: 0,
          bestStreak: 0,
          totalCompletions: 0,
        };

        set((state) => ({
          habits: [...state.habits, newHabit],
          isModalOpen: false,
        }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
          ),
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
          logs: [],
        });
      },

      isHabitCompleted: (habitId, date = getTodayDateString()) => {
        const { logs } = get();
        return logs.some((log) => log.habitId === habitId && log.completedAt === date);
      },

      getProgressForDate: (date = getTodayDateString()) => {
        const { habits, isHabitCompleted } = get();
        if (habits.length === 0) {
          return { completed: 0, total: 0, percentage: 0 };
        }
        const completed = habits.filter((h) => isHabitCompleted(h.id, date)).length;
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
      ame: 'routinery-habit-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
