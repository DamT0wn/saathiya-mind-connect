import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { MoodTracker } from "@/components/MoodTracker";
import { Features } from "@/components/Features";
import { PrivacySection } from "@/components/PrivacySection";
import { Footer } from "@/components/Footer";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { MoodCheckInDialog } from "@/components/MoodCheckInDialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // User just signed in - check if they've seen welcome dialog
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      const hasCompletedMoodCheckIn = localStorage.getItem('hasCompletedMoodCheckIn');
      
      if (!hasSeenWelcome) {
        setShowWelcomeDialog(true);
      } else if (!hasCompletedMoodCheckIn) {
        setShowMoodCheckIn(true);
      }
    }
  }, [currentUser]);

  const handleWelcomeAccept = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcomeDialog(false);
    // Show mood check-in after welcome
    setShowMoodCheckIn(true);
  };

  const handleMoodComplete = (mood: string) => {
    localStorage.setItem('hasCompletedMoodCheckIn', 'true');
    setShowMoodCheckIn(false);
    console.log('User mood:', mood);
  };

  const handleMoodSkip = () => {
    localStorage.setItem('hasCompletedMoodCheckIn', 'true');
    setShowMoodCheckIn(false);
    console.log('User skipped mood check-in');
  };

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartChatting = () => {
    navigate('/ai-chat');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSectionClick={handleSectionClick} />
      <HeroSection />
      <MoodTracker />
      <Features />
      <PrivacySection />
      
      {/* Direct Start Chatting Button - Fixed Position */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <Button
          onClick={handleStartChatting}
          size="lg"
          className="h-14 sm:h-16 px-6 sm:px-8 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-wellness-calm hover:scale-110 text-base sm:text-lg font-semibold"
        >
          <MessageCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
          <span className="hidden xs:inline">Start Chatting</span>
          <span className="xs:hidden">Chat</span>
        </Button>
      </div>

      <Footer />
      
      {/* Welcome and Mood Check-In Dialogs */}
      <WelcomeDialog open={showWelcomeDialog} onAccept={handleWelcomeAccept} />
      <MoodCheckInDialog 
        open={showMoodCheckIn} 
        onComplete={handleMoodComplete}
        onSkip={handleMoodSkip}
      />
    </div>
  );
};

export default Index;
