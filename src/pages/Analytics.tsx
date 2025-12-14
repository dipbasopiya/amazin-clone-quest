import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FocusChart } from '@/components/analytics/FocusChart';
import { TaskTrendChart } from '@/components/analytics/TaskTrendChart';
import { CategoryPieChart } from '@/components/analytics/CategoryPieChart';
import { MonthlyOverviewChart } from '@/components/analytics/MonthlyOverviewChart';
import { AnalyticsStatCard } from '@/components/analytics/AnalyticsStatCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTasks } from '@/hooks/useTasks';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { useStreak } from '@/hooks/useStreak';
import { useSettings } from '@/hooks/useSettings';
import { Clock, CheckCircle2, Flame, Calendar, TrendingUp, Target } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function Analytics() {
  const { tasks } = useTasks();
  const { sessions } = useFocusTimer();
  const streak = useStreak(tasks, sessions);
  const { last7Days, last30Days, categoryDistribution, totalStats } = useAnalytics(tasks, sessions);
  const { settings } = useSettings();
  const fitToScreen = settings.fitToScreen;
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  return (
    <MainLayout>
      <div className={cn("flex items-center justify-between mb-8", fitToScreen && "mb-4 flex-shrink-0")}>
        <div>
          <h1 className="text-3xl font-display text-foreground mb-1">Analytics</h1>
          <p className="text-muted-foreground">Track your productivity trends</p>
        </div>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as 'week' | 'month')}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Grid */}
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8", fitToScreen && "mb-4 flex-shrink-0")}>
        <AnalyticsStatCard
          title="Total Focus"
          value={`${totalStats.totalFocusHours}h`}
          subtitle="all time"
          icon={Clock}
          color="lavender"
        />
        <AnalyticsStatCard
          title="Tasks Done"
          value={totalStats.totalTasksCompleted}
          subtitle="completed"
          icon={CheckCircle2}
          color="peach"
        />
        <AnalyticsStatCard
          title="Current Streak"
          value={streak}
          subtitle={streak === 1 ? 'day' : 'days'}
          icon={Flame}
          color="pink"
        />
        <AnalyticsStatCard
          title="Productive Days"
          value={totalStats.productiveDays}
          subtitle="total"
          icon={Calendar}
          color="blue"
        />
        <AnalyticsStatCard
          title="Avg Focus/Day"
          value={`${totalStats.avgDailyFocus}m`}
          subtitle="this week"
          icon={TrendingUp}
          color="green"
        />
        <AnalyticsStatCard
          title="Avg Tasks/Day"
          value={totalStats.avgDailyTasks}
          subtitle="this week"
          icon={Target}
          color="yellow"
        />
      </div>

      {/* Charts Grid */}
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6", fitToScreen && "flex-1 min-h-0 overflow-auto")}>
        <FocusChart data={timeRange === 'week' ? last7Days : last30Days} type={timeRange === 'week' ? 'daily' : 'weekly'} />
        <TaskTrendChart data={timeRange === 'week' ? last7Days : last30Days} />
      </div>

      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", fitToScreen && "flex-shrink-0")}>
        <CategoryPieChart data={categoryDistribution} />
        <MonthlyOverviewChart data={last30Days} />
      </div>
    </MainLayout>
  );
}
