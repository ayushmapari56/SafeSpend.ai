import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Percent, 
  AlertTriangle,
  Layers,
  Trash2,
  CheckCircle2
} from 'lucide-react';

const QUICK_PRESETS = [
  { name: 'Judge ₹7,500 Surprise Bill', type: 'EXPENSE', amount: 7500, day: 4, label: 'Judge Bill (₹7.5k)' },
  { name: 'Emergency Laptop Repair', type: 'EXPENSE', amount: 4200, day: 3, label: 'Laptop Fix (₹4.2k)' },
  { name: 'Freelance Bonus Milestone', type: 'INCOME', amount: 9000, day: 5, probability: 0.85, label: 'Freelance (₹9k)' },
  { name: 'Govt Research Grant', type: 'INCOME', amount: 15000, day: 7, probability: 0.95, label: 'Grant (₹15k)' },
  { name: 'Sudden Medical Expense', type: 'EXPENSE', amount: 5500, day: 2, label: 'Medical (₹5.5k)' },
];

export default function CustomSandboxModal({
  isOpen,
  onClose,
  onInjectCustomEvent,
  customEvents = [],
  onClearCustomEvents
}) {
  const [type, setType] = useState('EXPENSE');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState(4);
  const [probability, setProbability] = useState(1.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePresetSelect = (preset) => {
    setType(preset.type);
    setName(preset.name);
    setAmount(preset.amount.toString());
    setDay(preset.day);
    if (preset.probability !== undefined) {
      setProbability(preset.probability);
    } else {
      setProbability(1.0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const eventName = name.trim() || (type === 'INCOME' ? 'Custom Live Income' : 'Custom Live Expense');

    setIsSubmitting(true);
    try {
      await onInjectCustomEvent({
        name: eventName,
        amount: parsedAmount,
        type: type,
        day: parseInt(day, 10) || 3,
        probability: type === 'INCOME' ? parseFloat(probability) : 1.0
      });
      setName('');
      setAmount('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isIncome = type === 'INCOME';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#163701] to-[#255503] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A3F574]/20 border border-[#A3F574]/40 text-[#A3F574] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            Live Judge Sandbox
          </div>
          
          <h2 className="text-xl font-bold font-sora">
            Feed Custom Transaction Event
          </h2>
          <p className="text-xs text-white/80 font-sans mt-0.5">
            Test the live mathematical engine & dynamic agent workflow with real-time custom numbers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Preset Quick Chips */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-mono flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              1-Click Judge Scenario Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handlePresetSelect(p)}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-orange-50 hover:text-orange-800 hover:border-orange-300 border border-stone-200 text-stone-700 transition-all active:scale-95"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Type Segmented Toggle */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-mono block mb-2">
              Transaction Flow Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('EXPENSE')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                  !isIncome
                    ? 'bg-orange-50 border-orange-400 text-orange-900 shadow-sm ring-2 ring-orange-400/20'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <TrendingDown className={`w-4 h-4 ${!isIncome ? 'text-orange-600' : 'text-stone-400'}`} />
                <span>Expense / Sudden Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setType('INCOME')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                  isIncome
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm ring-2 ring-emerald-400/20'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <TrendingUp className={`w-4 h-4 ${isIncome ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span>Income / Custom Inflow</span>
              </button>
            </div>
          </div>

          {/* Transaction Name & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono block mb-1.5">
                Event / Item Name
              </label>
              <input
                type="text"
                placeholder={isIncome ? "e.g. Freelance Client Fee" : "e.g. ₹7,500 Surprise Hospital Bill"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-xs font-medium text-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono block mb-1.5">
                Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="7500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-xs font-bold text-stone-900 bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Schedule Day & Confidence (for income) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  Day in 14-Day Cycle
                </label>
                <span className="text-xs font-bold font-mono text-orange-600 px-2 py-0.5 rounded bg-orange-50 border border-orange-200">
                  Day {day} (in {day}d)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                step="1"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>Day 1 (Tomorrow)</span>
                <span>Day 7</span>
                <span>Day 14</span>
              </div>
            </div>

            {isIncome ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-emerald-600" />
                    Arrival Confidence P(recv)
                  </label>
                  <span className="text-xs font-bold font-mono text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    {Math.round(probability * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                  <span>10% (High Uncertainty)</span>
                  <span>100% (Guaranteed)</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center p-3 rounded-xl bg-orange-50/60 border border-orange-200/80">
                <span className="text-[11px] font-bold text-orange-900 flex items-center gap-1 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                  Immediate Stress Test
                </span>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-tight">
                  Evaluates if buffer breaches under unexpected sudden liabilities.
                </p>
              </div>
            )}
          </div>

          {/* Injected Custom Events List (if any) */}
          {customEvents.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-stone-500" />
                  Active Custom Events ({customEvents.length})
                </span>
                {onClearCustomEvents && (
                  <button
                    type="button"
                    onClick={onClearCustomEvents}
                    className="text-[10px] font-bold text-red-600 hover:text-red-700 font-mono flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {customEvents.map((evt, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white border border-stone-200">
                    <span className="font-medium text-stone-800">{evt.name}</span>
                    <span className={`font-mono font-bold ${evt.type === 'INCOME' ? 'text-emerald-700' : 'text-orange-700'}`}>
                      {evt.type === 'INCOME' ? '+' : '-'}₹{evt.amount.toLocaleString('en-IN')} (Day {evt.day})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50 active:scale-95 font-sans"
            >
              <Zap className="w-4 h-4" />
              <span>{isSubmitting ? 'Injecting into Engine...' : '⚡ Inject Live Custom Event'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
