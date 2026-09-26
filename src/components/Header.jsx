import React, { useState } from 'react';
import { ShieldCheck, Bell, Zap, Activity, LineChart, Terminal, SlidersHorizontal, ArrowLeft, Menu, X } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onResetDemo, 
  hasAlert, 
  alertCount, 
  onOpenNotifications 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only dashboard-level tabs — hero is a separate landing page, not a tab
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'forecast', label: 'Forecast', icon: LineChart },
    { id: 'logs', label: 'Audit Log', icon: Terminal },
    { id: 'simulator', label: 'Simulator', icon: SlidersHorizontal },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#163701]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* LEFT: Logo — click returns to hero landing page */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Back-to-hero button */}
            <button
              onClick={() => setActiveTab('hero')}
              title="Back to landing page"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#A3F574] text-[#163701] hover:bg-[#90e85c] transition-colors active:scale-95 shadow-sm border border-[#163701]/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Brand mark */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <img src="/logo.jpg" alt="SafeSpend" className="w-9 h-9 rounded-xl object-contain" />
              <div className="hidden sm:block">
                <span className="font-archivo text-base tracking-tight text-[#163701] uppercase leading-none">
                  SafeSpend<span className="text-[#163701]/50">.ai</span>
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: Pill Navigation — desktop only */}
          <nav className="hidden md:flex items-center p-1 rounded-full bg-[#f5f5f0] border border-[#163701]/8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#163701] text-[#A3F574] shadow-sm'
                      : 'text-[#0F0F0C]/70 hover:text-[#163701] hover:bg-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#A3F574]' : 'text-[#0F0F0C]/40'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Reset Demo */}
            <button
              onClick={onResetDemo}
              title="Reset demo to baseline"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#A3F574] hover:bg-[#90e85c] text-[#163701] text-xs font-bold transition-all active:scale-95 border border-[#163701]/10"
            >
              <Zap className="w-3.5 h-3.5 fill-[#163701]" />
              <span>Reset</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full hover:bg-[#f5f5f0] text-[#0F0F0C]/70 hover:text-[#163701] transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {hasAlert && (
                <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#E8323C] text-[8px] font-bold text-white ring-2 ring-white">
                  {alertCount || '!'}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <div className="hidden sm:flex items-center gap-2 pl-2 ml-1 border-l border-[#163701]/8">
              <div className="w-8 h-8 rounded-full bg-[#163701] text-[#A3F574] flex items-center justify-center text-[11px] font-bold">
                RA
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[#f5f5f0] text-[#0F0F0C]/70"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#163701]/8 bg-white px-4 pb-4 pt-2 space-y-1 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#163701] text-[#A3F574]'
                    : 'text-[#0F0F0C] hover:bg-[#f5f5f0]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#A3F574]' : 'text-[#0F0F0C]/40'}`} />
                {item.label}
              </button>
            );
          })}

          {/* Mobile-only reset + back */}
          <div className="flex gap-2 pt-2 border-t border-[#163701]/8 mt-2">
            <button
              onClick={() => { setActiveTab('hero'); setMobileMenuOpen(false); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#f5f5f0] text-[#163701] text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Landing Page
            </button>
            <button
              onClick={() => { onResetDemo(); setMobileMenuOpen(false); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#A3F574] text-[#163701] text-sm font-bold"
            >
              <Zap className="w-4 h-4 fill-[#163701]" />
              Reset Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
