import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Heart, ExternalLink } from 'lucide-react';

interface WelcomeDialogProps {
  open: boolean;
  onAccept: () => void;
}

export function WelcomeDialog({ open, onAccept }: WelcomeDialogProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Reset checkbox when dialog opens
  useEffect(() => {
    if (open) {
      setAgreedToTerms(false);
    }
  }, [open]);

  const handleContinue = () => {
    if (agreedToTerms) {
      onAccept();
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Enter' && agreedToTerms) {
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, agreedToTerms]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-[500px] max-w-[95vw] mx-4"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        aria-describedby="welcome-description"
      >
        <DialogHeader>
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-wellness-calm rounded-full">
              <Heart className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl text-center px-2">
            Welcome to Saathi Mind Connect! 🎉
          </DialogTitle>
          <DialogDescription id="welcome-description" className="text-center text-sm sm:text-base space-y-3 sm:space-y-4 pt-3 sm:pt-4 px-2">
            <div className="flex items-start space-x-2 sm:space-x-3 text-left">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm sm:text-base">
                Your mental health journey is completely <strong>private and secure</strong>. 
                All your conversations are confidential and protected.
              </p>
            </div>
            <div className="bg-muted p-3 sm:p-4 rounded-lg text-left">
              <p className="text-xs sm:text-sm text-muted-foreground">
                We care about your privacy. Your data is encrypted and never shared 
                with third parties. You're in a safe space.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4 px-2">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-1"
              aria-label="Agree to terms and conditions"
            />
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm leading-relaxed cursor-pointer select-none"
            >
              I agree to the{' '}
              <a
                href="/privacy-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
                <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </a>{' '}
              and{' '}
              <a
                href="/terms-of-service.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                Terms & Conditions
                <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </a>
            </label>
          </div>
        </div>

        <DialogFooter className="px-2">
          <Button
            onClick={handleContinue}
            disabled={!agreedToTerms}
            className="w-full bg-gradient-to-r from-primary to-wellness-calm text-sm sm:text-base"
            size="lg"
            aria-label="Continue to application"
          >
            Continue to Saathi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
