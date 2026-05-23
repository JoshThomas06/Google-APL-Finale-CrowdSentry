import React, { useState, useEffect, useRef } from 'react';
import { Compass, MessageSquare, Send } from 'lucide-react';

export default function MobileApp({ gate = "GATE 2", status = "safe", riskIndex = 12, simState = "idle" }) {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'CrowdSentry active. How can I assist your egress?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chatbot window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Predefined Q&A answers based on state and accessibility needs (PRD Sec 4 & 7)
  const chatbotDatabase = {
    stroller: "Hi! Gate 2 only has narrow stairs. I recommend adjacent Gate 3, which has flat wide corridors, or Gate 5 for full ramps.",
    wheelchair: "Accessibility Warning: Gate 2 has stairs only. Gate 3 (adjacent) is flat-access, and Gate 5 has dedicated ramps. Please route to Gate 3 or Gate 5.",
    fastest: {
      safe: "All gates are flowing normally! Gate 3 is currently showing the shortest queue time (under 2 minutes).",
      danger: "URGENT: Gate 2 has a turnstile jam. Please route to adjacent Gate 3 (closest detour, +1.2 mins) or Gate 1. Gate 3 is clear.",
      warning: "PRE-EMPTIVE SHIFT ACTIVE: South Corridor is diverted to adjacent Gate 3 to avoid Gate 2 capacity load spike. Flow is fully optimized."
    },
    storm: "WEATHER ADVISORY: Egress has been temporarily paused due to active thunderstorm conditions. Please proceed to the South Plaza Holding Zone. Standard wait: 4 mins. Free water and refreshments are available at Station A.",
    default: "Stadium Safety Team is monitoring all exits. Adjacent Gate 3 and Gate 1 are clear and flowing. Please walk calmly."
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const userMsg = { sender: 'user', text: userText };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // Artificial 1-second delay for realistic AI feel
    setTimeout(() => {
      let replyText = chatbotDatabase.default;
      const lower = userText.toLowerCase();

      if (lower.includes('stroller') || lower.includes('baby')) {
        replyText = chatbotDatabase.stroller;
      } else if (lower.includes('wheelchair') || lower.includes('ramp') || lower.includes('disabled') || lower.includes('accessible')) {
        replyText = chatbotDatabase.wheelchair;
      } else if (lower.includes('why redirected') || lower.includes('why rerouted') || lower.includes('why redirect') || lower.includes('why was i')) {
        replyText = "Hi! You have been proactively redirected to adjacent Gate 3 to avoid the high density surge building at Gate 2. This keeps your extra walk time to only +1.2 minutes and maintains high comfort.";
      } else if (lower.includes('refreshment') || lower.includes('drink') || lower.includes('water') || lower.includes('food') || lower.includes('station a')) {
        replyText = "Free water and sports drinks are available at Station A within the South Plaza Holding Zone. Please enjoy a refreshment while we hold egress.";
      } else if (lower.includes('hold') || lower.includes('waiting') || lower.includes('wait') || lower.includes('why stopped') || lower.includes('why hold')) {
        replyText = simState === 'storm-alert'
          ? chatbotDatabase.storm
          : "Safety teams have paused egress to coordinate adjacent gate reallocations and prevent crushing. Please remain calm.";
      } else if (lower.includes('fastest') || lower.includes('shortest') || lower.includes('clear') || lower.includes('crowd') || lower.includes('exit')) {
        replyText = simState === 'storm-alert' ? chatbotDatabase.storm : (chatbotDatabase.fastest[status] || chatbotDatabase.fastest.safe);
      } else if (lower.includes('gate 2') || lower.includes('gate2')) {
        replyText = status === 'danger' || status === 'warning'
          ? "CRITICAL: Gate 2 is BLOCKED/LOADED. South Corridor fans are being dynamically reallocated to adjacent Gate 3 (+1.2 min detour)."
          : "Gate 2 is open and operating standard flow. South Pavilion ticket holders are heading there.";
      } else if (lower.includes('gate 3') || lower.includes('gate3')) {
        replyText = "Adjacent Gate 3 is fully operational, clear of congestion, and has flat-access corridors. Walking distance: +1.2 min detour.";
      } else if (lower.includes('gate 5') || lower.includes('gate5')) {
        replyText = "Gate 5 (West Stand) is fully clear and active. Ramps are open and security teams are assisting fans.";
      }

      setChatHistory(prev => [...prev, { sender: 'bot', text: replyText }]);
      setIsTyping(false);
    }, 800);
  };

  // Determine ticket colors based on security state & storm alert status
  let statusColor = {
    safe: { text: '#00f0ff', bg: 'rgba(0, 240, 255, 0.05)', border: '#00f0ff', qr: '#00f0ff' },
    warning: { text: '#ff8c00', bg: 'rgba(255, 140, 0, 0.05)', border: '#ff8c00', qr: '#ff8c00' },
    danger: { text: '#ff2e63', bg: 'rgba(255, 46, 99, 0.05)', border: '#ff2e63', qr: '#ff2e63' }
  }[status] || { text: '#00f0ff', bg: 'rgba(0, 240, 255, 0.05)', border: '#00f0ff', qr: '#00f0ff' };

  if (simState === 'storm-alert') {
    statusColor = { text: '#ff8c00', bg: 'rgba(255, 140, 0, 0.05)', border: '#ff8c00', qr: '#ff8c00' };
  }

  return (
    <div className="phone-wrapper" style={{
      width: '100%',
      maxWidth: '380px',
      margin: '0 auto',
      height: '100%',
      maxHeight: '760px',
      borderRadius: '40px',
      border: '12px solid #1a1e2a',
      background: '#07090e',
      boxShadow: '0px 0px 40px rgba(0, 240, 255, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Phone Camera Notch */}
      <div style={{
        width: '120px',
        height: '25px',
        background: '#1a1e2a',
        borderRadius: '0 0 20px 20px',
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10
      }}></div>

      {/* Header Info */}
      <div style={{
        padding: '30px 20px 15px',
        background: 'linear-gradient(to bottom, rgba(0, 240, 255, 0.15), transparent)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ color: '#00f0ff', fontSize: '20px', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>My Pass</h2>
          <p style={{ color: '#8f9cae', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '2px', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Sentry Companion</p>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          border: '2px solid rgba(0, 240, 255, 0.3)',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
        }}>
          <img alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN_6Fgnlw0CXG9DZSBvNW2F6NKVipQ-IyjN8lOg_wTAlP39uNto9_Kyyg7-HxqXBAV4XV0-eeMnRmw_kzn78rMe0qmo2-fWnmipXN0x4NTXudj7iwO1NWJ1wvND-j0edYRgK4-AEOLxhyi27ovAUlmabZ2Yc3-DzCHFVmiaJTVN6ooezccVqUyi8PJfPrURwobh0dyfbijVPsC0n9HD8TdCVOWOVFKpjP2K0DzTUFsKJYpV7Lm0KCt8XCZLQAWq4y4icmYdOk2xC7J"/>
        </div>
      </div>

      {/* Main App Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Glowing Dynamic Ticket */}
        <div style={{
          background: 'rgba(16, 21, 36, 0.9)',
          border: `1.5px solid ${statusColor.border}`,
          borderRadius: '20px',
          padding: '15px',
          boxShadow: `0 0 15px ${statusColor.border}22`,
          position: 'relative'
        }}>
          {/* Top Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8f9cae' }}>
            <span>IPL MATCHDAY PASS</span>
            <span>TICKET 04-A</span>
          </div>

          <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', marginTop: '10px' }}>
            SOUTH PAVILION STAND
          </div>
          <div style={{ color: '#8f9cae', fontSize: '12px', marginTop: '2px' }}>
            ROW C • SEAT 42
          </div>

          {/* Dynamic QR Code Panel */}
          <div style={{
            width: '140px',
            height: '140px',
            background: 'rgba(7, 9, 14, 0.8)',
            border: `1px solid rgba(255,255,255,0.05)`,
            borderRadius: '12px',
            margin: '20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px'
          }}>
            {/* Direct Vector Grid QR code (mathematically generated, can never break) */}
            <svg width="120" height="120" viewBox="0 0 120 120">
              <rect width="120" height="120" fill="none" />
              {/* Top-Left Finder */}
              <rect x="10" y="10" width="30" height="30" fill="none" stroke={statusColor.qr} strokeWidth="6" />
              <rect x="20" y="20" width="10" height="10" fill={statusColor.qr} />
              {/* Top-Right Finder */}
              <rect x="80" y="10" width="30" height="30" fill="none" stroke={statusColor.qr} strokeWidth="6" />
              <rect x="90" y="20" width="10" height="10" fill={statusColor.qr} />
              {/* Bottom-Left Finder */}
              <rect x="10" y="80" width="30" height="30" fill="none" stroke={statusColor.qr} strokeWidth="6" />
              <rect x="20" y="90" width="10" height="10" fill={statusColor.qr} />
              {/* Random QR bits for dynamic visual authenticity */}
              <rect x="50" y="10" width="10" height="20" fill={statusColor.qr} opacity="0.8" />
              <rect x="65" y="20" width="10" height="10" fill={statusColor.qr} />
              <rect x="50" y="45" width="20" height="20" fill={statusColor.qr} />
              <rect x="80" y="50" width="15" height="15" fill={statusColor.qr} opacity="0.7" />
              <rect x="10" y="55" width="20" height="10" fill={statusColor.qr} />
              <rect x="90" y="80" width="10" height="10" fill={statusColor.qr} />
              <rect x="80" y="95" width="20" height="15" fill={statusColor.qr} />
              <rect x="55" y="85" width="10" height="25" fill={statusColor.qr} opacity="0.9" />
            </svg>
          </div>
          {/* Assigned Exit Area */}
          <div style={{
            background: statusColor.bg,
            border: `1.5px dashed ${statusColor.border}`,
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#8f9cae', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {simState === 'storm-alert' ? 'Exit Hold Area' : simState === 'gate2-blocked' ? 'Exit Blocked' : 'Recommended Exit Gate'}
            </div>
            <div style={{ color: statusColor.text, fontSize: '19px', fontWeight: '800', marginTop: '4px' }}>
              {simState === 'storm-alert' 
                ? 'HOLD: SOUTH PLAZA ZONE' 
                : simState === 'gate2-blocked'
                  ? 'AWAITING REALLOCATION'
                  : gate.replace('GATE', '').trim() ? `GATE ${gate.replace('GATE', '').trim()}` : 'GATE 2'}
            </div>
          </div>
        </div>

        {/* Dynamic Storm Holding Refreshments Alert (PRD Sec 11.B) */}
        {simState === 'storm-alert' && (
          <div style={{
            background: 'rgba(255, 140, 0, 0.08)',
            border: '1px solid rgba(255, 140, 0, 0.25)',
            borderRadius: '16px',
            padding: '12px',
            color: '#cbd5e1',
            fontSize: '11px',
            lineHeight: '1.4',
            boxShadow: '0 0 10px rgba(255, 140, 0, 0.1)'
          }}>
            <div style={{ color: '#ff8c00', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff8c00', display: 'inline-block' }} />
              Plaza holding alert
            </div>
            Exits are currently congested due to weather. Please wait in the **South Plaza Holding Zone**. Free refreshments and water are available at **Station A**. Wait time is ~4 mins.
          </div>
        )}

        {/* Live Map Route Panel */}
        <div style={{
          background: '#101524',
          borderRadius: '20px',
          padding: '15px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>
            <Compass size={16} color="#00f0ff" />
            <span>Interactive Exit Path</span>
          </div>
          
          {/* Vector SVG Egress Line Map */}
          <div style={{
            width: '100%',
            height: '110px',
            background: '#07090e',
            borderRadius: '12px',
            marginTop: '10px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.02)'
          }}>
            <svg width="100%" height="100%">
              {/* Stadium Corridor Outlines */}
              <path d="M 20,20 L 120,20 L 120,90 L 320,90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" strokeLinecap="round" />
              <path d="M 20,20 L 120,20 L 120,90 L 320,90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 120,20 L 280,20 L 280,90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" strokeLinecap="round" />
              
              {/* Directed Path (PRD Sec 4 adjacent Gate 3) */}
              {simState === 'storm-alert' ? (
                <>
                  {/* Drawing a glowing circle at (120, 55) for the holding zone */}
                  <circle cx="120" cy="55" r="18" fill="rgba(255, 140, 0, 0.15)" stroke="#ff8c00" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="120" y="58" fill="#ff8c00" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="Fira Code">HOLD</text>
                  
                  {/* Path leading to the hold area */}
                  <path d="M 40,20 L 120,20 L 120,37" 
                        fill="none" 
                        stroke="#ff8c00" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                        strokeDasharray="5 5"
                  />
                </>
              ) : simState === 'gate2-blocked' ? (
                <>
                  {/* Blocked Gate 2 red cross at top-right (280, 20) */}
                  <line x1="275" y1="15" x2="285" y2="25" stroke="#ff2e63" strokeWidth="2.5" />
                  <line x1="285" y1="15" x2="275" y2="25" stroke="#ff2e63" strokeWidth="2.5" />
                  
                  {/* Warning path redirects down to adjacent Gate 3 at (280, 90) */}
                  <path d="M 40,20 Q 120,20 120,55 T 280,90" 
                        fill="none" 
                        stroke="#ff8c00" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                        strokeDasharray="6 5"
                  />
                  <circle cx="280" cy="90" r="5" fill="#ff8c00" />
                </>
              ) : status === 'warning' ? (
                <>
                  {/* Pre-emptive redirect active - detour down towards adjacent Gate 3 at (280, 90) */}
                  <path d="M 40,20 Q 120,20 120,55 T 280,90" 
                        fill="none" 
                        stroke="#ff8c00" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                        strokeDasharray="8 6"
                        className="pulse-path"
                  />
                  <circle cx="280" cy="90" r="5" fill="#ff8c00" />
                </>
              ) : (
                <>
                  {/* Standard flow active straight to Gate 2 at (280, 20) */}
                  <path d="M 40,20 Q 120,20 280,20" 
                        fill="none" 
                        stroke="#00f0ff" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                        strokeDasharray="8 6"
                  />
                  <circle cx="280" cy="20" r="5" fill="#00f0ff" />
                </>
              )}
              {/* Dynamic Exit Destination Label Text */}
              <text 
                x="235" 
                y={simState === 'storm-alert' ? "58" : status === 'warning' || status === 'danger' ? "83" : "40"} 
                fill={statusColor.text} 
                fontSize="9" 
                fontWeight="bold" 
                fontFamily="Fira Code"
              >
                {simState === 'storm-alert' ? 'HOLD' : gate}
              </text>
            </svg>
          </div>
        </div>

        {/* Chatbot (Fan Advisory Agent UI) */}
        <div style={{
          background: '#101524',
          borderRadius: '20px',
          padding: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={15} color="#00f0ff" />
            <span>Fan Assistant Agent</span>
          </div>

          <div style={{
            height: '105px',
            overflowY: 'auto',
            background: '#07090e',
            borderRadius: '12px',
            padding: '10px',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? '#00f0ff22' : 'rgba(255,255,255,0.05)',
                color: msg.sender === 'user' ? '#00f0ff' : '#ffffff',
                border: msg.sender === 'user' ? '1px solid #00f0ff33' : 'none',
                padding: '6px 10px',
                borderRadius: '8px',
                maxWidth: '85%',
                lineHeight: '1.4'
              }}>
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'rgba(255,255,255,0.05)',
                color: '#8f9cae',
                padding: '6px 10px',
                borderRadius: '8px',
                fontStyle: 'italic'
              }}>
                Typing Sentry response...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Chat Help Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            <button 
              onClick={() => { setChatInput("I have a stroller, can I use Gate 2?"); }}
              style={{
                background: '#07090e',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                padding: '4px 8px',
                color: '#8f9cae',
                fontSize: '9px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              👶 Stroller
            </button>
            <button 
              onClick={() => { setChatInput("Is Gate 5 accessible?"); }}
              style={{
                background: '#07090e',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                padding: '4px 8px',
                color: '#8f9cae',
                fontSize: '9px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              ♿ Gate 5 Ramp
            </button>
            <button 
              onClick={() => { setChatInput("Which gate is fastest?"); }}
              style={{
                background: '#07090e',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                padding: '4px 8px',
                color: '#8f9cae',
                fontSize: '9px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              ⚡ Shortest line
            </button>
          </div>

          {/* Chat Send */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <input 
              type="text" 
              placeholder="Ask about ramps, crowds..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                background: '#07090e',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '6px 10px',
                color: '#ffffff',
                fontSize: '11px',
                outline: 'none'
              }}
            />
            <button 
              onClick={handleSend}
              style={{
                background: '#151b2d',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={12} color="#00f0ff" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
