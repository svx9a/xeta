// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// ⛔ CRITICAL: DO NOT USE MONACO EDITOR HERE
// ⛔ This is a PRODUCTION PAYMENT PAGE
// ⛔ Monaco would break PCI compliance
// ⛔ Security team will reject PR
// ⛔ Users don't need code editing
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { CreditCard, QrCode, ShieldCheck, Zap, ArrowLeft, ArrowRight, CheckCircle, Download, Camera, Cpu, Globe, Lock } from 'lucide-react';
import PromptPayQR from '../components/PromptPayQR';

const CheckoutPage: React.FC = () => {
    const { t, currentLang } = useTranslation();
    const [step, setStep] = useState<'shipping' | 'selection' | 'processing' | 'success'>('shipping');
    const [method, setMethod] = useState<'card' | 'qr' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingData, setShippingData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        zip: ''
    });

    const amount = 24900.00;
    const orderId = "XETA-CORE-77341";

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat(currentLang === 'th' ? 'th-TH' : 'en-US', {
            style: 'currency',
            currency: 'THB',
        }).format(val);
    };

    const handlePayment = () => {
        setIsProcessing(true);
        setStep('processing');
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
        }, 3500);
    };

    if (step === 'success') {
        return (
            <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center p-6 overflow-hidden">
                {/* Success Background */}
                <div className="absolute inset-0 geom-pattern opacity-[0.03]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-emerald-glow opacity-20 rounded-full blur-[200px]" />

                <div className="w-full max-w-3xl animate-fadeIn relative z-10">
                    <div className="bg-white rounded-3xl p-8 shadow-custom border border-border-light relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-glow to-transparent pointer-events-none" />

                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-12">
                                <div className="absolute inset-0 bg-success rounded-full blur-3xl opacity-10 animate-pulse" />
                                <div className="w-36 h-36 bg-sidebar-bg rounded-full flex items-center justify-center relative z-10 shadow-xl border border-success/30 animate-[pop_0.6s_cubic-bezier(0.34,1.56,0.64,1)]">
                                    <CheckCircle className="text-success w-20 h-20 drop-shadow-[0_0_20px_rgba(10,52,66,0.2)]" />
                                </div>
                            </div>

                            <h1 className="text-7xl font-black text-text-primary uppercase tracking-tighter italic mb-8 leading-none">Asset Secured</h1>
                            <p className="text-2xl text-text-secondary font-medium leading-relaxed italic mb-14 max-w-xl">
                                Your <span className="text-emerald-shine font-black underline decoration-emerald-shine/30 underline-offset-8 uppercase">Sovereign Asset Transfer</span> has been indexed on the core ledger.
                            </p>

                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
                                <div className="bg-sidebar-bg p-8 rounded-2xl border border-border-light text-left hover:bg-white transition-all shadow-sm">
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] block mb-3 italic opacity-60">Valuation Index</span>
                                    <span className="text-4xl font-black text-emerald-shine italic tracking-tighter tabular-nums">{formatCurrency(amount)}</span>
                                </div>
                                <div className="bg-sidebar-bg p-8 rounded-2xl border border-border-light text-left hover:bg-white transition-all shadow-sm">
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] block mb-3 italic opacity-60">Indexing Hash</span>
                                    <span className="text-xl font-mono font-bold text-text-primary uppercase tracking-wider">{orderId}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8 w-full">
                                <button className="flex-1 py-8 bg-emerald-deep text-slate-800 rounded-2xl font-black uppercase tracking-[0.4em] italic hover:bg-emerald-rich transition-all shadow-emerald flex items-center justify-center gap-4 group">
                                    <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                                    Extract Ledger
                                </button>
                                <button
                                    onClick={() => window.location.hash = '#/home'}
                                    className="flex-1 py-8 bg-sidebar-bg text-text-primary border border-border-light rounded-2xl font-black uppercase tracking-[0.4em] italic hover:bg-white transition-all shadow-sm"
                                >
                                    Return to Command
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.8em] italic opacity-40">End of Transmission // Node AGX-V9 Secure</p>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'processing') {
        return (
            <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center p-6 text-text-primary overflow-hidden">
                <div className="absolute inset-0 geom-pattern opacity-[0.03]" />
                <div className="relative mb-16">
                    <div className="w-56 h-56 border-[16px] border-sidebar-bg border-t-emerald-shine rounded-full animate-spin shadow-glow" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu className="text-emerald-shine w-20 h-20 animate-pulse" />
                    </div>
                </div>
                <h2 className="text-6xl font-black uppercase tracking-tighter italic mb-8 animate-pulse text-center">Establishing Consensus</h2>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4 bg-sidebar-bg px-8 py-4 rounded-full border border-border-light shadow-sm">
                        <Globe className="w-5 h-5 text-emerald-shine animate-spin" />
                        <span className="text-[11px] font-black uppercase tracking-[0.6em] text-text-secondary italic">Syncing Regional Edge Nodes...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background animate-fadeIn text-text-primary">
            <div className="max-w-7xl mx-auto py-24 px-8">
                {/* Checkout Header Architecture */}
                <div className="mb-24 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-2.5 bg-emerald-deep rounded-full" />
                            <span className="text-xs font-black uppercase tracking-[0.8em] text-text-secondary italic">Sovereign Gateway v4.2</span>
                        </div>
                        <h1 className="text-5xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-text-primary uppercase italic leading-[0.8] drop-shadow-sm">
                            ASSET <span className="text-emerald-deep block sm:inline">SETTLEMENT</span>
                        </h1>
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-custom border border-border-light relative overflow-hidden group min-w-full sm:min-w-[420px] hover:scale-[1.02] transition-all duration-700">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-glow opacity-5 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:scale-150 transition-all duration-1000" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-text-secondary mb-6 block italic opacity-60">Final Valuation Index</span>
                        <p className="text-5xl sm:text-7xl font-black italic tracking-tighter text-emerald-deep drop-shadow-sm tabular-nums">{formatCurrency(amount)}</p>
                        <div className="mt-12 flex items-center justify-between border-t border-border-light pt-10">
                            <div className="flex items-center gap-4">
                                <Lock className="w-5 h-5 text-emerald-shine" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-text-secondary italic">Secure Vector Lock</span>
                            </div>
                            <span className="font-mono text-base font-bold text-slate-800 bg-emerald-deep px-8 py-3 rounded-2xl border border-emerald-shine shadow-inner">04:59</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Method Architecture Selection */}
                    {/* Method Architecture Selection */}
                    <div className="space-y-12">
                        {step === 'shipping' ? (
                            <div className="space-y-12 animate-slideIn">
                                <div className="flex items-center gap-6 mb-4">
                                    <Globe className="text-emerald-deep w-8 h-8" />
                                    <h3 className="text-3xl font-black text-text-primary uppercase tracking-tighter italic">{t('shippingInfo' as any)}</h3>
                                </div>
                                <div className="space-y-10 bg-white border border-border-light p-10 rounded-3xl shadow-sm">
                                    <div className="space-y-6 group/field">
                                        <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.6em] italic group-focus-within/field:text-emerald-shine transition-colors">{t('fullName' as any)}</label>
                                        <input
                                            type="text"
                                            value={shippingData.name}
                                            onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                                            placeholder="CUSTOMER IDENTITY"
                                            className="w-full bg-sidebar-bg border border-border-light rounded-2xl p-6 font-black text-2xl italic tracking-tighter text-text-primary focus:outline-none focus:border-emerald-shine/60 transition-all placeholder-text-secondary/10 shadow-inner uppercase"
                                        />
                                    </div>
                                    <div className="space-y-6 group/field">
                                        <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.6em] italic group-focus-within/field:text-emerald-shine transition-colors">{t('phoneNumber' as any)}</label>
                                        <input
                                            type="text"
                                            value={shippingData.phone}
                                            onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                            placeholder="TELECOM NODE"
                                            className="w-full bg-sidebar-bg border border-border-light rounded-2xl p-6 font-black text-2xl italic tracking-tighter text-text-primary focus:outline-none focus:border-emerald-shine/60 transition-all placeholder-text-secondary/10 shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-6 group/field">
                                        <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.6em] italic group-focus-within/field:text-emerald-shine transition-colors">{t('address' as any)}</label>
                                        <textarea
                                            value={shippingData.address}
                                            onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                            placeholder="GEOSPATIAL DELIVERY NODE"
                                            rows={2}
                                            className="w-full bg-sidebar-bg border border-border-light rounded-2xl p-6 font-black text-lg italic tracking-tight text-text-primary focus:outline-none focus:border-emerald-shine/60 transition-all placeholder-text-secondary/10 shadow-inner uppercase resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-6 group/field">
                                            <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.6em] italic group-focus-within/field:text-emerald-shine transition-colors">{t('city' as any)}</label>
                                            <input
                                                type="text"
                                                value={shippingData.city}
                                                onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                                placeholder="REGIONAL NODE"
                                                className="w-full bg-sidebar-bg border border-border-light rounded-2xl p-6 font-black text-lg italic tracking-tight text-text-primary focus:outline-none focus:border-emerald-shine/60 transition-all placeholder-text-secondary/10 shadow-inner uppercase"
                                            />
                                        </div>
                                        <div className="space-y-6 group/field">
                                            <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.6em] italic group-focus-within/field:text-emerald-shine transition-colors">{t('postalCode' as any)}</label>
                                            <input
                                                type="text"
                                                value={shippingData.zip}
                                                onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                                                placeholder="ZONE INDEX"
                                                className="w-full bg-sidebar-bg border border-border-light rounded-2xl p-6 font-black text-lg italic tracking-tight text-text-primary focus:outline-none focus:border-emerald-shine/60 transition-all placeholder-text-secondary/10 shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStep('selection')}
                                        disabled={!shippingData.name || !shippingData.address}
                                        className="w-full py-8 bg-emerald-deep text-slate-800 rounded-2xl font-black uppercase tracking-[0.4em] italic text-xl hover:bg-emerald-rich transition-all shadow-emerald flex items-center justify-center gap-6 group disabled:opacity-50 disabled:grayscale"
                                    >
                                        {t('proceedToPayment' as any)}
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-6 mb-4">
                                    <Cpu className="text-emerald-deep w-8 h-8" />
                                    <h3 className="text-3xl font-black text-text-primary uppercase tracking-tighter italic">Selection Logic</h3>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center justify-between p-6 bg-emerald-glow rounded-2xl border border-emerald-shine/10 mb-4 animate-fadeIn">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <Globe className="w-5 h-5 text-emerald-shine" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-emerald-shine uppercase tracking-widest italic leading-none mb-1">Active Delivery Node</p>
                                                <p className="text-sm font-black text-text-primary uppercase italic truncate max-w-[200px]">{shippingData.name} // {shippingData.city}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setStep('shipping')}
                                            className="text-[10px] font-black text-text-secondary hover:text-emerald-shine uppercase tracking-widest italic border-b border-text-secondary/20 transition-all"
                                        >
                                            Modify Node
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => setMethod('card')}
                                        className={`w-full p-8 rounded-3xl border transition-all duration-700 text-left relative group overflow-hidden ${method === 'card' ? 'bg-emerald-deep border-emerald-deep shadow-emerald' : 'bg-sidebar-bg border-border-light hover:bg-white hover:border-emerald-shine/30 shadow-sm'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                        <div className="flex items-center gap-12 relative z-10">
                                            <div className={`p-6 rounded-2xl ${method === 'card' ? 'bg-background text-emerald-deep' : 'bg-white text-text-secondary'} transition-all duration-500 shadow-md border border-border-light`}>
                                                <CreditCard className="w-14 h-14" />
                                            </div>
                                            <div>
                                                <p className={`text-4xl font-black italic tracking-tighter uppercase mb-2 ${method === 'card' ? 'text-slate-800' : 'text-text-primary'}`}>Credit Component</p>
                                                <p className={`text-sm font-bold italic transition-colors ${method === 'card' ? 'text-slate-800/70' : 'text-text-secondary'}`}>Global Instant Authorization Protocol</p>
                                            </div>
                                        </div>
                                        {method === 'card' && <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full text-emerald-deep shadow-2xl animate-[bounce_2s_infinite]"><ArrowRight className="w-8 h-8" /></div>}
                                    </button>

                                    <button
                                        onClick={() => setMethod('qr')}
                                        className={`w-full p-8 rounded-3xl border transition-all duration-700 text-left relative group overflow-hidden ${method === 'qr' ? 'bg-emerald-deep border-emerald-deep shadow-emerald' : 'bg-sidebar-bg border-border-light hover:bg-white hover:border-emerald-shine/30 shadow-sm'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                        <div className="flex items-center gap-12 relative z-10">
                                            <div className={`p-6 rounded-2xl ${method === 'qr' ? 'bg-background text-emerald-deep' : 'bg-white text-text-secondary'} transition-all duration-500 shadow-md border border-border-light`}>
                                                <QrCode className="w-14 h-14" />
                                            </div>
                                            <div>
                                                <p className={`text-4xl font-black italic tracking-tighter uppercase mb-2 ${method === 'qr' ? 'text-slate-800' : 'text-text-primary'}`}>QR Neural Grid</p>
                                                <p className={`text-sm font-bold italic transition-colors ${method === 'qr' ? 'text-slate-800/70' : 'text-text-secondary'}`}>TH-RTP Real-time Clearing Interface</p>
                                            </div>
                                        </div>
                                        {method === 'qr' && <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full text-emerald-deep shadow-2xl animate-[bounce_2s_infinite]"><ArrowRight className="w-8 h-8" /></div>}
                                    </button>
                                </div>

                                <div className="bg-sidebar-bg border border-border-light p-8 rounded-2xl mt-16 relative overflow-hidden group shadow-sm">
                                    <div className="absolute top-0 left-0 w-2.5 h-full bg-emerald-glow group-hover:bg-emerald-shine transition-colors" />
                                    <div className="flex items-start gap-10">
                                        <ShieldCheck className="w-16 h-16 text-emerald-deep mt-1" />
                                        <div>
                                            <p className="text-3xl font-black text-text-primary uppercase italic tracking-tighter mb-4">Sovereign Encryption</p>
                                            <p className="text-lg font-bold text-text-secondary leading-relaxed italic opacity-80">
                                                Data is sharded via <span className="text-text-primary font-black underline decoration-emerald-shine/40 underline-offset-4">XETA-RSA-4096</span>. No raw telemetry is stored at the gateway edge.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Logic Result Interface */}
                    <div className="relative min-h-[400px] sm:min-h-[600px]">
                        {step === 'shipping' ? (
                            <div className="h-full bg-white border border-border-light p-10 rounded-3xl shadow-custom flex flex-col items-center justify-center text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-glow opacity-5 rounded-full blur-[80px] -mr-32 -mt-32" />
                                <div className="w-32 h-32 bg-sidebar-bg rounded-[2rem] flex items-center justify-center mb-10 shadow-sm border border-border-light group-hover:rotate-6 transition-transform">
                                    <Globe className="w-14 h-14 text-emerald-shine" />
                                </div>
                                <h4 className="text-3xl font-black text-text-primary uppercase italic tracking-tighter mb-6">Inventory Allocation</h4>
                                <p className="text-lg font-bold text-text-secondary italic opacity-60 max-w-sm mb-12">Specify the geospatial delivery node for asset mobilization. All shipments are tracked via AGX-Secure-Track.</p>
                                <div className="w-full flex items-center justify-between p-6 bg-sidebar-bg rounded-2xl border border-border-light border-dashed">
                                    <div className="flex items-center gap-4">
                                        <ShieldCheck className="w-6 h-6 text-emerald-shine" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary italic">Transit Encryption Active</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-shine italic animate-pulse">Waiting for Data...</span>
                                </div>
                            </div>
                        ) : !method ? (
                            <div className="w-full space-y-12">
                                <div className="bg-emerald-glow border border-emerald-shine/10 p-8 rounded-2xl flex items-center justify-between animate-fadeIn">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-border-light">
                                            <CheckCircle className="w-8 h-8 text-emerald-shine" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-shine uppercase tracking-widest italic mb-1">Identity Verified</p>
                                            <h5 className="text-2xl font-black text-text-primary uppercase italic tracking-tighter">{shippingData.name}</h5>
                                            <p className="text-[11px] font-bold text-text-secondary italic opacity-60 leading-none mt-2">{shippingData.address}, {shippingData.city}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] italic mb-1">Zone Index</p>
                                        <p className="text-xl font-mono font-bold text-text-primary">{shippingData.zip}</p>
                                    </div>
                                </div>

                                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-border-light rounded-3xl bg-sidebar-bg group hover:border-emerald-shine/20 transition-all duration-700 shadow-inner">
                                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-12 group-hover:scale-110 group-hover:bg-background transition-all duration-1000 shadow-md">
                                        <ArrowLeft className="text-text-secondary/40 w-16 h-16 group-hover:text-emerald-shine transition-colors" />
                                    </div>
                                    <h4 className="text-4xl font-black text-text-primary uppercase italic tracking-tighter mb-6">Initialize Flow</h4>
                                    <p className="text-lg font-bold italic text-text-secondary opacity-40 max-w-sm mx-auto">Select a settlement vector on the left to activate the secure gateway interface.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-slideUp transition-all">
                                {method === 'card' && (
                                    <div className="bg-white border border-border-light p-8 rounded-3xl shadow-custom relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-glow/5 to-transparent pointer-events-none" />
                                        <div className="flex items-center justify-between mb-16">
                                            <h4 className="text-5xl font-black text-text-primary uppercase tracking-tighter italic">Card Hub</h4>
                                            <div className="flex gap-4">
                                                <div className="w-16 h-10 bg-sidebar-bg rounded-xl shadow-sm" />
                                                <div className="w-16 h-10 bg-sidebar-bg rounded-xl border border-border-light shadow-sm" />
                                            </div>
                                        </div>

                                        <div className="space-y-12">
                                            <div className="space-y-6 group/field">
                                                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.6em] italic group-focus-within/field:text-emerald-shine transition-colors">Identification Holder</label>
                                                <input type="text" placeholder="EXECUTIVE NAME" className="w-full bg-sidebar-bg border border-border-light rounded-2xl p-6 font-black text-3xl italic tracking-tighter text-text-primary focus:outline-none focus:border-emerald-shine/60 transition-all placeholder-text-secondary/10 shadow-inner uppercase" />
                                            </div>
                                            <div className="space-y-6 group/field">
                                                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.6em] italic group-focus-within/field:text-emerald-shine transition-colors">Digital Serial Number</label>
                                                <div className="relative">
                                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-sidebar-bg border border-border-light rounded-2xl p-6 font-mono text-2xl font-bold tracking-[0.4em] text-text-primary focus:outline-none focus:border-emerald-shine/60 transition-all placeholder-text-secondary/10 shadow-inner" />
                                                    <CreditCard className="absolute right-10 top-1/2 -translate-y-1/2 text-text-secondary/10 w-10 h-10" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-12">
                                                <div className="space-y-6 group/field">
                                                    <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.6em] italic group-focus-within/field:text-emerald-shine transition-colors">Temporal Scale</label>
                                                    <input type="text" placeholder="MM/YY" className="w-full bg-sidebar-bg border border-border-light rounded-2xl p-6 font-mono text-2xl font-bold tracking-widest text-text-primary focus:outline-none focus:border-emerald-shine/60 transition-all placeholder-text-secondary/10 shadow-inner" />
                                                </div>
                                                <div className="space-y-6 group/field">
                                                    <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.6em] italic group-focus-within/field:text-emerald-shine transition-colors">Validation Node</label>
                                                    <input type="password" placeholder="***" className="w-full bg-sidebar-bg border border-border-light rounded-2xl p-6 font-mono text-2xl font-bold tracking-widest text-text-primary focus:outline-none focus:border-emerald-shine/60 transition-all placeholder-text-secondary/10 shadow-inner" />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePayment}
                                            className="w-full py-9 mt-20 bg-emerald-deep text-slate-800 rounded-2xl font-black uppercase tracking-[0.5em] italic text-3xl hover:bg-emerald-rich transition-all shadow-emerald flex items-center justify-center gap-8 group"
                                        >
                                            Authorize Settlement
                                            <ArrowRight className="w-12 h-12 text-slate-800 group-hover:translate-x-4 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {method === 'qr' && (
                                    <div className="w-full space-y-12">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">
                                            {[
                                                { id: 'scb', name: 'SCB', color: '#4E2E7F', logo: 'S' },
                                                { id: 'kbank', name: 'KBank', color: '#00A950', logo: 'K' },
                                                { id: 'bbl', name: 'BBL', color: '#1B75BC', logo: 'B' },
                                                { id: 'bay', name: 'Krungsri', color: '#FDB913', logo: 'Y' },
                                                { id: 'ktb', name: 'Krungthai', color: '#00ADEF', logo: 'KT' },
                                                { id: 'ttb', name: 'ttb', color: '#00427A', logo: 'TB' },
                                            ].map((bank) => (
                                                <button
                                                    key={bank.id}
                                                    className="p-6 bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center gap-3 group/bank hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xl relative overflow-hidden"
                                                >
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs italic border shadow-glow transition-transform group-hover/bank:scale-110 group-hover/bank:rotate-12"
                                                        style={{ backgroundColor: `${bank.color}20`, borderColor: `${bank.color}40`, color: bank.color }}>
                                                        {bank.logo}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-800/40 uppercase tracking-widest group-hover/bank:text-slate-800 transition-colors">{bank.name}</span>
                                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-transparent group-hover/bank:bg-[currentColor] opacity-40 transition-colors" style={{ color: bank.color }} />
                                                </button>
                                            ))}
                                        </div>

                                        <PromptPayQR amount={amount} orderId={orderId} />

                                        <button
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                            className="w-full py-10 bg-sidebar-bg text-text-secondary border border-border-light rounded-2xl font-black uppercase tracking-[0.6em] italic text-sm hover:bg-white hover:text-text-primary hover:border-emerald-shine/30 transition-all shadow-sm relative overflow-hidden group/btn"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-glow to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                            {isProcessing ? 'SYNCHRONIZING CALLBACK...' : 'Simulate Callback Protocol'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-32 flex flex-col items-center gap-12">
                    <div className="flex items-center gap-16 opacity-20 hover:opacity-100 transition-all duration-1000 grayscale hover:grayscale-0">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-10" alt="Mastercard" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-7" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" className="h-8" alt="PromptPay" />
                    </div>
                    <div className="flex items-center gap-6">
                        <ShieldCheck className="w-4 h-4 text-text-secondary/40" />
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[1em] italic opacity-20">Secured via AGX9 Protocol</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
