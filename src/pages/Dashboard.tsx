import { MainLayout } from '@/components/layout/MainLayout';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { ActiveTaskCard } from '@/components/dashboard/ActiveTaskCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DeadlinesCard } from '@/components/dashboard/DeadlinesCard';
import { HeatmapCard } from '@/components/dashboard/HeatmapCard';
import { useRoutine } from '@/hooks/useRoutine';
import { useRoutineCompletion } from '@/hooks/useRoutineCompletion';
import { useActiveTaskTimer } from '@/hooks/useActiveTaskTimer';
import { CheckCircle2, Flame, Clock, Target } from 'lucide-react';

export default function Dashboard() {
  const { blocks } = useRoutine();
  const {
    todayRoutineTasks,
    todayCompletedCount,
    toggleRoutineTaskCompletion,
    currentStreak,
    completions,
  } = useRoutineCompletion(blocks);
  const {
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
  } = useActiveTaskTimer();

  const formatHours = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  // Convert routine tasks to Task-like format for DeadlinesCard
  const upcomingTasks = todayRoutineTasks
    .filter((t) => !t.completed)
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category === 'break' ? 'personal' as const : t.category,
      completed: t.completed,
      deadline: undefined,
      createdAt: new Date().toISOString(),
    }));

  // Helper to format time for display
  const formatTaskTime = (hour: number, minute: number): string => {
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    const period = hour < 12 ? 'AM' : 'PM';
    return `${h}:${m} ${period}`;
  };

  // Handle task completion from timer
  const handleTimerStop = (markCompleted?: boolean) => {
    const completedTask = stopTaskTimer(markCompleted);
    if (completedTask && markCompleted) {
      // Find and mark the routine task as completed
      const routineTask = todayRoutineTasks.find(t => t.id === completedTask.id);
      if (routineTask && !routineTask.completed) {
        toggleRoutineTaskCompletion(routineTask.blockId);
      }
    }
  };

  // Start timer for a specific routine task - duration calculated from scheduled times
  const handleStartTaskFromRoutine = (taskId: string) => {
    const task = todayRoutineTasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      // Duration is in hours (e.g., 0.5, 1, 1.5), convert to minutes
      // If duration is 0 or missing, fallback to 30 minutes
      const durationMinutes = task.duration > 0 ? Math.round(task.duration * 60) : 30;
      
      startTaskTimer({
        id: task.id,
        title: task.title,
        category: task.category === 'break' ? 'personal' : task.category,
        durationMinutes,
        scheduledTime: formatTaskTime(task.startHour, task.startMinute),
      });
    }
  };

  return (
    <MainLayout>
      <div className="page-transition">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display text-foreground mb-1">Good day!</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-min">
          {/* Task Card - Large primary card */}
          <TaskCard
            routineTasks={todayRoutineTasks}
            completedCount={todayCompletedCount}
            onToggle={toggleRoutineTaskCompletion}
            onStartTask={handleStartTaskFromRoutine}
            activeTaskId={activeTask?.id}
          />

          {/* Active Task Timer Card */}
          <ActiveTaskCard
            activeTask={activeTask}
            isRunning={isRunning}
            isPaused={isPaused}
            elapsedSeconds={elapsedSeconds}
            timerStatus={timerStatus}
            onStart={startTaskTimer}
            onPause={pauseTaskTimer}
            onResume={resumeTaskTimer}
            onStop={handleTimerStop}
            onAddTime={addTime}
            formatTime={formatTime}
            formatOvertime={formatOvertime}
            getTimeDisplay={getTimeDisplay}
            routineTasks={todayRoutineTasks}
          />

          {/* Stats Cards - Warm tones for tasks/routine */}
          <StatsCard
            title="Tasks Done"
            value={todayCompletedCount}
            subtitle="today"
            icon={CheckCircle2}
            colorVariant="peach"
            delay={2}
          />

          <StatsCard
            title="Current Streak"
            value={currentStreak}
            subtitle={currentStreak === 1 ? 'day' : 'days'}
            icon={Flame}
            colorVariant="yellow"
            delay={3}
          />

          {/* Deadlines Card */}
          <DeadlinesCard deadlines={upcomingTasks} delay={4} />

          {/* Cool tones for focus/analytics */}
          <StatsCard
            title="Weekly Focus"
            value={formatHours(weekFocusMinutes)}
            subtitle="this week"
            icon={Clock}
            colorVariant="cyan"
            delay={5}
          />

          {/* Heatmap Card - Spans 2 columns on larger screens */}
          <HeatmapCard 
            tasks={[]} 
            sessions={sessions} 
            routineCompletions={completions}
            delay={6} 
          />

          {/* Goal Card */}
          <StatsCard
            title="Daily Goal"
            value={`${Math.round((todayFocusMinutes / 120) * 100)}%`}
            subtitle="2h target"
            icon={Target}
            colorVariant="green"
            delay={7}
          />
        </div>
      </div>
    </MainLayout>
  );
}
