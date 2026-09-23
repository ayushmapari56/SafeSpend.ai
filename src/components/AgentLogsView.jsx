import React from 'react';
import { Terminal, Shield, CheckCircle, AlertTriangle, Cpu, Clock, RefreshCw } from 'lucide-react';

export default function AgentLogsView({ logs }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
            <Terminal className="w-4 h-4 text-rose-400" />
            Autonomous Decision Audit
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-['Outfit'] mt-1">
            Agent Audit Log & Decision Trace
          </h1>
          <p className="text-xs text-stone-400">Immutable, verifiable reasoning traces for every liquidity decision</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Guardian Engine v2.4 Live
          </div>
        </div>
      </div>

      {/* Terminal-style Log Box */}
      <div className="rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl p-6 font-mono text-xs overflow-hidden backdrop-blur-xl">
        
        {/* Terminal top bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 text-stone-400 text-[11px]">safespend-agent-daemon / trace.log</span>
          </div>
          <span className="text-[10px] text-stone-500">Autonomous Level 4</span>
        </div>

        {/* Log Entries */}
        <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
          {logs.map((log, idx) => {
            const isWarn = log.level === 'WARN' || log.level === 'ALERT';
            const isSuccess = log.level === 'SUCCESS' || log.level === 'ACTION_EXECUTED';

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                  isWarn
                    ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                    : isSuccess
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                    : 'bg-stone-950/60 border-stone-800/80 text-stone-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400">[{log.timestamp}]</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isWarn
                        ? 'bg-rose-900 text-rose-200'
                        : isSuccess
                        ? 'bg-emerald-900 text-emerald-200'
                        : 'bg-stone-800 text-stone-300'
                    }`}>
                      {log.level}
                    </span>
                    <span className="font-semibold text-stone-100">{log.action}</span>
                  </div>
                  <p className="text-[11px] font-sans text-stone-300 pl-2 sm:pl-0">{log.details}</p>
                </div>

                <div className="text-[10px] text-stone-400 shrink-0 font-mono">
                  Confidence: <span className="text-white font-bold">{log.confidence || '94.8%'}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
