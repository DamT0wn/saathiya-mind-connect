import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ChatState, ConversationContext, UserProfile, Message, MoodEntry } from '@/types/chat';

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMood: (mood: any) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  startExercise: (exerciseId: string) => void;
  endExercise: () => void;
  setTyping: (isTyping: boolean) => void;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'UPDATE_CONTEXT'; payload: Partial<ConversationContext> }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'START_EXERCISE'; payload: string }
  | { type: 'END_EXERCISE' }
  | { type: 'TOGGLE_MOOD_TRACKER' }
  | { type: 'TOGGLE_RESOURCES' }
  | { type: 'SET_VOICE_MODE'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: ChatState };

const initialState: ChatState = {
  messages: [
    {
      id: '1',
      content: "Namaste! I'm your Saathiya 🙏 I'm here to listen and support you. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ],
  context: {
    sessionId: crypto.randomUUID(),
    userId: 'default-user',
    currentMood: {
      primary: 'neutral',
      intensity: 5,
      secondaryEmotions: [],
      timestamp: new Date()
    },
    moodHistory: [],
    conversationTopics: [],
    activeGoals: [],
    riskLevel: 'low',
    sessionDuration: 0,
    messagesCount: 1,
  },
  userProfile: {
    id: 'default-user',
    preferredLanguage: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    goals: [],
    triggers: [],
    copingStrategies: [],
    preferredExercises: [],
    emergencyContacts: [],
    createdAt: new Date(),
    lastActive: new Date()
  },
  isTyping: false,
  showMoodTracker: false,
  showResources: false,
  isVoiceMode: false
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        context: {
          ...state.context,
          messagesCount: state.context.messagesCount + 1,
          lastCheckIn: new Date()
        }
      };

    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      };

    case 'UPDATE_CONTEXT':
      return {
        ...state,
        context: {
          ...state.context,
          ...action.payload
        }
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.payload,
          lastActive: new Date()
        }
      };

    case 'START_EXERCISE':
      return {
        ...state,
        currentExercise: getExerciseById(action.payload)
      };

    case 'END_EXERCISE':
      return {
        ...state,
        currentExercise: undefined
      };

    case 'TOGGLE_MOOD_TRACKER':
      return {
        ...state,
        showMoodTracker: !state.showMoodTracker
      };

    case 'TOGGLE_RESOURCES':
      return {
        ...state,
        showResources: !state.showResources
      };

    case 'SET_VOICE_MODE':
      return {
        ...state,
        isVoiceMode: action.payload
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

// Temporary function - will be replaced with actual exercise data
function getExerciseById(id: string) {
  return undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('saathiya-chat-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Convert date strings back to Date objects
        parsedState.messages = parsedState.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load saved chat state:', error);
      }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('saathiya-chat-state', JSON.stringify(state));
  }, [state]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
  };

  const updateMood = (mood: any) => {
    const moodEntry: MoodEntry = {
      id: crypto.randomUUID(),
      ...mood,
      timestamp: new Date()
    };
    
    dispatch({
      type: 'UPDATE_CONTEXT',
      payload: {
        currentMood: mood,
        moodHistory: [...state.context.moodHistory, moodEntry]
      }
    });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  const startExercise = (exerciseId: string) => {
    dispatch({ type: 'START_EXERCISE', payload: exerciseId });
  };

  const endExercise = () => {
    dispatch({ type: 'END_EXERCISE' });
  };

  const setTyping = (isTyping: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: isTyping });
  };

  return (
    <ChatContext.Provider value={{
      state,
      dispatch,
      addMessage,
      updateMood,
      updateUserProfile,
      startExercise,
      endExercise,
      setTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}