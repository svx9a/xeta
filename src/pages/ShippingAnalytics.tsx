import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Truck, Zap, Globe, TrendingUp, DollarSign, Activity, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import Card from '../components/Card';

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
        <div className="animate-fadeIn w-full space-y-16 pb-32 px-6">
            {/* Header Node: Sovereign Architecture */}
            <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-[3rem] p-12 text-mercury-800 shadow-2xl border border-white/20 group">
                {/* Cyber Background Accents */}
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-mercury-200/10 rounded-full -mr-32 -mt-32 blur-[150px] group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-10 mb-12">
                            <div className="w-24 h-24 bg-mercury-100/80 backdrop-blur-xl rounded-[2.5rem] border border-white/30 shadow-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-1000">
                                <Truck className="w-12 h-12 text-mercury-600" />
                            </div>
                            <div>
                                <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-mercury-800 uppercase leading-none mb-4">
                                    Mobility <span className="text-mercury-600 block sm:inline">Intelligence</span>
                                </h1>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-[1px] bg-mercury-400/60" />
                                    <p className="text-[12px] font-black text-mercury-600/70 uppercase tracking-[0.8em]">ASSET_ROUTING_NODE_v9</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-2xl text-mercury-700/60 max-w-4xl font-black leading-relaxed uppercase tracking-tight border-l-8 border-mercury-400/40 pl-10">
                            Real-time <span className="text-mercury-800 font-black underline decoration-mercury-400/40 underline-offset-[16px] decoration-4 text-bold">Mobility Matrix</span> extraction and predictive logistics for high-velocity global supply nodes.
                        </p>
                    </div>

                    <div className="flex items-center gap-10 bg-white/80 backdrop-blur-xl px-10 py-8 rounded-3xl border border-white/20 text-mercury-800 shadow-2xl group/status">
                        <div className="relative">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 shadow-sm group-hover:scale-125 transition-transform" />
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[16px] font-black uppercase tracking-[0.5em] leading-none">OPTIMAL</span>
                            <span className="text-[11px] font-black text-mercury-600/50 uppercase tracking-[0.3em]">INTEGRITY_STABLE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Cluster: Sovereign Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {[
                    { label: 'Avg Extraction', value: '฿ 42.50', icon: DollarSign, trend: '-8% ALPHA' },
                    { label: 'Clearing Velocity', value: '1.4 Days', icon: Zap, trend: '+12% FLOW' },
                    { label: 'Node Integrity', value: '98.9%', icon: ShieldCheck, trend: 'SECURED' },
                    { label: 'Active Assets', value: '1,242', icon: Truck, trend: '+32.4% MOMENTUM' },
                ].map((m, i) => (
                    <div key={i} className="bg-white/85 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 relative overflow-hidden group hover:border-mercury-300/30 transition-all shadow-2xl">
                        <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="p-5 bg-mercury-100/80 backdrop-blur-sm rounded-2xl border border-white/30 group-hover:rotate-12 transition-transform shadow-xl">
                                    <m.icon className="w-8 h-8 text-mercury-600" />
                                </div>
                                <span className="text-[10px] font-black text-mercury-600 uppercase tracking-[0.4em] px-4 py-2 bg-mercury-100/60 rounded-xl border border-mercury-300/30 whitespace-nowrap">{m.trend}</span>
                            </div>
                            <div>
                                <span className="text-[11px] font-black text-mercury-600/70 uppercase tracking-[0.4em] leading-none">{m.label}</span>
                                <div className="text-5xl font-black text-mercury-800 tracking-tighter mt-4 group-hover:translate-x-3 transition-transform duration-700 whitespace-nowrap leading-none tabular-nums">{m.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Savings Matrix: Liquid Perspective */}
                <div className="bg-white/85 backdrop-blur-xl border border-white/20 rounded-[3rem] p-12 sm:p-14 relative overflow-hidden group shadow-2xl hover:border-mercury-300/30 transition-all">
                    <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-mercury-200/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                    <div className="flex items-center justify-between mb-16 relative z-10 border-b border-mercury-200/50 pb-8">
                        <div>
                            <h3 className="text-3xl font-black text-mercury-800 uppercase tracking-tighter leading-none">Extraction Savings</h3>
                            <p className="text-[10px] font-black text-mercury-600 uppercase tracking-[0.5em] mt-3 opacity-70 leading-none">Intelligence Optimized Cost Vector</p>
                        </div>
                        <div className="p-4 bg-mercury-100/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-8 h-8 text-mercury-600" />
                        </div>
                    </div>
                    <div className="h-[400px] w-full relative z-10 font-bold">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={costSavingsData}>
                                <defs>
                                    <linearGradient id="colorXeta" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#737373" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#737373" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 11, fontWeight: 900 }} dy={10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(115, 115, 115, 0.2)', borderRadius: '2rem', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(115, 115, 115, 0.25)', backdropFilter: 'blur(20px)' }}
                                    itemStyle={{ color: '#171717', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="manual" stroke="rgba(115, 115, 115, 0.2)" strokeWidth={2} fill="transparent" strokeDasharray="10 10" />
                                <Area type="monotone" dataKey="xeta" stroke="#737373" strokeWidth={5} fillOpacity={1} fill="url(#colorXeta)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Node Reliability: Stability Index */}
                <div className="bg-white/85 backdrop-blur-xl border border-white/20 rounded-[3rem] p-12 sm:p-14 relative overflow-hidden group shadow-2xl hover:border-mercury-300/30 transition-all">
                    <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-mercury-200/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
                    <div className="flex items-center justify-between mb-16 relative z-10 border-b border-mercury-200/50 pb-8">
                        <div>
                            <h3 className="text-3xl font-black text-mercury-800 uppercase tracking-tighter leading-none">Reliability Matrix</h3>
                            <p className="text-[10px] font-black text-mercury-600 uppercase tracking-[0.5em] mt-3 opacity-70 leading-none">Sovereign Node Stability Index</p>
                        </div>
                        <div className="p-4 bg-mercury-100/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl group-hover:scale-110 transition-transform">
                            <Activity className="w-8 h-8 text-mercury-600" />
                        </div>
                    </div>
                    <div className="h-[400px] w-full relative z-10 font-bold">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(115, 115, 115, 0.02)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 11, fontWeight: 900 }} dy={10} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                <Bar dataKey="success" radius={[20, 20, 0, 0]}>
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#737373" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Mobility Pulse Node: Regional Logistics Hub */}
            <div className="bg-white/90 backdrop-blur-xl p-12 sm:p-20 rounded-[4rem] border border-white/20 relative overflow-hidden group shadow-2xl hover:border-mercury-300/30 transition-all">
                <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-mercury-200/10 rounded-full blur-[150px] -mr-64 -mt-64 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-24">
                    <div className="lg:max-w-xl">
                        <div className="flex items-center gap-8 mb-12">
                            <div className="p-5 bg-mercury-100/80 backdrop-blur-sm rounded-[2rem] border border-white/30 shadow-2xl group-hover:rotate-6 transition-transform">
                                <Globe className="text-mercury-600 w-10 h-10" />
                            </div>
                            <h3 className="text-4xl font-black text-mercury-800 uppercase tracking-tighter leading-none">Mobility Pulse Node</h3>
                        </div>
                        <p className="text-mercury-700/60 text-xl sm:text-2xl font-black leading-relaxed tracking-tight border-l-8 border-mercury-400/40 pl-10 mb-16">
                            Autonomous asset tracking across <span className="text-mercury-800 font-black underline decoration-mercury-400/40 underline-offset-[12px] decoration-4">Bangkok Central Hub</span>.
                            AI Engine (v4.2) is currently re-routing <span className="text-mercury-600 underline decoration-mercury-400/40 underline-offset-[12px] decoration-4">14.2%</span> of high-priority assets to bypass congestion zones.
                        </p>
                        <div className="space-y-10">
                            {[
                                { name: 'Bangkok Central Hub', val: 92, status: 'PEAK_LOAD' },
                                { name: 'Samut Prakan Node', val: 78, status: 'NOMINAL' },
                                { name: 'Chiang Mai Spoke', val: 45, status: 'IDLE' },
                            ].map((r, i) => (
                                <div key={i} className="group/row cursor-default">
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-[12px] font-black uppercase text-mercury-600/70 tracking-[0.4em] leading-none">{r.name}</span>
                                        <span className="text-[10px] font-black text-mercury-600/50 uppercase tracking-[0.3em] leading-none">{r.status}</span>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="flex-1 h-3 bg-mercury-100 rounded-full overflow-hidden border border-mercury-200 shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-mercury-400 to-mercury-600 shadow-sm" style={{ width: `${r.val}%` }} />
                                        </div>
                                        <span className="text-3xl font-black text-mercury-800 min-w-[70px] text-right tracking-tighter leading-none tabular-nums">{r.val}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 h-[550px] bg-white/80 backdrop-blur-xl rounded-[4rem] p-12 border border-white/20 relative overflow-hidden shadow-inner group-hover:border-mercury-300/30 transition-all">
                        <div className="absolute inset-0 bg-scanline opacity-[0.05] pointer-events-none" />
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={regionalTrends}>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(115, 115, 115, 0.2)', borderRadius: '2rem', padding: '1.5rem', backdropFilter: 'blur(20px)' }}
                                />
                                <Area type="step" dataKey="hub" stroke="#737373" fill="rgba(115, 115, 115, 0.1)" strokeWidth={5} />
                                <Area type="step" dataKey="spk" stroke="rgba(115, 115, 115, 0.3)" fill="transparent" strokeWidth={3} />
                                <Area type="step" dataKey="cnx" stroke="rgba(115, 115, 115, 0.1)" fill="transparent" strokeWidth={1} />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-12 left-12 flex items-center gap-6 text-[12px] font-black text-mercury-600 uppercase tracking-[0.6em] leading-none">
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


