// Multi-language heuristic detection: English (en), Hindi (hi), Kannada (kn), Tamil (ta).
// Script detection wins instantly; otherwise transliteration token ratios decide.

import { SupportedLanguage } from '@/types/chat';

const DEVANAGARI_REGEX = /[\u0900-\u097F]/g; // Hindi
const KANNADA_REGEX = /[\u0C80-\u0CFF]/g;   // Kannada
const TAMIL_REGEX = /[\u0B80-\u0BFF]/g;     // Tamil

// Common Hindi transliteration tokens
const HINDI_LATIN_TOKENS = [
  'hai','nahi','kya','kaise','hoon','hun','mera','meri','mere','tum','aap','kyu','kyun','mat','bahut','zyada','kam','kar','karta','karti','karna','hona','hain','tha','thi','the','raha','rahe','rahi','mai','main','kr','pls','shukriya','dhanyavad','madad'
];

// Seed Kannada transliteration tokens (expand as needed)
const KANNADA_LATIN_TOKENS = [ 'nanna','ninna','hegide','hegiddira','dayavittu','illa','yakke','nannige','sahaaya','tumba','chinte','nimma','bhava','maathana','maataadi','namaskara' ];

// Seed Tamil transliteration tokens (expand as needed)
const TAMIL_LATIN_TOKENS = [ 'enna','illai','epdi','eppadi','naan','ungal','sahayam','romba','anbu','udaivi','bayam','tookkam','manas','azhutham','thunai','udavi' ];

export function detectLanguage(text: string): SupportedLanguage {
  if (!text) return 'en';

  const devCount = text.match(DEVANAGARI_REGEX)?.length || 0;
  const knCount = text.match(KANNADA_REGEX)?.length || 0;
  const taCount = text.match(TAMIL_REGEX)?.length || 0;

  if (devCount > 0) return 'hi';
  if (knCount > 0) return 'kn';
  if (taCount > 0) return 'ta';

  const tokens = text.toLowerCase().split(/[^a-zA-Z]+/).filter(Boolean);
  let hindi = 0, kannada = 0, tamil = 0;
  for (const t of tokens) {
    if (HINDI_LATIN_TOKENS.includes(t)) hindi++;
    if (KANNADA_LATIN_TOKENS.includes(t)) kannada++;
    if (TAMIL_LATIN_TOKENS.includes(t)) tamil++;
  }

  const total = tokens.length || 1;
  if (hindi / total >= 0.25 && hindi >= 2) return 'hi';
  if (kannada / total >= 0.25 && kannada >= 2) return 'kn';
  if (tamil / total >= 0.25 && tamil >= 2) return 'ta';

  return 'en';
}

export const isHindi = (t: string) => detectLanguage(t) === 'hi';
export const isKannada = (t: string) => detectLanguage(t) === 'kn';
export const isTamil = (t: string) => detectLanguage(t) === 'ta';
