import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Shield, Users } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { useNavigate, useLocation } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleStartChat = () => {
    // If a floating chat button is present, trigger it. Otherwise navigate to the ai chat page.
    const chatButton = document.querySelector('[data-floating-chat]');
    if (chatButton) {
      (chatButton as HTMLElement).click();
      return;
    }
    navigate('/ai-chat');
  };

  const handleLearnMore = () => {
    const scrollToFeatures = () => {
      const el = document.getElementById('features');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    if (location.pathname !== '/') {
      navigate('/');
      // wait briefly for the home content to render, then scroll
      setTimeout(scrollToFeatures, 150);
    } else {
      scrollToFeatures();
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-gradient opacity-90" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-8 animate-fade-up">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white text-balance leading-tight">
              Aapka Saathi<br />
              <span className="text-wellness-calm">Aapke Saath</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-balance px-4">
              India's first AI-powered mental wellness companion designed for young minds. 
              Safe, confidential, and culturally-tuned support whenever you need it.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button variant="hero" size="xl" className="animate-scale-in w-full sm:w-auto" onClick={handleStartChat}>
              <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Start Chatting Now
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white hover:animate-scale-in w-full sm:w-auto"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-12 sm:mt-16 max-w-4xl mx-auto px-4">
            <Card className="p-3 sm:p-4 md:p-6 card-gradient border-0 text-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-primary" />
              <h3 className="text-sm sm:text-base font-semibold text-card-foreground">100% Private</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">End-to-end encrypted</p>
            </Card>
            
            <Card className="p-3 sm:p-4 md:p-6 card-gradient border-0 text-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-success" />
              <h3 className="text-sm sm:text-base font-semibold text-card-foreground">24/7 Support</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Always here for you</p>
            </Card>
            
            <Card className="p-3 sm:p-4 md:p-6 card-gradient border-0 text-center animate-fade-up" style={{ animationDelay: "0.6s" }}>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-accent" />
              <h3 className="text-sm sm:text-base font-semibold text-card-foreground">Youth-Focused</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Built for ages 14-25</p>
            </Card>
            
            <Card className="p-3 sm:p-4 md:p-6 card-gradient border-0 text-center animate-fade-up" style={{ animationDelay: "0.8s" }}>
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-wellness-calm" />
              <h3 className="text-sm sm:text-base font-semibold text-card-foreground">Culturally Aware</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Understands Indian context</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}