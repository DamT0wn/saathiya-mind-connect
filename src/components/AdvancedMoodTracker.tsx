import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MoodEntry } from '@/types/chat';
import { useChatContext } from '@/contexts/ChatContext';

const moodOptions = [
  { name: 'Happy', emoji: '😊', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Sad', emoji: '😢', color: 'bg-blue-100 text-blue-800' },
  { name: 'Anxious', emoji: '😰', color: 'bg-orange-100 text-orange-800' },
  { name: 'Angry', emoji: '😠', color: 'bg-red-100 text-red-800' },
  { name: 'Calm', emoji: '😌', color: 'bg-green-100 text-green-800' },
  { name: 'Excited', emoji: '🤩', color: 'bg-purple-100 text-purple-800' },
  { name: 'Tired', emoji: '😴', color: 'bg-gray-100 text-gray-800' },
  { name: 'Confused', emoji: '😕', color: 'bg-indigo-100 text-indigo-800' },
  { name: 'Grateful', emoji: '🙏', color: 'bg-pink-100 text-pink-800' },
  { name: 'Frustrated', emoji: '😤', color: 'bg-red-100 text-red-800' },
  { name: 'Lonely', emoji: '😔', color: 'bg-blue-100 text-blue-800' },
  { name: 'Content', emoji: '☺️', color: 'bg-green-100 text-green-800' }
];

const lifeFactors = [
  { key: 'sleep', label: 'Sleep Quality', icon: '😴' },
  { key: 'exercise', label: 'Physical Activity', icon: '🏃‍♂️' },
  { key: 'social', label: 'Social Connection', icon: '👥' },
  { key: 'work', label: 'Work/Study', icon: '📚' },
  { key: 'health', label: 'Physical Health', icon: '🏥' }
];

interface AdvancedMoodTrackerProps {
  onSave: (moodEntry: Omit<MoodEntry, 'id'>) => void;
  onClose: () => void;
}

export function AdvancedMoodTracker({ onSave, onClose }: AdvancedMoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [intensity, setIntensity] = useState([5]);
  const [secondaryEmotions, setSecondaryEmotions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [factors, setFactors] = useState({
    sleep: 5,
    exercise: 5,
    social: 5,
    work: 5,
    health: 5
  });
  const [triggers, setTriggers] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);

  const commonTriggers = [
    'Work stress', 'Relationship issues', 'Financial worry', 'Health concerns',
    'Family problems', 'Academic pressure', 'Social situations', 'Weather',
    'Sleep issues', 'Physical pain', 'Loneliness', 'Uncertainty'
  ];

  const commonActivities = [
    'Exercise', 'Meditation', 'Reading', 'Music', 'Friends', 'Family time',
    'Work', 'Study', 'Cooking', 'Walking', 'Movies', 'Gaming', 'Art', 'Writing'
  ];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSecondaryEmotion = (emotion: string) => {
    setSecondaryEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleTriggerToggle = (trigger: string) => {
    setTriggers(prev => 
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleActivityToggle = (activity: string) => {
    setActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleFactorChange = (factor: string, value: number[]) => {
    setFactors(prev => ({ ...prev, [factor]: value[0] }));
  };

  const handleSave = () => {
    if (!selectedMood) return;

    const moodEntry: Omit<MoodEntry, 'id'> = {
      primary: selectedMood,
      intensity: intensity[0],
      secondaryEmotions,
      triggers: triggers.length > 0 ? triggers : undefined,
      timestamp: new Date(),
      notes: notes || undefined,
      activities: activities.length > 0 ? activities : undefined,
      factors
    };

    onSave(moodEntry);
    onClose();
  };

  const getIntensityLabel = (value: number) => {
    if (value <= 2) return 'Very Low';
    if (value <= 4) return 'Low';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'High';
    return 'Very High';
  };

  const getIntensityColor = (value: number) => {
    if (value <= 3) return 'text-green-600';
    if (value <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">How are you feeling?</h3>
          <p className="text-sm text-muted-foreground">
            Take a moment to check in with yourself
          </p>
        </div>

        {/* Primary Mood Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Primary Mood *</label>
          <div className="grid grid-cols-3 gap-2">
            {moodOptions.map((mood) => (
              <Button
                key={mood.name}
                variant={selectedMood === mood.name ? "default" : "outline"}
                className="h-auto py-3 flex-col gap-1"
                onClick={() => handleMoodSelect(mood.name)}
              >
                <span className="text-xl">{mood.emoji}</span>
                <span className="text-xs">{mood.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        {selectedMood && (
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Intensity: {intensity[0]} - {getIntensityLabel(intensity[0])}
            </label>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Low</span>
              <span className={getIntensityColor(intensity[0])}>
                {getIntensityLabel(intensity[0])}
              </span>
              <span>Very High</span>
            </div>
          </div>
        )}

        {/* Secondary Emotions */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Secondary Emotions (optional)</label>
          <div className="flex flex-wrap gap-2">
            {moodOptions
              .filter(mood => mood.name !== selectedMood)
              .slice(0, 8)
              .map((mood) => (
                <Badge
                  key={mood.name}
                  variant={secondaryEmotions.includes(mood.name) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleSecondaryEmotion(mood.name)}
                >
                  {mood.emoji} {mood.name}
                </Badge>
              ))}
          </div>
        </div>

        {/* Life Factors */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Life Factors (1-10)</label>
          {lifeFactors.map((factor) => (
            <div key={factor.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {factor.icon} {factor.label}
                </span>
                <span className="text-sm font-medium">
                  {factors[factor.key as keyof typeof factors]}
                </span>
              </div>
              <Slider
                value={[factors[factor.key as keyof typeof factors]]}
                onValueChange={(value) => handleFactorChange(factor.key, value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Triggers */}
        <div className="space-y-3">
          <label className="text-sm font-medium">What might have triggered this mood?</label>
          <div className="flex flex-wrap gap-2">
            {commonTriggers.map((trigger) => (
              <Badge
                key={trigger}
                variant={triggers.includes(trigger) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTriggerToggle(trigger)}
              >
                {trigger}
              </Badge>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="space-y-3">
          <label className="text-sm font-medium">What have you been doing today?</label>
          <div className="flex flex-wrap gap-2">
            {commonActivities.map((activity) => (
              <Badge
                key={activity}
                variant={activities.includes(activity) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleActivityToggle(activity)}
              >
                {activity}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Additional Notes (optional)</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling? What's on your mind?"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedMood}
            className="flex-1"
          >
            Save Mood Check-in
          </Button>
        </div>
      </div>
    </Card>
  );
}