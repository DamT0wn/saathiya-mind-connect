import { GoogleGenAI } from '@google/genai';

const MODEL_NAME = 'gemini-2.5-flash';

function mapChatHistoryToGeminiContent(messages = []) {
  return (messages || [])
    .filter(m => m && typeof m.content === 'string' && m.content.trim().length > 0)
    .map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
}

export default async function handler(req, res) {
  try {
    // Support a simple health check via GET so you can verify the server sees the key in production
    if (req.method === 'GET') {
      const present = !!(process.env.GEMINI_API_KEY || '').trim();
      return res.status(200).json({ ok: true, hasKey: present });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Parse JSON body (works on Vercel serverless)
    let body = {};
    try { body = req.body && Object.keys(req.body).length ? req.body : JSON.parse(await new Promise(r => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>r(d)); })); } catch (e) { body = {}; }
    const { prompt, history } = body || {};

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    console.log('Incoming /api/gemini request. prompt length:', String(prompt || '').length, 'history length:', (history || []).length);
    console.log('GEMINI_API_KEY present on server:', !!apiKey);
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY in environment on server');
      return res.status(500).json({ error: 'Server misconfiguration: missing GEMINI_API_KEY' });
    }

    const genAI = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are Saathiya (meaning companion), a youth-centric, emotionally intelligent AI companion from India. Provide empathetic, culturally-aware support. Keep responses brief and supportive.`;

    const geminiHistory = mapChatHistoryToGeminiContent(history || []);

    const chat = genAI.chats.create({
      model: MODEL_NAME,
      history: geminiHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 256
      }
    });

    try {
      console.log('Calling chat.sendMessage with message length:', String(prompt || '').length);
      const response = await chat.sendMessage({ message: String(prompt || '') });

      // Log some diagnostics about the response object
      try {
        const keys = response && typeof response === 'object' ? Object.keys(response) : [];
        console.log('/api/gemini response keys:', keys);
      } catch (e) {
        console.log('/api/gemini response inspect failed', e?.message || e);
      }

      const text = response && response.text ? String(response.text) : '';
      console.log('/api/gemini response text length:', text.length, 'text present:', !!text);
      return res.status(200).json({ text });
    } catch (sendError) {
      console.error('chat.sendMessage threw an error:', sendError?.message || sendError);
      // Return the error details in the response temporarily to help debugging in production logs
      return res.status(500).json({ error: String(sendError?.message || sendError), details: (sendError && sendError.stack) ? String(sendError.stack) : undefined });
    }
  } catch (error) {
    console.error('Error in /api/gemini:', error);
    return res.status(500).json({ error: String(error?.message || error) });
  }
}
