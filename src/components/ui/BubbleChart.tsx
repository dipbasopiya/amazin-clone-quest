import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BubbleChartProps {
  data: Array<{ name: string; value: number; value2?: number }>;
  color?: "orange" | "blue" | "aqua" | "purple" | "neon";
  showSecondary?: boolean;
}

export function BubbleAreaChart({ data, color = "orange", showSecondary = false }: BubbleChartProps) {
  const colorMap = {
    orange: { stroke: "#FF4F17", fill: "rgba(255,79,23,0.2)" },
    blue: { stroke: "#2D8CFF", fill: "rgba(45,140,255,0.2)" },
    aqua: { stroke: "#29E3C2", fill: "rgba(41,227,194,0.2)" },
    purple: { stroke: "#845CFF", fill: "rgba(132,92,255,0.2)" },
    neon: { stroke: "#B6FF2A", fill: "rgba(182,255,42,0.2)" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorMap[color].stroke} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colorMap[color].stroke} stopOpacity={0} />
            </linearGradient>
            {showSecondary && (
              <linearGradient id="gradient-secondary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D8CFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2D8CFF" stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "16px",
              boxShadow: "var(--shadow-soft)",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={colorMap[color].stroke}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#gradient-${color})`}
          />
          {showSecondary && (
            <Area
              type="monotone"
              dataKey="value2"
              stroke="#2D8CFF"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#gradient-secondary)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}