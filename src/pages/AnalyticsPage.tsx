import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Target, Award, Brain, Flame, Calendar } from "lucide-react";
import { BubbleCard, StatBubble } from "@/components/ui/BubbleCard";
import { BubbleProgress } from "@/components/ui/BubbleProgress";
import { useFitToScreen } from "@/components/layout/BubbleLayout";
import { cn } from "@/lib/utils";

const weeklyData = [
  { name: "Mon", study: 4, coding: 3 },
  { name: "Tue", study: 3, coding: 5 },
  { name: "Wed", study: 5, coding: 4 },
  { name: "Thu", study: 6, coding: 6 },
  { name: "Fri", study: 4, coding: 5 },
  { name: "Sat", study: 7, coding: 7 },
  { name: "Sun", study: 5, coding: 4 },
];

const subjectData = [
  { name: "Math", hours: 12, fill: "#FF4F17" },
  { name: "CS", hours: 18, fill: "#2D8CFF" },
  { name: "Physics", hours: 8, fill: "#845CFF" },
  { name: "Database", hours: 10, fill: "#29E3C2" },
];

const skillsData = [
  { skill: "React", level: 85 },
  { skill: "Node.js", level: 70 },
  { skill: "Python", level: 75 },
  { skill: "SQL", level: 65 },
  { skill: "Git", level: 80 },
];

export default function AnalyticsPage() {
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
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-1">Analytics</h1>
        <p className="text-muted-foreground">Track your progress and insights</p>
      </motion.div>

      {/* Quick Stats */}
      <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", fitToScreen && "lg:shrink-0")}>
        <StatBubble icon={TrendingUp} label="Total Hours" value="127h" subtext="+12%" color="orange" delay={0} />
        <StatBubble icon={Target} label="Goals Met" value="8/10" subtext="+2" color="blue" delay={0.1} />
        <StatBubble icon={Award} label="Best Streak" value="12 days" subtext="New!" color="purple" delay={0.2} />
        <StatBubble icon={Brain} label="Focus Score" value="85%" subtext="+5%" color="neon" delay={0.3} />
      </div>

      {/* Charts Grid */}
      <div className={cn("grid lg:grid-cols-2 gap-6 mb-6", fitToScreen && "lg:flex-1 lg:min-h-0 lg:overflow-auto")}>
        {/* Weekly Activity */}
        <BubbleCard delay={0.2} className="p-5">
          <h3 className="font-semibold text-lg mb-4 text-white">Weekly Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="gradStudy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4F17" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF4F17" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradCoding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D8CFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2D8CFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="study" stroke="#FF4F17" strokeWidth={3} fill="url(#gradStudy)" />
                <Area type="monotone" dataKey="coding" stroke="#2D8CFF" strokeWidth={3} fill="url(#gradCoding)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BubbleCard>

        {/* Subject Distribution */}
        <BubbleCard delay={0.3} className="p-5">
          <h3 className="font-semibold text-lg mb-4 text-white">Subject Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="hours"
                  cornerRadius={8}
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </BubbleCard>

        {/* Skills Radar */}
        <BubbleCard delay={0.4} className="p-5">
          <h3 className="font-semibold text-lg mb-4 text-white">Skills Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsData}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
                <Radar
                  name="Skills"
                  dataKey="level"
                  stroke="#845CFF"
                  fill="#845CFF"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </BubbleCard>

        {/* Monthly Comparison */}
        <BubbleCard delay={0.5} className="p-5">
          <h3 className="font-semibold text-lg mb-4 text-white">Monthly Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="study" fill="#FF4F17" radius={[8, 8, 0, 0]} />
                <Bar dataKey="coding" fill="#29E3C2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BubbleCard>
      </div>

      {/* Activity Heatmap */}
      <BubbleCard delay={0.6} className={cn("p-5", fitToScreen && "lg:shrink-0")}>
        <div className={cn("flex items-center justify-between mb-4", fitToScreen && "lg:mb-2")}>
          <h3 className="font-semibold text-lg text-white">Activity Heatmap</h3>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/50">Last 12 weeks</span>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {Array.from({ length: 12 }, (_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const value = Math.floor(Math.random() * 5);
                const opacity = value === 0 ? 0.1 : 0.2 + value * 0.2;
                return (
                  <div
                    key={dayIndex}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: `rgba(255, 79, 23, ${opacity})` }}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-white/50">
          <span>Less</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity) => (
            <div
              key={opacity}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: `rgba(255, 79, 23, ${opacity})` }}
            />
          ))}
          <span>More</span>
        </div>
      </BubbleCard>

      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={cn("mt-6 p-6 rounded-3xl gradient-orange glow-orange", fitToScreen && "lg:shrink-0 lg:mt-4")}
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1 text-white">12 Day Streak! 🔥</h3>
            <p className="text-white/80">
              You're on fire! Keep up the great work to reach your 30-day goal.
            </p>
          </div>
          <BubbleProgress value={40} size={80} color="yellow" showValue={false} />
        </div>
      </motion.div>
    </div>
  );
}
