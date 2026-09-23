import React from 'react';
import { Bot, ShieldAlert, Sparkles, CheckCircle2, Split, XCircle, ArrowRight, AlertTriangle, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExplainabilityCard({
  status,
  incomeDelayDays,
  expenseShockAmount,
  isOttPaused,
  splitPaymentActive,
  actionRejected,
  safeToSpendDaily,
  onApproveAction,
  onOpenSplitModal,
  onRejectAction,
}) {
  const isWarning = status === 'WARNING' || incomeDelayDays > 0 || expenseShockAmount > 0;
  const isRestored = isOttPaused || splitPaymentActive;

  const handleApproveWithConfetti = () => {
    // Trigger celebratory burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#10b981', '#34d399', '#f43f5e', '#fbbf24']
    });
    onApproveAction();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-stone-900/80 border border-stone-800 p-6 md:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-stone-700">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-500 shadow-md shadow-rose-950/50 border border-rose-400/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                AI Guardian Insight & Active Interventions
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 font-semibold">
                HITL Engine
              </span>
            </div>
            <p className="text-xs text-stone-400">Plain-Language Reasoning & Human-in-the-Loop Safeguards</p>
          </div>
        </div>

        <div className="text-xs font-mono text-stone-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Explainability Protocol: Active
        </div>
      </div>

      {/* Plain Language Explainability Callout Box */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 mb-6 backdrop-blur-md ${
        isWarning && !isRestored
          ? 'bg-rose-950/30 border-rose-700/60 text-rose-200'
          : isRestored
          ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-200'
          : 'bg-stone-900/60 border-stone-800 text-stone-200'
      }`}>
        <div className="flex items-start gap-3">
          {isWarning && !isRestored ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : isRestored ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              {isWarning && !isRestored ? 'Why Did Safe-to-Spend Drop?' : isRestored ? 'Intervention Impact Assessment' : 'Real-time Autonomous Reasoning'}
            </h4>
            
            <p className="text-sm leading-relaxed text-stone-200 font-sans">
              {isWarning && !isRestored ? (
                <>
                  <strong className="text-rose-400 font-semibold">Shortfall Alert: </strong>
                  Safe-to-Spend limit dropped to <span className="font-mono font-bold text-rose-300">₹{safeToSpendDaily}/day</span> because{' '}
                  {incomeDelayDays > 0 && <span>college stipend is delayed by <strong>{incomeDelayDays} days</strong></span>}
                  {incomeDelayDays > 0 && expenseShockAmount > 0 && <span> and </span>}
                  {expenseShockAmount > 0 && <span>an unexpected emergency debit of <strong>₹{expenseShockAmount.toLocaleString('en-IN')}</strong> was injected</span>}.
                  {' '}Without defensive action, cash balance will breach the ₹2,000 non-touch buffer on Day 6.
                </>
              ) : isRestored ? (
                <>
                  <strong className="text-emerald-400 font-semibold">Safety Buffer Restored: </strong>
                  {isOttPaused && 'Auto-debit for OTT & subscriptions has been safely deferred to next billing cycle (+₹1,499 liquidity). '}
                  {splitPaymentActive && 'Apartment Rent is split into two installments of ₹4,000 each (+₹4,000 liquidity buffer). '}
                  Safe-to-Spend is stabilized at <span className="font-mono font-bold text-emerald-300">₹{safeToSpendDaily}/day</span>.
                </>
              ) : (
                <>
                  <strong className="text-emerald-400 font-semibold">Optimal Liquidity: </strong>
                  Safe-to-Spend is stable at <span className="font-mono font-bold text-emerald-300">₹{safeToSpendDaily}/day</span>.
                  All upcoming fixed liabilities (Rent ₹8,000 on Oct 1, Wi-Fi ₹799 on Oct 3) are scheduled, leaving a projected surplus over the ₹2,000 buffer.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Action Card & HITL Controls */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900/90 to-stone-900/50 border border-stone-800 shadow-inner">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Proposed Autonomous Safeguard
              </span>
              {isOttPaused && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/50 font-semibold">
                  EXECUTED
                </span>
              )}
              {actionRejected && !isOttPaused && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700 font-semibold">
                  DISMISSED
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-white">
              Recommendation: <span className="text-rose-200">Pause OTT & Shopping Auto-Debits (Saves ₹1,499 instantly)</span>
            </p>
            <p className="text-xs text-stone-400">
              Postpones non-essential subscription payments until Oct 12 when college stipend is credited.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isOttPaused ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-md shadow-emerald-950/50 glow-emerald">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Action Executed: Auto-Debits Paused</span>
              </div>
            ) : (
              <>
                {/* Approve Action Button (Green) */}
                <button
                  onClick={handleApproveWithConfetti}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 border border-emerald-400/40 transition-all duration-200 active:scale-95 hover:shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Action</span>
                </button>

                {/* Split Payment Button (Blue) */}
                <button
                  onClick={onOpenSplitModal}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-950/50 border border-blue-400/30 transition-all duration-200 active:scale-95"
                >
                  <Split className="w-4 h-4" />
                  <span>Split Payment</span>
                </button>

                {/* Reject Button (Outline) */}
                <button
                  onClick={onRejectAction}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-semibold border border-stone-700/60 hover:border-rose-500/40 transition-all duration-200 active:scale-95"
                >
                  <XCircle className="w-4 h-4 text-stone-400" />
                  <span>Reject</span>
                </button>
              </>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
