import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { Truck, Zap, Globe, TrendingUp, DollarSign, Activity, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const performanceData = [
    { name: 'Kerry', success: 98.4, speed: 1.2 },
    { name: 'DHL', success: 99.1, speed: 0.9 },
    { name: 'Thai Post', success: 94.2, speed: 2.4 },
    { name: 'Grab', success: 99.8, speed: 0.5 },
];

const costSavingsData = [
    { month: 'Jan', manual: 4500, xeta: 3200 },
    { month: 'Feb', manual: 5200, xeta: 3800 },
    { month: 'Mar', manual: 4800, xeta: 3100 },
];

const regionalTrends = [
    { day: 'Mon', hub: 45, spk: 32, cnx: 12 },
    { day: 'Tue', hub: 52, spk: 41, cnx: 15 },
    { day: 'Wed', hub: 38, spk: 29, cnx: 10 },
    { day: 'Thu', hub: 61, spk: 48, cnx: 22 },
    { day: 'Fri', hub: 55, spk: 44, cnx: 19 },
];

const ShippingAnalytics: React.FC = () => {
    return (
        <div className="animate-fadeIn w-full space-y-6 pb-8">
            <PageHeader title="Shipping Analytics" subtitle="Mobility Intelligence Node" icon={Truck} status="Optimal" />
            
            {/* Metrics Cluster: Sovereign Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Avg Extraction', value: '฿ 42.50', icon: DollarSign, trend: '-8% ALPHA' },
                    { label: 'Clearing Velocity', value: '1.4 Days', icon: Zap, trend: '+12% FLOW' },
                    { label: 'Node Integrity', value: '98.9%', icon: ShieldCheck, trend: 'SECURED' },
                    { label: 'Active Assets', value: '1,242', icon: Truck, trend: '+32.4% MOMENTUM' },
                ].map((m, i) => (
                    <div key={i} className="bg-[var(--bg-secondary)] backdrop-blur-xl p-10 rounded-[3rem] border border-[var(--border-subtle)] relative overflow-hidden group hover:border-[var(--primary-azure)]/30 transition-all shadow-2xl">
                        <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="p-5 bg-[var(--bg-primary)] backdrop-blur-sm rounded-2xl border border-[var(--border-subtle)] group-hover:rotate-12 transition-transform shadow-xl">
                                    <m.icon className="w-8 h-8 text-[var(--primary-azure)]" />
                                </div>
                                <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] px-4 py-2 bg-[var(--bg-primary)]/60 rounded-xl border border-[var(--border-subtle)] whitespace-nowrap">{m.trend}</span>
                            </div>
                            <div>
                                <span className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] leading-none">{m.label}</span>
                                <div className="text-5xl font-black text-[var(--text-primary)] tracking-tighter mt-4 group-hover:translate-x-3 transition-transform duration-700 whitespace-nowrap leading-none tabular-nums">{m.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Savings Matrix: Liquid Perspective */}
                <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-[3rem] p-12 sm:p-14 relative overflow-hidden group shadow-2xl hover:border-[var(--primary-azure)]/30 transition-all">
                    <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[var(--primary-azure)]/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                    <div className="flex items-center justify-between mb-16 relative z-10 border-b border-[var(--border-subtle)] pb-8">
                        <div>
                            <h3 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">Extraction Savings</h3>
                            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.5em] mt-3 opacity-70 leading-none">Intelligence Optimized Cost Vector</p>
                        </div>
                        <div className="p-4 bg-[var(--bg-primary)] backdrop-blur-sm rounded-2xl border border-[var(--border-subtle)] shadow-xl group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-8 h-8 text-[var(--primary-azure)]" />
                        </div>
                    </div>
                    <div className="h-[400px] w-full relative z-10 font-bold">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={costSavingsData}>
                                <defs>
                                    <linearGradient id="colorXeta" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-azure)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary-azure)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 900 }} dy={10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '2rem', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', backdropFilter: 'blur(20px)' }}
                                    itemStyle={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="manual" stroke="var(--text-secondary)" strokeWidth={2} fill="transparent" strokeDasharray="10 10" opacity={0.3} />
                                <Area type="monotone" dataKey="xeta" stroke="var(--primary-azure)" strokeWidth={5} fillOpacity={1} fill="url(#colorXeta)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Node Reliability: Stability Index */}
                <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-[3rem] p-12 sm:p-14 relative overflow-hidden group shadow-2xl hover:border-[var(--primary-azure)]/30 transition-all">
                    <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[var(--primary-azure)]/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
                    <div className="flex items-center justify-between mb-16 relative z-10 border-b border-[var(--border-subtle)] pb-8">
                        <div>
                            <h3 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">Reliability Matrix</h3>
                            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.5em] mt-3 opacity-70 leading-none">Sovereign Node Stability Index</p>
                        </div>
                        <div className="p-4 bg-[var(--bg-primary)] backdrop-blur-sm rounded-2xl border border-[var(--border-subtle)] shadow-xl group-hover:scale-110 transition-transform">
                            <Activity className="w-8 h-8 text-[var(--primary-azure)]" />
                        </div>
                    </div>
                    <div className="h-[400px] w-full relative z-10 font-bold">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="var(--border-subtle)" opacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 900 }} dy={10} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'var(--bg-primary)', opacity: 0.1 }} />
                                <Bar dataKey="success" radius={[20, 20, 0, 0]}>
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="var(--primary-azure)" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Mobility Pulse Node: Regional Logistics Hub */}
            <div className="bg-white/90 backdrop-blur-xl p-12 sm:p-20 rounded-[4rem] border border-[var(--border-subtle)] relative overflow-hidden group shadow-2xl hover:border-[var(--primary-azure)]/30 transition-all">
                <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-[var(--primary-azure)]/5 rounded-full blur-[150px] -mr-64 -mt-64 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-24">
                    <div className="lg:max-w-xl">
                        <div className="flex items-center gap-8 mb-12">
                            <div className="p-5 bg-[var(--bg-primary)] backdrop-blur-sm rounded-[2rem] border border-[var(--border-subtle)] shadow-2xl group-hover:rotate-6 transition-transform">
                                <Globe className="text-[var(--primary-azure)] w-10 h-10" />
                            </div>
                            <h3 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">Mobility Pulse Node</h3>
                        </div>
                        <p className="text-[var(--text-secondary)] text-xl sm:text-2xl font-black leading-relaxed tracking-tight border-l-8 border-[var(--primary-azure)]/20 pl-10 mb-16">
                            Autonomous asset tracking across <span className="text-[var(--text-primary)] font-black underline decoration-[var(--primary-azure)]/20 underline-offset-[12px] decoration-4">Bangkok Central Hub</span>.
                            AI Engine (v4.2) is currently re-routing <span className="text-[var(--primary-azure)] underline decoration-[var(--primary-azure)]/20 underline-offset-[12px] decoration-4">14.2%</span> of high-priority assets to bypass congestion zones.
                        </p>
                        <div className="space-y-10">
                            {[
                                { name: 'Bangkok Central Hub', val: 92, status: 'PEAK_LOAD' },
                                { name: 'Samut Prakan Node', val: 78, status: 'NOMINAL' },
                                { name: 'Chiang Mai Spoke', val: 45, status: 'IDLE' },
                            ].map((r, i) => (
                                <div key={i} className="group/row cursor-default">
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-[12px] font-black uppercase text-[var(--text-secondary)] tracking-[0.4em] leading-none">{r.name}</span>
                                        <span className="text-[10px] font-black text-[var(--text-secondary)]/50 uppercase tracking-[0.3em] leading-none">{r.status}</span>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="flex-1 h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--border-subtle)] shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-[var(--primary-azure)]/60 to-[var(--primary-azure)] shadow-sm" style={{ width: `${r.val}%` }} />
                                        </div>
                                        <span className="text-3xl font-black text-[var(--text-primary)] min-w-[70px] text-right tracking-tighter leading-none tabular-nums">{r.val}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 h-[550px] bg-[var(--bg-secondary)] backdrop-blur-xl rounded-[4rem] p-12 border border-[var(--border-subtle)] relative overflow-hidden shadow-inner group-hover:border-[var(--primary-azure)]/30 transition-all">
                        <div className="absolute inset-0 bg-scanline opacity-[0.05] pointer-events-none" />
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={regionalTrends}>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '2rem', padding: '1.5rem', backdropFilter: 'blur(20px)' }}
                                />
                                <Area type="step" dataKey="hub" stroke="var(--primary-azure)" fill="var(--primary-azure)" fillOpacity={0.1} strokeWidth={5} />
                                <Area type="step" dataKey="spk" stroke="var(--primary-azure)" strokeOpacity={0.3} fill="transparent" strokeWidth={3} />
                                <Area type="step" dataKey="cnx" stroke="var(--primary-azure)" strokeOpacity={0.1} fill="transparent" strokeWidth={1} />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-12 left-12 flex items-center gap-6 text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-[0.6em] leading-none">
                            <Activity className="w-6 h-6 animate-pulse" />
                            Live Matrix Stream // {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingAnalytics;


