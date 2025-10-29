import { ResponseTemplate, Message, ConversationContext, SentimentScore } from '@/types/chat';
import { analyzeSentiment, detectCrisisKeywords, getDominantEmotion, getRiskLevel } from './sentimentAnalysis';

export const responseTemplates: ResponseTemplate[] = [
  // Crisis Response
  {
    id: 'crisis-suicide',
    trigger: ['suicide', 'kill myself', 'end it all', 'want to die'],
    responses: [
      "I'm deeply concerned about you right now. Your life has value and meaning. Please reach out to KIRAN helpline at 1800-599-0019 immediately. Can I help you connect with someone who can provide professional support right now?"
    ],
    context: ['crisis', 'emergency'],
    followUp: ["How can I best support you right now?", "Would you like me to help you find local emergency services?"],
    resources: ['crisis-helplines', 'emergency-contacts']
  },

  // High Anxiety Responses
  {
    id: 'anxiety-high',
    trigger: ['panic', 'can\'t breathe', 'heart racing', 'overwhelmed'],
    responses: [
      "I can hear that you're feeling really overwhelmed right now. Let's focus on your breathing together. Can you try the 4-7-8 breathing technique with me?",
      "You're experiencing intense anxiety right now, and that's really hard. Let's ground ourselves. Can you name 5 things you can see around you?"
    ],
    context: ['anxiety', 'panic'],
    followUp: ["Would you like to try a grounding exercise?", "Shall we do some breathing together?"],
    exercises: ['breathing-478', 'grounding-54321']
  },

  // Depression Support
  {
    id: 'depression-low',
    trigger: ['depressed', 'hopeless', 'worthless', 'empty', 'numb'],
    responses: [
      "I hear how difficult things are for you right now. Depression can make everything feel heavy and meaningless, but you're not alone in this.",
      "What you're feeling is valid, and it takes courage to reach out. Even small steps matter when you're struggling with depression."
    ],
    context: ['depression', 'low-mood'],
    followUp: ["What's one small thing that brought you even a tiny bit of comfort recently?", "Would you like to explore some gentle activities together?"],
    exercises: ['mood-lift-activities', 'gratitude-practice']
  },

  // Exam Stress
  {
    id: 'study-stress',
    trigger: ['exam', 'study', 'college', 'marks', 'grades', 'pressure'],
    responses: [
      "Academic pressure can be really intense. Many students struggle with this, and you're not alone. Let's break down what's causing the most stress.",
      "I understand the pressure you're feeling about your studies. Your worth isn't defined by your grades. Let's find some healthy ways to manage this stress."
    ],
    context: ['academic', 'stress', 'student'],
    followUp: ["What subject or exam is worrying you the most?", "How are you currently managing your study schedule?"],
    exercises: ['study-stress-relief', 'time-management', 'relaxation']
  },

  // Positive Reinforcement
  {
    id: 'positive-mood',
    trigger: ['good', 'happy', 'better', 'great', 'excited'],
    responses: [
      "I'm so glad to hear you're feeling good! It's wonderful when we can appreciate these positive moments.",
      "That's fantastic! Positive emotions are just as important to acknowledge and celebrate."
    ],
    context: ['positive', 'wellness'],
    followUp: ["What's contributing to this good feeling?", "How can we help maintain this positive state?"],
    exercises: ['gratitude-practice', 'mindful-appreciation']
  },

  // Loneliness Support
  {
    id: 'loneliness',
    trigger: ['lonely', 'alone', 'isolated', 'no friends', 'no one understands'],
    responses: [
      "Loneliness can feel so overwhelming, and I want you to know that your feelings are completely valid. You're not truly alone - I'm here with you right now.",
      "Feeling isolated is one of the hardest experiences. Connection is a basic human need, and it makes sense that you're struggling without it."
    ],
    context: ['loneliness', 'social'],
    followUp: ["When do you feel most lonely?", "What kind of connection are you longing for?"],
    exercises: ['social-connection', 'self-compassion']
  },

  // Sleep Issues
  {
    id: 'sleep-problems',
    trigger: ['can\'t sleep', 'insomnia', 'tired', 'exhausted', 'sleepless'],
    responses: [
      "Sleep problems can really affect everything else in our lives. Let's explore what might be keeping you awake and find some strategies to help.",
      "Not getting enough sleep makes everything harder. There are some techniques we can try to improve your sleep quality."
    ],
    context: ['sleep', 'health'],
    followUp: ["What time do you usually try to go to bed?", "What thoughts typically keep you awake?"],
    exercises: ['sleep-hygiene', 'bedtime-relaxation', 'progressive-muscle-relaxation']
  },

  // General Support
  {
    id: 'general-support',
    trigger: ['help', 'support', 'don\'t know', 'confused', 'lost'],
    responses: [
      "I'm here to support you through whatever you're facing. Sometimes just having someone listen can make a difference.",
      "It takes strength to ask for help. I'm glad you're here, and we can work through this together."
    ],
    context: ['general', 'support'],
    followUp: ["What's been on your mind lately?", "How have you been taking care of yourself?"],
    exercises: ['check-in', 'self-care-planning']
  }
];

export class IntelligentResponseGenerator {
  private templates: ResponseTemplate[];
  private conversationHistory: Message[];
  private context: ConversationContext;

  constructor(templates: ResponseTemplate[] = responseTemplates) {
    this.templates = templates;
    this.conversationHistory = [];
    this.context = {} as ConversationContext;
  }

  updateContext(messages: Message[], context: ConversationContext) {
    this.conversationHistory = messages;
    this.context = context;
  }

  // Helper to determine accessory features based on mood/risk level
  private findSuggestedMetadata(userMessage: string, riskLevel: 'low' | 'moderate' | 'high' | 'critical') {
    const lowerMessage = userMessage.toLowerCase();
    const suggestedExercises: string[] = [];
    const suggestedResources: string[] = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      // For high-risk, suggest immediate grounding or breathing
      suggestedExercises.push('breathing-478');
      suggestedResources.push('crisis-helplines');
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      suggestedExercises.push('grounding-54321');
    } else if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      suggestedExercises.push('progressive-muscle-relaxation');
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
      suggestedExercises.push('gratitude-practice');
    }
    
    return { suggestedExercises, suggestedResources };
  }

  async generateResponse(userMessage: string): Promise<{
    response: string;
    followUp?: string;
    suggestedExercises?: string[];
    suggestedResources?: string[];
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    sentiment: SentimentScore;
  }> {
    // Analyze sentiment
    const sentiment = analyzeSentiment(userMessage);
    const riskLevel = getRiskLevel(sentiment, userMessage);

    // --- CRISIS PROTOCOL: IMMEDIATE LOCAL RESPONSE ---
    if (riskLevel === 'critical' || detectCrisisKeywords(userMessage)) {
      const crisisTemplate = this.templates.find(t => t.id === 'crisis-suicide');
      if (crisisTemplate) {
        return {
          response: this.selectResponse(crisisTemplate.responses),
          followUp: this.selectResponse(crisisTemplate.followUp || []),
          suggestedResources: crisisTemplate.resources,
          riskLevel: 'critical',
          sentiment
        };
      }
    }

    // --- GENERATE AI RESPONSE VIA DIRECT GEMINI CALL ---
    let aiResponseText: string;
    try {
      // Import the sendMessageToGemini function dynamically
      const { sendMessageToGemini } = await import('./gemini');
      aiResponseText = await sendMessageToGemini(userMessage, this.conversationHistory);
    } catch (error) {
      console.error('Direct Gemini call failed:', error);
      
      // Check if it's an API permission error
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = String(error.message);
        if (errorMessage.includes('API Setup Required') || errorMessage.includes('SERVICE_DISABLED')) {
          aiResponseText = "🔧 मुझे सक्रिय करने के लिए: Google Cloud Console में जाकर Generative Language API को enable करें। फिर वापस आएं।";
        } else if (errorMessage.includes('Invalid API Key') || errorMessage.includes('VITE_GEMINI_API_KEY')) {
          aiResponseText = "❌ Configuration issue. Please check the setup and try again.";
        } else if (errorMessage.includes('Model Error')) {
          aiResponseText = "🤖 AI model temporarily unavailable. This will be resolved automatically. Please try again in a moment.";
        } else {
          aiResponseText = "Namaste. I'm sorry, my connection is unstable right now. Please call a helpline (1800-599-0019) if you need immediate support, or try chatting again in a moment. Dhanyawad.";
        }
      } else {
        aiResponseText = "Namaste. I'm sorry, my connection is unstable right now. Please call a helpline (1800-599-0019) if you need immediate support, or try chatting again in a moment. Dhanyawad.";
      }
    }

    // --- ACCESSORY FEATURES (Exercises/Resources) ---
    const { suggestedExercises, suggestedResources } = this.findSuggestedMetadata(userMessage, riskLevel);

    return {
      response: aiResponseText,
      followUp: undefined, // Gemini handles the flow now
      suggestedExercises,
      suggestedResources,
      riskLevel,
      sentiment
    };
  }

  private findBestMatchingTemplate(userMessage: string, sentiment: SentimentScore, dominantEmotion: string): ResponseTemplate | null {
    const lowerMessage = userMessage.toLowerCase();
    const recentTopics = this.getRecentTopics();
    
    // Score templates based on keyword matches and context
    const scoredTemplates = this.templates.map(template => {
      let score = 0;
      
      // Check keyword matches
      const keywordMatches = template.trigger.filter(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
      ).length;
      score += keywordMatches * 10;
      
      // Boost score for context matches
      if (template.context.includes(dominantEmotion)) {
        score += 5;
      }
      
      // Consider recent conversation topics
      const contextMatches = template.context.filter(ctx => 
        recentTopics.includes(ctx)
      ).length;
      score += contextMatches * 3;
      
      // Adjust based on sentiment
      if (sentiment.score < -0.5 && template.context.includes('crisis')) {
        score += 15;
      }
      
      return { template, score };
    });

    // Return template with highest score (minimum threshold of 5)
    const bestMatch = scoredTemplates.sort((a, b) => b.score - a.score)[0];
    return bestMatch.score >= 5 ? bestMatch.template : null;
  }

  private selectResponse(responses: string[]): string {
    if (responses.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  private getRecentTopics(): string[] {
    // Analyze last 5 messages for context
    const recentMessages = this.conversationHistory.slice(-5);
    const topics: string[] = [];
    
    recentMessages.forEach(msg => {
      if (msg.sender === 'user') {
        // Extract topics from user messages
        const sentiment = analyzeSentiment(msg.content);
        const emotion = getDominantEmotion(sentiment.emotions);
        if (emotion !== 'neutral') {
          topics.push(emotion);
        }
      }
    });
    
    return [...new Set(topics)]; // Remove duplicates
  }

  private generateContextualDefault(sentiment: SentimentScore, dominantEmotion: string): string {
    const empathicResponses = [
      "I hear what you're sharing with me, and I want you to know that your feelings matter.",
      "Thank you for trusting me with what you're going through. I'm here to listen and support you.",
      "It sounds like you're dealing with something important. I'm here to help however I can.",
      "I appreciate you opening up to me. Your experience is valid, and we can work through this together."
    ];

    let response = this.selectResponse(empathicResponses);

    // Add emotion-specific acknowledgment
    if (dominantEmotion !== 'neutral') {
      const emotionAcknowledgments = {
        sadness: " I can sense the sadness in your words, and that must be really difficult.",
        anger: " I can feel the frustration and anger you're experiencing.",
        fear: " It sounds like you're feeling scared or anxious about something.",
        joy: " I'm glad to hear there's some positivity in what you're sharing.",
        surprise: " It sounds like something unexpected has happened.",
        disgust: " It seems like something is really bothering or upsetting you."
      };
      
      response += emotionAcknowledgments[dominantEmotion as keyof typeof emotionAcknowledgments] || "";
    }

    return response;
  }
}

export const responseGenerator = new IntelligentResponseGenerator();