import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryData } from '@/hooks/useAnalytics';

interface CategoryPieChartProps {
  data: CategoryData[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const total = data.reduce((acc, d) => acc + d.hours, 0);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-soft p-6 border border-border/30 bento-fade-in" style={{ animationDelay: '200ms' }}>
        <h3 className="text-sm font-medium text-foreground mb-1">Time by Category</h3>
        <p className="text-xs text-muted-foreground mb-6">Distribution of focus time</p>
        <div className="h-[200px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-muted-foreground text-sm">No data yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Start focusing to see insights</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-soft p-6 border border-border/30 bento-fade-in chart-animate" style={{ animationDelay: '200ms' }}>
      <h3 className="text-sm font-medium text-foreground mb-1">Time by Category</h3>
      <p className="text-xs text-muted-foreground mb-6">Distribution of focus time</p>
      
      <div className="flex items-center gap-6">
        <div className="h-[160px] w-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="hours"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: 'var(--shadow-soft)',
                }}
                formatter={(value: number) => [`${value}h`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.category} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-sm text-foreground flex-1">{item.label}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {item.hours}h ({Math.round((item.hours / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
