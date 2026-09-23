import React from 'react';
import { X, Bell, AlertTriangle, ShieldCheck, Clock, Check } from 'lucide-react';

export default function NotificationModal({ isOpen, onClose, notifications, onClearAll }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 p-6 shadow-2xl text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-700/40 text-rose-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">System Notifications</h3>
            <p className="text-xs text-stone-400">Proactive liquidity alerts & agent interventions</p>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 mb-5">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-400">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              No pending alerts. All cashflow systems optimal.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border text-xs flex items-start gap-3 ${
                  n.type === 'warning'
                    ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                    : n.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                    : 'bg-stone-950/50 border-stone-800 text-stone-300'
                }`}
              >
                {n.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : n.type === 'success' ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-white">{n.title}</div>
                  <div className="text-[11px] opacity-90 mt-0.5">{n.message}</div>
                  <div className="text-[10px] opacity-60 font-mono mt-1">{n.time}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800">
          <button
            onClick={onClearAll}
            className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
          >
            Clear Notifications
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-white transition-colors"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}
