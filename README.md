# CrowdSentry AI 🏟️🤖

**CrowdSentry AI** is a proactive, agentic crowd orchestration and safety routing platform designed to handle stadium evacuation telemetry in real time. 

Built for the *Google Cloud Build with AI: Agentic Premier League Hackathon*, the platform shifts crowd safety from reactive tracking to proactive, proximity-aware routing. By simulating attendee flows and processing incidents (like turnstile jams or sudden lightning storms), Sentry AI ensures safe, dynamic egress routing without crowd crushing.

## 🚀 Key Features

*   **Tactical Telemetry & Simulation:** An optimized HTML5 Canvas 2D particle engine simulating 450+ attendees at 60 FPS, with real-time vector arithmetic, neighborhood density mapping, and thermal/vibration telemetry widgets.
*   **Multi-Agent Gemini Integration:** Powered by the official `@google/genai` SDK, a multi-agent loop coordinates reasoning between a *Tactical Commander* (routing correction), a *Security Liaison* (ground walkie-talkie dispatches), and a *Fan Advisory Agent* (chatbot Q&A).
*   **Dual-Mode Resilience:** A high-fidelity simulated agent fallback engine that allows the frontend to run fully functionally out-of-the-box, ensuring a bulletproof live presentation.
*   **Attendee Companion App:** A simulated smartphone screen containing a dynamic ticket access pass, an SVG-based live mini-map route that changes walking paths in real-time, and an accessibility-focused safety chatbot.
*   **Multi-Screen Dashboard:** Seamless, responsive tab navigation mapping out **Tactical**, **Telemetry**, **Logistics** (drone, medical, and security deployment mapping), and **Alerts** control panels.

## 🛠️ Tech Stack

*   **Frontend:** React 18 (Vite), Tailwind CSS (client-side CDN Integration), HSL Custom Styling
*   **Simulation Core:** Native HTML5 Canvas 2D API & RequestAnimationFrame
*   **Backend Proxy:** Node.js + Express
*   **AI Integration:** Official `@google/genai` SDK (Gemini 1.5/2.0)
*   **Deployment Target:** Google Cloud Run (Containerized via Alpine-based Docker)
