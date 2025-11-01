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
  private language: string = 'en-IN'; // Default to Indian English
  private silenceTimer: NodeJS.Timeout | null = null;
  private finalTranscript: string = '';

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

    this.recognition.continuous = true; // Enable continuous listening
    this.recognition.interimResults = true; // Show interim results for better UX
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.language;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.finalTranscript = '';
      console.log('Voice recognition started');
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Clear existing silence timer
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
      }

      // Show interim or accumulated final transcript
      const result = (this.finalTranscript + interimTranscript).trim();
      if (this.onResult && result) {
        this.onResult(result);
      }

      // If we have a final result, set a timer to auto-stop after silence
      if (this.finalTranscript.trim()) {
        this.silenceTimer = setTimeout(() => {
          console.log('Silence detected, stopping recognition');
          this.stopListening();
        }, 1500); // Stop after 1.5 seconds of silence
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      
      // Don't show error for no-speech if we already have some transcript
      if (event.error === 'no-speech') {
        console.log('No speech detected, stopping gracefully');
        this.stopListening();
        return;
      }
      
      let errorMessage = 'Voice recognition error';
      switch (event.error) {
        case 'audio-capture':
          errorMessage = 'Microphone not found. Please check your device settings.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'aborted':
          // Don't show error for aborted, it's usually user-initiated
          console.log('Voice recognition aborted');
          this.isListening = false;
          return;
        default:
          errorMessage = `Voice recognition error: ${event.error}`;
      }
      
      if (this.onError) {
        this.onError(errorMessage);
      }
      this.isListening = false;
    };

    this.recognition.onspeechend = () => {
      console.log('Speech ended');
      // Recognition will stop automatically after speech ends
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
      
      // Clear any remaining silence timer
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
    };
  }

  public setLanguage(lang: 'en-IN' | 'hi-IN' | 'en-US') {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public async requestPermission(): Promise<boolean> {
    try {
      // Check if navigator.mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia not supported');
        return false;
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop the stream immediately as we only needed permission
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  public async startListening(onResult: (text: string) => void, onError?: (error: string) => void) {
    if (!this.recognition) {
      const errorMsg = 'Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.';
      if (onError) onError(errorMsg);
      return;
    }

    // Request permission first
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      const errorMsg = 'Microphone access denied. Please allow microphone permissions in your browser settings.';
      if (onError) onError(errorMsg);
      return;
    }

    this.onResult = onResult;
    this.onError = onError;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      if (onError) onError('Failed to start voice recognition. Please try again.');
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

  public getSupportedLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'en-IN', name: 'English (India)' },
      { code: 'hi-IN', name: 'Hindi (India)' },
      { code: 'en-US', name: 'English (US)' }
    ];
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