import { useEffect } from 'react';
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
  CheckCircle,
  Edit,
  FileText
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { SafetyPlanDialog } from '@/components/SafetyPlanDialog';
import { SafetyPlanViewer } from '@/components/SafetyPlanViewer';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const CrisisSupport = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [safetyPlanDialogOpen, setSafetyPlanDialogOpen] = useState(false);
  const [safetyPlanViewerOpen, setSafetyPlanViewerOpen] = useState(false);
  const [existingSafetyPlan, setExistingSafetyPlan] = useState<any>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Load existing safety plan when user is available
  useEffect(() => {
    if (currentUser) {
      const storageKey = `safetyPlan_${currentUser.uid}`;
      const savedPlan = localStorage.getItem(storageKey);
      if (savedPlan) {
        try {
          setExistingSafetyPlan(JSON.parse(savedPlan));
        } catch (error) {
          console.error('Error loading safety plan:', error);
        }
      }
    }
  }, [currentUser]);

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
      name: "AASRA",
      number: "022-2754-6669",
      telNumber: "02227546669",
      description: "Mumbai-based 24/7 suicide prevention and mental health helpline",
      website: "https://www.aasra.info/",
      type: "Crisis Support",
      availability: "24/7"
    },
    {
      name: "iCALL (TISS)",
      number: "022-2552-1111",
      telNumber: "02225521111",
      description: "Professional counseling and psychological support by TISS",
      website: "https://icallhelpline.org/",
      type: "Counseling",
      availability: "Monday-Saturday, 8 AM - 10 PM"
    },
    {
      name: "Muktaa Charitable Foundation",
      number: "788-788-9882",
      telNumber: "7887889882",
      description: "Mental health support and counseling services",
      website: "https://mcf.org.in/",
      type: "Support Services",
      availability: "Call for timings"
    },
    {
      name: "Parivarthan Counselling",
      number: "7676602602",
      telNumber: "7676602602",
      description: "Professional counseling, training, and research centre",
      website: "https://parivarthan.org/",
      type: "Counseling Centre",
      availability: "Call for timings"
    }
  ];

  const crisisResources = [
    {
      icon: Shield,
      title: "Safety Planning",
      description: "Create a personalized safety plan for crisis situations",
      color: "bg-primary",
      action: () => setSafetyPlanDialogOpen(true)
    },
    {
      icon: Heart,
      title: "Breathing Exercises",
      description: "Immediate grounding techniques to manage panic and anxiety",
      color: "bg-wellness-calm",
      action: () => {
        navigate('/resources?tab=exercises');
      }
    },
    {
      icon: Users,
      title: "Support Network",
      description: "Connect with trusted friends, family, or support groups",
      color: "bg-wellness-energy",
      action: () => window.open('https://discord.gg/THdJJrxnCS', '_blank', 'noopener noreferrer') // Navigate to Discord Peer Groups
    },
    {
      icon: BookOpen,
      title: "Crisis Resources",
      description: "Educational materials about crisis management and recovery",
      color: "bg-success",
      action: () => navigate('/resources') // Navigate to Resource Center
    }
  ];

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
                  <div key={index} className="p-4 sm:p-5 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg">{contact.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1.5">
                          {contact.type}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2 sm:text-right">
                        {/* Call Now Button - Works on all devices */}
                        <a href={`tel:${contact.telNumber}`}>
                          <Button
                            className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
                            size="sm"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Now
                          </Button>
                        </a>
                        {/* Visit Website Button - Always visible */}
                        <a href={contact.website} target="_blank" rel="noopener noreferrer">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            Visit Website
                          </Button>
                        </a>
                        <p className="text-xs text-muted-foreground flex items-center justify-start sm:justify-end gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {contact.availability}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{contact.description}</p>
                    <p className="text-sm font-mono text-primary">{contact.number}</p>
                  </div>
                ))}
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
                    <Button 
                      className="w-full"
                      onClick={() => navigate('/ai-chat')}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Crisis Chat
                    </Button>
                  </div>

                  <div className="p-4 bg-wellness-calm/5 rounded-lg border border-wellness-calm/20">
                    <h3 className="font-semibold mb-2">Guided Breathing Exercise</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      5-minute emergency grounding technique to help manage panic.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/resources')}
                    >
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
                      <div 
                        key={index} 
                        className="p-4 border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer active:scale-[0.98]"
                        onClick={resource.action}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            resource.action();
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`${resource.color} p-2 rounded-lg text-white flex-shrink-0`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </div>
                          <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180 flex-shrink-0 mt-1" />
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
                {existingSafetyPlan ? (
                  <div className="space-y-4">
                    {/* Existing plan preview */}
                    <Alert className="border-success/50 bg-success/5">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <AlertDescription className="text-sm">
                        <strong>Your safety plan is ready!</strong> Last updated{' '}
                        {new Date(existingSafetyPlan.lastUpdated).toLocaleDateString()}
                      </AlertDescription>
                    </Alert>

                    {existingSafetyPlan.warningSigns && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          Warning Signs
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {existingSafetyPlan.warningSigns}
                        </p>
                      </div>
                    )}

                    {existingSafetyPlan.supportContacts?.length > 0 && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          Support Contacts
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {existingSafetyPlan.supportContacts.length} contact(s) saved
                        </p>
                      </div>
                    )}

                    {existingSafetyPlan.professionalContacts?.length > 0 && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-destructive" />
                          Professional Helplines
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {existingSafetyPlan.professionalContacts.length} helpline(s) selected
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => setSafetyPlanViewerOpen(true)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Plan
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSafetyPlanDialogOpen(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Plan
                      </Button>
                    </div>
                  </div>
                ) : (
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

                    <Button 
                      className="w-full mt-4"
                      onClick={() => setSafetyPlanDialogOpen(true)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Create My Safety Plan
                    </Button>
                  </div>
                )}
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

            {/* Support Note */}
            <Alert className="mt-6 border-primary/50 bg-primary/5">
              <Heart className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>If you or someone you know is in emotional distress, please reach out to these verified helplines for support.</strong>
                {' '}All services listed above are staffed by trained professionals who are ready to help you through difficult times.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Safety Plan Dialog */}
      <SafetyPlanDialog
        open={safetyPlanDialogOpen}
        onClose={() => {
          setSafetyPlanDialogOpen(false);
          // Reload the safety plan after closing
          if (currentUser) {
            const storageKey = `safetyPlan_${currentUser.uid}`;
            const savedPlan = localStorage.getItem(storageKey);
            if (savedPlan) {
              try {
                setExistingSafetyPlan(JSON.parse(savedPlan));
              } catch (error) {
                console.error('Error loading safety plan:', error);
              }
            }
          }
        }}
        existingPlan={existingSafetyPlan}
      />

      {/* Safety Plan Viewer */}
      {existingSafetyPlan && (
        <SafetyPlanViewer
          open={safetyPlanViewerOpen}
          onClose={() => setSafetyPlanViewerOpen(false)}
          plan={existingSafetyPlan}
          onEdit={() => {
            setSafetyPlanViewerOpen(false);
            setSafetyPlanDialogOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default CrisisSupport;