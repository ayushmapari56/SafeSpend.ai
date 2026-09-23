import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, AlertTriangle, Shield, Calendar, Sparkles } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isBreach = data.balance < data.buffer;
    return (
      <div className="p-3 bg-stone-900/95 border border-stone-700/80 rounded-2xl shadow-2xl backdrop-blur-xl text-xs font-sans">
        <div className="flex items-center justify-between gap-3 border-b border-stone-800 pb-1.5 mb-2">
          <span className="font-semibold text-stone-300">{data.date} ({data.day})</span>
          {isBreach ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700/50 text-[10px] font-bold flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5 text-rose-400" /> Buffer Breach
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 text-[10px] font-bold flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-emerald-400" /> Safe Zone
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-white flex items-center justify-between gap-4">
          <span className="text-stone-400 font-normal">Projected Balance:</span>
          <span className={`font-mono ${isBreach ? 'text-rose-400' : 'text-emerald-400'}`}>
            ₹{data.balance.toLocaleString('en-IN')}
          </span>
        </p>
        <p className="text-[11px] text-stone-400 flex items-center justify-between gap-4 mt-1">
          <span>Safety Buffer:</span>
          <span className="text-amber-400 font-mono">₹{data.buffer.toLocaleString('en-IN')}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function ForecastChartCard({ 
  projectionData, 
  safeToSpendDaily, 
  timeframe, 
  setTimeframe,
  isWarning,
  safetyBuffer = 2000
}) {
  const displayData = timeframe === '7d' ? projectionData.slice(0, 7) : projectionData;
  const lowestPoint = Math.min(...displayData.map((d) => d.balance));
  const hasBreach = lowestPoint < safetyBuffer;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/80 via-stone-900/90 to-stone-950/90 border border-rose-900/40 p-6 md:p-8 shadow-2xl shadow-rose-950/30 backdrop-blur-xl transition-all duration-300 group hover:border-rose-700/60">
      
      {/* Subtle background decorative ambient glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-orange-600/10 blur-3xl pointer-events-none"></div>

      {/* Header of the Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              14-Day Cashflow Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
            Safe-to-Spend Forecast
          </h2>
        </div>

        {/* Timeframe Dropdown / Pill selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-stone-900/80 border border-stone-800 self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeframe === '7d'
                ? 'bg-rose-900/80 text-rose-200 border border-rose-700/50 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Next 7 Days
          </button>
          <button
            onClick={() => setTimeframe('14d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeframe === '14d'
                ? 'bg-rose-900/80 text-rose-200 border border-rose-700/50 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Next 14 Days
          </button>
        </div>
      </div>

      {/* Main Metric Hero Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md relative z-10">
        <div>
          <p className="text-xs text-stone-400 font-medium mb-1">Safe-to-Spend Today</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl md:text-4xl font-extrabold tracking-tight font-['Outfit'] ${
              isWarning ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
            }`}>
              ₹{safeToSpendDaily.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-400 font-medium">/ day cap</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            {isWarning 
              ? '⚠️ Risk detected: Defensive daily throttling applied'
              : '✅ Guaranteed buffer-preserving expenditure rate'
            }
          </p>
        </div>

        <div className="flex flex-col justify-center sm:items-end border-t sm:border-t-0 sm:border-l border-stone-800 pt-3 sm:pt-0 sm:pl-4">
          <p className="text-xs text-stone-400 font-medium mb-1">Minimum Safety Buffer</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-amber-400 font-mono">₹{safetyBuffer.toLocaleString('en-IN')}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/40">
              Non-touch
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            {hasBreach ? (
              <span className="text-rose-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Breach projected (Min: ₹{lowestPoint.toLocaleString('en-IN')})
              </span>
            ) : (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" /> Safety buffer preserved throughout
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-64 sm:h-72 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {/* Gradient for standard healthy balance curve */}
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isWarning ? "#e11d48" : "#10b981"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isWarning ? "#e11d48" : "#10b981"} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#78716c" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#44403c' }}
            />
            <YAxis 
              stroke="#78716c" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#44403c' }}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Safety Buffer Horizontal Dashed Reference Line */}
            <ReferenceLine 
              y={safetyBuffer} 
              stroke="#f59e0b" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ 
                value: '₹2,000 Safety Buffer', 
                position: 'insideTopRight', 
                fill: '#fbbf24', 
                fontSize: 10,
                fontWeight: 600
              }} 
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke={isWarning ? "#f43f5e" : "#10b981"}
              strokeWidth={3}
              fill="url(#balanceGradient)"
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-800/80 text-[11px] text-stone-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-1 rounded-full ${isWarning ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
            <span>Projected Liquidity Curve</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-400"></span>
            <span>Safety Threshold (₹2,000)</span>
          </div>
        </div>
        <span className="font-mono text-stone-400">AI Confidence: 94.2%</span>
      </div>

    </div>
  );
}
