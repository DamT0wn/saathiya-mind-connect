import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle 
} from "lucide-react";

const privacyFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All your conversations are encrypted with military-grade security. Not even our team can read your messages.",
    status: "Active",
  },
  {
    icon: Eye,
    title: "Zero-Knowledge Storage",
    description: "Choose what data to save or delete permanently. You control your digital footprint completely.",
    status: "User Control",
  },
  {
    icon: UserCheck,
    title: "Parental Consent Flow",
    description: "COPPA-compliant consent process for users under 18, ensuring legal compliance and family transparency.",
    status: "COPPA Compliant",
  },
  {
    icon: AlertTriangle,
    title: "Crisis Detection",
    description: "AI monitors for signs of self-harm or suicidal ideation, immediately connecting you with human support.",
    status: "24/7 Monitoring",
  },
];

const dataRights = [
  "Right to know what data we collect",
  "Right to access your personal data",
  "Right to correct inaccurate data",
  "Right to delete your data completely",
  "Right to restrict data processing",
  "Right to data portability",
];

export function PrivacySection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <Badge variant="outline" className="text-primary border-primary">
              Privacy First
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Safety & Privacy Matter Most
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've built Saathi with privacy and safety as core principles. Your mental health journey 
            should be yours alone, and we ensure it stays that way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Privacy Features */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Privacy Features</h3>
            {privacyFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="shadow-wellness border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{feature.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {feature.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Data Rights */}
          <div>
            <Card className="shadow-wellness border-0 h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Your Data Rights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Under Indian data protection laws and our privacy policy, you have these fundamental rights:
                </p>
                
                <div className="space-y-3">
                  {dataRights.map((right, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <span className="text-sm">{right}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Read Full Privacy Policy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Crisis Support Section */}
        <Card className="shadow-wellness border-l-4 border-l-warning bg-warning/5">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <div className="bg-warning/20 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Crisis Support Protocol</h3>
                <p className="text-muted-foreground mb-4">
                  If our AI detects signs of immediate danger, we follow a strict protocol to ensure your safety 
                  while respecting your privacy. This includes connecting you with trained human counselors and 
                  relevant helplines.
                </p>
                <div className="bg-background p-4 rounded-lg border border-warning/20">
                  <h4 className="font-semibold mb-2">Emergency Helplines (India):</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>KIRAN Mental Health:</strong> 1800-599-0019</p>
                    <p><strong>Snehi Helpline:</strong> 011-24311918</p>
                    <p><strong>Vandrevala Foundation:</strong> 9999 666 555</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}