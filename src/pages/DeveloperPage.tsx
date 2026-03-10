import React, { useState } from 'react';
import Card from '../components/Card';
import { CheckCircleIcon } from '../components/icons';
import { useTranslation } from '../contexts/LanguageContext';
import { MOCK_ACTIVITY_LOGS } from '../constants';
import { ActivityLog, ActivityLogStatus } from '../types';
import Switch from '../components/Switch';
import OpsPanel from '../components/OpsPanel';
import Modal from '../components/Modal';
import TracingGuide from '../components/TracingGuide';
import { Activity, Shield, Zap, ArrowRight, Cpu, Terminal, Copy } from 'lucide-react';

interface DeveloperPageProps {
    isProduction: boolean;
    setIsProduction: (isProduction: boolean) => void;
}

const ApiKeyInput: React.FC<{ label: string; value: string; description: string }> = ({ label, value, description }) => (
    <div className="group/api">
        <label className="block text-[10px] font-black text-blue-600/60 uppercase tracking-[0.4em] mb-4 group-hover/api:text-blue-600 transition-colors leading-none">{label}</label>
        <div className="relative group">
            <input
                type="text"
                readOnly
                value={value}
                className="w-full bg-slate-100 border border-slate-200 rounded-[1.25rem] p-5 font-mono text-[16px] text-slate-800/90 focus:bg-slate-100 focus:border-blue-600/30 transition-all outline-none shadow-sm pr-16 font-black tracking-tighter"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-slate-800/20 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all active:scale-95 shadow-sm">
                <Copy className="w-5 h-5" />
            </button>
        </div>
        <p className="text-[10px] font-black text-slate-800/20 mt-3 uppercase tracking-[0.2em] leading-none">{description}</p>
    </div>
);

const ActivityStatusBadge: React.FC<{ status: ActivityLogStatus }> = ({ status }) => {
    const { t } = useTranslation();
    const baseClasses = "px-5 py-2.5 text-[10px] font-black rounded-xl uppercase tracking-[0.25em] inline-block border shadow-sm transition-all hover:translate-y-[-2px]";
    const statusClasses: Record<ActivityLogStatus, string> = {
        succeeded: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 shadow-[#10B981]/5",
        pending: "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse shadow-amber-500/5",
        failed: "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{t(status as any)}</span>;
};

const DeveloperPage: React.FC<DeveloperPageProps> = ({ isProduction, setIsProduction }) => {
    const [apiStatus, setApiStatus] = useState<'idle' | 'pinging' | 'online'>('idle');
    const [isTracingModalOpen, setIsTracingModalOpen] = useState(false);
    const { t } = useTranslation();

    const handlePingApi = () => {
        setApiStatus('pinging');
        setTimeout(() => {
            setApiStatus('online');
        }, 1500);
    };

    return (
        <div className="space-y-16 animate-fadeIn max-w-full 2xl:max-w-[1600px] w-full pb-32 mx-auto px-6">
            {/* Developer Command Banner */}
            <div className="bg-gradient-to-br from-[#0A1929] via-[#1E4A6F]/40 to-[#0A1929] rounded-[2.5rem] p-12 text-slate-800 relative overflow-hidden border border-slate-200 group shadow-2xl backdrop-blur-3xl">
                <div className="absolute top-0 right-0 w-[80vw] h-[80vw] sm:w-[40vw] sm:h-[40vw] bg-blue-600/10 rounded-full -mr-8 -mt-8 blur-[150px] animate-pulse" />
                <div className="relative z-10 flex flex-col md:row justify-between items-start md:items-center gap-12">
                    <div>
                        <div className="flex items-center gap-8 mb-10 group cursor-default">
                            <div className="p-6 bg-blue-600/10 rounded-3xl border border-blue-600/20 backdrop-blur-xl shadow-lg group-hover:rotate-6 transition-all duration-500">
                                <Zap className="text-blue-600 w-12 h-12" />
                            </div>
                            <div>
                                <h1 className="text-6xl sm:text-7xl font-black tracking-tighter uppercase text-slate-800 leading-none">
                                    DEVELOPER <span className="text-blue-600/40 font-black">CORE</span>
                                </h1>
                                <div className="flex items-center gap-5 mt-6 border-l-4 border-blue-600/20 pl-6">
                                    <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
                                    <span className="text-[13px] font-black uppercase tracking-[0.5em] text-blue-600/80 font-mono">XETAPAY SDK STROKE v9.8.0 // STABLE</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl text-slate-800/60 max-w-4xl font-black leading-relaxed border-l-4 border-slate-200 pl-10 mt-12">
                            Interface access for <span className="text-slate-800 underline decoration-[#4F8FC9]/30 underline-offset-[12px] tracking-[0.1em] decoration-4">PROGRAMMATIC ASSET FLOW</span>.
                            Manage keys, environment toggles, and real-time event indexing.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <OpsPanel />
                    <Card padding="p-12" className="bg-white/60 rounded-[2.5rem] border border-slate-200 shadow-2xl backdrop-blur-3xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />
                        <div className="flex items-center justify-between gap-12 relative z-10">
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-5 flex items-center gap-5 leading-none">
                                    <div className="w-4 h-4 rounded-full bg-[#10B981] animate-ping shadow-sm" />
                                    Environment Hub
                                </h2>
                                <p className="text-xl text-slate-800/40 font-black font-mono tracking-tighter uppercase border-l-2 border-slate-200 pl-5">
                                    Current Tier: <span className={isProduction ? "text-rose-500" : "text-[#10B981]"}>
                                        {isProduction ? 'PRODUCTION CLOISTER' : 'SANDBOX SIMULATOR'}
                                    </span>
                                </p>
                            </div>
                            <div className="bg-slate-100 p-10 rounded-[2.5rem] border border-slate-200 shadow-inner flex flex-col items-center gap-8">
                                <span className={`text-[11px] font-black uppercase tracking-[0.5em] ${isProduction ? 'text-rose-500' : 'text-[#10B981]'} leading-none`}>
                                    {isProduction ? 'DANGER: LIVE' : 'SECURE: TEST'}
                                </span>
                                <Switch checked={isProduction} onChange={setIsProduction} />
                            </div>
                        </div>
                    </Card>

                    <Card padding="p-12" className="bg-white/60 rounded-[2.5rem] border border-slate-200 shadow-2xl backdrop-blur-3xl relative group cursor-pointer hover:border-blue-600/30 hover:translate-y-[-4px] transition-all duration-500 overflow-hidden" onClick={() => setIsTracingModalOpen(true)}>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4F8FC9]/5 to-transparent opacity-50 pointer-events-none" />
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-10">
                            <div className="p-8 bg-blue-600/10 rounded-[2rem] border border-blue-600/20 shadow-xl group-hover:rotate-[15deg] transition-all duration-700">
                                <Cpu className="w-12 h-12 text-blue-600" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-4xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-4">Obsidian Tracing</h3>
                                <p className="text-[11px] font-black text-blue-600/60 uppercase tracking-[0.5em] leading-none border-l-2 border-slate-200 pl-4">INSTRUMENT ARIZE AX // PHOENIX</p>
                            </div>
                            <div className="bg-slate-100 p-6 rounded-full border border-slate-200 group-hover:bg-blue-600 group-hover:text-slate-800 transition-all shadow-xl">
                                <Terminal className="w-8 h-8" />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-12">
                    <Card padding="p-12" className="bg-white/60 rounded-[2.5rem] border border-slate-200 shadow-2xl backdrop-blur-3xl text-slate-800 relative group overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] group-hover:scale-150 transition-all duration-1000" />
                        <h2 className="text-3xl font-black tracking-tighter mb-12 uppercase flex items-center gap-5 leading-none relative z-10">
                            <Shield className="w-10 h-10 text-blue-600" />
                            API Status
                        </h2>
                        <div className="flex-grow flex flex-col items-center relative z-10">
                            <div className="w-full bg-slate-100 p-10 rounded-[2.5rem] border border-slate-200 shadow-inner mb-12 flex flex-col items-center">
                                <button
                                    onClick={handlePingApi}
                                    disabled={apiStatus === 'pinging'}
                                    className="w-full py-6 text-sm font-black uppercase tracking-[0.4em] text-slate-800 bg-gradient-to-r from-[#1E4A6F] to-[#2B6C9E] hover:shadow-xl hover:shadow-[#4F8FC9]/20 rounded-2xl shadow-lg transition-all active:translate-y-[2px] disabled:opacity-50"
                                >
                                    {apiStatus === 'pinging' ? 'CHALLENGING...' : 'Ping Core API'}
                                </button>

                                <div className="mt-12 w-full">
                                    {apiStatus === 'online' ? (
                                        <div className="flex items-center gap-6 p-6 bg-[#10B981]/10 rounded-[1.5rem] border border-[#10B981]/20 text-[#10B981] shadow-xl animate-bounce">
                                            <CheckCircleIcon className="w-8 h-8" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.3em] leading-none">Operational</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-7 bg-slate-100 rounded-[1.5rem] border border-slate-200 opacity-40 shadow-inner">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">Last Result: N/A</span>
                                            <div className="w-3 h-3 rounded-full bg-slate-100" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-blue-600/40 uppercase tracking-[0.6em] text-center leading-none">System Synchronized // 32ms</p>
                        </div>
                    </Card>

                    <Card padding="p-12" className="bg-white/60 rounded-[2.5rem] border border-slate-200 shadow-2xl backdrop-blur-3xl relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[40px] pointer-events-none" />
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-12 flex items-center gap-5 leading-none">
                            <Zap className="w-10 h-10 text-blue-600" />
                            Access Keys
                        </h2>
                        <div className="space-y-16">
                            <ApiKeyInput label={t('sandboxKey')} value="sand_sk_test_XXXXXXXXXXXXXXXXXXXXXXXX" description={t('sandboxKeyDesc')} />
                            <ApiKeyInput label={t('liveKey')} value="live_pk_live_XXXXXXXXXXXXXXXXXXXXXXXX" description={t('liveKeyDesc')} />
                        </div>
                    </Card>

                    <Card padding="p-12" className="bg-blue-600 rounded-[2.5rem] border-4 border-slate-200 shadow-2xl relative group cursor-pointer hover:translate-y-[-6px] transition-all duration-500 overflow-hidden" onClick={() => window.location.hash = '#/checkout'}>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-200 rounded-full blur-3xl" />
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-10">
                            <div className="p-8 bg-slate-200 rounded-[2rem] shadow-xl group-hover:rotate-[-6deg] transition-transform backdrop-blur-md">
                                <Zap className="w-14 h-14 text-slate-800" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-4xl font-black text-slate-800 uppercase tracking-tighter leading-[0.9] mb-4">Gateway Experience</h3>
                                <p className="text-[11px] font-black text-slate-800/60 uppercase tracking-widest leading-none border-l-2 border-slate-300 pl-4">PREVIEW EXECUTIVE CHECKOUT UX</p>
                            </div>
                            <div className="bg-white text-slate-800 p-6 rounded-full shadow-xl group-hover:translate-x-4 transition-all">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modal for Tracing Guide */}
            <Modal
                isOpen={isTracingModalOpen}
                onClose={() => setIsTracingModalOpen(false)}
                title="Intelligence Tracing Protocol"
            >
                <div className="max-h-[85vh] overflow-y-auto bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl p-12">
                    <TracingGuide />
                </div>
            </Modal>

            {/* Live Signal Intelligence */}
            <Card padding="p-0" className="bg-white/60 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden group backdrop-blur-3xl">
                <div className="p-12 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-12">
                    <div>
                        <h2 className="text-5xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-8 leading-none">
                            <div className="p-6 bg-blue-600/10 rounded-[1.5rem] border border-blue-600/20 shadow-xl group-hover:rotate-[8deg] transition-transform">
                                <Activity className="w-10 h-10 text-blue-600" />
                            </div>
                            Live Signal Intelligence
                        </h2>
                        <p className="text-[11px] font-black text-blue-600/40 mt-6 uppercase tracking-[0.5em] border-l-2 border-slate-200 pl-6 leading-none">Real-time indexed developer events</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-100 border-b border-slate-200">
                                <th scope="col" className="px-12 py-8 text-[12px] font-black text-slate-800/30 uppercase tracking-[0.6em]">{t('timestamp')}</th>
                                <th scope="col" className="px-12 py-8 text-[12px] font-black text-slate-800/30 uppercase tracking-[0.6em]">{t('event')}</th>
                                <th scope="col" className="px-12 py-8 text-[12px] font-black text-slate-800/30 uppercase tracking-[0.6em] hidden lg:table-cell">{t('description')}</th>
                                <th scope="col" className="px-12 py-8 text-[12px] font-black text-slate-800/30 uppercase tracking-[0.6em] hidden sm:table-cell">{t('orderId')}</th>
                                <th scope="col" className="px-12 py-8 text-[12px] font-black text-slate-800/30 uppercase tracking-[0.6em] text-right pr-16">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_ACTIVITY_LOGS.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-100 transition-all duration-500 group/row cursor-default relative">
                                    <td className="px-12 py-10 whitespace-nowrap">
                                        <div className="flex items-center gap-6 group-hover/row:translate-x-3 transition-all duration-500">
                                            <div className="w-3 h-3 rounded-full bg-blue-600/20 shadow-[0_0_10px_rgba(79,143,201,0.2)]" />
                                            <span className="text-2xl font-mono font-black text-slate-800 tracking-tighter tabular-nums">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="group-hover/row:scale-105 transition-transform origin-left w-fit">
                                            <span className="font-mono text-xs font-black bg-slate-100 text-blue-600 px-6 py-4 rounded-xl border border-slate-200 shadow-lg tracking-[0.15em] uppercase">
                                                {log.event}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10 text-[17px] font-black text-slate-800/80 tracking-tight hidden lg:table-cell group-hover/row:translate-x-2 transition-transform">{log.description}</td>
                                    <td className="px-12 py-10 text-sm font-black text-slate-800/20 hidden sm:table-cell font-mono group-hover/row:text-slate-800 transition-colors tracking-widest">#{log.orderId}</td>
                                    <td className="px-12 py-10 text-right pr-16"><ActivityStatusBadge status={log.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default DeveloperPage;

