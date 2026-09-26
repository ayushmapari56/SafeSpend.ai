import React from 'react';
import { Bot, Sparkles, CheckCircle2, Split, XCircle, AlertTriangle, Check } from 'lucide-react';
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
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#f97316', '#fb923c', '#10b981', '#f59e0b']
    });
    onApproveAction();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-orange-100/90 p-6 md:p-8 shadow-luxury backdrop-blur-xl transition-all duration-300 hover:shadow-luxury-hover hover:border-orange-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-500 shadow-md shadow-orange-500/20 border border-orange-200 text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight font-sora">
                AI Guardian Insight & Active Interventions
              </h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-bold">
                HITL Engine
              </span>
            </div>
            <p className="text-xs text-stone-500 font-sans">Plain-Language Reasoning & Human-in-the-Loop Safeguards</p>
          </div>
        </div>

        <div className="text-xs font-mono text-stone-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Explainability Protocol: Active
        </div>
      </div>

      {/* Plain Language Explainability Callout Box */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 mb-6 ${
        isWarning && !isRestored
          ? 'bg-orange-50/70 border-orange-200 text-stone-800'
          : isRestored
          ? 'bg-emerald-50/70 border-emerald-200 text-stone-800'
          : 'bg-stone-50/80 border-stone-200 text-stone-800'
      }`}>
        <div className="flex items-start gap-3">
          {isWarning && !isRestored ? (
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          ) : isRestored ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 font-mono">
              {isWarning && !isRestored ? 'Why Did Safe-to-Spend Drop?' : isRestored ? 'Intervention Impact Assessment' : 'Real-time Autonomous Reasoning'}
            </h4>
            
            <p className="text-sm leading-relaxed text-stone-700 font-sans">
              {isWarning && !isRestored ? (
                <>
                  <strong className="text-orange-700 font-bold">Shortfall Alert: </strong>
                  Safe-to-Spend limit dropped to <span className="font-space font-bold text-orange-600">₹{safeToSpendDaily}/day</span> because{' '}
                  {incomeDelayDays > 0 && <span>college stipend is delayed by <strong>{incomeDelayDays} days</strong></span>}
                  {incomeDelayDays > 0 && expenseShockAmount > 0 && <span> and </span>}
                  {expenseShockAmount > 0 && <span>an unexpected emergency debit of <strong>₹{expenseShockAmount.toLocaleString('en-IN')}</strong> was injected</span>}.
                  {' '}Without defensive action, cash balance will breach the ₹2,000 non-touch buffer on Day 6.
                </>
              ) : isRestored ? (
                <>
                  <strong className="text-emerald-700 font-bold">Safety Buffer Restored: </strong>
                  {isOttPaused && 'Auto-debit for OTT & subscriptions has been safely deferred to next billing cycle (+₹1,499 liquidity). '}
                  {splitPaymentActive && 'Apartment Rent is split into two installments of ₹4,000 each (+₹4,000 liquidity buffer). '}
                  Safe-to-Spend is stabilized at <span className="font-space font-bold text-emerald-700">₹{safeToSpendDaily}/day</span>.
                </>
              ) : (
                <>
                  <strong className="text-emerald-700 font-bold">Optimal Liquidity: </strong>
                  Safe-to-Spend is stable at <span className="font-space font-bold text-emerald-700">₹{safeToSpendDaily}/day</span>.
                  All upcoming fixed liabilities (Rent ₹8,000 on Oct 1, Wi-Fi ₹799 on Oct 3) are scheduled, leaving a projected surplus over the ₹2,000 buffer.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Action Card & HITL Controls */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-50/50 to-amber-50/30 border border-orange-100 shadow-inner">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                Proposed Autonomous Safeguard
              </span>
              {isOttPaused && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold font-mono">
                  EXECUTED
                </span>
              )}
              {actionRejected && !isOttPaused && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 font-bold font-mono">
                  DISMISSED
                </span>
              )}
            </div>

            <p className="text-sm font-bold text-stone-900 font-sora">
              Recommendation: <span className="text-orange-700">Pause OTT & Shopping Auto-Debits (Saves ₹1,499 instantly)</span>
            </p>
            <p className="text-xs text-stone-500 font-sans">
              Postpones non-essential subscription payments until Oct 12 when college stipend is credited.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isOttPaused ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold shadow-sm font-sora">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Action Executed: Auto-Debits Paused</span>
              </div>
            ) : (
              <>
                {/* Approve Action Button (Emerald) */}
                <button
                  onClick={handleApproveWithConfetti}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 border border-emerald-500 transition-all duration-200 active:scale-95 font-sora"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Action</span>
                </button>

                {/* Split Payment Button (Light Orange / Warm) */}
                <button
                  onClick={onOpenSplitModal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 border border-orange-400 transition-all duration-200 active:scale-95 font-sora"
                >
                  <Split className="w-4 h-4" />
                  <span>Split Payment</span>
                </button>

                {/* Reject Button (Outline) */}
                <button
                  onClick={onRejectAction}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 text-xs font-bold border border-stone-200 transition-all duration-200 active:scale-95 font-sans"
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
