import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import StatCard from '../components/StatCard';
import { Payment } from '../types';
import { usePayments } from '../contexts/PaymentsContext';
import { Activity, CreditCard, ExternalLink, Loader2 } from 'lucide-react';
import { fetchRevenueStream } from '../services/edgeClient';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MOCK_CHART_DATA } from '../constants';
import { getPaymentRisk } from '../services/geminiService';

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
    const [chartData, setChartData] = useState<unknown[]>(MOCK_CHART_DATA);
    const [loadingChart, setLoadingChart] = useState(false);
    const [paymentRisks, setPaymentRisks] = useState<Record<string, { risk: 'Low' | 'Medium' | 'High'; reason: string } | null>>({});
    const fetchedPaymentIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        (async () => {
            setLoadingChart(true);
            const liveData = await fetchRevenueStream();
            if (liveData && liveData.length > 0) {
                setChartData(liveData);
            }
            setLoadingChart(false);
        })();
    }, []);

    useEffect(() => {
        const recentPayments = payments.slice(0, 5);
        const fetchRisks = async () => {
            const newRisks: Record<string, { risk: 'Low' | 'Medium' | 'High'; reason: string } | null> = {};
            for (const payment of recentPayments) {
                if (!fetchedPaymentIds.current.has(payment.id)) {
                    fetchedPaymentIds.current.add(payment.id);
                    const risk = await getPaymentRisk(payment, 'Local assessment');
                    newRisks[payment.id] = risk;
                }
            }
            if (Object.keys(newRisks).length > 0) {
                setPaymentRisks(prev => ({ ...prev, ...newRisks }));
            }
        };
        if (recentPayments.length > 0) {
            fetchRisks();
        }
    }, [payments]);

    const formatCurrency = (value: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(value);

    const paymentStats = useMemo(() => calculateStats(payments), [payments]);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-white" />
            <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-[-20%] left-[-10%] w-[700px] h-[700px] bg-gradient-to-r from-gray-50 to-gray-100 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Scanning Beam */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-scanline opacity-40 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8 space-y-8 animate-fadeIn">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-mercury-200/50">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-[2px] bg-gradient-to-r from-mercury-400 to-mercury-600" />
                            <span className="text-[10px] font-black text-mercury-600 tracking-[0.4em] uppercase">Operational Control</span>
                        </div>
                        <h1 className="text-xl lg:text-3xl font-black text-mercury-900 tracking-tighter uppercase leading-none">
                            XETA_CORE Dashboard
                        </h1>
                        <p className="text-[11px] font-black text-mercury-600 uppercase tracking-[0.5em]">
                            Real-time Node Monitoring & Volume Aggregates
                        </p>
                    </div>
                    <div className="flex items-center gap-6 px-8 py-6 bg-white/90 backdrop-blur-xl rounded-3xl border border-mercury-200/50 shadow-2xl group hover:border-mercury-300/30 transition-all duration-500">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-mercury-600 uppercase tracking-[0.2em] mb-2">System Integrity</span>
                            <span className="text-xs font-black text-mercury-900 uppercase tracking-widest">Node_Status: Safe</span>
                        </div>
                        <div className="relative">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-mercury-500 to-mercury-600 shadow-lg z-10 relative" />
                            <div className="absolute inset-0 bg-mercury-500 rounded-full animate-ping opacity-40" />
                        </div>
                    </div>
                </div>

                {/* Core Metrics Cluster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatCard titleKey="todaySoFar" amount={formatCurrency(paymentStats.today.revenue)} paymentCount={paymentStats.today.count} onClick={() => window.location.hash = '/payments'} />
                    <StatCard titleKey="yesterday" amount={formatCurrency(paymentStats.yesterday.revenue)} paymentCount={paymentStats.yesterday.count} trend="down" trendValue="-4.1%" onClick={() => window.location.hash = '/payments'} />
                    <StatCard titleKey="thisMonthSoFar" amount={formatCurrency(paymentStats.thisMonth.revenue)} paymentCount={paymentStats.thisMonth.count} trend="up" trendValue="+22.5%" onClick={() => window.location.hash = '/payments'} />
                    <StatCard titleKey="lastMonth" amount={formatCurrency(paymentStats.lastMonth.revenue)} paymentCount={paymentStats.lastMonth.count} onClick={() => window.location.hash = '/payments'} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Chart Architecture */}
                    <div
                        className="xl:col-span-2 bg-white/85 backdrop-blur-2xl rounded-[3rem] p-8 lg:p-12 border border-white/20 relative overflow-hidden group shadow-2xl transition-all duration-700 hover:border-white/30 hover:translate-y-[-4px] hover:bg-white/90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2"
                        onClick={() => window.location.hash = '/reports'}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.hash = '/reports'; } }}
                        tabIndex={0}
                        role="button"
                        aria-label="View volume trend reports"
                    >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-mercury-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div>
                                <h2 className="text-3xl font-black text-mercury-900 uppercase tracking-tight leading-none mb-2">Volume Trend</h2>
                                <p className="text-[10px] font-black text-mercury-600 uppercase tracking-[0.4em] opacity-70">30-Day Liquidity Matrix</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-r from-mercury-100 to-mercury-200 rounded-3xl flex items-center justify-center border border-mercury-300/30 group-hover:rotate-12 transition-transform duration-500 shadow-xl">
                                <Activity className="w-8 h-8 text-mercury-600" />
                            </div>
                        </div>

                        <div className="h-[400px] w-full relative">
                            {loadingChart && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[3rem]">
                                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                                </div>
                            )}
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#737373" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#737373" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(115, 115, 115, 0.02)" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(115, 115, 115, 0.6)', fontSize: 10, fontWeight: 900 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(115, 115, 115, 0.6)', fontSize: 10, fontWeight: 900 }}
                                        tickFormatter={(val) => `฿${val / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid rgba(115, 115, 115, 0.2)',
                                            borderRadius: '20px',
                                            padding: '16px',
                                            boxShadow: '0 20px 40px rgba(115, 115, 115, 0.1)',
                                            backdropFilter: 'blur(20px)'
                                        }}
                                        itemStyle={{ color: '#171717', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                                        cursor={{ stroke: '#737373', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#737373"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        animationDuration={2500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Stream */}
                    <div className="bg-white/85 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/20 flex flex-col relative shadow-2xl group hover:border-white/30 transition-all duration-700 hover:bg-white/90">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-mercury-900 uppercase tracking-tight">Access Stream</h2>
                            <button
                                onClick={() => window.location.hash = '/payments'}
                                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-mercury-100 to-mercury-200 rounded-lg border border-mercury-300/30 text-sm font-bold text-mercury-700 uppercase tracking-wide hover:bg-gradient-to-r hover:from-mercury-200 hover:to-mercury-300 hover:text-mercury-900 transition-all duration-500 shadow-lg group/btn min-h-[44px] focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2"
                            >
                                {t('viewAll')}
                                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {payments.slice(0, 5).map((p) => {
                                const risk = paymentRisks[p.id];
                                return (
                                    <div
                                        key={p.id}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-mercury-50 to-white border border-mercury-200/50 hover:border-mercury-300/30 hover:from-mercury-100 hover:to-mercury-50 transition-all duration-500 group/item cursor-pointer focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2"
                                        onClick={() => window.location.hash = '/payments'}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.hash = '/payments'; } }}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`View details for payment by ${p.customer.name}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-mercury-200/50 flex items-center justify-center text-mercury-400 group-hover/item:text-mercury-600 group-hover/item:border-mercury-300/30 transition-all duration-500 shadow-sm">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-mercury-900 uppercase tracking-tighter leading-none mb-1">{p.customer.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${p.status === 'captured' ? 'bg-mercury-500' : 'bg-mercury-400'}`} />
                                                    <p className="text-[9px] font-black text-mercury-600 uppercase tracking-tight opacity-70">{p.status.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className="text-lg font-black text-mercury-900 tracking-widest uppercase mb-1 leading-none">
                                                {formatCurrency(p.amount).replace('฿', '')}
                                                <span className="text-[9px] text-mercury-600 ml-1">THB</span>
                                            </span>
                                            <span className="text-[8px] font-black text-mercury-400 tracking-[0.2em] uppercase font-mono">
                                                {new Date(p.date).toLocaleDateString()}
                                            </span>
                                            {risk && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <div className={`w-2 h-2 rounded-full ${risk.risk === 'High' ? 'bg-red-500' : risk.risk === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                                    <span className="text-[7px] font-black text-mercury-600 uppercase tracking-tight">{risk.risk} RISK</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

