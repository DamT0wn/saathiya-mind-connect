import { GoogleGenAI } from "@google/genai";
import { Message } from '@/types/chat';

// Initialize the Gemini API client
const genAI = new GoogleGenAI({
  apiKey: (import.meta.env.VITE_GEMINI_API_KEY || '').trim(),
});

// Prefer stable, fast chat model
const modelName = "gemini-2.5-flash";

/**
 * Maps the local Message[] history to the Gemini Content[] array for context.
 */
function mapChatHistoryToGeminiContent(messages: Message[]) {
  // Filters out the first welcome message and maps sender roles.
  return messages
    .filter(msg => msg.id !== '1' && msg.content.trim().length > 0)
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
}

/**
 * Initializes a new chat session with system instructions and prior history.
 */
function getChat(history: Message[]) {
  const geminiHistory = mapChatHistoryToGeminiContent(history);
  
  // Custom persona and instructions for your AI companion
  const systemInstruction = `You are Saathiya (meaning companion), a youth-centric, emotionally intelligent AI companion from India. Your goal is to provide non-judgmental, empathetic support and mental wellness micro-interventions. Respond primarily in English, but incorporate empathetic Hindi phrases (like 'Namaste,' 'Aapka Saathi,' 'kyun,' etc.) naturally, as the user may be Indian youth. Keep responses conversational, brief, and supportive. Prioritize the user's emotional state and always end your response with a question to encourage further conversation.`;

  return genAI.chats.create({
    model: modelName,
    history: geminiHistory,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7, // Adjust for creativity vs. consistency
      maxOutputTokens: 256, // Keep responses concise
    }
  });
}

/**
 * Sends a message to the Gemini model using the current conversation context.
 */
export async function sendMessageToGemini(history: Message[], newMessage: string): Promise<string> {
  try {
    if (!genAI || !(import.meta.env.VITE_GEMINI_API_KEY || '').trim()) {
      throw new Error('Missing VITE_GEMINI_API_KEY. Please set it in .env.local and restart the dev server.');
    }
    const chat = getChat(history);
    
    // Send message with correct parameter structure per @google/genai API
    const response = await chat.sendMessage({
      message: newMessage
    });

    // Extract text from response
    return response.text.trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
