import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TodayRoutineCard } from '@/components/dashboard/TodayRoutineCard';
import { FocusCard } from '@/components/dashboard/FocusCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DeadlinesCard } from '@/components/dashboard/DeadlinesCard';
import { HeatmapCard } from '@/components/dashboard/HeatmapCard';
import { useTasks } from '@/hooks/useTasks';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { useStreak } from '@/hooks/useStreak';
import { useSettings } from '@/hooks/useSettings';
import { useRoutine } from '@/hooks/useRoutine';
import { useRoutineCompletion } from '@/hooks/useRoutineCompletion';
import { CheckCircle2, Flame, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { tasks, completedToday, upcomingDeadlines } = useTasks();
  const { blocks, getBlocksForDay } = useRoutine();
  const { toggleBlockCompletion, getCompletedBlockIds, completedCount: routineCompletedCount, allCompletions } = useRoutineCompletion();
  const {
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
  } = useFocusTimer();
  const streak = useStreak(tasks, sessions, allCompletions);
  const { settings } = useSettings();
  const fitToScreen = settings.fitToScreen;

  // Get today's routine blocks
  const todayDayOfWeek = new Date().getDay();
  const todayBlocks = useMemo(() => getBlocksForDay(todayDayOfWeek), [getBlocksForDay, todayDayOfWeek]);

  const formatHours = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <MainLayout>
      <div className={cn("mb-8", fitToScreen && "mb-4 flex-shrink-0")}>
        <h1 className="text-3xl font-display text-foreground mb-1">Good day!</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div
        className={cn(
          "grid grid-cols-4 gap-6 auto-rows-min",
          fitToScreen && "flex-1 min-h-0 lg:grid-rows-[1fr_1fr] lg:auto-rows-[1fr]"
        )}
      >
        {/* Today's Routine Card - Large */}
        <TodayRoutineCard
          blocks={todayBlocks}
          completedBlockIds={getCompletedBlockIds}
          onToggleComplete={toggleBlockCompletion}
          fitToScreen={fitToScreen}
        />

        {/* Focus Timer Card */}
        <FocusCard
          isRunning={isRunning}
          currentSeconds={currentSeconds}
          currentCategory={currentCategory}
          todayFocusMinutes={todayFocusMinutes}
          onStart={startTimer}
          onStop={stopTimer}
          onCategoryChange={setCurrentCategory}
          formatTime={formatTime}
        />

        {/* Stats Cards */}
        <StatsCard
          title="Tasks Completed"
          value={completedToday + routineCompletedCount}
          subtitle="today"
          icon={CheckCircle2}
          colorVariant="peach"
          delay={2}
        />

        <StatsCard
          title="Current Streak"
          value={streak}
          subtitle={streak === 1 ? 'day' : 'days'}
          icon={Flame}
          colorVariant="pink"
          delay={3}
        />

        {/* Deadlines Card */}
        <DeadlinesCard deadlines={upcomingDeadlines} delay={4} fitToScreen={fitToScreen} />

        {/* Weekly Focus */}
        <StatsCard
          title="Weekly Focus"
          value={formatHours(weekFocusMinutes)}
          subtitle="this week"
          icon={Clock}
          colorVariant="blue"
          delay={5}
        />

        {/* Heatmap Card */}
        <HeatmapCard tasks={tasks} sessions={sessions} delay={6} />

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
    </MainLayout>
  );
}
