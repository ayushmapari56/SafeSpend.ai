import React from 'react';
import { SlidersHorizontal, RotateCcw, Zap } from 'lucide-react';

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
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 font-mono">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            Interactive Sandbox
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight font-sora mt-1">
            Scenario Simulator & Stress Testing
          </h1>
          <p className="text-xs text-stone-500 font-sans">Simulate custom financial shocks, cashflow friction, and evaluate AI resilience</p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-orange-50 text-stone-700 hover:text-orange-700 border border-stone-200 text-xs font-bold self-start sm:self-auto transition-colors shadow-sm font-sans"
        >
          <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
          Reset Parameters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Slider 1: Stipend Delay */}
        <div className="p-6 rounded-3xl bg-white border border-orange-100 shadow-luxury">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900 font-sora">Stipend / Income Delay</h3>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
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
            className="w-full accent-orange-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-mono">
            <span>0 Days (On Time)</span>
            <span>5 Days</span>
            <span>10 Days (Critical)</span>
          </div>
          <p className="text-xs text-stone-500 mt-4 leading-relaxed font-sans">
            Delays the expected ₹12,000 credit from Oct 3 forward into the cashflow cycle.
          </p>
        </div>

        {/* Slider 2: Expense Shock */}
        <div className="p-6 rounded-3xl bg-white border border-orange-100 shadow-luxury">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900 font-sora">Sudden Expense Shock</h3>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-300">
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
            className="w-full accent-orange-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-mono">
            <span>₹0</span>
            <span>₹3,500</span>
            <span>₹8,000</span>
          </div>
          <p className="text-xs text-stone-500 mt-4 leading-relaxed font-sans">
            Simulates instant emergency debits (e.g. medical emergency, bike repairs).
          </p>
        </div>

        {/* Slider 3: Safety Buffer */}
        <div className="p-6 rounded-3xl bg-white border border-orange-100 shadow-luxury">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900 font-sora">Guarded Safety Buffer</h3>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200">
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
            className="w-full accent-orange-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-mono">
            <span>₹1,000</span>
            <span>₹2,000 (Default)</span>
            <span>₹5,000</span>
          </div>
          <p className="text-xs text-stone-500 mt-4 leading-relaxed font-sans">
            Non-touch threshold that triggers automated defensive interventions when breached.
          </p>
        </div>

      </div>

      {/* Preset Live Demo Scenarios for Presentation */}
      <div className="mt-8 p-6 rounded-3xl bg-white border border-orange-100 shadow-luxury">
        <h3 className="text-base font-extrabold text-stone-900 font-sora mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          Quick 1-Click Judge Demonstration Scenarios
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onTriggerScenario('scenario1')}
            className="p-4 rounded-2xl bg-orange-50/60 hover:bg-orange-100/70 border border-orange-200 text-left transition-all group shadow-sm"
          >
            <div className="text-xs font-bold text-orange-800 mb-1 group-hover:translate-x-0.5 transition-transform font-sora">Scenario 1: 5-Day Stipend Delay</div>
            <p className="text-xs text-stone-600 font-sans">Simulates delayed university stipend; tests automatic daily safe-to-spend drop.</p>
          </button>

          <button
            onClick={() => onTriggerScenario('scenario2')}
            className="p-4 rounded-2xl bg-orange-50/60 hover:bg-orange-100/70 border border-orange-200 text-left transition-all group shadow-sm"
          >
            <div className="text-xs font-bold text-orange-900 mb-1 group-hover:translate-x-0.5 transition-transform font-sora">Scenario 2: Double Shock Collision</div>
            <p className="text-xs text-stone-600 font-sans">Injects 5-day stipend delay + ₹3,500 emergency debit simultaneously.</p>
          </button>

          <button
            onClick={() => onTriggerScenario('scenario3')}
            className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 text-left transition-all group shadow-sm"
          >
            <div className="text-xs font-bold text-emerald-800 mb-1 group-hover:translate-x-0.5 transition-transform font-sora">Scenario 3: Autonomous Defense Active</div>
            <p className="text-xs text-stone-600 font-sans">Applies OTT auto-debit deferral and split rent to demonstrate full recovery.</p>
          </button>
        </div>
      </div>

    </div>
  );
}
