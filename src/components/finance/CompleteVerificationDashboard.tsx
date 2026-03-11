import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Download, 
  ArrowRight,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
  Lock,
  Timer
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  dueDate: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending_first' | 'awaiting_second' | 'completed' | 'expired';
  verify1Timestamp?: string;
  verify2Timestamp?: string;
  verifiedBy?: string;
}

const CompleteVerificationDashboard: React.FC = () => {
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [verifyStep, setVerifyStep] = useState<0 | 1 | 2>(0); // 0: none, 1: risk acknowledged, 2: confirmed
  const [viewDate, setViewDate] = useState(new Date());
  const [riskChecked, setRiskChecked] = useState(false);

  // Mock data for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TX-9901',
      amount: 45000,
      currency: 'USD',
      recipient: 'Acme Global Corp',
      dueDate: '2026-03-12',
      risk: 'high',
      status: 'pending_first'
    },
    {
      id: 'TX-9902',
      amount: 12500,
      currency: 'SGD',
      recipient: 'TechFlow Solutions',
      dueDate: '2026-03-11',
      risk: 'medium',
      status: 'pending_first'
    },
    {
      id: 'TX-9888',
      amount: 150000,
      currency: 'THB',
      recipient: 'Sovereign Wealth Fund',
      dueDate: '2026-03-10',
      risk: 'critical',
      status: 'completed',
      verify1Timestamp: '2026-03-10 09:12:45',
      verify2Timestamp: '2026-03-10 09:14:22',
      verifiedBy: 'ADMIN_SJ'
    }
  ]);

  const handleExpire = useCallback(() => {
    setIsTimerRunning(false);
    if (activeTransaction) {
      setTransactions(prev => prev.map(tx => 
        tx.id === activeTransaction.id ? { ...tx, status: 'expired' } : tx
      ));
      setActiveTransaction(prev => prev ? { ...prev, status: 'expired' } : null);
    }
    setVerifyStep(0);
  }, [activeTransaction]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleExpire();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft, handleExpire]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFirstVerify = () => {
    setVerifyStep(1);
    setIsTimerRunning(true);
    setTimeLeft(300);
    if (activeTransaction) {
      setTransactions(prev => prev.map(tx => 
        tx.id === activeTransaction.id ? { ...tx, status: 'awaiting_second' } : tx
      ));
    }
  };

  const handleSecondVerify = () => {
    setVerifyStep(2);
  };

  const handleExecute = () => {
    if (activeTransaction) {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setTransactions(prev => prev.map(tx => 
        tx.id === activeTransaction.id ? { 
          ...tx, 
          status: 'completed',
          verify1Timestamp: tx.verify1Timestamp || now, // simplified for demo
          verify2Timestamp: now,
          verifiedBy: 'SJ_ADMIN'
        } : tx
      ));
      setActiveTransaction(null);
      setIsTimerRunning(false);
      setVerifyStep(0);
      setRiskChecked(false);
    }
  };

  // Calendar Helpers
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    const count = daysInMonth(viewDate);
    const start = firstDayOfMonth(viewDate);
    
    for (let i = 0; i < start; i++) days.push(null);
    for (let i = 1; i <= count; i++) days.push(i);
    return days;
  }, [viewDate]);

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="w-full space-y-6 text-text-primary animate-fadeIn p-1">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* SECTION 1: CALENDAR (Left Side) */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="bg-card-bg/60 backdrop-blur-xl border border-border-color shadow-satin rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif font-black text-lg uppercase tracking-tight flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Compliance Calendar
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} 
                  className="p-1 hover:text-primary transition-colors"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold uppercase tracking-widest min-w-[100px] text-center">
                  {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} 
                  className="p-1 hover:text-primary transition-colors"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-[10px] font-black text-text-secondary opacity-50 uppercase">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => (
                <button 
                  key={idx} 
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative cursor-pointer transition-all duration-200 ${
                    day ? 'hover:bg-primary/10' : ''
                  } ${day === new Date().getDate() && viewDate.getMonth() === new Date().getMonth() ? 'bg-primary/20 border border-primary/30' : ''}`}
                >
                  {day}
                  {day && (
                    <div className="flex gap-0.5 mt-0.5">
                      {day % 7 === 0 && <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />}
                      {day % 10 === 0 && <div className="w-1 h-1 rounded-full bg-yellow-400" />}
                      {day % 4 === 0 && <div className="w-1 h-1 rounded-full bg-green-500" />}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border-color/40 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Urgent</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-400" /> Pending</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Verified</div>
            </div>
          </div>

          {/* Time Tracking Section */}
          {isTimerRunning && (
            <div className={`p-6 rounded-2xl border transition-all duration-500 shadow-satin animate-fadeIn ${
              timeLeft < 60 ? 'bg-red-500/10 border-red-500/30' : 'bg-primary-light/5 border-primary/20'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 flex items-center gap-2">
                  <Timer className={`w-3.5 h-3.5 ${timeLeft < 60 ? 'animate-bounce text-red-500' : 'text-primary'}`} />
                  Authorization Window
                </span>
              </div>
              <div className={`text-4xl font-serif font-black tracking-tighter ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-text-primary'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="mt-2 w-full bg-border-color/20 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${timeLeft < 60 ? 'bg-red-500' : 'bg-primary'}`}
                  style={{ width: `${(timeLeft / 300) * 100}%` }}
                />
              </div>
              <p className="text-[10px] mt-3 font-medium opacity-60">Security consensus must be signed before the window expires.</p>
            </div>
          )}
        </div>

        {/* SECTION 3 & 4: TRANSACTION LIST & VERIFICATION (Right Side) */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-card-bg/60 backdrop-blur-xl border border-border-color rounded-2xl overflow-hidden shadow-satin relative min-h-[500px]">
            <div className="p-6 border-b border-border-color flex justify-between items-center bg-white/5">
              <h3 className="font-serif font-black text-lg uppercase tracking-tight">Active Verifications</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <Download className="w-3.5 h-3.5" />
                Export Audit Log
              </button>
            </div>

            <div className="p-4 space-y-3">
              {transactions.map((tx) => (
                <button 
                  key={tx.id}
                  onClick={() => tx.status !== 'completed' && setActiveTransaction(tx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${
                    activeTransaction?.id === tx.id 
                    ? 'bg-primary/5 border-primary shadow-lg ring-1 ring-primary/50' 
                    : tx.status === 'completed'
                    ? 'bg-green-500/5 border-green-500/20 opacity-80'
                    : 'bg-white/5 border-border-color/40 hover:border-primary/40 cursor-pointer'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRiskColor(tx.risk)} bg-opacity-20`}>
                        <ShieldCheck className={`w-5 h-5 ${tx.risk === 'critical' || tx.risk === 'high' ? 'text-red-500' : 'text-primary'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm">{tx.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                            tx.status === 'completed' ? 'bg-green-500/20 text-green-700' : 
                            tx.status === 'expired' ? 'bg-red-500/20 text-red-700' : 'bg-primary/10 text-primary'
                          }`}>
                            {tx.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-tight">{tx.recipient}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8">
                       <div className="text-right">
                          <div className="text-sm font-black text-text-primary px-3 py-1 bg-white/40 rounded-lg border border-border-color/30">
                            {tx.amount.toLocaleString()} <span className="text-[10px] opacity-60">{tx.currency}</span>
                          </div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase mt-1">Due: {tx.dueDate}</p>
                       </div>
                       <ArrowRight className={`w-5 h-5 text-primary transition-all group-hover:translate-x-1 ${tx.status === 'completed' ? 'opacity-0' : 'opacity-100'}`} />
                    </div>
                  </div>

                  {tx.status === 'completed' && (
                    <div className="mt-4 pt-4 border-t border-border-color/20 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase">
                          <User className="w-3 h-3" />
                          Verifier: {tx.verifiedBy}
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase">
                          <Clock className="w-3 h-3" />
                          Acknowledged: {tx.verify1Timestamp}
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          Finalized: {tx.verify2Timestamp}
                       </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* SECTION 5: GLASSMORPHISM VERIFICATION OVERLAY */}
            {activeTransaction && (
              <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-white/20 backdrop-blur-xl animate-fadeIn">
                <div className="w-full max-w-lg bg-card-bg/95 border border-primary/30 rounded-3xl shadow-2xl p-8 space-y-8 relative overflow-hidden text-left">
                   {/* Background HSL Gradient Glow */}
                   <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                   <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />

                   <div className="flex justify-between items-start">
                     <div>
                       <h4 className="font-serif font-black text-2xl uppercase tracking-tighter text-text-primary">Double Verification</h4>
                       <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Secure Authorization Pipeline</p>
                     </div>
                     <button 
                        onClick={() => { setActiveTransaction(null); setVerifyStep(0); setIsTimerRunning(false); setRiskChecked(false); }}
                        className="text-text-secondary hover:text-red-500 transition-colors"
                        aria-label="Close Verification"
                     >
                       <AlertCircle className="w-6 h-6" />
                     </button>
                   </div>

                   <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-3 relative z-20">
                     <div className="flex-shrink-0 mt-0.5">
                       <AlertCircle className="w-5 h-5 text-red-500" />
                     </div>
                     <div>
                       <h5 className="text-[11px] font-black uppercase tracking-tight text-red-500">Security Requirement Level: HIGH</h5>
                       <p className="text-[10px] font-medium text-text-secondary leading-normal mt-1">
                         This transaction exceeds the standard risk threshold. Multi-factor consensus and asset liability acknowledgement are mandatory for execution.
                       </p>
                     </div>
                   </div>

                   <div className="p-5 rounded-2xl bg-white/5 border border-border-color relative z-20">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Transaction Anchor</span>
                        <Lock className="w-3.5 h-3.5 text-primary" />
                     </div>
                     <div className="flex justify-between items-end">
                       <div>
                         <p className="text-xs font-bold text-text-secondary uppercase opacity-60">Recipient</p>
                         <p className="text-lg font-black">{activeTransaction.recipient}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-xs font-bold text-text-secondary uppercase opacity-60">Contract ID</p>
                         <p className="font-mono text-sm">{activeTransaction.id}</p>
                       </div>
                     </div>
                   </div>

                   <div className="flex items-center gap-3 p-2 group cursor-pointer" onClick={() => setRiskChecked(!riskChecked)}>
                     <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${riskChecked ? 'bg-primary border-primary' : 'border-border-color group-hover:border-primary'}`}>
                       {riskChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary group-hover:text-primary transition-colors">I acknowledge the high-risk nature of this asset allocation</span>
                   </div>

                   <div className="space-y-4 relative z-20">
                     {/* Step 1 Button */}
                     <button 
                       disabled={!riskChecked || verifyStep > 0}
                       onClick={handleFirstVerify}
                       className={`w-full group relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-500 ${
                         verifyStep >= 1 
                         ? 'bg-green-500/10 border-green-500/50 text-green-700' 
                         : !riskChecked 
                         ? 'bg-slate-100/5 border-border-color opacity-30 cursor-not-allowed'
                         : 'bg-white/5 border-border-color hover:border-primary/50'
                       }`}
                     >
                       <div className="flex items-center gap-4">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${verifyStep >= 1 ? 'bg-green-500 text-white' : 'bg-primary/20 text-primary'}`}>
                           {verifyStep >= 1 ? <CheckCircle2 className="w-5 h-5" /> : '01'}
                         </div>
                         <span className="font-black uppercase tracking-widest text-sm text-left">Acknowledge Asset Risk</span>
                       </div>
                       {verifyStep === 0 && <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                     </button>

                     {/* Step 2 Button */}
                     <button 
                       disabled={verifyStep !== 1}
                       onClick={handleSecondVerify}
                       className={`w-full group relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-500 ${
                         verifyStep === 2
                         ? 'bg-green-500/10 border-green-500/50 text-green-700' 
                         : verifyStep === 1
                         ? 'bg-white/5 border-primary shadow-lg scale-[1.02]'
                         : 'bg-slate-100/5 border-dashed border-border-color opacity-50 cursor-not-allowed'
                       }`}
                     >
                       <div className="flex items-center gap-4">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${verifyStep === 2 ? 'bg-green-500 text-white' : 'bg-primary/20 text-primary'}`}>
                           {verifyStep === 2 ? <CheckCircle2 className="w-5 h-5" /> : '02'}
                         </div>
                         <div className="text-left">
                            <span className="font-black uppercase tracking-widest text-sm block">Confirm Transaction</span>
                            {verifyStep === 1 && (
                              <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-pulse text-left">
                                <Clock className="w-2.5 h-2.5" /> 
                                Consensus Required within {formatTime(timeLeft)}
                              </span>
                            )}
                         </div>
                       </div>
                       {verifyStep === 1 && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />}
                     </button>

                     {/* Final Execute Button */}
                     <button 
                       disabled={verifyStep !== 2}
                       onClick={handleExecute}
                       className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-serif font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                         verifyStep === 2
                         ? 'satin-effect text-white shadow-2xl scale-105 active:scale-95'
                         : 'bg-slate-500/10 text-text-secondary opacity-30 cursor-not-allowed border border-border-color'
                       }`}
                     >
                       <Zap className={`w-5 h-5 ${verifyStep === 2 ? 'fill-current animate-pulse' : ''}`} />
                       Finalize Execution
                     </button>

                     <div className="flex items-center justify-center gap-6 pt-4 border-t border-border-color/20">
                       <div className="flex items-center gap-1.5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                         <ShieldCheck className="w-3 h-3 text-primary" />
                         <span className="text-[8px] font-black uppercase tracking-[0.2em]">PCI DSS Certified</span>
                       </div>
                       <div className="flex items-center gap-1.5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                         <Lock className="w-3 h-3 text-primary" />
                         <span className="text-[8px] font-black uppercase tracking-[0.2em]">AES-256 Encrypted</span>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteVerificationDashboard;
