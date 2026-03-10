// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// ⛔ CRITICAL: DO NOT USE MONACO EDITOR HERE
// ⛔ This is a PRODUCTION PAYMENT PAGE
// ⛔ Monaco would break PCI compliance
// ⛔ Security team will reject PR
// ⛔ Users don't need code editing
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

import React, { useState, useCallback } from 'react';
import { Payment, PaymentStatus } from '../types';
import { getPaymentRisk } from '../services/geminiService';
import { useTranslation } from '../contexts/LanguageContext';
import { Shield, Zap, Eye, CheckCircle2, AlertCircle, Clock, XCircle, Truck } from 'lucide-react';

interface PaymentsTableProps {
    payments: Payment[];
    onViewDetails: (payment: Payment) => void;
    onUpdatePayment: (paymentId: string, updates: Partial<Payment>) => void;
}

const StatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
    const { t } = useTranslation();
    const baseClasses = "px-4 py-2 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] inline-flex items-center gap-2 transition-all shadow-lg border backdrop-blur-md";

    const statusConfig: Record<PaymentStatus, { class: string; icon: React.ReactNode }> = {
        captured: { class: "bg-[#10B981]/5 text-[#10B981] border-[#10B981]/20", icon: <CheckCircle2 className="w-4 h-4" /> },
        authorized: { class: "bg-blue-600/5 text-blue-600 border-blue-600/20", icon: <Shield className="w-4 h-4" /> },
        refunded: { class: "bg-slate-100 text-slate-800/40 border-slate-200", icon: <XCircle className="w-4 h-4" /> },
        partially_refunded: { class: "bg-amber-500/5 text-amber-500 border-amber-500/20", icon: <AlertCircle className="w-4 h-4" /> },
        voided: { class: "bg-slate-100 text-slate-800/20 border-slate-200", icon: <Clock className="w-4 h-4" /> },
        failed: { class: "bg-red-500/5 text-red-500 border-red-500/20", icon: <Zap className="w-4 h-4" /> },
    };

    const config = statusConfig[status];
    return (
        <span className={`${baseClasses} ${config.class}`}>
            {config.icon}
            {t(status as any)}
        </span>
    );
};

const FulfillmentBadge: React.FC<{ status?: string }> = ({ status }) => {
    const { t } = useTranslation();
    if (!status) return null;

    const baseClasses = "px-2.5 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest inline-flex items-center gap-1.5 transition-all shadow-md border mt-1.5 w-fit";

    if (status === 'shipped') {
        return (
            <span className={`${baseClasses} bg-blue-600/10 text-blue-600 border-blue-600/30`}>
                <Truck className="w-3.5 h-3.5" />
                {status}
            </span>
        );
    }

    return (
        <span className={`${baseClasses} bg-slate-100 text-slate-800/30 border-slate-200`}>
            {status}
        </span>
    );
};

const RiskBadge: React.FC<{ risk: 'Low' | 'Medium' | 'High'; reason?: string }> = ({ risk, reason }) => {
    const riskClasses = {
        Low: "bg-[#10B981]/5 text-[#10B981] border-[#10B981]/20",
        Medium: "bg-amber-500/5 text-amber-500 border-amber-500/20",
        High: "bg-red-500/5 text-red-500 border-red-500/20 animate-pulse",
    };

    return (
        <div
            className={`px-4 py-2 text-[10px] font-black rounded-xl border uppercase tracking-[0.2em] inline-flex items-center cursor-help transition-all shadow-lg backdrop-blur-md ${riskClasses[risk]}`}
            title={reason}
        >
            <div className={`w-2 h-2 rounded-full mr-3 shadow-glow ${risk === 'Low' ? 'bg-[#10B981]' :
                risk === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
            {risk}
        </div>
    );
};

const BankIcon: React.FC<{ method: string }> = ({ method }) => {
    const { t } = useTranslation();
    const m = method.toLowerCase();
    const isPP = m === 'promptpay';
    const isSCB = m.includes('scb');
    const isKB = m.includes('kbank');
    const isCC = m === 'credit_card';

    const getThaiBank = () => {
        if (isPP) return { color: '#4F8FC9', label: 'PromptPay', logo: 'PP', fullName: 'PromptPay RTP' };
        if (isSCB) return { color: '#4E2E7F', label: 'SCB', logo: 'S', fullName: 'Siam Commercial' };
        if (isKB) return { color: '#00A950', label: 'KBank', logo: 'K', fullName: 'Kasikorn Bank' };
        return { color: '#4F8FC9', label: method, logo: 'CC', fullName: 'Standard Relay' };
    };

    const bank = getThaiBank();

    return (
        <div className="flex items-center gap-5 group/bank">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 bg-slate-100 border border-slate-200 transition-all duration-700 group-hover/bank:scale-110 group-hover/bank:border-blue-600/30 shadow-xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20" />
                {isCC ? (
                    <Shield className="w-6 h-6 text-blue-600" />
                ) : (
                    <div className="font-black text-xl tracking-tighter" style={{ color: bank.color }}>{bank.logo}</div>
                )}
            </div>
            <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800/80 group-hover/bank:text-blue-600 transition-colors leading-none">
                    {t(method as any)}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-800/20 transition-all group-hover/bank:text-slate-800/40">{bank.fullName}</span>
            </div>
        </div>
    );
};

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments, onViewDetails, onUpdatePayment }) => {
    const [loadingRisks, setLoadingRisks] = useState<Record<string, boolean>>({});
    const { t, currentLang } = useTranslation();

    const isRecent = (date: string) => {
        const paymentDate = new Date(date).getTime();
        const now = new Date().getTime();
        return (now - paymentDate) < 60000;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(currentLang === 'th' ? 'th-TH' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(date);
    };

    const formatFullDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(currentLang === 'th' ? 'th-TH' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat(currentLang === 'th' ? 'th-TH' : 'en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'VND' || currency === 'IDR' ? 0 : 2
        }).format(amount);
    };

    const handleAssessRisk = useCallback(async (payment: Payment) => {
        setLoadingRisks(prev => ({ ...prev, [payment.id]: true }));
        try {
            const result = await getPaymentRisk(payment, t('aiRiskAssessmentDisabled'));
            if (result) {
                onUpdatePayment(payment.id, { risk: result.risk, riskReason: result.reason });
            }
        } catch (error) {
            console.error("Failed to assess risk:", error);
        } finally {
            setLoadingRisks(prev => ({ ...prev, [payment.id]: false }));
        }
    }, [onUpdatePayment, t]);

    return (
        <div className="overflow-x-auto w-full relative z-10 border border-slate-200 rounded-3xl bg-white/40 shadow-2xl backdrop-blur-3xl">
            <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                    <tr className="bg-slate-100">
                        <th scope="col" className="px-8 py-6 text-[10px] font-black text-slate-800/30 uppercase tracking-[0.4em] font-sans border-b border-slate-200">{t('timestamp')}</th>
                        <th scope="col" className="px-8 py-6 text-[10px] font-black text-slate-800/30 uppercase tracking-[0.4em] font-sans hidden md:table-cell border-b border-slate-200">{t('orderId')}</th>
                        <th scope="col" className="px-8 py-6 text-[10px] font-black text-slate-800/30 uppercase tracking-[0.4em] font-sans hidden sm:table-cell border-b border-slate-200">{t('method')}</th>
                        <th scope="col" className="px-8 py-6 text-[10px] font-black text-slate-800/30 uppercase tracking-[0.4em] font-sans border-b border-slate-200">{t('valuation')}</th>
                        <th scope="col" className="px-8 py-6 text-[10px] font-black text-slate-800/30 uppercase tracking-[0.4em] font-sans hidden lg:table-cell border-b border-slate-200">{t('riskTier')}</th>
                        <th scope="col" className="px-8 py-6 text-[10px] font-black text-slate-800/30 uppercase tracking-[0.4em] font-sans hidden xs:table-cell border-b border-slate-200">{t('status')}</th>
                        <th scope="col" className="px-8 py-6 text-[10px] font-black text-slate-800/30 uppercase tracking-[0.4em] font-sans text-right pr-12 border-b border-slate-200">{t('indexing')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-100 transition-all duration-300 group/row">
                            <td className="px-8 py-8">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-slate-800 tracking-widest group-hover/row:text-blue-600 transition-colors font-mono">
                                            {formatDate(p.date)}
                                        </span>
                                        {isRecent(p.date) && (
                                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(79,143,201,0.8)]" />
                                        )}
                                    </div>
                                    <span className="text-[9px] font-black text-slate-800/20 uppercase tracking-[0.3em]">
                                        {formatFullDate(p.date)}
                                    </span>
                                </div>
                            </td>
                            <td className="px-8 py-8 hidden md:table-cell">
                                <div className="flex flex-col gap-2">
                                    <span className="font-mono text-[11px] font-black tracking-[0.2em] text-slate-800/40 uppercase group-hover/row:text-slate-800 transition-colors">{p.orderId}</span>
                                    <FulfillmentBadge status={p.fulfillmentStatus} />
                                </div>
                            </td>
                            <td className="px-8 py-8 hidden sm:table-cell">
                                <BankIcon method={p.paymentMethod} />
                            </td>
                            <td className="px-8 py-8">
                                <div className="text-[17px] font-black text-slate-800 uppercase tracking-widest tabular-nums">
                                    {formatCurrency(p.amount, p.currency)}
                                </div>
                            </td>
                            <td className="px-8 py-8 hidden lg:table-cell">
                                {p.risk ? (
                                    <RiskBadge risk={p.risk} reason={p.riskReason} />
                                ) : (
                                    <button
                                        onClick={() => handleAssessRisk(p)}
                                        disabled={loadingRisks[p.id]}
                                        className="h-10 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-600/5 border border-blue-600/20 hover:bg-blue-600/10 rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {loadingRisks[p.id] ? t('scanning') : t('runAudit')}
                                    </button>
                                )}
                            </td>
                            <td className="px-8 py-8 hidden xs:table-cell"><StatusBadge status={p.status} /></td>
                            <td className="px-8 py-8 text-right pr-12">
                                <button
                                    onClick={() => onViewDetails(p)}
                                    className="w-12 h-12 flex items-center justify-center text-slate-800/20 hover:text-blue-600 hover:bg-blue-600/10 rounded-2xl transition-all border border-transparent hover:border-blue-600/20 shadow-xl group/btn"
                                >
                                    <Eye className="w-6 h-6 group-hover/btn:scale-125 transition-transform" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentsTable;