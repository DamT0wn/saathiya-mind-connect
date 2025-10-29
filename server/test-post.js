// Simple node script to POST a test message to the local dev API server
// Usage: node server/test-post.js

async function main() {
  const url = process.env.API_URL || 'http://127.0.0.1:3001/api/gemini';
  const body = {
    prompt: 'Hello from local test script — please return the model output and candidates',
    history: []
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('Status:', res.status);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Non-JSON response (raw):');
      console.log(text);
    }
  } catch (err) {
    console.error('Request failed:', err?.message || err);
    process.exit(1);
  }
}

main();
