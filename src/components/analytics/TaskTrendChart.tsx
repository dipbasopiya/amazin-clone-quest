import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyData } from '@/hooks/useAnalytics';

interface TaskTrendChartProps {
  data: DailyData[];
}

export function TaskTrendChart({ data }: TaskTrendChartProps) {
  return (
    <div className="bg-card rounded-2xl shadow-soft p-6">
      <h3 className="text-sm font-medium text-foreground mb-1">Task Completion Trend</h3>
      <p className="text-xs text-muted-foreground mb-6">Tasks completed per day</p>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(35, 40%, 98%)',
                border: '1px solid hsl(35, 20%, 85%)',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value, 'Tasks']}
            />
            <Line 
              type="monotone" 
              dataKey="tasksCompleted" 
              stroke="hsl(15, 80%, 65%)"
              strokeWidth={2.5}
              dot={{ fill: 'hsl(15, 80%, 65%)', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(15, 80%, 55%)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
