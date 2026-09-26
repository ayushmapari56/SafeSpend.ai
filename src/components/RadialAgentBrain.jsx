import React, { useEffect, useRef, useState } from 'react';

export default function RadialAgentBrain({ isExecuting = false, shortfallDetected = false }) {
  const canvasRef = useRef(null);
  const [logs, setLogs] = useState([
    "close: reply verified",
    "ship: package handed off",
    "scout: sources added",
    "pitch: follow-up armed",
    "access: crm opened",
    "ship: asset rendered"
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // High DPI Canvas Scaling
    const width = (canvas.width = canvas.offsetWidth || 800);
    const height = (canvas.height = 360);

    const centerX = width / 2;
    const centerY = height / 2 - 10;
    const ringRadiusX = 140;
    const ringRadiusY = 55;

    // Generate Elliptical Core Ring Nodes
    const ringNodesCount = 180;
    const ringNodes = [];
    for (let i = 0; i < ringNodesCount; i++) {
      const angle = (i / ringNodesCount) * Math.PI * 2;
      ringNodes.push({
        angle,
        baseX: centerX + Math.cos(angle) * ringRadiusX,
        baseY: centerY + Math.sin(angle) * ringRadiusY,
        offset: (Math.random() - 0.5) * 8,
        speed: 0.002 + Math.random() * 0.003
      });
    }

    // Generate Radial Fractal Branches (Trees extending outward)
    const branches = [];
    const numBranches = 36;
    for (let i = 0; i < numBranches; i++) {
      const baseAngle = (i / numBranches) * Math.PI * 2;
      const startX = centerX + Math.cos(baseAngle) * ringRadiusX;
      const startY = centerY + Math.sin(baseAngle) * ringRadiusY;

      const segments = [];
      let currX = startX;
      let currY = startY;
      let currAngle = baseAngle;
      const depth = 5 + Math.floor(Math.random() * 4);

      for (let d = 0; d < depth; d++) {
        const len = 12 + Math.random() * 18;
        currAngle += (Math.random() - 0.5) * 0.4;
        const nextX = currX + Math.cos(currAngle) * len;
        const nextY = currY + Math.sin(currAngle) * (len * 0.6);
        segments.push({ x1: currX, y1: currY, x2: nextX, y2: nextY });
        currX = nextX;
        currY = nextY;
      }
      branches.push(segments);
    }

    let animationFrame;
    let rotationPhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotationPhase += 0.005;

      // Primary Color Palette (Cyan/Indigo Default, Glowing Red on Shortfall)
      const primaryColor = shortfallDetected ? '#ef4444' : isExecuting ? '#3b82f6' : '#2563eb';
      const secondaryColor = shortfallDetected ? '#f87171' : '#60a5fa';

      // 1. Draw Faint Background Orbital Guide Rings
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, ringRadiusX * 1.4, ringRadiusY * 1.4, Math.PI / 12, 0, Math.PI * 2);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, ringRadiusX * 1.8, ringRadiusY * 1.8, -Math.PI / 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Draw Radial Fractal Branches
      branches.forEach((branch) => {
        branch.forEach((seg, idx) => {
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.strokeStyle = primaryColor;
          ctx.globalAlpha = Math.max(0.1, 0.6 - idx * 0.1);
          ctx.lineWidth = Math.max(0.5, 2 - idx * 0.3);
          ctx.stroke();

          // Terminal Leaf Particles
          if (idx === branch.length - 1 && Math.random() > 0.4) {
            ctx.beginPath();
            ctx.arc(seg.x2, seg.y2, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = secondaryColor;
            ctx.fill();
          }
        });
      });

      // 3. Draw Core Glowing Neural Ring
      ringNodes.forEach((node) => {
        node.angle += node.speed;
        const x = centerX + Math.cos(node.angle + rotationPhase) * (ringRadiusX + node.offset);
        const y = centerY + Math.sin(node.angle + rotationPhase) * (ringRadiusY + node.offset);

        ctx.beginPath();
        ctx.arc(x, y, isExecuting ? 2.5 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.shadowBlur = isExecuting ? 10 : 4;
        ctx.shadowColor = primaryColor;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrame);
  }, [isExecuting, shortfallDetected]);

  // Simulate Live Action Logs
  useEffect(() => {
    if (!isExecuting) return;
    const interval = setInterval(() => {
      const newLogs = [
        "observer: ingestion verified",
        "math_engine: s_safe baseline re-calculated",
        "checkpointer: sqlite thread state synced",
        "agent_decision: route intervener node",
        "hitl: approval card surfaced"
      ];
      setLogs((prev) => [newLogs[Math.floor(Math.random() * newLogs.length)], ...prev.slice(0, 5)]);
    }, 800);
    return () => clearInterval(interval);
  }, [isExecuting]);

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-stone-200 shadow-xl overflow-hidden mb-6 p-4 font-mono text-stone-800">
      {/* Top Header Controls (Exact Sci-Fi Telemetry Bar) */}
      <div className="flex flex-wrap items-center justify-between text-[11px] pb-3 border-b border-stone-200/80 uppercase tracking-wider text-stone-500">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${shortfallDetected ? 'bg-red-500 animate-ping' : 'bg-blue-600'}`}></span>
            SAFESPEND AGENTIC FLEET • MAIN CORE
          </span>
          <span>RUN MODE: <strong className="text-stone-800">STATEFUL REASONING</strong></span>
        </div>
        <div className="flex items-center space-x-6 text-[10px]">
          <span>NODES: <strong className="text-stone-800">180/180</strong></span>
          <span>ACTIONS: <strong className="text-stone-800">217</strong></span>
          <span>SHARED MEMORY: <strong className="text-blue-600">YES (#chk_sqlite)</strong></span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">LIVE TELEMETRY</span>
        </div>
      </div>

      {/* Main Neural Halo Canvas Graphic */}
      <div className="relative w-full h-[320px] flex items-center justify-center bg-gradient-to-b from-stone-50/50 to-white">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Floating Labels over Halo Ring */}
        <div className="absolute top-4 left-6 text-[10px] text-stone-400 uppercase tracking-widest">
          // RADIAL_SYNAPSE_GRID
        </div>
        <div className="absolute bottom-4 right-6 text-[10px] text-stone-400 uppercase tracking-widest">
          EVIDENCE_SCORE: <span className="text-stone-700 font-bold">98.4%</span>
        </div>
      </div>

      {/* Bottom Sci-Fi Telemetry Grid (Exact Layout from Screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-stone-200/80 text-[10px]">

        {/* Box 1: Run Log */}
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
          <div className="text-stone-400 font-bold mb-1">// RUN LOG</div>
          <div className="space-y-0.5 text-stone-600 font-mono text-[9px] leading-tight">
            {logs.map((log, i) => (
              <div key={i} className="truncate">• {log}</div>
            ))}
          </div>
        </div>

        {/* Box 2: Access Ledger */}
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
          <div className="text-stone-400 font-bold mb-1">// ACCESS LEDGER</div>
          <div className="space-y-1 text-stone-600">
            <div className="flex justify-between"><span>fastapi_routes</span><span className="text-emerald-600">OK</span></div>
            <div className="flex justify-between"><span>langgraph_checkpointer</span><span className="text-emerald-600">OK</span></div>
            <div className="flex justify-between"><span>s_safe_math_engine</span><span className="text-blue-600">ACTIVE</span></div>
            <div className="flex justify-between"><span>telegram_webhooks</span><span className="text-amber-600">READY</span></div>
          </div>
        </div>

        {/* Box 3: Blast Radius / Risk Score */}
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="text-stone-400 font-bold mb-1">// RISK BUFFER CAPACITY</div>
            <div className="text-lg font-bold text-stone-800">
              {shortfallDetected ? 'BREACHED (0%)' : 'STABLE (100%)'}
            </div>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-500 ${shortfallDetected ? 'bg-red-500 w-full' : 'bg-emerald-500 w-full'}`}
            />
          </div>
        </div>

        {/* Box 4: Agent Node Status */}
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
          <div className="text-stone-400 font-bold mb-1">// BOT NODE STATUS</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>• OBSERVER</span>
              <span className="text-blue-600 font-bold">RUN</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• PREDICTOR</span>
              <span className="text-blue-600 font-bold">RUN</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• EXPLAINER</span>
              <span className={shortfallDetected ? "text-blue-600 font-bold" : "text-stone-400"}>
                {shortfallDetected ? "RUN" : "IDLE"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>• INTERVENER</span>
              <span className={shortfallDetected ? "text-blue-600 font-bold" : "text-stone-400"}>
                {shortfallDetected ? "RUN" : "IDLE"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}