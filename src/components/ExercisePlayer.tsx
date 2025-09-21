import { useState, useEffect } from 'react';
import { TherapeuticExercise, ExerciseStep } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle } from 'lucide-react';

interface ExercisePlayerProps {
  exercise: TherapeuticExercise;
  onComplete: () => void;
  onExit: () => void;
}

export function ExercisePlayer({ exercise, onComplete, onExit }: ExercisePlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = exercise.steps[currentStepIndex];
  const totalSteps = exercise.steps.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  useEffect(() => {
    if (currentStep) {
      setTimeRemaining(currentStep.duration || 0);
    }
  }, [currentStep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleNextStep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setIsPlaying(false);
    } else {
      setIsCompleted(true);
      setIsPlaying(false);
      onComplete();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    return (
      <Card className="p-6 bg-gradient-to-r from-success/10 to-wellness-calm/10 border-success/20">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-success mx-auto" />
          <h3 className="text-xl font-semibold text-success">Exercise Complete!</h3>
          <p className="text-muted-foreground">
            Great job completing the {exercise.title}. How are you feeling now?
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRestart} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Do Again
            </Button>
            <Button onClick={onExit} variant="default">
              Finish
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-wellness-calm/5">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">{exercise.title}</h3>
          <p className="text-sm text-muted-foreground">{exercise.description}</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStepIndex + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step */}
        <div className="text-center space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
            <p className="text-lg leading-relaxed">{currentStep.instruction}</p>
          </div>

          {/* Timer */}
          {currentStep.duration && (
            <div className="space-y-2">
              <div className="text-3xl font-mono font-bold text-primary">
                {formatTime(timeRemaining)}
              </div>
              <div className="w-32 mx-auto">
                <Progress 
                  value={currentStep.duration ? ((currentStep.duration - timeRemaining) / currentStep.duration) * 100 : 0} 
                  className="h-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>

          {currentStep.duration ? (
            <Button
              onClick={isPlaying ? handlePause : handlePlay}
              variant="default"
              size="sm"
              className="min-w-[100px]"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNextStep} variant="default" size="sm">
              <SkipForward className="h-4 w-4 mr-2" />
              Continue
            </Button>
          )}

          <Button
            onClick={handleNextStep}
            disabled={currentStepIndex === totalSteps - 1}
            variant="outline"
            size="sm"
          >
            Skip
          </Button>
        </div>

        {/* Exit */}
        <div className="text-center">
          <Button onClick={onExit} variant="ghost" size="sm">
            Exit Exercise
          </Button>
        </div>
      </div>
    </Card>
  );
}