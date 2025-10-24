import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Brain, 
  AlertCircle, 
  Users, 
  BookOpen,
  Sparkles,
  Lock,
  Clock
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Floating Chatbot",
    description: "AI-powered companion accessible from anywhere on the site with instant support and guidance. Click the chat button to start your wellness journey.",
    badge: "Available Now",
    color: "bg-primary",
    status: "available",
    route: null
  },
  {
    icon: Brain,
    title: "AI Empathy Engine",
    description: "Advanced sentiment analysis that understands emotions and provides personalized, empathetic responses in Hindi and English.",
    badge: "Available Now",
    color: "bg-wellness-energy", 
    status: "available",
    route: "/ai-chat"
  },
  {
    icon: AlertCircle,
    title: "Crisis Support",
    description: "24/7 emergency detection with immediate access to professional helplines (KIRAN: 1800-599-0019) and crisis intervention.",
    badge: "Available Now",
    color: "bg-destructive",
    status: "available",
    route: "/crisis-support"
  },
  {
    icon: BookOpen,
    title: "Micro-Learning & Skills",
    description: "Bite-sized mental health education, coping strategies, and skill-building exercises tailored for Indian youth.",

    route: "/resources"
  },
  {
    icon: Users,
    title: "Peer Micro-Groups",
    description: "Small, supportive communities for shared experiences and peer-to-peer mental health support with professional moderation.",
    badge: "Join Discord",
    color: "bg-wellness-rest",
    status: "available",
    route: null,
    external: true,
    href: "https://discord.gg/67meY4hr"
  }
];

interface FeaturesProps {
  onFeatureClick?: (featureId: string) => void;
}

export function Features({ onFeatureClick }: FeaturesProps) {
  const navigate = useNavigate();

  interface Feature {
    title: string;
    status: string;
    route: string | null;
    external?: boolean;
    href?: string;
  }

  const handleFeatureClick = (feature: Feature) => {
    if (feature.status === 'available') {
      if (feature.external && feature.href) {
        window.open(feature.href, '_blank', 'noopener');
      } else if (feature.title === 'Floating Chatbot') {
        // Scroll to chatbot or trigger it
        const chatButton = document.querySelector('[data-floating-chat]');
        if (chatButton) {
          (chatButton as HTMLElement).click();
        }
      } else if (feature.route) {
        navigate(feature.route);
      } else if (onFeatureClick) {
        onFeatureClick(feature.title.toLowerCase().replace(/\s+/g, '-'));
      }
    }
  };

  return (
    <section className="py-20 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mental Wellness Features
          </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our comprehensive suite of mental health tools designed specifically for your needs. 
            Some features are available now, others are Explore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isAvailable = feature.status === 'available';
            
            return (
              <Card 
                key={index} 
                className={`shadow-wellness border-0 transition-all duration-300 hover:-translate-y-1 animate-fade-up ${
                  isAvailable 
                    ? 'hover:shadow-medium cursor-pointer' 
                    : 'opacity-75 cursor-not-allowed'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleFeatureClick(feature)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`${feature.color} p-3 rounded-lg text-white mb-3 relative`}>
                      <IconComponent className="h-6 w-6" />
                      {isAvailable && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white">
                        </div>
                      )}
                      {!isAvailable && (
                        <Lock className="absolute -top-1 -right-1 w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <Badge 
                      variant={isAvailable ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {feature.title}
                    {isAvailable && <Sparkles className="h-4 w-4 text-primary" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  {isAvailable ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeatureClick(feature);
                      }}
                    >
                      {feature.route ? 'Open Feature' : 'Try Now'}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Explore</span>
                    </div>
                  )}

                  {/* If this is the Peer Micro-Groups feature, surface the Discord invite */}
                  {feature.title === 'Peer Micro-Groups' && (
                    <div className="mt-3">
                      <a href="https://discord.gg/67meY4hr" target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="sm" className="w-full">
                          Join Peer Groups on Discord
                        </Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Status Legend */}
        <div className="flex justify-center mt-12">
          <div className="bg-muted/30 rounded-lg p-4 inline-flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">Available Now</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3 text-gray-400" />
              <span className="text-sm">Explore</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-wellness-calm/10 px-6 py-3 rounded-full border border-primary/20">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">
              Start with our AI chatbot - available 24/7 for instant support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}