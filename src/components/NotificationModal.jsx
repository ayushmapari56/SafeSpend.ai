import React from 'react';
import { X, Bell, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

export default function NotificationModal({ isOpen, onClose, notifications, onClearAll }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-orange-100 p-6 shadow-2xl text-stone-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 text-orange-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-stone-900 font-sora">System Notifications</h3>
            <p className="text-xs text-stone-500 font-sans">Proactive liquidity alerts & agent interventions</p>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 mb-5">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-500 font-sans">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              No pending alerts. All cashflow systems optimal.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 ${
                  n.type === 'warning'
                    ? 'bg-orange-50 border-orange-200 text-stone-800'
                    : n.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-stone-800'
                    : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                {n.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                ) : n.type === 'success' ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-stone-900 font-sora">{n.title}</div>
                  <div className="text-[11px] text-stone-600 mt-0.5 font-sans">{n.message}</div>
                  <div className="text-[10px] text-stone-400 font-mono mt-1">{n.time}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <button
            onClick={onClearAll}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors font-sans"
          >
            Clear Notifications
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-800 transition-colors font-sans"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}
