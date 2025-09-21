// TypeScript declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Voice input functionality
export class VoiceInputManager {
  private recognition: any | null = null;
  private isListening = false;
  private onResult: ((text: string) => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  constructor() {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US'; // Can be changed to 'hi-IN' for Hindi

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      if (this.onResult) {
        this.onResult(result);
      }
    };

    this.recognition.onerror = (event) => {
      if (this.onError) {
        this.onError(event.error);
      }
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  public startListening(onResult: (text: string) => void, onError?: (error: string) => void) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported');
      return;
    }

    this.onResult = onResult;
    this.onError = onError;

    try {
      this.recognition.start();
    } catch (error) {
      if (onError) onError('Failed to start speech recognition');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// Text-to-speech functionality
export class TextToSpeechManager {
  private synthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices() {
    const voices = this.synthesis.getVoices();
    // Prefer English voice, fallback to first available
    this.voice = voices.find(voice => voice.lang.startsWith('en')) || voices[0] || null;
    
    // If voices aren't loaded yet, wait for them
    if (voices.length === 0) {
      this.synthesis.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });
    }
  }

  public speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }) {
    if (!this.synthesis) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.voice) {
      utterance.voice = this.voice;
    }
    
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;

    this.synthesis.speak(utterance);
  }

  public stop() {
    this.synthesis.cancel();
  }

  public isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

// Keyboard navigation helper
export class KeyboardNavigationManager {
  private focusableElements: string = 
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  public setupKeyboardNavigation(container: HTMLElement) {
    container.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    const { key, target } = event;
    
    // Handle Enter key on buttons and clickable elements
    if (key === 'Enter' && target instanceof HTMLElement) {
      if (target.role === 'button' || target.tagName === 'BUTTON') {
        target.click();
        event.preventDefault();
      }
    }

    // Handle Escape key to close modals/dialogs
    if (key === 'Escape') {
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        const closeButton = modal.querySelector('[aria-label="Close"]') as HTMLElement;
        closeButton?.click();
      }
    }

    // Handle Tab navigation
    if (key === 'Tab') {
      this.handleTabNavigation(event);
    }
  }

  private handleTabNavigation(event: KeyboardEvent) {
    const modal = document.querySelector('[role="dialog"]');
    if (!modal) return;

    const focusableEls = modal.querySelectorAll(this.focusableElements);
    const firstFocusableEl = focusableEls[0] as HTMLElement;
    const lastFocusableEl = focusableEls[focusableEls.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        event.preventDefault();
      }
    }
  }

  public announceToScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// High contrast mode toggle
export class AccessibilityManager {
  private highContrastEnabled = false;

  constructor() {
    this.loadPreferences();
  }

  public toggleHighContrast() {
    this.highContrastEnabled = !this.highContrastEnabled;
    this.applyHighContrast();
    this.savePreferences();
  }

  private applyHighContrast() {
    if (this.highContrastEnabled) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }

  public increaseFontSize() {
    const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${Math.min(currentSize + 2, 24)}px`;
  }

  public decreaseFontSize() {
    const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${Math.max(currentSize - 2, 12)}px`;
  }

  public resetFontSize() {
    document.documentElement.style.fontSize = '16px';
  }

  private savePreferences() {
    localStorage.setItem('accessibility-preferences', JSON.stringify({
      highContrast: this.highContrastEnabled
    }));
  }

  private loadPreferences() {
    const saved = localStorage.getItem('accessibility-preferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      this.highContrastEnabled = preferences.highContrast || false;
      this.applyHighContrast();
    }
  }
}

// Export singleton instances
export const voiceInput = new VoiceInputManager();
export const textToSpeech = new TextToSpeechManager();
export const keyboardNav = new KeyboardNavigationManager();
export const accessibility = new AccessibilityManager();