import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Compass, 
  Play, 
  AlertOctagon, 
  CloudLightning, 
  BrainCircuit, 
  RotateCcw,
  Sparkles,
  Wifi,
  Terminal as TerminalIcon,
  HeartPulse
} from 'lucide-react';
import StadiumCanvas from './components/StadiumCanvas';
import MobileApp from './components/MobileApp';
import MetricCard from './components/MetricCard';
import { getOrchestrationDecision } from './services/gemini';

export default function App() {
  const [simState, setSimState] = useState('idle'); // 'idle', 'running', 'gate2-blocked', 'storm-alert', 'rerouted'
  const [stats, setStats] = useState({
    exitedCount: 0,
    totalCount: 45000,
    congestionRisk: 0,
    egressRate: 0,
    fanComfortScore: 98,
    extraDistance: 0.0,
    gateLoads: { Gate1: 0, Gate2: 0, Gate3: 0, Gate5: 0 }
  });

  const [reviewPending, setReviewPending] = useState(false);
  const [pendingState, setPendingState] = useState(null);

  const handleApproveRec = () => {
    setReviewPending(false);
    setSimState(pendingState || 'rerouted');
    setReasoningLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ADMIN DISPATCH: AI Egress Recommendation APPROVED & DISPATCHED. QR codes updated.`
    ]);
  };

  const [aiLoading, setAiLoading] = useState(false);
  const [safetyAlert, setSafetyAlert] = useState('SYSTEM READY: Awaiting egress activation...');
  const [riskLevel, setRiskLevel] = useState('LOW');
  const [reasoningLogs, setReasoningLogs] = useState([
    "[11:00:00] CMD CENTER INITIALIZED: Stadium crowd routing services running.",
    "[11:00:01] CCTV SENSORS: 45,000 attendees inside seating blocks.",
    "[11:00:02] CROWDSENTRY AI: Seating stands mapping active. Awaiting egress trigger."
  ]);
  const [liaisonDispatches, setLiaisonDispatches] = useState([
    "[11:00:00] SECURITY LIAISON: Ground units are standing by at all sectors."
  ]);

  const terminalEndRef = useRef(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reasoningLogs, liaisonDispatches]);

  // Glassmorphism Mouse Spotlights (PRD Aerospace specification)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const panels = document.querySelectorAll('.glass-panel');
      panels.forEach(panel => {
        const rect = panel.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        panel.style.setProperty('--mouse-x', `${x}%`);
        panel.style.setProperty('--mouse-y', `${y}%`);
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle throttled callback from physics engine (Sec 4.A)
  const handleStatsUpdate = (newStats) => {
    setStats(prev => ({
      ...prev,
      ...newStats
    }));
  };

  // Run AI Orchestrator Call (Gemini integration with double mode resilience)
  const triggerAiOrchestrator = async (targetState) => {
    setAiLoading(true);
    setReasoningLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] CROWDSENTRY AI: Invoking Gemini multi-agent reasoning loop...`
    ]);

    try {
      const response = await getOrchestrationDecision({
        gateDensities: stats.gateLoads,
        activeIncident: targetState === 'gate2-blocked' 
          ? "Gate 2 physical block - turnstiles jammed."
          : "Thunderstorm warning - lightning risks near West stands.",
        stateType: targetState
      });

      if (response.success) {
        const { safetyAlert, riskLevel, reasoningLogs: aiLogs, dispatches } = response.data;
        
        setSafetyAlert(safetyAlert);
        setRiskLevel(riskLevel);
        
        // Add Gemini logs to terminal with timestamps
        const timestampedAiLogs = aiLogs.map(log => `[${new Date().toLocaleTimeString()}] TACTICAL COMMANDER: ${log}`);
        setReasoningLogs(prev => [...prev, ...timestampedAiLogs]);

        // Add dispatches to security dispatches log
        const timestampedDispatches = dispatches.map(log => `[${new Date().toLocaleTimeString()}] SECURITY DISPATCH: ${log}`);
        setLiaisonDispatches(prev => [...prev, ...timestampedDispatches]);

        // Queue the recommendation for manual admin review (RecView loop)
        setReviewPending(true);
        setPendingState('rerouted');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // Egress state triggers
  const handleStartEgress = () => {
    setSimState('running');
    setSafetyAlert('EGRESS ACTIVE: Standard evacuation guidelines are being broadcast.');
    setRiskLevel('LOW');
    setReasoningLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] TACTICAL COMMANDER: Initiating egress. Crowd moving towards original gates.`,
      `[${new Date().toLocaleTimeString()}] SECURITY LIAISON: All turnstiles fully open.`
    ]);
  };

  const handleBlockGate2 = () => {
    setSimState('gate2-blocked');
    setSafetyAlert('INCIDENT ALERT: Turnstiles jammed at Gate 2 segment. High risk of crush injuries.');
    setRiskLevel('CRITICAL');
    setReasoningLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] MONITOR SENSORS: Extreme crowd surge detected near East Stand. Egress rate zero.`,
      `[${new Date().toLocaleTimeString()}] SYSTEM DIAGNOSTIC: Turnstile block identified at Gate 2. Crush index rising.`
    ]);
  };

  const handleStormAlert = () => {
    setSimState('storm-alert');
    setSafetyAlert('WEATHER EVACUATION: Lightning storm warning near West Stand. Emptying seating stands immediately.');
    setRiskLevel('HIGH');
    setReasoningLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] MET METEOROLOGY: Active storm front over arena. Extreme hazard levels.`,
      `[${new Date().toLocaleTimeString()}] SAFETY PROTOCOL: Commencing accelerated weather egress.`
    ]);
  };

  const handleReset = () => {
    setSimState('idle');
    setSafetyAlert('SYSTEM READY: Awaiting egress activation...');
    setRiskLevel('LOW');
    setReasoningLogs([
      `[${new Date().toLocaleTimeString()}] CMD CENTER RESET: Simulation parameters restored.`,
      `[${new Date().toLocaleTimeString()}] CCTV SENSORS: 45,000 attendees inside seating blocks.`
    ]);
    setLiaisonDispatches([
      `[${new Date().toLocaleTimeString()}] SECURITY LIAISON: Ground units are standing by at all sectors.`
    ]);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0c0e13] text-slate-200 font-body-base overflow-hidden relative">
      
      {/* 1. Header with System Diagnostics & LED Lights (PRD Sec 3) */}
      <header className="w-full bg-[#111319]/80 backdrop-blur-xl border-b border-[#3b494b]/30 shadow-[0_0_20px_rgba(0,240,255,0.15)] z-50 px-6 py-3 shrink-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-10">
            <h1 className="font-display-lg text-[24px] tracking-tighter text-cyan-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.4)] uppercase">
              Sentry AI
            </h1>
            
            <nav className="hidden md:flex gap-8">
              <a className="text-cyan-400 border-b-2 border-cyan-400 font-bold pb-1 transition-all duration-300 uppercase text-[10px] tracking-widest" href="#">Tactical</a>
              <a className="text-slate-400 font-medium hover:text-cyan-300 transition-all duration-300 uppercase text-[10px] tracking-widest" href="#">Telemetry</a>
              <a className="text-slate-400 font-medium hover:text-cyan-300 transition-all duration-300 uppercase text-[10px] tracking-widest" href="#">Logistics</a>
              <a className="text-slate-400 font-medium hover:text-cyan-300 transition-all duration-300 uppercase text-[10px] tracking-widest" href="#">Alerts</a>
            </nav>
          </div>

          {/* Header Stats (Proactive Metrics - PRD Sec 3) */}
          <div className="flex items-center gap-5 border-l border-r border-[#3b494b]/30 px-6 mx-4">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center w-28 text-[9px] font-bold text-slate-400 tracking-wider uppercase font-label-caps">
                <span>Comfort Score</span>
                <span className={stats.fanComfortScore < 88 ? "text-[#ff2e63]" : stats.fanComfortScore < 95 ? "text-[#ff8c00] glow-text-orange" : "text-[#34f885] glow-text-green"}>
                  {simState === 'idle' ? '98%' : `${stats.fanComfortScore}%`}
                </span>
              </div>
              <div className="w-28 h-1 bg-[#1a2035]/80 rounded-full overflow-hidden border border-slate-800/30">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: simState === 'idle' ? '98%' : `${stats.fanComfortScore}%`,
                    backgroundColor: stats.fanComfortScore < 88 ? '#ff2e63' : stats.fanComfortScore < 95 ? '#ff8c00' : '#34f885',
                    boxShadow: stats.fanComfortScore < 88 ? '0 0 6px #ff2e63' : stats.fanComfortScore < 95 ? '0 0 6px #ff8c00' : '0 0 6px #34f885'
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center w-28 text-[9px] font-bold text-slate-400 tracking-wider uppercase font-label-caps">
                <span>Extra Walk</span>
                <span className={stats.extraDistance > 1.0 ? "text-[#ff8c00] glow-text-orange" : "text-cyan-400 glow-text-cyan"}>
                  {simState === 'idle' ? '+0.0m' : `+${stats.extraDistance.toFixed(1)}m`}
                </span>
              </div>
              <div className="w-28 h-1 bg-[#1a2035]/80 rounded-full overflow-hidden border border-slate-800/30">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: simState === 'idle' ? '0%' : `${Math.min(100, (stats.extraDistance / 3.0) * 100)}%`,
                    backgroundColor: stats.extraDistance > 1.0 ? '#ff8c00' : '#00f0ff',
                    boxShadow: stats.extraDistance > 1.0 ? '0 0 6px #ff8c00' : '0 0 6px #00f0ff'
                  }}
                />
              </div>
            </div>
          </div>

          {/* LED Diagnostic Statuses & Material Symbol Icons */}
          <div className="flex items-center gap-6">
            <div className="flex gap-4 items-center border-r border-[#3b494b]/30 pr-5">
              <button className="active:scale-95 transition-transform"><span className="material-symbols-outlined text-slate-400 hover:text-cyan-300 transition-colors">settings</span></button>
              <button className="active:scale-95 transition-transform relative">
                <span className="material-symbols-outlined text-slate-400 hover:text-cyan-300 transition-colors">notifications_active</span>
                <span className="absolute top-0 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
              </button>
              <button className="active:scale-95 transition-transform"><span className="material-symbols-outlined text-slate-400 hover:text-cyan-300 transition-colors">account_circle</span></button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-label-caps">CMD</span>
                <span className="status-tag safe border-[#34f885]/20 text-[#34f885]" style={{ padding: '2px 8px' }}>
                  <span className="pulse-led-green" /> ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-label-caps">AI</span>
                {aiLoading ? (
                  <span className="status-tag warning animate-pulse border-orange-500/20 text-[#ff8c00]" style={{ padding: '2px 8px' }}>
                    <span className="pulse-led-orange" /> RUNNING
                  </span>
                ) : simState === 'rerouted' ? (
                  <span className="status-tag safe border-cyan-500/20 text-cyan-400" style={{ padding: '2px 8px' }}>
                    <span className="pulse-led-cyan" /> PREDICTIVE
                  </span>
                ) : (
                  <span className="status-tag safe border-cyan-500/20 text-cyan-400" style={{ padding: '2px 8px' }}>
                    <span className="pulse-led-cyan" /> STANDBY
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Split Layout: 65% Telemetry CMD, 35% Attendee Smartphone */}
      <main className="flex-1 flex gap-4 min-h-0 px-6 py-4 bg-[radial-gradient(circle_at_center,_#111319_0%,_#07090e_100%)] relative">
        {/* Subtle high-density grid lines background (PRD Sec 11.C & DESIGN.md) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* LEFT COLUMN: Tactical Command Panel (65% Width) */}
        <section className="flex-[0.65] flex flex-col gap-3.5 min-w-0">
          
          {/* Telemetry Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-3.5">
            <MetricCard 
              title="EGRESS SPEED" 
              value={simState === 'idle' ? '0' : stats.egressRate} 
              unit="fans / min"
              icon={Activity}
              status={simState === 'gate2-blocked' || simState === 'storm-alert' ? 'danger' : 'safe'}
              description="Exiting throughput speed"
              trend={simState === 'rerouted' ? { direction: 'up', value: '25%' } : null}
            />
            <MetricCard 
              title="FAN COMFORT SCORE" 
              value={simState === 'idle' ? '98%' : `${stats.fanComfortScore}%`}
              icon={HeartPulse}
              status={stats.fanComfortScore < 88 ? 'danger' : stats.fanComfortScore < 95 ? 'warning' : 'safe'}
              description="Participant comfort rating"
              trend={simState === 'rerouted' ? { direction: 'down', value: '6%' } : null}
            />
            <MetricCard 
              title="EXTRA WALKING DISTANCE" 
              value={simState === 'idle' ? '+0.0 min' : `+${stats.extraDistance.toFixed(1)} min`}
              unit="Walk time"
              icon={Compass}
              status={stats.extraDistance > 1.0 ? 'warning' : 'safe'}
              description="Proximity-Aware detour index"
            />
          </div>

          {/* HTML5 Physics Particle Simulator Panel */}
          <div className="flex-1 min-h-0 glass-panel glowing-cyan bg-carbon-fibre relative overflow-hidden rounded-3xl border border-[#3b494b]/30">
            {/* Sentry HUD Chips */}
            <div className="absolute top-6 left-6 z-10 flex gap-3">
              <div className="px-4 py-1.5 bg-[#00f0ff]/10 text-cyan-400 rounded-xl text-[9px] font-bold border border-[#00f0ff]/30 tracking-widest uppercase font-label-caps">Live Telemetry</div>
              <div className="px-4 py-1.5 bg-[#191c21]/80 text-slate-400 rounded-xl text-[9px] font-bold border border-[#3b494b]/30 tracking-widest uppercase font-label-caps">Stadium B-2</div>
            </div>

            {/* Corner styling widgets */}
            <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-slate-400 bg-[#0c0e13]/80 px-3 py-1.5 rounded-xl border border-[#3b494b]/20 tracking-wider font-label-caps">
                ZOOM: 100%
              </span>
              <span className="text-[9px] font-mono font-bold text-[#34f885] bg-[#0c0e13]/80 px-3 py-1.5 rounded-xl border border-[#3b494b]/20 tracking-wider font-label-caps animate-pulse shadow-[0_0_8px_rgba(52,248,133,0.2)]">
                60 FPS
              </span>
            </div>
            
            <StadiumCanvas 
              simulationState={simState}
              onStatsUpdate={handleStatsUpdate}
            />

            {/* RecView Vetting Gate (PRD Sec 11.A) */}
            {reviewPending && (
              <div className="absolute inset-x-4 top-14 bg-[#101524]/95 backdrop-blur-lg border border-[#ff8c00]/45 rounded-xl p-4 shadow-[0_0_30px_rgba(255,140,0,0.25)] z-20 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[#ff8c00] font-bold text-[10px] uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-ping" />
                    Pending Decision: Proactive AI Egress Recommendation
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleApproveRec}
                      className="px-3.5 py-1.5 bg-[#00e676]/20 hover:bg-[#00e676]/35 text-[#00e676] text-[10px] font-bold rounded border border-[#00e676]/40 transition"
                    >
                      Approve & Dispatch
                    </button>
                    <button 
                      onClick={() => {
                        setReviewPending(false);
                        setReasoningLogs(prev => [
                          ...prev,
                          `[${new Date().toLocaleTimeString()}] ADMIN DISPATCH: Recommendation REJECTED. Maintaining original routing.`
                        ]);
                      }}
                      className="px-3.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/30 text-[#ff2e63] text-[10px] font-bold rounded border border-rose-500/30 transition"
                    >
                      Reject Plan
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-slate-300 font-mono bg-black/60 p-3 rounded border border-slate-800 leading-relaxed">
                  <div className="text-[#00f0ff] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles size={11} className="text-[#00f0ff]" /> Proposed Dynamic Action
                  </div>
                  <div>{safetyAlert}</div>
                </div>
              </div>
            )}
          </div>

          {/* Simulator Controls & Agent Reason Logs Console Grid */}
          <div className="grid grid-cols-[250px_1fr] gap-panel-gap" style={{ height: '185px' }}>
            
            {/* Simulator Trigger Buttons Panel */}
            <div className="glass-panel border-[#3b494b]/30 bg-[#191c21]/60 p-4 flex flex-col gap-2 justify-center rounded-3xl">
              <h3 className="font-label-caps uppercase text-[10px] tracking-widest text-slate-400 mb-2 border-b border-[#3b494b]/30 pb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#00f0ff]">settings_input_component</span>
                Simulator Control Deck
              </h3>
              
              <button 
                onClick={handleStartEgress}
                disabled={simState !== 'idle'}
                className="flex items-center justify-between px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-[#34f885] text-xs font-semibold rounded-xl border border-emerald-500/20 transition disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                  <span className="font-label-caps text-[10px]">Start Egress</span>
                </div>
                <span className="text-[8px] font-mono opacity-60">INIT</span>
              </button>

              <button 
                onClick={handleBlockGate2}
                disabled={simState === 'idle' || simState === 'gate2-blocked' || simState === 'storm-alert' || simState === 'rerouted'}
                className="flex items-center justify-between px-4 py-2 bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/20 text-[#ffb4ab] text-xs font-semibold rounded-xl border border-[#ffb4ab]/20 transition disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[15px]">block</span>
                  <span className="font-label-caps text-[10px]">Jam Gate 2</span>
                </div>
                <span className="text-[8px] font-mono opacity-60">BLOCK</span>
                <div className="absolute bottom-0 left-0 h-0.5 bg-[#ffb4ab] transition-all duration-500" style={{ width: simState === 'gate2-blocked' ? '100%' : '0%' }}></div>
              </button>

              <button 
                onClick={handleStormAlert}
                disabled={simState === 'idle' || simState === 'gate2-blocked' || simState === 'storm-alert' || simState === 'rerouted'}
                className="flex items-center justify-between px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-[#ff8c00] text-xs font-semibold rounded-xl border border-amber-500/20 transition disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[15px]">warning</span>
                  <span className="font-label-caps text-[10px]">Storm Warning</span>
                </div>
                <span className="text-[8px] font-mono opacity-60">EVAC</span>
              </button>

              <div className="flex gap-2">
                <button 
                  onClick={() => triggerAiOrchestrator(simState)}
                  disabled={simState !== 'gate2-blocked' && simState !== 'storm-alert'}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-cyan-300 text-[10px] font-bold rounded-xl border border-[#00f0ff]/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  Gemini AI
                </button>
                
                <button 
                  onClick={handleReset}
                  className="flex items-center justify-center p-2 bg-[#282a30] hover:bg-[#33353b] text-slate-300 rounded-xl border border-outline-variant/30 transition"
                >
                  <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                </button>
              </div>
            </div>

            {/* scrolling monospaced terminal logs panel */}
            <div className="glass-panel border-[#3b494b]/30 rounded-3xl bg-black/40 overflow-hidden flex flex-col">
              <div className="bg-[#0c0e13]/90 border-b border-[#3b494b]/30 px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 font-display-lg text-[#34f885]">
                  <span className="w-1.5 h-1.5 bg-[#34f885] rounded-full animate-ping" />
                  AI Core System Reasoning
                </span>
                <span className="text-slate-500 font-mono text-[9px]">v4.2.0-PREMIUM_CORE</span>
              </div>

              {/* Monospaced Fira Code scroll container (PRD Sec 3) */}
              <div className="flex-1 overflow-y-auto p-4 terminal-font text-slate-300 flex flex-col gap-1.5 max-h-[145px] scrollbar-thin font-mono-metrics">
                {reasoningLogs.map((log, idx) => {
                  let colorClass = 'text-slate-400';
                  if (log.includes('TACTICAL COMMANDER')) colorClass = 'text-[#34f885] font-semibold';
                  else if (log.includes('CRITICAL') || log.includes('INCIDENT') || log.includes('ADMIN DISPATCH:')) colorClass = 'text-[#ffb4ab] font-bold';
                  else if (log.includes('Gemini')) colorClass = 'text-cyan-400 animate-pulse';

                  return (
                    <div key={idx} className={`${colorClass} flex gap-2 leading-tight`}>
                      {log}
                    </div>
                  );
                })}

                {/* Liaison walkie talkie dispatches logs */}
                {liaisonDispatches.map((log, idx) => (
                  <div key={`liaison-${idx}`} className="text-cyan-300/90 font-mono italic">
                    {log}
                  </div>
                ))}
                
                {aiLoading && (
                  <div className="text-cyan-400 animate-pulse font-mono">
                    &gt;&gt; CROWDSENTRY COMMANDER IS THINKING... REALLOCATING FLOW VECTORS...
                  </div>
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>

          </div>

        </section>

        {/* RIGHT COLUMN: Attendee Companion App (35% Width) */}
        <section className="flex-[0.35] min-w-0">
          <MobileApp 
            gate={simState === 'rerouted' ? 'GATE 3' : 'GATE 2'}
            status={simState === 'gate2-blocked' || simState === 'storm-alert' ? 'danger' : simState === 'rerouted' ? 'warning' : 'safe'}
            riskIndex={stats.congestionRisk}
            simState={simState}
          />
        </section>

      </main>
    </div>
  );
}
