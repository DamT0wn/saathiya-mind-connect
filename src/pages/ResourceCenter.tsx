import { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { ResourceLibrary } from "@/components/ResourceLibrary";
import { ExercisePlayer } from "@/components/ExercisePlayer";
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
  Zap
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ResourceCenter = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

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
    { id: 'library', label: 'Resource Library', icon: BookOpen },
    { id: 'exercises', label: 'Therapeutic Exercises', icon: Play },
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
            <Badge className="ml-auto">Available Now</Badge>
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
        {activeTab === 'library' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Mental Health Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResourceLibrary onClose={() => {}} />
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
                  <Star className="h-5 w-5" />
                  Featured Exercises
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
                  <div className="p-6 border rounded-lg text-center">
                    <Heart className="h-8 w-8 mx-auto mb-3 text-wellness-calm" />
                    <h3 className="font-semibold mb-2">Mood Tracker</h3>
                    <p className="text-sm text-muted-foreground mb-4">Track your daily mood and emotions</p>
                    <Button variant="outline" className="w-full">Open Tracker</Button>
                  </div>
                  
                  <div className="p-6 border rounded-lg text-center">
                    <Brain className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">Thought Journal</h3>
                    <p className="text-sm text-muted-foreground mb-4">Record and analyze your thoughts</p>
                    <Button variant="outline" className="w-full">Start Journal</Button>
                  </div>
                  
                  <div className="p-6 border rounded-lg text-center">
                    <Users className="h-8 w-8 mx-auto mb-3 text-wellness-energy" />
                    <h3 className="font-semibold mb-2">Support Network</h3>
                    <p className="text-sm text-muted-foreground mb-4">Connect with peers and professionals</p>
                    <Button variant="outline" className="w-full">Find Support</Button>
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
    </div>
  );
};

export default ResourceCenter;