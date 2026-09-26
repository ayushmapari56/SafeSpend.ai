import React from 'react';
import { X, Split, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SplitPaymentModal({ isOpen, onClose, onApplySplit }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f97316', '#fb923c', '#10b981']
    });
    onApplySplit();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-orange-100 p-6 md:p-8 shadow-2xl text-stone-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-orange-100 border border-orange-200 text-orange-600">
            <Split className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-stone-900 font-sora">Split Payment Optimization</h3>
            <p className="text-xs text-stone-500 font-sans">Restructure large outflows across the cashflow cycle</p>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 mb-5 text-xs text-stone-700 space-y-2 font-sans">
          <p>
            By splitting <strong>Apartment Rent (₹8,000)</strong> into two bi-weekly installments, you eliminate the immediate ₹2,000 buffer breach on Day 2.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white border border-orange-200 shadow-sm">
              <span className="text-[10px] text-orange-700 block font-bold uppercase tracking-wider font-mono">Installment 1 (Oct 1)</span>
              <span className="text-base font-bold font-space text-stone-900">₹4,000</span>
              <span className="text-[10px] text-emerald-700 block mt-0.5 font-semibold">Instant relief</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-sm">
              <span className="text-[10px] text-stone-500 block font-bold uppercase tracking-wider font-mono">Installment 2 (Oct 9)</span>
              <span className="text-base font-bold font-space text-stone-700">₹4,000</span>
              <span className="text-[10px] text-orange-600 block mt-0.5 font-semibold">Post-stipend arrival</span>
            </div>
          </div>
        </div>

        {/* Impact summary */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 mb-6 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs text-emerald-800 font-sans">
            <strong>Impact on Safe-to-Spend:</strong> Increases daily spending allowance back to <span className="font-space font-bold text-emerald-700">+₹450/day</span>.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors font-sans"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 border border-orange-400 transition-all active:scale-95 font-sora"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Split Rent</span>
          </button>
        </div>

      </div>
    </div>
  );
}
