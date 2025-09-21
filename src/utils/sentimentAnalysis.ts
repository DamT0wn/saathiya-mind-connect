import { SentimentScore } from '@/types/chat';

// Keyword-based sentiment analysis (can be replaced with ML-based analysis)
const positiveWords = [
  'happy', 'joy', 'excited', 'good', 'great', 'amazing', 'wonderful', 'fantastic', 
  'excellent', 'perfect', 'love', 'like', 'enjoy', 'pleased', 'satisfied', 'content',
  'grateful', 'thankful', 'blessed', 'lucky', 'optimistic', 'hopeful', 'confident',
  'proud', 'accomplished', 'successful', 'peaceful', 'calm', 'relaxed', 'energetic',
  // Hindi words (transliterated)
  'khushi', 'sukh', 'prasann', 'santust', 'khush', 'accha', 'bahut', 'sundar'
];

const negativeWords = [
  'sad', 'angry', 'upset', 'depressed', 'anxious', 'worried', 'stressed', 'frustrated',
  'disappointed', 'hurt', 'pain', 'suffering', 'terrible', 'awful', 'horrible', 'hate',
  'dislike', 'fear', 'scared', 'afraid', 'nervous', 'panic', 'overwhelmed', 'exhausted',
  'tired', 'lonely', 'isolated', 'hopeless', 'helpless', 'worthless', 'guilty', 'shame',
  // Hindi words (transliterated)
  'dukh', 'udas', 'pareshan', 'gussa', 'chinta', 'dar', 'bura', 'kharab'
];

const emotionKeywords = {
  joy: ['happy', 'joy', 'excited', 'cheerful', 'delighted', 'elated', 'khushi', 'prasann'],
  sadness: ['sad', 'cry', 'tears', 'grief', 'sorrow', 'melancholy', 'dukh', 'udas'],
  anger: ['angry', 'mad', 'furious', 'rage', 'irritated', 'annoyed', 'gussa', 'krodh'],
  fear: ['afraid', 'scared', 'terrified', 'anxious', 'worried', 'nervous', 'dar', 'chinta'],
  surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'unexpected', 'hairaan'],
  disgust: ['disgusted', 'repulsed', 'revolted', 'nauseated', 'sick', 'ghinn']
};

const intensityWords = {
  high: ['very', 'extremely', 'incredibly', 'really', 'so', 'completely', 'totally', 'absolutely'],
  medium: ['quite', 'fairly', 'rather', 'somewhat', 'pretty', 'kind of'],
  low: ['a little', 'slightly', 'a bit', 'somewhat', 'mildly']
};

const crisisKeywords = [
  'suicide', 'kill myself', 'end it all', 'want to die', 'no point living',
  'hurt myself', 'self harm', 'cutting', 'pills', 'overdose', 'jump',
  'hang myself', 'gun', 'knife', 'rope', 'bridge'
];

export function analyzeSentiment(text: string): SentimentScore {
  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;
  let totalWords = words.length;

  // Count positive and negative words
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) {
      positiveScore++;
    }
    if (negativeWords.some(nw => word.includes(nw))) {
      negativeScore++;
    }
  });

  // Calculate intensity multiplier
  let intensityMultiplier = 1;
  words.forEach(word => {
    if (intensityWords.high.some(iw => word.includes(iw))) {
      intensityMultiplier = 1.5;
    } else if (intensityWords.medium.some(iw => word.includes(iw))) {
      intensityMultiplier = 1.2;
    } else if (intensityWords.low.some(iw => word.includes(iw))) {
      intensityMultiplier = 0.8;
    }
  });

  // Calculate overall sentiment score (-1 to 1)
  const rawScore = (positiveScore - negativeScore) / Math.max(totalWords, 1);
  const score = Math.max(-1, Math.min(1, rawScore * intensityMultiplier));

  // Calculate confidence based on the number of sentiment words found
  const sentimentWordsFound = positiveScore + negativeScore;
  const confidence = Math.min(1, sentimentWordsFound / Math.max(totalWords * 0.3, 1));

  // Analyze emotions
  const emotions = {
    joy: calculateEmotionScore(words, emotionKeywords.joy),
    sadness: calculateEmotionScore(words, emotionKeywords.sadness),
    anger: calculateEmotionScore(words, emotionKeywords.anger),
    fear: calculateEmotionScore(words, emotionKeywords.fear),
    surprise: calculateEmotionScore(words, emotionKeywords.surprise),
    disgust: calculateEmotionScore(words, emotionKeywords.disgust)
  };

  return {
    score,
    confidence,
    emotions
  };
}

function calculateEmotionScore(words: string[], emotionWords: string[]): number {
  let count = 0;
  words.forEach(word => {
    if (emotionWords.some(ew => word.includes(ew))) {
      count++;
    }
  });
  return Math.min(1, count / Math.max(words.length * 0.1, 1));
}

export function detectCrisisKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
}

export function getSentimentLabel(score: number): string {
  if (score >= 0.5) return 'Very Positive';
  if (score >= 0.2) return 'Positive';
  if (score >= -0.2) return 'Neutral';
  if (score >= -0.5) return 'Negative';
  return 'Very Negative';
}

export function getDominantEmotion(emotions: SentimentScore['emotions']): string {
  const emotionEntries = Object.entries(emotions);
  const dominant = emotionEntries.reduce((max, current) => 
    current[1] > max[1] ? current : max
  );
  return dominant[1] > 0.3 ? dominant[0] : 'neutral';
}

export function getRiskLevel(sentimentScore: SentimentScore, text: string): 'low' | 'moderate' | 'high' | 'critical' {
  if (detectCrisisKeywords(text)) {
    return 'critical';
  }
  
  if (sentimentScore.score <= -0.7 && sentimentScore.emotions.sadness > 0.5) {
    return 'high';
  }
  
  if (sentimentScore.score <= -0.4) {
    return 'moderate';
  }
  
  return 'low';
}