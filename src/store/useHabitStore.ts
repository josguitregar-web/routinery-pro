export type DayMoment = 'morning' | 'afternoon' | 'night' | 'evening';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  moment: DayMoment;
  icon: string;
  color?: string;
  targetTime?: string;
  targetCount?: number;
  unit?: string;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  createdAt: string;
  archived?: boolean;
  order?: number;
  frequency?: {
    type: string;
  };
  reminderEnabled?: boolean;
}

export interface HabitLogEntry {
  id: string;
  habitId: string;
  date: string;
  completedAt?: string;
}
