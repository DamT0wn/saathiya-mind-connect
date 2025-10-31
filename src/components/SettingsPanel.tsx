import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LogOut, LogIn, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPanel() {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Clear all user data
      localStorage.removeItem('hasSeenWelcome');
      localStorage.removeItem('hasCompletedMoodCheckIn');
      localStorage.removeItem('lastMoodCheckIn');
      sessionStorage.clear();
      
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Theme Settings */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center space-x-2">
            {theme === 'light' ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            )}
            <span>Appearance</span>
          </h2>
          
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="theme-select" className="text-sm sm:text-base">Theme Mode</Label>
            <Select value={theme} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
              <SelectTrigger id="theme-select" className="w-full">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Choose your preferred color scheme
            </p>
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Account</h2>
          
          <div className="space-y-3 sm:space-y-4">
            {currentUser ? (
              <>
                <div className="bg-muted p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Signed in as</p>
                  <p className="font-medium text-sm sm:text-base break-all">{currentUser.email}</p>
                </div>
                
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full text-sm sm:text-base"
                  size="lg"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Signing out will clear your session data
                </p>
              </>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  You're not currently signed in. Sign in to access all features.
                </p>
                
                <Button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-primary to-wellness-calm text-sm sm:text-base"
                  size="lg"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Privacy & Terms */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Privacy & Legal</h2>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-sm sm:text-base"
              onClick={() => window.open('/privacy-policy.html', '_blank')}
            >
              Privacy Policy
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm sm:text-base"
              onClick={() => window.open('/terms-of-service.html', '_blank')}
            >
              Terms & Conditions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
