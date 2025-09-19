import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Heart, AlertCircle } from "lucide-react";
import chatbotAvatar from "@/assets/chatbot-avatar.png";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  mood?: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Namaste! I'm your Saathiya 🙏 I'm here to listen and support you. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickResponses = [
    { text: "I'm feeling anxious", mood: "anxious", emoji: "😰" },
    { text: "I'm stressed about studies", mood: "stressed", emoji: "📚" },
    { text: "Feeling lonely", mood: "lonely", emoji: "😔" },
    { text: "I'm doing okay", mood: "okay", emoji: "😊" },
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for sharing that with me. I understand how you're feeling. Let's work through this together. Would you like to try a quick breathing exercise, or would you prefer to talk more about what's on your mind?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickResponse = (response: typeof quickResponses[0]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: response.text,
      sender: "user",
      timestamp: new Date(),
      mood: response.mood,
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate contextual bot response
    setTimeout(() => {
      let botContent = "";
      switch (response.mood) {
        case "anxious":
          botContent = "I hear that you're feeling anxious. That's completely normal and you're brave for reaching out. Let's try the 4-7-8 breathing technique together. Would you like me to guide you through it?";
          break;
        case "stressed":
          botContent = "Study stress is something many students face. You're not alone in this. Let's break down what's causing the stress and find some practical ways to manage it. What subject or exam is worrying you the most?";
          break;
        case "lonely":
          botContent = "Feeling lonely can be really tough. I want you to know that your feelings are valid and I'm here with you right now. Sometimes loneliness is our mind's way of telling us we need connection. Would you like to talk about what's making you feel this way?";
          break;
        default:
          botContent = "That's wonderful to hear! It's great that you're checking in with yourself. Even on okay days, it's important to nurture our mental health. Is there anything specific you'd like to work on or learn about today?";
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: botContent,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1200);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Wellness Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience our AI companion that understands, listens, and provides personalized support
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-wellness border-0 overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b bg-gradient-to-r from-primary to-wellness-calm">
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
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
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
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Response Buttons */}
            <div className="p-4 border-t bg-muted/30">
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
                <Input
                  placeholder="Type your message... (Hindi/English welcome)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 rounded-full"
                />
                <Button
                  onClick={handleSendMessage}
                  variant="chat"
                  size="chat"
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}