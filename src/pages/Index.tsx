import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { MoodTracker } from "@/components/MoodTracker";
import { Features } from "@/components/Features";
import { PrivacySection } from "@/components/PrivacySection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSectionClick={handleSectionClick} />
      <HeroSection />
      <MoodTracker />
      <Features />
      <PrivacySection />
      <Footer />
      <FloatingChatbot />
    </div>
  );
};

export default Index;
