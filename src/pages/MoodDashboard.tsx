import { useState, useEffect, useMemo } from 'react';
import { Navigation } from "@/components/Navigation";
import { MoodAnalytics } from "@/components/MoodAnalytics";
import { MoodTracker } from "@/components/MoodTracker";
import { useChatContext } from "@/contexts/ChatContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Heart, 
  Activity,
  ArrowLeft,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Plus,
  Target,
  Award,
  Lightbulb
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const MoodDashboard = () => {
  const navigate = useNavigate();
  const { state } = useChatContext();
  const { moodHistory } = state.context;
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  // Calculate real mood statistics from ChatContext data
  const moodStats = useMemo(() => {
    if (!moodHistory || moodHistory.length === 0) {
      return [
        {
          icon: Heart,
          title: "Average Mood",
          value: "No data",
          change: "Start tracking your mood",
          color: "bg-muted",
          trend: "neutral"
        },
        {
          icon: Activity,
          title: "Mood Entries",
          value: "0",
          change: "This month",
          color: "bg-muted",
          trend: "neutral"
        },
        {
          icon: TrendingUp,
          title: "Improvement",
          value: "0%",
          change: "Over 30 days",
          color: "bg-muted",
          trend: "neutral"
        },
        {
          icon: Target,
          title: "Consistency",
          value: "0%",
          change: "Daily check-ins",
          color: "bg-muted",
          trend: "neutral"
        }
      ];
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Filter mood entries for different time periods
    const recentEntries = moodHistory.filter(entry => new Date(entry.timestamp) > thirtyDaysAgo);
    const thisWeekEntries = moodHistory.filter(entry => new Date(entry.timestamp) > sevenDaysAgo);
    const lastWeekEntries = moodHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate > previousWeekStart && entryDate <= sevenDaysAgo;
    });

    // Calculate average mood (last 30 days)
    const averageMood = recentEntries.length > 0 
      ? Number((recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length).toFixed(1))
      : 0;

    // Calculate this week and last week averages
    const thisWeekAvg = thisWeekEntries.length > 0 
      ? thisWeekEntries.reduce((sum, entry) => sum + entry.intensity, 0) / thisWeekEntries.length
      : 0;
    const lastWeekAvg = lastWeekEntries.length > 0 
      ? lastWeekEntries.reduce((sum, entry) => sum + entry.intensity, 0) / lastWeekEntries.length
      : 0;

    // Calculate weekly change
    const weeklyChange = lastWeekAvg > 0 ? thisWeekAvg - lastWeekAvg : 0;
    const weeklyChangeStr = weeklyChange > 0 ? `+${weeklyChange.toFixed(1)} from last week` :
                           weeklyChange < 0 ? `${weeklyChange.toFixed(1)} from last week` :
                           "Same as last week";

    // Calculate improvement over 30 days
    const firstHalfEntries = recentEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
      return entryDate <= fifteenDaysAgo;
    });
    const secondHalfEntries = recentEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
      return entryDate > fifteenDaysAgo;
    });

    const firstHalfAvg = firstHalfEntries.length > 0 
      ? firstHalfEntries.reduce((sum, entry) => sum + entry.intensity, 0) / firstHalfEntries.length
      : 0;
    const secondHalfAvg = secondHalfEntries.length > 0 
      ? secondHalfEntries.reduce((sum, entry) => sum + entry.intensity, 0) / secondHalfEntries.length
      : 0;

    const improvement = firstHalfAvg > 0 
      ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100)
      : 0;

    // Calculate consistency (unique days with entries in last 30 days)
    const uniqueDays = new Set(recentEntries.map(entry => 
      new Date(entry.timestamp).toDateString()
    )).size;
    const consistency = Math.round((uniqueDays / 30) * 100);

    return [
      {
        icon: Heart,
        title: "Average Mood",
        value: averageMood > 0 ? `${averageMood}/10` : "No data",
        change: weeklyChange !== 0 ? weeklyChangeStr : "No weekly data",
        color: averageMood >= 7 ? "bg-success" : averageMood >= 5 ? "bg-wellness-energy" : averageMood > 0 ? "bg-destructive" : "bg-muted",
        trend: weeklyChange > 0 ? "up" : weeklyChange < 0 ? "down" : "stable"
      },
      {
        icon: Activity,
        title: "Mood Entries",
        value: recentEntries.length.toString(),
        change: "This month",
        color: recentEntries.length >= 20 ? "bg-success" : recentEntries.length >= 10 ? "bg-primary" : recentEntries.length > 0 ? "bg-wellness-energy" : "bg-muted",
        trend: recentEntries.length >= 15 ? "up" : "stable"
      },
      {
        icon: TrendingUp,
        title: "Improvement",
        value: `${improvement}%`,
        change: "Over 30 days",
        color: improvement > 0 ? "bg-success" : improvement < 0 ? "bg-destructive" : "bg-wellness-energy",
        trend: improvement > 0 ? "up" : improvement < 0 ? "down" : "stable"
      },
      {
        icon: Target,
        title: "Consistency",
        value: `${consistency}%`,
        change: "Daily check-ins",
        color: consistency >= 80 ? "bg-success" : consistency >= 60 ? "bg-wellness-calm" : consistency >= 30 ? "bg-wellness-energy" : "bg-muted",
        trend: consistency >= 70 ? "up" : "stable"
      }
    ];
  }, [moodHistory]);

  const insights = [
    {
      icon: Lightbulb,
      title: "Sleep Pattern Impact",
      description: "Your mood scores are 15% higher on days when you sleep 7+ hours.",
      type: "positive"
    },
    {
      icon: Activity,
      title: "Exercise Correlation",
      description: "Physical activity on weekends correlates with better Monday mood ratings.",
      type: "positive"
    },
    {
      icon: Calendar,
      title: "Weekly Pattern",
      description: "Stress levels tend to peak on Tuesdays. Consider planning lighter schedules.",
      type: "neutral"
    },
    {
      icon: Award,
      title: "Milestone Reached",
      description: "Congratulations! You've maintained consistent mood tracking for 30 days.",
      type: "achievement"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: LineChart },
    { id: 'patterns', label: 'Patterns', icon: PieChart },
    { id: 'insights', label: 'Insights', icon: Lightbulb }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSectionClick={handleSectionClick} activeSection="mood" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-wellness-calm/10 via-primary/10 to-wellness-energy/10 border-b">
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
              <div className="p-3 bg-wellness-calm text-white rounded-xl">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Mood Analytics Dashboard</h1>
                <p className="text-muted-foreground">Track your mental wellness journey with detailed insights</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Badge>Connect Now</Badge>
              <Button onClick={() => setShowMoodTracker(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {moodStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                      </div>
                      <div className={`${stat.color} p-2 rounded-lg text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Mood Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MoodAnalytics onClose={() => {}} modal={false} />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <MoodAnalytics onClose={() => {}} modal={false} />
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Mood Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Daily Patterns</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Morning</span>
                        <Badge variant="secondary">High Energy</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Afternoon</span>
                        <Badge variant="secondary">Stable Mood</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Evening</span>
                        <Badge variant="outline">Reflection Time</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Weekly Patterns</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Monday - Wednesday</span>
                        <Badge variant="secondary">Goal-Focused</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Thursday - Friday</span>
                        <Badge variant="outline">Stress Management</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Weekend</span>
                        <Badge variant="secondary">Recovery & Rest</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Personalized Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    const bgColor = insight.type === 'positive' ? 'bg-success/5 border-success/20' :
                                   insight.type === 'achievement' ? 'bg-primary/5 border-primary/20' :
                                   'bg-muted/30 border-muted';
                    
                    return (
                      <div key={index} className={`p-4 rounded-lg border ${bgColor}`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            insight.type === 'positive' ? 'bg-success text-white' :
                            insight.type === 'achievement' ? 'bg-primary text-white' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Mood Tracker Modal */}
      {showMoodTracker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Quick Mood Check-in</h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowMoodTracker(false)}
                >
                  ×
                </Button>
              </div>
              <MoodTracker
                onClose={() => setShowMoodTracker(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodDashboard;