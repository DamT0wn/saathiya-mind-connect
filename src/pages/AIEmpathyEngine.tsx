import { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { ChatInterface } from "@/components/ChatInterface";
import { AdvancedMoodTracker } from "@/components/AdvancedMoodTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  MessageCircle, 
  Heart, 
  TrendingUp, 
  Zap,
  ArrowLeft,
  Activity,
  Lightbulb,
  Shield
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const AIEmpathyEngine = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');

  const handleSectionClick = (section: string) => {
    if (section === 'home') {
      navigate('/');
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Advanced Sentiment Analysis",
      description: "Real-time emotion detection with 95% accuracy, understanding context and cultural nuances.",
      color: "bg-primary"
    },
    {
      icon: MessageCircle,
      title: "Bilingual Support",
      description: "Seamless conversation in Hindi and English with cultural awareness and empathy.",
      color: "bg-wellness-energy"
    },
    {
      icon: Heart,
      title: "Therapeutic Responses",
      description: "CBT/DBT-trained responses with personalized therapeutic interventions.",
      color: "bg-wellness-calm"
    },
    {
      icon: Activity,
      title: "Real-time Analysis",
      description: "Instant mood tracking and risk assessment during conversations.",
      color: "bg-success"
    },
    {
      icon: Lightbulb,
      title: "Adaptive Learning",
      description: "AI learns your patterns and preferences to provide better support over time.",
      color: "bg-warning"
    },
    {
      icon: Shield,
      title: "Crisis Detection",
      description: "Automatic identification of crisis situations with immediate intervention protocols.",
      color: "bg-destructive"
    }
  ];

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'mood', label: 'Mood Check-in', icon: Heart },
    { id: 'insights', label: 'AI Insights', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSectionClick={handleSectionClick} activeSection="chat" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-wellness-calm/10 to-wellness-energy/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary text-white rounded-xl">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AI Empathy Engine</h1>
                <p className="text-muted-foreground">Advanced conversational AI for mental wellness</p>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${feature.color} p-2 rounded-lg text-white flex-shrink-0`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 bg-muted/30 p-1 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Conversation Interface
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChatInterface isFullScreen={true} />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'mood' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Advanced Mood Check-in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedMoodTracker 
                  onSave={(data) => {
                    console.log('Mood data saved:', data);
                    // Handle mood data saving
                  }}
                  onClose={() => {
                    console.log('Mood tracker closed');
                    // Handle close action
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">Conversation Patterns</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You tend to seek support most during evening hours. Consider setting up 
                        regular check-ins during this time.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-wellness-calm/5 rounded-lg border border-wellness-calm/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-wellness-calm" />
                        <h3 className="font-semibold">Emotional Themes</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recent conversations show progress in managing academic stress. 
                        Keep using the breathing exercises we discussed.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <h3 className="font-semibold">Progress Indicators</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your sentiment scores have improved by 23% over the past week. 
                        Great job maintaining positive coping strategies!
                      </p>
                    </div>
                    
                    <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-warning" />
                        <h3 className="font-semibold">Recommendations</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on your patterns, try the guided meditation exercises 
                        between 2-4 PM when stress levels typically peak.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIEmpathyEngine;