/**
 * Stitch CrowdSentry AI - State Machine & Gemini SDK Connector
 * Replicates the double-mode resilience loop (Active / Fallback)
 * to ensure robust presentation during live pitches.
 */

// Simulated pre-scripted multi-agent reasoning outputs (PRD Sec 4 & 6)
const mockCommanderDatabase = {
  normal: {
    safetyAlert: "OPERATIONS NORMAL: Standard egress routing active.",
    riskLevel: "LOW",
    fanComfortScore: 98,
    avgExtraDistanceMinutes: 0.0,
    reasoningLogs: [
      "Detected even distribution across all sectors.",
      "Gates 1, 2, 3, and 5 are fully operational.",
      "Egress rate is running efficiently at 185 fans/min.",
      "No security bottlenecks or stampede warning cues registered."
    ],
    reallocations: []
  },
  
  blocked: {
    safetyAlert: "PRE-EMPTIVE SHIFT: South Pavilion redirected to adjacent Gate 3 to prevent Gate 2 load spike.",
    riskLevel: "SAFE",
    fanComfortScore: 90,
    avgExtraDistanceMinutes: 1.2,
    reasoningLogs: [
      "Predictive flow trajectory indicates Gate 2 will reach 80% capacity within 6 minutes.",
      "Rerouting South Pavilion Stand Block A to adjacent Gate 3 (closest proximity, only 15% loaded).",
      "Estimated extra walk time: +1.2 minutes. Fan comfort rating maintained at 90%.",
      "Avoiding Gate 5 reallocation to prevent fan frustration and non-compliance."
    ],
    reallocations: [
      { sector: "South Stand Block A", fromGate: "Gate2", toGate: "Gate3", percentage: 50 }
    ]
  },
  
  storm: {
    safetyAlert: "WEATHER EMERGENCY: Thunderstorm alert. Active storm evacuation protocol engaged.",
    riskLevel: "EXTREME",
    fanComfortScore: 85,
    avgExtraDistanceMinutes: 0.8,
    reasoningLogs: [
      "Severe weather alert: lightning strikes detected in stadium outer boundaries.",
      "Gate 2 is blocked. High density clusters are trapped under structural canopies.",
      "Activating backup manual gateways at adjacent Gate 3 and Gate 1.",
      "Rerouting South stand stand sectors entirely to adjacent Gate 3: 70% adjacent, 30% Gate 1."
    ],
    reallocations: [
      { sector: "South Stand (Evacuation)", fromGate: "Gate2", toGate: "Gate3", percentage: 70 },
      { sector: "South Stand (Evacuation)", fromGate: "Gate2", toGate: "Gate1", percentage: 30 }
    ]
  }
};

// Security dispatches logs (Liaison Agent dispatches)
const mockLiaisonLogs = {
  normal: [
    "LIAISON DISPATCH: Ground staff, maintain standard egress signage at all gates.",
    "LIAISON DISPATCH: Gate 2 operations, turnstile throughput is optimal. 185/min."
  ],
  blocked: [
    "LIAISON DISPATCH: PREDICTIVE DISPATCH: Security at adjacent Gate 3, prepare turnstiles to receive 3,500 redirected fans from South Corridor. Keep flow fluid.",
    "LIAISON DISPATCH: Crowd monitors at East Stand, direct flows away from Gate 2 segments towards Gate 3 adjacent corridor.",
    "LIAISON DISPATCH: Technical support dispatched to Gate 2 jammed turnstiles."
  ],
  storm: [
    "LIAISON DISPATCH: EMERGENCY! Open all high-capacity backup manual exits at Gate 3 and Gate 1 immediately.",
    "LIAISON DISPATCH: Support staff, deploy accessibility helpers to Gate 3 tunnels to assist families and strollers.",
    "LIAISON DISPATCH: Medical teams, establish staging areas at Gate 3 and Gate 1 exit tunnels."
  ]
};

export async function getOrchestrationDecision({ gateDensities, activeIncident, stateType }) {
  // Resilience state machine: check if running locally or API key is absent (PRD Sec 5)
  // Since this is the UI-First client mock engine, it acts as a high-fidelity simulator immediately.
  
  return new Promise((resolve) => {
    // Artificial 1.5s network delay to show loading UI animation
    setTimeout(() => {
      let data = mockCommanderDatabase.normal;
      let dispatches = mockLiaisonLogs.normal;

      if (stateType === 'gate2-blocked') {
        data = mockCommanderDatabase.blocked;
        dispatches = mockLiaisonLogs.blocked;
      } else if (stateType === 'storm-alert') {
        data = mockCommanderDatabase.storm;
        dispatches = mockLiaisonLogs.storm;
      }

      resolve({
        success: true,
        isSimulated: true, // resilience confirmation
        data: {
          ...data,
          dispatches,
          timestamp: new Date().toLocaleTimeString()
        }
      });
    }, 1200);
  });
}
