import React, { useState, useEffect } from 'react';
import { 
    ShieldCheckIcon, 
    ExclamationCircleIcon, 
    XIcon, 
    CheckCircleIcon,
    ZapIcon,
    AtomIcon
} from './icons';

interface DoubleVerifyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transactionDetails: {
    amount: number;
    recipient: string;
    riskLevel: 'high' | 'critical' | 'medium';
    transactionId: string;
  };
}

const DoubleVerifyPaymentModal: React.FC<DoubleVerifyPaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transactionDetails
}) => {
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [step1Verified, setStep1Verified] = useState(false);
  const [step2Verified, setStep2Verified] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Reset state when modal closes/opens
  useEffect(() => {
    if (!isOpen) {
      setHasAcknowledged(false);
      setStep1Verified(false);
      setStep2Verified(false);
      setIsExecuting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isHighRisk = transactionDetails.riskLevel === 'high' || transactionDetails.riskLevel === 'critical';
  
  const riskColorClass = isHighRisk 
    ? 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' 
    : 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';

  const handleExecute = () => {
    setIsExecuting(true);
    // Simulate slight delay for effect
    setTimeout(() => {
      onConfirm();
      setIsExecuting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-sidebar-bg w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-border-color transform transition-all">
        
        {/* Header with Risk Warning */}
        <div className={`p-6 border-b border-border-color ${riskColorClass}`}>
          <div className="flex items-center gap-3">
            <ExclamationCircleIcon className="w-8 h-8 animate-pulse" />
            <div>
              <h2 className="text-lg font-black uppercase tracking-tighter">
                {transactionDetails.riskLevel === 'critical' ? 'Critical Security Protocol' : 'Enhanced Verification Required'}
              </h2>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">
                Transaction flagged for manual override
              </p>
            </div>
            <button 
              onClick={onClose}
              className="ml-auto p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Transaction Details */}
          <div className="bg-background dark:bg-black/20 rounded-2xl p-6 border border-border-color/50">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Recipient</p>
                <p className="text-sm font-bold text-text-primary break-all">{transactionDetails.recipient}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Amount</p>
                <p className="text-xl font-black text-primary">${transactionDetails.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border-color/30">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Transaction ID</p>
              <p className="text-[10px] font-mono text-text-primary/70">{transactionDetails.transactionId}</p>
            </div>
          </div>

          {/* Risk Acknowledgment */}
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={hasAcknowledged}
                onChange={(e) => setHasAcknowledged(e.target.checked)}
                className="peer hidden"
              />
              <div className="w-6 h-6 border-2 border-border-color rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                {hasAcknowledged && <CheckCircleIcon className="w-4 h-4 text-white" />}
              </div>
            </div>
            <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
              I acknowledge that this transaction exceeds standard risk parameters and I am authorized to execute this manual override.
            </span>
          </label>

          {/* Sequential Verification Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              disabled={!hasAcknowledged || step1Verified}
              onClick={() => setStep1Verified(true)}
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 border-2 
                ${step1Verified 
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : !hasAcknowledged 
                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-white border-primary text-primary hover:bg-primary hover:text-white dark:bg-transparent'}`}
            >
              {step1Verified ? <ShieldCheckIcon className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-primary animate-ping" />}
              {step1Verified ? 'Validated' : 'Verify Integrity'}
            </button>

            <button
              disabled={!step1Verified || step2Verified}
              onClick={() => setStep2Verified(true)}
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 border-2 
                ${step2Verified 
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : !step1Verified 
                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-white border-primary text-primary hover:bg-primary hover:text-white dark:bg-transparent'}`}
            >
              {step2Verified ? <ShieldCheckIcon className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-primary animate-ping" />}
              {step2Verified ? 'Authorized' : 'Sign Consensus'}
            </button>
          </div>

          {/* Final Action */}
          <button
            disabled={!step2Verified || isExecuting}
            onClick={handleExecute}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 satin-effect text-white shadow-satin
              ${!step2Verified ? 'opacity-20 grayscale pointer-events-none' : 'hover:scale-[1.02] active:scale-95'}`}
          >
            <div className="flex items-center justify-center gap-3">
              {isExecuting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ZapIcon className="w-5 h-5 neon-aura" />
                  <span>Execute Settlement</span>
                </>
              )}
            </div>
          </button>

          {/* Footer / Compliance */}
          <div className="flex items-center justify-between pt-4 border-t border-border-color/30">
            <div className="flex items-center gap-2">
              <AtomIcon className="w-4 h-4 text-primary" />
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-tighter">Enterprise Immutable Ledger</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-white/5 border border-border-color/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-black text-text-primary tracking-tighter">PCI DSS COMPLIANT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubleVerifyPaymentModal;
