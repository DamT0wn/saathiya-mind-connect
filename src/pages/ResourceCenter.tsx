import { useState, useEffect } from 'react';
import { Navigation } from "@/components/Navigation";
import { ResourceLibrary } from "@/components/ResourceLibrary";
import { ExercisePlayer } from "@/components/ExercisePlayer";
import { AdvancedMoodTracker } from "@/components/AdvancedMoodTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search,
  ArrowLeft,
  Play,
  Clock,
  Star,
  Filter,
  Heart,
  Brain,
  Lightbulb,
  Users,
  Shield,
  Zap,
  Youtube
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';

const VideoContent = [
  {
    id: 'mindful-for-stress',
    title: 'Mindfulness for Students: Beating Exam Stress',
    description: 'A 10-minute guide to quick stress relief, highly relevant for Indian students.',
    youtubeId: '5bNI_NloNa8',
    duration: '10 minutes',
    tags: ['stress', 'exam', 'mindfulness']
  },
  {
    id: 'mental-health-stigma',
    title: 'Breaking the Stigma: Talking About Mental Health in India',
    description: 'A short video addressing cultural barriers and encouraging dialogue.',
    youtubeId: 'hXlFxceM4R8',
    duration: '6 minutes',
    tags: ['stigma', 'social', 'culture']
  },
  {
    id: 'productivity-tips',
    title: 'Focus & Productivity Hacks for Youth',
    description: 'Simple and effective tips to improve focus on studies and goals.',
    youtubeId: '3QIfkeA6HBY',
    duration: '12 minutes',
    tags: ['focus', 'productivity', 'goals']
  }
];

const ResourceCenter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showThoughtJournal, setShowThoughtJournal] = useState(false);
  const [showSupportNetwork, setShowSupportNetwork] = useState(false);

  // Check URL parameters for tab activation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['videos', 'exercises', 'wellness'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

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

  const handleVideoClick = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener');
  };

  const exerciseCategories = [
    {
      id: 'breathing',
      title: 'Breathing Exercises',
      description: 'Calm your mind and reduce anxiety',
      icon: Heart,
      color: 'bg-wellness-calm',
      count: 8
    },
    {
      id: 'meditation',
      title: 'Guided Meditation',
      description: 'Mindfulness and awareness practices',
      icon: Brain,
      color: 'bg-primary',
      count: 12
    },
    {
      id: 'grounding',
      title: 'Grounding Techniques',
      description: 'Stay present and centered',
      icon: Shield,
      color: 'bg-success',
      count: 6
    },
    {
      id: 'cognitive',
      title: 'Cognitive Exercises',
      description: 'Challenge negative thought patterns',
      icon: Lightbulb,
      color: 'bg-wellness-energy',
      count: 10
    }
  ];

  const featuredExercises = [
    {
      id: 'box-breathing',
      title: '4-7-8 Breathing Technique',
      description: 'A powerful breathing exercise to reduce anxiety and promote relaxation',
      duration: '5 minutes',
      difficulty: 'Beginner',
      rating: 4.8,
      category: 'Breathing',
      instructions: [
        'Sit comfortably with your back straight',
        'Exhale completely through your mouth',
        'Inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat this cycle 3-4 times'
      ]
    },
    {
      id: 'progressive-relaxation',
      title: 'Progressive Muscle Relaxation',
      description: 'Systematically tense and relax different muscle groups',
      duration: '15 minutes',
      difficulty: 'Intermediate',
      rating: 4.6,
      category: 'Relaxation',
      instructions: [
        'Find a quiet, comfortable place to sit or lie down',
        'Start with your toes and tense the muscles',
        'Hold the tension for 5 seconds',
        'Release and notice the relaxation',
        'Move up through each muscle group',
        'End with your face and head muscles'
      ]
    },
    {
      id: '5-4-3-2-1',
      title: '5-4-3-2-1 Grounding Technique',
      description: 'Use your senses to ground yourself in the present moment',
      duration: '3 minutes',
      difficulty: 'Beginner',
      rating: 4.9,
      category: 'Grounding',
      instructions: [
        'Name 5 things you can see around you',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste',
        'Take deep breaths and notice how you feel'
      ]
    }
  ];

  const tabs = [
    { id: 'videos', label: 'Video Library', icon: Youtube },
    { id: 'exercises', label: 'Skill Building Exercises', icon: Play },
    { id: 'library', label: 'Educational Content', icon: BookOpen },
    { id: 'tools', label: 'Wellness Tools', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSectionClick={handleSectionClick} activeSection="learning" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-wellness-energy/10 via-primary/10 to-wellness-calm/10 border-b">
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
              <div className="p-3 bg-wellness-energy text-white rounded-xl">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Resource Center</h1>
                <p className="text-muted-foreground">Educational content and therapeutic exercises</p>
              </div>
            </div>
            <Badge className="ml-auto">Connect Now</Badge>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources, exercises, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 bg-muted/30 p-1 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-destructive" />
                  Bite-sized Educational Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {VideoContent.map((video) => (
                    <div 
                      key={video.id} 
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleVideoClick(video.youtubeId)}
                    >
                      {/* Video Thumbnail with Play Overlay */}
                      <div className="aspect-video w-full relative mb-3 overflow-hidden rounded-lg">
                        <img 
                          src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="h-10 w-10 text-white fill-white opacity-90" />
                        </div>
                      </div>
                      
                      <h3 className="font-semibold mb-1 hover:text-primary transition-colors">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {video.duration}
                        </div>
                        <div className="flex gap-1">
                          {video.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  In-depth Educational Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResourceLibrary onClose={() => {}} modal={false} />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="space-y-6">
            {/* Exercise Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {exerciseCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.id} className="hover:shadow-medium transition-all duration-300 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`${category.color} p-2 rounded-lg text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <Badge variant="secondary">{category.count}</Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Featured Exercises */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Skill Building Exercises (Tailored for Youth)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredExercises.map((exercise) => (
                    <div key={exercise.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline">{exercise.category}</Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {exercise.rating}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{exercise.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exercise.duration}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {exercise.difficulty}
                        </Badge>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Exercise
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Wellness Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 border rounded-lg text-center hover:shadow-medium transition-all">
                    <Heart className="h-8 w-8 mx-auto mb-3 text-wellness-calm" />
                    <h3 className="font-semibold mb-2">Mood Tracker</h3>
                    <p className="text-sm text-muted-foreground mb-4">Track your daily mood and emotions</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowMoodTracker(true)}
                    >
                      Open Tracker
                    </Button>
                  </div>
                  
                  <div className="p-6 border rounded-lg text-center hover:shadow-medium transition-all">
                    <Brain className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">Thought Journal</h3>
                    <p className="text-sm text-muted-foreground mb-4">Record and analyze your thoughts</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowThoughtJournal(true)}
                    >
                      Start Journal
                    </Button>
                  </div>
                  
                  <div className="p-6 border rounded-lg text-center hover:shadow-medium transition-all">
                    <Users className="h-8 w-8 mx-auto mb-3 text-wellness-energy" />
                    <h3 className="font-semibold mb-2">Peer Groups</h3>
                    <p className="text-sm text-muted-foreground mb-4">Connect with peers on Discord</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('https://discord.gg/THdJJrxnCS', '_blank', 'noopener noreferrer')}
                    >
                      Join Discord
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Exercise Player Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedExercise.title}</h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedExercise(null)}
                >
                  ×
                </Button>
              </div>
              <ExercisePlayer
                exercise={{
                  id: selectedExercise.id,
                  title: selectedExercise.title,
                  description: selectedExercise.description,
                  duration: parseInt(selectedExercise.duration),
                  steps: selectedExercise.instructions.map((instruction: string, index: number) => ({
                    id: index + 1,
                    instruction,
                    duration: 30
                  })),
                  category: selectedExercise.category.toLowerCase() as any,
                  effectiveness: 0,
                  timesUsed: 0
                }}
                onComplete={() => {
                  console.log('Exercise completed');
                  setSelectedExercise(null);
                }}
                onExit={() => setSelectedExercise(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mood Tracker Modal */}
      {showMoodTracker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <AdvancedMoodTracker
                onSave={(moodData) => {
                  console.log('Mood saved:', moodData);
                  setShowMoodTracker(false);
                }}
                onClose={() => setShowMoodTracker(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Thought Journal Modal */}
      {showThoughtJournal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    Thought Journal
                  </h2>
                  <p className="text-muted-foreground mt-1">Record and reflect on your thoughts</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowThoughtJournal(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">What's on your mind?</label>
                  <textarea 
                    className="w-full min-h-[200px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Write your thoughts here... Be honest and open with yourself."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">How do you feel about this?</label>
                    <select className="w-full p-2 border rounded-lg">
                      <option>Select emotion...</option>
                      <option>Happy</option>
                      <option>Sad</option>
                      <option>Anxious</option>
                      <option>Angry</option>
                      <option>Confused</option>
                      <option>Hopeful</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Intensity (1-10)</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Challenge negative thoughts (optional)</label>
                  <textarea 
                    className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="If this thought is negative, can you reframe it in a more balanced way?"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline" onClick={() => setShowThoughtJournal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    console.log('Journal entry saved');
                    setShowThoughtJournal(false);
                  }}>
                    Save Entry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Network Modal */}
      {showSupportNetwork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-6 w-6 text-wellness-energy" />
                    Support Network
                  </h2>
                  <p className="text-muted-foreground mt-1">Connect with peers and mental health professionals</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSupportNetwork(false)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                {/* Crisis Helplines */}
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5 text-destructive" />
                      Emergency Helplines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div>
                        <h4 className="font-semibold">KIRAN Mental Health Helpline</h4>
                        <p className="text-sm text-muted-foreground">24/7 Support in multiple languages</p>
                      </div>
                      <a href="tel:18005990019" className="text-lg font-bold text-destructive">1800-599-0019</a>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div>
                        <h4 className="font-semibold">Vandrevala Foundation</h4>
                        <p className="text-sm text-muted-foreground">Mental health support & counseling</p>
                      </div>
                      <a href="tel:18602662345" className="text-lg font-bold text-destructive">1860-266-2345</a>
                    </div>
                  </CardContent>
                </Card>

                {/* Peer Support */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Peer Support Groups</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">Saathi Peer Groups</h4>
                        <Badge>Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Connect with peers and share your mental wellness journey</p>
                      <Button 
                        size="sm" 
                        onClick={() => window.open('https://discord.gg/THdJJrxnCS', '_blank', 'noopener noreferrer')}
                      >
                        Join on Discord
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Anxiety & Stress Support</h4>
                      <p className="text-sm text-muted-foreground mb-3">Share experiences and coping strategies</p>
                      <Button size="sm" variant="outline">Coming Soon</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Help */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Professional Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Find a Therapist</h4>
                      <p className="text-sm text-muted-foreground mb-3">Connect with licensed mental health professionals</p>
                      <Button size="sm" variant="outline">Search Therapists</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Campus Counseling</h4>
                      <p className="text-sm text-muted-foreground mb-3">Free counseling services at your institution</p>
                      <Button size="sm" variant="outline">Find Resources</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCenter;