import { useCallback, useMemo } from 'react';
import { Task, TaskCategory } from '@/types/fluxion';
import { useLocalStorage } from './useLocalStorage';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('fluxion-tasks', []);

  const addTask = useCallback((title: string, category: TaskCategory, deadline?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      category,
      completed: false,
      deadline,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  }, [setTasks]);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, [setTasks]);

  const todayTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt).toDateString();
      return taskDate === today || !task.completed;
    });
  }, [tasks]);

  const completedToday = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt).toDateString();
      return task.completed && taskDate === today;
    }).length;
  }, [tasks]);

  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter((task) => task.deadline && !task.completed)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5);
  }, [tasks]);

  return {
    tasks,
    todayTasks,
    completedToday,
    upcomingDeadlines,
    addTask,
    toggleTask,
    deleteTask,
  };
}
