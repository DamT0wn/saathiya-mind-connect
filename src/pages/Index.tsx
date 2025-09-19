import { HeroSection } from "@/components/HeroSection";
import { ChatInterface } from "@/components/ChatInterface";
import { MoodTracker } from "@/components/MoodTracker";
import { Features } from "@/components/Features";
import { PrivacySection } from "@/components/PrivacySection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ChatInterface />
      <MoodTracker />
      <Features />
      <PrivacySection />
      <Footer />
    </div>
  );
};

export default Index;
