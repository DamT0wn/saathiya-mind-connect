import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Edit2, 
  Save, 
  X,
  Camera,
  Shield,
  Home
} from 'lucide-react';
import { updateProfile } from 'firebase/auth';

export function Profile() {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load bio on component mount
  useEffect(() => {
    if (currentUser?.uid) {
      const savedBio = localStorage.getItem(`user_bio_${currentUser.uid}`);
      setBio(savedBio || '');
    }
  }, [currentUser]);

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatJoinDate = () => {
    if (!currentUser?.metadata?.creationTime) return 'Recently';
    const date = new Date(currentUser.metadata.creationTime);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: displayName.trim() || currentUser.displayName,
      });

      // In a real app, you would also save bio to your database
      // For now, we'll just store it in localStorage
      localStorage.setItem(`user_bio_${currentUser.uid}`, bio);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(currentUser?.displayName || '');
    // Load bio from localStorage
    if (currentUser?.uid) {
      const savedBio = localStorage.getItem(`user_bio_${currentUser.uid}`);
      setBio(savedBio || '');
    }
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground">Please sign in to view your profile.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Return to Home Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <Card className="p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage 
                      src={currentUser.photoURL || undefined} 
                      alt={currentUser.displayName || 'User'} 
                    />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                      {getInitials(currentUser.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10"
                    title="Change profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Member since {formatJoinDate()}
                </Badge>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-6">
                {/* Edit Toggle */}
                <div className="flex justify-end">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Display Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <UserIcon className="h-4 w-4" />
                    Display Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="max-w-md"
                    />
                  ) : (
                    <p className="text-lg">{currentUser.displayName || 'Not set'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <p className="text-lg text-muted-foreground">{currentUser.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed from this page
                  </p>
                </div>

                {/* Bio/Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Edit2 className="h-4 w-4" />
                    About Me
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself..."
                      className="max-w-md"
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {bio || 'No bio added yet. Click "Edit Profile" to add one.'}
                    </p>
                  )}
                </div>

                {/* Account Created */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar className="h-4 w-4" />
                    Account Created
                  </label>
                  <p className="text-muted-foreground">
                    {currentUser.metadata?.creationTime 
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Account Actions</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Privacy Settings</p>
                  <p className="text-sm text-muted-foreground">
                    Manage your data and privacy preferences
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Security</p>
                  <p className="text-sm text-muted-foreground">
                    Update password and security settings
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <div>
                  <p className="font-medium text-destructive">Sign Out</p>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
