import dotenv from 'dotenv';
import express from 'express';

// Load env from .env.local for local development (this file is ignored in git)
dotenv.config({ path: '.env.local' });

import handler from '../api/gemini.js';

const app = express();
app.use(express.json());

// Mount the same handler used on Vercel at /api/gemini
app.all('/api/gemini', async (req, res) => {
  try {
    // Delegate to the existing handler which expects (req, res)
    await handler(req, res);
  } catch (e) {
    console.error('Dev server handler error:', e?.message || e);
    res.status(500).json({ error: String(e?.message || e) });
  }
});

const PORT = process.env.DEV_SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Local dev API server listening on http://localhost:${PORT}`);
  console.log('Proxy /api requests from Vite to this server (vite.config.ts should be configured).');
});
