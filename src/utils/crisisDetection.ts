import { crisisPhrases, crisisAllowlist } from '@/config/crisisKeywords';
import { analyzeSentiment } from '@/utils/sentimentAnalysis';

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalize text so regex word-boundary matching is reliable.
 * Lowercase, replace smart/apostrophe quotes, replace non-word with spaces, collapse spaces.
 */
function normalizeForMatching(s: string) {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

type DetectionResult = {
  shouldShowPopup: boolean;
  matchedPhrases: string[];
  severity: number; // 0-1
  reason?: string;
};

/**
 * Heuristic severity scoring. Uses sentiment (if available) and presence of high-risk phrases.
 * Returns { shouldShowPopup, matchedPhrases, severity }.
 */
export async function detectCrisis(text: string, userMessageCount: number): Promise<DetectionResult> {
  // Early greeting suppression: if the message is just a benign greeting in any supported language,
  // never trigger the popup. We check BEFORE normalization because current normalization strips
  // non-latin scripts (Kannada/Tamil) and could yield an empty string, causing fallback logic to rely
  // on message count and mistakenly show the popup.
  const rawTrimmed = text.trim();
  const greetingPatterns = [
    'hello','hi','hey','namaste','नमस्ते','नमस्कार','नमस्कार!',
    'ನಮಸ್ಕಾರ','ನಮಸ್ಕಾರ!','namaskara','vanakkam','வணக்கம்','வணக்கம்!' 
  ];
  // Additional casual Hindi mixed phrases: single token presence heuristic
  const casualHindiGreetingTokens = ['हाल', 'चाल', 'हाल-चाल', 'haal', 'chal', 'haal-chal'];
  const strippedGreeting = rawTrimmed.replace(/[!,.?]/g,'').toLowerCase();
  if (greetingPatterns.map(g => g.replace(/[!,.?]/g,'').toLowerCase()).includes(strippedGreeting)) {
    console.log('[Crisis Detection] Greeting-only message detected (allowlist suppression):', rawTrimmed);
    return { shouldShowPopup: false, matchedPhrases: [], severity: 0, reason: 'greeting' };
  }
  // Heuristic: if message contains both 'kya' and any haal/chal token treat as casual wellbeing check
  const lowerRaw = rawTrimmed.toLowerCase();
  if (lowerRaw.includes('kya') && casualHindiGreetingTokens.some(t => rawTrimmed.includes(t) || lowerRaw.includes(t))) {
    console.log('[Crisis Detection] Casual Hindi wellbeing check suppression:', rawTrimmed);
    return { shouldShowPopup: false, matchedPhrases: [], severity: 0, reason: 'greeting-casual' };
  }

  // MULTI-SCRIPT HIGH RISK (Hindi / Kannada / Tamil) BEFORE normalization (since we strip scripts later)
  const hiRiskScripts = [
    'आत्महत्या','खुदकुशी','मुझे मरना है','मैं मरना चाहता हूं','मैं मरना चाहती हूं','मैं खुद को मारना चाहता हूं','मैं खुद को मारना चाहती हूं',
  ];
  const knRiskScripts = [
    'ಆತ್ಮಹತ್ಯೆ','ನಾನು ಸಾಯಲು ಬಯಸುತ್ತೇನೆ','ನಾನು ನನ್ನನ್ನು ಕೊಲ್ಲಲು ಬಯಸುತ್ತೇನೆ','ನನ್ನನ್ನು ಕೊಲ್ಲಲು'
  ];
  const taRiskScripts = [
    'தற்கொலை','நான் இறக்க விரும்புகிறேன்','என்னை கொல்ல விரும்புகிறேன்','என் உயிரை முடிக்க'
  ];
  const rawLower = rawTrimmed.toLowerCase();
  const scriptMatched: string[] = [];
  for (const arr of [hiRiskScripts, knRiskScripts, taRiskScripts]) {
    for (const phrase of arr) {
      if (rawTrimmed.includes(phrase)) {
        scriptMatched.push(phrase);
      }
    }
  }
  if (scriptMatched.length > 0) {
    console.log('[Crisis Detection] Script high-risk phrase(s) matched:', scriptMatched);
    return { shouldShowPopup: true, matchedPhrases: scriptMatched, severity: 1, reason: 'fail-safe-script' };
  }

  // FAIL-SAFE OVERRIDE: Immediate crisis intent patterns (raw text regex).
  // These patterns intentionally capture variations with optional words and spacing.
  const failSafePatterns: RegExp[] = [
    /\bi\s*(want|will|am going|m going|feel like|might)?\s*to\s*(kill|end)\s*(my\s*self|myself|my\s*life|life|it|this)\b/i,
    /\bi\s*(want|will|am going|m going|feel like|might)?\s*to\s*(die|end my life|take my life)\b/i,
    /\bend\s*it\s*all\b/i,
    /\bno\s*reason\s*to\s*live\b/i,
    /\bi\s*don'?t\s*want\s*to\s*live\b/i,
    /\bi\s*have\s*had\s*enough\b/i,
    /\bthoughts?\s*of\s*suicide\b/i,
    /\bthinking\s*(about|of)\s*suicide\b/i,
    /\bself\s*-?\s*harm\b/i
  ];
  for (const pattern of failSafePatterns) {
    if (pattern.test(text)) {
      console.log('[Crisis Detection] FAIL-SAFE pattern matched:', pattern.toString(), '→ immediate popup');
      return { shouldShowPopup: true, matchedPhrases: [pattern.toString()], severity: 1, reason: 'fail-safe' };
    }
  }

  const normalized = normalizeForMatching(text);
  
  // DEBUG: Log what we're checking
  console.log('[Crisis Detection] Original text:', text);
  console.log('[Crisis Detection] Normalized text:', normalized);

  // Quick allowlist check: if any allowlist phrase appears, treat as non-crisis (avoid false positives)
  for (const a of crisisAllowlist) {
    const normAllow = normalizeForMatching(a);
    // Allowlist may include multi-word phrases with hyphens or mixed scripts; match loosely by inclusion
    const pattern = new RegExp('(?:^|\b)' + escapeRegex(normAllow) + '(?:\b|$)', 'i');
    if (pattern.test(normalized) || text.toLowerCase().includes(a.toLowerCase())) {
      console.log('[Crisis Detection] Allowlist match:', a);
      return { shouldShowPopup: false, matchedPhrases: [], severity: 0, reason: 'allowlist-match' };
    }
  }

  // Find phrase matches using word-boundary-aware regex. For multi-word phrases allow variable whitespace.
  const matched: string[] = [];
  for (const phrase of crisisPhrases) {
    const words = normalizeForMatching(phrase).split(' ').filter(Boolean);
    if (words.length === 0) continue;
    const escapedWords = words.map(escapeRegex).join('\\s+');
    const regex = new RegExp('\\b' + escapedWords + '\\b', 'i');
    if (regex.test(normalized)) {
      matched.push(phrase);
      console.log('[Crisis Detection] Phrase matched:', phrase);
    }
  }
  
  console.log('[Crisis Detection] Total phrase matches:', matched.length);

  // ADDITIONAL: Check for individual high-risk keywords (single words that should always trigger)
  // This catches variations not in the phrase list (e.g., "suicide", "kill" in crisis context)
  const singleHighRiskWords = [
    'suicide', 'suicidal', 
    'kill', 'killing', 'killed',
    'die', 'dying', 'died', 'death',
    'harm', 'hurt', 'hurting',
    'cut', 'cutting',
    // Removed generic 'end' to reduce false positives in casual phrases like 'end up', 'weekend'
    'ending',
    'overdose',
    'jump', 'jumping',
    'hang', 'hanging',
    'gun', 'knife', 'rope', 'pills',
    'hopeless', 'worthless',
    'no point', 'give up'
  ];
  const foundSingleWords: string[] = [];
  
  for (const word of singleHighRiskWords) {
    const regex = new RegExp('\\b' + escapeRegex(word) + '\\b', 'i');
    if (regex.test(normalized)) {
      foundSingleWords.push(word);
      console.log('[Crisis Detection] Single word matched:', word);
      // Add to matched for reporting
      if (!matched.includes(word)) {
        matched.push(word);
      }
    }
  }
  
  console.log('[Crisis Detection] Total single words found:', foundSingleWords.length);

  // If no matched phrases or words, still consider the 12+ messages rule (lower severity but actionable)
  if (matched.length === 0 && foundSingleWords.length === 0) {
    const severity = Math.min(1, userMessageCount / 20); // heuristic: more messages -> higher chance
    const shouldShow = userMessageCount >= 12; // only show on 12+ as per requirement
    console.log('[Crisis Detection] No matches - checking message count rule');
    // If normalized became empty due to non-latin greeting (e.g. Kannada/Tamil), suppress.
    if (!normalized) {
      console.log('[Crisis Detection] Normalized text empty (likely non-latin benign). Suppressing popup.');
      return { shouldShowPopup: false, matchedPhrases: [], severity: 0, reason: 'empty-nonlatin' };
    }
    return { shouldShowPopup: shouldShow, matchedPhrases: [], severity, reason: 'message-count' };
  }

  // Compute severity: base on matched high-risk tokens and sentiment
  let severity = 0.6; // default moderate

  // If ANY single high-risk word is found, ALWAYS trigger popup (set severity high)
  if (foundSingleWords.length > 0) {
    severity = 0.95; // ALWAYS trigger for any crisis word
    console.log('[Crisis Detection] Single word(s) found - setting severity to 0.95');
  }

  // If matches include explicit intent phrases, ensure severity is maximum
  const highRiskIndicators = [
    'kill myself', 'i want to die', 'end my life', 'i want to end my life',
    'i am going to end it', 'i am going to kill myself', 'i want to kill myself',
    // include common spaced variants
    'kill my self', 'killing my self', 'i feel like killing my self', 'i want to kill my self', 'i want to end my self',
    'feel like killing myself', 'feeling like killing myself', 'feeling like killing my self'
  ];
  if (matched.some(m => highRiskIndicators.includes(m))) {
    severity = 0.99;
    console.log('[Crisis Detection] High-risk phrase matched - setting severity to 0.99');
  }

  // Sentiment-based adjustment (try/catch in case sentiment analyzer fails)
  try {
    const sentiment = await analyzeSentiment(text);
    // assume sentiment.score is -1..1 where negative is distress
    if (sentiment && typeof sentiment.score === 'number') {
      const s = sentiment.score; // negative lower
      if (s <= -0.6) severity = Math.max(severity, 0.9);
      else if (s <= -0.3) severity = Math.max(severity, 0.8);
      else severity = Math.max(severity, 0.7);
    }
  } catch (e) {
    // ignore sentiment errors
    console.warn('Sentiment analysis failed for crisis detection', e);
  }

  const shouldShowPopup = severity >= 0.75; // only open popup for high-risk matches
  
  // DEBUG: Log final decision
  console.log('[Crisis Detection] Matched phrases:', matched);
  console.log('[Crisis Detection] Found single words:', foundSingleWords);
  console.log('[Crisis Detection] Severity:', severity);
  console.log('[Crisis Detection] Should show popup:', shouldShowPopup);

  return { shouldShowPopup, matchedPhrases: matched, severity, reason: 'keyword-match' };
}

export type { DetectionResult };
