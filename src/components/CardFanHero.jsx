import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Lock } from 'lucide-react';

/* ==========================================================================
   CONFIG — tune fan angles, offsets, timings, and card gradients here.
   
   Cards are rendered back-to-front (index 0 = backmost, index 4 = front).
   All cards share a transform-origin near bottom-left of the cluster.
   Each card gets a distinct rotation so 25-30% of every back card peeks out.
   ========================================================================== */
const CARD_W = 400;  // px — credit-card width
const CARD_H = 252;  // px — credit-card height (ratio ~1.59:1)

const FAN_CONFIG = {
  brandName: 'SAFESPEND',

  timings: {
    preloaderDuration: 0.9,
    preloaderFadeOut: 0.3,
    step1Duration: 0.6,       // front card enters
    step2Delay: 0.6,          // other cards appear as tight stack
    step2Duration: 0.35,
    step3Delay: 1.0,          // fan-out begins
    step3Duration: 0.9,       // fan-out spread
    staggerDelay: 0.08,       // 80ms per card
    textEntryDelay: 0.1,
    textStagger: 0.08,
    idleFloatDuration: 7,     // 6–8s loop
  },

  ease: [0.16, 1, 0.3, 1],   // cubic-bezier(0.16, 1, 0.3, 1)

  // Tight-stack state (all cards overlapping at ~-8°, small offsets)
  stack: { rotate: -8, dx: 3, dy: 3 },

  // Fan-out targets. index 0 = backmost card, index 4 = front card.
  // Rotation fans from -35° (back) to +5° (front).
  // x/y offsets spread the cards so each back card peeks out.
  cards: [
    {
      id: 'c0', rotate: -35, x: 135, y: -100, z: 10, idlePhase: 0,
      gradient: 'linear-gradient(135deg, #E8323C 0%, #c42030 35%, #7C8CE8 70%, #5a6dd6 100%)',
    },
    {
      id: 'c1', rotate: -25, x: 100, y: -72, z: 20, idlePhase: 1.5,
      gradient: 'linear-gradient(135deg, #2DD4EF 0%, #1bb8d4 30%, #E8A08A 70%, #d4856c 100%)',
    },
    {
      id: 'c2', rotate: -15, x: 68, y: -46, z: 30, idlePhase: 3.0,
      gradient: 'linear-gradient(135deg, #7C8CE8 0%, #5a6dd6 35%, #E8323C 75%, #c42030 100%)',
    },
    {
      id: 'c3', rotate: -5, x: 34, y: -22, z: 40, idlePhase: 4.5,
      gradient: 'linear-gradient(135deg, #E8A08A 0%, #d4856c 30%, #2DD4EF 70%, #1bb8d4 100%)',
    },
    {
      // FRONT CARD — the only one that shows number/name/expiry
      id: 'c4', rotate: 5, x: 0, y: 0, z: 50, idlePhase: 0,
      gradient: 'linear-gradient(135deg, #E8323C 0%, #d42a34 25%, #2DD4EF 55%, #7C8CE8 80%, #E8A08A 100%)',
      name: 'ALEX MORGAN',
      fullNumber: '4921 •••• •••• 4829',
      expiry: '09/29',
    },
  ],
};

/* ==========================================================================
   CreditCard — a single div-only card.
   Front card (isFront=true) shows full details.
   Back cards show only gradient + brand logo.
   Fully opaque gradient base → no ghost text.
   ========================================================================== */
function CreditCard({ card, index, isFront, animPhase, reducedMotion }) {
  const cfg = FAN_CONFIG;
  const total = cfg.cards.length;

  // ---------- compute animation target ----------
  let target = {};
  let transition = {};

  if (reducedMotion) {
    target = { opacity: 1, x: card.x, y: card.y, rotate: card.rotate };
    transition = { duration: 0 };
  } else if (animPhase === 'hidden') {
    target = { opacity: 0, x: 0, y: 0, rotate: cfg.stack.rotate };
    transition = { duration: 0 };
  } else if (animPhase === 'step1') {
    if (isFront) {
      target = { opacity: 1, x: 0, y: 0, rotate: cfg.stack.rotate };
      transition = { duration: cfg.timings.step1Duration, ease: cfg.ease };
    } else {
      target = { opacity: 0, x: 0, y: 0, rotate: cfg.stack.rotate };
      transition = { duration: 0 };
    }
  } else if (animPhase === 'step2') {
    const si = total - 1 - index; // stack offset index (front=0, back=4)
    target = {
      opacity: 1,
      x: si * cfg.stack.dx,
      y: si * cfg.stack.dy,
      rotate: cfg.stack.rotate,
    };
    transition = {
      duration: isFront ? 0.05 : cfg.timings.step2Duration,
      ease: cfg.ease,
    };
  } else {
    // step3 + idle → fanned out
    const stagger = (total - 1 - index) * cfg.timings.staggerDelay;
    target = { opacity: 1, x: card.x, y: card.y, rotate: card.rotate };
    transition = { duration: cfg.timings.step3Duration, delay: stagger, ease: cfg.ease };
  }

  // Idle float (only in idle phase, only when motion allowed)
  const isIdle = animPhase === 'idle' && !reducedMotion;

  return (
    <motion.div
      className="absolute will-change-transform select-none"
      style={{
        width: CARD_W,
        height: CARD_H,
        zIndex: card.z,
        bottom: 0,
        left: 0,
        transformOrigin: '15% 85%',  // near bottom-left — the fan pivot
      }}
      initial={{ opacity: 0, x: 0, y: 0, rotate: cfg.stack.rotate }}
      animate={
        isIdle
          ? {
              opacity: 1,
              x: card.x,
              y: [card.y - 6, card.y + 6, card.y - 6],
              rotate: [card.rotate - 0.5, card.rotate + 0.5, card.rotate - 0.5],
              transition: {
                y: { duration: cfg.timings.idleFloatDuration, repeat: Infinity, ease: 'easeInOut', delay: card.idlePhase },
                rotate: { duration: cfg.timings.idleFloatDuration, repeat: Infinity, ease: 'easeInOut', delay: card.idlePhase },
              },
            }
          : target
      }
      transition={!isIdle ? transition : undefined}
    >
      {/* Fully opaque card shell — no translucency, no ghost text */}
      <div
        className="relative w-full h-full overflow-hidden flex flex-col justify-between"
        style={{
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.3)',
          background: card.gradient,
          boxShadow: '0 30px 60px -20px rgba(22,55,1,0.35)',
        }}
      >
        {/* Subtle glass sheen on top of opaque gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.10) 100%)',
          }}
        />

        {/* Card content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-5">

          {/* TOP: Brand Logo (Left) + Contactless icon (Right) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <img src="/logo.jpg" alt="SafeSpend" className="w-5 h-5 rounded-[3px] object-contain brightness-[10] invert" />
              <span className="font-sans font-bold tracking-[0.18em] text-[11px] text-white uppercase drop-shadow-sm">
                {cfg.brandName}
              </span>
            </div>

            {isFront && (
              <svg className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M7.5 16.5a6 6 0 0 1 0-9" opacity="0.5" />
                <path d="M10.5 19.5a10.5 10.5 0 0 1 0-15" opacity="0.75" />
                <path d="M13.5 22.5a15 15 0 0 1 0-21" />
              </svg>
            )}
          </div>

          {/* MIDDLE: EMV Chip (front card only) */}
          {isFront && (
            <div className="mt-auto mb-2">
              <div className="w-9 h-7 rounded-[4px] bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-300 border border-amber-400/40 relative overflow-hidden">
                <div className="absolute top-1/2 inset-x-0 h-px bg-amber-600/25" />
                <div className="absolute left-1/2 inset-y-0 w-px bg-amber-600/25" />
                <div className="absolute inset-1 rounded-sm border border-amber-600/20" />
              </div>
            </div>
          )}

          {/* BOTTOM: Number/Name/Expiry (front only) + Dual-circle mark */}
          <div className="flex items-end justify-between mt-auto">
            {isFront && card.fullNumber ? (
              <div className="flex flex-col gap-1 min-w-0">
                <div className="font-mono text-white text-[15px] font-semibold tracking-[0.2em] tabular-nums drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-nowrap">
                  {card.fullNumber}
                </div>
                <div className="flex items-center gap-5 text-white/90">
                  <div>
                    <span className="block text-[7px] uppercase tracking-widest text-white/60 leading-none mb-0.5">Cardholder</span>
                    <span className="font-sans font-bold text-[10px] tracking-wider uppercase drop-shadow-sm">{card.name}</span>
                  </div>
                  <div>
                    <span className="block text-[7px] uppercase tracking-widest text-white/60 leading-none mb-0.5">Expires</span>
                    <span className="font-mono font-bold text-[10px] tracking-wider tabular-nums drop-shadow-sm">{card.expiry}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div /> /* spacer for back cards */
            )}

            {/* Overlapping circles — well inside card padding, no clipping */}
            <div className="flex items-center -space-x-2.5 shrink-0">
              <div className="w-6 h-6 rounded-full bg-white/50" />
              <div className="w-6 h-6 rounded-full bg-white/30" />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   MAIN HERO + SECTIONS
   ========================================================================== */
export default function CardFanHero({ onExploreClick }) {
  const cfg = FAN_CONFIG;
  const reducedMotion = useReducedMotion();

  // Is ?debug=1 in the URL?
  const showDebug = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('debug') === '1';
  }, []);

  const [animPhase, setAnimPhase] = useState(reducedMotion ? 'idle' : 'preloader');
  const [showPreloader, setShowPreloader] = useState(!reducedMotion);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setAnimPhase('idle');
      setShowPreloader(false);
      return;
    }
    const base = cfg.timings.preloaderDuration;
    const t1 = setTimeout(() => { setShowPreloader(false); setAnimPhase('step1'); }, base * 1000);
    const t2 = setTimeout(() => setAnimPhase('step2'), (base + cfg.timings.step2Delay) * 1000);
    const t3 = setTimeout(() => setAnimPhase('step3'), (base + cfg.timings.step3Delay) * 1000);
    const t4 = setTimeout(() => setAnimPhase('idle'),
      (base + cfg.timings.step3Delay + cfg.timings.step3Duration + 0.3) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [replayKey, reducedMotion]);

  const handleReplay = () => {
    setShowPreloader(true);
    setAnimPhase('preloader');
    setReplayKey(k => k + 1);
  };

  // Stagger variants for left-column text
  const containerV = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: reducedMotion ? 0 : cfg.timings.textEntryDelay + 0.2,
        staggerChildren: reducedMotion ? 0 : cfg.timings.textStagger,
      },
    },
  };
  const itemV = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: cfg.ease } },
  };

  return (
    <div key={replayKey} className="w-full bg-white text-[#0F0F0C] font-sans selection:bg-[#A3F574] selection:text-[#163701]">

      {/* ================================================================
          HERO — Lime #A3F574, 2-column: text left, cards right
          ================================================================ */}
      <section className="relative w-full min-h-screen bg-[#A3F574] overflow-hidden flex flex-col">

        {/* ---- Nav bar ---- */}
        <div className="relative z-40 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="SafeSpend" className="w-10 h-10 rounded-xl object-contain" />
            <span className="font-archivo tracking-tight text-xl text-[#163701] uppercase">
              SAFESPEND<span className="opacity-50">.AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {showDebug && (
              <button onClick={handleReplay}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#163701]/10 hover:bg-[#163701]/20 text-[#163701] text-xs font-semibold transition-all active:scale-95 border border-[#163701]/15 font-sans">
                Replay Fan
              </button>
            )}

            <button onClick={onExploreClick}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#163701] text-[#A3F574] text-xs font-bold hover:bg-[#0b1d00] transition-colors shadow-md">
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ---- Preloader ---- */}
        {showPreloader && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#163701] flex flex-col items-center justify-center gap-4 px-6"
            initial={{ opacity: 1 }}
            animate={{ opacity: showPreloader ? 1 : 0 }}
            transition={{ duration: cfg.timings.preloaderFadeOut, ease: 'easeInOut' }}
          >
            <div className="font-archivo text-sm tracking-widest uppercase flex items-center gap-2 text-[#A3F574]">
              <Sparkles className="w-4 h-4 animate-spin" />
              CALCULATING SAFE-TO-SPEND HORIZON
            </div>
            <div className="w-64 sm:w-80 h-2 rounded-full bg-[#A3F574]/20 overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #2DD4EF 0%, #A3F574 50%, #f97316 100%)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: cfg.timings.preloaderDuration, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* ---- Hero 2-column grid ---- */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 flex-1 grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-8 lg:gap-0 py-16 lg:py-0">

          {/* LEFT COLUMN — text, z-30 stays above cards */}
          <motion.div
            className="relative z-30 flex flex-col items-start gap-6 lg:gap-7 max-w-[520px] lg:pr-12"
            variants={containerV}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.div variants={itemV}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#163701] text-[#A3F574] text-xs font-bold tracking-wider uppercase shadow-sm font-sans">
                <span className="w-2 h-2 rounded-full bg-[#A3F574] animate-pulse" />
                AUTONOMOUS DEFENSE ENGINE
              </div>
            </motion.div>

            {/* Headline — clamped tighter to avoid card overlap */}
            <motion.h1 variants={itemV}
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)' }}
              className="font-archivo text-[#163701] uppercase tracking-[-0.02em] leading-[0.88]"
            >
              SMARTER
              <br />
              SPENDING.
              <br />
              <span className="text-[#163701]/85">BOUNDLESS</span>
              <br />
              <span className="text-[#163701]/85">CONTROL.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={itemV}
              className="text-base sm:text-lg text-[#0F0F0C] font-medium leading-relaxed max-w-md"
            >
              Real-time liquidity forecasting and intelligent safety buffers — engineered for modern finances.
            </motion.p>

            {/* CTA */}
            <motion.div variants={itemV} className="pt-1 flex flex-wrap items-center gap-4">
              <button onClick={onExploreClick}
                className="btn text-base px-8 py-4 shadow-xl hover:shadow-2xl transition-all">
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-5 h-5 text-[#A3F574]" />
              </button>
              <div className="flex items-center gap-2 text-xs font-bold text-[#163701]/75 font-mono">
                <Shield className="w-4 h-4 text-[#163701]" />
                <span>Zero Latency • 14-Day Horizon</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN — card fan cluster */}
          <div className="relative w-full h-[380px] sm:h-[440px] lg:h-full min-h-[500px] flex items-center justify-center lg:justify-end z-10">
            <div
              className="absolute transform-gpu
                         scale-[0.68] sm:scale-[0.78] md:scale-[0.9] lg:scale-[0.95] xl:scale-[1.08]
                         right-[-60px] sm:right-[-40px] lg:right-[-80px] xl:right-[-60px]
                         top-[50%] lg:top-[46%]
                         -translate-y-1/2"
              style={{ width: CARD_W + 200, height: CARD_H + 180 }}
            >
              {cfg.cards.map((card, i) => (
                <CreditCard
                  key={card.id}
                  card={card}
                  index={i}
                  isFront={i === cfg.cards.length - 1}
                  animPhase={animPhase}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Debug ticker — only shown with ?debug=1 */}
        {showDebug && (
          <div className="relative z-20 w-full border-t border-[#163701]/15 bg-[#163701]/5 backdrop-blur-md px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-[#163701]/60">
              <span>Angles: -35° -25° -15° -5° +5° · Stagger 80ms · Ease cubic-bezier(0.16,1,0.3,1)</span>
              <span>Phase: {animPhase}</span>
            </div>
          </div>
        )}

      </section>

      {/* ================================================================
          WHITE SECTION — 3 feature cards
          ================================================================ */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3F574] text-[#163701] text-xs font-bold uppercase tracking-wider mb-3">
              Core Architecture
            </div>
            <h2 className="font-archivo text-[#163701] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.95]">
              BUILT FOR DEFENSE.<br />POWERED BY AUTONOMY.
            </h2>
          </div>
          <p className="text-base text-[#0F0F0C]/70 max-w-md font-medium">
            SafeSpend continuously models pending liabilities against volatile inflows to prevent overdrafts before they happen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card card--lime p-8 flex flex-col justify-between h-[340px] border border-[#163701]/15 shadow-card-clean">
            <div className="w-12 h-12 rounded-full bg-[#163701] text-[#A3F574] flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-archivo text-2xl text-[#163701] mb-2 leading-tight">DYNAMIC SAFE-TO-SPEND</h3>
              <p className="text-sm text-[#163701]/90 font-medium">
                Daily variable spending allowance dynamically calibrated against future rent, bills, and delayed inflows.
              </p>
            </div>
          </div>

          <div className="card card--dark p-8 flex flex-col justify-between h-[340px] shadow-card-dark">
            <div className="w-12 h-12 rounded-full bg-[#A3F574] text-[#163701] flex items-center justify-center">
              <Zap className="w-6 h-6 fill-[#163701]" />
            </div>
            <div>
              <h3 className="font-archivo text-2xl text-[#A3F574] mb-2 leading-tight">PROACTIVE INTERVENTIONS</h3>
              <p className="text-sm text-white/80 font-medium">
                Automatic OTT subscription pauses and split payment terms to preserve liquid buffer headroom.
              </p>
            </div>
          </div>

          <div className="card p-8 flex flex-col justify-between h-[340px] border border-[#163701]/15 shadow-card-clean bg-white">
            <div className="w-12 h-12 rounded-full bg-[#163701]/10 text-[#163701] flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-archivo text-2xl text-[#163701] mb-2 leading-tight">AUDITABLE SAFETY BUFFER</h3>
              <p className="text-sm text-[#0F0F0C]/70 font-medium">
                Transparent decision traces and confidence scores for every single autonomous action executed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FOREST SECTION — CTA + simulation card
          ================================================================ */}
      <section className="bg-[#163701] text-[#A3F574] py-24 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3F574]/15 border border-[#A3F574]/30 text-[#A3F574] text-xs font-bold uppercase tracking-wider mb-4 font-mono">
              Live Simulation Sandbox
            </div>
            <h2 className="font-archivo text-white text-4xl sm:text-6xl tracking-tight leading-[0.95] mb-6">
              EXPERIENCE THE SHOCK COLLISION ENGINE
            </h2>
            <p className="text-base text-white/75 font-medium leading-relaxed mb-8">
              Simulate 5-day stipend delays and ₹3,500 expense shocks in real-time. Watch the SafeSpend agent autonomously preserve liquidity.
            </p>
            <button onClick={onExploreClick}
              className="px-8 py-4 rounded-full bg-[#A3F574] text-[#163701] font-bold text-base hover:bg-white transition-all shadow-xl inline-flex items-center gap-3 font-sans">
              <span>Launch Simulator Sandbox</span>
              <ArrowRight className="w-5 h-5 text-[#163701]" />
            </button>
          </div>

          <div className="w-full lg:w-auto flex-1 max-w-lg">
            <div className="bg-white text-[#163701] rounded-[28px] p-7 sm:p-9 shadow-2xl border border-white/20">

              {/* Rate pill — top right */}
              <div className="flex justify-end mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f5f5f0] border border-[#163701]/8 text-xs font-semibold text-[#163701]">
                  <Shield className="w-3.5 h-3.5 text-[#163701]/60" />
                  <span>14-Day Horizon Active</span>
                  <ArrowRight className="w-3 h-3 text-[#163701]/40" />
                </div>
              </div>

              {/* Current Balance — "You send exactly" style */}
              <div className="mb-2">
                <p className="text-sm text-[#0F0F0C]/60 font-medium mb-3">Current liquidity balance</p>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#163701]/12 bg-[#f5f5f0] text-sm font-semibold text-[#163701]">
                    <span className="text-base">🇮🇳</span>
                    <span>INR</span>
                    <svg className="w-3 h-3 text-[#163701]/50" viewBox="0 0 12 12" fill="currentColor"><path d="M3 5l3 3 3-3H3z"/></svg>
                  </div>
                  <span className="font-archivo text-[2.8rem] sm:text-[3.2rem] text-[#163701] leading-none tracking-tight">14,250</span>
                </div>
              </div>

              {/* Discount-style info banner */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A3F574]/25 border border-[#A3F574]/40 text-[11px] font-semibold text-[#163701] mb-8">
                <Shield className="w-3.5 h-3.5 text-[#163701]" />
                <span>Safety buffer of ₹2,000 reserved — <span className="underline underline-offset-2 cursor-pointer">View breakdown</span></span>
              </div>

              {/* Divider */}
              <div className="border-t border-[#163701]/8 mb-6" />

              {/* Safe-to-Spend — "Recipient gets" style */}
              <div className="mb-8">
                <p className="text-sm text-[#0F0F0C]/60 font-medium mb-3">Safe-to-spend today</p>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#163701]/12 bg-[#f5f5f0] text-sm font-semibold text-[#163701]">
                    <span className="text-base">💰</span>
                    <span>Daily</span>
                    <svg className="w-3 h-3 text-[#163701]/50" viewBox="0 0 12 12" fill="currentColor"><path d="M3 5l3 3 3-3H3z"/></svg>
                  </div>
                  <span className="font-archivo text-[2.8rem] sm:text-[3.2rem] text-[#163701] leading-none tracking-tight">850.00</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#163701]/8 mb-6" />

              {/* Info rows — icon + label + value */}
              <div className="space-y-5 mb-8">
                {/* Forecast horizon */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f5f5f0] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#163701]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#0F0F0C]/50 font-medium">Next stipend arrives</p>
                    <p className="text-sm font-bold text-[#163701]">by Thursday</p>
                  </div>
                </div>

                {/* Fees / Commitments */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f5f5f0] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#163701]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#0F0F0C]/50 font-medium">Upcoming commitments</p>
                      <p className="text-sm font-bold text-[#163701]">3 bills pending</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#163701] cursor-pointer">
                    <span className="underline underline-offset-2">₹4,800</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Full-width pill CTA */}
              <button onClick={onExploreClick}
                className="w-full py-4 rounded-full bg-[#163701] text-[#A3F574] font-bold text-sm hover:bg-[#0b1d00] transition-colors">
                Launch Simulator
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          LIFESTYLE APP / EVERYWHERE SECTION (Wise Style)
          ================================================================ */}
      <section className="bg-[#FFFFFF] py-16 sm:py-24 lg:py-28 px-6 sm:px-8 border-t border-[#163701]/8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Full Lifestyle Image (Uncropped, Full Quality) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md sm:max-w-lg rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-[#163701]/12 bg-[#f8f9f6]">
              <img 
                src="/safespend-lifestyle.jpg" 
                alt="Take SafeSpend Everywhere You Go" 
                className="w-full h-auto block object-contain select-none"
                loading="eager"
              />
            </div>
          </div>

          {/* Right Column: Bold Wise-style Tagline & QR Code Badge */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start lg:pl-6">
            <h2 className="font-archivo text-5xl sm:text-6xl lg:text-7xl xl:text-[5.4rem] text-[#0F0F0C] leading-[0.88] tracking-tight uppercase mb-8 sm:mb-10">
              TAKE SAFESPEND<br />
              EVERYWHERE<br />
              YOU GO
            </h2>

            <div className="inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-white border border-[#163701]/15 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm sm:text-base font-semibold text-[#0F0F0C] leading-snug">
                Scan to<br />get the<br /><span className="font-bold text-[#163701]">SafeSpend app</span>
              </div>
              <div className="w-20 h-20 bg-white p-1 rounded-xl border border-[#163701]/12 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="#163701">
                  {/* QR Corners */}
                  <rect x="6" y="6" width="28" height="28" rx="4" fill="none" stroke="#163701" strokeWidth="6"/>
                  <rect x="14" y="14" width="12" height="12" rx="2" fill="#163701"/>
                  <rect x="66" y="6" width="28" height="28" rx="4" fill="none" stroke="#163701" strokeWidth="6"/>
                  <rect x="74" y="14" width="12" height="12" rx="2" fill="#163701"/>
                  <rect x="6" y="66" width="28" height="28" rx="4" fill="none" stroke="#163701" strokeWidth="6"/>
                  <rect x="14" y="74" width="12" height="12" rx="2" fill="#163701"/>
                  {/* QR Pattern dots */}
                  <rect x="42" y="10" width="8" height="8" rx="1.5" />
                  <rect x="54" y="14" width="6" height="6" rx="1" />
                  <rect x="42" y="24" width="6" height="6" rx="1" />
                  <rect x="10" y="42" width="8" height="8" rx="1.5" />
                  <rect x="22" y="46" width="6" height="6" rx="1" />
                  <rect x="40" y="40" width="20" height="20" rx="3" fill="#A3F574" stroke="#163701" strokeWidth="4"/>
                  <rect x="47" y="47" width="6" height="6" rx="1" fill="#163701" />
                  <rect x="68" y="42" width="8" height="8" rx="1.5" />
                  <rect x="82" y="46" width="8" height="8" rx="1.5" />
                  <rect x="44" y="68" width="8" height="8" rx="1.5" />
                  <rect x="56" y="76" width="8" height="8" rx="1.5" />
                  <rect x="70" y="68" width="10" height="10" rx="2" />
                  <rect x="84" y="80" width="8" height="8" rx="1.5" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="bg-white text-[#0F0F0C] border-t border-[#163701]/10 py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="SafeSpend" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-archivo text-[#163701] text-sm uppercase">SAFESPEND.AI — PROACTIVE LIQUIDITY DEFENSE</span>
          </div>
          <p className="text-xs text-[#0F0F0C]/60 font-medium">Archivo Black + Inter · Wise Design Tokens</p>
        </div>
      </footer>

    </div>
  );
}
