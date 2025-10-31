import { useChatContext } from '@/contexts/ChatContext';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AdvancedMoodTracker } from './AdvancedMoodTracker';
import { MoodEntry } from '@/types/chat';

interface MoodCheckInDialogProps {
  open: boolean;
  onComplete: (mood: string) => void;
  onSkip?: () => void;
}

export function MoodCheckInDialog({ open, onComplete, onSkip }: MoodCheckInDialogProps) {
  const { updateMood } = useChatContext();

  const handleSave = (moodEntry: Omit<MoodEntry, 'id'>) => {
    // Save to ChatContext (Mood Analytics database)
    updateMood(moodEntry);

    // Also save to localStorage for quick access
    const moodData = {
      mood: moodEntry.primary,
      intensity: moodEntry.intensity,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('lastMoodCheckIn', JSON.stringify(moodData));
    localStorage.setItem('hasCompletedMoodCheckIn', 'true');
    
    // Complete the onboarding
    onComplete(moodEntry.primary);
  };

  const handleClose = () => {
    // User skipped mood check-in
    if (onSkip) {
      onSkip();
    } else {
      // Mark as completed even if skipped
      localStorage.setItem('hasCompletedMoodCheckIn', 'true');
      onComplete('skipped');
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-3xl max-w-[98vw] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0 mx-2 sm:mx-auto"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        aria-describedby="mood-checkin-description"
      >
        {/* Close Button */}
        <div className="sticky top-0 z-10 bg-background/98 backdrop-blur-sm border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Mood Check-In</h2>
            <p id="mood-checkin-description" className="text-xs sm:text-sm text-muted-foreground">
              Help us understand how you're feeling (optional)
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full hover:bg-muted shrink-0"
            aria-label="Skip mood check-in"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Mood Tracker Form */}
        <div className="px-2 sm:px-6 pb-4 sm:pb-6">
          <AdvancedMoodTracker onSave={handleSave} onClose={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
