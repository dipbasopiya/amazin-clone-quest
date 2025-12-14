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
        "rounded-3xl bg-charcoal border border-charcoal",
        hover && "hover:shadow-floating transition-shadow",
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

export function StatBubble({
  icon: Icon,
  label,
  value,
  subtext,
  color = "orange",
  delay = 0,
}: StatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 200 }}
      className="rounded-3xl p-4 bg-charcoal text-white hover:shadow-floating transition-shadow"
    >
      <div className="mb-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          color === "orange" && "bg-orange/20",
          color === "blue" && "bg-blue/20",
          color === "aqua" && "bg-aqua/20",
          color === "purple" && "bg-purple/20",
          color === "neon" && "bg-neon-green/20",
          color === "yellow" && "bg-yellow/20",
          color === "red" && "bg-red/20",
        )}>
          <Icon className={cn(
            "w-5 h-5",
            color === "orange" && "text-orange",
            color === "blue" && "text-blue",
            color === "aqua" && "text-aqua",
            color === "purple" && "text-purple",
            color === "neon" && "text-neon-green",
            color === "yellow" && "text-yellow",
            color === "red" && "text-red",
          )} />
        </div>
      </div>
      <p className="text-sm text-white/60 mb-1">{label}</p>
      <p className="text-2xl font-bold mb-2">{value}</p>
      {subtext && (
        <span className={cn(
          "text-xs px-2.5 py-1 rounded-full inline-block font-medium",
          color === "orange" && "bg-orange/20 text-orange",
          color === "blue" && "bg-blue/20 text-blue",
          color === "aqua" && "bg-aqua/20 text-aqua",
          color === "purple" && "bg-purple/20 text-purple",
          color === "neon" && "bg-neon-green/20 text-neon-green",
          color === "yellow" && "bg-yellow/20 text-yellow",
          color === "red" && "bg-red/20 text-red",
        )}>
          {subtext}
        </span>
      )}
    </motion.div>
  );
}
