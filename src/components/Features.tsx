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
    title: "AI Chatbot",
    description: "AI-powered companion accessible from anywhere on the site with instant support and guidance. Advanced sentiment analysis with empathetic responses in Hindi and English.",
    badge: "Available",
    color: "bg-primary",
    status: "available",
    route: "/ai-chat"
  },
  {
    icon: AlertCircle,
    title: "Crisis Support",
    description: "24/7 emergency detection with immediate access to professional helplines (KIRAN: 1800-599-0019) and crisis intervention.",
    badge: "Available",
    color: "bg-destructive",
    status: "available",
    route: "/crisis-support"
  },
  {
    icon: BookOpen,
    title: "Micro-Learning & Skills",
    description: "Bite-sized mental health education, coping strategies, and skill-building exercises tailored for Indian youth.",
    badge: "Available",
    color: "bg-wellness-calm",
    status: "available",
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
    href: "https://discord.gg/THdJJrxnCS"
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
      } else if (feature.title === 'AI Chatbot') {
        // Navigate to AI chat page
        navigate('/ai-chat');
      } else if (feature.route) {
        navigate(feature.route);
      } else if (onFeatureClick) {
        onFeatureClick(feature.title.toLowerCase().replace(/\s+/g, '-'));
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Mental Wellness Features
          </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Discover our comprehensive suite of mental health tools designed specifically for your needs. 
            All features are now available!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isAvailable = feature.status === 'available';
            
            return (
              <Card 
                key={index} 
                className={`shadow-wellness border-0 transition-all duration-300 hover:-translate-y-1 animate-fade-up h-full flex flex-col ${
                  isAvailable 
                    ? 'hover:shadow-medium cursor-pointer' 
                    : 'opacity-75 cursor-not-allowed'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleFeatureClick(feature)}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`${feature.color} p-2 sm:p-3 rounded-lg text-white mb-2 sm:mb-3 relative`}>
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                      {isAvailable && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white">
                        </div>
                      )}

                    </div>
                    <Badge 
                      variant={isAvailable ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 leading-tight">
                    {feature.title}
                    {isAvailable && <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 flex-grow">
                    {feature.description}
                  </p>
                  
                  <div className="mt-auto">
                    {isAvailable && feature.title !== 'Peer Micro-Groups' ? (
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
                    ) : null}

                    {/* If this is the Peer Micro-Groups feature, surface the Discord invite */}
                    {feature.title === 'Peer Micro-Groups' && (
                      <div>
                        <a href="https://discord.gg/67meY4hr" target="_blank" rel="noopener noreferrer">
                          <Button variant="secondary" size="sm" className="w-full">
                            Join Peer Groups on Discord
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
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
              <span className="text-sm">All Features Available</span>
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