import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { AlertTriangle, Shield, Sparkles } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isBreach = data.balance < data.buffer;
    return (
      <div className="p-3.5 bg-white/95 border border-orange-200/80 rounded-2xl shadow-xl backdrop-blur-xl text-xs font-sans">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2 mb-2">
          <span className="font-bold text-stone-800 font-sora">{data.date} ({data.day})</span>
          {isBreach ? (
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-300 text-[10px] font-bold flex items-center gap-1 font-mono">
              <AlertTriangle className="w-2.5 h-2.5 text-orange-600" /> Buffer Breach
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 font-mono">
              <Shield className="w-2.5 h-2.5 text-emerald-600" /> Safe Zone
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-stone-900 flex items-center justify-between gap-4">
          <span className="text-stone-500 font-normal">Projected Balance:</span>
          <span className={`font-space font-bold ${isBreach ? 'text-orange-600' : 'text-emerald-600'}`}>
            ₹{data.balance.toLocaleString('en-IN')}
          </span>
        </p>
        <p className="text-[11px] text-stone-500 flex items-center justify-between gap-4 mt-1 font-sans">
          <span>Safety Buffer:</span>
          <span className="text-amber-600 font-space font-semibold">₹{data.buffer.toLocaleString('en-IN')}</span>
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
    <div className="relative overflow-hidden rounded-3xl bg-white border border-orange-100/90 p-6 md:p-8 shadow-luxury backdrop-blur-xl transition-all duration-300 group hover:shadow-luxury-hover hover:border-orange-200">
      
      {/* Decorative ambient subtle soft warm light glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-orange-100/50 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-amber-100/40 blur-3xl pointer-events-none"></div>

      {/* Header of the Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              14-Day Cashflow Engine
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight font-sora">
            Safe-to-Spend Forecast
          </h2>
        </div>

        {/* Timeframe Pill selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-orange-50/70 border border-orange-100 self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === '7d'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Next 7 Days
          </button>
          <button
            onClick={() => setTimeframe('14d')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === '14d'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Next 14 Days
          </button>
        </div>
      </div>

      {/* Main Metric Hero Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-5 rounded-2xl bg-gradient-to-r from-orange-50/60 to-amber-50/40 border border-orange-100/80 backdrop-blur-md relative z-10">
        <div>
          <p className="text-xs text-stone-500 font-semibold mb-1 uppercase tracking-wider font-mono">Safe-to-Spend Today</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl md:text-4xl font-extrabold tracking-tight font-sora ${
              isWarning ? 'text-orange-600' : 'text-stone-900'
            }`}>
              ₹{safeToSpendDaily.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-500 font-medium">/ day cap</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            {isWarning 
              ? '⚠️ Risk detected: Defensive daily throttling active'
              : '✅ Guaranteed buffer-preserving expenditure rate'
            }
          </p>
        </div>

        <div className="flex flex-col justify-center sm:items-end border-t sm:border-t-0 sm:border-l border-orange-200/60 pt-3 sm:pt-0 sm:pl-5">
          <p className="text-xs text-stone-500 font-semibold mb-1 uppercase tracking-wider font-mono">Minimum Safety Buffer</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-amber-600 font-space">₹{safetyBuffer.toLocaleString('en-IN')}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold font-mono">
              Non-touch
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-sans">
            {hasBreach ? (
              <span className="text-orange-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Breach projected (Min: ₹{lowestPoint.toLocaleString('en-IN')})
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-600" /> Safety buffer preserved throughout
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
              <linearGradient id="balanceGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isWarning ? "#ea580c" : "#f97316"} stopOpacity={0.25} />
                <stop offset="95%" stopColor={isWarning ? "#ea580c" : "#f97316"} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b' }}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Safety Buffer Reference Line */}
            <ReferenceLine 
              y={safetyBuffer} 
              stroke="#d97706" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ 
                value: '₹2,000 Safety Buffer', 
                position: 'insideTopRight', 
                fill: '#b45309', 
                fontSize: 10,
                fontWeight: 700
              }} 
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke={isWarning ? "#ea580c" : "#f97316"}
              strokeWidth={3}
              fill="url(#balanceGradientLight)"
              activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 3, fill: '#ea580c' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-sans">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-1 rounded-full ${isWarning ? 'bg-orange-600' : 'bg-orange-500'}`}></span>
            <span className="font-medium text-stone-700">Projected Liquidity Curve</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-600"></span>
            <span className="font-medium text-stone-700">Safety Threshold (₹2,000)</span>
          </div>
        </div>
        <span className="font-mono text-stone-500">AI Confidence: 94.2%</span>
      </div>

    </div>
  );
}
