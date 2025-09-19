import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Brain, 
  Shield, 
  Users, 
  BookOpen, 
  Phone,
  Heart,
  TrendingUp,
  Zap 
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Empathy Engine",
    description: "Conversational AI trained in CBT/DBT techniques, providing culturally-aware support in Hindi and English.",
    badge: "Core Feature",
    color: "bg-primary",
  },
  {
    icon: Brain,
    title: "Micro-Learning & Skills",
    description: "Bite-sized lessons on emotional regulation, stress management, and life skills tailored for Indian youth.",
    badge: "Educational",
    color: "bg-wellness-energy",
  },
  {
    icon: Shield,
    title: "Privacy & Safety First",
    description: "End-to-end encryption, zero-knowledge storage options, and automated crisis detection with real-time triage.",
    badge: "Security",
    color: "bg-success",
  },
  {
    icon: Users,
    title: "Peer Micro-Groups",
    description: "Optional anonymous support groups moderated by professionals, connecting you with peers facing similar challenges.",
    badge: "Community",
    color: "bg-wellness-rest",
  },
  {
    icon: BookOpen,
    title: "Assessment Tools",
    description: "Built-in PHQ-9, GAD-7, and custom mood tracking tools to monitor your mental health progress over time.",
    badge: "Tracking",
    color: "bg-accent",
  },
  {
    icon: Phone,
    title: "Crisis Support",
    description: "24/7 access to helplines like KIRAN, automated risk detection, and Bridge to Reality protocols for emergencies.",
    badge: "Emergency",
    color: "bg-destructive",
  },
  {
    icon: Heart,
    title: "Therapist Marketplace",
    description: "Connect with verified mental health professionals for paid sessions when you need additional human support.",
    badge: "Professional",
    color: "bg-wellness-calm",
  },
  {
    icon: TrendingUp,
    title: "Institution Dashboard",
    description: "Anonymized insights for schools and employers to understand and support their communities better.",
    badge: "Analytics",
    color: "bg-warning",
  },
  {
    icon: Zap,
    title: "Gamified Wellness",
    description: "Inner Compass modules with progress tracking, achievement badges, and Compass Points for completed activities.",
    badge: "Engagement",
    color: "bg-wellness-focus",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Complete Mental Wellness Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Saathiya combines cutting-edge AI technology with human expertise to provide comprehensive, 
            culturally-tuned mental health support for Indian youth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="shadow-wellness border-0 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`${feature.color} p-3 rounded-lg text-white mb-3`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-wellness-calm/10 px-6 py-3 rounded-full border border-primary/20">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">
              Join thousands of young Indians on their wellness journey
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}