// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// ⛔ CRITICAL: DO NOT USE MONACO EDITOR HERE
// ⛔ This is a PRODUCTION PAYMENT PAGE
// ⛔ Monaco would break PCI compliance
// ⛔ Security team will reject PR
// ⛔ Users don't need code editing
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

import React, { useState, useEffect } from 'react';
import { Shield, Zap, Activity, CheckCircle, Clock, ArrowRight, Download } from 'lucide-react';

interface Settlement {
    id: string;
    date: string;
    amount: number;
    mdr_pct: number;
    vat_pct: number;
    wht_pct: number;
    status: 'COMPLETED' | 'PENDING';
    method: 'SCB' | 'KBank' | 'PromptPay';
}

const SettlementManager: React.FC = () => {
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching from D1 with Thai Fee Architecture (VAT 7%, WHT 3%)
        const timer = setTimeout(() => {
            setSettlements([
                { id: 'SET-9921', date: '2026-03-05', amount: 45200.50, mdr_pct: 0.02, vat_pct: 0.07, wht_pct: 0.03, status: 'COMPLETED', method: 'SCB' },
                { id: 'SET-9922', date: '2026-03-06', amount: 12840.00, mdr_pct: 0.02, vat_pct: 0.07, wht_pct: 0.03, status: 'COMPLETED', method: 'KBank' },
                { id: 'SET-9923', date: '2026-03-08', amount: 8430.50, mdr_pct: 0.02, vat_pct: 0.07, wht_pct: 0.03, status: 'PENDING', method: 'PromptPay' },
            ]);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(val);

    const calculateFeeDetails = (amount: number, mdr_pct: number) => {
        const fee = amount * mdr_pct;
        const vat = fee * 0.07;
        const wht = fee * 0.03;
        const netFee = fee + vat - wht;
        const netPayout = amount - netFee;
        return { fee, vat, wht, netFee, netPayout };
    };

    const getBankIdentity = (method: string) => {
        const m = method.toUpperCase();
        if (m === 'SCB') return {
            color: '#7B52AB', // SCB Purple
            logo: 'S',
            fullName: 'Siam Commercial'
        };
        if (m === 'KBANK') return {
            color: '#10B981', // KBank Green
            logo: 'K',
            fullName: 'Kasikorn'
        };
        if (m === 'PROMPTPAY') return {
            color: '#3B82F6', // Azure Blue
            logo: 'PP',
            fullName: 'PromptPay RTP'
        };
        return {
            color: '#3B82F6',
            logo: 'X',
            fullName: 'External Gateway'
        };
    };

    const [qrAmount, setQrAmount] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQr, setGeneratedQr] = useState<string | null>(null);

    const handleGenerateQr = () => {
        if (!qrAmount) return;
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedQr('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=XETAPAY_MAE_MANEE_' + Date.now());
        }, 800);
    };

    const [isCashoutLoading, setIsCashoutLoading] = useState(false);
    const [cashoutSuccess, setCashoutSuccess] = useState(false);

    const handleInstantCashout = () => {
        setIsCashoutLoading(true);
        setTimeout(() => {
            setIsCashoutLoading(false);
            setCashoutSuccess(true);
            setTimeout(() => setCashoutSuccess(false), 5000);
        }, 2000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-[var(--primary-azure)]/20 border-t-[var(--primary-azure)] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fadeIn w-full pb-32">
            {/* Settlement Strategy Header */}
            <div className="relative overflow-hidden bg-[var(--bg-secondary)] rounded-[48px] p-8 sm:p-12 border border-[var(--border-subtle)] group shadow-2xl backdrop-blur-3xl">
                <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[var(--primary-azure)] opacity-5 rounded-full -mr-8 -mt-8 blur-[150px]" />
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 max-w-7xl mx-auto">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-10 mb-10">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[var(--bg-primary)] rounded-[2.5rem] border border-[var(--border-subtle)] backdrop-blur-3xl shadow-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-700">
                                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--primary-azure)]" />
                            </div>
                            <div>
                                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-[var(--text-primary)] uppercase leading-[0.85] italic">
                                    Settlement <span className="text-[var(--primary-azure)] block sm:inline">ALPHX</span>
                                </h2>
                                <p className="text-[10px] sm:text-[12px] font-black text-[var(--primary-azure)] uppercase tracking-[0.4em] sm:tracking-[0.6em] mt-5 pl-1 opacity-80 italic">NET_AGX_LIQUIDITY_PROTOCOL</p>
                            </div>
                        </div>
                        <p className="text-lg sm:text-2xl text-[var(--text-secondary)]/60 max-w-full sm:max-w-2xl font-black leading-relaxed border-l-4 border-[var(--primary-azure)]/20 pl-4 sm:pl-8 italic uppercase tracking-tight">
                            High-velocity <span className="text-[var(--text-primary)] font-black underline decoration-[var(--primary-azure)]/40 underline-offset-[12px] uppercase tracking-widest decoration-4 italic">Real-time Gross Settlement</span> protocol with embedded <span className="text-[var(--text-primary)] font-black uppercase italic">Thai VAT/WHT</span> logic.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto bg-[var(--bg-primary)] backdrop-blur-3xl p-8 sm:p-10 rounded-[3rem] border border-[var(--border-subtle)] flex items-center gap-10 shadow-2xl group/top hover:border-[var(--primary-azure)]/30 transition-all duration-700">
                        <div>
                            <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.5em] text-[var(--primary-azure)] mb-4 leading-none opacity-80 italic">Potential Liquidity</p>
                            <p className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-[var(--text-primary)] tabular-nums leading-none italic">฿ 8,304<span className="text-2xl sm:text-3xl opacity-20 ml-2">.05</span></p>
                        </div>
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[var(--primary-azure)]/10 rounded-3xl flex items-center justify-center border border-[var(--primary-azure)]/20 shadow-2xl group-hover:-rotate-12 transition-all duration-700">
                            <Clock className="text-[var(--primary-azure)] w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Settlement Ledger */}
                <div className="xl:col-span-2 flex flex-col h-full">
                    <div className="bg-[var(--bg-secondary)] rounded-[48px] border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex-1 flex flex-col group relative">
                        <div className="p-8 sm:p-12 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 relative z-10">
                            <div>
                                <h3 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-4 sm:gap-8 leading-none italic">
                                    <div className="w-8 sm:w-16 h-3 bg-[var(--primary-azure)] rounded-full" />
                                    Compliant Ledger
                                </h3>
                                <p className="text-[10px] sm:text-[12px] font-black text-[var(--primary-azure)] uppercase tracking-[0.4em] mt-5 opacity-60 border-l-2 border-[var(--primary-azure)]/20 pl-4 leading-none italic">Sequence Audit: VAT 7%, WHT 3% Disclosed</p>
                            </div>
                            <button className="w-full sm:w-auto text-[11px] font-black text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-subtle)] px-10 py-5 rounded-2xl hover:bg-[var(--primary-azure)] hover:text-white transition-all shadow-xl uppercase tracking-[0.4em] flex items-center justify-center gap-5 group/btn">
                                <Download className="w-5 h-5 group-hover/btn:translate-y-1 transition-transform" />
                                ISO Summary
                            </button>
                        </div>

                        <div className="overflow-x-auto flex-1 relative z-10 px-8 sm:px-12 pb-12">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-[var(--border-subtle)]">
                                        <th className="px-8 py-12 text-[11px] font-black text-[var(--text-secondary)]/30 uppercase tracking-[0.5em] italic">Origin Asset</th>
                                        <th className="px-8 py-12 text-[11px] font-black text-[var(--text-secondary)]/30 uppercase tracking-[0.5em] text-right italic">Gross Vol</th>
                                        <th className="px-8 py-12 text-[11px] font-black text-[var(--text-secondary)]/30 uppercase tracking-[0.5em] text-right italic">Fee Matrix</th>
                                        <th className="px-8 py-12 text-[11px] font-black text-[var(--text-secondary)]/30 uppercase tracking-[0.5em] text-right italic">Final Credit</th>
                                        <th className="px-8 py-12 text-[11px] font-black text-[var(--text-secondary)]/30 uppercase tracking-[0.5em] text-right pr-12 italic">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-subtle)]">
                                    {settlements.map((s, idx) => {
                                        const feeDetails = calculateFeeDetails(s.amount, s.mdr_pct);
                                        const bank = getBankIdentity(s.method);
                                        return (
                                            <tr key={idx} className="hover:bg-[var(--bg-primary)]/50 transition-all duration-700 group/row cursor-default">
                                                <td className="px-8 py-14">
                                                    <div className="flex items-center gap-10">
                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] flex items-center justify-center font-black text-2xl sm:text-3xl border transition-all duration-700 group-hover/row:scale-110 group-hover/row:rotate-12 shadow-xl"
                                                            style={{ backgroundColor: `${bank.color}10`, borderColor: `${bank.color}20`, color: bank.color }}>
                                                            {bank.logo}
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[var(--text-primary)] uppercase leading-none italic">{s.id}</span>
                                                            <div className="flex items-center gap-5">
                                                                <span className="text-[10px] font-black text-[var(--text-secondary)]/40 uppercase tracking-[0.2em] italic">{s.date}</span>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-subtle)]" />
                                                                <span className="text-[11px] font-black uppercase tracking-widest leading-none opacity-80 italic" style={{ color: bank.color }}>{bank.fullName}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-14 text-right">
                                                    <span className="text-xl sm:text-2xl font-black tracking-tighter text-[var(--text-secondary)]/40 tabular-nums leading-none uppercase italic">{formatCurrency(s.amount)}</span>
                                                </td>
                                                <td className="px-8 py-14 text-right">
                                                    <div className="flex flex-col items-end group-hover/row:translate-x-[-12px] transition-transform origin-right">
                                                        <span className="font-mono text-xl font-black text-rose-500 leading-none">-{formatCurrency(feeDetails.netFee)}</span>
                                                        <div className="flex items-center gap-4 mt-5">
                                                            <span className="text-[9px] font-black text-[var(--text-secondary)]/40 uppercase tracking-[0.3em] italic">VAT {formatCurrency(feeDetails.vat)}</span>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-subtle)]" />
                                                            <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.3em] italic">WHT {formatCurrency(feeDetails.wht)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-14 text-right">
                                                    <span className="text-3xl sm:text-4xl font-black tracking-tighter text-[var(--primary-azure)] tabular-nums leading-none uppercase italic">{formatCurrency(feeDetails.netPayout)}</span>
                                                </td>
                                                <td className="px-8 py-14 text-right pr-12">
                                                    <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] inline-flex items-center gap-3 border ${s.status === 'COMPLETED'
                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse'
                                                        } italic`}>
                                                        {s.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                        {s.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Panel Actions */}
                <div className="space-y-8">
                    {/* Settlement DISPATCH */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[48px] shadow-2xl flex flex-col relative overflow-hidden group">
                        <div className="p-10 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50 relative z-10 flex justify-between items-center">
                            <div>
                                <h4 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-primary)] leading-none mb-3 italic">Rapid Dispatch</h4>
                                <p className="text-[11px] font-black text-[var(--primary-azure)] uppercase tracking-[0.5em] opacity-80 leading-none italic">Mae Manee Express Node</p>
                            </div>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--bg-primary)] rounded-2xl flex items-center justify-center border border-[var(--border-subtle)] shadow-2xl group-hover:rotate-12 transition-all duration-700">
                                <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--primary-azure)]" />
                            </div>
                        </div>

                        <div className="p-8 sm:p-10 space-y-10 relative z-10">
                            <div className="bg-[var(--bg-primary)] rounded-[2.5rem] p-10 border border-[var(--border-subtle)] transition-all group-hover:bg-[var(--primary-azure)]/5 group-hover:border-[var(--primary-azure)]/20 text-center shadow-inner">
                                <p className="text-[11px] font-black text-[var(--primary-azure)] mb-8 opacity-80 italic tracking-widest uppercase">Available Liquidity</p>
                                <p className="text-5xl sm:text-6xl font-black tracking-tighter text-[var(--text-primary)] tabular-nums leading-none italic">฿ 24,150<span className="text-2xl opacity-20 ml-2">.00</span></p>
                            </div>

                            <div className="flex items-center gap-6 text-[10px] font-black bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10 text-emerald-600 shadow-sm italic">
                                <div className="relative">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-30" />
                                </div>
                                <span className="uppercase tracking-[0.4em]">Node Sync: <span className="text-[var(--text-primary)]">OPTIMAL-9</span></span>
                            </div>

                            <button
                                onClick={handleInstantCashout}
                                disabled={isCashoutLoading || cashoutSuccess}
                                className={`w-full py-8 rounded-full font-black text-[14px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-6 shadow-2xl relative overflow-hidden italic ${cashoutSuccess
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[var(--primary-azure)] text-white hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {isCashoutLoading ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        SYNCING...
                                    </>
                                ) : cashoutSuccess ? (
                                    <>
                                        <CheckCircle className="w-6 h-6" />
                                        WRITTEN
                                    </>
                                ) : (
                                    <>
                                        Settlement
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* QR Generator */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[48px] p-8 sm:p-10 shadow-2xl relative overflow-hidden group h-full">
                        <div className="flex items-center gap-6 mb-12 border-b border-[var(--border-subtle)] pb-8">
                            <div className="p-4 bg-[var(--primary-azure)]/10 rounded-2xl text-[var(--primary-azure)] border border-[var(--border-subtle)] shadow-xl group-hover:rotate-12 transition-all duration-700">
                                <Activity className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-[0.6em] leading-none opacity-80 italic">
                                Neural QR Vector
                            </h4>
                        </div>

                        <div className="space-y-12 relative z-10">
                            <div className="relative group/input">
                                <input
                                    type="number"
                                    value={qrAmount}
                                    onChange={(e) => setQrAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl px-10 py-8 text-5xl sm:text-6xl font-black tracking-tighter text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-azure)]/30 transition-all italic tabular-nums placeholder-[var(--text-secondary)]/10"
                                />
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-[var(--text-secondary)]/20 text-[10px] tracking-widest group-focus-within/input:text-[var(--primary-azure)]/40 italic uppercase">THB</span>
                            </div>

                            <button
                                onClick={handleGenerateQr}
                                disabled={!qrAmount || isGenerating}
                                className="aspect-square bg-[var(--bg-primary)]/50 border-2 border-dashed border-[var(--border-subtle)] rounded-[3rem] flex items-center justify-center p-12 cursor-pointer hover:border-[var(--primary-azure)]/30 transition-all overflow-hidden group/qr shadow-inner hover:shadow-2xl duration-700"
                            >
                                {isGenerating ? (
                                    <div className="flex flex-col items-center gap-10">
                                        <div className="w-16 h-16 border-6 border-[var(--primary-azure)]/10 border-t-[var(--primary-azure)] rounded-full animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-[var(--primary-azure)] animate-pulse italic">Encoding...</span>
                                    </div>
                                ) : generatedQr ? (
                                    <div className="w-full h-full bg-white p-10 rounded-[4rem] shadow-2xl flex flex-col items-center group-hover/qr:rotate-6 transition-all duration-700 border border-[var(--border-subtle)]">
                                        <img src={generatedQr} alt="QR" className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="text-center group-hover/qr:scale-110 transition-all duration-700">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[var(--bg-primary)] rounded-[2.5rem] flex items-center justify-center border border-[var(--border-subtle)] mx-auto mb-10 group-hover:rotate-12 transition-all shadow-xl">
                                            <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--primary-azure)] opacity-10 group-hover:opacity-100 transition-all duration-700" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]/20 group-hover:text-[var(--primary-azure)]/60 transition-colors italic">ACTIVATE QR NODE</p>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Merchant Identity & Credentials */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[48px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-12 relative z-10 border-b border-[var(--border-subtle)] pb-10">
                    <h4 className="text-[11px] sm:text-[13px] font-black text-[var(--text-primary)] uppercase tracking-[0.4em] sm:tracking-[0.6em] flex items-center gap-6 sm:gap-8 leading-none italic">
                        <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--primary-azure)]" />
                        Sovereign Merchant Protocol // <span className="text-[var(--primary-azure)] opacity-80">ENCRYPTED_NODE</span>
                    </h4>
                    <div className="flex gap-4">
                        {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-6 bg-[var(--primary-azure)]/20 rounded-full" />)}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 relative z-10">
                    {[
                        { label: 'Asset Identifier (CC)', id: 'MID_XETA_CC_0100', primary: false },
                        { label: 'Installment Node', id: 'MID_XETA_IPP_6011', primary: false },
                        { label: 'Gateway Vector', id: 'XETA_PGW_04153', primary: false },
                        { label: 'Terminal Shop ID', id: 'SHOP_QR_75382', primary: false },
                        { label: 'PRIMARY MASTER KEY', id: 'XETA_MASTER_03869', primary: true },
                    ].map((mid, idx) => (
                        <div key={idx} className={`flex flex-col p-8 sm:p-10 rounded-[2.5rem] border transition-all duration-700 hover:translate-y-[-8px] shadow-2xl group/mid ${mid.primary
                            ? 'bg-[var(--primary-azure)] border-[var(--primary-azure)] text-white'
                            : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--primary-azure)]/30'
                            }`}>
                            <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-6 sm:mb-8 transition-colors italic ${mid.primary ? 'text-white/60' : 'text-[var(--text-secondary)]/20 group-hover/mid:text-[var(--primary-azure)]/60'}`}>
                                {mid.label}
                            </span>
                            <span className={`font-mono text-[11px] sm:text-[13px] font-black break-all tracking-widest leading-relaxed italic ${mid.primary ? 'text-white' : 'text-[var(--text-primary)]/80'}`}>
                                {mid.id}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettlementManager;
