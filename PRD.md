# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Project: Stitch CrowdSentry AI
**Sub-title:** An Agentic Multi-Agent Crowd Orchestration & Adaptive Routing Platform  
**Target Event:** Google Cloud Build with AI: Agentic Premier League Hackathon  
**Target Environment:** Node.js/Express Backend (Serving Gemini SDK) + React/Vite Frontend  
**Deployment Target:** Google Cloud Run (GCP Containerized Compute)

---

## 1. STRATEGIC HACKATHON ALIGNMENT MAP

To achieve the maximum score of **95/95 points** across both evaluation phases, the implementation agent must construct this product to directly fulfill the following rubrics:

| Rubric Criteria | Score | Product Implementation Feature |
| :--- | :---: | :--- |
| **Innovation & Agentic Depth** (Phase 2) | **15 pts** | **Multi-Agent Coordination Loop:** Instead of standard optimization algorithms, a multi-agent hierarchy (*Tactical Commander*, *Security Liaison*, and *Fan Advisory Agent*) coordinate in real-time, executing reasoning loops via Gemini before performing structured actions. |
| **Live Demo Execution** (Phase 2) | **10 pts** | **Double-Mode Resilience State Machine:** Standard client-side React state machine manages all UI transitions, simulation states, and alerts. If the Gemini API key is missing or fails, the app instantly engages a high-fidelity **Simulated Agent Mode** to ensure a flawless pitch. |
| **Q&A & Technical Defense** (Phase 2) | **15 pts** | **Architectural Justification:** The system is built as a unified Node.js + React container that utilizes `@google/genai` (Google's official SDK) and runs as a serverless microservice on **Google Cloud Run** to handle scale, security, and low-latency updates. |
| **Static Code Analysis** (Phase 1) | **15 pts** | **Google AI SDK Integration:** Codebase directly integrates the official `@google/genai` package. Directory structure is clean and organized, free of bloated dependencies, with production-ready error handling. |
| **GCP Deployment Bonus** (Phase 1) | **5 pts** | **Containerized GCP Cloud Run:** Full container deployment on GCP Cloud Run, utilizing Artifact Registry, demonstrating enterprise-grade cloud architecture. |

---

## 2. OFFICIAL APPLICATION TECH STACK

To ensure absolute efficiency, high speed, and a simple setup, the project strictly uses the following stack:

* **Frontend Library:** **React 18 (Vite)**
  * *Why:* Rapid development compilation, instant hot-reloading, and an extremely optimized, lightweight bundled production package.
* **Styling Engine:** **Vanilla CSS + HSL Variables**
  * *Why:* Eliminates Tailwind utility configuration overhead. Custom CSS handles premium obsidian glassmorphism (`backdrop-filter`) and smooth pulsing keyframe animations natively.
* **Simulation Core:** **HTML5 Canvas 2D API**
  * *Why:* Renders 500+ crowd nodes at 60 FPS smoothly using high-speed vector arithmetic. Zero third-party physics library overhead.
* **Backend Server:** **Node.js + Express**
  * *Why:* Lightweight, single-process runtime to act as a secure proxy to the Gemini SDK and host the production React static bundle.
* **Google AI Integration:** **Official `@google/genai` SDK**
  * *Why:* Direct, robust integration with Gemini 1.5/2.0 models.
* **Icon Assets:** **Lucide React**
  * *Why:* High-quality, modern SVG vector icons, fully tree-shaken.

---

### 3. UNIFIED VISUAL INTERFACE LAYOUT & 4-TAB SYSTEM

The entire application operates as a **unified 4-Tab Navigation ("Stage") System** (inspired by modern aerospace cockpit telemetry and mission control dashboards). The user transitions between views smoothly via high-contrast header anchors:

* **TACTICAL TAB:** The dual-column split: left 65% (metric cards, StadiumCanvas egress simulator, controls deck, typewriter terminal log) + right 35% (MobileApp mockup with live QR ticket and Gemini chatbot).
* **TELEMETRY TAB:** Real-time sensor streams mapping:
  - Left Column: Vibration levels sensor card (fluctuates around `4.2 Hz`), Acoustic Pressure sensor card (spikes up to `98.1 dB` during storm alerts or `94.6 dB` on jams with alert glow), and Thermal Density grid card (`24.1 °C`).
  - Center Column: High-fidelity Concentric Radar sweeping dashboard (rotating sweeps, blips, signal processing bars).
  - Right Column: Interactive Sector Status table mapping green/blue/red status indicators across sectors (A-1, A-2, B-4, C-1, C-2, D-3, D-4). Sector C-1 enters **ALERT** when gate is jammed or storm is active.
* **LOGISTICS TAB:** Blueprint vector map and deployments tracking:
  - Left Column: Operator Profile menu card (Operator 01, Sectors) + navigation links + DEPLOYSQUAD action trigger.
  - Center Column: Full blueprint vector map representing live deployments (Drone Alpha, Medic Team 04, Security Unit 09) styled with grayscale elements and relative absolute positions. Show active alert banner if incident is active.
  - Right Column: Resource allocation metrics (Battery Level avg `84%`, Estimated Response Time modifying dynamically based on state, Staff Availability `92%`) + queue of active deployments.
* **ALERTS TAB:** Dynamic Incident Feed and Detailed Report deck:
  - Left Column: Operator menu.
  - Middle Column: Dynamic Incident Feed containing clickable alarm lists (Critical crowd anomalies, Breaches, sync complete info). Clicked cards load into detailed report.
  - Right Column: Detailed Incident Report view (Report #A7-2491, satellite map layout with linear scanner overlay, recommended AI action logs, high-contrast Tactical overrides: Evac Broadcast, Rapid Response dispatch, Clear Alarm reset).

```
+--------------------------------------------------------------------------------------------------+
|  SENTRY AI     [TACTICAL] [TELEMETRY] [LOGISTICS] [ALERTS]      [CMD: ACTIVE]  [AI: STANDBY]     |
+--------------------------------------------------------------------------------------------------+
|  Comfort Score [=====   ] 98%                   Extra Walk [=         ] +0.0m                     |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   DYNAMIC VIEW CONTAINER (Loads TACTICAL | TELEMETRY | LOGISTICS | ALERTS depending on active tab)  |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### Visual Themes & Design Tokens
* **Base Theme:** Obsidian Obsidian dark (`#07090e`), panel background Slate Blue (`#101524` with `backdrop-filter: blur(8px)` glassmorphism).
* **Alert States:**
  * **Safe / Pre-emptive (Cyan):** Neon Cyan (`#00f0ff` / `rgba(0, 240, 255, 0.05)`)
  * **Optimized Flow (Green):** Emerald Green (`#00e676` / `rgba(0, 230, 118, 0.05)`)
  * **Warning (Amber):** Electric Orange (`#ff8c00`)
  * **Danger (Crimson):** Pulsing Red/Rose (`#ff2e63`)
* **Layout Structure:** Symmetrical side-by-side grids with border-glows (`box-shadow: 0 0 15px rgba(0, 240, 255, 0.15)`).

---

## 4. PROACTIVE & PROXIMITY-AWARE INSTRUCTION ENGINE

To make the crowd orchestration feel truly premium and logistically practical, the system follows two primary operational specifications:

### A. Proactive Prevention Loop
* The AI Agent does not wait for a gate to jam. It continuously tracks the flow trajectories of seat stands.
* If the egress rate of Stand Block A suggests it will exceed Gate 2's capacity threshold (70%) within 10 minutes, the AI triggers a **Pre-Emptive Allocation Warning**.
* It proactively diverts a percentage of the stand to adjacent gates **before** any block or backup physically occurs, maintaining fluid, safe movement.

### B. Proximity-Aware Least-Distance (PALD) Routing
* When re-routing crowd streams, the AI must calculate gate proximity relative to the seat blocks. 
* **The Constraint:** Fans should **never** be sent to a gate on the opposite side of the stadium unless it is a catastrophic stadium evacuation event.
* **Proximity Map:**
  * **South Pavilion Stand:** Priority 1 $\rightarrow$ **Gate 3** (Adjacent), Priority 2 $\rightarrow$ **Gate 2 / Gate 5** (Sides).
  * **East Pavilion Stand:** Priority 1 $\rightarrow$ **Gate 2** (Adjacent), Priority 2 $\rightarrow$ **Gate 1 / Gate 3** (Sides).
  * **North Pavilion Stand:** Priority 1 $\rightarrow$ **Gate 1** (Adjacent), Priority 2 $\rightarrow$ **Gate 2 / Gate 5** (Sides).
  * **West Pavilion Stand:** Priority 1 $\rightarrow$ **Gate 5** (Adjacent), Priority 2 $\rightarrow$ **Gate 1 / Gate 3** (Sides).
* The Tactical Commander Agent must prioritize adjacent gates first to maximize the **Fan Comfort Score** and minimize **Avg Extra Walking Distance** telemetry.

---

## 5. LIGHTWEIGHT PERFORMANCE & MEMORY PROTOCOLS (MID-TIER SPEC)

### A. React State vs. Canvas Memory
* Hold particle physics data in a vanilla JS array using a React Reference (`useRef([])`):
  ```javascript
  const particlesRef = useRef([]); // Stores coordinates, velocities, and targets
  ```
* Use a native HTML5 Canvas `requestAnimationFrame` drawing loop to read directly from `particlesRef.current` and update positions.
* React state must **only** store macro UI statistics (e.g. Current Flow Rate, Egress Count, Alert Message, Fan Comfort Score, Extra Walking Distance) and update at a throttled rate of **once every 500ms** (using `setInterval`).

### B. Canvas Rendering Loop
* Draw each particle as a simple 2D circle with `ctx.arc()` and a solid color fill.
* Clear the screen using `ctx.clearRect()` or draw a highly efficient low-opacity rectangle (`ctx.fillStyle = 'rgba(7, 9, 14, 0.2)'`) to create a smooth, glowing particle tail effect.

---

## 6. HTML5 CANVAS STADIUM PARTICLE ENGINE SPEC

* Generates 400 to 500 active particles representing attendees.
* **Proactive Vector Math:** 
  * Particles travel at velocity vector $\vec{v}_i$ towards their assigned exit gates.
  * When predictive allocation kicks in, the flow vector bends smoothly *halfway* down the corridor split, visually showing fans dividing paths towards different gates (e.g. South stand dividing towards Gate 3 and Gate 2).
* **Physical Jamming (Manual Trigger):**
   * If "Block Gate 2" is clicked, it draws a red collision box.
   * Particles approaching Gate 2 decrease in velocity, turn red, and stack up.
   * The AI immediately routes the remaining stack to the **closest adjacent gate** (Gate 3/Gate 1) instead of the far Gate 5, unless adjacent gates are also full.

---

## 7. AGENTIC MULTI-AGENT ARCHITECTURE (GEMINI API)

### Agent 1: The Tactical Commander Agent
* **Role:** Analyzes stadium telemetry and active incident reports, reasons about solutions, and outputs structural exit adjustments.
* **Gemini Prompt Directive:**
  > "You are the Head Tactical Commander AI Agent for the Stadium Operations Center. Analyze the gate sensor densities and active incidents. You must act PROACTIVELY to prevent bottlenecks. If a stand's flow matches a future congestion profile, pre-emptively redirect a portion of the stand. You must act PROXIMITY-AWARE: reroute fans ONLY to the closest adjacent gate to minimize extra walking distance. Return your response as a structured JSON object."
* **Output Schema (JSON):**
```json
{
  "safetyAlert": "PRE-EMPTIVE SHIFT: South Pavilion redirected to adjacent Gate 3 to prevent Gate 2 load spike.",
  "riskLevel": "SAFE",
  "fanComfortScore": 90,
  "avgExtraDistanceMinutes": 1.2,
  "reasoningLogs": [
    "Predictive flow trajectory indicates Gate 2 will reach 80% capacity within 6 minutes.",
    "Rerouting South Pavilion Stand Block A to adjacent Gate 3 (closest proximity, only 15% loaded).",
    "Estimated extra walk time: +1.2 minutes. Fan comfort rating maintained at 90%.",
    "Avoiding Gate 5 reallocation to prevent fan frustration and non-compliance."
  ],
  "reallocations": [
    { "sector": "South Stand Block A", "fromGate": "Gate2", "toGate": "Gate3", "percentage": 50 }
  ]
}
```

### Agent 2: The Security Liaison Agent
* **Role:** Formulates direct walkie-talkie dispatches for ground volunteers and officers.
* **Output Example:** `[11:02:14] PREDICTIVE DISPATCH: Security at adjacent Gate 3, prepare turnstiles to receive 3,500 redirected fans from South Corridor. Keep flow fluid.`

### Agent 3: The Fan Advisory Agent (Conversational Chatbot)
* **Role:** Interactive chatbot nestled in the Fan Mobile Ticket App. Ingests user questions + live stadium telemetry JSON -> returns friendly, professional safety responses including details about accessibility (ramps, stairways, water stations) and why they were proactively redirected.
* **CORS & Rate-Limit Fallback Engine:**
  * If the API key is empty or is blocked, intercept the fetch and return a simulated state-aware agent text response instantly from a local script database.

---

## 8. PROJECT DIRECTORY & CODE ARCHITECTURE

```
/
├── Dockerfile                   # Single multi-stage container file
├── package.json                 # Bundled express server + genai dependencies
├── server.js                    # Express Node API server running GenAI SDK
├── vite.config.js               # React/Vite build pipeline
├── index.html                   # Core HTML entry (SEO metadata included)
├── src/
│   ├── main.jsx                 # Entry mounting point
│   ├── index.css                # Obsidian custom CSS & layout tokens
│   ├── App.jsx                  # Main orchestrator dashboard SPA
│   ├── components/
│   │   ├── StadiumCanvas.jsx    # Crowd particle flow visual canvas
│   │   ├── MobileApp.jsx        # Smart-phone companion with dynamic ticket & chat
│   │   └── MetricCard.jsx       # Custom telemetry gauges
│   └── services/
│       └── gemini.js            # Gemini API frontend connector & Fallback logic
```

---

## 9. DOCKER & GOOGLE CLOUD RUN DEPLOYMENT BLUEPRINT

### `Dockerfile`
```dockerfile
# Stage 1: Build the React client using Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve Express server and assets
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Set Environment variables
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080
CMD ["npm", "start"]
```

---

## 10. BACKEND API FLOW & LINKING SPECIFICATION

### A. The Handshake Loop
1. **Trigger Phase:** When the operator triggers an incident on the client (e.g. "Gate 2 jammed"), the React orchestrator state triggers a network fetch call to:
   * **Route:** `POST /api/orchestrate`
   * **Payload Structure:**
     ```json
     {
       "gateDensities": { "Gate1": 0.10, "Gate2": 0.88, "Gate3": 0.20, "Gate5": 0.12 },
       "activeIncident": "Gate 2 jammed due to turnstile electrical failure."
     }
     ```
2. **Execution Phase:** The React client receives the JSON. It updates:
   * `currentEgressTargets` coordinates for specific canvas sectors (rerouting particles from Gate 2 to closest adjacent Gate 3).
   * `commandAgentLogs` state array, initiating a typewriter scrolling text feed of the AI's step-by-step reasoning steps.
   * `fanComfortScore` telemetry metrics gauge, updating to the target rating (e.g., 90%).
   * `avgExtraDistance` telemetry metrics, updating to target time (+1.2 mins).
   * `ticketGate` and `mapDirectionRoute` on the mobile device frame, transitioning the user's ticket color and changing walking pathways.
   * `reviewPending` flag to active if Human-in-the-Loop validation is enabled.

---

## 11. HUMAN-IN-THE-LOOP (RECVIEW) & DYNAMIC BUFFER SPECIFICATION

To fulfill advanced operational robustness and defend against behavioral stampede risks:

### A. The RecView Control Loop (Admin Validation Gateway)
1. **Recommendation Generation:** When the AI calculates a proactive reroute or emergency plan, it does **not** push it directly to fans' tickets immediately.
2. **UI State Transition:**
   * The dashboard transitions to `review-pending` state.
   * A pulsing amber warning banner flashes: `⚠️ CRITICAL RECOMMENDATION GENERATED: APPROVAL REQUIRED`.
   * An operational notification details the reallocation (e.g. *Divert South Stand to Gate 3*).
3. **Admin Actions:**
   * **[APPROVE & DISPATCH]:** Overrides original targets instantly, pushing instructions to the mobile tickets and security tablets.
   * **[REJECT / ABORT]:** Discards the recommendation, maintaining previous targets.
   * **[MODIFY TARGETS]:** Allows the administrator to adjust gate target selections manually.

### B. Dynamic Buffer (Waiting) Zones
1. **Outflow Accumulation:** When exits are heavily congested (density > 85%), pushing more crowds into corridors increases crushing risk.
2. **Action State:** The Tactical Commander instructs fans to halt egress and wait inside designated open plaza areas within the stadium (e.g. **Plaza Buffer Zone South**).
3. **Mobile Client Update:**
   * The fan's mobile ticket transitions to **HOLD / WAIT** status (glowing amber color).
   * A notification displays: *"Exits are currently congested. Please wait in the South Plaza Holding Zone. Standard waiting time: 4 minutes. Free refreshments available at Station A."*
   * Once exit loads drop below 50%, the AI releases the fans in staggered egress windows, resuming green QR active states.

### C. Behavioral Panic Mitigation Protocols (Pitch Defense)
To completely mitigate the risk of mass panic and herd-mentality stampedes, the system operates four distinct mitigation vectors:
1. **Stealth Micro-Copy:** In standard pre-emptive load-balancing, the system completely avoids emergency language. Re-routing is framed as a convenience: *"Fast-Track exit gate activated. Save 2 minutes by using Gate 3."*
2. **Herd-Alignment Signage Sync:** The system triggers local physical signage APIs at the exit splits, synchronizing the app re-routes with green overhead directional arrows, aligning digital instructions with natural visual flow.
3. **Staggered Egress Releases:** Egress is divided into micro-windows based on stand blocks, preventing the hallway bottleneck threshold from ever being crossed.
4. **Guards Pre-Dispatch:** The Security Liaison Agent alerts ground volunteers 2 minutes *prior* to fan notification, ensuring physical human authorities are standing at the junction split points to guide fans safely.
