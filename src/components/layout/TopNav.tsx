import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart3, Settings, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSettings } from '@/hooks/useSettings';
import { motion } from 'framer-motion';
import { ActiveTaskPill } from './ActiveTaskPill';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/routine', icon: Calendar, label: 'Routine' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function TopNav() {
  const { settings } = useSettings();
  const location = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const activeIndex = navItems.findIndex(item => 
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
  );

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl border-b border-border/10"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between">
        {/* Logo - Wordmark Style */}
        <NavLink to="/" className="group flex items-center gap-2.5 min-w-[120px]">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center shadow-soft"
          >
            <span className="text-primary-foreground font-display font-bold text-base">F</span>
            <div className="absolute inset-0 rounded-xl bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
          <motion.span 
            className="font-display font-semibold text-xl tracking-[-0.03em] text-foreground"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
          >
            Fluxion
          </motion.span>
        </NavLink>

        {/* Navigation - Center with Animated Pill */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center p-1.5 rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/10">
          <div className="relative flex items-center">
            {/* Animated Background Pill */}
            {activeIndex !== -1 && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-y-0.5 rounded-xl bg-background shadow-soft"
                style={{
                  width: `${100 / navItems.length}%`,
                  left: `${(activeIndex * 100) / navItems.length}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                }}
              />
            )}
            
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative z-10 flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium',
                    'transition-all duration-300',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground/60 hover:text-foreground/80'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn(
                      'w-4 h-4 transition-all duration-300',
                      isActive ? 'text-primary scale-110' : 'text-current'
                    )} />
                    <span className="hidden sm:inline tracking-[-0.01em]">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Active Task Pill + Profile */}
        <div className="flex items-center gap-3">
          <ActiveTaskPill />
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 p-1 rounded-full transition-colors duration-300 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:ring-offset-2 focus:ring-offset-background"
            >
              <Avatar className="w-8 h-8 border border-border/40 transition-all duration-300 hover:border-border/60">
                <AvatarImage src={settings.profile.avatar} />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                  {getInitials(settings.profile.name)}
                </AvatarFallback>
              </Avatar>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-52 mt-2 bg-background/95 backdrop-blur-xl border-border/30 shadow-lg rounded-xl p-1.5"
            sideOffset={8}
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-3 py-2.5 mb-1">
                <p className="text-sm font-medium text-foreground">
                  {settings.profile.name || 'Guest User'}
                </p>
                <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                  {settings.profile.email || 'Set up your profile'}
                </p>
              </div>
              <DropdownMenuSeparator className="bg-border/30 my-1" />
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg mx-0 transition-colors duration-200 focus:bg-muted/50">
                <NavLink to="/settings" className="flex items-center gap-2.5 w-full px-3 py-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[13px]">Profile</span>
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg mx-0 transition-colors duration-200 focus:bg-muted/50">
                <NavLink to="/settings" className="flex items-center gap-2.5 w-full px-3 py-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[13px]">Settings</span>
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/30 my-1" />
              <DropdownMenuItem className="cursor-pointer text-muted-foreground hover:text-destructive focus:text-destructive rounded-lg mx-0 px-3 py-2 transition-colors duration-200 focus:bg-destructive/5">
                <LogOut className="w-4 h-4 mr-2.5" />
                <span className="text-[13px]">Log out</span>
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
