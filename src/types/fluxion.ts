export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  deadline?: string;
  createdAt: string;
}

export type TaskCategory = 'dsa' | 'coding' | 'project' | 'academic' | 'personal';

export interface FocusSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  category: TaskCategory;
  date: string;
}

export interface DailyStats {
  date: string;
  tasksCompleted: number;
  focusMinutes: number;
  categories: Record<TaskCategory, number>;
}

export interface UserSettings {
  dailyFocusGoal: number; // in minutes
  categories: TaskCategory[];
  theme: 'light' | 'dark';
}

export const CATEGORY_COLORS: Record<TaskCategory, { bg: string; text: string; label: string }> = {
  dsa: { bg: 'bg-soft-blue', text: 'text-soft-blue-foreground', label: 'DSA' },
  coding: { bg: 'bg-lavender', text: 'text-lavender-foreground', label: 'Coding' },
  project: { bg: 'bg-peach', text: 'text-peach-foreground', label: 'Project' },
  academic: { bg: 'bg-soft-yellow', text: 'text-soft-yellow-foreground', label: 'Academic' },
  personal: { bg: 'bg-soft-pink', text: 'text-soft-pink-foreground', label: 'Personal' },
};
