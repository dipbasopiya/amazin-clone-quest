import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Clock, ChevronLeft, ChevronRight, Sparkles, GripVertical } from "lucide-react";
import { BubbleCard } from "@/components/ui/BubbleCard";
import { useFitToScreen } from "@/components/layout/BubbleLayout";
import { cn } from "@/lib/utils";

const scheduleBlocks = [
  { id: 1, title: "Morning Study", time: "08:00 - 10:00", type: "study", color: "orange" },
  { id: 2, title: "React Development", time: "10:30 - 12:30", type: "coding", color: "aqua" },
  { id: 3, title: "Lunch Break", time: "12:30 - 13:30", type: "break", color: "yellow" },
  { id: 4, title: "Algorithm Practice", time: "14:00 - 16:00", type: "coding", color: "aqua" },
  { id: 5, title: "Physics Review", time: "16:30 - 18:00", type: "study", color: "purple" },
  { id: 6, title: "Personal Project", time: "19:00 - 21:00", type: "coding", color: "neon" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const colorClasses = {
  orange: { bg: "bg-orange/20", border: "border-l-orange", text: "text-orange", pill: "bg-orange text-white" },
  aqua: { bg: "bg-aqua/20", border: "border-l-aqua", text: "text-aqua", pill: "bg-aqua text-charcoal" },
  purple: { bg: "bg-purple/20", border: "border-l-purple", text: "text-purple", pill: "bg-purple text-white" },
  yellow: { bg: "bg-yellow/20", border: "border-l-yellow", text: "text-yellow", pill: "bg-yellow text-charcoal" },
  neon: { bg: "bg-neon-green/20", border: "border-l-neon-green", text: "text-neon-green", pill: "bg-neon-green text-charcoal" },
};

export default function RoutinePage() {
  const [selectedDay, setSelectedDay] = useState(2);
  const [view, setView] = useState<"day" | "week">("day");
  const context = useFitToScreen();
  const fitToScreen = context?.fitToScreen ?? false;

  return (
    <div
      className={cn(
        "p-4 lg:p-8 w-full max-w-none",
        fitToScreen
          ? "lg:h-full lg:flex lg:flex-col lg:overflow-hidden"
          : ""
      )}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-1">Routine Manager</h1>
          <p className="text-muted-foreground">Plan your perfect day</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange text-white font-semibold shadow-glow-orange"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Block</span>
        </motion.button>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-charcoal">
          {["day", "week"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as "day" | "week")}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all capitalize",
                view === v
                  ? "bg-orange text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-charcoal text-white hover:bg-charcoal/80 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-4 font-medium">December 2024</span>
          <button className="p-2 rounded-full bg-charcoal text-white hover:bg-charcoal/80 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Day Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-6 overflow-x-auto pb-2"
      >
        {days.map((day, index) => (
          <motion.button
            key={day}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDay(index)}
            className={cn(
              "flex flex-col items-center min-w-[70px] p-3 rounded-2xl transition-all",
              selectedDay === index
                ? "bg-orange text-white shadow-glow-orange"
                : "bg-charcoal text-white hover:bg-charcoal/80"
            )}
          >
            <span className="text-xs font-medium opacity-70">{day}</span>
            <span className="text-xl font-bold">{9 + index}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* AI Suggestion */}
      <BubbleCard delay={0.3} className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-aqua">
            <Sparkles className="w-5 h-5 text-charcoal" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white mb-0.5">AI Suggestion</p>
            <p className="text-sm text-white/60">
              Your focus peaks at 9-11 AM. Consider scheduling deep work tasks during this time.
            </p>
          </div>
          <button className="px-4 py-2 rounded-full bg-aqua text-charcoal font-medium text-sm">Apply</button>
        </div>
      </BubbleCard>

      {/* Schedule Blocks */}
      <div className={cn("space-y-3", fitToScreen && "lg:flex-1 lg:min-h-0 lg:overflow-auto")}>
        {scheduleBlocks.map((block, index) => {
          const colors = colorClasses[block.color as keyof typeof colorClasses];
          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-l-4 bg-charcoal cursor-grab hover:shadow-floating transition-all",
                colors.border
              )}
            >
              <GripVertical className="w-5 h-5 text-white/30" />
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-0.5">{block.title}</h3>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Clock className="w-4 h-4" />
                  <span>{block.time}</span>
                </div>
              </div>
              <span className={cn("px-3 py-1 rounded-full font-medium text-xs capitalize", colors.pill)}>
                {block.type}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className={cn("grid grid-cols-3 gap-4 mt-8", fitToScreen && "lg:shrink-0 lg:mt-4")}>
        {[
          { label: "Total Hours", value: "8.5h", color: "orange" },
          { label: "Study Time", value: "4h", color: "purple" },
          { label: "Coding Time", value: "4.5h", color: "aqua" },
        ].map((stat, index) => (
          <BubbleCard key={stat.label} delay={0.7 + index * 0.1} className="text-center p-4">
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-white/50">{stat.label}</p>
          </BubbleCard>
        ))}
      </div>
    </div>
  );
}
