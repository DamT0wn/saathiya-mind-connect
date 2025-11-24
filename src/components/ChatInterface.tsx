import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Heart, AlertCircle, Brain, Smile, Activity, BookOpen, Mic, MicOff, Settings, Trash2, ArrowUp, Volume2 } from "lucide-react";
import chatbotAvatar from "@/assets/chatbot-avatar.png";
import { useChatContext } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { ExercisePlayer } from "./ExercisePlayer";
import { AdvancedMoodTracker } from "./AdvancedMoodTracker";
import { ResourceLibrary } from "./ResourceLibrary";
import { MoodAnalytics } from "./MoodAnalytics";
import { AccessibilityPanel } from "./AccessibilityPanel";
import { responseGenerator } from "@/utils/responseGenerator";
import { detectLanguage } from "@/utils/languageDetection";
import { SupportedLanguage } from "@/types/chat";
import { getExerciseById, getRecommendedExercises } from "@/data/exercises";
import { analyzeSentiment, getSentimentLabel } from "@/utils/sentimentAnalysis";
import { detectCrisis } from '@/utils/crisisDetection';
import { voiceInput, textToSpeech, keyboardNav } from "@/utils/accessibility";
import { Message, MoodEntry } from "@/types/chat";
import { useNavigate } from 'react-router-dom';
// Inline CrisisSupportPopup component to avoid a missing-module error.
// This lightweight modal matches the usage in this file and can be
// replaced by a dedicated component file later if desired.
const CrisisSupportPopup = ({ onClose, onGotoCrisis }: { onClose: () => void; onGotoCrisis: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Crisis support dialog">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-background dark:bg-slate-800 rounded-lg shadow-lg z-10 max-w-md w-full p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-warning" />
          <h3 className="text-lg font-semibold">Crisis Support</h3>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          If you are in immediate danger or thinking of harming yourself, please contact local emergency services or use the helpline below.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          <strong>KIRAN: 1800-599-0019</strong>
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button onClick={onGotoCrisis}>Go to Crisis Support</Button>
        </div>
      </div>
    </div>
  );
};
interface ChatInterfaceProps {
  isFullScreen?: boolean;
}

export function ChatInterface({ isFullScreen = false }: ChatInterfaceProps) {
  const { state, addMessage, updateMood, setTyping, clearMessages } = useChatContext();
  const { currentUser } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [lastUserLanguage, setLastUserLanguage] = useState<SupportedLanguage>('en');
  const [isListening, setIsListening] = useState(false);
  const [showExercisePlayer, setShowExercisePlayer] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showResourceLibrary, setShowResourceLibrary] = useState(false);
  const [showMoodAnalytics, setShowMoodAnalytics] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [showCrisisPopup, setShowCrisisPopup] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load speech synthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoicesLoaded(true);
        }
      };

      // Voices might load asynchronously
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [state.messages]);

  // Detect scroll position to show/hide scroll-to-top button
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Show button if scrolled up more than 200px from bottom
      const isScrolledUp = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight > 200;
      setShowScrollTop(isScrolledUp);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll chat to top
  const scrollToTop = () => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Function to handle text-to-speech for a specific message
  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Remove emojis and special characters for cleaner speech
      const cleanText = text
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
        .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
        .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
        .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
        .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
        .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
        .replace(/[\u{1F200}-\u{1F251}]/gu, '') // Enclosed Ideographic Supplement
        .replace(/🙏|😰|📚|😔|😊|❤️|🇮🇳/g, '') // Common emojis
        .trim();
      
      // Don't speak if text is empty after removing emojis
      if (!cleanText) {
        console.log('No text to speak after removing emojis');
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find an Indian English voice first (best for Hindi-English mix)
      const preferredVoice = voices.find(voice => 
        // First priority: Indian English voices
        voice.lang === 'en-IN' || 
        voice.name.includes('Indian') ||
        voice.name.includes('Ravi') || // Microsoft Indian voice
        voice.name.includes('Heera') // Google Indian voice
      ) || voices.find(voice => 
        // Second priority: Hindi voices for better Hindi pronunciation
        voice.lang === 'hi-IN' || voice.name.includes('Hindi')
      ) || voices.find(voice => 
        // Third priority: Good quality female voices
        (voice.name.includes('Google') || voice.name.includes('Microsoft')) &&
        (voice.name.includes('Female') || voice.name.includes('Zira') || voice.name.includes('Aria'))
      ) || voices.find(voice =>
        // Fallback: Any en-US voice
        voice.lang === 'en-US'
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Using voice:', preferredVoice.name, preferredVoice.lang);
      }
      
      // Enhanced speech parameters for Indian accent and Hinglish
      utterance.lang = preferredVoice?.lang || 'en-IN'; // Prefer Indian English
      utterance.rate = 0.9; // Moderate speed for clarity in both languages
      utterance.pitch = 1.0; // Natural pitch for Indian accent
      utterance.volume = 1.0; // Full volume
      
      // Add error handling
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
      };
      
      // Optional: Log when speech starts
      utterance.onstart = () => {
        console.log('Speaking:', cleanText.substring(0, 50) + '...');
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech not supported in this browser');
    }
  };

  // Function to clear all chat messages
  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear all chat messages? This cannot be undone.')) {
      clearMessages();
      addMessage({
        content: "Hi! I'm Saathi, your mental wellness companion. How can I support you today?",
        sender: "bot",
        type: "text"
      });
    }
  };

  // Auto-scroll to chat container and focus on input when component mounts or when in full-screen
  useEffect(() => {
    if (isFullScreen || chatContainerRef.current) {
      // Scroll to chat container
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Focus on input after a short delay to ensure rendering is complete
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isFullScreen]);

  // Update response generator context
  useEffect(() => {
    responseGenerator.updateContext(state.messages, state.context);
  }, [state.messages, state.context]);

  const quickResponses = [
    { text: "I'm feeling anxious", mood: "anxious", emoji: "😰" },
    { text: "I'm stressed about studies", mood: "stressed", emoji: "📚" },
    { text: "Feeling lonely", mood: "lonely", emoji: "😔" },
    { text: "I'm doing okay", mood: "okay", emoji: "😊" },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Detect language of user input before storing message
    const detectedLang = detectLanguage(inputValue);
    setLastUserLanguage(detectedLang);

    // Add user message
    addMessage({
      content: inputValue,
      sender: "user",
      type: "text",
      language: detectedLang
    });

    const userInput = inputValue;
    setInputValue("");
    setTyping(true);

    // --- Crisis detection logic (runs when a new user message is sent) ---
    try {
      const existingUserMessages = state.messages.filter((m) => m.sender === 'user').length;
      const userMessageCountThisSession = existingUserMessages + 1; // include the one we just sent

      console.log('[ChatInterface] Running crisis detection for:', userInput);
      console.log('[ChatInterface] User message count:', userMessageCountThisSession);

      // Delegate to the centralized crisis detector util. It returns whether the popup
      // should be shown based on regex word-boundary matching, allowlist and severity.
      const detection = await detectCrisis(userInput, userMessageCountThisSession);
      console.log('[ChatInterface] Detection result:', detection);

      // Always show popup (or redirect for fail-safe) on every trigger; removed one-time session gating.
      if (detection.shouldShowPopup) {
        console.log('[ChatInterface] SHOWING CRISIS POPUP (multi-trigger enabled)');
        if (detection.reason === 'fail-safe') {
          // Use popup instead of auto navigation to keep consistent UX; comment line below to re-enable direct redirect.
          // navigate('/crisis-support'); return;
          setShowCrisisPopup(true);
          setTyping(false);
          return;
        }
        setShowCrisisPopup(true);
        setTyping(false);
        return;
      }
    } catch (e) {
      console.error('Error running crisis detection:', e);
    }

    try {
      // Generate intelligent response
      const response = await responseGenerator.generateResponse(userInput, lastUserLanguage);
      
      // Simulate typing delay
      setTimeout(() => {
        addMessage({
          content: response.response,
          sender: "bot",
          type: "text",
          sentiment: response.sentiment,
          language: lastUserLanguage,
          metadata: {
            followUpRequired: !!response.followUp,
            priority: response.riskLevel === 'critical' ? 'urgent' : 
                    response.riskLevel === 'high' ? 'high' : 'medium'
          }
        });

        // Add follow-up if available
        if (response.followUp) {
          setTimeout(() => {
            addMessage({
              content: response.followUp!,
              sender: "bot",
              type: "text",
              language: lastUserLanguage
            });
            setTyping(false);
          }, 1500);
        } else {
          setTyping(false);
        }

        // Suggest exercises if appropriate
        if (response.suggestedExercises && response.suggestedExercises.length > 0) {
          setTimeout(() => {
            addMessage({
              content: "I have some exercises that might help. Would you like to try one?",
              sender: "bot",
              type: "text",
              metadata: {
                exerciseId: response.suggestedExercises![0]
              }
            });
          }, 2000);
        }
      }, 1000 + Math.random() * 1000);

    } catch (error) {
      console.error('Error generating response:', error);
      setTyping(false);
      addMessage({
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        sender: "bot",
        type: "text"
      });
    }
  };

  const handleQuickResponse = async (response: typeof quickResponses[0]) => {
    addMessage({
      content: response.text,
      sender: "user",
      mood: response.mood,
      type: "text"
    });

    setTyping(true);

    try {
      const aiResponse = await responseGenerator.generateResponse(response.text);
      
      setTimeout(() => {
        addMessage({
          content: aiResponse.response,
          sender: "bot",
          type: "text",
          sentiment: aiResponse.sentiment
        });
        setTyping(false);
      }, 1200);
    } catch (error) {
      console.error('Error generating response:', error);
      setTyping(false);
    }
  };

  const handleStartExercise = (exerciseId: string) => {
    setCurrentExerciseId(exerciseId);
    setShowExercisePlayer(true);
  };

  const handleExerciseComplete = () => {
    addMessage({
      content: "Great job completing that exercise! How are you feeling now?",
      sender: "bot",
      type: "text"
    });
    setShowExercisePlayer(false);
    setCurrentExerciseId(null);
  };

  const handleMoodSave = (moodEntry: Omit<MoodEntry, 'id'>) => {
    updateMood(moodEntry);
    addMessage({
      content: `Thank you for sharing how you're feeling. I can see you're feeling ${moodEntry.primary} with an intensity of ${moodEntry.intensity}/10. ${moodEntry.intensity > 7 ? "That seems quite intense. " : ""}How can I best support you right now?`,
      sender: "bot",
      type: "check-in"
    });
  };

  const toggleVoiceInput = async () => {
    if (isListening) {
      // Stop listening
      voiceInput.stopListening();
      setIsListening(false);
      return;
    }

    // Check if voice input is supported
    if (!voiceInput.isSupported()) {
      alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari for voice features.');
      return;
    }

    // Start listening
    setIsListening(true);
    
    await voiceInput.startListening(
      (text) => {
        // Update input value with transcribed text
        setInputValue(text);
        console.log('Transcribed text:', text);
      },
      (error) => {
        console.error('Voice input error:', error);
        setIsListening(false);
        
        // Show user-friendly error message (but not for user-initiated stops)
        if (error.includes('permission')) {
          alert('Microphone access is required for voice input. Please allow microphone permissions in your browser settings and try again.');
        } else if (error.includes('not supported')) {
          alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
        } else if (!error.includes('aborted') && !error.includes('No speech')) {
          // Don't show alerts for aborted or no speech errors
          alert(error);
        }
      }
    );
    
    // Monitor recognition status and update UI accordingly
    const checkRecognitionStatus = setInterval(() => {
      if (!voiceInput.getIsListening() && isListening) {
        setIsListening(false);
        clearInterval(checkRecognitionStatus);
      }
    }, 100);
    
    // Auto-stop after 30 seconds max to prevent infinite listening
    setTimeout(() => {
      clearInterval(checkRecognitionStatus);
      if (isListening && voiceInput.getIsListening()) {
        voiceInput.stopListening();
        setIsListening(false);
      }
    }, 30000);
  };

  // Setup keyboard navigation
  useEffect(() => {
    const container = document.querySelector('.chat-container');
    if (container) {
      keyboardNav.setupKeyboardNavigation(container as HTMLElement);
    }
  }, []);

  // Show accessibility panel
  if (showAccessibilityPanel) {
    return (
      <AccessibilityPanel
        onClose={() => setShowAccessibilityPanel(false)}
      />
    );
  }

  // Show exercise player if one is active
  if (showExercisePlayer && currentExerciseId) {
    const exercise = getExerciseById(currentExerciseId);
    if (exercise) {
      return (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <ExercisePlayer
                exercise={exercise}
                onComplete={handleExerciseComplete}
                onExit={() => {
                  setShowExercisePlayer(false);
                  setCurrentExerciseId(null);
                }}
              />
            </div>
          </div>
        </section>
      );
    }
  }

  // Show mood tracker
  if (showMoodTracker) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AdvancedMoodTracker
              onSave={handleMoodSave}
              onClose={() => setShowMoodTracker(false)}
            />
          </div>
        </div>
      </section>
    );
  }

  // Show resource library
  if (showResourceLibrary) {
    return (
      <ResourceLibrary
        onClose={() => setShowResourceLibrary(false)}
        userMood={state.context.currentMood.primary}
        userTopics={state.context.conversationTopics}
      />
    );
  }

  // Show mood analytics
  if (showMoodAnalytics) {
    return (
      <MoodAnalytics
        onClose={() => setShowMoodAnalytics(false)}
      />
    );
  }

  return (
    <section className={isFullScreen ? "h-full bg-background" : "py-20 bg-background"} ref={chatContainerRef}>
      {/* Crisis support modal (renders on top when triggered) */}
      {showCrisisPopup && (
        <CrisisSupportPopup
          onClose={() => setShowCrisisPopup(false)}
          onGotoCrisis={() => {
            setShowCrisisPopup(false);
            navigate('/crisis-support');
          }}
        />
      )}
      <div className={isFullScreen ? "container mx-auto px-4 h-full" : "container mx-auto px-4"}>
        {!isFullScreen && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Wellness Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience our AI companion that understands, listens, and provides personalized support
            </p>
          </div>
        )}

        <div className={isFullScreen ? "max-w-4xl mx-auto chat-container h-full" : "max-w-4xl mx-auto chat-container"}
             role="application" 
             aria-label="Mental health chatbot interface"
        >
          <Card className={`shadow-wellness border-0 overflow-hidden ${isFullScreen ? 'h-full flex flex-col' : ''}`}>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gradient-to-r from-primary to-wellness-calm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={chatbotAvatar} 
                      alt="Saathi AI" 
                      className="w-10 h-10 rounded-full ring-2 ring-white/50"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Saathi AI</h3>
                    <p className="text-sm text-white/80">Your wellness companion • Online</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Clear Chat Button */}
                  <Button
                    onClick={handleClearChat}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    aria-label="Clear chat history"
                    title="Clear Chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* Accessibility Button */}
                  <Button
                    onClick={() => setShowAccessibilityPanel(true)}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    aria-label="Open accessibility settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="p-3 bg-warning/10 border-l-4 border-warning">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <p className="text-sm text-warning-foreground">
                  If you're in crisis, please call <strong>KIRAN: 1800-599-0019</strong> immediately
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea 
              className={`p-4 ${isFullScreen ? 'flex-1 min-h-0' : 'h-96'} relative`} 
              ref={scrollAreaRef}
            >
              {/* Scroll to Top Button */}
              {showScrollTop && (
                <Button
                  onClick={scrollToTop}
                  size="icon"
                  className="absolute top-4 right-4 z-10 rounded-full shadow-lg"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              )}

              <div className="space-y-4">
                {state.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                      <div className="flex-shrink-0">
                        {message.sender === "bot" ? (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                            {currentUser?.photoURL ? (
                              <img 
                                src={currentUser.photoURL} 
                                alt={currentUser.displayName || "User"}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <User className="w-4 h-4 text-white" />
                            )}
                          </div>
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <p className="text-sm flex-1">{message.content}</p>
                          
                          {/* Text-to-Speech Button for Bot Messages */}
                          {message.sender === "bot" && (
                            <Button
                              onClick={() => handleTextToSpeech(message.content)}
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0 hover:bg-primary/10 flex-shrink-0"
                              aria-label="Read message aloud"
                              title="Read aloud"
                            >
                              <Volume2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        {/* Show sentiment info for user messages */}
                        {message.sender === "user" && message.sentiment && (
                          <div className="mt-1 flex gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {getSentimentLabel(message.sentiment.score)}
                            </Badge>
                          </div>
                        )}

                        {/* Show exercise button if suggested */}
                        {message.sender === "bot" && message.metadata?.exerciseId && (
                          <div className="mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartExercise(message.metadata!.exerciseId!)}
                              className="text-xs"
                            >
                              <Activity className="h-3 w-3 mr-1" />
                              Try Exercise
                            </Button>
                          </div>
                        )}

                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {state.isTyping && (
                  <div className="flex justify-start">
                    <div className="flex space-x-2 max-w-xs lg:max-w-md">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="rounded-2xl px-4 py-2 bg-muted text-muted-foreground">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Response Buttons */}
            <div className="p-4 border-t bg-muted/30">
              {/* Action Buttons */}
              <div className="mb-3 flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMoodTracker(true)}
                  className="text-xs"
                >
                  <Smile className="h-3 w-3 mr-1" />
                  Mood Check-in
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStartExercise('breathing-478')}
                  className="text-xs"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  Quick Exercise
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResourceLibrary(true)}
                  className="text-xs"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Resources
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMoodAnalytics(true)}
                  className="text-xs"
                >
                  <Brain className="h-3 w-3 mr-1" />
                  Analytics
                </Button>
              </div>

              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-2">Quick responses:</p>
                <div className="flex flex-wrap gap-2">
                  {quickResponses.map((response, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickResponse(response)}
                      className="text-xs"
                    >
                      <span className="mr-1">{response.emoji}</span>
                      {response.text}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Button
                  onClick={toggleVoiceInput}
                  variant={isListening ? "default" : "outline"}
                  size="icon"
                  className={`shrink-0 ${isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}`}
                  disabled={!voiceInput.isSupported()}
                  aria-label={isListening ? "Stop voice input - Click to stop recording" : "Start voice input - Click to record"}
                  title={isListening ? "Recording... Click to stop" : "Click to start voice input"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  ref={inputRef}
                  placeholder={isListening ? "Listening... Speak now" : "Type your message... (English / हिन्दी / ಕನ್ನಡ / தமிழ்)"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 rounded-full"
                  disabled={state.isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  variant="chat"
                  size="chat"
                  disabled={!inputValue.trim() || state.isTyping}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Voice Input Helper */}
              {voiceInput.isSupported() && (
                <div className="mt-2 text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Mic className="h-3 w-3" />
                  <span>Voice input supported in English & Hindi - Click the mic to speak</span>
                </div>
              )}

              {/* Context Info */}
              {state.context.currentMood.primary !== 'neutral' && (
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  Current mood: {state.context.currentMood.primary} ({state.context.currentMood.intensity}/10)
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}