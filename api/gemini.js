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

    // Key selection logic:
    // - In production prefer `GEMINI_API_KEY` (set in Vercel dashboard)
    // - For local development, or when `PREFER_VITE_KEY=true`, prefer `VITE_GEMINI_API_KEY` so
    //   you can keep your key in .env.local as `VITE_GEMINI_API_KEY` during dev without exposing it to the browser.
    const preferVite = String(process.env.PREFER_VITE_KEY || '').toLowerCase() === 'true' || process.env.NODE_ENV === 'development';
    let apiKey = '';
    if (preferVite) {
      apiKey = (process.env.VITE_GEMINI_API_KEY || '').trim() || (process.env.GEMINI_API_KEY || '').trim();
    } else {
      apiKey = (process.env.GEMINI_API_KEY || '').trim() || (process.env.VITE_GEMINI_API_KEY || '').trim();
    }
    // Log incoming request meta
    console.log('Incoming /api/gemini request. prompt length:', String(prompt || '').length, 'history length:', (history || []).length);
    // Log deployment context to help debug env scoping issues
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV, 'VERCEL_URL:', process.env.VERCEL_URL);
    // Log masked presence of the key (do NOT print the full key)
    const hasKey = !!apiKey;
    const masked = hasKey ? `${apiKey.slice(0,4)}...${apiKey.slice(-4)} (len=${apiKey.length})` : null;
    console.log('GEMINI API key present on server:', hasKey, masked ? `masked:${masked}` : '', 'preferVite:', preferVite);

    if (!apiKey) {
      console.error('Missing GEMINI API key in environment. Expected GEMINI_API_KEY or VITE_GEMINI_API_KEY to be set.');
      return res.status(500).json({ error: 'Server misconfiguration: missing GEMINI API key' });
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
      // Try primary (string) form first, then fallback to part-list form if needed
      let response;
      try {
        response = await chat.sendMessage({ message: String(prompt || '') });
      } catch (primaryErr) {
        console.warn('Primary chat.sendMessage failed, attempting fallback part-list form. Error:', primaryErr?.message || primaryErr);
        try {
          response = await chat.sendMessage({ message: [{ text: String(prompt || '') }] });
          console.log('Fallback chat.sendMessage succeeded using part-list shape');
        } catch (fallbackErr) {
          console.error('Fallback chat.sendMessage also failed:', fallbackErr?.message || fallbackErr);
          throw fallbackErr;
        }
      }

      // Log diagnostics about the response
      try {
        const keys = response && typeof response === 'object' ? Object.keys(response) : [];
        console.log('/api/gemini response keys:', keys);
      } catch (e) {
        console.log('/api/gemini response inspect failed', e?.message || e);
      }

      // Robust extraction of text from various SDK response shapes
      function extractTextFromResponse(resp) {
        try {
          if (!resp) return '';
          // 1) SDK convenience getter
          if (typeof resp.text === 'string' && resp.text.trim().length > 0) return resp.text.trim();

          // 2) candidates -> content -> parts -> text
          if (Array.isArray(resp.candidates) && resp.candidates.length > 0) {
            const first = resp.candidates[0];
            const content = first.content;
            if (content) {
              const parts = content.parts || (Array.isArray(content) ? content : undefined);
              if (Array.isArray(parts) && parts.length > 0) {
                const texts = parts.map(p => (typeof p === 'string' ? p : (p && p.text) || '')).filter(Boolean);
                if (texts.length) return texts.join('');
              }
            }
          }

          // 3) output -> content -> parts
          if (Array.isArray(resp.output) && resp.output.length > 0) {
            for (const out of resp.output) {
              if (!out) continue;
              const contents = out.content || [];
              for (const c of contents) {
                const parts = c.parts || [];
                const texts = parts.map(p => (typeof p === 'string' ? p : (p && p.text) || '')).filter(Boolean);
                if (texts.length) return texts.join('');
              }
            }
          }

          // 4) nested response field
          if (resp.response) return extractTextFromResponse(resp.response);

          return '';
        } catch (e) {
          console.warn('extractTextFromResponse failed:', e?.message || e);
          return '';
        }
      }

      const text = extractTextFromResponse(response);
      console.log('/api/gemini extracted text length:', text.length, 'text present:', !!text);

      // Build a simplified debug view of candidates to return for inspection
      let debugCandidates = [];
      try {
        if (Array.isArray(response?.candidates)) {
          debugCandidates = response.candidates.map(c => {
            const partsTexts = [];
            try {
              const content = c.content;
              if (content) {
                const parts = content.parts || (Array.isArray(content) ? content : []);
                if (Array.isArray(parts)) {
                  for (const p of parts) {
                    if (!p) continue;
                    if (typeof p === 'string') partsTexts.push(p);
                    else if (typeof p.text === 'string') partsTexts.push(p.text);
                  }
                }
              }
            } catch (e) {
              // ignore
            }

            return {
              finishReason: c.finishReason,
              tokenCount: c.tokenCount,
              texts: partsTexts
            };
          });
        }
      } catch (e) {
        console.warn('Failed to build debugCandidates', e?.message || e);
      }

      return res.status(200).json({ text, candidates: debugCandidates, rawKeys: Object.keys(response || {}) });
    } catch (sendError) {
      console.error('chat.sendMessage threw an error:', sendError?.message || sendError);
      return res.status(500).json({ error: String(sendError?.message || sendError), details: (sendError && sendError.stack) ? String(sendError.stack) : undefined });
    }
  } catch (error) {
    console.error('Error in /api/gemini:', error);
    return res.status(500).json({ error: String(error?.message || error) });
  }
}
