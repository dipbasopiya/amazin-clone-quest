import { Outlet, useOutletContext } from "react-router-dom";
import { FloatingNav } from "./FloatingNav";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

type LayoutContextType = {
  fitToScreen: boolean;
};

export function useFitToScreen() {
  return useOutletContext<LayoutContextType>();
}

export function BubbleLayout() {
  const { settings } = useSettings();
  const fitToScreen = settings.fitToScreen;

  return (
    <div className="h-screen w-full min-w-[100vw] overflow-hidden bg-cream">
      <FloatingNav />
      <main
        className={cn(
          "h-full w-full pt-20 pb-4",
          fitToScreen
            ? "lg:overflow-hidden lg:flex lg:flex-col"
            : "overflow-auto"
        )}
      >
        <Outlet context={{ fitToScreen }} />
      </main>
    </div>
  );
}