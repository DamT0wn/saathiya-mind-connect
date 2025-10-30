import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, Phone, MapPin, Globe } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Privacy", href: "#privacy" },
    { label: "Safety", href: "#safety" },
    { label: "Pricing", href: "#pricing" },
  ],
  support: [
    { label: "Help Center", href: "#help" },
    { label: "Crisis Support", href: "#crisis" },
    { label: "Contact Us", href: "#contact" },
    { label: "Community", href: "#community" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#privacy-policy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Data Protection", href: "#data" },
    { label: "Compliance", href: "#compliance" },
  ],
  resources: [
    { label: "Mental Health Resources", href: "#resources" },
    { label: "For Schools", href: "#schools" },
    { label: "For Employers", href: "#employers" },
    { label: "Blog", href: "#blog" },
  ],
};

const emergencyContacts = [
  { name: "KIRAN Mental Health", number: "1800-599-0019" },
  { name: "Snehi Helpline", number: "011-24311918" },
  { name: "Vandrevala Foundation", number: "9999 666 555" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t">
      {/* Emergency Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-destructive" />
              <span className="font-semibold text-destructive">Crisis? Need immediate help?</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {emergencyContacts.map((contact, index) => (
                <a
                  key={index}
                  href={`tel:${contact.number}`}
                  className="hover:underline text-destructive font-medium"
                >
                  {contact.name}: {contact.number}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Saathi</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              India's first AI-powered mental wellness companion for youth. 
              Culturally-aware, privacy-first, and always here for you.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Proudly made in India 🇮🇳</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Hindi • English • More languages coming soon</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 Saathi. All rights reserved. Made with ❤️ for Indian youth.
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <div className="text-sm text-muted-foreground">
              ISO 27001 Certified • COPPA Compliant
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}