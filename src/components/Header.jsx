import React from 'react';
import { ShieldCheck, Bell, Zap, Activity, LineChart, Terminal, SlidersHorizontal } from 'lucide-react';

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
    <header className="sticky top-0 z-50 w-full border-b border-orange-100/80 bg-white/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 shadow-md shadow-orange-500/20 border border-orange-200 group">
              <ShieldCheck className="w-6 h-6 text-white transition-transform group-hover:scale-110 duration-300" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-stone-900 font-sora">
                  SafeSpend<span className="text-orange-500">.ai</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/80 font-mono">
                  Autonomous Engine
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block font-sans">Proactive Liquidity & Defense Architecture</p>
            </div>
          </div>

          {/* Centered Pill Capsule Menu */}
          <nav className="hidden md:flex items-center p-1.5 rounded-full bg-stone-100/80 border border-stone-200/60 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-orange-600 shadow-sm border border-orange-200/80 font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-500' : 'text-stone-400'}`} />
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
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-orange-50 hover:bg-orange-100/80 text-orange-700 border border-orange-200/80 text-xs font-bold shadow-sm transition-all duration-200 active:scale-95 group font-sans"
            >
              <Zap className="w-3.5 h-3.5 text-orange-500 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline">Reset Demo</span>
              <span className="sm:hidden">Reset</span>
            </button>

            {/* Notification Bell with alert badge */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/80 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {hasAlert && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white ring-2 ring-white animate-bounce">
                  {alertCount || '!'}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 via-amber-400 to-orange-500 p-[2px] shadow-sm">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-orange-600 font-sora">
                  RA
                </div>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-stone-800 leading-tight font-sora">Rahul A.</p>
                <p className="text-[10px] text-emerald-600 font-mono flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Shield
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
