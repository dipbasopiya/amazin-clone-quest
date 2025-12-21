import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActiveTaskProvider } from "@/hooks/useActiveTaskTimer";
import Dashboard from "./pages/Dashboard";
import Routine from "./pages/Routine";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ActiveTaskProvider>
        <div className="overflow-x-hidden w-full max-w-full">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/routine" element={<Routine />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ActiveTaskProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
