import { useMemo } from 'react';
import { FocusSession, TaskCategory } from '@/types/fluxion';
import { RoutineTaskCompletion } from './useRoutineCompletion';
import { RoutineBlock } from '@/types/routine';

export interface DailyData {
  date: string;
  label: string;
  focusMinutes: number;
  tasksCompleted: number;
}

export interface CategoryData {
  category: TaskCategory;
  label: string;
  hours: number;
  color: string;
}

export function useAnalytics(
  blocks: RoutineBlock[],
  completions: RoutineTaskCompletion[],
  sessions: FocusSession[]
) {
  const last7Days = useMemo(() => {
    const days: DailyData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const focusMinutes = sessions
        .filter((s) => s.date === dateStr)
        .reduce((acc, s) => acc + s.duration / 60, 0);
      
      // Count routine completions for this date
      const tasksCompleted = completions.filter(
        (c) => c.date === dateStr && c.completed
      ).length;

      days.push({ date: dateStr, label, focusMinutes: Math.round(focusMinutes), tasksCompleted });
    }
    return days;
  }, [completions, sessions]);

  const last30Days = useMemo(() => {
    const days: DailyData[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const focusMinutes = sessions
        .filter((s) => s.date === dateStr)
        .reduce((acc, s) => acc + s.duration / 60, 0);
      
      // Count routine completions for this date
      const tasksCompleted = completions.filter(
        (c) => c.date === dateStr && c.completed
      ).length;

      days.push({ date: dateStr, label, focusMinutes: Math.round(focusMinutes), tasksCompleted });
    }
    return days;
  }, [completions, sessions]);

  const categoryDistribution = useMemo(() => {
    const colors: Record<TaskCategory, string> = {
      dsa: 'hsl(210, 60%, 70%)',
      coding: 'hsl(280, 50%, 75%)',
      project: 'hsl(15, 80%, 75%)',
      academic: 'hsl(45, 70%, 70%)',
      personal: 'hsl(340, 50%, 75%)',
    };

    const labels: Record<TaskCategory, string> = {
      dsa: 'DSA',
      coding: 'Coding',
      project: 'Project',
      academic: 'Academic',
      personal: 'Personal',
    };

    const totals: Record<TaskCategory, number> = {
      dsa: 0, coding: 0, project: 0, academic: 0, personal: 0,
    };

    // Calculate hours from focus sessions
    sessions.forEach((s) => {
      totals[s.category] += s.duration / 3600; // hours
    });

    return (Object.keys(totals) as TaskCategory[])
      .map((cat) => ({
        category: cat,
        label: labels[cat],
        hours: Math.round(totals[cat] * 10) / 10,
        color: colors[cat],
      }))
      .filter((d) => d.hours > 0);
  }, [sessions]);

  const totalStats = useMemo(() => {
    const totalFocusHours = sessions.reduce((acc, s) => acc + s.duration / 3600, 0);
    const totalTasksCompleted = completions.filter((c) => c.completed).length;
    const avgDailyFocus = last7Days.reduce((acc, d) => acc + d.focusMinutes, 0) / 7;
    const avgDailyTasks = last7Days.reduce((acc, d) => acc + d.tasksCompleted, 0) / 7;
    
    // Count productive days (days with at least one completion)
    const productiveDays = new Set<string>();
    completions.forEach((c) => {
      if (c.completed) {
        productiveDays.add(c.date);
      }
    });
    sessions.forEach((s) => {
      if (s.duration >= 300) productiveDays.add(s.date);
    });

    return {
      totalFocusHours: Math.round(totalFocusHours * 10) / 10,
      totalTasksCompleted,
      avgDailyFocus: Math.round(avgDailyFocus),
      avgDailyTasks: Math.round(avgDailyTasks * 10) / 10,
      productiveDays: productiveDays.size,
    };
  }, [completions, sessions, last7Days]);

  return {
    last7Days,
    last30Days,
    categoryDistribution,
    totalStats,
  };
}
