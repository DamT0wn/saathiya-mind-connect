import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '@/types/chat';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Try multiple models in order of preference (current working models)
const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];

function mapChatHistoryToGeminiContent(messages: Message[] = []) {
  return (messages || [])
    .filter(m => m && typeof m.content === 'string' && m.content.trim().length > 0)
    .map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
}

async function tryModelWithFallback(genAI: GoogleGenerativeAI, prompt: string): Promise<string> {
  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log('🤖 Trying model:', modelName);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('✅ Success with model:', modelName);
      console.log('Response text:', text?.substring(0, 100) + '...');
      
      if (text && text.trim().length > 0) {
        return text;
      } else {
        console.warn('Empty response from model:', modelName);
        throw new Error('Empty response from model');
      }
      
    } catch (modelError) {
      console.error(`❌ Model ${modelName} failed:`, modelError);
      console.error('Full error object:', JSON.stringify(modelError, null, 2));
      // Continue to next model
    }
  }
  
  throw new Error('All AI models are currently unavailable. Please try again in a few minutes.');
}

// Direct API call without SDK (fallback method)
async function tryDirectAPICall(prompt: string): Promise<string> {
  const contextualPrompt = `You are Saathiya, an empathetic AI companion for Indian youth. Respond supportively and briefly in a mix of Hindi and English to: ${prompt}`;
  
  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log('🌐 Trying direct API call with model:', modelName);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: contextualPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      if (text && text.trim().length > 0) {
        console.log('✅ Direct API success with model:', modelName);
        return text.trim();
      }
      
    } catch (error) {
      console.error(`❌ Direct API failed for ${modelName}:`, error);
    }
  }
  
  throw new Error('All direct API calls failed');
}

export async function sendMessageToGemini(prompt: string, history: Message[] = []): Promise<string> {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 GEMINI API DIAGNOSTIC CALL - START');
  console.log('═══════════════════════════════════════════════════════');
  console.log('⏰ Timestamp:', new Date().toISOString());
  console.log('📝 Prompt Length:', prompt.length, 'characters');
  console.log('🔑 API Key Status:');
  console.log('   → Present:', !!API_KEY);
  console.log('   → Length:', API_KEY?.length || 0, 'characters');
  console.log('   → First 20 chars:', API_KEY?.substring(0, 20) + '...' || 'undefined');
  console.log('───────────────────────────────────────────────────────');
  
  if (!API_KEY) {
    console.error('❌ CRITICAL: API Key is missing!');
    throw new Error('VITE_GEMINI_API_KEY is not set in environment');
  }

  // Try direct API call first (more reliable)
  try {
    console.log('📝 Strategy 1: Trying direct REST API approach...');
    const result = await tryDirectAPICall(prompt);
    console.log('✅ SUCCESS with direct API!');
    console.log('═══════════════════════════════════════════════════════');
    return result;
  } catch (directError) {
    console.warn('❌ Direct API failed completely');
    console.warn('Error:', directError);
    console.log('───────────────────────────────────────────────────────');
    console.log('📝 Strategy 2: Trying Google SDK approach...');
  }

  // Fallback to Google SDK
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  try {
    const contextualPrompt = `You are Saathiya, an empathetic AI companion for Indian youth. Respond supportively and briefly to: ${prompt}`;
    console.log('📝 SDK Prompt preview:', contextualPrompt.substring(0, 100) + '...');
    
    const result = await tryModelWithFallback(genAI, contextualPrompt);
    console.log('✅ SUCCESS with Google SDK!');
    console.log('═══════════════════════════════════════════════════════');
    return result;
    
  } catch (error) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('🔴 BOTH API STRATEGIES FAILED - Using Backup Responses');
    console.error('═══════════════════════════════════════════════════════');
    
    // Check for critical configuration errors that should be thrown
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = String(error.message);
      
      if (errorMessage.includes('SERVICE_DISABLED') || errorMessage.includes('not been used in project')) {
        console.error('🔧 DIAGNOSIS: API Not Enabled');
        throw new Error('🔧 API Setup Required: Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com and click "Enable"');
      }
      
      if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('invalid')) {
        console.error('🔑 DIAGNOSIS: Invalid API Key');
        throw new Error('❌ Invalid API Key: Check your .env.local file');
      }
    }
    
    // For all other errors (including model unavailability), use backup responses
    console.log('🔄 FALLBACK: Using backup response system');
    console.log('═══════════════════════════════════════════════════════');
    return getBackupResponse(prompt);
  }
}

// Backup response system when Gemini is unavailable
function getBackupResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Mental health support responses
  if (lowerPrompt.includes('stress') || lowerPrompt.includes('anxious') || lowerPrompt.includes('anxiety')) {
    return "मैं समझ सकता हूं कि आप तनाव महसूस कर रहे हैं। Deep breathing try करें - 4 seconds inhale, 7 seconds hold, 8 seconds exhale. आप अकेले नहीं हैं। Would you like to try some grounding exercises?";
  }
  
  if (lowerPrompt.includes('sad') || lowerPrompt.includes('depressed') || lowerPrompt.includes('lonely')) {
    return "आपकी feelings valid हैं। Depression और loneliness बहुत कठिन है, but you're brave for reaching out. छोटी चीजों में खुशी ढूंढने की कोशिश करें। क्या आप मुझे बता सकते हैं कि आज आपको क्या अच्छा लगा?";
  }
  
  if (lowerPrompt.includes('exam') || lowerPrompt.includes('study') || lowerPrompt.includes('college') || lowerPrompt.includes('school')) {
    return "Academic pressure बहुत real है! Your worth केवल marks से नहीं define होती। Break your study sessions into small chunks, take regular breaks. Remember - यह phase भी pass हो जाएगा। आप कितने hours पढ़ते हैं daily?";
  }
  
  if (lowerPrompt.includes('sleep') || lowerPrompt.includes('insomnia') || lowerPrompt.includes('tired')) {
    return "Sleep problems affect everything! Try to maintain a regular sleep schedule - same time सोना और उठना। Screen time को bedtime से 1 hour पहले बंद कर दें। Warm milk या light stretching help कर सकती है।";
  }
  
  if (lowerPrompt.includes('family') || lowerPrompt.includes('parents') || lowerPrompt.includes('home')) {
    return "Family dynamics can be challenging, especially during youth. Communication gap हो सकता है generations के बीच। Try to express your feelings calmly. Sometimes parents need time to understand. आप कैसे feel करते हैं इस situation में?";
  }
  
  if (lowerPrompt.includes('friend') || lowerPrompt.includes('social') || lowerPrompt.includes('relationship')) {
    return "Relationships में ups और downs होते हैं। Healthy boundaries बनाना important है। True friends आपको support करते हैं। क्या आप मुझे बता सकते हैं कि exactly क्या problem है?";
  }
  
  if (lowerPrompt.includes('help') || lowerPrompt.includes('support') || lowerPrompt.includes('crisis')) {
    return "मैं यहाँ आपकी help करने के लिए हूं। If you're in crisis, please call: KIRAN Helpline 1800-599-0019 (24x7). आप brave हैं कि help माँग रहे हैं। छोटे steps लेते जाएं, everything will be okay.";
  }
  
  // Positive responses
  if (lowerPrompt.includes('good') || lowerPrompt.includes('happy') || lowerPrompt.includes('better') || lowerPrompt.includes('fine')) {
    return "यह सुनकर खुशी हुई! Positive moments को celebrate करना important है। क्या चीज़ आपको आज खुश कर रही है? इन good feelings को maintain रखने के लिए gratitude practice कर सकते हैं।";
  }
  
  // General supportive response
  return "Namaste! मैं Saathiya हूं, आपका companion। मैं यहाँ आपकी बात सुनने और support करने के लिए हूं। Please feel free to share what's on your mind. आप safe space में हैं। 🤗";
}
