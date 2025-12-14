import { useState, useCallback, useEffect, useRef } from 'react';
import { FocusSession, TaskCategory } from '@/types/fluxion';
import { useLocalStorage } from './useLocalStorage';

export function useFocusTimer() {
  const [sessions, setSessions] = useLocalStorage<FocusSession[]>('fluxion-focus-sessions', []);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<TaskCategory>('coding');
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback((category: TaskCategory = 'coding') => {
    setCurrentCategory(category);
    setIsRunning(true);
    startTimeRef.current = new Date();
    setCurrentSeconds(0);
  }, []);

  const stopTimer = useCallback(() => {
    if (startTimeRef.current && currentSeconds > 0) {
      const newSession: FocusSession = {
        id: crypto.randomUUID(),
        startTime: startTimeRef.current.toISOString(),
        endTime: new Date().toISOString(),
        duration: currentSeconds,
        category: currentCategory,
        date: new Date().toISOString().split('T')[0],
      };
      setSessions((prev) => [...prev, newSession]);
    }
    setIsRunning(false);
    setCurrentSeconds(0);
    startTimeRef.current = null;
  }, [currentSeconds, currentCategory, setSessions]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCurrentSeconds((s) => s + 1);
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

  return {
    sessions,
    isRunning,
    currentSeconds,
    currentCategory,
    todayFocusMinutes,
    weekFocusMinutes,
    startTimer,
    stopTimer,
    setCurrentCategory,
    formatTime,
  };
}
