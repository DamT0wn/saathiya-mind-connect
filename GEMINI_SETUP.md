# Gemini AI Integration Setup

## ✅ Installation Complete

The Gemini AI has been successfully integrated into your Saathiya chatbot!

## 🔑 Required: Add Your API Key

1. **Get your API key** from [Google AI Studio](https://aistudio.google.com/apikey)

2. **Open the `.env.local` file** in the project root

3. **Replace the placeholder** with your actual API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Restart the dev server** for the changes to take effect:
   ```bash
   npm run dev
   ```

## 🎯 How It Works

### Multi-Turn Conversation
The chatbot now uses Google's Gemini AI with full conversation history context. Each response is:
- Contextually aware of the entire conversation
- Empathetic and culturally sensitive for Indian youth
- Bilingual (English + Hindi phrases)
- Brief and supportive

### Safety Features
- **Crisis Detection**: Local keywords trigger immediate crisis responses (doesn't wait for AI)
- **Risk Assessment**: Sentiment analysis runs before API calls
- **Fallback**: If API fails, provides helpline information
- **Exercise Suggestions**: Based on detected mood/keywords

### Files Modified/Created

1. **`src/utils/gemini.ts`** (NEW)
   - Handles Gemini API connection
   - Maps chat history to Gemini format
   - System instructions for AI persona

2. **`src/utils/responseGenerator.ts`** (UPDATED)
   - Now calls Gemini API for responses
   - Keeps crisis detection local
   - Suggests exercises based on context

3. **`.env.local`** (NEW)
   - Stores API key securely
   - Not committed to git (in .gitignore)

4. **`package.json`** (UPDATED)
   - Added `@google/genai` dependency

## 🧪 Testing

1. Start the dev server: `npm run dev`
2. Open the chat interface
3. Try these test messages:
   - "I'm feeling stressed about my exams"
   - "I feel lonely and isolated"
   - "I'm doing great today!"

## 🔒 Security Notes

- ✅ API key is stored in `.env.local` (not tracked by git)
- ✅ Only accessible via `import.meta.env.VITE_GEMINI_API_KEY`
- ⚠️ Never commit `.env.local` to version control
- ⚠️ Don't share your API key publicly

## 🎨 Customization

You can modify the AI personality in `src/utils/gemini.ts`:
- Change `systemInstruction` for different persona
- Adjust `temperature` (0.7 = balanced creativity)
- Modify `maxOutputTokens` for response length

## 📊 Current Model

- **Model**: `gemini-2.0-flash-exp`
- **Temperature**: 0.7 (balanced)
- **Max Tokens**: 256 (concise responses)
- **Context**: Full conversation history

## 🚀 Next Steps

1. Add your Gemini API key to `.env.local`
2. Restart the dev server
3. Test the chatbot with various scenarios
4. Fine-tune the system instructions if needed

---

**Need help?** Check the [Google AI SDK docs](https://ai.google.dev/gemini-api/docs)
