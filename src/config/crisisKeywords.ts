// List of phrases to detect potential crisis language.
// Keep phrases lowercase and human-readable. Use this file to update triggers easily.
export const crisisPhrases = [
  'suicide',
  'suicidal',
  'suicidal thoughts',
  'kill myself',
  'i want to die',
  'want to die',
  'i want to end my life',
  'end my life',
  'i want to end it',
  'i want to kill myself',
  'i am going to kill myself',
  'i m going to kill myself',
  'i am going to end my life',
  'i m going to end my life',
  'i feel like killing myself',
  'i feel like ending my life',
  'i want to hurt myself',
  'hurt myself',
  'self harm',
  'self-harm',
  'cutting myself',
  'cant live',
  "can't live",
  'i cant live',
  'i cant take this',
  "i can't take this",
  'i hate living',
  'i dont want to live',
  "i don't want to live",
  'i have had enough',
  "i've had enough",
  'thoughts of suicide',
  'thinking about suicide',
  'thinking of suicide',
  'i think about killing myself',
  'i think about suicide',
  'i want to end my life today',
  'i want to die today',
  'i am going to end it'
];

// Allowlist: phrases that might contain similar words but are commonly non-crisis.
// Keep this minimal and specific to reduce false negatives.
export const crisisAllowlist = [
  'kill time',
  'die hard',
  "would die for",
  'dying to',
  'i would die without',
  'that song kills me',
  'this movie kills me',
  // Casual Hindi mixed-language greetings / well-being check phrases
  'kya haal chal',
  'haal chal',
  'haal-chaal',
  'kya haal',
  'aur sathi kya haal chal',
  'हाल चाल',
  'हाल-चाल'
];

// Additional common variants including spaced 'my self' forms and colloquial phrasing
export const crisisPhraseVariants = [
  'i feel like killing my self',
  'feel like killing my self',
  'killing my self',
  'kill my self',
  'i want to kill my self',
  'i want to end my self',
  'feel like killing myself',
  'feeling like killing myself',
  'feeling like killing my self',
  'i m going to kill myself',
  'i m going to end my life',
  'i want to end it today'
];

// Merge variants into the main list for detection convenience
crisisPhrases.push(...crisisPhraseVariants);

