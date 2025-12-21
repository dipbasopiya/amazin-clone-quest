import { useState, useCallback, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { FocusSession, TaskCategory } from '@/types/fluxion';
import { useLocalStorage } from './useLocalStorage';

export interface ActiveTask {
  id: string;
  title: string;
  category: TaskCategory;
  durationMinutes: number;
  scheduledTime?: string;
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'warning' | 'overtime';

interface ActiveTaskContextType {
  sessions: FocusSession[];
  activeTask: ActiveTask | null;
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  timerStatus: TimerStatus;
  todayFocusMinutes: number;
  weekFocusMinutes: number;
  startTaskTimer: (task: ActiveTask) => void;
  pauseTaskTimer: () => void;
  resumeTaskTimer: () => void;
  stopTaskTimer: (markCompleted?: boolean) => ActiveTask | null;
  addTime: (minutes: number) => void;
  getTimeDisplay: () => { remaining: number; overtime: number; progress: number; totalElapsed: number };
  formatTime: (seconds: number) => string;
  formatOvertime: (seconds: number) => string;
}

const ActiveTaskContext = createContext<ActiveTaskContextType | null>(null);

export function ActiveTaskProvider({ children }: { children: ReactNode }) {
  const value = useActiveTaskTimerInternal();
  return (
    <ActiveTaskContext.Provider value={value}>
      {children}
    </ActiveTaskContext.Provider>
  );
}

export function useActiveTaskTimer() {
  const context = useContext(ActiveTaskContext);
  if (!context) {
    // Fallback for components not wrapped in provider - return internal hook
    return useActiveTaskTimerInternal();
  }
  return context;
}

function useActiveTaskTimerInternal() {
  const [sessions, setSessions] = useLocalStorage<FocusSession[]>('fluxion-focus-sessions', []);
  const [activeTask, setActiveTask] = useLocalStorage<ActiveTask | null>('fluxion-active-task', null);
  const [taskDuration, setTaskDuration] = useLocalStorage<number>('fluxion-task-duration', 0);
  const [storedElapsed, setStoredElapsed] = useLocalStorage<number>('fluxion-elapsed-seconds', 0);
  const [isPaused, setIsPaused] = useLocalStorage<boolean>('fluxion-timer-paused', false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Restore state from localStorage on mount
  useEffect(() => {
    if (activeTask) {
      const savedStartTime = localStorage.getItem('fluxion-timer-start');
      
      if (isPaused) {
        // Restore paused state
        setElapsedSeconds(storedElapsed);
        setIsRunning(false);
      } else if (savedStartTime) {
        // Restore running state
        const startTime = new Date(savedStartTime);
        const elapsed = storedElapsed + Math.floor((Date.now() - startTime.getTime()) / 1000);
        startTimeRef.current = startTime;
        setElapsedSeconds(elapsed);
        setIsRunning(true);
      }
    }
  }, []);

  // Calculate timer status
  const getTimerStatus = useCallback((): TimerStatus => {
    if (!activeTask) return 'idle';
    if (isPaused) return 'paused';
    if (!isRunning) return 'idle';
    
    const targetSeconds = taskDuration * 60;
    const warningThreshold = targetSeconds - 60; // 1 minute before end
    
    if (elapsedSeconds >= targetSeconds) return 'overtime';
    if (elapsedSeconds >= warningThreshold) return 'warning';
    return 'running';
  }, [isRunning, isPaused, activeTask, elapsedSeconds, taskDuration]);

  const timerStatus = getTimerStatus();

  // Calculate remaining or overtime seconds
  const getTimeDisplay = useCallback(() => {
    if (!activeTask) {
      return { remaining: 0, overtime: 0, progress: 0, totalElapsed: 0 };
    }
    
    const targetSeconds = taskDuration * 60;
    const remaining = Math.max(0, targetSeconds - elapsedSeconds);
    const overtime = Math.max(0, elapsedSeconds - targetSeconds);
    const progress = Math.min(100, (elapsedSeconds / targetSeconds) * 100);
    
    return { remaining, overtime, progress, totalElapsed: elapsedSeconds };
  }, [activeTask, elapsedSeconds, taskDuration]);

  const startTaskTimer = useCallback((task: ActiveTask) => {
    setActiveTask(task);
    setTaskDuration(task.durationMinutes);
    setIsRunning(true);
    setIsPaused(false);
    setStoredElapsed(0);
    startTimeRef.current = new Date();
    localStorage.setItem('fluxion-timer-start', new Date().toISOString());
    setElapsedSeconds(0);
  }, [setActiveTask, setTaskDuration, setIsPaused, setStoredElapsed]);

  const pauseTaskTimer = useCallback(() => {
    if (isRunning && activeTask) {
      setIsRunning(false);
      setIsPaused(true);
      setStoredElapsed(elapsedSeconds);
      localStorage.removeItem('fluxion-timer-start');
      startTimeRef.current = null;
    }
  }, [isRunning, activeTask, elapsedSeconds, setIsPaused, setStoredElapsed]);

  const resumeTaskTimer = useCallback(() => {
    if (isPaused && activeTask) {
      setIsPaused(false);
      setIsRunning(true);
      startTimeRef.current = new Date();
      localStorage.setItem('fluxion-timer-start', new Date().toISOString());
    }
  }, [isPaused, activeTask, setIsPaused]);

  const stopTaskTimer = useCallback((markCompleted: boolean = false) => {
    if (elapsedSeconds > 0 && activeTask) {
      const newSession: FocusSession = {
        id: crypto.randomUUID(),
        startTime: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        duration: elapsedSeconds,
        category: activeTask.category,
        date: new Date().toISOString().split('T')[0],
      };
      setSessions((prev) => [...prev, newSession]);
    }
    
    const completedTask = markCompleted && activeTask ? { ...activeTask } : null;
    
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setActiveTask(null);
    setTaskDuration(0);
    setStoredElapsed(0);
    localStorage.removeItem('fluxion-timer-start');
    startTimeRef.current = null;
    
    return completedTask;
  }, [elapsedSeconds, activeTask, setSessions, setActiveTask, setTaskDuration, setIsPaused, setStoredElapsed]);

  const addTime = useCallback((minutes: number) => {
    setTaskDuration(prev => prev + minutes);
  }, [setTaskDuration]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const todayFocusMinutes = sessions
    .filter((s) => s.date === new Date().toISOString().split('T')[0])
    .reduce((acc, s) => acc + s.duration, 0) / 60;

  const weekFocusMinutes = (() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sessions
      .filter((s) => new Date(s.date) >= weekAgo)
      .reduce((acc, s) => acc + s.duration, 0) / 60;
  })();

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatOvertime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `+${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    sessions,
    activeTask,
    isRunning,
    isPaused,
    elapsedSeconds,
    timerStatus,
    todayFocusMinutes,
    weekFocusMinutes,
    startTaskTimer,
    pauseTaskTimer,
    resumeTaskTimer,
    stopTaskTimer,
    addTime,
    getTimeDisplay,
    formatTime,
    formatOvertime,
  };
}
