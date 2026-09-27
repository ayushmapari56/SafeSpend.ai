import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ForecastChartCard from './components/ForecastChartCard';
import LiquidityStatusCard from './components/LiquidityStatusCard';
import ExplainabilityCard from './components/ExplainabilityCard';
import CommitmentsCard from './components/CommitmentsCard';
import IncomeConfidenceCard from './components/IncomeConfidenceCard';
import ForecastDetailedView from './components/ForecastDetailedView';
import AgentLogsView from './components/AgentLogsView';
import SimulatorView from './components/SimulatorView';
import SplitPaymentModal from './components/SplitPaymentModal';
import NotificationModal from './components/NotificationModal';
import CustomSandboxModal from './components/CustomSandboxModal';
import CardFanHero from './components/CardFanHero';
import RadialAgentBrain from './components/RadialAgentBrain';
import { 
  BASELINE_STATE, 
  INITIAL_COMMITMENTS, 
  INITIAL_INCOMES, 
  calculate14DayProjection 
} from './data/initialState';
import * as api from './services/api';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Maps backend agent engine response into local state fields the UI understands.
 * Backend returns: { math_result, explanation, recommended_action, ... }
 */
function mapBackendResponse(data) {
  const math = data.math_result || {};
  const trajectory = (math.daily_trajectory || []).map((pt, i) => ({
    day: pt.day || `Day ${i + 1}`,
    date: pt.day || `Day ${i + 1}`,
    dayNum: i + 1,
    balance: Math.round(pt.projected_balance ?? 0),
    buffer: pt.safety_buffer ?? 2000,
    isBelowBuffer: (pt.projected_balance ?? 0) < (pt.safety_buffer ?? 2000),
    status: (pt.projected_balance ?? 0) < (pt.safety_buffer ?? 2000) ? 'BREACH' : 'SAFE',
  }));

  return {
    liquidBalance: math.current_balance ?? BASELINE_STATE.liquidBalance,
    safeToSpendDaily: math.daily_safe_to_spend ?? BASELINE_STATE.safeToSpendDaily,
    safetyBuffer: math.safety_buffer ?? BASELINE_STATE.safetyBuffer,
    totalWeightedIncome: math.total_weighted_income ?? 0,
    totalCommittedExpenses: math.total_committed_expenses ?? 0,
    usableLiquidityPool: math.usable_liquidity_pool ?? 0,
    shortfallRisk: math.shortfall_risk ?? false,
    projectionData: trajectory,
    explanation: data.explanation || '',
    recommendedAction: data.recommended_action || {},
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  
  // Backend connectivity state
  const [backendOnline, setBackendOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Core simulation state
  const [liquidBalance, setLiquidBalance] = useState(BASELINE_STATE.liquidBalance);
  const [safetyBuffer, setSafetyBuffer] = useState(BASELINE_STATE.safetyBuffer);
  const [incomeDelayDays, setIncomeDelayDays] = useState(0);
  const [expenseShockAmount, setExpenseShockAmount] = useState(0);
  const [isOttPaused, setIsOttPaused] = useState(false);
  const [splitPaymentActive, setSplitPaymentActive] = useState(false);
  const [actionRejected, setActionRejected] = useState(false);
  const [timeframe, setTimeframe] = useState('14d');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isCustomSandboxOpen, setIsCustomSandboxOpen] = useState(false);
  const [customEvents, setCustomEvents] = useState([]);

  // Agent Brain Pipeline state — animates through LangGraph nodes during processing
  const [isBrainThinking, setIsBrainThinking] = useState(false);
  const [currentBrainStep, setCurrentBrainStep] = useState(0);

  // Animate through pipeline steps: Observer(1) → Predictor(2) → Explainer(3) → Intervener(4)
  const animateBrainPipeline = () => {
    setIsBrainThinking(true);
    setCurrentBrainStep(1);
    setTimeout(() => setCurrentBrainStep(2), 300);
    setTimeout(() => setCurrentBrainStep(3), 600);
    setTimeout(() => setCurrentBrainStep(4), 900);
  };

  const stopBrainPipeline = () => {
    setTimeout(() => {
      setIsBrainThinking(false);
      setCurrentBrainStep(0);
    }, 1200);
  };

  // Backend-derived data
  const [backendProjection, setBackendProjection] = useState(null);
  const [backendExplanation, setBackendExplanation] = useState('');
  const [backendAction, setBackendAction] = useState(null);
  const [backendSafeToSpend, setBackendSafeToSpend] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  // System Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Autonomous Sentinel Active',
      message: 'Monitoring cashflow liquidity horizon across all accounts.',
      time: '10:00 AM',
      type: 'info'
    }
  ]);

  // Agent Audit Logs
  const [logs, setLogs] = useState([
    {
      timestamp: '10:00:02',
      level: 'INFO',
      action: 'INITIAL_STATE_LOADED',
      details: 'Baseline liquid balance verified at ₹14,250. Safety buffer ₹2,000 intact.',
      confidence: '99.4%'
    },
    {
      timestamp: '10:00:03',
      level: 'INFO',
      action: 'SCHEDULE_EVALUATED',
      details: 'Identified 4 upcoming liabilities (₹11,498 total) and 3 expected inflows (₹20,500 total).',
      confidence: '96.2%'
    }
  ]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addLog = (level, action, details, confidence = '95.0%') => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { timestamp: time, level, action, details, confidence },
      ...prev
    ]);
  };

  const addNotification = (title, message, type = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotifications((prev) => [
      { id: 'n_' + Date.now(), title, message, time, type },
      ...prev
    ]);
  };

  /**
   * Apply backend response to all relevant local state.
   */
  const applyBackendData = useCallback((data) => {
    if (!data) return;
    const mapped = mapBackendResponse(data);
    setLiquidBalance(mapped.liquidBalance);
    setSafetyBuffer(mapped.safetyBuffer);
    setBackendSafeToSpend(mapped.safeToSpendDaily);
    if (mapped.projectionData && mapped.projectionData.length > 0) {
      setBackendProjection(mapped.projectionData);
    }
    setBackendExplanation(mapped.explanation);
    setBackendAction(mapped.recommendedAction);

    // Sync disturbance and learning flags from live backend state
    const hasShock = (data.expense_events || []).some(e => e.name === 'Emergency Medical Shock');
    setExpenseShockAmount((prev) => {
      // If shock was active and just got resolved from Telegram:
      if (prev > 0 && !hasShock) {
        showToast('⚡ Telegram Synced: Emergency Shock Resolved by User via Telegram!');
        addLog('ACTION_EXECUTED', 'TELEGRAM_APPROVE_SYNCED', 'Approved via Telegram! Emergency Shock cleared from cashflow buffer.', '99.1%');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
      }
      return hasShock ? 3500 : 0;
    });

    const hasDelay = (data.income_events || []).some(e => (e.probability ?? 1.0) < 0.9);
    setIncomeDelayDays(hasDelay ? 5 : 0);

    const isRejected = Boolean(data.user_preferences?.rejected_cancellation);
    setActionRejected((prev) => {
      if (!prev && isRejected) {
        showToast('⚡ Telegram Synced: User Preference Logged! Model Adapted to Rent Splitting.');
        addLog('ACTION_EXECUTED', 'TELEGRAM_REJECT_SYNCED', 'Rejected via Telegram. LangGraph adapted strategy to payment splitting.', '98.5%');
      }
      return isRejected;
    });
  }, []);

  // On mount — check if backend is reachable and load initial state
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        await api.healthCheck();
        if (cancelled) return;
        setBackendOnline(true);
        addLog('INFO', 'BACKEND_CONNECTED', 'FastAPI engine connected. LangGraph agent workflow online.');

        // Load baseline state from backend
        const data = await api.fetchState();
        if (cancelled) return;
        applyBackendData(data);
        addLog('INFO', 'AGENT_STATE_LOADED', 'Loaded computed state from production agent engine.');
      } catch {
        if (cancelled) return;
        setBackendOnline(false);
        addLog('WARN', 'BACKEND_OFFLINE', 'FastAPI backend not reachable. Running in frontend-only offline mode.');
      }
    }
    init();
    return () => { cancelled = true; };
  }, [applyBackendData]);

  // Real-Time Polling: Periodically sync with backend every 800ms (picks up Telegram Approve/Reject clicks near-instantly)
  useEffect(() => {
    if (!backendOnline) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      if (isLoading || isRecalculating) return;
      try {
        const data = await api.fetchState();
        if (!isMounted) return;
        applyBackendData(data);
      } catch {
        // quiet fallback
      }
    }, 800);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [backendOnline, isLoading, isRecalculating, applyBackendData]);

  // Derive dynamic Safe-to-Spend Daily rate (fallback when backend is offline)
  const localSafeToSpendDaily = useMemo(() => {
    let rate = 850;
    if (incomeDelayDays > 0) rate -= 350;
    if (expenseShockAmount > 0) rate -= 250;
    if (isOttPaused) rate += 220;
    if (splitPaymentActive) rate += 230;
    
    // Adjust for custom events
    if (customEvents.length > 0) {
      customEvents.forEach((evt) => {
        const netDaily = (evt.amount * (evt.type === 'INCOME' ? (evt.probability ?? 1.0) : -1)) / 14;
        rate += Math.round(netDaily);
      });
    }
    return Math.max(120, rate);
  }, [incomeDelayDays, expenseShockAmount, isOttPaused, splitPaymentActive, customEvents]);

  // Use backend value when available, else local
  const safeToSpendDaily = backendSafeToSpend ?? localSafeToSpendDaily;

  // Dynamic status evaluation
  const statusInfo = useMemo(() => {
    const hasDisturbance = incomeDelayDays > 0 || expenseShockAmount > 0 || customEvents.some(e => e.type !== 'INCOME');
    const hasIntervention = isOttPaused || splitPaymentActive;

    if (hasDisturbance && !hasIntervention) {
      return {
        status: 'WARNING',
        message: 'WARNING: SHORTFALL IN 6 DAYS',
        isWarning: true
      };
    } else if (hasDisturbance && hasIntervention) {
      return {
        status: 'RESTORED',
        message: 'STATUS: BUFFER RESTORED',
        isWarning: false
      };
    } else {
      return {
        status: 'SAFE',
        message: 'STATUS: LIQUIDITY SAFE',
        isWarning: false
      };
    }
  }, [incomeDelayDays, expenseShockAmount, isOttPaused, splitPaymentActive, customEvents]);

  // Calculate 14-day projection curve (local fallback)
  const localProjectionData = useMemo(() => {
    return calculate14DayProjection({
      liquidBalance,
      safetyBuffer,
      incomeDelayDays,
      expenseShockAmount,
      isOttPaused,
      splitPaymentActive,
      customEvents,
    });
  }, [liquidBalance, safetyBuffer, incomeDelayDays, expenseShockAmount, isOttPaused, splitPaymentActive, customEvents]);

  // Use backend projection when available, else local
  const projectionData = backendProjection ?? localProjectionData;

  // Handler: Inject 5-day stipend delay → calls backend POST /api/inject-delay
  const handleInjectDelay = async () => {
    if (incomeDelayDays > 0) {
      // Toggle off — reset demo on backend
      setIncomeDelayDays(0);
      setBackendSafeToSpend(null);
      setBackendProjection(null);
      showToast('Stipend delay removed. Expected date restored to Oct 3.');
      addLog('INFO', 'DELAY_REVERTED', 'College stipend arrival date reverted to Oct 3 baseline.');
      
      if (backendOnline) {
        try {
          const data = await api.resetDemo();
          applyBackendData(data);
        } catch { /* fallback to local */ }
      }
      return;
    }

    setIncomeDelayDays(5);
    showToast('⚠️ Injected 5-Day Stipend Delay! Safe-to-Spend throttled.');
    addLog('ALERT', 'INCOME_DELAY_INJECTED', 'College stipend delayed by 5 days (from Oct 3 to Oct 8). Arrival confidence reduced to 60%.', '91.2%');
    addNotification(
      'Income Delay Detected',
      'Stipend arrival shifted to Oct 8. Buffer breach projected on Day 6.',
      'warning'
    );

    if (backendOnline) {
      setIsLoading(true);
      animateBrainPipeline();
      try {
        const data = await api.injectDelay();
        applyBackendData(data);
        addLog('INFO', 'AGENT_RECOMPUTED', `Agent engine recalculated: shortfall_risk=${data.math_result?.shortfall_risk}, daily_safe_to_spend=₹${data.math_result?.daily_safe_to_spend}`);
        
        if (data.math_result?.shortfall_risk) {
          addNotification(
            'Agent: Shortfall Risk Confirmed',
            data.explanation || 'Shortfall detected by production engine.',
            'warning'
          );
        }
      } catch (err) {
        addLog('WARN', 'API_FALLBACK', `inject-delay API failed: ${err.message}. Using local computation.`);
      } finally {
        setIsLoading(false);
        stopBrainPipeline();
      }
    }
  };

  // Handler: Add ₹3,500 emergency expense shock → calls backend POST /api/add-expense
  const handleInjectShock = async () => {
    if (expenseShockAmount > 0) {
      setLiquidBalance((prev) => prev + expenseShockAmount);
      setExpenseShockAmount(0);
      setBackendSafeToSpend(null);
      setBackendProjection(null);
      showToast('Expense shock removed. Liquid balance restored.');
      addLog('INFO', 'EXPENSE_REVERTED', '₹3,500 emergency shock cleared.');
      return;
    }

    const shock = 3500;
    setExpenseShockAmount(shock);
    setLiquidBalance((prev) => prev - shock);
    showToast('⚠️ Emergency Shock Applied: ₹3,500 debited instantly!');
    addLog('ALERT', 'EXPENSE_SHOCK_INJECTED', '₹3,500 unexpected debit applied. Active balance dropped.', '98.5%');
    addNotification(
      'Expense Shock Applied',
      '₹3,500 debited. Safe-to-Spend daily limit adjusted defensively.',
      'warning'
    );

    if (backendOnline) {
      setIsLoading(true);
      animateBrainPipeline();
      try {
        const data = await api.addExpenseShock();
        applyBackendData(data);
        addLog('INFO', 'AGENT_RECOMPUTED', `Agent engine recalculated: usable_liquidity_pool=₹${data.math_result?.usable_liquidity_pool}, shortfall_risk=${data.math_result?.shortfall_risk}`);
        
        if (data.math_result?.shortfall_risk) {
          addNotification(
            'Agent: Shortfall Escalated',
            data.explanation || 'Emergency shock escalated shortfall risk.',
            'warning'
          );
        }
      } catch (err) {
        addLog('WARN', 'API_FALLBACK', `add-expense API failed: ${err.message}. Using local computation.`);
      } finally {
        setIsLoading(false);
        stopBrainPipeline();
      }
    }
  };

  // Handler: Re-calculate Safe-to-Spend → calls backend GET /api/state
  const handleRecalculate = async () => {
    setIsRecalculating(true);
    
    if (backendOnline) {
      try {
        const data = await api.fetchState();
        applyBackendData(data);
        showToast(`AI Recalculation Complete: Safe-to-Spend is ₹${data.math_result?.daily_safe_to_spend ?? safeToSpendDaily}/day.`);
        addLog('SUCCESS', 'RECALCULATION_DONE', `Re-evaluated via production agent engine. Safe-to-Spend calibrated at ₹${data.math_result?.daily_safe_to_spend ?? safeToSpendDaily}/day.`);
      } catch (err) {
        showToast(`AI Recalculation Complete: Safe-to-Spend is ₹${safeToSpendDaily}/day.`);
        addLog('SUCCESS', 'RECALCULATION_DONE', `Re-evaluated dynamic burn vectors (local). Safe-to-Spend calibrated at ₹${safeToSpendDaily}/day.`);
      } finally {
        setIsRecalculating(false);
      }
    } else {
      setTimeout(() => {
        setIsRecalculating(false);
        showToast(`AI Recalculation Complete: Safe-to-Spend is ₹${safeToSpendDaily}/day.`);
        addLog('SUCCESS', 'RECALCULATION_DONE', `Re-evaluated dynamic burn vectors. Safe-to-Spend calibrated at ₹${safeToSpendDaily}/day.`);
      }, 700);
    }
  };

  // Handler: Approve Defensive Action (Pause OTT) → sends APPROVE feedback to backend
  const handleApproveAction = async () => {
    setIsOttPaused(true);
    setActionRejected(false);
    showToast('✅ Action Executed: OTT & shopping auto-debits deferred (+₹1,499 saved)!');
    addLog('ACTION_EXECUTED', 'AUTODEBIT_DEFERRED', 'User approved deferral of ₹1,499 OTT subscriptions to Oct 12. Safety buffer restored.', '97.8%');
    addNotification(
      'Defensive Action Approved',
      'Auto-debit of ₹1,499 deferred to Oct 12. Cash balance safeguarded.',
      'success'
    );

    if (backendOnline) {
      animateBrainPipeline();
      try {
        const data = await api.sendFeedback('APPROVE');
        applyBackendData(data);
        addLog('INFO', 'FEEDBACK_PROCESSED', 'APPROVE feedback sent to agent engine. Continuous learning cycle updated.');
      } catch (err) {
        addLog('WARN', 'FEEDBACK_FALLBACK', `user-feedback API failed: ${err.message}. Feedback recorded locally.`);
      } finally {
        stopBrainPipeline();
      }
    }
  };

  // Handler: Split Rent payment
  const handleApplySplit = () => {
    setSplitPaymentActive(true);
    showToast('✅ Split Payment Activated: Apartment rent split into 2 installments of ₹4,000!');
    addLog('ACTION_EXECUTED', 'PAYMENT_SPLIT_APPLIED', 'Apartment Rent split into Oct 1 (₹4,000) and Oct 9 (₹4,000). Immediate liquidity protected.', '96.5%');
    addNotification(
      'Payment Terms Split',
      'Rent payment split approved. ₹4,000 retained in liquid buffer.',
      'success'
    );
  };

  // Handler: Reject action → sends REJECT feedback to backend (triggers learning loop)
  const handleRejectAction = async () => {
    setActionRejected(true);
    showToast('Action dismissed. Feedback recorded in AI reinforcement loop.');
    addLog('WARN', 'ACTION_DISMISSED', 'User opted out of suggested auto-debit deferral. Throttling Safe-to-Spend cap further.', '89.0%');

    if (backendOnline) {
      animateBrainPipeline();
      try {
        const data = await api.sendFeedback('REJECT');
        applyBackendData(data);
        addLog('INFO', 'LEARNING_CYCLE', `REJECT feedback processed. Agent adapted: now recommends "${data.recommended_action?.title || 'alternative strategy'}".`);
        
        // If backend adapted its recommendation (e.g., to PAYMENT_SPLIT), show it
        if (data.recommended_action?.type === 'PAYMENT_SPLIT') {
          addNotification(
            'Agent Adapted Strategy',
            data.recommended_action.title || 'Split payment recommended instead of subscription pause.',
            'info'
          );
        }
      } catch (err) {
        addLog('WARN', 'FEEDBACK_FALLBACK', `user-feedback API failed: ${err.message}. Feedback recorded locally.`);
      } finally {
        stopBrainPipeline();
      }
    }
  };

  // Handler: Dynamic Custom Event Injection (Live Judge Sandbox) → calls POST /api/custom-event
  const handleInjectCustomEvent = async (eventData) => {
    setCustomEvents((prev) => [eventData, ...prev]);

    const isIncome = eventData.type === 'INCOME';
    const amtStr = `₹${eventData.amount.toLocaleString('en-IN')}`;
    
    showToast(`⚡ Live Injected: ${eventData.name} (${isIncome ? '+' : '-'}${amtStr}) on Day ${eventData.day}!`);
    addLog(
      isIncome ? 'SUCCESS' : 'ALERT',
      'CUSTOM_EVENT_INJECTED',
      `Live Judge Demo: Injected ${eventData.type} "${eventData.name}" of ${amtStr} at Day ${eventData.day} into formula engine.`,
      '99.5%'
    );

    addNotification(
      `Live Custom Event: ${eventData.name}`,
      `${isIncome ? 'Credit' : 'Debit'} of ${amtStr} scheduled on Day ${eventData.day}. 14-day cashflow recalculated.`,
      isIncome ? 'info' : 'warning'
    );

    if (backendOnline) {
      setIsLoading(true);
      animateBrainPipeline();
      try {
        const data = await api.injectCustomEvent(eventData);
        applyBackendData(data);
        addLog('INFO', 'AGENT_ENGINE_RECOMPUTED', `LangGraph Agent recomputed live state: shortfall_risk=${data.math_result?.shortfall_risk}, daily_safe_to_spend=₹${data.math_result?.daily_safe_to_spend}`);
        
        if (data.math_result?.shortfall_risk) {
          addNotification(
            'Agent: Shortfall Warning Triggered',
            data.explanation || 'Custom transaction caused liquidity pool shortfall.',
            'warning'
          );
        }
      } catch (err) {
        addLog('WARN', 'API_FALLBACK', `custom-event API failed: ${err.message}. Using dynamic frontend engine.`);
      } finally {
        setIsLoading(false);
        stopBrainPipeline();
      }
    }
  };

  // Handler: Clear all injected custom events
  const handleClearCustomEvents = async () => {
    setCustomEvents([]);
    showToast('Cleared all custom injected events.');
    addLog('INFO', 'CUSTOM_EVENTS_CLEARED', 'All custom live test events removed from session.');
    
    if (backendOnline) {
      try {
        const data = await api.resetDemo();
        applyBackendData(data);
      } catch { /* ignore fallback */ }
    }
  };

  // Handler: Full Demo Reset → calls backend POST /api/reset-demo
  const handleResetDemo = async () => {
    setLiquidBalance(BASELINE_STATE.liquidBalance);
    setSafetyBuffer(BASELINE_STATE.safetyBuffer);
    setIncomeDelayDays(0);
    setExpenseShockAmount(0);
    setIsOttPaused(false);
    setSplitPaymentActive(false);
    setActionRejected(false);
    setTimeframe('14d');
    setCustomEvents([]);
    setBackendSafeToSpend(null);
    setBackendProjection(null);
    setBackendExplanation('');
    setBackendAction(null);
    showToast('⚡ Demo Script Reset: All metrics returned to baseline state!');
    addLog('INFO', 'DEMO_RESET', 'Entire system state restored to clean baseline.');
    setNotifications([
      {
        id: 'n_reset',
        title: 'Demo Script Reset',
        message: 'System restored to pristine baseline state.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'info'
      }
    ]);

    if (backendOnline) {
      try {
        const data = await api.resetDemo();
        applyBackendData(data);
        addLog('INFO', 'BACKEND_RESET', 'Backend session state also reset to baseline via /api/reset-demo.');
      } catch (err) {
        addLog('WARN', 'RESET_FALLBACK', `reset-demo API failed: ${err.message}. Backend may be out of sync.`);
      }
    }
  };

  // Preset scenarios handler for simulator
  const handleTriggerScenario = (scenario) => {
    // Clear backend overrides so local sim takes over for simulator
    setBackendSafeToSpend(null);
    setBackendProjection(null);

    if (scenario === 'scenario1') {
      setIncomeDelayDays(5);
      setExpenseShockAmount(0);
      setIsOttPaused(false);
      showToast('Loaded Scenario 1: 5-Day Stipend Delay');
    } else if (scenario === 'scenario2') {
      setIncomeDelayDays(5);
      setExpenseShockAmount(3500);
      setLiquidBalance(10750);
      setIsOttPaused(false);
      showToast('Loaded Scenario 2: Double Shock Collision');
    } else if (scenario === 'scenario3') {
      setIncomeDelayDays(5);
      setExpenseShockAmount(3500);
      setLiquidBalance(10750);
      setIsOttPaused(true);
      setSplitPaymentActive(true);
      confetti({ particleCount: 70, spread: 60, colors: ['#f97316', '#10b981'] });
      showToast('Loaded Scenario 3: Autonomous Defense Active');
    }
  };

  const alertCount = notifications.filter((n) => n.type === 'warning').length;

  if (activeTab === 'hero') {
    return <CardFanHero onExploreClick={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#0F0F0C] flex flex-col font-sans selection:bg-[#A3F574] selection:text-[#163701] pb-16">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#163701] text-[#A3F574] shadow-2xl text-xs font-bold backdrop-blur-xl animate-fade-in font-sans border border-[#A3F574]/30">
          <Sparkles className="w-4 h-4 text-[#A3F574] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Backend Status Indicator */}
      <div className={`fixed top-2 right-2 z-[60] flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono transition-all duration-500 ${
        backendOnline 
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
          : 'bg-stone-100 text-stone-500 border border-stone-200'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`}></span>
        {backendOnline ? 'Engine Online' : 'Offline Mode'}
      </div>

      {/* Loading Overlay for API calls */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/5 z-40 flex items-center justify-center backdrop-blur-[1px] pointer-events-none">
          <div className="px-6 py-3 rounded-2xl bg-white/95 border border-orange-200 shadow-xl text-xs font-bold text-orange-700 flex items-center gap-2.5 animate-pulse font-mono">
            <svg className="animate-spin h-4 w-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Agent Engine Processing...
          </div>
        </div>
      )}

      {/* Top Header & Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        hasAlert={statusInfo.isWarning || alertCount > 0}
        alertCount={alertCount}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
        onOpenCustomSandbox={() => setIsCustomSandboxOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Welcome & Subtitle Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-archivo uppercase tracking-tight text-[#163701] flex items-center gap-2.5">
              Welcome Back, Rahul!
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#A3F574] shadow-sm animate-pulse ring-4 ring-[#163701]/10"></span>
            </h1>
            <p className="text-xs sm:text-sm text-[#0F0F0C]/70 mt-1 font-sans font-medium">
              Proactive Liquidity & Safe-to-Spend Protection Engine
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto px-4 py-1.5 rounded-full bg-[#A3F574] text-[#163701] border border-[#163701]/20 shadow-sm font-sans">
            <span className="text-xs font-bold">Live Sentinel Active</span>
            <span className="w-2 h-2 rounded-full bg-[#163701] animate-ping"></span>
          </div>
        </div>

        {/* Dynamic Tab Content Views */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            
            {/* Top Row Grid: Two Large Feature Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Card: 14-Day Safe-to-Spend Forecast Chart */}
              <ForecastChartCard
                projectionData={projectionData}
                safeToSpendDaily={safeToSpendDaily}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                isWarning={statusInfo.isWarning}
                safetyBuffer={safetyBuffer}
              />

              {/* Right Card: Liquidity Status & Demo Controllers */}
              <LiquidityStatusCard
                liquidBalance={liquidBalance}
                status={statusInfo.status}
                statusMessage={statusInfo.message}
                incomeDelayDays={incomeDelayDays}
                expenseShockAmount={expenseShockAmount}
                onInjectDelay={handleInjectDelay}
                onInjectShock={handleInjectShock}
                onRecalculate={handleRecalculate}
                onResetDemo={handleResetDemo}
                isRecalculating={isRecalculating}
                onOpenCustomSandbox={() => setIsCustomSandboxOpen(true)}
                customEventsCount={customEvents.length}
              />

            </div>

            {/* Sci-Fi Palantir/Grok Style Radial Neural Halo Graph */}
            <RadialAgentBrain
              isExecuting={isBrainThinking}
              shortfallDetected={statusInfo.isWarning}
            />

            {/* AI Explainability & Active Interventions Panel (Wide Card) */}
            <ExplainabilityCard
              status={statusInfo.status}
              incomeDelayDays={incomeDelayDays}
              expenseShockAmount={expenseShockAmount}
              isOttPaused={isOttPaused}
              splitPaymentActive={splitPaymentActive}
              actionRejected={actionRejected}
              safeToSpendDaily={safeToSpendDaily}
              onApproveAction={handleApproveAction}
              onOpenSplitModal={() => setIsSplitModalOpen(true)}
              onRejectAction={handleRejectAction}
              backendExplanation={backendExplanation}
              backendAction={backendAction}
            />

            {/* Bottom Row Grid: Commitments & Trust Scores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Upcoming Fixed Liabilities */}
              <CommitmentsCard
                commitments={INITIAL_COMMITMENTS}
                isOttPaused={isOttPaused}
                splitPaymentActive={splitPaymentActive}
              />

              {/* Incomes & Confidence Scores */}
              <IncomeConfidenceCard
                incomes={INITIAL_INCOMES}
                incomeDelayDays={incomeDelayDays}
              />

            </div>

          </div>
        )}

        {activeTab === 'forecast' && (
          <ForecastDetailedView
            projectionData={projectionData}
            safeToSpendDaily={safeToSpendDaily}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            isWarning={statusInfo.isWarning}
            safetyBuffer={safetyBuffer}
          />
        )}

        {activeTab === 'logs' && (
          <AgentLogsView logs={logs} />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView
            incomeDelayDays={incomeDelayDays}
            setIncomeDelayDays={setIncomeDelayDays}
            expenseShockAmount={expenseShockAmount}
            setExpenseShockAmount={setExpenseShockAmount}
            safetyBuffer={safetyBuffer}
            setSafetyBuffer={setSafetyBuffer}
            onResetDemo={handleResetDemo}
            onTriggerScenario={handleTriggerScenario}
            onInjectCustomEvent={handleInjectCustomEvent}
            customEvents={customEvents}
            onClearCustomEvents={handleClearCustomEvents}
          />
        )}

      </main>

      {/* Split Payment Modal */}
      <SplitPaymentModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        onApplySplit={handleApplySplit}
        splitPaymentActive={splitPaymentActive}
      />

      {/* System Notifications Drawer Modal */}
      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifications}
        onClearAll={() => setNotifications([])}
      />

      {/* Custom Transaction Sandbox Modal for Live Judge Testing */}
      <CustomSandboxModal
        isOpen={isCustomSandboxOpen}
        onClose={() => setIsCustomSandboxOpen(false)}
        onInjectCustomEvent={handleInjectCustomEvent}
        customEvents={customEvents}
        onClearCustomEvents={handleClearCustomEvents}
      />

    </div>
  );
}
