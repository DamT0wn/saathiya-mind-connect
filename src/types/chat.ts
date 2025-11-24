export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  mood?: string;
  sentiment?: SentimentScore;
  type?: MessageType;
  metadata?: MessageMetadata;
  // Detected language for this message. Supported: English, Hindi, Kannada, Tamil.
  language?: SupportedLanguage;
}

export interface SentimentScore {
  score: number; // -1 to 1 (negative to positive)
  confidence: number; // 0 to 1
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
}

export type MessageType = 'text' | 'exercise' | 'resource' | 'check-in' | 'emergency';

export interface MessageMetadata {
  exerciseId?: string;
  resourceId?: string;
  followUpRequired?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UserProfile {
  id: string;
  name?: string;
  preferredLanguage: SupportedLanguage | 'both';
  timezone: string;
  goals: string[];
  triggers: string[];
  copingStrategies: string[];
  preferredExercises: string[];
  emergencyContacts: EmergencyContact[];
  createdAt: Date;
  lastActive: Date;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface ConversationContext {
  sessionId: string;
  userId: string;
  currentMood: MoodState;
  moodHistory: MoodEntry[];
  conversationTopics: string[];
  activeGoals: Goal[];
  lastExercise?: string;
  riskLevel: RiskLevel;
  sessionDuration: number;
  messagesCount: number;
  lastCheckIn?: Date;
}

export interface MoodState {
  primary: string;
  intensity: number; // 1-10
  secondaryEmotions: string[];
  triggers?: string[];
  timestamp: Date;
}

export interface MoodEntry extends MoodState {
  id: string;
  notes?: string;
  activities?: string[];
  factors?: {
    sleep: number;
    exercise: number;
    social: number;
    work: number;
    health: number;
  };
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'mood' | 'anxiety' | 'sleep' | 'social' | 'work' | 'health';
  target: number;
  current: number;
  deadline?: Date;
  isActive: boolean;
  createdAt: Date;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface TherapeuticExercise {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'meditation' | 'cbt' | 'mindfulness' | 'grounding';
  duration: number; // in minutes
  steps: ExerciseStep[];
  audioUrl?: string;
  effectiveness: number; // user rating
  lastUsed?: Date;
  timesUsed: number;
}

export interface ExerciseStep {
  id: string;
  instruction: string;
  duration?: number; // in seconds
  audioPrompt?: string;
  image?: string;
}

export interface ChatState {
  messages: Message[];
  context: ConversationContext;
  userProfile: UserProfile;
  isTyping: boolean;
  currentExercise?: TherapeuticExercise;
  showMoodTracker: boolean;
  showResources: boolean;
  isVoiceMode: boolean;
  // Last detected user language (session-level) to guide response generation
  lastUserLanguage?: SupportedLanguage;
}

// Central language union for reuse
export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta';

export interface ResponseTemplate {
  id: string;
  trigger: string[];
  responses: string[];
  context: string[];
  followUp?: string[];
  exercises?: string[];
  resources?: string[];
}