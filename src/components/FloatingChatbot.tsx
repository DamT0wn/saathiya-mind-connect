import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Maximize2, 
  Minimize2, 
  Bot,
  Sparkles
} from 'lucide-react';
import chatbotAvatar from '@/assets/chatbot-avatar.png';

interface FloatingChatbotProps {
  onMaximize?: () => void;
}

export function FloatingChatbot({ onMaximize }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleStartChat = () => {
    // Navigate to the AI chat page
    navigate('/ai-chat');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-3 z-40">
      {/* Floating Chat Button (when closed) */}
      {!isOpen && (
        <div className="relative">
          <Button
            data-floating-chat
            onClick={handleToggle}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-wellness-calm hover:scale-110"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1">
            <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
              <Sparkles className="h-3 w-3" />
            </Badge>
          </div>
          
          {/* Welcome tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              Hi! I'm Saathi. Click to start chatting! 
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 shadow-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Mini Chat Header */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary to-wellness-calm">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <img 
                  src={chatbotAvatar} 
                  alt="Saathi AI" 
                  className="w-7 h-7 rounded-full"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Saathi AI</h4>
                <p className="text-xs text-white/80">Online now</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                onClick={handleStartChat}
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Quick Start Options */}
          <div className="p-4 space-y-3">
            <div className="text-center">
              <Bot className="h-8 w-8 mx-auto text-primary mb-2" />
              <h3 className="font-medium text-sm mb-1">Welcome to Saathi!</h3>
              <p className="text-xs text-muted-foreground">
                Your AI companion for mental wellness
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleStartChat}
                className="w-full text-sm bg-gradient-to-r from-primary to-wellness-calm"
              >
                Start Chatting
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={handleStartChat}
                >
                  Mood Check
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={handleStartChat}
                >
                  Quick Help
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Crisis? Call <strong>1800-599-0019</strong>
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}