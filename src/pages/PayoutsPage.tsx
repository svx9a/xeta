import React from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { MOCK_PAYOUTS } from '../constants';
import { Payout, PayoutStatus } from '../types';

const PayoutStatusBadge: React.FC<{ status: PayoutStatus }> = ({ status }) => {
    const { t } = useTranslation();
    const baseClasses = "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest inline-block border";
    const statusClasses: Record<PayoutStatus, string> = {
        completed: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
        in_transit: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        pending: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        failed: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{t(status as any)}</span>;
};

const PayoutsPage: React.FC = () => {
    const { t } = useTranslation();
    const formatCurrency = (value: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);

    // Mock data for upcoming payout
    const nextPayout = {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 8430.50,
        status: 'pending' as PayoutStatus
    };

    return (
        <div className="space-y-7 animate-fadeIn max-w-5xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">{t('payouts')}</h1>

            <Card>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">{t('nextPayout')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-sidebar-bg/30 border border-border-color/60 rounded-2xl">
                    <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">{t('payoutDate')}</label>
                        <p className="text-xl font-extrabold text-text-primary tracking-tight">{new Date(nextPayout.date).toLocaleDateString()}</p>
                    </div>
                     <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">{t('status')}</label>
                        <div>
                            <PayoutStatusBadge status={nextPayout.status} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">{t('totalAmount')}</label>
                        <p className="text-2xl font-extrabold text-primary tracking-tight">{formatCurrency(nextPayout.amount)}</p>
                    </div>
                </div>
            </Card>

            <Card padding="p-0" className="overflow-hidden">
                <div className="px-8 py-5 border-b border-border-color/60 bg-sidebar-bg/30">
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">{t('payoutHistory')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-text-secondary uppercase tracking-widest bg-background/50">
                            <tr>
                                <th scope="col" className="px-8 py-4">{t('date')}</th>
                                <th scope="col" className="px-8 py-4">{t('totalAmount')}</th>
                                <th scope="col" className="px-8 py-4">{t('transactions')}</th>
                                <th scope="col" className="px-8 py-4">{t('destination')}</th>
                                <th scope="col" className="px-8 py-4 text-right">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color/60">
                            {MOCK_PAYOUTS.map((payout) => (
                                <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-5 text-sm font-bold text-text-primary tracking-tight">{new Date(payout.date).toLocaleDateString()}</td>
                                    <td className="px-8 py-5 text-sm font-extrabold text-text-primary tracking-tight">{formatCurrency(payout.amount)}</td>
                                    <td className="px-8 py-5 text-xs font-bold text-text-secondary">{payout.transactionCount}</td>
                                    <td className="px-8 py-5 font-mono text-[10px] font-bold text-text-secondary">{payout.destination}</td>
                                    <td className="px-8 py-5 text-right"><PayoutStatusBadge status={payout.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default PayoutsPage;
