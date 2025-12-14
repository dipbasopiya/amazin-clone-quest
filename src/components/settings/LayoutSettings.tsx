import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Monitor } from "lucide-react";

interface LayoutSettingsProps {
  fitToScreen: boolean;
  onFitToScreenToggle: () => void;
}

export function LayoutSettings({ fitToScreen, onFitToScreenToggle }: LayoutSettingsProps) {
  return (
    <Card className="bg-charcoal border-charcoal">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Layout
        </CardTitle>
        <CardDescription className="text-white/60">
          Customize how pages are displayed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-medium text-white text-sm">Fit pages to screen (No scrolling)</p>
            <p className="text-xs text-white/50">
              Optimizes layout to fit all content within the screen on desktop devices.
            </p>
          </div>
          <Switch
            checked={fitToScreen}
            onCheckedChange={onFitToScreenToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
}
