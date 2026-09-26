import React from 'react';
import { Terminal } from 'lucide-react';

export default function AgentLogsView({ logs }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 font-mono">
            <Terminal className="w-4 h-4 text-orange-500" />
            Autonomous Decision Audit
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight font-sora mt-1">
            Agent Audit Log & Decision Trace
          </h1>
          <p className="text-xs text-stone-500 font-sans">Immutable, verifiable reasoning traces for every liquidity decision</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Guardian Engine v2.4 Live
          </div>
        </div>
      </div>

      {/* Terminal-style Log Box */}
      <div className="rounded-3xl bg-white border border-orange-100 shadow-luxury p-6 font-mono text-xs overflow-hidden backdrop-blur-xl">
        
        {/* Terminal top bar */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="ml-2 text-stone-600 text-[11px] font-bold">safespend-agent-daemon / trace.log</span>
          </div>
          <span className="text-[10px] text-stone-400 font-bold">Autonomous Level 4</span>
        </div>

        {/* Log Entries */}
        <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
          {logs.map((log, idx) => {
            const isWarn = log.level === 'WARN' || log.level === 'ALERT';
            const isSuccess = log.level === 'SUCCESS' || log.level === 'ACTION_EXECUTED';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                  isWarn
                    ? 'bg-orange-50/80 border-orange-200 text-stone-800'
                    : isSuccess
                    ? 'bg-emerald-50/80 border-emerald-200 text-stone-800'
                    : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-500">[{log.timestamp}]</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isWarn
                        ? 'bg-orange-600 text-white'
                        : isSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-800'
                    }`}>
                      {log.level}
                    </span>
                    <span className="font-bold text-stone-900 font-sora">{log.action}</span>
                  </div>
                  <p className="text-[11px] font-sans text-stone-600 pl-2 sm:pl-0">{log.details}</p>
                </div>

                <div className="text-[10px] text-stone-500 shrink-0 font-mono">
                  Confidence: <span className="text-stone-900 font-bold">{log.confidence || '94.8%'}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
