import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyData } from '@/hooks/useAnalytics';

interface FocusChartProps {
  data: DailyData[];
  type: 'daily' | 'weekly';
}

export function FocusChart({ data, type }: FocusChartProps) {
  const displayData = type === 'daily' ? data : data;

  return (
    <div className="bg-card rounded-2xl shadow-soft p-6 border border-border/30 bento-fade-in chart-animate">
      <h3 className="text-sm font-medium text-foreground mb-1">Focus Time</h3>
      <p className="text-xs text-muted-foreground mb-6">
        {type === 'daily' ? 'Last 7 days' : 'Last 30 days'}
      </p>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: 'var(--shadow-soft)',
              }}
              formatter={(value: number) => [`${value} min`, 'Focus Time']}
            />
            <Bar 
              dataKey="focusMinutes" 
              fill="hsl(var(--lavender-foreground))" 
              radius={[8, 8, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
