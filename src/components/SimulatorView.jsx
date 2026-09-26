import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Percent, 
  Layers, 
  Trash2 
} from 'lucide-react';

const QUICK_PRESETS = [
  { name: 'Judge ₹7,500 Surprise Bill', type: 'EXPENSE', amount: 7500, day: 4, label: 'Judge ₹7.5k Shock' },
  { name: 'Emergency Bike & Laptop Repair', type: 'EXPENSE', amount: 4500, day: 3, label: 'Laptop Fix (₹4.5k)' },
  { name: 'Freelance Client Payout', type: 'INCOME', amount: 8500, day: 5, probability: 0.85, label: 'Freelance (₹8.5k)' },
  { name: 'Scholarship Grant', type: 'INCOME', amount: 14000, day: 7, probability: 0.95, label: 'Scholarship (₹14k)' },
];

export default function SimulatorView({
  incomeDelayDays,
  setIncomeDelayDays,
  expenseShockAmount,
  setExpenseShockAmount,
  safetyBuffer,
  setSafetyBuffer,
  onResetDemo,
  onTriggerScenario,
  onInjectCustomEvent,
  customEvents = [],
  onClearCustomEvents
}) {
  const [customType, setCustomType] = useState('EXPENSE');
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customDay, setCustomDay] = useState(4);
  const [customProb, setCustomProb] = useState(1.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseFloat(customAmount);
    if (isNaN(parsed) || parsed <= 0) return;

    const eventName = customName.trim() || (customType === 'INCOME' ? 'Live Income Credit' : 'Live Surprise Expense');

    setIsSubmitting(true);
    try {
      if (onInjectCustomEvent) {
        await onInjectCustomEvent({
          name: eventName,
          amount: parsed,
          type: customType,
          day: parseInt(customDay, 10) || 3,
          probability: customType === 'INCOME' ? parseFloat(customProb) : 1.0
        });
      }
      setCustomName('');
      setCustomAmount('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreset = (p) => {
    setCustomType(p.type);
    setCustomName(p.name);
    setCustomAmount(p.amount.toString());
    setCustomDay(p.day);
    if (p.probability !== undefined) setCustomProb(p.probability);
    else setCustomProb(1.0);
  };

  const isIncome = customType === 'INCOME';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 font-mono">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            Interactive Sandbox & Live Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-sora mt-1">
            Scenario Simulator & Judge Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans">
            Feed any custom live transaction into the dynamic formula engine or stress-test with parameters.
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-orange-50 text-stone-700 hover:text-orange-700 border border-stone-200 text-xs font-bold self-start sm:self-auto transition-colors shadow-sm font-sans"
        >
          <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
          Reset All to Baseline
        </button>
      </div>

      {/* SECTION 1: LIVE CUSTOM TRANSACTION FEEDER (JUDGE SPOTLIGHT) */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border-2 border-[#163701]/20 shadow-luxury relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#A3F574]/20 to-orange-100/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#163701] text-[#A3F574] text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Live Dynamic Feed
              </div>
              <h2 className="text-xl font-bold font-sora text-stone-900">
                Feed Judge / Custom Transaction Event
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              Direct API Integration: <code className="text-orange-600 font-bold">POST /api/custom-event</code>
            </span>
          </div>

          {/* Quick Preset Chips */}
          <div className="mb-5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-mono flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              Quick Judge Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handlePreset(p)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-50 hover:bg-orange-50 hover:text-orange-900 hover:border-orange-300 border border-stone-200 text-stone-700 transition-all active:scale-95"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Type selector */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono block mb-1.5">
                  Flow Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomType('EXPENSE')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      !isIncome 
                        ? 'bg-orange-50 border-orange-400 text-orange-900 shadow-sm' 
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    <TrendingDown className={`w-3.5 h-3.5 ${!isIncome ? 'text-orange-600' : 'text-stone-400'}`} />
                    Debit
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomType('INCOME')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isIncome 
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm' 
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    <TrendingUp className={`w-3.5 h-3.5 ${isIncome ? 'text-emerald-600' : 'text-stone-400'}`} />
                    Credit
                  </button>
                </div>
              </div>

              {/* Event Name */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono block mb-1.5">
                  Description / Reason
                </label>
                <input
                  type="text"
                  placeholder={isIncome ? "e.g. Freelance Client Payout" : "e.g. ₹7,500 Unexpected Bill"}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500/30 text-xs font-medium text-stone-900 bg-white"
                />
              </div>

              {/* Amount (₹) */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono block mb-1.5">
                  Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="7500"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500/30 text-xs font-bold font-mono text-stone-900 bg-white"
                  />
                </div>
              </div>

              {/* Day in Horizon */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    Target Day
                  </label>
                  <span className="text-xs font-mono font-bold text-orange-600">Day {customDay}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={customDay}
                  onChange={(e) => setCustomDay(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

            </div>

            {/* Income confidence row (if income) */}
            {isIncome && (
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-900 font-medium">
                  <Percent className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Probability Weighting P(recv): <strong>{Math.round(customProb * 100)}%</strong> confidence</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={customProb}
                  onChange={(e) => setCustomProb(Number(e.target.value))}
                  className="w-full sm:w-48 accent-emerald-600 cursor-pointer"
                />
              </div>
            )}

            {/* Submit & Injected Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="text-xs text-stone-500 font-sans">
                {customEvents.length > 0 ? (
                  <span className="text-orange-700 font-bold font-mono">
                    ⚡ {customEvents.length} custom event(s) actively modifying the live 14-day projection curve.
                  </span>
                ) : (
                  <span>Ready to inject live transactions directly into the LangGraph & Formula state.</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {customEvents.length > 0 && onClearCustomEvents && (
                  <button
                    type="button"
                    onClick={onClearCustomEvents}
                    className="px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Injected ({customEvents.length})
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !customAmount}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2 font-sans"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing in Agent...' : '⚡ Inject Custom Event Live'}</span>
                </button>
              </div>
            </div>

          </form>

          {/* List of active custom injected transactions */}
          {customEvents.length > 0 && (
            <div className="mt-5 pt-4 border-t border-stone-200">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700 font-mono uppercase mb-2">
                <Layers className="w-3.5 h-3.5 text-orange-500" />
                Active Custom Injected Events ({customEvents.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {customEvents.map((evt, i) => (
                  <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-stone-900">{evt.name}</span>
                      <span className="text-[10px] text-stone-500 font-mono">Day {evt.day} ({evt.type})</span>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      evt.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {evt.type === 'INCOME' ? '+' : '-'}₹{evt.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* SECTION 2: SLIDERS & PARAMETER STRESS TESTING */}
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
      <div className="p-6 rounded-3xl bg-white border border-orange-100 shadow-luxury">
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

