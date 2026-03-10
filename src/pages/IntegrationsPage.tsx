import React, { useState } from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { CheckCircleIcon, ExclamationCircleIcon } from '../components/icons';
import Modal from '../components/Modal';
import { Shield, Zap, RefreshCw, Unlink, Globe, Cpu, Lock, ShoppingCart } from 'lucide-react';

const IntegrationsPage: React.FC = () => {
    const { t } = useTranslation();
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected'>('disconnected');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isDisconnectModalOpen, setDisconnectModalOpen] = useState(false);

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnecting(true);
        setTimeout(() => {
            setConnectionStatus('connected');
            setIsConnecting(false);
        }, 1500);
    };

    const handleDisconnect = () => {
        setConnectionStatus('disconnected');
        setDisconnectModalOpen(false);
    };

    const handleForceSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    }

    const storeUrl = "xeta-demo-store.myshopify.com";

    const inputBaseClasses = "w-full bg-slate-100 border border-slate-200 rounded-[1.25rem] p-5 font-black text-xl tracking-tighter text-slate-800 focus:outline-none focus:bg-slate-100 focus:border-blue-600/30 transition-all placeholder-white/20 shadow-inner outline-none";
    const labelBaseClasses = "block text-[10px] font-black text-blue-600/60 uppercase tracking-[0.4em] mb-4 leading-none";

    return (
        <div className="animate-fadeIn max-w-full 2xl:max-w-[1600px] w-full space-y-16 pb-32 mx-auto px-6">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-10 pb-12 border-b border-slate-200">
                <div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-slate-800 uppercase leading-none">
                        Integration <span className="text-blue-600">Node</span>
                    </h1>
                    <p className="text-[12px] font-black text-blue-600/80 uppercase tracking-[0.5em] mt-6 border-l-4 border-blue-600/20 pl-6 h-4">Active Bridge Configuration // Protocol v9.0</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-12">
                    {connectionStatus === 'connected' ? (
                        <Card padding="p-16" className="bg-white/60 border border-slate-200 rounded-[4rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 border-b border-slate-200 pb-10 relative z-10 gap-8">
                                <div className="flex items-center gap-8">
                                    <div className="p-6 bg-blue-600/10 rounded-3xl border border-blue-600/20 shadow-xl group-hover:rotate-6 transition-transform duration-500">
                                        <ShoppingCart className="w-12 h-12 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-3">Shopify Core Bridge</h2>
                                        <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.5em] text-[#10B981]">
                                            <div className="w-3 h-3 rounded-full bg-[#10B981] animate-ping shadow-sm" />
                                            CONNECTED & SECURE
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDisconnectModalOpen(true)}
                                    className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-800/40 hover:text-rose-500 transition-colors flex items-center gap-4 group/unlink"
                                >
                                    <Unlink className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    Sever Connection
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                <div className="p-10 bg-slate-100 border border-slate-200 rounded-[2.5rem] shadow-inner hover:bg-slate-100 transition-colors group/cell">
                                    <label className={labelBaseClasses}>Target Endpoint</label>
                                    <p className="text-3xl font-black text-slate-800 tracking-tighter truncate group-hover/cell:text-blue-600 transition-colors">{storeUrl}</p>
                                </div>
                                <div className="p-10 bg-slate-100 border border-slate-200 rounded-[2.5rem] shadow-inner hover:bg-slate-100 transition-colors group/cell">
                                    <label className={labelBaseClasses}>Sync Intelligence</label>
                                    <div className="flex items-center gap-6">
                                        <RefreshCw className={`w-8 h-8 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
                                        <p className="text-3xl font-black text-slate-800 tracking-tighter uppercase transition-colors">
                                            {isSyncing ? 'Synchronizing...' : 'State Optimal'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 relative z-10 border-t border-slate-200 pt-12">
                                <button
                                    onClick={handleForceSync}
                                    disabled={isSyncing}
                                    className="w-full sm:w-auto px-16 py-8 text-sm font-black uppercase tracking-[0.5em] text-slate-800 bg-blue-600 hover:bg-white hover:shadow-2xl rounded-[2rem] shadow-xl transition-all hover:translate-y-[-4px] active:translate-y-[2px] disabled:opacity-50 flex items-center justify-center gap-6 border-b-4 border-b-black/20"
                                >
                                    <RefreshCw className={`w-6 h-6 ${isSyncing ? 'animate-spin' : ''}`} />
                                    {isSyncing ? 'SYNC IN PROGRESS' : 'Trigger Global Reconciliation'}
                                </button>
                            </div>
                        </Card>
                    ) : (
                        <Card padding="p-16" className="bg-white/60 border border-slate-200 rounded-[4rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="flex items-center gap-8 mb-16 border-b border-slate-200 pb-11">
                                <div className="p-6 bg-blue-600/10 rounded-3xl border border-blue-600/20 shadow-xl group-hover:rotate-6 transition-transform duration-500">
                                    <ShoppingCart className="w-12 h-12 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight leading-none mb-4">Shopify Bridge Initiation</h2>
                                    <p className="text-[11px] font-black text-blue-600/40 uppercase tracking-[0.6em] leading-none">PROTOCOL HANDSHAKE</p>
                                </div>
                            </div>

                            <form onSubmit={handleConnect} className="space-y-12 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <label htmlFor="shopify-url" className={labelBaseClasses}>Production URL</label>
                                        <input type="text" id="shopify-url" placeholder="your-store.myshopify.com" className={inputBaseClasses} />
                                    </div>
                                    <div className="space-y-6">
                                        <label htmlFor="shopify-api-key" className={labelBaseClasses}>Access Key (XETA-PK)</label>
                                        <input type="password" id="shopify-api-key" placeholder="Enter API Key" className={inputBaseClasses} />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <label htmlFor="shopify-api-secret" className={labelBaseClasses}>Secret Vector (XETA-SK)</label>
                                    <input type="password" id="shopify-api-secret" placeholder="Enter API Secret" className={inputBaseClasses} />
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-12 pt-10 border-t border-slate-200">
                                    <button
                                        type="submit"
                                        disabled={isConnecting}
                                        className="w-full sm:w-auto px-20 py-8 text-sm font-black uppercase tracking-[0.6em] text-slate-800 bg-blue-600 hover:bg-white hover:shadow-2xl rounded-[2.5rem] shadow-xl transition-all hover:translate-y-[-4px] active:translate-y-[2px] disabled:opacity-50 flex items-center justify-center gap-8 border-b-4 border-b-black/20"
                                    >
                                        {isConnecting ? (
                                            <div className="w-8 h-8 border-4 border-white/30 border-t-[#0A1929] rounded-full animate-spin" />
                                        ) : <Zap className="w-8 h-8" />}
                                        {isConnecting ? 'ESTABLISHING...' : 'Authorize Connector'}
                                    </button>
                                    <div className="flex items-center gap-6 text-[12px] font-black uppercase tracking-[0.4em] text-rose-500 animate-pulse border-l-2 border-rose-500/20 pl-8 h-12">
                                        <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
                                        {t(connectionStatus as any)}
                                    </div>
                                </div>
                            </form>
                        </Card>
                    )}

                    <Card padding="p-16" className="bg-white/60 border border-slate-200 rounded-[4rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-16 relative z-10 border-b border-slate-200 pb-10 gap-8">
                            <div className="flex items-center gap-8 text-center sm:text-left flex-col sm:row">
                                <div className="p-6 bg-slate-100 border border-slate-200 rounded-[2rem] shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                                    <Globe className="w-12 h-12 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-3">PromptPay Real-time Settlement</h2>
                                    <p className="text-[11px] font-black text-slate-800/40 uppercase tracking-[0.5em] leading-none">QR Generation Logic (TH-RTP)</p>
                                </div>
                            </div>
                            <div className="w-28 h-28 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-200 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png"
                                    alt="PromptPay"
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        </div>

                        <div className="space-y-12 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <label className={labelBaseClasses}>Registry ID (Mobile/Tax)</label>
                                    <input type="text" placeholder="081-XXX-XXXX" className={inputBaseClasses} />
                                </div>
                                <div className="space-y-6">
                                    <label className={labelBaseClasses}>Entity Nominal Name</label>
                                    <input type="text" placeholder="ชื่อบัญชีภาษาไทย" className={inputBaseClasses} />
                                </div>
                            </div>
                            <div className="pt-10 border-t border-slate-200">
                                <button className="w-full sm:w-auto px-16 py-8 text-sm font-black uppercase tracking-[0.5em] text-slate-800 bg-slate-100 border border-slate-200 hover:bg-blue-600 hover:text-slate-800 hover:border-blue-600 hover:shadow-2xl rounded-[2rem] shadow-xl transition-all hover:translate-y-[-4px] active:translate-y-[2px] flex items-center justify-center gap-6 border-b-4 border-b-black/20 group">
                                    <RefreshCw className="w-7 h-7 group-hover:rotate-180 transition-transform duration-700" />
                                    Synchronize RTP Terminal
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-12">
                    <Card padding="p-12" className="bg-white/60 border border-slate-200 rounded-[3.5rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
                        <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-12 pb-8 border-b border-slate-200 leading-none">Node Security</h3>
                        <div className="space-y-8 relative z-10">
                            {[
                                { icon: Shield, label: 'AES-256 Vector', status: 'ACTIVE' },
                                { icon: Cpu, label: 'Edge Balancing', status: 'READY' },
                                { icon: Lock, label: 'PCI Compliant', status: 'VERIFIED' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-10 bg-slate-100 border border-slate-200 rounded-[2.5rem] hover:bg-slate-100 transition-all group/security shadow-inner">
                                    <div className="flex items-center gap-8">
                                        <item.icon className="w-8 h-8 text-blue-600" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-800/40 transition-colors group-hover/security:text-slate-800">{item.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-[#10B981] bg-[#10B981]/10 px-6 py-2.5 rounded-2xl border border-[#10B981]/20 shadow-xl">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="p-16 bg-white/40 border-2 border-dashed border-slate-200 rounded-[4rem] relative group hover:bg-white/60 hover:border-blue-600/30 transition-all backdrop-blur-md">
                        <div className="flex flex-col items-center text-center gap-10 relative z-10">
                            <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-blue-600 border border-slate-200 shadow-2xl group-hover:rotate-[15deg] transition-all duration-1000">
                                <Zap className="w-12 h-12" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-5 leading-none">Need custom protocol?</h4>
                                <p className="text-[15px] text-slate-800/40 leading-relaxed font-black mb-10 px-4 uppercase tracking-tight">Our engineering team can architect bespoke bridge solutions for enterprise ledger systems.</p>
                            </div>
                            <button className="text-[12px] font-black text-blue-600 uppercase tracking-[0.8em] hover:text-slate-800 transition-all underline underline-offset-[20px] decoration-4 decoration-[#4F8FC9]/20 hover:decoration-[#4F8FC9] leading-none pr-[-0.8em]">Consult Architecture</button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isDisconnectModalOpen}
                onClose={() => setDisconnectModalOpen(false)}
                title={<span className="font-black uppercase tracking-[0.3em] text-rose-500 block pt-10 px-10">Security Alert // Breach Connection</span>}
                footer={
                    <div className="flex flex-col sm:flex-row gap-8 w-full p-12 pt-0">
                        <button onClick={() => setDisconnectModalOpen(false)} className="px-12 py-7 text-[11px] font-black uppercase tracking-[0.5em] text-slate-800/40 bg-slate-100 border border-slate-200 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all shadow-xl">CANCEL</button>
                        <button onClick={handleDisconnect} className="px-16 py-7 text-[11px] font-black uppercase tracking-[0.5em] text-slate-800 bg-rose-600 hover:bg-rose-500 hover:shadow-rose-600/40 rounded-2xl shadow-2xl transition-all flex-grow border-b-4 border-b-black/20">CONFIRM DISCONNECT</button>
                    </div>
                }
            >
                <div className="p-12 bg-rose-500/5 border border-rose-500/10 rounded-[3rem] text-center border-l-8 border-l-rose-500 m-12 shadow-2xl backdrop-blur-3xl">
                    <p className="text-2xl font-black text-rose-200/80 leading-relaxed tracking-tight uppercase">
                        Warning: This action will sever the <span className="text-rose-500 font-black underline decoration-4 underline-offset-[12px] decoration-rose-500/30">Shopify Core Bridge</span>. All automated reconciliations will be suspended immediately.
                        <br /><br />
                        <span className="text-[10px] font-black text-rose-500/40 tracking-[0.4em] block mb-6">Target Node Identifier:</span>
                        <span className="font-mono text-slate-800 bg-black/40 px-8 py-4 rounded-[1.5rem] border border-rose-500/20 shadow-inner inline-block">{storeUrl}</span>
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default IntegrationsPage;