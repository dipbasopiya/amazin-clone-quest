import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyData } from '@/hooks/useAnalytics';

interface FocusChartProps {
  data: DailyData[];
  type: 'daily' | 'weekly';
}

export function FocusChart({ data, type }: FocusChartProps) {
  const displayData = type === 'daily' ? data : data;

  return (
    <div className="bg-card rounded-2xl shadow-soft p-6">
      <h3 className="text-sm font-medium text-foreground mb-1">Focus Time</h3>
      <p className="text-xs text-muted-foreground mb-6">
        {type === 'daily' ? 'Last 7 days' : 'Last 30 days'}
      </p>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 85%)" vertical={false} />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'hsl(25, 10%, 45%)' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'hsl(25, 10%, 45%)' }}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(35, 40%, 98%)',
                border: '1px solid hsl(35, 20%, 85%)',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} min`, 'Focus Time']}
            />
            <Bar 
              dataKey="focusMinutes" 
              fill="hsl(280, 50%, 75%)" 
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
