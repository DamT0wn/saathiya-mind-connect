import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Home, 
  MessageCircle, 
  Heart, 
  AlertCircle, 
  BookOpen, 
  Users,
  Brain,
  Settings,
  TrendingUp
} from 'lucide-react';

interface NavigationProps {
  onSectionClick: (section: string) => void;
  activeSection?: string;
}

export function Navigation({ onSectionClick, activeSection = 'home' }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, route: '/' },
    { id: 'features', label: 'Features', icon: Heart, route: '/#features' },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, route: '/ai-chat', badge: 'NEW' },
    { id: 'crisis', label: 'Crisis Support', icon: AlertCircle, route: '/crisis-support' },
    { id: 'mood', label: 'Mood Analytics', icon: TrendingUp, route: '/mood-dashboard' },
    { id: 'learning', label: 'Resources', icon: BookOpen, route: '/resources' },
  { id: 'groups', label: 'Peer Groups', icon: Users, badge: 'Explore', external: true, href: 'https://discord.gg/67meY4hr' },
  ];

  const handleItemClick = (item: any) => {
    if (item.badge === 'Explore' && !item.external) {
      // Handle coming soon features
      return;
    }

    if (item.id === 'home' || item.route === '/') {
      // Handle Home button - always scroll to top smoothly
      if (location.pathname === '/') {
        // Already on home page, just scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Navigate to home and scroll to top
        navigate('/');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
      onSectionClick('home');
    } else if (typeof item.route === 'string' && item.route.startsWith('/#')) {
      // Handle section scrolling on home page
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const sectionId = item.route.substring(2);
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        onSectionClick(item.id);
      }
    } else {
      // Handle page navigation or external links
      if (item.external && item.href) {
        // Open external link in a new tab
        window.open(item.href, '_blank', 'noopener');
      } else {
        navigate(item.route);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const isCurrentPage = (route: string) => {
    if (route === '/') return location.pathname === '/';
    return location.pathname === route;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-wellness-calm rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Saathi</h1>
              <p className="text-xs text-gray-500">Mind Connect</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPage(item.route) || activeSection === item.id;
              const isDisabled = item.badge === 'Explore' && !item.external;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleItemClick(item)}
                  className={`relative flex items-center space-x-2 h-10 px-4 ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isDisabled}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === 'Explore' ? "outline" : "secondary"}
                      className="absolute -top-1 -right-1 text-xs px-1 py-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Settings Button */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onSectionClick('settings')}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                  const isActive = isCurrentPage(item.route) || activeSection === item.id;
                  const isDisabled = item.badge === 'Explore' && !item.external;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => handleItemClick(item)}
                    className={`relative w-full justify-start space-x-3 h-12 ${
                        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    disabled={isDisabled}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badge === 'Explore' ? "outline" : "secondary"}
                        className="ml-auto"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
              <div className="pt-2 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => onSectionClick('settings')}
                  className="w-full justify-start space-x-3 h-12"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}