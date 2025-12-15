import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyData } from '@/hooks/useAnalytics';

interface FocusChartProps {
  data: DailyData[];
  type: 'daily' | 'weekly';
}

export function FocusChart({ data, type }: FocusChartProps) {
  const displayData = type === 'daily' ? data : data;

  return (
    <div className="bg-soft-cyan rounded-2xl shadow-soft p-6 border border-border/30 bento-fade-in chart-animate relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/[0.02] pointer-events-none" />
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-soft-cyan-foreground mb-1">Focus Time</h3>
        <p className="text-xs text-soft-cyan-foreground/70 mb-6">
          {type === 'daily' ? 'Last 7 days' : 'Last 30 days'}
        </p>
        
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--soft-cyan-foreground) / 0.15)" vertical={false} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'hsl(var(--soft-cyan-foreground))' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'hsl(var(--soft-cyan-foreground))' }}
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
              <Bar 
                dataKey="focusMinutes" 
                fill="hsl(var(--soft-cyan-foreground))" 
                radius={[8, 8, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}