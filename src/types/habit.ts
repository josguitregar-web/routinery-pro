/**
 * Routinery Pro - Nothing OS Habit Tracker Types
 * Initial types for habit tracking, frequency, logs, and stats.
 */

// Moment of the day for scheduling
export type DayMoment = 'morning' | 'afternoon' | 'night' | 'anytime';

// Supported habit completion frequencies
export type FrequencyType = 'daily' | 'weekdays' | 'weekends' | 'custom' | 'weekly_target';

// Day of week representation (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface FrequencyConfig {
  type: FrequencyType;
  customDays?: DayOfWeek[]; // e.g. [1, 3, 5] for Mon, Wed, Fri
  weeklyTargetCount?: number; // e.g. 3 times per week
}

// Single habit completion log
export interface HabitLogEntry {
  id: string;
  habitId: string;
  date: string; // Format: YYYY-MM-DD
  completedAt: string; // ISO 8601 string
  value?: number; // Optional numerical value (e.g., 2000 ml water, 30 min reading)
  note?: string;
}

// Core Habit definition
export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string; // Lucide icon identifier
  color: string; // Hex color code (defaults to Nothing OS accent #FF0000, white #FFFFFF, or grey)
  moment: DayMoment;
  frequency: FrequencyConfig;
  targetCount: number; // e.g., 1 (times per day) or 2000 (ml)
  unit?: string; // e.g., "veces", "min", "ml", "páginas"
  targetTime?: string; // e.g., "07:00", "14:30", "22:00"
  reminderEnabled: boolean;
  reminderTime?: string;
  notes?: string;
  createdAt: string; // ISO 8601 string
  archived?: boolean;
  order: number;
  
  // Computed & cached statistics
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  lastCompletedDate?: string; // Format: YYYY-MM-DD
  lastCompletedAt?: string; // ISO 8601 string
}

// Daily summary progress
export interface DayProgress {
  date: string; // Format: YYYY-MM-DD
  completedHabitIds: string[];
  totalExpected: number;
  completionPercentage: number;
}

// Overall system and habit analytics
export interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  overallCompletionRate: number; // 0 - 100
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  perfectDaysCount: number;
}

// UI navigation tabs
export type ViewTab = 'today' | 'habits' | 'stats' | 'calendar' | 'settings';

// Filter options for habit lists
export type HabitFilter = 'all' | DayMoment;

// Nothing OS color theme constants
export const NOTHING_THEME = {
  background: '#000000',
  card: '#0A0A0A',
  cardBorder: '#1F1F1F',
  accent: '#FF0000',
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#555555',
} as const;
