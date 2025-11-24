// Lightweight translation fallback utilities for English <-> Hindi.
// This is NOT a full translator; it focuses on key wellness/support phrases.
// For production, integrate a proper translation API or model.

interface DictionaryMap { [key: string]: string; }

// English -> Hindi
const EN_TO_HI_BASE: DictionaryMap = {
  'hello': 'नमस्ते', 'hi': 'नमस्ते', 'help': 'मदद', 'support': 'सहायता', 'you': 'आप', 'are': 'हैं',
  'i': 'मैं', 'feel': 'महसूस', 'feeling': 'महसूस', 'sad': 'उदास', 'anxious': 'चिंतित', 'stress': 'तनाव',
  'stressed': 'तनावग्रस्त', 'calm': 'शांत', 'breathe': 'सांस', 'breathing': 'श्वास', 'exercise': 'व्यायाम',
  'tired': 'थका', 'sleep': 'नींद', 'lonely': 'अकेला', 'alone': 'अकेला', 'depressed': 'अवसादग्रस्त',
  'worthless': 'निरर्थक', 'hopeless': 'निराशाजनक', 'okay': 'ठीक', 'great': 'बहुत अच्छा', 'good': 'अच्छा',
  'better': 'बेहतर', 'panic': 'घबराहट', 'talk': 'बात', 'conversation': 'वार्तालाप',
  'listen': 'सुनना', 'listening': 'सुन रहा', 'today': 'आज', 'now': 'अभी', 'key': 'कुंजी', 'value': 'मूल्य',
  'life': 'जीवन', 'important': 'महत्वपूर्ण', 'meaningful': 'अर्थपूर्ण', 'please': 'कृपया', 'call': 'कॉल',
  'immediate': 'तुरंत', 'danger': 'खतरा', 'crisis': 'संकट', 'contact': 'संपर्क', 'local': 'स्थानीय',
  'emergency': 'आपातकाल', 'services': 'सेवाएँ', 'tell': 'बताएं', 'how': 'कैसे', 'what': 'क्या', 'share': 'साझा'
};

// English -> Kannada (limited wellness/support lexicon)
const EN_TO_KN_BASE: DictionaryMap = {
  'hello': 'ನಮಸ್ಕಾರ','hi': 'ನಮಸ್ಕಾರ','welcome': 'ಸ್ವಾಗತ','help': 'ಸಹಾಯ','support': 'ಬೆಂಬಲ','you': 'ನೀವು','are': 'ಇದ್ದೀರಿ',
  'i': 'ನಾನು','feel': 'ಅನಿಸುತಿದೆ','feeling': 'ಭಾವನೆ','sad': 'ದುಃಖ','anxious': 'ಚಿಂತಿತ','stress': 'ಒತ್ತಡ',
  'stressed': 'ಒತ್ತಡದಲ್ಲಿರುವ','calm': 'ಶಾಂತ','breathe': 'ಉಸಿರಿ','breathing': 'ಉಸಿರಾಟ','exercise': 'ವ್ಯಾಯಾಮ',
  'tired': 'ದಣಿದ','sleep': 'ನಿದ್ರೆ','lonely': 'ಒಂಟಿ','alone': 'ಒಬ್ಬನೇ','depressed': 'ಮನೋನವಿರುಧ',
  'life': 'ಜೀವನ','important': 'ಮುಖ್ಯ','please': 'ದಯವಿಟ್ಟು','call': 'ಕಾಲ್','crisis': 'ಸಂಕಟ','danger': 'ಅಪಾಯ',
  'immediate': 'ತಕ್ಷಣ','local': 'ಸ್ಥಳೀಯ','emergency': 'ತುರ್ತು','better': 'ಉತ್ತಮ','good': 'ಒಳ್ಳೆಯ','great': 'ಅದ್ಭುತ'
};

// English -> Tamil
const EN_TO_TA_BASE: DictionaryMap = {
  'hello': 'வணக்கம்','hi': 'வணக்கம்','welcome': 'வரவேற்பு','help': 'உதவி','support': 'ஆதரவு','you': 'நீங்கள்','are': 'இருக்கிறீர்கள்',
  'i': 'நான்','feel': 'உணர','feeling': 'உணர்வு','sad': 'சோகம்','anxious': 'கவலை','stress': 'மனஅழுத்தம்',
  'stressed': 'அழுத்தத்தில்','calm': 'அமைதி','breathe': 'மூச்சு','breathing': 'மூச்சுவிடுதல்','exercise': 'உடற்பயிற்சி',
  'tired': 'சோர்வு','sleep': 'தூக்கம்','lonely': 'தனிமை','alone': 'தனியாக','depressed': 'மனச்சோர்வு',
  'life': 'வாழ்க்கை','important': 'முக்கியமான','please': 'தயவுசெய்து','call': 'அழை','crisis': 'அவசரம்','danger': 'ஆபத்து',
  'immediate': 'உடனடி','local': 'உள்ளூர்','emergency': 'அவசர', 'better': 'மேலும் நல்ல','good': 'நல்ல','great': 'அருமை'
};

const PUNCT_REGEX = /[.,!?;:]/;

import { SupportedLanguage } from '@/types/chat';

export async function translateText(text: string, targetLang: SupportedLanguage): Promise<string> {
  if (!text) return text;
  if (targetLang === 'en') return text; // Already English response generation default

  // Basic tokenization
  const rawTokens = text.split(/\s+/);
  const translatedTokens: string[] = [];
  let translatedCount = 0;

  const dict = targetLang === 'hi' ? EN_TO_HI_BASE : targetLang === 'kn' ? EN_TO_KN_BASE : targetLang === 'ta' ? EN_TO_TA_BASE : EN_TO_HI_BASE;

  for (const raw of rawTokens) {
    const token = raw.replace(PUNCT_REGEX, '').toLowerCase();
    const punct = raw.match(PUNCT_REGEX)?.[0] || '';

    if (dict[token]) {
      translatedTokens.push(dict[token] + punct);
      translatedCount++;
    } else if (/^[A-Za-z]+$/.test(token)) {
      // Fallback: keep English word to avoid losing meaning
      translatedTokens.push(token + punct);
    } else {
      translatedTokens.push(raw);
    }
  }

  const coverage = translatedCount / (rawTokens.length || 1);

  // If low coverage, attempt a heuristic full-sentence Hindi wrapper
  if (coverage < 0.2) {
    if (targetLang === 'hi') return `यहाँ एक सहायक संदेश है: ${text}`;
    if (targetLang === 'kn') return `ಇದು ಒಂದು ಸಹಾಯಕ ಸಂದೇಶ: ${text}`;
    if (targetLang === 'ta') return `இது ஒரு உதவியான செய்தி: ${text}`;
  }

  return translatedTokens.join(' ');
}

// Convenience helper for response + optional follow-up
export async function translateResponsePackage<T extends { response: string; followUp?: string }>(pkg: T, targetLang: SupportedLanguage): Promise<T> {
  if (targetLang === 'en') return pkg;
  const translatedResponse = await translateText(pkg.response, targetLang);
  const translatedFollowUp = pkg.followUp ? await translateText(pkg.followUp, targetLang) : undefined;
  return { ...pkg, response: translatedResponse, followUp: translatedFollowUp };
}
