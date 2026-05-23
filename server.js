import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json({ limit: '16kb' })); // Limit request body size

// Serve static React production build
app.use(express.static(path.join(__dirname, 'dist')));

// Basic security headers (lightweight, no extra dependencies)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Gemini API route
app.post('/api/orchestrate', async (req, res) => {
  const { gateDensities, activeIncident } = req.body;

  // ── Input validation ──────────────────────────────────────────────────────
  if (!gateDensities || typeof activeIncident !== 'string' || activeIncident.trim() === '') {
    return res.status(400).json({ error: 'Invalid request payload. gateDensities and activeIncident are required.' });
  }

  // Sanitize: truncate and strip control characters to prevent prompt injection
  const safeIncident = activeIncident.slice(0, 300).replace(/[\r\n\t<>]/g, ' ').trim();

  const apiKey = process.env.GEMINI_API_KEY || req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(400).json({ error: 'Gemini API Key not configured. Set the GEMINI_API_KEY environment variable.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are the Tactical Commander AI for a stadium crowd orchestration system. Analyze the gate densities and active incident. Act PROACTIVELY (prevent bottlenecks before they occur) and PROXIMITY-AWARE (South Pavilion stand MUST route to the closest adjacent GATE 3 only). Gate densities: ${JSON.stringify(gateDensities)}. Active incident: ${safeIncident}. Return ONLY a valid JSON object with these fields: safetyAlert (string), riskLevel (string), fanComfortScore (number, target 90), avgExtraDistanceMinutes (number, target 1.2), reasoningLogs (string array, 4 items), reallocations (array of {sector, fromGate, toGate, percentage}).`,
      config: { responseMimeType: 'application/json' }
    });

    // ── Guard JSON.parse — Gemini may return non-JSON in edge cases ───────────
    let parsed;
    try {
      parsed = JSON.parse(response.text);
    } catch {
      return res.status(502).json({ error: 'AI returned an unparseable response. The fallback simulation mode remains active.' });
    }

    res.json(parsed);

  } catch (error) {
    // ── Never expose raw error.message to client in production ────────────────
    if (isDev) console.error('[CrowdSentry Server] Gemini API error:', error.message);
    res.status(500).json({
      error: isDev
        ? `Gemini API error: ${error.message}`
        : 'An internal server error occurred. The fallback simulation mode remains active.'
    });
  }
});

// Wildcard fallback to SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[CrowdSentry] Server running on port ${PORT} (${isDev ? 'development' : 'production'} mode)`);
});
