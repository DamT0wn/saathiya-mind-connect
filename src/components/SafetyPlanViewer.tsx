import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertCircle,
  Heart,
  MapPin,
  Users,
  Phone,
  User,
  Mail,
  Edit,
  Download,
  Share2
} from 'lucide-react';

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

interface SafetyPlanViewerProps {
  open: boolean;
  onClose: () => void;
  plan: SafetyPlan;
  onEdit: () => void;
}

export function SafetyPlanViewer({ open, onClose, plan, onEdit }: SafetyPlanViewerProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl">
                  My Safety Plan
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(plan.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning Signs */}
          {plan.warningSigns && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Warning Signs</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {plan.warningSigns}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coping Strategies */}
          {plan.copingStrategies && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <Heart className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Coping Strategies</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {plan.copingStrategies}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Distraction Places */}
          {plan.distractionPlaces && plan.distractionPlaces.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="h-5 w-5 text-wellness-energy mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-3">Places & People for Distraction</h3>
                    <div className="space-y-2">
                      {plan.distractionPlaces.map((place, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg">
                          <p className="font-medium text-sm">{place.name}</p>
                          {place.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {place.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Support Contacts */}
          {plan.supportContacts && plan.supportContacts.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-3">Support Contacts</h3>
                    <div className="space-y-3">
                      {plan.supportContacts.map((contact, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium text-sm">{contact.name}</p>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-6">
                              <Phone className="h-3 w-3" />
                              <a href={`tel:${contact.phone}`} className="hover:text-primary">
                                {contact.phone}
                              </a>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-6 mt-1">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${contact.email}`} className="hover:text-primary">
                                {contact.email}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Professional Contacts */}
          {plan.professionalContacts && plan.professionalContacts.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <Phone className="h-5 w-5 text-destructive mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-3">Professional Helplines</h3>
                    <div className="space-y-2">
                      {plan.professionalContacts.map((helpline, index) => (
                        <div key={index} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <Badge variant="outline" className="text-xs mb-2">
                            Emergency Contact
                          </Badge>
                          <p className="font-medium text-sm">{helpline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Safe Environment */}
          {plan.safeEnvironment && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <Shield className="h-5 w-5 text-success mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Safe Environment Steps</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {plan.safeEnvironment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button onClick={onEdit} variant="outline" className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Edit Plan
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Print/Save PDF
          </Button>
          <Button onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
