import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  HeartPulse,
  Compass,
  Sparkles,
} from 'lucide-react';
import StadiumCanvas from './components/StadiumCanvas';
import MobileApp from './components/MobileApp';
import MetricCard from './components/MetricCard';
import { getOrchestrationDecision } from './services/gemini';

export default function App() {
  const [simState, setSimState] = useState('idle');
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
  const [currentTab, setCurrentTab] = useState('tactical');

  const handleApproveRec = () => {
    setReviewPending(false);
    setSimState(pendingState || 'rerouted');
    setReasoningLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ADMIN DISPATCH: AI Egress Recommendation APPROVED & DISPATCHED. QR codes updated.`
    ]);
  };

  const [vibrationHz, setVibrationHz] = useState(4.2);
  useEffect(() => {
    const timer = setInterval(() => {
      setVibrationHz(Number((4.0 + Math.random() * 0.4).toFixed(2)));
    }, 800);
    return () => clearInterval(timer);
  }, []);

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

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reasoningLogs, liaisonDispatches]);

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

  const handleStatsUpdate = (newStats) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

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
        const timestampedAiLogs = aiLogs.map(log => `[${new Date().toLocaleTimeString()}] TACTICAL COMMANDER: ${log}`);
        setReasoningLogs(prev => [...prev, ...timestampedAiLogs]);
        const timestampedDispatches = dispatches.map(log => `[${new Date().toLocaleTimeString()}] SECURITY DISPATCH: ${log}`);
        setLiaisonDispatches(prev => [...prev, ...timestampedDispatches]);
        setReviewPending(true);
        setPendingState('rerouted');
      }
    } catch (e) {
      if (import.meta.env.DEV) console.error('[CrowdSentry] Orchestration error:', e);
    } finally {
      setAiLoading(false);
    }
  };

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
    setReviewPending(false);
    setReasoningLogs([
      `[${new Date().toLocaleTimeString()}] CMD CENTER RESET: Simulation parameters restored.`,
      `[${new Date().toLocaleTimeString()}] CCTV SENSORS: 45,000 attendees inside seating blocks.`
    ]);
    setLiaisonDispatches([
      `[${new Date().toLocaleTimeString()}] SECURITY LIAISON: Ground units are standing by at all sectors.`
    ]);
  };

  const tabs = ['tactical', 'telemetry', 'logistics', 'alerts'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#0c0e13', color: '#e2e2ea', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>

      {/* ── HEADER ── */}
      <header style={{ flexShrink: 0, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(17, 19, 25, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(59, 73, 75, 0.35)', boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)', zIndex: 50 }}>
        
        {/* Left: Logo + Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.03em', color: '#00f0ff', textShadow: '0 0 12px rgba(0, 240, 255, 0.4)', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>
            SENTRY AI
          </h1>

          <nav style={{ display: 'flex', gap: '4px' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                style={{
                  padding: '6px 14px',
                  background: currentTab === tab ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: currentTab === tab ? '2px solid #00f0ff' : '2px solid transparent',
                  color: currentTab === tab ? '#00f0ff' : '#94a3b8',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderRadius: '4px 4px 0 0',
                  lineHeight: 1
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Telemetry metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '1px solid rgba(59,73,75,0.4)', borderRight: '1px solid rgba(59,73,75,0.4)', padding: '0 20px' }}>
          {/* Fan Comfort */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '120px' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Comfort</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: stats.fanComfortScore < 88 ? '#ff2e63' : stats.fanComfortScore < 95 ? '#ff8c00' : '#34f885' }}>
                {simState === 'idle' ? '98%' : `${stats.fanComfortScore}%`}
              </span>
            </div>
            <div style={{ width: '120px', height: '3px', background: 'rgba(26, 32, 53, 0.8)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '99px', transition: 'all 0.5s ease', width: simState === 'idle' ? '98%' : `${stats.fanComfortScore}%`, background: stats.fanComfortScore < 88 ? '#ff2e63' : stats.fanComfortScore < 95 ? '#ff8c00' : '#34f885', boxShadow: `0 0 6px ${stats.fanComfortScore < 88 ? '#ff2e63' : stats.fanComfortScore < 95 ? '#ff8c00' : '#34f885'}` }} />
            </div>
          </div>

          {/* Extra Walk */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '120px' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Extra Walk</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: stats.extraDistance > 1.0 ? '#ff8c00' : '#00f0ff' }}>
                {simState === 'idle' ? '+0.0m' : `+${stats.extraDistance.toFixed(1)}m`}
              </span>
            </div>
            <div style={{ width: '120px', height: '3px', background: 'rgba(26, 32, 53, 0.8)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '99px', transition: 'all 0.5s ease', width: simState === 'idle' ? '0%' : `${Math.min(100, (stats.extraDistance / 3.0) * 100)}%`, background: stats.extraDistance > 1.0 ? '#ff8c00' : '#00f0ff', boxShadow: `0 0 6px ${stats.extraDistance > 1.0 ? '#ff8c00' : '#00f0ff'}` }} />
            </div>
          </div>
        </div>

        {/* Right: Icons + status LEDs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderRight: '1px solid rgba(59,73,75,0.4)', paddingRight: '16px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s', padding: '2px' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span></button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s', padding: '2px', position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications_active</span>
              <span style={{ position: 'absolute', top: 0, right: 0, width: '7px', height: '7px', background: '#00f0ff', borderRadius: '50%', animation: 'pulse-anim 2s infinite', boxShadow: '0 0 8px #00f0ff' }} />
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s', padding: '2px' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>account_circle</span></button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>CMD</span>
              <span className="status-tag safe" style={{ padding: '2px 8px', fontSize: '9px' }}>
                <span className="pulse-led-green" /> ACTIVE
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI</span>
              {aiLoading ? (
                <span className="status-tag warning" style={{ padding: '2px 8px', fontSize: '9px', animation: 'pulse-anim 1s infinite' }}>
                  <span className="pulse-led-orange" /> RUNNING
                </span>
              ) : simState === 'rerouted' ? (
                <span className="status-tag safe" style={{ padding: '2px 8px', fontSize: '9px', borderColor: 'rgba(0,240,255,0.3)', color: '#00f0ff' }}>
                  <span className="pulse-led-cyan" /> PREDICTIVE
                </span>
              ) : (
                <span className="status-tag safe" style={{ padding: '2px 8px', fontSize: '9px', borderColor: 'rgba(0,240,255,0.3)', color: '#00f0ff' }}>
                  <span className="pulse-led-cyan" /> STANDBY
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden', background: 'radial-gradient(circle at center, #111319 0%, #07090e 100%)', position: 'relative' }}>
        {/* Subtle grid overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none', backgroundImage: 'linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* ── TACTICAL TAB ── */}
        {currentTab === 'tactical' && (
          <>
            {/* LEFT: 65% */}
            <section style={{ flex: '0 0 65%', display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', minWidth: 0, overflow: 'hidden' }}>
              
              {/* Metric Cards Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flexShrink: 0 }}>
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
                  title="FAN COMFORT"
                  value={simState === 'idle' ? '98%' : `${stats.fanComfortScore}%`}
                  icon={HeartPulse}
                  status={stats.fanComfortScore < 88 ? 'danger' : stats.fanComfortScore < 95 ? 'warning' : 'safe'}
                  description="Participant comfort rating"
                  trend={simState === 'rerouted' ? { direction: 'down', value: '6%' } : null}
                />
                <MetricCard
                  title="EXTRA WALKING"
                  value={simState === 'idle' ? '+0.0 min' : `+${stats.extraDistance.toFixed(1)} min`}
                  unit="Walk time"
                  icon={Compass}
                  status={stats.extraDistance > 1.0 ? 'warning' : 'safe'}
                  description="PALD detour index"
                />
              </div>

              {/* Stadium Canvas */}
              <div className="glass-panel" style={{ flex: 1, minHeight: 0, background: 'rgba(7,9,14,0.9)', borderRadius: '24px', border: '1px solid rgba(59,73,75,0.3)', position: 'relative', overflow: 'hidden' }}>
                {/* HUD chips */}
                <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10, display: 'flex', gap: '8px' }}>
                  <div style={{ padding: '4px 12px', background: 'rgba(0,240,255,0.1)', color: '#00f0ff', borderRadius: '10px', fontSize: '9px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, border: '1px solid rgba(0,240,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Live Telemetry</div>
                  <div style={{ padding: '4px 12px', background: 'rgba(25,28,33,0.8)', color: '#94a3b8', borderRadius: '10px', fontSize: '9px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, border: '1px solid rgba(59,73,75,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Stadium B-2</div>
                </div>

                {/* FPS badge */}
                <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 10, display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', fontWeight: 700, color: '#64748b', background: 'rgba(12,14,19,0.8)', padding: '3px 10px', borderRadius: '8px', border: '1px solid rgba(59,73,75,0.2)', letterSpacing: '0.08em' }}>ZOOM: 100%</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', fontWeight: 700, color: '#34f885', background: 'rgba(12,14,19,0.8)', padding: '3px 10px', borderRadius: '8px', border: '1px solid rgba(59,73,75,0.2)', letterSpacing: '0.08em', animation: 'pulse-anim 2s infinite', boxShadow: '0 0 8px rgba(52,248,133,0.2)' }}>60 FPS</span>
                </div>

                <StadiumCanvas simulationState={simState} onStatsUpdate={handleStatsUpdate} />

                {/* RecView Banner */}
                {reviewPending && (
                  <div style={{ position: 'absolute', left: '12px', right: '12px', top: '52px', background: 'rgba(16, 21, 36, 0.96)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,140,0,0.5)', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 0 30px rgba(255,140,0,0.25)', zIndex: 20, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff8c00', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff8c00', animation: 'pulse-anim 1s infinite', display: 'inline-block' }} />
                        Pending Decision: Proactive AI Egress Recommendation
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={handleApproveRec} style={{ padding: '6px 14px', background: 'rgba(0,230,118,0.15)', color: '#00e676', fontSize: '10px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, borderRadius: '6px', border: '1px solid rgba(0,230,118,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}>Approve & Dispatch</button>
                        <button onClick={() => { setReviewPending(false); setReasoningLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ADMIN DISPATCH: Recommendation REJECTED. Maintaining original routing.`]); }} style={{ padding: '6px 14px', background: 'rgba(255,46,99,0.12)', color: '#ff2e63', fontSize: '10px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, borderRadius: '6px', border: '1px solid rgba(255,46,99,0.3)', cursor: 'pointer', transition: 'all 0.2s' }}>Reject Plan</button>
                      </div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#cbd5e1', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.5)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(30,41,59,0.8)', lineHeight: 1.6 }}>
                      <div style={{ color: '#00f0ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={10} /> Proposed Dynamic Action
                      </div>
                      <div>{safetyAlert}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Controls + Terminal Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: '12px', height: '176px', flexShrink: 0 }}>
                
                {/* Simulator Controls */}
                <div className="glass-panel" style={{ background: 'rgba(25,28,33,0.6)', borderRadius: '20px', border: '1px solid rgba(59,73,75,0.3)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between' }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '9px', color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', margin: 0, paddingBottom: '8px', borderBottom: '1px solid rgba(59,73,75,0.3)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#00f0ff' }}>settings_input_component</span>
                    Simulator Control Deck
                  </h3>

                  <button onClick={handleStartEgress} disabled={simState !== 'idle'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(52,248,133,0.08)', color: '#34f885', borderRadius: '10px', border: '1px solid rgba(52,248,133,0.2)', cursor: simState !== 'idle' ? 'not-allowed' : 'pointer', opacity: simState !== 'idle' ? 0.3 : 1, transition: 'all 0.2s', fontFamily: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>play_arrow</span>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '10px' }}>Start Egress</span>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', opacity: 0.6 }}>INIT</span>
                  </button>

                  <button onClick={handleBlockGate2} disabled={simState === 'idle' || simState === 'gate2-blocked' || simState === 'storm-alert' || simState === 'rerouted'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,180,171,0.08)', color: '#ffb4ab', borderRadius: '10px', border: '1px solid rgba(255,180,171,0.2)', cursor: 'pointer', opacity: (simState === 'idle' || simState === 'gate2-blocked' || simState === 'storm-alert' || simState === 'rerouted') ? 0.3 : 1, transition: 'all 0.2s', position: 'relative', overflow: 'hidden', fontFamily: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>block</span>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '10px' }}>Jam Gate 2</span>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', opacity: 0.6 }}>BLOCK</span>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: '#ffb4ab', transition: 'width 0.5s', width: simState === 'gate2-blocked' ? '100%' : '0%' }} />
                  </button>

                  <button onClick={handleStormAlert} disabled={simState === 'idle' || simState === 'gate2-blocked' || simState === 'storm-alert' || simState === 'rerouted'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,140,0,0.08)', color: '#ff8c00', borderRadius: '10px', border: '1px solid rgba(255,140,0,0.2)', cursor: 'pointer', opacity: (simState === 'idle' || simState === 'gate2-blocked' || simState === 'storm-alert' || simState === 'rerouted') ? 0.3 : 1, transition: 'all 0.2s', fontFamily: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>warning</span>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '10px' }}>Storm Warning</span>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', opacity: 0.6 }}>EVAC</span>
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => triggerAiOrchestrator(simState)} disabled={simState !== 'gate2-blocked' && simState !== 'storm-alert'} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '7px', background: 'rgba(0,240,255,0.08)', color: '#00f0ff', fontSize: '10px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, borderRadius: '10px', border: '1px solid rgba(0,240,255,0.2)', cursor: 'pointer', opacity: (simState !== 'gate2-blocked' && simState !== 'storm-alert') ? 0.3 : 1, transition: 'all 0.2s' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>psychology</span>
                      Gemini AI
                    </button>
                    <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7px 10px', background: 'rgba(40,42,48,0.8)', color: '#94a3b8', borderRadius: '10px', border: '1px solid rgba(59,73,75,0.3)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>restart_alt</span>
                    </button>
                  </div>
                </div>

                {/* Terminal Logs */}
                <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.45)', borderRadius: '20px', border: '1px solid rgba(59,73,75,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ background: 'rgba(12,14,19,0.9)', borderBottom: '1px solid rgba(59,73,75,0.3)', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '10px', color: '#34f885', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ width: '6px', height: '6px', background: '#34f885', borderRadius: '50%', animation: 'pulse-anim 1s infinite', display: 'inline-block' }} />
                      AI Core System Reasoning
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#475569' }}>v4.2.0-PREMIUM_CORE</span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {reasoningLogs.map((log, idx) => {
                      let color = '#64748b';
                      if (log.includes('TACTICAL COMMANDER')) color = '#34f885';
                      else if (log.includes('CRITICAL') || log.includes('INCIDENT') || log.includes('ADMIN DISPATCH')) color = '#ffb4ab';
                      else if (log.includes('Gemini')) color = '#00f0ff';
                      return (
                        <div key={idx} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color, lineHeight: 1.5 }}>{log}</div>
                      );
                    })}
                    {liaisonDispatches.map((log, idx) => (
                      <div key={`liaison-${idx}`} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#7dd3fc', fontStyle: 'italic', lineHeight: 1.5 }}>{log}</div>
                    ))}
                    {aiLoading && (
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00f0ff', animation: 'pulse-anim 1s infinite', lineHeight: 1.5 }}>
                        &gt;&gt; CROWDSENTRY COMMANDER IS THINKING... REALLOCATING FLOW VECTORS...
                      </div>
                    )}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT: 35% - Mobile App */}
            <aside style={{ flex: '0 0 35%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(17,19,25,0.6)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(59,73,75,0.35)', overflow: 'hidden' }}>
              <MobileApp
                gate={simState === 'rerouted' ? 'GATE 3' : 'GATE 2'}
                status={simState === 'gate2-blocked' || simState === 'storm-alert' ? 'danger' : simState === 'rerouted' ? 'warning' : 'safe'}
                riskIndex={stats.congestionRisk}
                simState={simState}
              />
            </aside>
          </>
        )}

        {/* ── TELEMETRY TAB ── */}
        {currentTab === 'telemetry' && (
          <TelemetryView simState={simState} vibrationHz={vibrationHz} stats={stats} />
        )}

        {/* ── LOGISTICS TAB ── */}
        {currentTab === 'logistics' && (
          <LogisticsView simState={simState} />
        )}

        {/* ── ALERTS TAB ── */}
        {currentTab === 'alerts' && (
          <AlertsView simState={simState} safetyAlert={safetyAlert} handleReset={handleReset} />
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// TELEMETRY VIEW
// ─────────────────────────────────────────────
function TelemetryView({ simState, vibrationHz, stats }) {
  let acousticPressure = 88.4;
  if (simState === 'storm-alert') acousticPressure = 98.1;
  else if (simState === 'gate2-blocked') acousticPressure = 94.6;
  else if (simState === 'rerouted') acousticPressure = 91.2;

  const thermalDensity = simState === 'storm-alert' ? 26.8 : 24.1;
  const isC1Alert = simState === 'gate2-blocked' || simState === 'storm-alert';

  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.3fr 0.9fr', gap: '16px', padding: '16px', overflow: 'hidden' }}>
      
      {/* Left: Sensor Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
        {/* Vibration */}
        <div className="glass-panel glowing-cyan" style={{ flex: 1, padding: '20px', borderRadius: '20px', border: '1px solid rgba(59,73,75,0.3)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', margin: '0 0 4px 0', textTransform: 'uppercase' }}>SENSOR STREAM_01</p>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 600, color: '#00f0ff', margin: 0, textTransform: 'uppercase' }}>Vibration Levels</p>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', fontWeight: 600, color: '#00f0ff' }}>{vibrationHz} Hz</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '4px', minHeight: '60px' }}>
            {[60, 40, 80, 55, 90, 30, 65, 45, 75, 50].map((h, i) => (
              <div key={i} style={{ flex: 1, background: `rgba(0,240,255,${0.2 + (i % 3) * 0.2})`, height: `${h}%`, borderRadius: '2px', animation: i % 2 === 0 ? 'pulse-anim 1.2s infinite' : 'none' }} />
            ))}
          </div>
        </div>

        {/* Acoustic Pressure */}
        <div className={`glass-panel ${isC1Alert ? 'glowing-red' : 'glowing-green'}`} style={{ flex: 1, padding: '20px', borderRadius: '20px', border: '1px solid rgba(59,73,75,0.3)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', margin: '0 0 4px 0', textTransform: 'uppercase' }}>SENSOR STREAM_02</p>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 600, color: isC1Alert ? '#ff2e63' : '#34f885', margin: 0, textTransform: 'uppercase' }}>Acoustic Pressure</p>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', fontWeight: 600, color: isC1Alert ? '#ff2e63' : '#34f885', textShadow: `0 0 8px ${isC1Alert ? '#ff2e63' : '#34f885'}` }}>{acousticPressure} dB</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: '60px' }}>
            <div style={{ width: '100%', height: '8px', background: 'rgba(30,41,59,0.8)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(acousticPressure / 120) * 100}%`, background: isC1Alert ? '#ff2e63' : '#34f885', borderRadius: '99px', transition: 'width 0.5s', boxShadow: `0 0 10px ${isC1Alert ? '#ff2e63' : '#34f885'}` }} />
            </div>
          </div>
        </div>

        {/* Thermal */}
        <div className="glass-panel glowing-cyan" style={{ flex: 1, padding: '20px', borderRadius: '20px', border: '1px solid rgba(59,73,75,0.3)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', margin: '0 0 4px 0', textTransform: 'uppercase' }}>SENSOR STREAM_03</p>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 600, color: '#00f0ff', margin: 0, textTransform: 'uppercase' }}>Thermal Density</p>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', fontWeight: 600, color: '#00f0ff' }}>{thermalDensity} °C</span>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px', minHeight: '60px' }}>
            {[10, 40, 20, isC1Alert ? 50 : 60, 30, isC1Alert ? 70 : 80, 50, 20].map((opacity, i) => (
              <div key={i} style={{ background: isC1Alert && (i === 3 || i === 5) ? `rgba(255,46,99,${opacity / 100})` : `rgba(0,240,255,${opacity / 100})`, border: `1px solid ${isC1Alert && (i === 3 || i === 5) ? 'rgba(255,46,99,0.2)' : 'rgba(0,240,255,0.15)'}`, borderRadius: '4px' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Center: Radar */}
      <div className="glass-panel glowing-cyan" style={{ borderRadius: '20px', border: '1px solid rgba(59,73,75,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ background: 'rgba(12,14,19,0.8)', padding: '4px 10px', border: '1px solid rgba(59,73,75,0.3)', borderRadius: '8px' }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', color: '#00f0ff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SCANNING RADIUS: 500M</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isC1Alert ? '#ff2e63' : '#34f885', animation: 'pulse-anim 1s infinite' }} />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', color: '#64748b', letterSpacing: '0.1em' }}>LOCKED: {isC1Alert ? '1' : '0'}</span>
          </div>
        </div>

        {/* Radar rings */}
        <div style={{ position: 'relative', width: '260px', height: '260px', borderRadius: '50%', border: '2px solid rgba(0,240,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '32px 0 16px' }}>
          {[195, 130, 65].map(size => (
            <div key={size} style={{ position: 'absolute', width: `${size}px`, height: `${size}px`, borderRadius: '50%', border: '1px solid rgba(0,240,255,0.1)' }} />
          ))}
          <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(0,240,255,0.1)' }} />
          <div style={{ position: 'absolute', height: '100%', width: '1px', background: 'rgba(0,240,255,0.1)' }} />
          {/* Sweep */}
          <div className="radar-sweep" style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', transformOrigin: 'top left', background: 'linear-gradient(135deg, rgba(0,240,255,0.18) 0%, transparent 60%)', transform: 'rotate(-90deg)' }} />
          </div>
          {/* Blips */}
          <div style={{ position: 'absolute', top: '25%', right: '33%', width: '12px', height: '12px', borderRadius: '50%', background: isC1Alert ? '#ff2e63' : '#34f885', filter: 'blur(1px)', animation: 'pulse-anim 1s infinite' }} />
          <div style={{ position: 'absolute', bottom: '33%', left: '25%', width: '8px', height: '8px', background: '#00f0ff', borderRadius: '50%', filter: 'blur(1px)' }} />
        </div>

        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Signal Processing Activity</p>
        <div style={{ display: 'flex', gap: '4px', height: '28px', alignItems: 'flex-end' }}>
          {['40%', '70%', '30%', '80%', '50%', '90%'].map((h, i) => (
            <div key={i} className="audio-bar" style={{ height: h }} />
          ))}
        </div>
      </div>

      {/* Right: Sector Table */}
      <div className="glass-panel glowing-cyan" style={{ borderRadius: '20px', border: '1px solid rgba(59,73,75,0.3)', padding: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 600, color: '#e2e2ea', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sector Status</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Outfit, sans-serif', fontSize: '9px', color: '#475569', borderBottom: '1px solid rgba(59,73,75,0.3)', paddingBottom: '8px', marginBottom: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span>SECTOR ID</span><span>TELEMETRY</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { id: 'A-1', status: 'ONLINE', color: '#34f885', bg: 'rgba(2,44,23,0.2)' },
            { id: 'A-2', status: 'ONLINE', color: '#34f885', bg: 'rgba(2,44,23,0.2)' },
            { id: 'B-4', status: 'CALIBRATING', color: '#00f0ff', bg: 'rgba(0,36,44,0.15)', animate: true },
            { id: 'C-1', status: isC1Alert ? 'ALERT' : 'ONLINE', color: isC1Alert ? '#ff2e63' : '#34f885', bg: isC1Alert ? 'rgba(146,0,10,0.15)' : 'rgba(2,44,23,0.2)', animate: isC1Alert },
            { id: 'C-2', status: 'ONLINE', color: '#34f885', bg: 'rgba(2,44,23,0.2)' },
            { id: 'D-3', status: 'ONLINE', color: '#34f885', bg: 'rgba(2,44,23,0.2)' },
            { id: 'D-4', status: 'OFFLINE', color: '#475569', bg: 'rgba(15,23,42,0.4)', opacity: 0.5 }
          ].map(sec => (
            <div key={sec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(59,73,75,0.1)', background: sec.bg, opacity: sec.opacity || 1 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>{sec.id}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', fontWeight: 700, color: sec.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{sec.status}</span>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sec.color, boxShadow: sec.status !== 'OFFLINE' ? `0 0 6px ${sec.color}` : 'none', animation: sec.animate ? 'pulse-anim 1s infinite' : 'none' }} />
              </div>
            </div>
          ))}
        </div>
        <button style={{ marginTop: '12px', width: '100%', padding: '10px', background: '#00f0ff', color: '#001e22', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '10px', borderRadius: '10px', border: 'none', boxShadow: '0 0 15px rgba(0,240,255,0.4)', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>download</span>
          EXPORT TELEMETRY LOG
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LOGISTICS VIEW
// ─────────────────────────────────────────────
function LogisticsView({ simState }) {
  let battery = 84, responseTime = "2:45m", responsePercent = 40, staff = 92;
  if (simState === 'storm-alert') { battery = 76; responseTime = "4:12m"; responsePercent = 85; staff = 78; }
  else if (simState === 'gate2-blocked') { battery = 81; responseTime = "3:15m"; responsePercent = 60; staff = 85; }
  const isAlert = simState === 'gate2-blocked' || simState === 'storm-alert';

  return (
    <div style={{ flex: 1, display: 'flex', gap: '16px', padding: '16px', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: 'rgba(17,19,25,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(59,73,75,0.3)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ borderBottom: '1px solid rgba(59,73,75,0.2)', paddingBottom: '12px', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(0,240,255,0.4)', background: '#1d2025', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: '18px' }}>person</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', fontWeight: 700, color: '#00f0ff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>OPERATOR 01</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#475569', textTransform: 'uppercase' }}>SECTOR B-2 ACTIVE</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[{ label: 'Overview', icon: 'dashboard', active: true }, { label: 'Heatmap', icon: 'dataset' }, { label: 'Drones', icon: 'precision_manufacturing' }, { label: 'Staff', icon: 'groups' }].map(item => (
            <div key={item.label} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '10px', background: item.active ? 'rgba(0,240,255,0.08)' : 'transparent', borderLeft: item.active ? '3px solid #00f0ff' : '3px solid transparent', color: item.active ? '#00f0ff' : '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{item.icon}</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</span>
            </div>
          ))}
        </nav>
        <button style={{ width: '100%', padding: '10px', background: '#00f0ff', color: '#001e22', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '9px', borderRadius: '10px', border: 'none', boxShadow: '0 0 15px rgba(0,240,255,0.35)', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.12em' }}>DEPLOY SQUAD</button>
      </aside>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', background: '#0c0e13', border: '1px solid rgba(59,73,75,0.3)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="scanline" />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: 'linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="35" stroke="#00f0ff" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="25" stroke="#00f0ff" strokeWidth="0.5" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="#00f0ff" strokeWidth="0.2" strokeDasharray="1 3" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="#00f0ff" strokeWidth="0.2" strokeDasharray="1 3" />
          </svg>
        </div>
        {/* Markers */}
        <div style={{ position: 'absolute', top: '25%', left: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'pulse-anim 1.5s infinite' }}>
          <div style={{ background: '#00f0ff', width: '10px', height: '10px', borderRadius: '50%', boxShadow: '0 0 12px #00f0ff' }} />
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#00f0ff', background: 'rgba(2,6,23,0.85)', padding: '2px 6px', marginTop: '4px', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '4px' }}>DRONE_ALPHA [MOVING]</div>
        </div>
        <div style={{ position: 'absolute', bottom: '33%', right: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#34f885', width: '10px', height: '10px', borderRadius: '2px', transform: 'rotate(45deg)', boxShadow: '0 0 12px #34f885' }} />
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#34f885', background: 'rgba(2,6,23,0.85)', padding: '2px 6px', marginTop: '4px', border: '1px solid rgba(52,248,133,0.3)', borderRadius: '4px' }}>MEDIC_04 [STATIONARY]</div>
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#c1c6db', width: '10px', height: '10px', borderRadius: '50%', border: '1px solid white', boxShadow: '0 0 12px #c1c6db' }} />
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#c1c6db', background: 'rgba(2,6,23,0.85)', padding: '2px 6px', marginTop: '4px', border: '1px solid rgba(193,198,219,0.3)', borderRadius: '4px' }}>SEC_UNIT_09 [ACTIVE]</div>
        </div>
        {isAlert && (
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 20, animation: 'pulse-anim 1s infinite' }}>
            <div style={{ background: 'rgba(146,0,10,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,46,99,0.5)', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#ff2e63', fontSize: '16px' }}>warning</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '9px', color: '#ff2e63', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {simState === 'storm-alert' ? '⚠ STORM EVACUATION ENGAGED' : '⚠ SECTOR B-2: CROWD SURGE'}
              </span>
            </div>
          </div>
        )}
        {/* Legend */}
        <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
          <div className="glass-panel" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(5,7,12,0.85)', border: '1px solid rgba(59,73,75,0.3)', borderRadius: '10px' }}>
            {[['#00f0ff', 'Drones (12 Active)'], ['#34f885', 'Medics (08 Ready)'], ['#c1c6db', 'Security (45 Deployed)']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '280px', flexShrink: 0, background: 'rgba(17,19,25,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(59,73,75,0.3)', borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <section style={{ padding: '16px', borderBottom: '1px solid rgba(59,73,75,0.2)' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', fontWeight: 700, color: '#00f0ff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>inventory_2</span>
            Resource Allocation
          </h2>
          {[['FLIGHT BATTERY (AVG)', `${battery}%`, '#00f0ff', battery], ['EST. RESPONSE TIME', responseTime, '#34f885', responsePercent], ['STAFF AVAILABILITY', `${staff}%`, '#c1c6db', staff]].map(([label, val, color, pct]) => (
            <div key={label} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                <span>{label}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color }}>{val}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(30,41,59,0.8)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', boxShadow: `0 0 6px ${color}`, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </section>
        <section style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', fontWeight: 700, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(59,73,75,0.2)' }}>ACTIVE DEPLOYMENTS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { title: 'Sector B-2 Reinforcement', priority: 'HIGH', color: '#ff2e63', bg: 'rgba(255,46,99,0.08)', border: 'rgba(255,46,99,0.3)', desc: 'UNIT_09, UNIT_12 • 4M REMAINING', icon: 'engineering' },
              { title: 'Gate 1 Maintenance', priority: 'MED', color: '#00f0ff', bg: 'rgba(0,240,255,0.06)', border: 'rgba(0,240,255,0.2)', desc: 'TECH_TEAM_A • 12M REMAINING', icon: 'construction' },
              { title: 'VIP Escort [North Box]', priority: 'HIGH', color: '#34f885', bg: 'rgba(52,248,133,0.06)', border: 'rgba(52,248,133,0.2)', desc: 'PROTECTION_UNIT • IN PROGRESS', icon: 'verified_user' }
            ].map((task, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '10px 12px', background: 'rgba(15,23,42,0.3)', border: '1px solid rgba(59,73,75,0.2)', borderRadius: '12px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, color: '#cbd5e1' }}>{task.title}</span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: task.color, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${task.border}`, background: task.bg, letterSpacing: '0.08em' }}>{task.priority}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{task.icon}</span>
                  {task.desc}
                </div>
              </div>
            ))}
          </div>
        </section>
        <div style={{ padding: '10px 16px', background: '#0c0e13', borderTop: '1px solid rgba(59,73,75,0.2)', display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: 'rgba(0,240,255,0.3)' }}>
          <span>SYSTEM_LOG::LOGISTICS_THREAD</span>
          <span>v.4.92.1-STABLE</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ALERTS VIEW
// ─────────────────────────────────────────────
function AlertsView({ simState, safetyAlert, handleReset }) {
  const [selectedIncident, setSelectedIncident] = useState(0);

  const incidents = [
    {
      id: '#A7-2491',
      title: simState === 'storm-alert' ? 'WEATHER EVACUATION ENGAGED' : simState === 'gate2-blocked' ? 'CROWD ANOMALY: GATE 2 BLOCKED' : 'CROWD ANOMALY: ZONE B-4',
      type: simState === 'storm-alert' || simState === 'gate2-blocked' ? 'CRITICAL' : 'WARNING',
      typeColor: simState === 'storm-alert' || simState === 'gate2-blocked' ? { text: '#ff2e63', bg: 'rgba(255,46,99,0.08)', border: 'rgba(255,46,99,0.3)', left: '#ff2e63' } : { text: '#ff8c00', bg: 'rgba(255,140,0,0.08)', border: 'rgba(255,140,0,0.3)', left: '#ff8c00' },
      time: '14:22:01', elapsed: '00:04:12',
      desc: simState === 'storm-alert' ? 'Active lightning warning over arena. Emptying West stands.' : simState === 'gate2-blocked' ? 'Gate 2 turnstile physical deadlock identified.' : 'Rapid density increase detected. Threshold exceeded.',
      location: 'Commercial Plaza - Zone B-4',
      primaryThreat: simState === 'storm-alert' ? 'Lightning exposure near outer corridors.' : simState === 'gate2-blocked' ? 'Crush threat near Gate 2 holding barrier.' : 'Bottleneck at South corridor Exit 4-A.',
      recommendedVector: simState === 'storm-alert' ? 'Route South stands strictly to South Plaza orbit.' : simState === 'gate2-blocked' ? 'Route South Stands proactively to adjacent Gate 3 (+1.2m detour).' : 'Reroute flow to Adjacent Corridor C-3.'
    },
    { id: '#A7-2488', title: 'UNAUTHORIZED ACCESS', type: 'WARNING', typeColor: { text: '#ff8c00', bg: 'rgba(255,140,0,0.08)', border: 'rgba(255,140,0,0.3)', left: '#ff8c00' }, time: '14:18:45', elapsed: '00:07:28', desc: 'Gate 12 secondary perimeter breached. Ground Unit D-12 dispatched.', location: 'Outer Perimeter Gate 12', primaryThreat: 'Unauthorized intrusion vector.', recommendedVector: 'Engage security gates and deploy Drone Gamma.' },
    { id: '#A7-2485', title: 'UNIT ROTATION COMPLETE', type: 'INFO', typeColor: { text: '#00f0ff', bg: 'rgba(0,240,255,0.06)', border: 'rgba(0,240,255,0.2)', left: '#00f0ff' }, time: '14:15:30', elapsed: '00:10:43', desc: 'Sector A shift swap completed. Shift B volunteers standing by.', location: 'Operational Sector A', primaryThreat: 'None. Standard operational flow.', recommendedVector: 'Maintain normal security posture.' }
  ];

  const current = incidents[selectedIncident] || incidents[0];

  return (
    <div style={{ flex: 1, display: 'flex', gap: '16px', padding: '16px', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: 'rgba(17,19,25,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(59,73,75,0.3)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ borderBottom: '1px solid rgba(59,73,75,0.2)', paddingBottom: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(0,240,255,0.4)', background: '#1d2025', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: '18px' }}>admin_panel_settings</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', fontWeight: 700, color: '#00f0ff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>OPERATOR 01</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#475569', textTransform: 'uppercase' }}>ROLE: SYSTEM ADMIN</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[{ label: 'Overview', icon: 'dashboard' }, { label: 'Heatmap', icon: 'dataset' }, { label: 'Alerts', icon: 'notifications_active', active: true }, { label: 'Staff', icon: 'groups' }].map(item => (
            <div key={item.label} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '10px', background: item.active ? 'rgba(0,240,255,0.08)' : 'transparent', borderLeft: item.active ? '3px solid #00f0ff' : '3px solid transparent', color: item.active ? '#00f0ff' : '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{item.icon}</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</span>
            </div>
          ))}
        </nav>
        <button onClick={handleReset} style={{ width: '100%', padding: '10px', background: 'rgba(30,41,59,0.8)', color: '#94a3b8', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '9px', borderRadius: '10px', border: '1px solid rgba(59,73,75,0.4)', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.12em' }}>RESET ALL ALERTS</button>
      </aside>

      {/* Incident Feed */}
      <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 4px', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', fontWeight: 700, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>INCIDENT FEED</h2>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#475569' }}>ACTIVE: {incidents.length}</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {incidents.map((inc, idx) => (
            <div key={idx} onClick={() => setSelectedIncident(idx)} className="glass-panel" style={{ padding: '14px', cursor: 'pointer', borderLeft: `4px solid ${inc.typeColor.left}`, borderRadius: '14px', border: `1px solid ${idx === selectedIncident ? 'rgba(0,240,255,0.4)' : 'rgba(59,73,75,0.2)'}`, background: idx === selectedIncident ? 'rgba(30,41,59,0.5)' : 'rgba(14,19,34,0.6)', transition: 'all 0.2s', transform: idx === selectedIncident ? 'scale(1.01)' : 'scale(1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: inc.typeColor.text, padding: '2px 8px', borderRadius: '99px', border: `1px solid ${inc.typeColor.border}`, background: inc.typeColor.bg, letterSpacing: '0.08em' }}>{inc.type}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#475569' }}>{inc.time}</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 600, color: '#e2e2ea', marginBottom: '4px', lineHeight: 1.3 }}>{inc.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{inc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden', minWidth: 0 }}>
        <div className="glass-panel glowing-cyan" style={{ flex: 1, padding: '20px', borderRadius: '20px', border: '1px solid rgba(59,73,75,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexShrink: 0 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="material-symbols-outlined" style={{ color: '#ff2e63', fontSize: '18px', animation: 'pulse-anim 1s infinite', fontVariationSettings: "'FILL' 1" }}>warning</span>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '14px', color: '#f1f5f9', letterSpacing: '-0.01em', textTransform: 'uppercase', margin: 0 }}>INCIDENT REPORT {current.id}</h1>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#64748b', margin: 0 }}>{current.location} | Severity: {current.type}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '22px', fontWeight: 700, color: '#ff2e63', lineHeight: 1 }}>{current.elapsed}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>ELAPSED TIME</div>
            </div>
          </div>

          {/* Satellite map */}
          <div style={{ width: '100%', height: '140px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(59,73,75,0.3)', background: '#0c0e13', position: 'relative', marginBottom: '16px', flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                <rect x="10" y="10" width="80" height="80" stroke="#00f0ff" strokeWidth="0.5" />
                <path d="M10,50 L90,50 M50,10 L50,90" stroke="#ff2e63" strokeWidth="0.3" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="10" stroke="#ff2e63" strokeWidth="0.5" />
                <polygon points="45,45 55,45 50,55" fill="#ff2e63" opacity="0.8" />
              </svg>
            </div>
            <div style={{ position: 'absolute', inset: 0, padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10 }}>
              <div style={{ background: 'rgba(5,7,12,0.7)', border: '1px solid rgba(0,240,255,0.2)', padding: '3px 8px', alignSelf: 'flex-start', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#00f0ff' }}>LAT: 34.0522° N | LONG: 118.2437° W</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: '#f1f5f9', background: '#ff2e63', padding: '2px 8px', borderRadius: '4px' }}>LIVE FEED: INCIDENT_CAM_B4</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#64748b' }}>RECOGNITION ENGINE: STANDBY</span>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div style={{ flexShrink: 0 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '9px', color: '#00f0ff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>psychology</span>
              Gemini AI Recommended Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[['Primary Threat', current.primaryThreat], ['Recommended Vector', current.recommendedVector]].map(([title, content]) => (
                <div key={title} style={{ background: 'rgba(25,28,33,0.8)', padding: '12px', border: '1px solid rgba(59,73,75,0.2)', borderRadius: '10px' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{title}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#e2e2ea', lineHeight: 1.4 }}>{content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', height: '72px', flexShrink: 0 }}>
          {[
            { label: 'Broadcast Evac', icon: 'campaign', color: '#ff2e63', bg: 'rgba(255,46,99,0.08)', border: 'rgba(255,46,99,0.35)', action: () => alert('EVACUATION BROADCAST ACTIVATED.') },
            { label: 'Rapid Response', icon: 'rocket_launch', color: '#ff8c00', bg: 'rgba(255,140,0,0.08)', border: 'rgba(255,140,0,0.35)', action: () => alert('RAPID RESPONSE TEAM DEPLOYED.') },
            { label: 'Clear Alarm', icon: 'task_alt', color: '#00f0ff', bg: 'rgba(0,240,255,0.06)', border: 'rgba(59,73,75,0.3)', action: handleReset }
          ].map(btn => (
            <button key={btn.label} onClick={btn.action} style={{ background: btn.bg, border: `1px solid ${btn.border}`, borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: btn.color, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{btn.icon}</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
