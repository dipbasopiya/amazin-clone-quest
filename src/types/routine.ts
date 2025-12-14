import { TaskCategory } from './fluxion';

export interface RoutineBlock {
  id: string;
  title: string;
  category: TaskCategory | 'break';
  day: number; // 0 = Sunday, 1 = Monday, etc.
  startHour: number; // 0-23
  startMinute: number; // 0-59
  duration: number; // in hours (0.5, 1, 1.5, 2, etc.)
}

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

export const ROUTINE_CATEGORY_COLORS: Record<TaskCategory | 'break', { bg: string; badge: string; text: string; label: string }> = {
  dsa: { bg: 'bg-soft-blue/60', badge: 'bg-soft-blue', text: 'text-soft-blue-foreground', label: 'DSA' },
  coding: { bg: 'bg-[#d4f5f5]', badge: 'bg-[#7dd3d3]', text: 'text-[#1a5555]', label: 'Coding' },
  project: { bg: 'bg-peach/60', badge: 'bg-peach', text: 'text-peach-foreground', label: 'Project' },
  academic: { bg: 'bg-[#e8f5a3]', badge: 'bg-[#c5e855]', text: 'text-[#3d4a1a]', label: 'Study' },
  personal: { bg: 'bg-soft-pink/60', badge: 'bg-soft-pink', text: 'text-soft-pink-foreground', label: 'Personal' },
  break: { bg: 'bg-[#fff5cc]', badge: 'bg-[#ffe066]', text: 'text-[#5a4a1a]', label: 'Break' },
};
