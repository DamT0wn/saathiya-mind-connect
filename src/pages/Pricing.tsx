import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Brain, 
  TrendingUp,
  BookOpen,
  Users,
  Activity,
  Shield,
  Clock,
  Heart,
  Sparkles,
  CheckCircle,
  Home
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Chatbot",
    description: "24/7 AI companion with empathetic responses in Hindi and English",
    route: "/ai-chat"
  },
  {
    icon: TrendingUp,
    title: "Mood Analytics",
    description: "Track and analyze your emotional patterns with detailed insights",
    route: "/mood-dashboard"
  },
  {
    icon: Activity,
    title: "Wellness Exercises",
    description: "Guided breathing, meditation, and mindfulness exercises",
    route: "/resources"
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description: "Curated mental health resources and educational content",
    route: "/resources"
  },
  {
    icon: Users,
    title: "Peer Groups",
    description: "Connect with supportive communities on Discord",
    route: null,
    external: true,
    href: "https://discord.gg/THdJJrxnCS"
  },
  {
    icon: Shield,
    title: "Crisis Support",
    description: "Immediate access to helplines and crisis intervention",
    route: "/crisis-support"
  },
  {
    icon: Brain,
    title: "Personalized Insights",
    description: "AI-driven recommendations based on your wellness journey",
    route: "/mood-dashboard"
  },
  {
    icon: Clock,
    title: "Daily Check-ins",
    description: "Regular mood tracking and wellness monitoring",
    route: "/mood-dashboard"
  }
];

export function Pricing() {
  const navigate = useNavigate();

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.external && feature.href) {
      window.open(feature.href, '_blank', 'noopener');
    } else if (feature.route) {
      navigate(feature.route);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Return to Home Button */}
      <div className="container mx-auto px-4 pt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Return to Home
        </Button>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-wellness-calm text-white">
              Limited Time Offer
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Saathi is Exclusively
              <span className="block bg-gradient-to-r from-primary to-wellness-calm bg-clip-text text-transparent">
                Free for You
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Take advantage of our comprehensive mental wellness platform at no cost — 
              a limited time opportunity to prioritize your mental health!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-wellness-calm hover:opacity-90"
                onClick={() => navigate('/ai-chat')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Using Saathi Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need for Mental Wellness
              </h2>
              <p className="text-xl text-muted-foreground">
                Access all premium features at no cost during our limited free period
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index}
                    className="shadow-wellness border-0 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    onClick={() => handleFeatureClick(feature)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CheckCircle className="h-5 w-5 text-success ml-auto" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-4 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeatureClick(feature);
                        }}
                      >
                        {feature.route ? 'Explore Feature' : 'Join Now'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-wellness-calm p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-8 w-8" />
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Why Saathi is Free Right Now
                  </h3>
                </div>
                <p className="text-lg opacity-90">
                  We believe mental health support should be accessible to everyone. During our 
                  launch period, we're offering complete access to all features at no cost. 
                  Join thousands of users already improving their mental wellness with Saathi!
                </p>
              </div>
              
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">100% Private</h4>
                    <p className="text-sm text-muted-foreground">
                      End-to-end encrypted conversations
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-8 w-8 text-success" />
                    </div>
                    <h4 className="font-semibold mb-2">Always Available</h4>
                    <p className="text-sm text-muted-foreground">
                      24/7 support whenever you need it
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-wellness-calm/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-8 w-8 text-wellness-calm" />
                    </div>
                    <h4 className="font-semibold mb-2">AI-Powered</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced empathy and understanding
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Don't miss this opportunity. Start using Saathi today and experience 
              the difference AI-powered mental health support can make.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-wellness-calm hover:opacity-90 text-lg px-8"
              onClick={() => navigate('/ai-chat')}
            >
              <MessageCircle className="mr-2 h-6 w-6" />
              Start Free Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
