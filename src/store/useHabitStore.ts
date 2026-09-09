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

export const DEFAULT_HABITS = [];

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
      isModalOpen: false,
      editingHabit: null,

      setHydrated: (val: boolean) => set({ isHydrated: val }),

      openCreateModal: () => set({ isModalOpen: true, editingHabit: null }),
      openEditModal: (habit: Habit) => set({ isModalOpen: true, editingHabit: habit }),
      closeModal: () => set({ isModalOpen: false, editingHabit: null }),

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
    logs: [],
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
