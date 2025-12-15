import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BubbleCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function BubbleCard({
  children,
  className,
  delay = 0,
  hover = true,
}: BubbleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 200 }}
      className={cn(
        "rounded-3xl bg-surface-1 border border-border/30",
        hover && "hover:shadow-hover transition-shadow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface StatBubbleProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
  color?: "orange" | "blue" | "aqua" | "purple" | "neon" | "yellow" | "red";
  delay?: number;
}

const colorConfig = {
  orange: { bg: "bg-peach", text: "text-peach-foreground", iconBg: "bg-peach-foreground/15" },
  blue: { bg: "bg-soft-blue", text: "text-soft-blue-foreground", iconBg: "bg-soft-blue-foreground/15" },
  aqua: { bg: "bg-soft-cyan", text: "text-soft-cyan-foreground", iconBg: "bg-soft-cyan-foreground/15" },
  purple: { bg: "bg-lavender", text: "text-lavender-foreground", iconBg: "bg-lavender-foreground/15" },
  neon: { bg: "bg-soft-green", text: "text-soft-green-foreground", iconBg: "bg-soft-green-foreground/15" },
  yellow: { bg: "bg-soft-yellow", text: "text-soft-yellow-foreground", iconBg: "bg-soft-yellow-foreground/15" },
  red: { bg: "bg-soft-pink", text: "text-soft-pink-foreground", iconBg: "bg-soft-pink-foreground/15" },
};

export function StatBubble({
  icon: Icon,
  label,
  value,
  subtext,
  color = "orange",
  delay = 0,
}: StatBubbleProps) {
  const config = colorConfig[color];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 200 }}
      className={cn(
        "rounded-3xl p-4 border border-border/30 hover:shadow-hover transition-shadow relative overflow-hidden",
        config.bg,
        config.text
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/[0.02] pointer-events-none" />
      <div className="relative z-10">
        <div className="mb-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-sm opacity-70 mb-1">{label}</p>
        <p className="text-2xl font-bold mb-2">{value}</p>
        {subtext && (
          <span className={cn("text-xs px-2.5 py-1 rounded-full inline-block font-medium", config.iconBg)}>
            {subtext}
          </span>
        )}
      </div>
    </motion.div>
  );
}