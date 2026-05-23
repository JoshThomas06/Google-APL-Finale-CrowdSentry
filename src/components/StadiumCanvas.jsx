import React, { useEffect, useRef, useState } from 'react';

export default function StadiumCanvas({ 
  simulationState, // 'idle', 'running', 'paused', 'gate2-blocked', 'storm-alert', 'rerouted'
  onStatsUpdate // callback for throttled stats update
}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameIdRef = useRef(null);
  const statsIntervalRef = useRef(null);
  
  // Track simulation state inside a ref to access in canvas render loop instantly
  const stateRef = useRef(simulationState);
  useEffect(() => {
    stateRef.current = simulationState;
  }, [simulationState]);

  // Initializing 450 particles
  const initParticles = () => {
    const list = [];
    const stands = [
      { name: 'North Stand', color: 'rgba(124, 77, 255, 0.65)', spawnX: 400, spawnY: 100, radius: 60, initialGate: 'Gate1' }, // Indigo
      { name: 'East Stand', color: 'rgba(0, 230, 118, 0.65)', spawnX: 580, spawnY: 250, radius: 50, initialGate: 'Gate2' },  // Grass Emerald
      { name: 'South Stand', color: 'rgba(255, 140, 0, 0.65)', spawnX: 400, spawnY: 380, radius: 60, initialGate: 'Gate2' }, // Sunset Gold (Orange)
      { name: 'West Stand', color: 'rgba(255, 46, 99, 0.65)', spawnX: 220, spawnY: 250, radius: 50, initialGate: 'Gate5' }   // Deep Ruby (Red)
    ];

    // Distribute particles across sectors
    for (let i = 0; i < 450; i++) {
      const standIdx = i % stands.length;
      const stand = stands[standIdx];
      
      // Distribute randomly in a circle around spawn coordinates
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * stand.radius;
      const px = stand.spawnX + Math.cos(angle) * r;
      const py = stand.spawnY + Math.sin(angle) * r;

      // South stand splits 80% Gate 2 (congested) and 20% Gate 3 initially
      let gate = stand.initialGate;
      if (stand.name === 'South Stand') {
        gate = Math.random() < 0.8 ? 'Gate2' : 'Gate3';
      }

      list.push({
        id: i,
        x: px,
        y: py,
        vx: 0,
        vy: 0,
        stand: stand.name,
        targetGate: gate,
        originalGate: gate,
        speed: 1.0 + Math.random() * 0.4,
        size: 2.2 + Math.random() * 1.2,
        densityColor: '#00e676', // Green default
        exited: false,
        stuckTicks: 0
      });
    }
    particlesRef.current = list;
  };

  // Define exit gate center coordinates
  const gateCoords = {
    Gate1: { x: 400, y: 40 },   // Top Gate
    Gate2: { x: 670, y: 250 },  // Right Gate (Bottleneck Segment)
    Gate3: { x: 400, y: 460 },  // Bottom Gate
    Gate5: { x: 130, y: 250 }   // Left Gate
  };

  // Reset / Initial Setup
  useEffect(() => {
    initParticles();
    
    // Throttled stats loop running every 500ms (PRD Sec 4.A)
    statsIntervalRef.current = setInterval(() => {
      if (stateRef.current === 'idle') return;

      const activeParticles = particlesRef.current.filter(p => !p.exited);
      const totalCount = particlesRef.current.length;
      const exitedCount = totalCount - activeParticles.length;

      // Count gate-specific densities
      const gateLoads = { Gate1: 0, Gate2: 0, Gate3: 0, Gate5: 0 };
      let criticalDensityCount = 0;

      activeParticles.forEach(p => {
        // Calculate distance to current target gate
        const target = gateCoords[p.targetGate];
        const dist = Math.hypot(target.x - p.x, target.y - p.y);
        
        // If close to their exit gate, add to density metric
        if (dist < 100) {
          gateLoads[p.targetGate]++;
        }

        // Count particles in high density/bottleneck state
        if (p.densityColor === '#ff2e63') {
          criticalDensityCount++;
        }
      });

      // Calculate Congestion Risk Index, Comfort, and Walking Distance (PRD Sec 4 & 7)
      let congestionRisk = 0;
      let fanComfortScore = 98;
      let extraDistance = 0.0;

      if (stateRef.current === 'gate2-blocked') {
        congestionRisk = Math.min(96, 75 + Math.floor((gateLoads.Gate2 / 70) * 20));
        fanComfortScore = 90;
        extraDistance = 0.5;
      } else if (stateRef.current === 'storm-alert') {
        congestionRisk = 92;
        fanComfortScore = 85;
        extraDistance = 0.0;
      } else if (stateRef.current === 'rerouted') {
        // Cooling down
        congestionRisk = Math.max(12, Math.floor(45 - (exitedCount / totalCount) * 35));
        fanComfortScore = 90;
        extraDistance = 1.2;
      } else if (stateRef.current === 'running') {
        congestionRisk = 18;
        fanComfortScore = 98;
        extraDistance = 0.0;
      }

      // Egress rate (exited per min)
      let egressRate = 0;
      if (stateRef.current === 'running') egressRate = 185;
      else if (stateRef.current === 'gate2-blocked') egressRate = 18; // collapsed
      else if (stateRef.current === 'storm-alert') egressRate = 8; // near stampede
      else if (stateRef.current === 'rerouted') egressRate = 220; // super efficient flow

      onStatsUpdate({
        exitedCount,
        totalCount,
        congestionRisk,
        egressRate,
        fanComfortScore,
        extraDistance,
        gateLoads: {
          Gate1: Math.min(100, Math.floor((gateLoads.Gate1 / 80) * 100)),
          Gate2: stateRef.current === 'gate2-blocked' ? 98 : Math.min(100, Math.floor((gateLoads.Gate2 / 80) * 100)),
          Gate3: Math.min(100, Math.floor((gateLoads.Gate3 / 80) * 100)),
          Gate5: Math.min(100, Math.floor((gateLoads.Gate5 / 80) * 100))
        }
      });
    }, 500);

    return () => {
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    };
  }, []);

  // Watch simulation state transitions and update particle routing dynamically (PRD Sec 4 PALD)
  useEffect(() => {
    const list = particlesRef.current;
    
    if (simulationState === 'rerouted') {
      // Reallocation engine: route South stand reallocations to adjacent Gate 3 (PALD)
      list.forEach(p => {
        if (p.originalGate === 'Gate2') {
          if (p.stand === 'South Stand') {
            p.targetGate = 'Gate3'; // Adjacent Gate 3
          } else if (p.stand === 'East Stand') {
            // East Stand splits between adjacent Gate 1 and Gate 3
            p.targetGate = Math.random() < 0.5 ? 'Gate1' : 'Gate3';
          }
        }
      });
    } else if (simulationState === 'idle' || simulationState === 'running') {
      // Reset all gates to original configuration
      list.forEach(p => {
        p.targetGate = p.originalGate;
      });
    }
  }, [simulationState]);

  // Main high-speed rendering loop using requestAnimationFrame (PRD Sec 4.A)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const width = 800;
    const height = 500;
    
    const render = () => {
      // 1. High-fidelity glowing particle trails (PRD Sec 4.B)
      ctx.fillStyle = 'rgba(7, 9, 14, 0.18)'; // transparent overlay
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Stadium Cricket Oval Overlay (Subtle Cricket Theme)
      // Inner Circle (dashed field circle)
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.ellipse(400, 250, 180, 140, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Outer Boundary line
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.ellipse(400, 250, 250, 190, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Seating Stand labels in corners
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.font = '700 10px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NORTH PAVILION STAND', 400, 140);
      ctx.fillText('EAST STAND SECTOR', 550, 310);
      ctx.fillText('SOUTH PAVILION STAND', 400, 360);
      ctx.fillText('WEST STAND SECTOR', 250, 310);

      // Pitch in center (Tan rectangle)
      ctx.fillStyle = 'rgba(210, 180, 140, 0.12)';
      ctx.fillRect(385, 235, 30, 30);
      ctx.strokeStyle = 'rgba(210, 180, 140, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(385, 235, 30, 30);

      // 2.5. Draw Dynamic Plaza Buffer Zone (PRD Sec 11.B)
      if (stateRef.current === 'storm-alert') {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 140, 0, 0.04)';
        ctx.strokeStyle = 'rgba(255, 140, 0, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(400, 310, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Label for Buffer Zone
        ctx.fillStyle = '#ff8c00';
        ctx.font = '700 8px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SOUTH PLAZA BUFFER ZONE (HOLD)', 400, 324);
      }

      // 3. Draw exit gate rectangular segments (cyan/green status outlines)
      Object.keys(gateCoords).forEach(gateKey => {
        const coord = gateCoords[gateKey];
        const isBlocked = gateKey === 'Gate2' && stateRef.current === 'gate2-blocked';
        
        ctx.save();
        if (isBlocked) {
          ctx.strokeStyle = 'rgba(255, 46, 99, 0.7)';
          ctx.fillStyle = 'rgba(255, 46, 99, 0.2)';
          ctx.shadowColor = 'rgba(255, 46, 99, 0.5)';
        } else {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
          ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
          ctx.shadowColor = 'rgba(0, 240, 255, 0.3)';
        }
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2;

        // Draw exit gateway segments
        ctx.beginPath();
        if (gateKey === 'Gate1' || gateKey === 'Gate3') {
          ctx.rect(coord.x - 25, coord.y - 8, 50, 16);
        } else {
          ctx.rect(coord.x - 8, coord.y - 25, 16, 50);
        }
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Labeled text above gates
        ctx.fillStyle = isBlocked ? '#ff2e63' : '#00f0ff';
        ctx.font = '700 9px "Fira Code", monospace';
        ctx.textAlign = 'center';
        
        if (gateKey === 'Gate1') ctx.fillText('GATE 1 [N]', coord.x, coord.y - 14);
        else if (gateKey === 'Gate2') ctx.fillText(isBlocked ? 'GATE 2 [BLOCKED]' : 'GATE 2 [S]', coord.x + 35, coord.y + 3);
        else if (gateKey === 'Gate3') ctx.fillText('GATE 3 [S]', coord.x, coord.y + 22);
        else if (gateKey === 'Gate5') ctx.fillText('GATE 5 [W]', coord.x - 35, coord.y + 3);
      });

      // 4. Update Particle Physics (Only if running, gate2-blocked, storm-alert, or rerouted)
      const list = particlesRef.current;
      const isSimulating = stateRef.current !== 'idle' && stateRef.current !== 'paused';
      
      if (isSimulating) {
        // Calculate all positions using double nested neighbor proximity loops (Section 2 Density Math)
        const densityRadius = 15;
        
        for (let i = 0; i < list.length; i++) {
          const p = list[i];
          if (p.exited) continue;

          // Count neighbors within radius to calculate congestion density
          let neighbors = 0;
          for (let j = 0; j < list.length; j++) {
            if (i === j || list[j].exited) continue;
            const dist = Math.hypot(list[j].x - p.x, list[j].y - p.y);
            if (dist < densityRadius) {
              neighbors++;
            }
          }

          // Dynamic speed and color mapping based on local crowding count
          let speedFactor = p.speed;
          if (neighbors >= 8) {
            p.densityColor = '#ff2e63'; // Danger (Pulsing Crimson)
            speedFactor *= 0.05; // 95% speed drop
          } else if (neighbors >= 4) {
            p.densityColor = '#ff8c00'; // Warning (Orange)
            speedFactor *= 0.45; // 55% speed drop
          } else {
            p.densityColor = '#00e676'; // Safe (Grass Green)
          }

          // Target gate coordinates (PRD Sec 6 Proactive split)
          let targetKey = p.targetGate;
          if (stateRef.current === 'rerouted' && p.originalGate === 'Gate2' && p.stand === 'South Stand') {
            // 50% split at x > 480 (halfway between spawn at 400 and Gate 2 at 670)
            if (p.x > 480 && p.id % 2 === 0) {
              targetKey = 'Gate3';
            }
          }

          let target = gateCoords[targetKey];

          // Proactive PALD steer split (PRD Sec 4 & 6)
          if (stateRef.current === 'rerouted' && p.stand === 'South Stand' && targetKey === 'Gate3') {
            if (p.x < 480) {
              target = { x: 480, y: 360 }; // Travel towards corridor midpoint
            } else {
              target = gateCoords.Gate3;    // Steer smoothly down-left to Gate 3
            }
          }

          // Dynamic Buffer holding logic (PRD Sec 11.B)
          if (stateRef.current === 'storm-alert' && p.stand === 'South Stand') {
            target = { x: 400, y: 310 }; // Target coordinates of Plaza Buffer Zone
          }

          const isTargetBlocked = targetKey === 'Gate2' && stateRef.current === 'gate2-blocked';

          // Vector calculation towards target exit gate
          const dx = target.x - p.x;
          const dy = target.y - p.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 12) {
            // Exit logic: particle leaves stadium
            if (!isTargetBlocked) {
              p.exited = true;
              continue;
            } else {
              // Trapped at blocked gate
              p.stuckTicks++;
            }
          }

          // Basic vector calculation towards their assigned gate segment
          let targetVx = (dx / distance) * speedFactor * 1.3;
          let targetVy = (dy / distance) * speedFactor * 1.3;

          // Introduce orbital holding force inside Plaza Buffer Zone (PRD Sec 11.B)
          if (stateRef.current === 'storm-alert' && p.stand === 'South Stand') {
            const plazaDist = Math.hypot(400 - p.x, 310 - p.y);
            if (plazaDist < 45) {
              speedFactor *= 0.18; // Slow down speed inside the plaza circle to hover
              targetVx = -((p.y - 310) / (plazaDist || 1)) * speedFactor * 1.5;
              targetVy = ((p.x - 400) / (plazaDist || 1)) * speedFactor * 1.5;
            }
          }

          // Circular steering logic: prevent particles cutting directly through pitch
          // Pulls them slightly radial if they venture too close to the cricket pitch (inner circle)
          const pitchDist = Math.hypot(400 - p.x, 250 - p.y);
          if (pitchDist < 120) {
            // Add a boundary avoidance radial force outwards
            const avoidanceX = (p.x - 400) / pitchDist;
            const avoidanceY = (p.y - 250) / pitchDist;
            targetVx += avoidanceX * 0.4;
            targetVy += avoidanceY * 0.4;
          }

          // Collision physics at Blocked Gate 2 boundary box
          if (isTargetBlocked && p.targetGate === 'Gate2') {
            const barrierLeft = 640;
            const barrierRight = 670;
            const barrierTop = 210;
            const barrierBottom = 290;

            if (p.x > barrierLeft - 10 && p.x < barrierRight && p.y > barrierTop && p.y < barrierBottom) {
              // Block movement on X axis and push back
              p.x = barrierLeft - 10;
              targetVx = -Math.abs(targetVx) * 0.2;
              p.vy += (Math.random() - 0.5) * 0.5; // push sideways
            }
          }

          // Smooth velocity interpolation for fluid crowding movement
          p.vx += (targetVx - p.vx) * 0.1;
          p.vy += (targetVy - p.vy) * 0.1;
          
          p.x += p.vx;
          p.y += p.vy;

          // Out-of-bounds boundary guards
          if (p.x < 50 || p.x > width - 50 || p.y < 30 || p.y > height - 30) {
            p.x = 400 + (Math.random() - 0.5) * 100;
            p.y = 250 + (Math.random() - 0.5) * 100;
            p.vx = 0;
            p.vy = 0;
          }
        }
      }

      // 5. Draw Particles as 2D Circles (PRD Sec 4.B)
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        if (p.exited) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        ctx.fillStyle = p.densityColor;
        
        // Add subtle shadow glows for highly congested/crimson particles
        if (p.densityColor === '#ff2e63') {
          ctx.save();
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#ff2e63';
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fill();
        }
      }

      // Draw Gate 2 Blocked Warning icon overlays on canvas
      if (stateRef.current === 'gate2-blocked') {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 46, 99, 0.1)';
        ctx.strokeStyle = '#ff2e63';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(670, 250, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Active loop pointer
      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  // Quick reset logic handler when simulator state resets
  useEffect(() => {
    if (simulationState === 'idle') {
      initParticles();
    }
  }, [simulationState]);

  return (
    <div className="relative w-full h-full flex flex-col justify-end">
      {/* Absolute canvas item container */}
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={500} 
        id="stadium_physics_canvas"
        className="w-full h-full bg-[#05070c] block cursor-crosshair"
        style={{ objectFit: 'contain' }}
      />
      
      {/* Legend overlay */}
      <div className="absolute top-4 left-4 p-2.5 glass-panel flex flex-col gap-1.5 text-[9px] font-semibold text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00e676]" />
          <span>SAFE FLOW (&lt;4 NEIGHBORS)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff8c00]" />
          <span>CONGESTION RISING (4-7 NEIGHBORS)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff2e63] shadow-[0_0_6px_#ff2e63]" />
          <span>CRITICAL BOTTLENECK (8+ NEIGHBORS)</span>
        </div>
      </div>
    </div>
  );
}
