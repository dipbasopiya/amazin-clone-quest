import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Analytics", path: "/analytics" },
  { label: "Routine", path: "/routine" },
  { label: "Profile", path: "/profile" },
];

export function FloatingNav() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-4"
    >
      <div className="w-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <span className="text-charcoal font-bold text-xl">routine</span>
          <Heart className="w-4 h-4 text-orange fill-orange" />
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative"
              >
                <motion.span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-charcoal"
                      : "text-charcoal/60 hover:text-charcoal"
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.span>
              </NavLink>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 bg-transparent text-charcoal text-sm font-medium rounded-full border-2 border-charcoal hover:bg-charcoal hover:text-cream transition-colors"
        >
          Join Us
        </motion.button>
      </div>
    </motion.nav>
  );
}
