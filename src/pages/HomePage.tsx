import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import { MOCK_CHART_DATA } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';
import StatCard from '../components/StatCard';
import { Payment } from '../types';
import { usePayments } from '../contexts/PaymentsContext';

const calculateStats = (payments: Payment[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const stats = {
        today: { revenue: 0, count: 0 },
        yesterday: { revenue: 0, count: 0 },
        thisMonth: { revenue: 0, count: 0 },
        lastMonth: { revenue: 0, count: 0 },
    };

    payments.forEach(p => {
        const pDate = new Date(p.date);
        if (p.status !== 'captured' && p.status !== 'partially_refunded' && p.status !== 'authorized') {
            // Include authorized in stats if we want to show "today so far" including pending
            // but usually revenue is captured. Let's stick to captured/partially_refunded for revenue
            // but maybe count all for "count"? 
            // Actually, let's include 'authorized' for count but only captured for revenue.
        }
        
        const revenueAmount = (p.status === 'captured' || p.status === 'partially_refunded') ? p.capturedAmount : 0;

        if (pDate >= today) {
            stats.today.revenue += revenueAmount;
            stats.today.count++;
        } else if (pDate >= yesterday && pDate < today) {
            stats.yesterday.revenue += revenueAmount;
            stats.yesterday.count++;
        }
        
        if (pDate >= thisMonth) {
            stats.thisMonth.revenue += revenueAmount;
            stats.thisMonth.count++;
        } else if (pDate >= lastMonth && pDate <= lastMonthEnd) {
            stats.lastMonth.revenue += revenueAmount;
            stats.lastMonth.count++;
        }
    });

    return stats;
}


const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const { payments } = usePayments();
    const formatCurrency = (value: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(value);
    const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

    const paymentStats = useMemo(() => calculateStats(payments), [payments]);
    
    return (
        <div className="space-y-8 animate-fadeIn max-w-7xl">
            <div className="flex items-end justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">{t('home')}</h1>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Overview of your business performance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                 <StatCard titleKey="todaySoFar" amount={formatCurrency(paymentStats.today.revenue)} paymentCount={paymentStats.today.count} />
                 <StatCard titleKey="yesterday" amount={formatCurrency(paymentStats.yesterday.revenue)} paymentCount={paymentStats.yesterday.count} />
                 <StatCard titleKey="thisMonthSoFar" amount={formatCurrency(paymentStats.thisMonth.revenue)} paymentCount={paymentStats.thisMonth.count} />
                 <StatCard titleKey="lastMonth" amount={formatCurrency(paymentStats.lastMonth.revenue)} paymentCount={paymentStats.lastMonth.count} />
            </div>
            
            <Card className="overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">{t('revenueAnalytics')}</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full satin-effect"></div>
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t('revenue')}</span>
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={MOCK_CHART_DATA}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="satinGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2E8B57" />
                                    <stop offset="100%" stopColor="#228B22" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#2c5955' : '#f1f5f9'} />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `฿${value/1000}k`} 
                                tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }}
                                dx={-10}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--sidebar-bg)', opacity: 0.4 }}
                                contentStyle={{
                                    backgroundColor: 'var(--card-bg)',
                                    borderColor: 'var(--border-color)',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    padding: '12px 16px',
                                    border: '1px solid var(--border-color)'
                                }}
                                itemStyle={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: 'var(--primary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                                labelStyle={{
                                    fontSize: '10px',
                                    fontWeight: 800,
                                    color: 'var(--text-secondary)',
                                    marginBottom: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}
                                formatter={(value: number) => [formatCurrency(value), t('revenue')]}
                            />
                            <Bar 
                                dataKey="revenue" 
                                fill="url(#satinGradient)" 
                                radius={[6, 6, 0, 0]}
                                barSize={32}
                                name={t('revenue') as string} 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default HomePage;