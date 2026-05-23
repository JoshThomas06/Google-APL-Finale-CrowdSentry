import React, { useEffect, useRef } from 'react';

export default function StadiumCanvas({
  simulationState,
  onStatsUpdate
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameIdRef = useRef(null);
  const statsIntervalRef = useRef(null);
  const stateRef = useRef(simulationState);

  useEffect(() => {
    stateRef.current = simulationState;
  }, [simulationState]);

  // Gate layout is expressed as FRACTIONS of canvas width/height
  // so they scale with the container
  const getGateCoords = (w, h) => ({
    Gate1: { x: w * 0.5, y: h * 0.08 },   // Top
    Gate2: { x: w * 0.88, y: h * 0.5 },   // Right (Critical)
    Gate3: { x: w * 0.5, y: h * 0.92 },   // Bottom (Adjacent)
    Gate5: { x: w * 0.12, y: h * 0.5 }    // Left
  });

  // Stand spawn points as fractions
  const getStands = (w, h) => [
    { name: 'North Stand', color: 'rgba(124, 77, 255, 0.7)', spawnX: w * 0.5, spawnY: h * 0.18, radius: w * 0.08, initialGate: 'Gate1' },
    { name: 'East Stand', color: 'rgba(0, 230, 118, 0.7)', spawnX: w * 0.75, spawnY: h * 0.5, radius: w * 0.065, initialGate: 'Gate2' },
    { name: 'South Stand', color: 'rgba(255, 140, 0, 0.7)', spawnX: w * 0.5, spawnY: h * 0.76, radius: w * 0.08, initialGate: 'Gate2' },
    { name: 'West Stand', color: 'rgba(255, 46, 99, 0.7)', spawnX: w * 0.25, spawnY: h * 0.5, radius: w * 0.065, initialGate: 'Gate5' }
  ];

  const initParticles = (w, h) => {
    const stands = getStands(w, h);
    const list = [];

    for (let i = 0; i < 400; i++) {
      const standIdx = i % stands.length;
      const stand = stands[standIdx];
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * stand.radius;
      const px = stand.spawnX + Math.cos(angle) * r;
      const py = stand.spawnY + Math.sin(angle) * r;

      let gate = stand.initialGate;
      if (stand.name === 'South Stand') {
        gate = Math.random() < 0.8 ? 'Gate2' : 'Gate3';
      }

      list.push({
        id: i,
        x: px, y: py,
        vx: 0, vy: 0,
        stand: stand.name,
        targetGate: gate,
        originalGate: gate,
        speed: 0.8 + Math.random() * 0.5,
        size: 1.8 + Math.random() * 1.0,
        color: stand.color,
        densityColor: '#00e676',
        exited: false,
        stuckTicks: 0
      });
    }
    particlesRef.current = list;
  };

  // Re-route particles when state changes
  useEffect(() => {
    const list = particlesRef.current;
    if (simulationState === 'rerouted') {
      list.forEach(p => {
        if (p.originalGate === 'Gate2') {
          if (p.stand === 'South Stand') {
            p.targetGate = 'Gate3';
          } else if (p.stand === 'East Stand') {
            p.targetGate = Math.random() < 0.5 ? 'Gate1' : 'Gate3';
          }
        }
      });
    } else if (simulationState === 'idle' || simulationState === 'running') {
      list.forEach(p => { p.targetGate = p.originalGate; });
    }
  }, [simulationState]);

  useEffect(() => {
    if (simulationState === 'idle') {
      const canvas = canvasRef.current;
      if (canvas) initParticles(canvas.width, canvas.height);
    }
  }, [simulationState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    // Responsive resize
    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Stats throttle
    statsIntervalRef.current = setInterval(() => {
      if (stateRef.current === 'idle') return;
      const list = particlesRef.current;
      const activeParticles = list.filter(p => !p.exited);
      const totalCount = list.length;
      const exitedCount = totalCount - activeParticles.length;

      let congestionRisk = 0, fanComfortScore = 98, extraDistance = 0.0;
      if (stateRef.current === 'gate2-blocked') { congestionRisk = Math.min(96, 75 + Math.random() * 20); fanComfortScore = 90; extraDistance = 0.5; }
      else if (stateRef.current === 'storm-alert') { congestionRisk = 92; fanComfortScore = 85; extraDistance = 0.0; }
      else if (stateRef.current === 'rerouted') { congestionRisk = Math.max(12, Math.floor(45 - (exitedCount / totalCount) * 35)); fanComfortScore = 90; extraDistance = 1.2; }
      else if (stateRef.current === 'running') { congestionRisk = 18; fanComfortScore = 98; extraDistance = 0.0; }

      let egressRate = 0;
      if (stateRef.current === 'running') egressRate = 185;
      else if (stateRef.current === 'gate2-blocked') egressRate = 18;
      else if (stateRef.current === 'storm-alert') egressRate = 8;
      else if (stateRef.current === 'rerouted') egressRate = 220;

      onStatsUpdate({ exitedCount, totalCount, congestionRisk, egressRate, fanComfortScore, extraDistance, gateLoads: { Gate1: 20, Gate2: stateRef.current === 'gate2-blocked' ? 98 : 45, Gate3: 30, Gate5: 15 } });
    }, 500);

    // ── RENDER LOOP ──
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const gateCoords = getGateCoords(w, h);

      // Glowing tail effect
      ctx.fillStyle = 'rgba(7, 9, 14, 0.18)';
      ctx.fillRect(0, 0, w, h);

      // Stadium oval boundary
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.5, w * 0.42, h * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner dashed field circle
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.07)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 10]);
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.5, w * 0.28, h * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Stand labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.font = `700 ${Math.max(8, w * 0.012)}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('NORTH PAVILION STAND', w * 0.5, h * 0.24);
      ctx.fillText('EAST STAND SECTOR', w * 0.72, h * 0.6);
      ctx.fillText('SOUTH PAVILION STAND', w * 0.5, h * 0.72);
      ctx.fillText('WEST STAND SECTOR', w * 0.28, h * 0.6);

      // Central Pitch rectangle
      const pitchW = w * 0.07, pitchH = h * 0.24;
      ctx.fillStyle = 'rgba(210, 180, 140, 0.1)';
      ctx.fillRect(w * 0.5 - pitchW / 2, h * 0.5 - pitchH / 2, pitchW, pitchH);
      ctx.strokeStyle = 'rgba(210, 180, 140, 0.18)';
      ctx.lineWidth = 1;
      ctx.strokeRect(w * 0.5 - pitchW / 2, h * 0.5 - pitchH / 2, pitchW, pitchH);

      // Plaza Buffer Zone (storm)
      if (stateRef.current === 'storm-alert') {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 140, 0, 0.04)';
        ctx.strokeStyle = 'rgba(255, 140, 0, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.62, Math.min(w, h) * 0.09, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = '#ff8c00';
        ctx.font = `700 ${Math.max(7, w * 0.011)}px "Fira Code", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('SOUTH PLAZA BUFFER ZONE', w * 0.5, h * 0.62 + Math.min(w, h) * 0.09 + 12);
      }

      // Gate rectangles
      Object.keys(gateCoords).forEach(gKey => {
        const coord = gateCoords[gKey];
        const isBlocked = gKey === 'Gate2' && stateRef.current === 'gate2-blocked';
        ctx.save();
        if (isBlocked) {
          ctx.strokeStyle = 'rgba(255, 46, 99, 0.8)';
          ctx.fillStyle = 'rgba(255, 46, 99, 0.18)';
          ctx.shadowColor = 'rgba(255, 46, 99, 0.5)';
        } else {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
          ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
          ctx.shadowColor = 'rgba(0, 240, 255, 0.3)';
        }
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;

        const gW = w * 0.04, gH = h * 0.04;
        ctx.beginPath();
        if (gKey === 'Gate1' || gKey === 'Gate3') {
          ctx.rect(coord.x - gW * 1.5, coord.y - gH * 0.4, gW * 3, gH * 0.8);
        } else {
          ctx.rect(coord.x - gW * 0.4, coord.y - gH * 1.5, gW * 0.8, gH * 3);
        }
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = isBlocked ? '#ff2e63' : '#00f0ff';
        ctx.font = `700 ${Math.max(8, w * 0.011)}px "Fira Code", monospace`;
        ctx.textAlign = 'center';
        if (gKey === 'Gate1') ctx.fillText('GATE 1 [N]', coord.x, coord.y - gH * 0.8);
        else if (gKey === 'Gate2') ctx.fillText(isBlocked ? 'GATE 2 [BLOCKED]' : 'GATE 2', coord.x + gW * 2, coord.y);
        else if (gKey === 'Gate3') ctx.fillText('GATE 3 [ADJ]', coord.x, coord.y + gH * 1.2);
        else if (gKey === 'Gate5') ctx.fillText('GATE 5 [W]', coord.x - gW * 2, coord.y);
      });

      // ── PHYSICS ──
      const list = particlesRef.current;
      const isSimulating = stateRef.current !== 'idle' && stateRef.current !== 'paused';

      if (isSimulating) {
        const densityRadius = Math.min(w, h) * 0.028;

        for (let i = 0; i < list.length; i++) {
          const p = list[i];
          if (p.exited) continue;

          // Count neighbors
          let neighbors = 0;
          for (let j = 0; j < list.length; j++) {
            if (i === j || list[j].exited) continue;
            if (Math.hypot(list[j].x - p.x, list[j].y - p.y) < densityRadius) neighbors++;
          }

          let speedFactor = p.speed;
          if (neighbors >= 8) { p.densityColor = '#ff2e63'; speedFactor *= 0.05; }
          else if (neighbors >= 4) { p.densityColor = '#ff8c00'; speedFactor *= 0.45; }
          else { p.densityColor = '#00e676'; }

          let targetKey = p.targetGate;
          let target = gateCoords[targetKey];

          // PALD reroute split visualization
          if (stateRef.current === 'rerouted' && p.stand === 'South Stand' && targetKey === 'Gate3') {
            // Corridor waypoint halfway (slightly angled toward Gate 3)
            const midX = w * 0.5 + (gateCoords.Gate3.x - w * 0.5) * 0.4;
            const midY = h * 0.5 + (gateCoords.Gate3.y - h * 0.5) * 0.4;
            if (p.x > midX - w * 0.05) {
              target = gateCoords.Gate3;
            } else {
              target = { x: midX, y: midY };
            }
          }

          // Buffer holding during storm
          if (stateRef.current === 'storm-alert' && p.stand === 'South Stand') {
            target = { x: w * 0.5, y: h * 0.62 };
          }

          const isTargetBlocked = targetKey === 'Gate2' && stateRef.current === 'gate2-blocked';
          const dx = target.x - p.x, dy = target.y - p.y;
          const distance = Math.hypot(dx, dy);

          if (distance < Math.min(w, h) * 0.02) {
            if (!isTargetBlocked) { p.exited = true; continue; }
            else { p.stuckTicks++; }
          }

          let targetVx = (dx / distance) * speedFactor * 1.4;
          let targetVy = (dy / distance) * speedFactor * 1.4;

          // Orbit inside plaza buffer
          if (stateRef.current === 'storm-alert' && p.stand === 'South Stand') {
            const plazaDist = Math.hypot(w * 0.5 - p.x, h * 0.62 - p.y);
            const plazaR = Math.min(w, h) * 0.09;
            if (plazaDist < plazaR) {
              speedFactor *= 0.2;
              targetVx = -((p.y - h * 0.62) / (plazaDist || 1)) * speedFactor * 1.5;
              targetVy = ((p.x - w * 0.5) / (plazaDist || 1)) * speedFactor * 1.5;
            }
          }

          // Pitch avoidance
          const pitchDist = Math.hypot(w * 0.5 - p.x, h * 0.5 - p.y);
          if (pitchDist < Math.min(w, h) * 0.2) {
            const avoidX = (p.x - w * 0.5) / pitchDist;
            const avoidY = (p.y - h * 0.5) / pitchDist;
            targetVx += avoidX * 0.5;
            targetVy += avoidY * 0.5;
          }

          // Gate 2 barrier collision
          if (isTargetBlocked && p.targetGate === 'Gate2') {
            const barrierX = w * 0.82;
            if (p.x > barrierX - w * 0.02) {
              p.x = barrierX - w * 0.02;
              targetVx = -Math.abs(targetVx) * 0.2;
              p.vy += (Math.random() - 0.5) * 0.6;
            }
          }

          p.vx += (targetVx - p.vx) * 0.1;
          p.vy += (targetVy - p.vy) * 0.1;
          p.x += p.vx;
          p.y += p.vy;

          // Boundary guard
          if (p.x < w * 0.03 || p.x > w * 0.97 || p.y < h * 0.03 || p.y > h * 0.97) {
            p.x = w * 0.5 + (Math.random() - 0.5) * w * 0.15;
            p.y = h * 0.5 + (Math.random() - 0.5) * h * 0.15;
            p.vx = 0; p.vy = 0;
          }
        }
      }

      // Draw particles
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        if (p.exited) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.densityColor;
        if (p.densityColor === '#ff2e63') {
          ctx.save();
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ff2e63';
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fill();
        }
      }

      // Gate 2 blocked warning circle
      if (stateRef.current === 'gate2-blocked') {
        const g2 = gateCoords.Gate2;
        ctx.save();
        ctx.fillStyle = 'rgba(255, 46, 99, 0.08)';
        ctx.strokeStyle = '#ff2e63';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(g2.x, g2.y, Math.min(w, h) * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
      <canvas
        ref={canvasRef}
        id="stadium_physics_canvas"
        style={{ display: 'block', width: '100%', height: '100%', background: '#05070c', cursor: 'crosshair' }}
      />

      {/* Legend */}
      <div className="glass-panel" style={{ position: 'absolute', bottom: '12px', left: '12px', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '5px', background: 'rgba(5,7,12,0.85)', border: '1px solid rgba(59,73,75,0.3)', borderRadius: '10px' }}>
        {[['#00e676', 'SAFE FLOW'], ['#ff8c00', 'CONGESTION'], ['#ff2e63', 'CRITICAL']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: color === '#ff2e63' ? '0 0 6px #ff2e63' : 'none' }} />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '8px', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
