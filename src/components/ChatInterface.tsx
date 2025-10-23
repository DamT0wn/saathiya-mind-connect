import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Heart, AlertCircle, Brain, Smile, Activity, BookOpen, Mic, MicOff, Settings } from "lucide-react";
import chatbotAvatar from "@/assets/chatbot-avatar.png";
import { useChatContext } from "@/contexts/ChatContext";
import { ExercisePlayer } from "./ExercisePlayer";
import { AdvancedMoodTracker } from "./AdvancedMoodTracker";
import { ResourceLibrary } from "./ResourceLibrary";
import { MoodAnalytics } from "./MoodAnalytics";
import { AccessibilityPanel } from "./AccessibilityPanel";
import { responseGenerator } from "@/utils/responseGenerator";
import { getExerciseById, getRecommendedExercises } from "@/data/exercises";
import { analyzeSentiment, getSentimentLabel } from "@/utils/sentimentAnalysis";
import { voiceInput, textToSpeech, keyboardNav } from "@/utils/accessibility";
import { Message, MoodEntry } from "@/types/chat";

interface ChatInterfaceProps {
  isFullScreen?: boolean;
}

export function ChatInterface({ isFullScreen = false }: ChatInterfaceProps) {
  const { state, addMessage, updateMood, setTyping } = useChatContext();
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showExercisePlayer, setShowExercisePlayer] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showResourceLibrary, setShowResourceLibrary] = useState(false);
  const [showMoodAnalytics, setShowMoodAnalytics] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [state.messages]);

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

    // Add user message
    addMessage({
      content: inputValue,
      sender: "user",
      type: "text"
    });

    const userInput = inputValue;
    setInputValue("");
    setTyping(true);

    try {
      // Generate intelligent response
      const response = await responseGenerator.generateResponse(userInput);
      
      // Simulate typing delay
      setTimeout(() => {
        addMessage({
          content: response.response,
          sender: "bot",
          type: "text",
          sentiment: response.sentiment,
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
              type: "text"
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

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    
    if (!isListening && voiceInput.isSupported()) {
      voiceInput.startListening(
        (text) => {
          setInputValue(text);
          setIsListening(false);
        },
        (error) => {
          console.error('Voice input error:', error);
          setIsListening(false);
        }
      );
    } else {
      voiceInput.stopListening();
    }
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
                      alt="Saathiya AI" 
                      className="w-10 h-10 rounded-full ring-2 ring-white/50"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Saathiya AI</h3>
                    <p className="text-sm text-white/80">Your wellness companion • Online</p>
                  </div>
                </div>
                
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
              className={`p-4 ${isFullScreen ? 'flex-1 min-h-0' : 'h-96'}`} 
              ref={scrollAreaRef}
            >
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
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
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
                        <p className="text-sm">{message.content}</p>
                        
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
                  className="shrink-0"
                  disabled={!voiceInput.isSupported()}
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  placeholder="Type your message... (Hindi/English welcome)"
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
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

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