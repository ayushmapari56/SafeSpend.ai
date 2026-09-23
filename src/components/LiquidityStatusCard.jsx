import React from 'react';
import { ShieldCheck, AlertCircle, Clock, Zap, RefreshCw, Flame, DollarSign } from 'lucide-react';

export default function LiquidityStatusCard({
  liquidBalance,
  status,
  statusMessage,
  incomeDelayDays,
  expenseShockAmount,
  onInjectDelay,
  onInjectShock,
  onRecalculate,
  onResetDemo,
  isRecalculating
}) {
  const isSafe = status === 'SAFE';
  const isRestored = status === 'RESTORED';
  const isWarning = status === 'WARNING' || (!isSafe && !isRestored);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/80 via-red-950/70 to-orange-950/80 border border-rose-800/40 p-6 md:p-8 shadow-2xl shadow-rose-950/40 backdrop-blur-xl transition-all duration-300 group hover:border-rose-600/60 flex flex-col justify-between">
      
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        
        {/* Top bar with Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
              Liquidity Guard Status
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
              Demo Control Center
            </h2>
          </div>

          {/* Dynamic Status Badge */}
          <div className="self-start sm:self-auto">
            {isSafe && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-xs font-bold shadow-lg shadow-emerald-950/50 glow-emerald">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                STATUS: LIQUIDITY SAFE
              </div>
            )}
            {isWarning && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-500/60 text-xs font-bold shadow-lg shadow-rose-950/60 glow-rose animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                {statusMessage || 'WARNING: SHORTFALL IN 6 DAYS'}
              </div>
            )}
            {isRestored && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 text-emerald-200 border border-emerald-400/50 text-xs font-bold shadow-lg shadow-emerald-950/50 glow-emerald">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                BUFFER RESTORED (PROTECTED)
              </div>
            )}
          </div>
        </div>

        {/* Liquid Active Balance Display */}
        <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800/80 mb-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium">Total Active Liquid Balance</span>
            <span className="text-[11px] font-mono text-stone-400">Live Bank API Feed</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
              ₹{liquidBalance.toLocaleString('en-IN')}
            </span>
            {expenseShockAmount > 0 && (
              <span className="text-xs font-semibold text-rose-400 font-mono px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-800/60">
                -₹{expenseShockAmount.toLocaleString('en-IN')} Shock Applied
              </span>
            )}
          </div>
        </div>

        {/* Simulation Buttons Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Live Demo Injection Triggers
            </p>
            <span className="text-[10px] text-rose-300/80 font-mono">Interactive Sandbox</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Inject Income Delay Button */}
            <button
              onClick={onInjectDelay}
              className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all duration-200 border ${
                incomeDelayDays > 0
                  ? 'bg-gradient-to-r from-amber-950 to-stone-900 text-amber-300 border-amber-500/60 shadow-md shadow-amber-950/50'
                  : 'bg-stone-900/80 hover:bg-stone-800/90 text-stone-200 border-stone-700/60 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${incomeDelayDays > 0 ? 'text-amber-400 animate-spin' : 'text-amber-400'}`} />
                <span className="text-left leading-tight">
                  + Inject Stipend Delay
                  <span className="block text-[10px] text-stone-400 font-normal">5 Days Delay</span>
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono ${
                incomeDelayDays > 0 ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-400'
              }`}>
                {incomeDelayDays > 0 ? 'ACTIVE (+5d)' : 'INJECT'}
              </span>
            </button>

            {/* Add Expense Shock Button */}
            <button
              onClick={onInjectShock}
              className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all duration-200 border ${
                expenseShockAmount > 0
                  ? 'bg-gradient-to-r from-rose-950 to-stone-900 text-rose-300 border-rose-500/60 shadow-md shadow-rose-950/50'
                  : 'bg-stone-900/80 hover:bg-stone-800/90 text-stone-200 border-stone-700/60 hover:border-rose-500/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span className="text-left leading-tight">
                  - Add Expense Shock
                  <span className="block text-[10px] text-stone-400 font-normal">Emergency ₹3,500</span>
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono ${
                expenseShockAmount > 0 ? 'bg-rose-500 text-white font-bold' : 'bg-stone-800 text-stone-400'
              }`}>
                {expenseShockAmount > 0 ? 'ACTIVE (-₹3.5k)' : 'INJECT'}
              </span>
            </button>

            {/* Re-calculate Safe-to-Spend */}
            <button
              onClick={onRecalculate}
              disabled={isRecalculating}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700/60 hover:border-stone-600 text-xs font-semibold transition-all duration-200 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>{isRecalculating ? 'Calculating...' : 'Re-calculate Safe-to-Spend'}</span>
            </button>

            {/* Reset Demo State Button */}
            <button
              onClick={onResetDemo}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 hover:border-rose-600/60 text-xs font-semibold transition-all duration-200 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Demo to Baseline</span>
            </button>
          </div>
        </div>

      </div>

      {/* Controller footnote */}
      <div className="mt-4 pt-3 border-t border-rose-900/40 flex items-center justify-between text-[11px] text-stone-400 relative z-10">
        <span>Autonomous Guardian: <strong className="text-rose-300">Active</strong></span>
        <span className="font-mono text-[10px] text-amber-300/80">State Engine v2.4</span>
      </div>

    </div>
  );
}
