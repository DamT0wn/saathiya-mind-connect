import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Footer } from "@/components/Footer";

const Settings = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSectionClick = (sectionId: string) => {
    // Handle navigation if needed
    console.log('Navigate to:', sectionId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSectionClick={handleSectionClick} />
      <div className="pt-8 pb-16">
        <SettingsPanel />
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
