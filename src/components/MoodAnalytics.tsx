import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useChatContext } from '@/contexts/ChatContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, isAfter, isBefore } from 'date-fns';
import { useMemo, useEffect } from 'react';

interface MoodAnalyticsProps {
  onClose: () => void;
  modal?: boolean; // if false, render inline without overlay
}

export function MoodAnalytics({ onClose, modal = true }: MoodAnalyticsProps) {
  const { state, dispatch } = useChatContext();
  const { moodHistory } = state.context;

  // Auto-refresh when mood data changes
  useEffect(() => {
    console.log('Mood Analytics refreshed - entries count:', moodHistory.length);
  }, [moodHistory]);

  // Prepare data for charts with better date handling
  const last7Days = useMemo(() => (
    Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, 'MMM dd'),
        fullDate: date,
        moods: moodHistory.filter(mood => {
          const moodDate = new Date(mood.timestamp);
          const dayStart = startOfDay(date);
          const dayEnd = endOfDay(date);
          return moodDate >= dayStart && moodDate <= dayEnd;
        })
      };
    }).reverse()
  ), [moodHistory]);

  const moodTrendData = useMemo(() => last7Days.map(day => ({
    date: day.date,
    averageIntensity: day.moods.length > 0 
      ? day.moods.reduce((sum, mood) => sum + mood.intensity, 0) / day.moods.length 
      : null,
    entryCount: day.moods.length
  })), [last7Days]);

  // Mood distribution
  const moodCounts = useMemo(() => moodHistory.reduce((acc, mood) => {
    acc[mood.primary] = (acc[mood.primary] || 0) + 1;
    return acc;
  }, {} as Record<string, number>), [moodHistory]);

  const moodDistributionData = useMemo(() => Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood,
    value: count,
    percentage: ((count / Math.max(moodHistory.length, 1)) * 100).toFixed(1)
  })), [moodCounts, moodHistory.length]);

  // Life factors analysis
  const avgFactors = useMemo(() => moodHistory.reduce((acc, mood) => {
    if (mood.factors) {
      Object.entries(mood.factors).forEach(([factor, value]) => {
        if (!acc[factor]) acc[factor] = { sum: 0, count: 0 };
        acc[factor].sum += value as number;
        acc[factor].count += 1;
      });
    }
    return acc;
  }, {} as Record<string, { sum: number; count: number }>), [moodHistory]);

  const factorsData = useMemo(() => Object.entries(avgFactors).map(([factor, data]) => ({
    factor: factor.charAt(0).toUpperCase() + factor.slice(1),
    average: data.count > 0 ? data.sum / data.count : 0,
    icon: getFactorIcon(factor)
  })), [avgFactors]);

  // Common triggers
  const triggerCounts = useMemo(() => moodHistory.reduce((acc, mood) => {
    if (mood.triggers) {
      mood.triggers.forEach(trigger => {
        acc[trigger] = (acc[trigger] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>), [moodHistory]);

  const topTriggers = useMemo(() => Object.entries(triggerCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5), [triggerCounts]);

  // Calculate mood trend (only show after 4 entries)
  const moodTrend = useMemo(() => {
    if (moodHistory.length < 4) return null;
    
    // Get the last 4 entries
    const recentMoods = moodHistory.slice(-4);
    const firstTwo = recentMoods.slice(0, 2);
    const lastTwo = recentMoods.slice(-2);
    
    const avgFirst = firstTwo.reduce((sum, mood) => sum + mood.intensity, 0) / firstTwo.length;
    const avgLast = lastTwo.reduce((sum, mood) => sum + mood.intensity, 0) / lastTwo.length;
    
    const difference = avgLast - avgFirst;
    
    return {
      direction: difference > 0.5 ? 'improving' : difference < -0.5 ? 'declining' : 'stable',
      difference: Math.abs(difference).toFixed(1),
      avgFirst: avgFirst.toFixed(1),
      avgLast: avgLast.toFixed(1)
    };
  }, [moodHistory]);

  function getFactorIcon(factor: string) {
    switch (factor) {
      case 'sleep': return '😴';
      case 'exercise': return '🏃‍♂️';
      case 'social': return '👥';
      case 'work': return '📚';
      case 'health': return '🏥';
      default: return '📊';
    }
  }

  const getFactorColor = (value: number) => {
    if (value >= 7) return 'text-green-600';
    if (value >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  if (moodHistory.length === 0) {
    const emptyInner = (
      <Card className="w-full max-w-2xl p-8 text-center">
          <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Mood Data Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start tracking your mood to see insightful analytics about your mental wellness journey.
          </p>
          <div className="flex gap-3 justify-center">
              <Button onClick={() => {
              dispatch({ type: 'TOGGLE_MOOD_TRACKER' });
            }}>
              Track Mood Now
            </Button>
            {modal && (
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            )}
          </div>
      </Card>
    );
    if (!modal) return emptyInner;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        {emptyInner}
      </div>
    );
  }

  const inner = (
    <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Mood Analytics</h2>
            <p className="text-muted-foreground">
              Insights from your mental wellness journey
            </p>
          </div>
          {modal && (
            <Button onClick={onClose} variant="outline">Close</Button>
          )}
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Check-ins</p>
                    <p className="text-2xl font-bold">{moodHistory.length}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Pattern</p>
                    <p className="text-2xl font-bold">
                      {(moodHistory.reduce((sum, mood) => sum + mood.intensity, 0) / moodHistory.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Most Common</p>
                    <p className="text-lg font-semibold capitalize">
                      {moodDistributionData.length > 0 ? moodDistributionData[0].name : 'No data yet'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-lg font-semibold">
                      {last7Days.reduce((sum, day) => sum + day.moods.length, 0)} entries
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Mood Trend Section - Only show after 4 entries */}
            {moodTrend ? (
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  {moodTrend.direction === 'improving' && (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  )}
                  {moodTrend.direction === 'declining' && (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  )}
                  {moodTrend.direction === 'stable' && (
                    <Activity className="h-6 w-6 text-blue-600" />
                  )}
                  <h3 className="text-lg font-semibold">
                    {moodTrend.direction === 'improving' && '📈 Your Mood is Improving!'}
                    {moodTrend.direction === 'declining' && '📉 Your Mood Needs Attention'}
                    {moodTrend.direction === 'stable' && '📊 Your Mood is Stable'}
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Based on your last 4 mood entries:
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Earlier Average</p>
                      <p className="text-2xl font-bold">{moodTrend.avgFirst}/10</p>
                    </div>
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Recent Average</p>
                      <p className="text-2xl font-bold">{moodTrend.avgLast}/10</p>
                    </div>
                  </div>
                  <p className="mt-3">
                    {moodTrend.direction === 'improving' && (
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        Great progress! Your mood has improved by {moodTrend.difference} points. Keep up the good work! 🎉
                      </span>
                    )}
                    {moodTrend.direction === 'declining' && (
                      <span className="text-red-700 dark:text-red-400 font-medium">
                        Your mood has decreased by {moodTrend.difference} points. Consider reaching out for support or trying wellness exercises.
                      </span>
                    )}
                    {moodTrend.direction === 'stable' && (
                      <span className="text-blue-700 dark:text-blue-400 font-medium">
                        Your mood has remained relatively stable. Keep maintaining your current wellness practices!
                      </span>
                    )}
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-muted/30 border-dashed">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-muted-foreground">Trend Analysis Coming Soon</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Detailed trend analysis will appear here based on your mood entries over time.
                  </p>
                  <p className="text-sm font-medium text-primary">
                    📊 Track {4 - moodHistory.length} more mood{4 - moodHistory.length !== 1 ? 's' : ''} to unlock trend insights
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Keep logging your moods to see patterns and track your emotional wellbeing journey!
                  </p>
                </div>
              </Card>
            )}

            {/* Mood Trend Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">7-Day Mood Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 10]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        typeof value === 'number' ? value.toFixed(1) : 'No data', 
                        'Average Intensity'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="averageIntensity" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mood Distribution */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Mood Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={moodDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                      >
                        {moodDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Life Factors */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Life Factors Average</h3>
                <div className="space-y-4">
                  {factorsData.map((factor) => (
                    <div key={factor.factor} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {factor.icon} {factor.factor}
                        </span>
                        <span className={`font-bold ${getFactorColor(factor.average)}`}>
                          {factor.average.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress value={factor.average * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Top Triggers */}
            {topTriggers.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Most Common Triggers</h3>
                <div className="flex flex-wrap gap-2">
                  {topTriggers.map(([trigger, count]) => (
                    <Badge key={trigger} variant="outline" className="text-sm">
                      {trigger} ({count})
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Insights */}
            <Card className="p-6 bg-primary/5">
              <h3 className="text-lg font-semibold mb-4">Insights & Recommendations</h3>
              <div className="space-y-3 text-sm">
                {factorsData.find(f => f.average < 5) && (
                  <div className="flex items-start gap-2">
                    <TrendingDown className="h-4 w-4 text-orange-500 mt-0.5" />
                    <p>
                      Consider focusing on improving your{' '}
                      <strong>{factorsData.find(f => f.average < 5)?.factor.toLowerCase()}</strong>{' '}
                      as it's scoring below average.
                    </p>
                  </div>
                )}
                
                {moodHistory.length >= 7 && (
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <p>
                      Great job maintaining consistent mood tracking! You've logged{' '}
                      <strong>{moodHistory.length} entries</strong> which helps identify patterns.
                    </p>
                  </div>
                )}

                {topTriggers.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p>
                      Your most common trigger is <strong>{topTriggers[0][0]}</strong>. 
                      Consider developing specific coping strategies for this.
                    </p>
                  </div>
                )}
              </div>
            </Card>
        </div>
      </div>
    </Card>
  );
  if (!modal) return inner;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {inner}
    </div>
  );
}