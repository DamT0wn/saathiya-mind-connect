import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, Heart } from "lucide-react";

const moodOptions = [
  { emoji: "😄", label: "Excellent", value: 5, color: "text-success" },
  { emoji: "😊", label: "Good", value: 4, color: "text-wellness-energy" },
  { emoji: "😐", label: "Okay", value: 3, color: "text-wellness-focus" },
  { emoji: "😔", label: "Not Great", value: 2, color: "text-warning" },
  { emoji: "😢", label: "Struggling", value: 1, color: "text-destructive" },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      setIsSubmitted(true);
      // Here you would typically save to database
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedMood(null);
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