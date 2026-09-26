import React from 'react';
import { Activity, Cpu, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AgentBrainPipeline({ isExecuting = false, currentStep = 2, shortfallDetected = false }) {
  const steps = [
    {
      id: 1,
      name: "Observer Node",
      desc: "Transaction Ingestion & P(recv) Score",
      icon: Activity
    },
    {
      id: 2,
      name: "Predictor Node",
      desc: "S_safe Math Engine & 14-Day Forecast",
      icon: Cpu
    },
    {
      id: 3,
      name: "Explainer Node",
      desc: "XAI Plain-Language Risk Reasoning",
      icon: Sparkles
    },
    {
      id: 4,
      name: "Intervener Node",
      desc: "HITL Defensive Action & Memory Checkpointer",
      icon: ShieldAlert
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-sm mb-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <span className={`block w-3 h-3 rounded-full ${shortfallDetected ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
            <span className={`absolute top-0 left-0 w-3 h-3 rounded-full ${shortfallDetected ? 'bg-red-500' : 'bg-emerald-500'}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-800 tracking-wide uppercase flex items-center gap-2">
              LangGraph Agentic Workflow State
            </h3>
            <p className="text-xs text-stone-500">
              Thread Memory: <span className="font-mono text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">#chk_sqlite_892</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200/60">
            {isExecuting ? "⚡ Processing Events..." : "● Node Graph Idle"}
          </span>
        </div>
      </div>

      {/* Connected Agent Brain Pipeline Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = isExecuting && currentStep === step.id;
          const isPassed = currentStep > step.id;

          return (
            <div key={step.id} className="relative group">
              {/* Connector Line (between steps) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-[2px] bg-stone-200 z-0">
                  {isExecuting && (
                    <div className="h-full bg-orange-500 animate-pulse w-full" />
                  )}
                </div>
              )}

              {/* Node Card */}
              <div
                className={`p-3.5 rounded-xl border transition-all duration-300 relative z-10 ${
                  isActive
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-orange-400 shadow-md ring-2 ring-orange-400/20'
                    : shortfallDetected && step.id === 4
                    ? 'bg-red-50/80 border-red-300 shadow-sm'
                    : 'bg-stone-50/60 border-stone-200/70 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : shortfallDetected && step.id === 4
                        ? 'bg-red-500 text-white'
                        : 'bg-stone-200/70 text-stone-700'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 font-bold">
                    NODE 0{step.id}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-stone-800 mb-0.5">{step.name}</h4>
                <p className="text-[11px] text-stone-500 leading-snug">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
