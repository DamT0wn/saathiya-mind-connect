import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Phone, Users, Video, Download, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'article' | 'video' | 'audio' | 'app' | 'contact' | 'course';
  url?: string;
  pdfUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  tags: string[];
}

const mentalHealthResources: Resource[] = [
  {
    id: 'breathing-basics',
    title: 'Complete Guide to Breathing Techniques',
    description: 'Learn various breathing exercises for anxiety, stress, and relaxation',
    category: 'article',
    pdfUrl: '/assets/resources/breathing-techniques.pdf',
    difficulty: 'beginner',
    duration: '10 min read',
    tags: ['anxiety', 'stress', 'breathing', 'relaxation']
  },
  {
    id: 'cbt-workbook',
    title: 'Cognitive Behavioral Therapy Self-Help Workbook',
    description: 'Practical exercises to challenge negative thought patterns',
    category: 'course',
    pdfUrl: '/assets/resources/cbt-workbook.pdf',
    difficulty: 'intermediate',
    duration: '2-3 weeks',
    tags: ['depression', 'anxiety', 'cbt', 'self-help']
  },
  {
    id: 'sleep-hygiene',
    title: 'Sleep Hygiene for Better Mental Health',
    description: 'Evidence-based strategies for improving sleep quality',
    category: 'article',
    pdfUrl: '/assets/resources/sleep-hygiene-guide.pdf',
    difficulty: 'beginner',
    duration: '8 min read',
    tags: ['sleep', 'anxiety', 'depression', 'health']
  },
  {
    id: 'meditation-app',
    title: 'Headspace - Guided Meditation App',
    description: 'Popular meditation app with programs for stress, anxiety, and sleep',
    category: 'app',
    url: 'https://headspace.com',
    difficulty: 'beginner',
    tags: ['meditation', 'mindfulness', 'stress', 'sleep']
  },
  {
    id: 'study-stress',
    title: 'Managing Academic Stress and Anxiety',
    description: 'Specific strategies for students dealing with exam and study pressure',
    category: 'video',
    pdfUrl: '/assets/resources/academic-stress-management.pdf',
    difficulty: 'beginner',
    duration: '15 minutes',
    tags: ['student', 'stress', 'anxiety', 'study']
  },
  {
    id: 'social-anxiety',
    title: 'Overcoming Social Anxiety: A Step-by-Step Guide',
    description: 'Practical techniques for managing social situations and building confidence',
    category: 'course',
    pdfUrl: '/assets/resources/social-anxiety-guide.pdf',
    difficulty: 'intermediate',
    duration: '4 weeks',
    tags: ['social-anxiety', 'confidence', 'social-skills']
  }
];

const crisisContacts = [
  {
    name: 'KIRAN Mental Health Helpline',
    number: '1800-599-0019',
    availability: '24/7',
    description: 'Government mental health helpline'
  },
  {
    name: 'Vandrevala Foundation',
    number: '9999 666 555',
    availability: '24/7',
    description: 'Mental health and suicide prevention'
  },
  {
    name: 'AASRA',
    number: '91-9820466726',
    availability: '24/7',
    description: 'Suicide prevention and emotional support'
  },
  {
    name: 'iCall',
    number: '9152987821',
    availability: 'Mon-Sat, 8AM-10PM',
    description: 'Counseling and psychological support'
  }
];

interface ResourceLibraryProps {
  onClose: () => void;
  userMood?: string;
  userTopics?: string[];
  modal?: boolean; // if false, renders inline without overlay
}

export function ResourceLibrary({ onClose, userMood, userTopics = [], modal = true }: ResourceLibraryProps) {
  const { currentUser } = useAuth();
  const [savedResources, setSavedResources] = useState<Resource[]>([]);

  // Load saved resources from localStorage on mount
  useEffect(() => {
    if (currentUser) {
      const storageKey = `savedResources_${currentUser.uid}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setSavedResources(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading saved resources:', error);
        }
      }
    }
  }, [currentUser]);

  // Handle saving a resource for later
  const handleSaveForLater = (resource: Resource) => {
    if (!currentUser) {
      toast.error('Please sign in to save resources');
      return;
    }

    const storageKey = `savedResources_${currentUser.uid}`;
    
    // Check if already saved
    const isAlreadySaved = savedResources.some(r => r.id === resource.id);
    
    if (isAlreadySaved) {
      // Remove from saved
      const updatedResources = savedResources.filter(r => r.id !== resource.id);
      localStorage.setItem(storageKey, JSON.stringify(updatedResources));
      setSavedResources(updatedResources);
      toast.success('Removed from For You!');
    } else {
      // Add to saved
      const updatedResources = [...savedResources, resource];
      localStorage.setItem(storageKey, JSON.stringify(updatedResources));
      setSavedResources(updatedResources);
      
      toast.success('Saved to For You!', {
        description: `${resource.title} has been added to your personalized section.`,
        duration: 2000
      });
    }
  };

  // Handle accessing PDF or external URL
  const handleAccessResource = (resource: Resource) => {
    if (resource.pdfUrl) {
      // Try to open PDF
      const link = document.createElement('a');
      link.href = resource.pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Check if file exists (basic check)
      fetch(resource.pdfUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            link.click();
          } else {
            toast.error('File not available', {
              description: 'This resource is currently unavailable. Please try again later.'
            });
          }
        })
        .catch(() => {
          // If fetch fails, still try to open (might be CORS issue)
          link.click();
        });
    } else if (resource.url) {
      window.open(resource.url, '_blank', 'noopener noreferrer');
    } else {
      toast.error('File not available', {
        description: 'This resource does not have an associated file.'
      });
    }
  };

  // Check if a resource is currently saved
  const isResourceSaved = (resourceId: string) => {
    return savedResources.some(r => r.id === resourceId);
  };
  // Normalize matching across moods/topics with simple aliases
  const moodAliases: Record<string, string[]> = {
    anxious: ['anxiety', 'panic', 'worry'],
    anxiety: ['anxious', 'panic', 'worry'],
    stressed: ['stress', 'overwhelm', 'burnout'],
    stress: ['stressed', 'overwhelm', 'burnout'],
    lonely: ['loneliness', 'isolation'],
    loneliness: ['lonely', 'isolation'],
    sad: ['depression', 'low-mood'],
    depression: ['sad', 'low-mood'],
    sleep: ['insomnia', 'rest', 'sleep'],
  };

  const norm = (s?: string) => (s || '').toLowerCase().trim();
  const tagMatches = (tag: string, needle: string) => {
    const t = norm(tag);
    const n = norm(needle);
    if (!t || !n) return false;
    if (t.includes(n) || n.includes(t)) return true;
    const aliases = moodAliases[n] || [];
    return aliases.some(a => t.includes(a));
  };

  const getRelevantResources = useMemo(() => {
    const mood = norm(userMood);
    const topics = (userTopics || []).map(norm).filter(Boolean);
    
    let filteredResources = mentalHealthResources;
    
    if (mood || topics.length > 0) {
      filteredResources = mentalHealthResources.filter(resource => {
        const moodMatch = mood ? resource.tags.some(tag => tagMatches(tag, mood)) : false;
        const topicMatch = topics.length > 0
          ? topics.some(topic => resource.tags.some(tag => tagMatches(tag, topic)))
          : false;
        return moodMatch || topicMatch;
      });
    }
    
    // Sort by difficulty: beginner first, then intermediate, then advanced
    return filteredResources.sort((a, b) => {
      const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
  }, [userMood, userTopics]);

  const getIcon = (category: Resource['category']) => {
    switch (category) {
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Download className="h-4 w-4" />;
      case 'app': return <ExternalLink className="h-4 w-4" />;
      case 'contact': return <Phone className="h-4 w-4" />;
      case 'course': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: Resource['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
    }
  };

  const relevantResources = getRelevantResources;

  const header = (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold">Mental Health Resources</h2>
        <p className="text-muted-foreground">
          Curated resources to support your mental wellness journey
        </p>
      </div>
      {modal && (
        <Button onClick={onClose} variant="outline">Close</Button>
      )}
    </div>
  );

  const body = (
    <>
      <Tabs defaultValue="resources" className="space-y-4">
            <TabsList>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="crisis">Crisis Support</TabsTrigger>
              <TabsTrigger value="recommended">For You</TabsTrigger>
            </TabsList>

            <TabsContent value="resources" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-4">
                {[...mentalHealthResources]
                  .sort((a, b) => {
                    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
                    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
                  })
                  .map((resource) => (
                  <Card key={resource.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getIcon(resource.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {resource.description}
                            </p>
                          </div>
                          <Badge className={getDifficultyColor(resource.difficulty)}>
                            {resource.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          {resource.duration && (
                            <Badge variant="outline" className="text-xs">
                              {resource.duration}
                            </Badge>
                          )}
                          <div className="flex gap-1">
                            {resource.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          {resource.url || resource.pdfUrl ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAccessResource(resource)}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Access
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast.error('File not available')}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Access
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant={isResourceSaved(resource.id) ? "default" : "ghost"}
                            onClick={() => handleSaveForLater(resource)}
                          >
                            {isResourceSaved(resource.id) ? (
                              <>
                                <BookmarkCheck className="h-3 w-3 mr-1" />
                                Saved
                              </>
                            ) : (
                              <>
                                <Bookmark className="h-3 w-3 mr-1" />
                                Save for Later
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="crisis" className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  <h3 className="font-medium text-red-800">Emergency Crisis Support</h3>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  If you're in immediate danger or having thoughts of self-harm, please call one of these numbers now.
                </p>
              </div>

              <div className="grid gap-3">
                {crisisContacts.map((contact, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Available: {contact.availability}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Button asChild className="w-full min-w-[180px]">
                          <a href={`tel:${contact.number}`} className="flex items-center justify-center gap-2">
                            <Phone className="h-4 w-4" />
                            {contact.number}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommended" className="space-y-4">
              {/* Saved Resources Section */}
              {savedResources.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BookmarkCheck className="h-5 w-5 text-primary" />
                      Saved Resources ({savedResources.length})
                    </h3>
                    <Badge variant="outline">Your Collection</Badge>
                  </div>
                  <div className="grid gap-4">
                    {savedResources.map((resource) => (
                      <Card key={resource.id} className="p-4 border-primary bg-primary/5">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            {getIcon(resource.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{resource.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {resource.description}
                                </p>
                              </div>
                              <Badge className={getDifficultyColor(resource.difficulty)}>
                                {resource.difficulty}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-3">
                              {resource.duration && (
                                <Badge variant="outline" className="text-xs">
                                  {resource.duration}
                                </Badge>
                              )}
                              <div className="flex gap-1">
                                {resource.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleAccessResource(resource)}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Access Now
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleSaveForLater(resource)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Resources */}
              {relevantResources.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Recommended For You</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your current mood and conversation
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {relevantResources.slice(0, 6).map((resource) => (
                      <Card key={resource.id} className="p-4 border-primary/20">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getIcon(resource.category)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {resource.description}
                            </p>
                            <div className="flex gap-1 mt-2">
                              {resource.tags
                                .filter(tag => {
                                  const mood = norm(userMood);
                                  const topics = (userTopics || []).map(norm);
                                  return (mood && tagMatches(tag, mood)) || topics.some(t => tagMatches(tag, t));
                                })
                                .map((tag) => (
                                  <Badge key={tag} variant="default" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAccessResource(resource)}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Access
                              </Button>
                              <Button 
                                size="sm" 
                                variant={isResourceSaved(resource.id) ? "default" : "ghost"}
                                onClick={() => handleSaveForLater(resource)}
                              >
                                {isResourceSaved(resource.id) ? (
                                  <>
                                    <BookmarkCheck className="h-3 w-3 mr-1" />
                                    Saved
                                  </>
                                ) : (
                                  <>
                                    <Bookmark className="h-3 w-3 mr-1" />
                                    Save
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Continue your conversation to get personalized resource recommendations!
                  </p>
                </div>
              )}
            </TabsContent>
      </Tabs>
    </>
  );

  if (!modal) {
    // Inline rendering without overlay or close button
    return (
      <div className="w-full">
        {header}
        {body}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h:[90vh] overflow-hidden">
        <div className="p-6">
          {header}
          {body}
        </div>
      </Card>
    </div>
  );
}