import { TherapeuticExercise } from '@/types/chat';

export const therapeuticExercises: TherapeuticExercise[] = [
  {
    id: 'breathing-478',
    title: '4-7-8 Breathing Technique',
    description: 'A powerful breathing exercise to reduce anxiety and promote calm',
    category: 'breathing',
    duration: 5,
    effectiveness: 4.5,
    timesUsed: 0,
    steps: [
      {
        id: '1',
        instruction: 'Find a comfortable position and close your eyes or soften your gaze',
        duration: 10
      },
      {
        id: '2',
        instruction: 'Exhale completely through your mouth, making a whoosh sound',
        duration: 5
      },
      {
        id: '3',
        instruction: 'Close your mouth and inhale quietly through your nose for 4 counts',
        duration: 4
      },
      {
        id: '4',
        instruction: 'Hold your breath for 7 counts',
        duration: 7
      },
      {
        id: '5',
        instruction: 'Exhale through your mouth for 8 counts, making a whoosh sound',
        duration: 8
      },
      {
        id: '6',
        instruction: 'This completes one cycle. Repeat 3-4 more times',
        duration: 60
      }
    ]
  },
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1 Grounding Exercise',
    description: 'Use your senses to ground yourself in the present moment',
    category: 'grounding',
    duration: 3,
    effectiveness: 4.2,
    timesUsed: 0,
    steps: [
      {
        id: '1',
        instruction: 'Take a deep breath and look around you',
        duration: 5
      },
      {
        id: '2',
        instruction: 'Name 5 things you can SEE around you',
        duration: 30
      },
      {
        id: '3',
        instruction: 'Name 4 things you can TOUCH around you',
        duration: 25
      },
      {
        id: '4',
        instruction: 'Name 3 things you can HEAR right now',
        duration: 20
      },
      {
        id: '5',
        instruction: 'Name 2 things you can SMELL',
        duration: 15
      },
      {
        id: '6',
        instruction: 'Name 1 thing you can TASTE',
        duration: 10
      },
      {
        id: '7',
        instruction: 'Take three more deep breaths. Notice how you feel now.',
        duration: 15
      }
    ]
  },
  {
    id: 'progressive-muscle-relaxation',
    title: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and relax muscle groups to release physical tension',
    category: 'meditation',
    duration: 15,
    effectiveness: 4.3,
    timesUsed: 0,
    steps: [
      {
        id: '1',
        instruction: 'Lie down or sit comfortably with your eyes closed',
        duration: 30
      },
      {
        id: '2',
        instruction: 'Tense your toes and feet for 5 seconds, then relax completely',
        duration: 10
      },
      {
        id: '3',
        instruction: 'Tense your calf muscles for 5 seconds, then relax',
        duration: 10
      },
      {
        id: '4',
        instruction: 'Tense your thigh muscles for 5 seconds, then relax',
        duration: 10
      },
      {
        id: '5',
        instruction: 'Tense your buttocks and abdomen for 5 seconds, then relax',
        duration: 10
      },
      {
        id: '6',
        instruction: 'Tense your hands and arms for 5 seconds, then relax',
        duration: 10
      },
      {
        id: '7',
        instruction: 'Tense your shoulders and neck for 5 seconds, then relax',
        duration: 10
      },
      {
        id: '8',
        instruction: 'Tense your facial muscles for 5 seconds, then relax',
        duration: 10
      },
      {
        id: '9',
        instruction: 'Notice the difference between tension and relaxation throughout your body',
        duration: 60
      }
    ]
  },
  {
    id: 'mindful-breathing',
    title: 'Mindful Breathing Meditation',
    description: 'Focus on your breath to cultivate mindfulness and presence',
    category: 'mindfulness',
    duration: 10,
    effectiveness: 4.4,
    timesUsed: 0,
    steps: [
      {
        id: '1',
        instruction: 'Sit comfortably with your spine straight and eyes closed',
        duration: 30
      },
      {
        id: '2',
        instruction: 'Bring your attention to your natural breathing',
        duration: 30
      },
      {
        id: '3',
        instruction: 'Notice the sensation of air entering your nostrils',
        duration: 60
      },
      {
        id: '4',
        instruction: 'Follow your breath as it fills your lungs',
        duration: 60
      },
      {
        id: '5',
        instruction: 'Notice the pause between inhale and exhale',
        duration: 60
      },
      {
        id: '6',
        instruction: 'Follow your breath as it leaves your body',
        duration: 60
      },
      {
        id: '7',
        instruction: 'When your mind wanders, gently return to your breath',
        duration: 300
      },
      {
        id: '8',
        instruction: 'Take a moment to appreciate this time you gave yourself',
        duration: 30
      }
    ]
  },
  {
    id: 'worry-time',
    title: 'Scheduled Worry Time',
    description: 'CBT technique to contain worrying to a specific time period',
    category: 'cbt',
    duration: 10,
    effectiveness: 3.8,
    timesUsed: 0,
    steps: [
      {
        id: '1',
        instruction: 'Set aside 10-15 minutes as your designated "worry time"',
        duration: 30
      },
      {
        id: '2',
        instruction: 'Write down all your current worries and concerns',
        duration: 180
      },
      {
        id: '3',
        instruction: 'For each worry, ask: "Is this something I can control?"',
        duration: 120
      },
      {
        id: '4',
        instruction: 'For controllable worries, write one small action you can take',
        duration: 120
      },
      {
        id: '5',
        instruction: 'For uncontrollable worries, practice accepting uncertainty',
        duration: 90
      },
      {
        id: '6',
        instruction: 'When worry time ends, remind yourself to save new worries for tomorrow',
        duration: 30
      }
    ]
  },
  {
    id: 'gratitude-practice',
    title: 'Gratitude Reflection',
    description: 'Focus on positive aspects of life to improve mood and perspective',
    category: 'mindfulness',
    duration: 5,
    effectiveness: 4.0,
    timesUsed: 0,
    steps: [
      {
        id: '1',
        instruction: 'Find a quiet moment and take three deep breaths',
        duration: 30
      },
      {
        id: '2',
        instruction: 'Think of three things you\'re grateful for today',
        duration: 60
      },
      {
        id: '3',
        instruction: 'For each item, reflect on why it matters to you',
        duration: 90
      },
      {
        id: '4',
        instruction: 'Notice the positive feelings that arise',
        duration: 60
      },
      {
        id: '5',
        instruction: 'Consider sharing your gratitude with someone',
        duration: 30
      }
    ]
  }
];

export function getExerciseById(id: string): TherapeuticExercise | undefined {
  return therapeuticExercises.find(exercise => exercise.id === id);
}

export function getExercisesByCategory(category: TherapeuticExercise['category']): TherapeuticExercise[] {
  return therapeuticExercises.filter(exercise => exercise.category === category);
}

export function getRecommendedExercises(mood: string, riskLevel: string): TherapeuticExercise[] {
  if (riskLevel === 'high' || riskLevel === 'critical') {
    return therapeuticExercises.filter(ex => 
      ex.category === 'breathing' || ex.category === 'grounding'
    );
  }

  switch (mood.toLowerCase()) {
    case 'anxious':
    case 'nervous':
    case 'worried':
      return therapeuticExercises.filter(ex => 
        ex.category === 'breathing' || ex.category === 'grounding' || ex.category === 'cbt'
      );
    
    case 'sad':
    case 'depressed':
    case 'lonely':
      return therapeuticExercises.filter(ex => 
        ex.category === 'mindfulness' || ex.id === 'gratitude-practice'
      );
    
    case 'stressed':
    case 'overwhelmed':
      return therapeuticExercises.filter(ex => 
        ex.category === 'meditation' || ex.category === 'breathing'
      );
    
    default:
      return therapeuticExercises.slice(0, 3); // Return top 3 general exercises
  }
}