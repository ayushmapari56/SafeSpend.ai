import React, { useEffect, useRef } from 'react';

export default function NeuronBrain({ isActive, statusColor = "#ef4444" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 300;
    canvas.height = 180;

    // Create Neuron Nodes
    const numNeurons = 22;
    const neurons = [];
    for (let i = 0; i < numNeurons; i++) {
      neurons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 2,
        pulse: Math.random() * Math.PI
      });
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Synapse Connections (Lines between nearby neurons)
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.strokeStyle = isActive ? statusColor : '#334155';
            ctx.globalAlpha = (1 - dist / 75) * (isActive ? 0.8 : 0.3);
            ctx.lineWidth = isActive ? 1.5 : 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      // Draw & Move Neuron Nodes
      neurons.forEach((neuron) => {
        neuron.x += neuron.vx;
        neuron.y += neuron.vy;

        // Bounce from boundaries
        if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1;
        if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1;

        // Draw Neuron Glowing Core
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? statusColor : '#94a3b8';
        ctx.shadowBlur = isActive ? 12 : 0;
        ctx.shadowColor = statusColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive, statusColor]);

  return (
    <div className="relative flex flex-col items-center justify-center bg-stone-950 p-4 rounded-2xl border border-stone-800 shadow-2xl">
      <div className="absolute top-3 left-4 flex items-center space-x-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
        <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
          {isActive ? 'LANGGRAPH BRAIN: REASONING...' : 'AGENT BRAIN: ACTIVE'}
        </span>
      </div>
      
      {/* Canvas Element for Neural Synapse Animation */}
      <canvas ref={canvasRef} className="w-full h-40" />

      <p className="text-[10px] font-mono text-stone-500 mt-1">
        Stateful Memory Thread: <span className="text-stone-300">#chk_sqlite_892</span>
      </p>
    </div>
  );
}
