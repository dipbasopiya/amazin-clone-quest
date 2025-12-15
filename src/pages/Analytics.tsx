import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FocusChart } from '@/components/analytics/FocusChart';
import { TaskTrendChart } from '@/components/analytics/TaskTrendChart';
import { CategoryPieChart } from '@/components/analytics/CategoryPieChart';
import { MonthlyOverviewChart } from '@/components/analytics/MonthlyOverviewChart';
import { AnalyticsStatCard } from '@/components/analytics/AnalyticsStatCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useRoutine } from '@/hooks/useRoutine';
import { useRoutineCompletion } from '@/hooks/useRoutineCompletion';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { Clock, CheckCircle2, Flame, Calendar, TrendingUp, Target } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Analytics() {
  const { blocks } = useRoutine();
  const { completions, currentStreak } = useRoutineCompletion(blocks);
  const { sessions } = useFocusTimer();
  const { last7Days, last30Days, categoryDistribution, totalStats } = useAnalytics(blocks, completions, sessions);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  return (
    <MainLayout>
      <div className="page-transition">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display text-foreground mb-1">Analytics</h1>
            <p className="text-muted-foreground">Track your productivity trends</p>
          </div>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as 'week' | 'month')}>
            <TabsList className="bg-muted/60 border border-border/30 rounded-xl p-1">
              <TabsTrigger value="week" className="rounded-lg px-4 data-[state=active]:bg-card data-[state=active]:shadow-soft">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="rounded-lg px-4 data-[state=active]:bg-card data-[state=active]:shadow-soft">
                Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Grid - KPI Summary Row with emphasis */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 p-4 bg-surface-1/50 rounded-2xl border border-border/20">
          <AnalyticsStatCard
            title="Total Focus"
            value={`${totalStats.totalFocusHours}h`}
            subtitle="all time"
            icon={Clock}
            color="cyan"
            delay={0}
            emphasized
          />
          <AnalyticsStatCard
            title="Tasks Done"
            value={totalStats.totalTasksCompleted}
            subtitle="completed"
            icon={CheckCircle2}
            color="peach"
            delay={1}
            emphasized
          />
          <AnalyticsStatCard
            title="Current Streak"
            value={currentStreak}
            subtitle={currentStreak === 1 ? 'day' : 'days'}
            icon={Flame}
            color="yellow"
            delay={2}
            emphasized
          />
          <AnalyticsStatCard
            title="Productive Days"
            value={totalStats.productiveDays}
            subtitle="total"
            icon={Calendar}
            color="lavender"
            delay={3}
          />
          <AnalyticsStatCard
            title="Avg Focus/Day"
            value={`${totalStats.avgDailyFocus}m`}
            subtitle="this week"
            icon={TrendingUp}
            color="blue"
            delay={4}
          />
          <AnalyticsStatCard
            title="Avg Tasks/Day"
            value={totalStats.avgDailyTasks}
            subtitle="this week"
            icon={Target}
            color="green"
            delay={5}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <FocusChart data={timeRange === 'week' ? last7Days : last30Days} type={timeRange === 'week' ? 'daily' : 'weekly'} />
          <TaskTrendChart data={timeRange === 'week' ? last7Days : last30Days} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CategoryPieChart data={categoryDistribution} />
          <MonthlyOverviewChart data={last30Days} />
        </div>
      </div>
    </MainLayout>
  );
}
