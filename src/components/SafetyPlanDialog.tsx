import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Plus, 
  X, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Heart,
  Users,
  AlertCircle,
  CheckCircle,
  Save
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Contact {
  name: string;
  phone?: string;
  email?: string;
}

interface DistractionPlace {
  name: string;
  description?: string;
}

interface SafetyPlan {
  warningSigns: string;
  copingStrategies: string;
  distractionPlaces: DistractionPlace[];
  supportContacts: Contact[];
  professionalContacts: string[];
  safeEnvironment: string;
  lastUpdated: string;
}

interface SafetyPlanDialogProps {
  open: boolean;
  onClose: () => void;
  existingPlan?: SafetyPlan | null;
}

const emergencyHelplines = [
  { name: "AASRA", number: "022-2754-6669", type: "Crisis Support" },
  { name: "iCALL (TISS)", number: "022-2552-1111", type: "Counseling" },
  { name: "Muktaa Foundation", number: "788-788-9882", type: "Support Services" },
  { name: "Parivarthan", number: "7676602602", type: "Counseling Centre" }
];

export function SafetyPlanDialog({ open, onClose, existingPlan }: SafetyPlanDialogProps) {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form states
  const [warningSigns, setWarningSigns] = useState('');
  const [copingStrategies, setCopingStrategies] = useState('');
  const [distractionPlaces, setDistractionPlaces] = useState<DistractionPlace[]>([]);
  const [supportContacts, setSupportContacts] = useState<Contact[]>([]);
  const [selectedHelplines, setSelectedHelplines] = useState<string[]>([]);
  const [safeEnvironment, setSafeEnvironment] = useState('');

  // Temporary inputs for adding new items
  const [newPlace, setNewPlace] = useState({ name: '', description: '' });
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });

  // Load existing plan when dialog opens
  useEffect(() => {
    if (open && existingPlan) {
      setWarningSigns(existingPlan.warningSigns || '');
      setCopingStrategies(existingPlan.copingStrategies || '');
      setDistractionPlaces(existingPlan.distractionPlaces || []);
      setSupportContacts(existingPlan.supportContacts || []);
      setSelectedHelplines(existingPlan.professionalContacts || []);
      setSafeEnvironment(existingPlan.safeEnvironment || '');
    }
  }, [open, existingPlan]);

  const totalSteps = 6;

  const addDistractionPlace = () => {
    if (newPlace.name.trim()) {
      setDistractionPlaces([...distractionPlaces, { ...newPlace }]);
      setNewPlace({ name: '', description: '' });
    }
  };

  const removeDistractionPlace = (index: number) => {
    setDistractionPlaces(distractionPlaces.filter((_, i) => i !== index));
  };

  const addSupportContact = () => {
    if (newContact.name.trim()) {
      setSupportContacts([...supportContacts, { ...newContact }]);
      setNewContact({ name: '', phone: '', email: '' });
    }
  };

  const removeSupportContact = (index: number) => {
    setSupportContacts(supportContacts.filter((_, i) => i !== index));
  };

  const toggleHelpline = (helplineName: string) => {
    if (selectedHelplines.includes(helplineName)) {
      setSelectedHelplines(selectedHelplines.filter(h => h !== helplineName));
    } else {
      setSelectedHelplines([...selectedHelplines, helplineName]);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    const safetyPlan: SafetyPlan = {
      warningSigns,
      copingStrategies,
      distractionPlaces,
      supportContacts,
      professionalContacts: selectedHelplines,
      safeEnvironment,
      lastUpdated: new Date().toISOString()
    };

    try {
      // Save to localStorage (in production, save to database)
      const storageKey = `safetyPlan_${currentUser?.uid}`;
      localStorage.setItem(storageKey, JSON.stringify(safetyPlan));
      
      toast.success('Safety plan saved successfully!', {
        description: 'Your personalized safety plan is now ready.'
      });

      setTimeout(() => {
        setSaving(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error saving safety plan:', error);
      toast.error('Failed to save safety plan. Please try again.');
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-lg">Recognizing Warning Signs</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              List the thoughts, feelings, or situations that indicate you might be entering a crisis.
            </p>
            <Label htmlFor="warningSigns">Warning Signs</Label>
            <Textarea
              id="warningSigns"
              placeholder="Example: Feeling isolated, difficulty sleeping, negative thoughts, loss of interest..."
              value={warningSigns}
              onChange={(e) => setWarningSigns(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              💡 Be specific about what you notice in yourself when you're struggling.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Internal Coping Strategies</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              What can you do on your own to feel better without contacting others?
            </p>
            <Label htmlFor="copingStrategies">Coping Strategies</Label>
            <Textarea
              id="copingStrategies"
              placeholder="Example: Deep breathing, journaling, listening to music, meditation, taking a walk..."
              value={copingStrategies}
              onChange={(e) => setCopingStrategies(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              💡 Think about activities that have helped you feel calmer in the past.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-wellness-energy" />
              <h3 className="font-semibold text-lg">People & Places for Distraction</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Safe people or places that can help distract you from difficult thoughts.
            </p>
            
            {/* List of added places */}
            {distractionPlaces.length > 0 && (
              <div className="space-y-2 mb-4">
                {distractionPlaces.map((place, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{place.name}</p>
                        {place.description && (
                          <p className="text-xs text-muted-foreground mt-1">{place.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDistractionPlace(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Add new place */}
            <div className="border rounded-lg p-4 space-y-3">
              <Label htmlFor="placeName">Place/Person Name</Label>
              <Input
                id="placeName"
                placeholder="Example: Local park, Coffee shop, Friend's name..."
                value={newPlace.name}
                onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
              />
              <Label htmlFor="placeDesc">Description (optional)</Label>
              <Input
                id="placeDesc"
                placeholder="Why this helps..."
                value={newPlace.description}
                onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
              />
              <Button onClick={addDistractionPlace} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Place/Person
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Supportive Friends & Family</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              People you can reach out to when you need help or someone to talk to.
            </p>

            {/* List of added contacts */}
            {supportContacts.length > 0 && (
              <div className="space-y-2 mb-4">
                {supportContacts.map((contact, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium text-sm">{contact.name}</p>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{contact.email}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSupportContact(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Add new contact */}
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <Label htmlFor="contactName">Name</Label>
                <Input
                  id="contactName"
                  placeholder="Contact name..."
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone (optional)</Label>
                <Input
                  id="contactPhone"
                  placeholder="+91 XXXXX XXXXX"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email (optional)</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="email@example.com"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                />
              </div>
              <Button onClick={addSupportContact} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-lg">Professional Contacts</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Select helplines you want to include in your safety plan.
            </p>

            <div className="space-y-3">
              {emergencyHelplines.map((helpline) => (
                <Card
                  key={helpline.name}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedHelplines.includes(helpline.name)
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleHelpline(helpline.name)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{helpline.name}</p>
                        {selectedHelplines.includes(helpline.name) && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {helpline.type}
                      </Badge>
                      <p className="text-sm font-mono text-primary">{helpline.number}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              💡 Tap to select/deselect helplines. These will be easily accessible in your plan.
            </p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-success" />
              <h3 className="font-semibold text-lg">Making Your Environment Safe</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Steps you can take to make your environment safer during a crisis.
            </p>
            <Label htmlFor="safeEnvironment">Safety Steps</Label>
            <Textarea
              id="safeEnvironment"
              placeholder="Example: Remove harmful items, stay in a comfortable space, keep emergency contacts visible..."
              value={safeEnvironment}
              onChange={(e) => setSafeEnvironment(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              💡 Think about what makes you feel safe and protected.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl">
                Personal Safety Plan
              </DialogTitle>
              <DialogDescription className="text-sm">
                Step {currentStep} of {totalSteps}
              </DialogDescription>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </DialogHeader>

        {/* Step content */}
        <div className="py-6">
          {renderStepContent()}
        </div>

        {/* Navigation buttons */}
        <DialogFooter className="flex flex-row gap-2 sm:gap-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep} className="flex-1">
              Previous
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button onClick={nextStep} className="flex-1">
              Next Step
            </Button>
          ) : (
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="flex-1 bg-success hover:bg-success/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Safety Plan'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
