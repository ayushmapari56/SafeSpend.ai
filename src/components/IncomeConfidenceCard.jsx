import React from 'react';
import { Target, AlertCircle } from 'lucide-react';

export default function IncomeConfidenceCard({ incomes, incomeDelayDays }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-orange-100/90 p-6 md:p-7 shadow-luxury backdrop-blur-xl transition-all duration-300 hover:shadow-luxury-hover hover:border-orange-200 flex flex-col justify-between">
      <div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 font-mono">
              <Target className="w-3.5 h-3.5" />
              Income Reliability (P<sub>recv</sub>)
            </div>
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight font-sora mt-0.5">
              Cash Inflow Confidence
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block font-mono">Horizon</span>
            <span className="text-xs font-bold font-space text-emerald-700">14 Days</span>
          </div>
        </div>

        {/* List of Incomes with Confidence Bars */}
        <div className="space-y-3.5">
          {incomes.map((item) => {
            const isDelayed = item.isPrimary && incomeDelayDays > 0;
            const confidenceScore = isDelayed ? item.delayConfidence : item.baseConfidence;
            const arrivalText = isDelayed ? `Oct ${3 + incomeDelayDays} (Delayed)` : item.expectedDate;

            return (
              <div key={item.id} className="p-3 rounded-2xl bg-stone-50/70 border border-stone-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-800 font-sans">{item.name}</span>
                    {isDelayed ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-300 font-bold flex items-center gap-1 font-mono">
                        <AlertCircle className="w-2.5 h-2.5 text-orange-600" /> High Delay
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-mono">
                        On Time
                      </span>
                    )}
                  </div>
                  <span className="font-space font-bold text-stone-900">₹{item.amount.toLocaleString('en-IN')}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      confidenceScore < 70
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                        : confidenceScore < 85
                        ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-500 font-sans">
                  <span>Expected: {arrivalText}</span>
                  <span className="font-mono font-semibold text-stone-700">
                    Confidence: <strong className={confidenceScore < 70 ? 'text-orange-600' : 'text-emerald-600'}>{confidenceScore}%</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-stone-500 flex items-center justify-between font-sans">
        <span>Markov delay forecasting model</span>
        <span className="text-orange-600 font-mono font-semibold">Real-time P(recv)</span>
      </div>

    </div>
  );
}
