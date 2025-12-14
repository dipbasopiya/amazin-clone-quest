import { motion } from "framer-motion";
import { Zap, Clock, Target, Sparkles, ChevronRight, Sun, Moon } from "lucide-react";
import { BubbleCard, StatBubble } from "@/components/ui/BubbleCard";
import { BubbleProgress, LinearBubbleProgress } from "@/components/ui/BubbleProgress";
import { BubbleAreaChart } from "@/components/ui/BubbleChart";
import { useFitToScreen } from "@/components/layout/BubbleLayout";
import { cn } from "@/lib/utils";

const chartData = [
  { name: "Mon", value: 4, value2: 3 },
  { name: "Tue", value: 3, value2: 5 },
  { name: "Wed", value: 5, value2: 4 },
  { name: "Thu", value: 6, value2: 6 },
  { name: "Fri", value: 4, value2: 5 },
  { name: "Sat", value: 7, value2: 7 },
  { name: "Sun", value: 5, value2: 4 },
];

const tasks = [
  { id: 1, title: "Complete React module", time: "2h", completed: true, color: "orange" },
  { id: 2, title: "Review algorithms", time: "1.5h", completed: true, color: "blue" },
  { id: 3, title: "Build API integration", time: "3h", completed: false, color: "purple" },
];

export default function HomePage() {
  const context = useFitToScreen();
  const fitToScreen = context?.fitToScreen ?? false;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div
      className={cn(
        "px-4 lg:px-8 w-full max-w-none",
        fitToScreen
          ? "lg:h-full lg:flex lg:flex-col lg:overflow-hidden"
          : "h-full"
      )}
    >
      {/* Header - Compact */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {hour < 18 ? (
                <Sun className="w-4 h-4 text-yellow" />
              ) : (
                <Moon className="w-4 h-4 text-purple" />
              )}
              <span className="text-xs text-muted-foreground">{greeting}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              Welcome back, <span className="text-gradient-orange">Alex</span>
            </h1>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="hidden lg:flex items-center gap-3 px-4 py-2 bg-charcoal border border-charcoal rounded-full"
          >
            <div className="w-9 h-9 rounded-full gradient-orange flex items-center justify-center">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Alex Johnson</p>
              <p className="text-xs text-white/60">Student + Developer</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid - Compact */}
      <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4", fitToScreen && "lg:shrink-0")}>
        <StatBubble
          icon={Clock}
          label="Study Hours"
          value="4.5h"
          subtext="+15%"
          color="orange"
          delay={0}
        />
        <StatBubble
          icon={Zap}
          label="Coding Hours"
          value="3.2h"
          subtext="+8%"
          color="blue"
          delay={0.1}
        />
        <StatBubble
          icon={Target}
          label="Tasks Done"
          value="12/18"
          subtext="66%"
          color="purple"
          delay={0.2}
        />
        <StatBubble
          icon={Sparkles}
          label="Focus Score"
          value="85%"
          subtext="Great!"
          color="neon"
          delay={0.3}
        />
      </div>

      {/* Main Content Grid - Adjusted for single screen */}
      <div className={cn("grid lg:grid-cols-3 gap-4 mb-4", fitToScreen && "lg:flex-1 lg:min-h-0")}>
        {/* Weekly Activity */}
        <BubbleCard className={cn("lg:col-span-2 p-4", fitToScreen && "lg:overflow-auto")} delay={0.3}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-white">Weekly Activity</h3>
              <p className="text-xs text-white/60">Study & Coding hours</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange" />
                <span className="text-white/60">Study</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue" />
                <span className="text-white/60">Coding</span>
              </div>
            </div>
          </div>
          <div className="h-40">
            <BubbleAreaChart data={chartData} color="orange" showSecondary />
          </div>
        </BubbleCard>

        {/* Focus Score */}
        <BubbleCard delay={0.4} className={cn("p-4", fitToScreen && "lg:overflow-auto")}>
          <div className="text-center">
            <h3 className="font-semibold text-white mb-1">Focus Score</h3>
            <p className="text-xs text-white/60 mb-3">Today's performance</p>
            <div className="flex justify-center mb-2">
              <BubbleProgress value={85} size={100} strokeWidth={10} color="aqua" label="Focus" />
            </div>
            <p className="text-xs text-white/60">
              <span className="text-orange font-medium">+12%</span> from yesterday
            </p>
          </div>
        </BubbleCard>
      </div>

      {/* Tasks & Progress - Compact */}
      <div className={cn("grid lg:grid-cols-2 gap-4", fitToScreen && "lg:flex-1 lg:min-h-0")}>
        {/* Today's Tasks */}
        <BubbleCard delay={0.5} className={cn("p-4", fitToScreen && "lg:overflow-auto")}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Today's Tasks</h3>
            <span className="px-2 py-1 bg-orange/20 text-orange text-xs font-medium rounded-full">2/3 done</span>
          </div>
          <div className="space-y-2">
            {tasks.map((task, index) => {
              const colorClasses = {
                orange: "border-orange/30",
                blue: "border-blue/30",
                purple: "border-purple/30",
              };
              const checkClasses = {
                orange: "bg-orange border-orange",
                blue: "bg-blue border-blue",
                purple: "bg-purple border-purple",
              };
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl transition-all border ${
                    task.completed 
                      ? "bg-white/5 border-transparent" 
                      : `bg-white/10 ${colorClasses[task.color as keyof typeof colorClasses]}`
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      task.completed
                        ? checkClasses[task.color as keyof typeof checkClasses]
                        : "border-white/40"
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className={`flex-1 text-sm text-white ${task.completed && "line-through text-white/50"}`}>
                    {task.title}
                  </p>
                  <span className="px-2 py-0.5 bg-white/10 text-xs text-white/60 rounded-full">
                    {task.time}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </BubbleCard>

        {/* Weekly Progress */}
        <BubbleCard delay={0.6} className={cn("p-4", fitToScreen && "lg:overflow-auto")}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Weekly Progress</h3>
            <button className="flex items-center gap-1 text-xs text-orange hover:underline">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            <LinearBubbleProgress value={80} color="orange" label="Study Goals" />
            <LinearBubbleProgress value={65} color="blue" label="Coding Goals" />
            <LinearBubbleProgress value={90} color="purple" label="Exercise Goals" />
          </div>

          <motion.div 
            className="mt-4 p-3 rounded-xl bg-white/5"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-neon-green" />
              <span className="text-xs font-medium text-white">Weekly Insight</span>
            </div>
            <p className="text-xs text-white/70">
              Coding hours up 20% this week!
            </p>
          </motion.div>
        </BubbleCard>
      </div>
    </div>
  );
}
