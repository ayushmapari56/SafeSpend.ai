import React from 'react';
import { CalendarClock } from 'lucide-react';

export default function CommitmentsCard({ commitments, isOttPaused, splitPaymentActive }) {
  const totalCommitted = commitments.reduce((acc, curr) => {
    if (curr.id === 'c4' && isOttPaused) return acc;
    if (curr.id === 'c1' && splitPaymentActive) return acc + 4000;
    return acc + curr.amount;
  }, 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-orange-100/90 p-6 md:p-7 shadow-luxury backdrop-blur-xl transition-all duration-300 hover:shadow-luxury-hover hover:border-orange-200 flex flex-col justify-between">
      <div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 font-mono">
              <CalendarClock className="w-3.5 h-3.5" />
              Fixed Liabilities (E<sub>committed</sub>)
            </div>
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight font-sora mt-0.5">
              Upcoming Commitments
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block font-mono">Total Due (14d)</span>
            <span className="text-base font-bold font-space text-stone-900">₹{totalCommitted.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* List of commitments */}
        <div className="space-y-2.5">
          {commitments.map((item) => {
            const isPaused = item.id === 'c4' && isOttPaused;
            const isSplit = item.id === 'c1' && splitPaymentActive;
            const displayAmount = isSplit ? 4000 : item.amount;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  isPaused
                    ? 'bg-stone-50 border-stone-200 opacity-60'
                    : isSplit
                    ? 'bg-orange-50/60 border-orange-200'
                    : 'bg-stone-50/60 border-stone-200 hover:border-orange-200 hover:bg-orange-50/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    isPaused ? 'bg-stone-400' : isSplit ? 'bg-orange-500' : 'bg-orange-500'
                  }`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${isPaused ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                        {item.name}
                      </span>
                      {isPaused && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold font-mono">
                          Paused
                        </span>
                      )}
                      {isSplit && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-300 font-bold font-mono">
                          Split (Part 1/2)
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-500 font-sans">
                      Due: {item.dueDate} • {item.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold font-space block ${isPaused ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
                    ₹{displayAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-stone-500 font-sans">
                    {item.autoDebit ? 'Auto-debit' : 'Manual'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-stone-500 flex items-center justify-between font-sans">
        <span>Autonomous payment escrow active</span>
        <span className="text-emerald-600 font-mono font-bold">100% On-Time Target</span>
      </div>

    </div>
  );
}
