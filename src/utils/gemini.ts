// Client-side stub: do NOT include the Gemini SDK or private keys in the browser bundle.
// The real Gemini API calls must be performed on the server via POST /api/gemini.

/**
 * Client stub for sendMessageToGemini. If called in the browser it throws a clear error
 * so accidental client-side SDK use is immediately obvious.
 */
export async function sendMessageToGemini(): Promise<string> {
  throw new Error('Attempted to call sendMessageToGemini from client-side. Use POST /api/gemini server endpoint instead.');
}

export default null as unknown;
