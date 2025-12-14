import { motion } from "framer-motion";

interface BubbleProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: "orange" | "blue" | "aqua" | "purple" | "neon" | "yellow" | "red";
  label?: string;
  showValue?: boolean;
}

export function BubbleProgress({
  value,
  size = 120,
  strokeWidth = 12,
  color = "orange",
  label,
  showValue = true,
}: BubbleProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const colorMap = {
    orange: "#FF4F17",
    blue: "#2D8CFF",
    aqua: "#29E3C2",
    purple: "#845CFF",
    neon: "#B6FF2A",
    yellow: "#FFD600",
    red: "#FF2E35",
  };

  const glowMap = {
    orange: "drop-shadow(0 0 12px rgba(255,79,23,0.5))",
    blue: "drop-shadow(0 0 12px rgba(45,140,255,0.5))",
    aqua: "drop-shadow(0 0 12px rgba(41,227,194,0.5))",
    purple: "drop-shadow(0 0 12px rgba(132,92,255,0.5))",
    neon: "drop-shadow(0 0 12px rgba(182,255,42,0.5))",
    yellow: "drop-shadow(0 0 12px rgba(255,214,0,0.5))",
    red: "drop-shadow(0 0 12px rgba(255,46,53,0.5))",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: glowMap[color] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className="text-2xl font-bold text-white">{Math.round(value)}%</span>
        )}
        {label && (
          <span className="text-xs text-white/60">{label}</span>
        )}
      </div>
    </div>
  );
}

interface LinearBubbleProgressProps {
  value: number;
  color?: "orange" | "blue" | "aqua" | "purple" | "neon" | "yellow" | "red";
  label?: string;
  showValue?: boolean;
}

export function LinearBubbleProgress({
  value,
  color = "orange",
  label,
  showValue = true,
}: LinearBubbleProgressProps) {
  const gradientClasses = {
    orange: "gradient-orange",
    blue: "gradient-blue",
    aqua: "gradient-aqua",
    purple: "gradient-purple",
    neon: "gradient-neon",
    yellow: "gradient-yellow",
    red: "bg-red",
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-white/60">{label}</span>}
          {showValue && <span className="text-sm font-medium text-white">{value}%</span>}
        </div>
      )}
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${gradientClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}