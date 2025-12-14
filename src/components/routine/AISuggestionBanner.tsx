import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AISuggestionBannerProps {
  suggestion: string;
  onApply: () => void;
}

export function AISuggestionBanner({ suggestion, onApply }: AISuggestionBannerProps) {
  return (
    <div className="bg-[#b8e8e8] rounded-2xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-[#7dd3d3] flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-5 h-5 text-[#1a5555]" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-[#1a4444]">AI Suggestion</h4>
        <p className="text-sm text-[#2a5555]">{suggestion}</p>
      </div>
      <Button 
        onClick={onApply}
        variant="outline" 
        className="rounded-full px-6 bg-card border-[#7dd3d3] text-[#1a5555] hover:bg-[#7dd3d3]/20"
      >
        Apply
      </Button>
    </div>
  );
}
