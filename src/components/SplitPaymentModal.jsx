import React from 'react';
import { X, Split, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SplitPaymentModal({ isOpen, onClose, onApplySplit, splitPaymentActive }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    onApplySplit();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-stone-900 border border-stone-800 p-6 md:p-8 shadow-2xl text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
            <Split className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Split Payment Optimization</h3>
            <p className="text-xs text-stone-400">Restructure large outflows across the cashflow cycle</p>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 mb-5 text-xs text-stone-300 space-y-2">
          <p>
            By splitting <strong>Apartment Rent (₹8,000)</strong> into two bi-weekly installments, you eliminate the immediate ₹2,000 buffer breach on Day 2.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40">
              <span className="text-[10px] text-blue-300 block font-semibold">Installment 1 (Oct 1)</span>
              <span className="text-sm font-bold font-mono text-white">₹4,000</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Instant relief</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
              <span className="text-[10px] text-stone-400 block font-semibold">Installment 2 (Oct 9)</span>
              <span className="text-sm font-bold font-mono text-stone-200">₹4,000</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Post-stipend arrival</span>
            </div>
          </div>
        </div>

        {/* Impact summary */}
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-700/40 mb-6 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs text-emerald-200">
            <strong>Impact on Safe-to-Spend:</strong> Increases daily spending allowance back to <span className="font-mono font-bold text-emerald-300">+₹450/day</span>.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-950/60 border border-blue-400/40 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Split Rent</span>
          </button>
        </div>

      </div>
    </div>
  );
}
