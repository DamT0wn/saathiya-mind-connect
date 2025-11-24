import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';

type Props = {
  onClose: () => void;
  onGotoCrisis: () => void;
};

/**
 * CrisisSupportPopup
 * A simple modal popup that shows a safety notice when the app detects crisis language
 * or prolonged conversation. Designed to be shown once per session (sessionStorage flag).
 *
 * Props:
 * - onClose: close the popup and continue chatting
 * - onGotoCrisis: redirect user to the crisis support page
 */
export default function CrisisSupportPopup({ onClose, onGotoCrisis }: Props) {
  // Close on ESC for accessibility
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl mx-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">You're not alone — we can help</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                I'm here to listen, but I'm not a substitute for a trained mental health professional.
                If you're feeling unsafe or overwhelmed, it's important to speak with a real person who can help.
              </p>

              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                You can continue chatting with me, or be taken to our Crisis Support page where you will
                find immediate helplines and resources.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Continue chatting
                </Button>

                <Button
                  onClick={onGotoCrisis}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  Go to crisis support
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
