import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyData } from '@/hooks/useAnalytics';

interface MonthlyOverviewChartProps {
  data: DailyData[];
}

export function MonthlyOverviewChart({ data }: MonthlyOverviewChartProps) {
  // Show every 5th label to avoid crowding
  const tickFormatter = (value: string, index: number) => {
    return index % 5 === 0 ? value : '';
  };

  return (
    <div className="bg-soft-green rounded-2xl shadow-soft p-6 border border-border/30 bento-fade-in chart-animate relative overflow-hidden" style={{ animationDelay: '300ms' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/[0.02] pointer-events-none" />
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-soft-green-foreground mb-1">Monthly Overview</h3>
        <p className="text-xs text-soft-green-foreground/70 mb-6">Focus time over the last 30 days</p>
        
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--soft-green-foreground))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--soft-green-foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--soft-green-foreground) / 0.15)" vertical={false} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--soft-green-foreground))' }}
                tickFormatter={tickFormatter}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'hsl(var(--soft-green-foreground))' }}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: 'var(--shadow-soft)',
                }}
                formatter={(value: number) => [`${value} min`, 'Focus Time']}
              />
              <Area 
                type="monotone" 
                dataKey="focusMinutes" 
                stroke="hsl(var(--soft-green-foreground))"
                strokeWidth={2}
                fill="url(#focusGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}