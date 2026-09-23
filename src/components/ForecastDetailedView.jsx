import React from 'react';
import { Calendar, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
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
      <div className="rounded-3xl bg-stone-900/80 border border-stone-800 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400">Granular Cashflow Schedule</div>
            <h3 className="text-xl font-bold text-white font-['Outfit'] mt-0.5">14-Day Inflow vs Outflow Ledger</h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">Dynamic AI Projection</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/80 uppercase text-[10px] text-stone-400 font-semibold border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Day / Date</th>
                <th className="py-3 px-4">Projected Inflow / Event</th>
                <th className="py-3 px-4">Committed Outflows</th>
                <th className="py-3 px-4">Projected Balance</th>
                <th className="py-3 px-4">Buffer Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-sans">
              {projectionData.map((d) => {
                const isBreach = d.balance < d.buffer;
                return (
                  <tr key={d.dayNum} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {d.date} <span className="text-stone-500 font-normal">({d.day})</span>
                    </td>
                    <td className="py-3 px-4">
                      {d.dayNum === 4 ? (
                        <span className="text-emerald-400 font-medium">Stipend Credit (+₹12,000)</span>
                      ) : d.dayNum === 10 ? (
                        <span className="text-emerald-400 font-medium">Freelance Payout (+₹6,500)</span>
                      ) : d.dayNum === 13 ? (
                        <span className="text-emerald-400 font-medium">Peer Mentoring (+₹2,000)</span>
                      ) : (
                        <span className="text-stone-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {d.dayNum === 2 ? (
                        <span className="text-rose-400 font-medium">Apartment Rent (₹8,000)</span>
                      ) : d.dayNum === 4 ? (
                        <span className="text-amber-400">Wi-Fi Bill (₹799)</span>
                      ) : d.dayNum === 6 ? (
                        <span className="text-amber-400">OTT Subscriptions (₹1,499)</span>
                      ) : d.dayNum === 8 ? (
                        <span className="text-amber-400">Gym Membership (₹1,200)</span>
                      ) : (
                        <span className="text-stone-400 font-mono">Daily Burn (~₹350)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={isBreach ? 'text-rose-400' : 'text-stone-100'}>
                        ₹{d.balance.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {isBreach ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 text-[10px] font-bold inline-flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-400" /> Buffer Breach
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-[10px] font-bold inline-flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Protected
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
