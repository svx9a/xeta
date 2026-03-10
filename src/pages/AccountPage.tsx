import React from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { MOCK_USER, MOCK_ACTIVITY_LOGS } from '../constants';
import { ActivityLog, ActivityLogStatus } from '../types';
import { User, Activity, Shield, Clock, ShieldCheck, Zap } from 'lucide-react';

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

const ProfileDetail: React.FC<{ labelKey: any; value: string }> = ({ labelKey, value }) => {
    const { t } = useTranslation();
    return (
        <div className="group/detail">
            <label className="block text-[10px] font-black text-blue-600/60 uppercase tracking-[0.4em] mb-3 group-hover/detail:text-blue-600 transition-colors leading-none">{t(labelKey)}</label>
            <p className="text-xl font-black text-slate-800 tracking-tighter uppercase">{value}</p>
        </div>
    );
};

const AccountPage: React.FC = () => {
    const { t } = useTranslation();
    const user = MOCK_USER;

    return (
        <div className="animate-fadeIn max-w-full 2xl:max-w-[1600px] w-full space-y-16 pb-32 mx-auto px-6">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-10 pb-12 border-b border-slate-200">
                <div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-slate-800 uppercase leading-none">
                        Executive Profile
                    </h1>
                    <p className="text-[12px] font-black text-blue-600/80 uppercase tracking-[0.5em] mt-6 border-l-4 border-blue-600/20 pl-6 h-4">SOVEREIGN NODE OPERATOR // LEVEL 4</p>
                </div>
            </div>

            <Card padding="p-12" className="bg-white/60 border border-slate-200 rounded-[3rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-[150px] group-hover:scale-110 transition-all duration-1000 pointer-events-none" />

                <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="relative group/avatar">
                        <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-3xl opacity-40 animate-pulse" />
                        <div className="w-56 h-56 rounded-full bg-slate-100 border-4 border-slate-200 text-slate-800 flex items-center justify-center font-black text-8xl relative z-10 shadow-2xl group-hover/avatar:rotate-12 transition-all duration-700">
                            {user.avatar}
                        </div>
                    </div>

                    <div className="flex-grow text-center lg:text-left">
                        <h2 className="text-6xl lg:text-7xl font-black text-slate-800 uppercase tracking-tighter mb-8 leading-none">{user.name}</h2>
                        <div className="flex items-center justify-center lg:justify-start gap-8 mb-16">
                            <span className="text-[14px] font-black text-blue-600/80 font-mono tracking-tight uppercase border-b-2 border-blue-600/20 pb-1">
                                {user.email}
                            </span>
                            <div className="w-2 h-2 rounded-full bg-blue-600/20" />
                            <span className="px-8 py-3 bg-blue-600/10 text-blue-600 text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl border border-blue-600/20">
                                {t(user.role as any)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-l-4 border-blue-600/10 pl-12">
                            <ProfileDetail labelKey="role" value={t(user.role as any)} />
                            <ProfileDetail labelKey="lastLogin" value={new Date(user.lastLogin).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                        </div>
                    </div>

                    <button className="px-16 py-8 text-sm font-black uppercase tracking-[0.6em] text-slate-800 bg-gradient-to-r from-[#1E4A6F] to-[#2B6C9E] hover:from-[#2B6C9E] hover:to-[#4F8FC9] rounded-[2.5rem] shadow-2xl transition-all hover:translate-y-[-6px] active:translate-y-[2px] flex items-center gap-6 group/btn border-4 border-slate-200">
                        <Zap className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                        UPGRADE ACCESS
                    </button>
                </div>
            </Card>

            <Card padding="p-0" className="bg-white/60 border border-slate-200 rounded-[3rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                <div className="p-12 border-b border-slate-200 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="p-6 bg-blue-600/10 rounded-3xl border border-blue-600/20 shadow-xl group-hover:rotate-[8deg] transition-transform">
                            <Activity className="w-12 h-12 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter leading-none">Access Log Matrix</h2>
                            <p className="text-[11px] font-black text-blue-600/40 mt-4 uppercase tracking-[0.6em] leading-none">SECURITY EVENT STREAM</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 border-b border-slate-200">
                                <th className="px-12 py-8 text-[12px] font-black text-blue-600/60 uppercase tracking-[0.6em]">{t('timestamp')}</th>
                                <th className="px-12 py-8 text-[12px] font-black text-blue-600/60 uppercase tracking-[0.6em]">{t('event')}</th>
                                <th className="px-12 py-8 text-[12px] font-black text-blue-600/60 uppercase tracking-[0.6em]">{t('description')}</th>
                                <th className="px-12 py-8 text-[12px] font-black text-blue-600/60 uppercase tracking-[0.6em] text-right pr-16">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_ACTIVITY_LOGS.slice(0, 8).map((log) => (
                                <tr key={log.id} className="hover:bg-slate-100 transition-all duration-500 group/row cursor-default">
                                    <td className="px-12 py-8 whitespace-nowrap">
                                        <div className="flex items-center gap-8 group-hover/row:translate-x-3 transition-all duration-500">
                                            <Clock className="w-6 h-6 text-blue-600/20" />
                                            <span className="text-2xl font-mono font-black text-slate-800 tracking-tighter tabular-nums">{new Date(log.timestamp).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <span className="font-mono text-[10px] font-black bg-blue-600/10 text-blue-600 px-6 py-3 rounded-xl border border-blue-600/20 tracking-[0.2em] uppercase">
                                            {log.event}
                                        </span>
                                    </td>
                                    <td className="px-12 py-8">
                                        <p className="text-xl font-black text-slate-800 tracking-tighter group-hover/row:translate-x-2 transition-transform">{log.description}</p>
                                    </td>
                                    <td className="px-12 py-8 text-right pr-16"><ActivityStatusBadge status={log.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-16 bg-slate-100 border-t border-slate-200 text-center relative z-10 transition-all hover:bg-slate-100 group/extract">
                    <button className="text-[12px] font-black text-blue-600 uppercase tracking-[0.8em] hover:text-slate-800 transition-all underline underline-offset-[20px] decoration-4 decoration-[#4F8FC9]/20 hover:decoration-[#4F8FC9] group-hover/extract:translate-y-[-4px]">
                        Extract Full Activity Matrix
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AccountPage;
