import React, { useState, useMemo } from 'react';
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
import CardFanHero from './components/CardFanHero';
import { 
  BASELINE_STATE, 
  INITIAL_COMMITMENTS, 
  INITIAL_INCOMES, 
  calculate14DayProjection 
} from './data/initialState';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  
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

  // Derive dynamic Safe-to-Spend Daily rate
  const safeToSpendDaily = useMemo(() => {
    let rate = 850;
    if (incomeDelayDays > 0) rate -= 350;
    if (expenseShockAmount > 0) rate -= 250;
    if (isOttPaused) rate += 220;
    if (splitPaymentActive) rate += 230;
    return Math.max(120, rate);
  }, [incomeDelayDays, expenseShockAmount, isOttPaused, splitPaymentActive]);

  // Dynamic status evaluation
  const statusInfo = useMemo(() => {
    const hasDisturbance = incomeDelayDays > 0 || expenseShockAmount > 0;
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
  }, [incomeDelayDays, expenseShockAmount, isOttPaused, splitPaymentActive]);

  // Calculate 14-day projection curve
  const projectionData = useMemo(() => {
    return calculate14DayProjection({
      liquidBalance,
      safetyBuffer,
      incomeDelayDays,
      expenseShockAmount,
      isOttPaused,
      splitPaymentActive,
    });
  }, [liquidBalance, safetyBuffer, incomeDelayDays, expenseShockAmount, isOttPaused, splitPaymentActive]);

  // Handler: Inject 5-day stipend delay
  const handleInjectDelay = () => {
    if (incomeDelayDays > 0) {
      setIncomeDelayDays(0);
      showToast('Stipend delay removed. Expected date restored to Oct 3.');
      addLog('INFO', 'DELAY_REVERTED', 'College stipend arrival date reverted to Oct 3 baseline.');
    } else {
      setIncomeDelayDays(5);
      showToast('⚠️ Injected 5-Day Stipend Delay! Safe-to-Spend throttled.');
      addLog('ALERT', 'INCOME_DELAY_INJECTED', 'College stipend delayed by 5 days (from Oct 3 to Oct 8). Arrival confidence reduced to 60%.', '91.2%');
      addNotification(
        'Income Delay Detected',
        'Stipend arrival shifted to Oct 8. Buffer breach projected on Day 6.',
        'warning'
      );
    }
  };

  // Handler: Add ₹3,500 emergency expense shock
  const handleInjectShock = () => {
    if (expenseShockAmount > 0) {
      setLiquidBalance((prev) => prev + expenseShockAmount);
      setExpenseShockAmount(0);
      showToast('Expense shock removed. Liquid balance restored.');
      addLog('INFO', 'EXPENSE_REVERTED', '₹3,500 emergency shock cleared.');
    } else {
      const shock = 3500;
      setExpenseShockAmount(shock);
      setLiquidBalance((prev) => prev - shock);
      showToast('⚠️ Emergency Shock Applied: ₹3,500 debited instantly!');
      addLog('ALERT', 'EXPENSE_SHOCK_INJECTED', '₹3,500 unexpected debit applied. Active balance dropped to ₹10,750.', '98.5%');
      addNotification(
        'Expense Shock Applied',
        '₹3,500 debited. Safe-to-Spend daily limit adjusted defensively.',
        'warning'
      );
    }
  };

  // Handler: Re-calculate Safe-to-Spend
  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      showToast(`AI Recalculation Complete: Safe-to-Spend is ₹${safeToSpendDaily}/day.`);
      addLog('SUCCESS', 'RECALCULATION_DONE', `Re-evaluated dynamic burn vectors. Safe-to-Spend calibrated at ₹${safeToSpendDaily}/day.`);
    }, 700);
  };

  // Handler: Approve Defensive Action (Pause OTT)
  const handleApproveAction = () => {
    setIsOttPaused(true);
    setActionRejected(false);
    showToast('✅ Action Executed: OTT & shopping auto-debits deferred (+₹1,499 saved)!');
    addLog('ACTION_EXECUTED', 'AUTODEBIT_DEFERRED', 'User approved deferral of ₹1,499 OTT subscriptions to Oct 12. Safety buffer restored.', '97.8%');
    addNotification(
      'Defensive Action Approved',
      'Auto-debit of ₹1,499 deferred to Oct 12. Cash balance safeguarded.',
      'success'
    );
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

  // Handler: Reject action
  const handleRejectAction = () => {
    setActionRejected(true);
    showToast('Action dismissed. Feedback recorded in AI reinforcement loop.');
    addLog('WARN', 'ACTION_DISMISSED', 'User opted out of suggested auto-debit deferral. Throttling Safe-to-Spend cap further.', '89.0%');
  };

  // Handler: Full Demo Reset
  const handleResetDemo = () => {
    setLiquidBalance(BASELINE_STATE.liquidBalance);
    setSafetyBuffer(BASELINE_STATE.safetyBuffer);
    setIncomeDelayDays(0);
    setExpenseShockAmount(0);
    setIsOttPaused(false);
    setSplitPaymentActive(false);
    setActionRejected(false);
    setTimeframe('14d');
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
  };

  // Preset scenarios handler for simulator
  const handleTriggerScenario = (scenario) => {
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

      {/* Top Header & Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        hasAlert={statusInfo.isWarning || alertCount > 0}
        alertCount={alertCount}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
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
              />

            </div>

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

    </div>
  );
}
