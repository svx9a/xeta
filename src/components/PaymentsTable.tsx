import React, { useState, useCallback } from 'react';
import { Payment, PaymentStatus } from '../types';
import { getPaymentRisk } from '../services/geminiService';
import { useTranslation } from '../contexts/LanguageContext';
import { TranslationKeys } from '../translations';

interface PaymentsTableProps {
    payments: Payment[];
    onViewDetails: (payment: Payment) => void;
    onUpdatePayment: (paymentId: string, updates: Partial<Payment>) => void;
}

const StatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
    const { t } = useTranslation();
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full capitalize inline-block";
    const statusClasses: Record<PaymentStatus, string> = {
        captured: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        authorized: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300",
        refunded: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        partially_refunded: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
        voided: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        failed: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{t(status as TranslationKeys)}</span>;
};


const RiskBadge: React.FC<{ risk: 'Low' | 'Medium' | 'High'; reason?: string }> = ({ risk, reason }) => {
    const riskClasses = {
        Low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        High: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    };

    return (
        <div 
            className={`px-2.5 py-1 text-[11px] font-bold rounded border uppercase tracking-wider inline-flex items-center cursor-help transition-all hover:scale-105 ${riskClasses[risk]}`}
            title={reason}
        >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                risk === 'Low' ? 'bg-emerald-500' : risk === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
            }`}></span>
            {risk}
        </div>
    );
};

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments, onViewDetails, onUpdatePayment }) => {
    const [loadingRisks, setLoadingRisks] = useState<Record<string, boolean>>({});
    const { t, currentLang } = useTranslation();

    const isRecent = (date: string) => {
        const paymentDate = new Date(date).getTime();
        const now = new Date().getTime();
        return (now - paymentDate) < 60000; // 1 minute
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(currentLang === 'th' ? 'th-TH' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
            if(result) {
                onUpdatePayment(payment.id, { risk: result.risk, riskReason: result.reason });
            }
        } catch (error) {
            console.error("Failed to assess risk:", error);
            // Optionally show an error to the user
        } finally {
            setLoadingRisks(prev => ({ ...prev, [payment.id]: false }));
        }
    }, [onUpdatePayment, t]);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-secondary">
                <thead className="text-xs text-text-secondary uppercase bg-sidebar-bg/50">
                    <tr>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">{t('date')}</th>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">{t('orderId')}</th>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">{t('paymentMethod')}</th>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">{t('totalAmount')}</th>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">{t('aiRisk')}</th>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">{t('status')}</th>
                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">{t('action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((p) => (
                        <tr key={p.id} className={`border-b border-border-color hover:bg-accent-light/30 transition-colors ${isRecent(p.date) ? 'bg-accent-light/50' : ''}`}>
                            <td className="px-6 py-4 text-text-primary font-medium">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        {formatDate(p.date)}
                                        {isRecent(p.date) && (
                                            <span className="ml-2 px-1.5 py-0.5 text-[9px] satin-effect text-white rounded-sm font-bold animate-pulse uppercase">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">{p.orderId}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-sidebar-bg/50 flex items-center justify-center">
                                        {p.paymentMethod === 'promptpay' ? (
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" alt="PP" className="w-4" referrerPolicy="no-referrer" />
                                        ) : p.paymentMethod === 'credit_card' ? (
                                            <span className="text-[8px] font-bold">CC</span>
                                        ) : (
                                            <span className="text-[8px] font-bold">QR</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t(p.paymentMethod as TranslationKeys)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-text-primary font-bold">{formatCurrency(p.amount, p.currency)}</td>
                            <td className="px-6 py-4">
                                {p.risk ? (
                                    <RiskBadge risk={p.risk} reason={p.riskReason} />
                                ) : (
                                    <button
                                        onClick={() => handleAssessRisk(p)}
                                        disabled={loadingRisks[p.id]}
                                        className="text-[10px] satin-effect hover:opacity-90 text-white font-bold py-1.5 px-3 rounded-md disabled:opacity-50 disabled:cursor-wait uppercase tracking-tighter transition-all active:scale-95"
                                    >
                                        {loadingRisks[p.id] ? t('assessing') : t('assessRisk')}
                                    </button>
                                )}
                            </td>
                            <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                            <td className="px-6 py-4">
                                <button 
                                    onClick={() => onViewDetails(p)} 
                                    className="font-bold text-primary hover:text-accent transition-colors underline underline-offset-4"
                                >
                                    {t('view')}
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
