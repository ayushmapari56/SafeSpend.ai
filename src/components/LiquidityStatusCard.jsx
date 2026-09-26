import React from 'react';
import { ShieldCheck, AlertCircle, Clock, Zap, RefreshCw, Flame } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-3xl bg-white border border-orange-100/90 p-6 md:p-8 shadow-luxury backdrop-blur-xl transition-all duration-300 group hover:shadow-luxury-hover hover:border-orange-200 flex flex-col justify-between">
      
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        
        {/* Top bar with Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              Liquidity Guard Status
            </span>
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight font-sora">
              Demo Control Center
            </h2>
          </div>

          {/* Dynamic Status Badge */}
          <div className="self-start sm:self-auto">
            {isSafe && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold shadow-sm font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                STATUS: LIQUIDITY SAFE
              </div>
            )}
            {isWarning && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300 text-xs font-bold shadow-sm animate-pulse font-mono">
                <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                {statusMessage || 'WARNING: SHORTFALL IN 6 DAYS'}
              </div>
            )}
            {isRestored && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold shadow-sm font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                BUFFER RESTORED (PROTECTED)
              </div>
            )}
          </div>
        </div>

        {/* Liquid Active Balance Display */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-50/70 to-amber-50/50 border border-orange-100/80 mb-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider font-mono">Total Active Liquid Balance</span>
            <span className="text-[11px] font-mono text-stone-500">Live Bank Feed</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-sora">
              ₹{liquidBalance.toLocaleString('en-IN')}
            </span>
            {expenseShockAmount > 0 && (
              <span className="text-xs font-bold text-orange-700 font-mono px-2.5 py-0.5 rounded-md bg-orange-100 border border-orange-300">
                -₹{expenseShockAmount.toLocaleString('en-IN')} Shock Applied
              </span>
            )}
          </div>
        </div>

        {/* Simulation Buttons Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              Live Demo Injection Triggers
            </p>
            <span className="text-[10px] text-orange-600 font-mono font-semibold">Interactive Sandbox</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Inject Income Delay Button */}
            <button
              onClick={onInjectDelay}
              className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all duration-200 border ${
                incomeDelayDays > 0
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-stone-50 hover:bg-orange-50/80 text-stone-700 border-stone-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-left leading-tight">
                  + Inject Stipend Delay
                  <span className="block text-[10px] text-stone-500 font-normal">5 Days Delay</span>
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                incomeDelayDays > 0 ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                {incomeDelayDays > 0 ? 'ACTIVE (+5d)' : 'INJECT'}
              </span>
            </button>

            {/* Add Expense Shock Button */}
            <button
              onClick={onInjectShock}
              className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all duration-200 border ${
                expenseShockAmount > 0
                  ? 'bg-orange-100 text-orange-900 border-orange-300 shadow-sm'
                  : 'bg-stone-50 hover:bg-orange-50/80 text-stone-700 border-stone-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-left leading-tight">
                  - Add Expense Shock
                  <span className="block text-[10px] text-stone-500 font-normal">Emergency ₹3,500</span>
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                expenseShockAmount > 0 ? 'bg-orange-600 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                {expenseShockAmount > 0 ? 'ACTIVE (-₹3.5k)' : 'INJECT'}
              </span>
            </button>

            {/* Re-calculate Safe-to-Spend */}
            <button
              onClick={onRecalculate}
              disabled={isRecalculating}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-bold transition-all duration-200 active:scale-95 font-sans"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-orange-500 ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>{isRecalculating ? 'Calculating...' : 'Re-calculate Safe-to-Spend'}</span>
            </button>

            {/* Reset Demo State Button */}
            <button
              onClick={onResetDemo}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition-all duration-200 active:scale-95 font-sans"
            >
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span>Reset Demo to Baseline</span>
            </button>
          </div>
        </div>

      </div>

      {/* Controller footnote */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 relative z-10 font-sans">
        <span>Autonomous Guardian: <strong className="text-orange-600">Active</strong></span>
        <span className="font-mono text-[10px] text-stone-500">State Engine v2.4</span>
      </div>

    </div>
  );
}
