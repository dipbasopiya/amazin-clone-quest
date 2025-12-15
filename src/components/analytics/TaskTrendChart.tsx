import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyData } from '@/hooks/useAnalytics';

interface TaskTrendChartProps {
  data: DailyData[];
}

export function TaskTrendChart({ data }: TaskTrendChartProps) {
  return (
    <div className="bg-card rounded-2xl shadow-soft p-6 border border-border/30 bento-fade-in chart-animate" style={{ animationDelay: '100ms' }}>
      <h3 className="text-sm font-medium text-foreground mb-1">Task Completion Trend</h3>
      <p className="text-xs text-muted-foreground mb-6">Tasks completed per day</p>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: 'var(--shadow-soft)',
              }}
              formatter={(value: number) => [value, 'Tasks']}
            />
            <Line 
              type="monotone" 
              dataKey="tasksCompleted" 
              stroke="hsl(var(--peach-foreground))"
              strokeWidth={2.5}
              dot={{ fill: 'hsl(var(--peach-foreground))', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
