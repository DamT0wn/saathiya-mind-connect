import { useState, useEffect } from 'react';
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  ArrowLeft,
  Heart,
  Shield,
  Clock,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const CrisisSupport = () => {
  const navigate = useNavigate();
  const [emergencyContacted, setEmergencyContacted] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  const emergencyContacts = [
    {
      name: "KIRAN National Helpline",
      number: "1800-599-0019",
      description: "24/7 free mental health support in multiple languages",
      type: "National",
      availability: "24/7"
    },
    {
      name: "Vandrevala Foundation",
      number: "9999-666-555",
      description: "24/7 confidential helpline for mental health support",
      type: "Private",
      availability: "24/7"
    },
    {
      name: "Sumaitri",
      number: "011-23389090",
      description: "Delhi-based suicide prevention helpline",
      type: "Regional",
      availability: "2 PM - 10 PM"
    },
    {
      name: "AASRA",
      number: "022-27546669",
      description: "Mumbai-based 24x7 suicide prevention helpline",
      type: "Regional",
      availability: "24/7"
    }
  ];

  const crisisResources = [
    {
      icon: Shield,
      title: "Safety Planning",
      description: "Create a personalized safety plan for crisis situations",
      color: "bg-primary"
    },
    {
      icon: Heart,
      title: "Breathing Exercises",
      description: "Immediate grounding techniques to manage panic and anxiety",
      color: "bg-wellness-calm"
    },
    {
      icon: Users,
      title: "Support Network",
      description: "Connect with trusted friends, family, or support groups",
      color: "bg-wellness-energy"
    },
    {
      icon: BookOpen,
      title: "Crisis Resources",
      description: "Educational materials about crisis management and recovery",
      color: "bg-success"
    }
  ];

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
    setEmergencyContacted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSectionClick={handleSectionClick} activeSection="crisis" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-destructive/10 via-orange-500/10 to-red-500/10 border-b">
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
              <div className="p-3 bg-destructive text-white rounded-xl">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Crisis Support</h1>
                <p className="text-muted-foreground">Immediate help and emergency resources</p>
              </div>
            </div>
            <Badge variant="destructive" className="ml-auto">Emergency</Badge>
          </div>

          {/* Emergency Alert */}
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>If you're in immediate danger, call emergency services (100/108/112) or visit your nearest hospital emergency room.</strong>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Helplines */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Phone className="h-5 w-5" />
                  Emergency Helplines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {contact.type}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Button
                          onClick={() => handleEmergencyCall(contact.number)}
                          className="bg-destructive hover:bg-destructive/90"
                          size="sm"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {contact.availability}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.description}</p>
                    <p className="text-sm font-mono mt-2 text-primary">{contact.number}</p>
                  </div>
                ))}

                {emergencyContacted && (
                  <Alert className="border-success/50 bg-success/5">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Great job reaching out for help. Remember, you're not alone in this.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Immediate Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Immediate Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-2">AI Crisis Support Chat</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get immediate support from our AI trained in crisis intervention.
                    </p>
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Crisis Chat
                    </Button>
                  </div>

                  <div className="p-4 bg-wellness-calm/5 rounded-lg border border-wellness-calm/20">
                    <h3 className="font-semibold mb-2">Guided Breathing Exercise</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      5-minute emergency grounding technique to help manage panic.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Heart className="h-4 w-4 mr-2" />
                      Start Breathing Exercise
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crisis Resources */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Crisis Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {crisisResources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className={`${resource.color} p-2 rounded-lg text-white flex-shrink-0`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Safety Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Personal Safety Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Warning Signs</h4>
                    <p className="text-sm text-muted-foreground">
                      Identify your personal warning signs that indicate you might be entering a crisis.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Coping Strategies</h4>
                    <p className="text-sm text-muted-foreground">
                      List activities and techniques that help you feel better and more grounded.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Support Network</h4>
                    <p className="text-sm text-muted-foreground">
                      People you can reach out to when you need help or someone to talk to.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Professional Contacts</h4>
                    <p className="text-sm text-muted-foreground">
                      Mental health professionals and emergency contacts for immediate help.
                    </p>
                  </div>

                  <Button className="w-full mt-4">
                    Create My Safety Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">When to Seek Immediate Help</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Thoughts of harming yourself or others</li>
                  <li>• Severe depression or anxiety that interferes with daily life</li>
                  <li>• Substance abuse as a way to cope</li>
                  <li>• Isolation from friends and family</li>
                  <li>• Dramatic mood swings or behavior changes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Remember</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Crisis is temporary - you can get through this</li>
                  <li>• You are not alone - help is available</li>
                  <li>• Reaching out for help is a sign of strength</li>
                  <li>• Your life has value and meaning</li>
                  <li>• Recovery is possible with the right support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrisisSupport;