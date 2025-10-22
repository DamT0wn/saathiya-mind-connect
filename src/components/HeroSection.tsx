import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Shield, Users } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export function HeroSection() {
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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-balance">
              Aapka Saathi<br />
              <span className="text-wellness-calm">Aapke Saath</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-balance">
              India's first AI-powered mental wellness companion designed for young minds. 
              Safe, confidential, and culturally-tuned support whenever you need it.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl" className="animate-scale-in">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Chatting Now
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              Learn More
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <Card className="p-6 card-gradient border-0 text-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Shield className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-card-foreground">100% Private</h3>
              <p className="text-sm text-muted-foreground">End-to-end encrypted</p>
            </Card>
            
            <Card className="p-6 card-gradient border-0 text-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <Heart className="h-8 w-8 mx-auto mb-3 text-success" />
              <h3 className="font-semibold text-card-foreground">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Always here for you</p>
            </Card>
            
            <Card className="p-6 card-gradient border-0 text-center animate-fade-up" style={{ animationDelay: "0.6s" }}>
              <Users className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-card-foreground">Youth-Focused</h3>
              <p className="text-sm text-muted-foreground">Built for ages 14-25</p>
            </Card>
            
            <Card className="p-6 card-gradient border-0 text-center animate-fade-up" style={{ animationDelay: "0.8s" }}>
              <MessageCircle className="h-8 w-8 mx-auto mb-3 text-wellness-calm" />
              <h3 className="font-semibold text-card-foreground">Culturally Aware</h3>
              <p className="text-sm text-muted-foreground">Understands Indian context</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}