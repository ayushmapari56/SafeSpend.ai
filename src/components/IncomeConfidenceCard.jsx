import React from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function IncomeConfidenceCard({ incomes, incomeDelayDays }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-stone-900/80 border border-stone-800 p-6 md:p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-stone-700 flex flex-col justify-between">
      <div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
              <Target className="w-3.5 h-3.5" />
              Income Reliability (P<sub>recv</sub>)
            </div>
            <h3 className="text-base font-bold text-white tracking-tight font-['Outfit'] mt-0.5">
              Cash Inflow Confidence
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-400 block">Horizon</span>
            <span className="text-xs font-bold font-mono text-emerald-400">14 Days</span>
          </div>
        </div>

        {/* List of Incomes with Confidence Bars */}
        <div className="space-y-3.5">
          {incomes.map((item) => {
            const isDelayed = item.isPrimary && incomeDelayDays > 0;
            const confidenceScore = isDelayed ? item.delayConfidence : item.baseConfidence;
            const arrivalText = isDelayed ? `Oct ${3 + incomeDelayDays} (Delayed)` : item.expectedDate;

            return (
              <div key={item.id} className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-200">{item.name}</span>
                    {isDelayed ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800/60 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5 text-rose-400" /> High Delay
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-semibold">
                        On Time
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-stone-100">₹{item.amount.toLocaleString('en-IN')}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      confidenceScore < 70
                        ? 'bg-gradient-to-r from-rose-500 to-red-600'
                        : confidenceScore < 85
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>Expected: {arrivalText}</span>
                  <span className="font-mono font-semibold text-stone-300">
                    Confidence: <strong className={confidenceScore < 70 ? 'text-rose-400' : 'text-emerald-400'}>{confidenceScore}%</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-stone-800 text-[10px] text-stone-400 flex items-center justify-between">
        <span>Markov delay forecasting model</span>
        <span className="text-amber-400 font-mono">Real-time P(recv)</span>
      </div>

    </div>
  );
}
