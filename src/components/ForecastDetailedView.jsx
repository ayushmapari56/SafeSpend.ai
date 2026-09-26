import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import ForecastChartCard from './ForecastChartCard';

export default function ForecastDetailedView({
  projectionData,
  safeToSpendDaily,
  timeframe,
  setTimeframe,
  isWarning,
  safetyBuffer
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Top Chart */}
      <ForecastChartCard
        projectionData={projectionData}
        safeToSpendDaily={safeToSpendDaily}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        isWarning={isWarning}
        safetyBuffer={safetyBuffer}
      />

      {/* Daily Cashflow Matrix Breakdown */}
      <div className="rounded-3xl bg-white border border-orange-100/90 p-6 md:p-8 shadow-luxury backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 font-mono">Granular Cashflow Schedule</div>
            <h3 className="text-xl font-extrabold text-stone-900 font-sora mt-0.5">14-Day Inflow vs Outflow Ledger</h3>
          </div>
          <span className="text-xs text-stone-500 font-mono font-semibold">Dynamic AI Projection</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-orange-50/60 uppercase text-[10px] text-stone-600 font-bold border-b border-orange-100 font-mono">
              <tr>
                <th className="py-3.5 px-4">Day / Date</th>
                <th className="py-3.5 px-4">Projected Inflow / Event</th>
                <th className="py-3.5 px-4">Committed Outflows</th>
                <th className="py-3.5 px-4">Projected Balance</th>
                <th className="py-3.5 px-4">Buffer Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {projectionData.map((d) => {
                const isBreach = d.balance < d.buffer;
                return (
                  <tr key={d.dayNum} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {d.date} <span className="text-stone-400 font-normal">({d.day})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {d.dayNum === 4 ? (
                        <span className="text-emerald-700 font-semibold">Stipend Credit (+₹12,000)</span>
                      ) : d.dayNum === 10 ? (
                        <span className="text-emerald-700 font-semibold">Freelance Payout (+₹6,500)</span>
                      ) : d.dayNum === 13 ? (
                        <span className="text-emerald-700 font-semibold">Peer Mentoring (+₹2,000)</span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {d.dayNum === 2 ? (
                        <span className="text-orange-700 font-semibold">Apartment Rent (₹8,000)</span>
                      ) : d.dayNum === 4 ? (
                        <span className="text-stone-700 font-medium">Wi-Fi Bill (₹799)</span>
                      ) : d.dayNum === 6 ? (
                        <span className="text-stone-700 font-medium">OTT Subscriptions (₹1,499)</span>
                      ) : d.dayNum === 8 ? (
                        <span className="text-stone-700 font-medium">Gym Membership (₹1,200)</span>
                      ) : (
                        <span className="text-stone-400 font-mono">Daily Burn (~₹350)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-space font-bold text-stone-900">
                      <span className={isBreach ? 'text-orange-600' : 'text-stone-900'}>
                        ₹{d.balance.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {isBreach ? (
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300 text-[10px] font-bold inline-flex items-center gap-1 font-mono">
                          <AlertTriangle className="w-2.5 h-2.5 text-orange-600" /> Buffer Breach
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold inline-flex items-center gap-1 font-mono">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Protected
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
