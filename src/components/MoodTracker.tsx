import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, TrendingUp, Heart, Plus, X } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";

const moodOptions = [
  { emoji: "😄", label: "Excellent", value: 5, color: "text-success" },
  { emoji: "😊", label: "Good", value: 4, color: "text-wellness-energy" },
  { emoji: "😐", label: "Okay", value: 3, color: "text-wellness-focus" },
  { emoji: "😔", label: "Not Great", value: 2, color: "text-warning" },
  { emoji: "😢", label: "Struggling", value: 1, color: "text-destructive" },
];

interface MoodTrackerProps {
  onClose?: () => void;
}

export function MoodTracker({ onClose }: MoodTrackerProps = {}) {
  const { updateMood } = useChatContext();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced mood tracking fields
  const [notes, setNotes] = useState("");
  const [triggers, setTriggers] = useState<string[]>([]);
  const [newTrigger, setNewTrigger] = useState("");
  const [factors, setFactors] = useState({
    sleep: 5,
    exercise: 5,
    social: 5,
    work: 5,
    health: 5
  });

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };

  const handleAddTrigger = () => {
    if (newTrigger.trim() && !triggers.includes(newTrigger.trim())) {
      setTriggers([...triggers, newTrigger.trim()]);
      setNewTrigger("");
    }
  };

  const handleRemoveTrigger = (trigger: string) => {
    setTriggers(triggers.filter(t => t !== trigger));
  };

  const handleFactorChange = (factor: string, value: number) => {
    setFactors(prev => ({ ...prev, [factor]: value }));
  };

  const handleSubmit = () => {
    if (selectedMood) {
      const selectedMoodOption = moodOptions.find(m => m.value === selectedMood);
      
      // Create comprehensive mood entry
      const moodEntry = {
        primary: selectedMoodOption?.label.toLowerCase() || 'neutral',
        intensity: selectedMood,
        secondaryEmotions: [],
        notes: notes.trim(),
        triggers: triggers,
        factors: factors,
        timestamp: new Date()
      };

      // Save to context/localStorage
      updateMood(moodEntry);
      
      setIsSubmitted(true);
      
      // Reset form after success message
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedMood(null);
        setNotes("");
        setTriggers([]);
        setNewTrigger("");
        setFactors({
          sleep: 5,
          exercise: 5,
          social: 5,
          work: 5,
          health: 5
        });
        setShowAdvanced(false);
        
        // Call onClose if provided (for modal usage)
        if (onClose) {
          onClose();
        }
      }, 3000);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center shadow-wellness">
            <CardContent className="p-8">
              <div className="animate-scale-in">
                <Heart className="h-16 w-16 text-success mx-auto mb-4 animate-pulse-gentle" />
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-muted-foreground">
                  Your mood has been recorded. Remember, every feeling is valid and temporary. 
                  You're doing great by checking in with yourself.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Are You Feeling Today?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Daily mood check-ins help you understand your emotional patterns and track your wellness journey
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-wellness">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Today's Mood Check</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mood Selection */}
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Select the option that best describes how you're feeling right now:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className="h-20 flex-col space-y-2 p-4 transition-all hover:scale-105"
                    onClick={() => handleMoodSelect(mood.value)}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs font-medium">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Advanced Options Toggle */}
            {selectedMood && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm"
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </Button>
              </div>
            )}

            {/* Advanced Mood Tracking */}
            {showAdvanced && selectedMood && (
              <div className="space-y-6 border-t pt-6">
                {/* Life Factors */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Life Factors (Rate 1-10)</Label>
                  {Object.entries(factors).map(([factor, value]) => (
                    <div key={factor} className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="capitalize">{factor}</Label>
                        <span className="text-sm text-muted-foreground">{value}/10</span>
                      </div>
                      <Input
                        type="range"
                        min="1"
                        max="10"
                        value={value}
                        onChange={(e) => handleFactorChange(factor, parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                {/* Triggers */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">What triggered this mood?</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a trigger (e.g., work stress, family)"
                      value={newTrigger}
                      onChange={(e) => setNewTrigger(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTrigger()}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddTrigger}
                      size="icon"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {triggers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {triggers.map((trigger) => (
                        <span
                          key={trigger}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm"
                        >
                          {trigger}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() => handleRemoveTrigger(trigger)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-base font-semibold">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="How are you feeling? What's on your mind? (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!selectedMood}
                variant="hero"
                size="lg"
                className="min-w-40"
              >
                Record Mood
              </Button>
            </div>

            {/* Mood Insights */}
            <div className="mt-8 p-4 bg-wellness-calm/10 rounded-lg border border-wellness-calm/20">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-wellness-calm" />
                <h4 className="font-semibold text-wellness-calm">Mood Insights</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Regular mood tracking helps identify patterns, triggers, and progress in your mental wellness journey. 
                Your data is private and encrypted - only you can see your mood trends.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}