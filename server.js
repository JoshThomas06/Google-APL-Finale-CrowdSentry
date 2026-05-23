import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Serve static React production build
app.use(express.static(path.join(__dirname, 'dist')));

// Gemini API route
app.post('/api/orchestrate', async (req, res) => {
  const { gateDensities, activeIncident } = req.body;
  const apiKey = req.headers['x-api-key'] || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ error: "Missing Gemini API Key." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Perform crowd evacuation routing for: Densities: ${JSON.stringify(gateDensities)}. Incident: ${activeIncident}. You must act PROACTIVELY to prevent bottlenecks. You must act PROXIMITY-AWARE: South Pavilion stand reallocations MUST route strictly to the closest adjacent GATE 3. The response must include 'fanComfortScore' (90% Comfort) and 'avgExtraDistanceMinutes' (+1.2 mins). Return strictly a JSON matching the PRD specification.`,
      config: { responseMimeType: 'application/json' }
    });
    
    res.json(JSON.parse(response.text));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Wildcard fallback to SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server successfully running on port ${PORT}`);
});
