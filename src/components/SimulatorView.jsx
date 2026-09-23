import React from 'react';
import { SlidersHorizontal, Play, RotateCcw, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function SimulatorView({
  incomeDelayDays,
  setIncomeDelayDays,
  expenseShockAmount,
  setExpenseShockAmount,
  safetyBuffer,
  setSafetyBuffer,
  onResetDemo,
  onTriggerScenario
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
            <SlidersHorizontal className="w-4 h-4 text-rose-400" />
            Interactive Sandbox
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-['Outfit'] mt-1">
            Scenario Simulator & Stress Testing
          </h1>
          <p className="text-xs text-stone-400">Simulate custom financial shocks, cashflow friction, and evaluate AI resilience</p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          Reset Parameters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Slider 1: Stipend Delay */}
        <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white font-['Outfit']">Stipend / Income Delay</h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/50">
              +{incomeDelayDays} Days
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={incomeDelayDays}
            onChange={(e) => setIncomeDelayDays(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500 mt-2">
            <span>0 Days (On Time)</span>
            <span>5 Days</span>
            <span>10 Days (Critical)</span>
          </div>
          <p className="text-xs text-stone-400 mt-4 leading-relaxed">
            Delays the expected ₹12,000 credit from Oct 3 forward into the cashflow cycle.
          </p>
        </div>

        {/* Slider 2: Expense Shock */}
        <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white font-['Outfit']">Sudden Expense Shock</h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
              ₹{expenseShockAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="8000"
            step="500"
            value={expenseShockAmount}
            onChange={(e) => setExpenseShockAmount(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500 mt-2">
            <span>₹0</span>
            <span>₹3,500</span>
            <span>₹8,000</span>
          </div>
          <p className="text-xs text-stone-400 mt-4 leading-relaxed">
            Simulates instant emergency debits (e.g. medical emergency, bike repairs).
          </p>
        </div>

        {/* Slider 3: Safety Buffer */}
        <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white font-['Outfit']">Guarded Safety Buffer</h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
              ₹{safetyBuffer.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="5000"
            step="500"
            value={safetyBuffer}
            onChange={(e) => setSafetyBuffer(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500 mt-2">
            <span>₹1,000</span>
            <span>₹2,000 (Default)</span>
            <span>₹5,000</span>
          </div>
          <p className="text-xs text-stone-400 mt-4 leading-relaxed">
            Non-touch threshold that triggers automated defensive interventions when breached.
          </p>
        </div>

      </div>

      {/* Preset Live Demo Scenarios for Presentation */}
      <div className="mt-8 p-6 rounded-3xl bg-stone-900/60 border border-stone-800">
        <h3 className="text-base font-bold text-white font-['Outfit'] mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Quick 1-Click Judge Demonstration Scenarios
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onTriggerScenario('scenario1')}
            className="p-4 rounded-2xl bg-stone-950/80 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-amber-400 mb-1 group-hover:translate-x-0.5 transition-transform">Scenario 1: 5-Day Stipend Delay</div>
            <p className="text-xs text-stone-400">Simulates delayed university stipend; tests automatic daily safe-to-spend drop.</p>
          </button>

          <button
            onClick={() => onTriggerScenario('scenario2')}
            className="p-4 rounded-2xl bg-stone-950/80 hover:bg-stone-900 border border-stone-800 hover:border-rose-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-rose-400 mb-1 group-hover:translate-x-0.5 transition-transform">Scenario 2: Double Shock Collision</div>
            <p className="text-xs text-stone-400">Injects 5-day stipend delay + ₹3,500 emergency debit simultaneously.</p>
          </button>

          <button
            onClick={() => onTriggerScenario('scenario3')}
            className="p-4 rounded-2xl bg-stone-950/80 hover:bg-stone-900 border border-stone-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-emerald-400 mb-1 group-hover:translate-x-0.5 transition-transform">Scenario 3: Autonomous Defense Active</div>
            <p className="text-xs text-stone-400">Applies OTT auto-debit deferral and split rent to demonstrate full recovery.</p>
          </button>
        </div>
      </div>

    </div>
  );
}
