import React from 'react';
import { CalendarClock, CheckCircle, PauseCircle, AlertCircle } from 'lucide-react';

export default function CommitmentsCard({ commitments, isOttPaused, splitPaymentActive }) {
  const totalCommitted = commitments.reduce((acc, curr) => {
    if (curr.id === 'c4' && isOttPaused) return acc;
    if (curr.id === 'c1' && splitPaymentActive) return acc + 4000;
    return acc + curr.amount;
  }, 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-stone-900/80 border border-stone-800 p-6 md:p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-stone-700 flex flex-col justify-between">
      <div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
              <CalendarClock className="w-3.5 h-3.5" />
              Fixed Liabilities (E<sub>committed</sub>)
            </div>
            <h3 className="text-base font-bold text-white tracking-tight font-['Outfit'] mt-0.5">
              Upcoming Commitments
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-400 block">Total Due (14d)</span>
            <span className="text-sm font-bold font-mono text-white">₹{totalCommitted.toLocaleString('en-IN')}</span>
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
                    ? 'bg-stone-950/40 border-stone-800/60 opacity-60'
                    : isSplit
                    ? 'bg-blue-950/20 border-blue-800/40'
                    : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${
                    isPaused ? 'bg-stone-600' : isSplit ? 'bg-blue-400' : 'bg-rose-500'
                  }`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-semibold ${isPaused ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                        {item.name}
                      </span>
                      {isPaused && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50 font-semibold">
                          Paused
                        </span>
                      )}
                      {isSplit && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50 font-semibold">
                          Split (Part 1/2)
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400">
                      Due: {item.dueDate} • {item.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold font-mono block ${isPaused ? 'text-stone-500 line-through' : 'text-stone-100'}`}>
                    ₹{displayAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-stone-400">
                    {item.autoDebit ? 'Auto-debit' : 'Manual'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-stone-800 text-[10px] text-stone-400 flex items-center justify-between">
        <span>Autonomous payment escrow ready</span>
        <span className="text-emerald-400 font-mono">100% On-Time Target</span>
      </div>

    </div>
  );
}
