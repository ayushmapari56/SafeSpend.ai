import React from 'react';
import { ShieldCheck, Bell, Zap, User, Activity, LineChart, Terminal, SlidersHorizontal } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onResetDemo, 
  hasAlert, 
  alertCount, 
  onOpenNotifications 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'forecast', label: '14-Day Forecast', icon: LineChart },
    { id: 'logs', label: 'Agent Audit Log', icon: Terminal },
    { id: 'simulator', label: 'Scenario Simulator', icon: SlidersHorizontal },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-orange-600 shadow-lg shadow-rose-900/40 border border-rose-400/30 group">
              <ShieldCheck className="w-6 h-6 text-white transition-transform group-hover:scale-110 duration-300" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-stone-100 to-rose-200 bg-clip-text text-transparent font-['Outfit']">
                  SafeSpend<span className="text-rose-500">.ai</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-700/40">
                  Autonomous Engine
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">Proactive Liquidity & Defense Architecture</p>
            </div>
          </div>

          {/* Centered Pill Capsule Menu */}
          <nav className="hidden md:flex items-center p-1.5 rounded-full bg-stone-900/90 border border-stone-800 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-900 via-red-900 to-orange-950 text-white shadow-md shadow-rose-950/60 border border-rose-700/40 font-semibold'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-stone-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Profile Area */}
          <div className="flex items-center gap-3">
            {/* Reset Demo Script Capsule Button */}
            <button
              onClick={onResetDemo}
              title="Reset metrics to pristine baseline"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/60 hover:border-rose-500/50 text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 group"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline">Reset Demo</span>
              <span className="sm:hidden">Reset</span>
            </button>

            {/* Notification Bell with alert badge */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 hover:border-stone-700 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {hasAlert && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white ring-2 ring-stone-950 animate-bounce">
                  {alertCount || '!'}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-stone-800">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-600 to-red-600 p-[2px] shadow-sm">
                <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-xs font-bold text-amber-300">
                  RA
                </div>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-stone-200 leading-tight">Rahul A.</p>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
