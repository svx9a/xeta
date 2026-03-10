// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// ⛔ CRITICAL: DO NOT USE MONACO EDITOR HERE
// ⛔ This is a PRODUCTION PAYMENT PAGE
// ⛔ Monaco would break PCI compliance
// ⛔ Security team will reject PR
// ⛔ Users don't need code editing
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

import React, { useState, useEffect } from 'react';
import { Shield, Zap, DollarSign, Activity, FileText, CheckCircle, Clock, ArrowRight, ExternalLink, Download } from 'lucide-react';
import Card from './Card';

const SettlementManager: React.FC = () => {
    const [settlements, setSettlements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching from D1 with Thai Fee Architecture (VAT 7%, WHT 3%)
        setTimeout(() => {
            setSettlements([
                { id: 'SET-9921', date: '2026-03-05', amount: 45200.50, mdr_pct: 0.02, vat_pct: 0.07, wht_pct: 0.03, status: 'COMPLETED', method: 'SCB' },
                { id: 'SET-9922', date: '2026-03-06', amount: 12840.00, mdr_pct: 0.02, vat_pct: 0.07, wht_pct: 0.03, status: 'COMPLETED', method: 'KBank' },
                { id: 'SET-9923', date: '2026-03-08', amount: 8430.50, mdr_pct: 0.02, vat_pct: 0.07, wht_pct: 0.03, status: 'PENDING', method: 'PromptPay' },
            ]);
            setIsLoading(false);
        }, 1000);
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
            color: '#7B52AB', // SCB Purple but tuned for dark
            gradient: 'from-[#7B52AB]/20 to-transparent',
            logo: 'S',
            fullName: 'Siam Commercial'
        };
        if (m === 'KBANK') return {
            color: '#10B981', // KBank Green
            gradient: 'from-[#10B981]/20 to-transparent',
            logo: 'K',
            fullName: 'Kasikorn'
        };
        if (m === 'PROMPTPAY') return {
            color: '#4F8FC9', // PromptPay Blue
            gradient: 'from-[#4F8FC9]/20 to-transparent',
            logo: 'PP',
            fullName: 'PromptPay RTP'
        };
        return {
            color: '#4F8FC9',
            gradient: 'from-[#4F8FC9]/20 to-transparent',
            logo: 'X',
            fullName: 'External Gateway'
        };
    };

    const [qrAmount, setQrAmount] = useState('');
    const [isGenerating, setIsLoadingQr] = useState(false);
    const [generatedQr, setGeneratedQr] = useState<string | null>(null);

    const handleGenerateQr = () => {
        if (!qrAmount) return;
        setIsLoadingQr(true);
        setTimeout(() => {
            setIsLoadingQr(false);
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

    return (
        <div className="space-y-12 animate-fadeIn w-full pb-32">
            {/* Settlement Strategy Header */}
            <div className="relative overflow-hidden bg-white rounded-[48px] p-12 text-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-slate-200 group">
                <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-blue-600 opacity-5 rounded-full -mr-8 -mt-8 blur-[150px]" />
                <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-10 mb-10">
                            <div className="w-24 h-24 bg-white/[0.03] rounded-[2.5rem] border border-slate-200 backdrop-blur-3xl shadow-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-700">
                                <Shield className="w-12 h-12 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-slate-800 uppercase leading-[0.85]">
                                    Settlement <span className="text-blue-600 block sm:inline">ALPHX</span>
                                </h1>
                                <p className="text-[10px] sm:text-[12px] font-black text-blue-600 uppercase tracking-[0.4em] sm:tracking-[0.6em] mt-5 pl-1 opacity-60">NET_AGX_LIQUIDITY_PROTOCOL</p>
                            </div>
                        </div>
                        <p className="text-lg sm:text-2xl text-slate-800/40 max-w-full sm:max-w-2xl font-medium leading-relaxed border-l-4 border-blue-600/20 pl-4 sm:pl-8">
                            High-velocity <span className="text-slate-800 font-black underline decoration-[#4F8FC9]/40 underline-offset-[12px] uppercase tracking-widest decoration-4">Real-time Gross Settlement</span> protocol with embedded <span className="text-slate-800 font-black">Thai VAT/WHT</span> logic.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto bg-white/[0.03] backdrop-blur-xl p-10 rounded-[3rem] border border-slate-200 flex items-center gap-10 shadow-2xl group/top hover:border-blue-600/30 transition-all duration-700">
                        <div>
                            <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.5em] text-blue-600 mb-4 leading-none opacity-60">Potential Liquidity</p>
                            <p className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-800 tabular-nums leading-none">฿ 8,304<span className="text-2xl sm:text-3xl opacity-20 ml-2">.05</span></p>
                        </div>
                        <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-600/20 shadow-2xl group-hover:-rotate-12 transition-all duration-700">
                            <Clock className="text-blue-600 w-12 h-12 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Settlement Ledger */}
                <div className="xl:col-span-2 flex flex-col h-full">
                    <div className="bg-white rounded-[48px] border border-slate-200 shadow-2xl overflow-hidden flex-1 flex flex-col group relative backdrop-blur-3xl">
                        <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

                        <div className="p-12 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 relative z-10 bg-white/[0.02]">
                            <div>
                                <h3 className="text-2xl sm:text-4xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-4 sm:gap-8 leading-none">
                                    <div className="w-8 sm:w-16 h-3 bg-blue-600 rounded-full" />
                                    Compliant Ledger
                                </h3>
                                <p className="text-[10px] sm:text-[12px] font-black text-blue-600 uppercase tracking-[0.4em] mt-5 opacity-60 border-l-2 border-blue-600/20 pl-4 leading-none">Sequence Audit: VAT 7%, WHT 3% Disclosed</p>
                            </div>
                            <button className="w-full sm:w-auto text-[11px] font-black text-slate-800 bg-slate-100 border border-slate-200 px-10 py-5 rounded-2xl hover:bg-blue-600 hover:text-slate-800 transition-all shadow-xl uppercase tracking-[0.4em] flex items-center justify-center gap-5 group/btn border-b-4 border-b-black/20">
                                <Download className="w-5 h-5 group-hover/btn:translate-y-1 transition-transform" />
                                ISO Summary
                            </button>
                        </div>

                        <div className="overflow-x-auto flex-1 relative z-10 px-12 pb-12">
                            <table className="w-full text-left border-collapse min-w-full sm:min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="px-8 py-12 text-[11px] font-black text-slate-800/30 uppercase tracking-[0.5em]">Settlement Asset / Origin</th>
                                        <th className="px-8 py-12 text-[11px] font-black text-slate-800/30 uppercase tracking-[0.5em] text-right">Gross Vol</th>
                                        <th className="px-8 py-12 text-[11px] font-black text-slate-800/30 uppercase tracking-[0.5em] text-right">Fee Matrix</th>
                                        <th className="px-8 py-12 text-[11px] font-black text-slate-800/30 uppercase tracking-[0.5em] text-right">Final Credit</th>
                                        <th className="px-8 py-12 text-[11px] font-black text-slate-800/30 uppercase tracking-[0.5em] text-right pr-12">Integrity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {settlements.map((s, idx) => {
                                        const feeDetails = calculateFeeDetails(s.amount, s.mdr_pct);
                                        const bank = getBankIdentity(s.method);
                                        return (
                                            <tr key={idx} className="hover:bg-white/[0.03] transition-all duration-700 group/row cursor-default">
                                                <td className="px-8 py-14">
                                                    <div className="flex items-center gap-10">
                                                        <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-3xl border transition-all duration-700 group-hover/row:scale-110 group-hover/row:rotate-12 shadow-xl"
                                                            style={{ backgroundColor: `${bank.color}10`, borderColor: `${bank.color}20`, color: bank.color }}>
                                                            {bank.logo}
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <span className="text-3xl font-black tracking-tighter text-slate-800 uppercase leading-none">{s.id}</span>
                                                            <div className="flex items-center gap-5">
                                                                <span className="text-[10px] font-black text-slate-800/20 uppercase tracking-[0.2em]">{s.date}</span>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                                                                <span className="text-[11px] font-black uppercase tracking-widest leading-none opacity-80" style={{ color: bank.color }}>{bank.fullName}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-14 text-right">
                                                    <span className="text-2xl font-black tracking-tighter text-slate-800/30 tabular-nums leading-none uppercase">{formatCurrency(s.amount)}</span>
                                                </td>
                                                <td className="px-8 py-14 text-right">
                                                    <div className="flex flex-col items-end group-hover/row:translate-x-[-12px] transition-transform origin-right">
                                                        <span className="font-mono text-xl font-black text-red-400 leading-none">-{formatCurrency(feeDetails.netFee)}</span>
                                                        <div className="flex items-center gap-4 mt-5">
                                                            <span className="text-[9px] font-black text-slate-800/20 uppercase tracking-[0.3em]">VAT {formatCurrency(feeDetails.vat)}</span>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                                                            <span className="text-[9px] font-black text-[#10B981]/40 uppercase tracking-[0.3em]">WHT {formatCurrency(feeDetails.wht)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-14 text-right">
                                                    <span className="text-4xl font-black tracking-tighter text-blue-600 tabular-nums leading-none uppercase">{formatCurrency(feeDetails.netPayout)}</span>
                                                </td>
                                                <td className="px-8 py-14 text-right pr-12">
                                                    <span className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] inline-flex items-center gap-4 shadow-2xl transition-all hover:translate-y-[-4px] border ${s.status === 'COMPLETED'
                                                        ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                                                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                                                        }`}>
                                                        <CheckCircle className="w-5 h-5" />
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
                    {/* SCB Bridge */}
                    <div className="bg-white border border-slate-200 rounded-[48px] shadow-2xl flex flex-col relative overflow-hidden group backdrop-blur-3xl">
                        <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

                        <div className="p-10 border-b border-slate-200 bg-white/[0.02] transition-colors relative z-10 flex justify-between items-center">
                            <div>
                                <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-800 leading-none mb-3">Rapid Dispatch</h4>
                                <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.5em] opacity-60 leading-none">Mae Manee Express Node</p>
                            </div>
                            <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center border border-slate-200 shadow-2xl group-hover:rotate-12 transition-all duration-700">
                                <Zap className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="p-10 space-y-10 relative z-10">
                            <div className="bg-white/[0.02] rounded-[2.5rem] p-10 border border-slate-200 transition-all group-hover:bg-blue-600/5 group-hover:border-blue-600/20 text-center shadow-inner">
                                <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.6em] mb-8 opacity-60 leading-none">Available Liquidity</p>
                                <p className="text-6xl font-black tracking-tighter text-slate-800 tabular-nums leading-none">฿ 24,150<span className="text-2xl opacity-20 ml-2">.00</span></p>
                            </div>

                            <div className="flex items-center gap-6 text-[12px] font-black bg-[#10B981]/5 p-8 rounded-2xl border border-[#10B981]/10 text-[#10B981] shadow-2xl">
                                <div className="relative">
                                    <div className="w-4 h-4 rounded-full bg-[#10B981] shadow-sm" />
                                    <div className="absolute inset-0 bg-[#10B981] rounded-full animate-ping opacity-30" />
                                </div>
                                <span className="uppercase tracking-[0.5em] leading-none opacity-80">Node Sync: <span className="text-slate-800">OPTIMAL-9</span></span>
                            </div>

                            <button
                                onClick={handleInstantCashout}
                                disabled={isCashoutLoading || cashoutSuccess}
                                className={`w-full py-10 rounded-full font-black text-[14px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-6 shadow-2xl relative overflow-hidden group/btn border-b-4 border-b-black/40 ${cashoutSuccess
                                    ? 'bg-[#10B981] text-slate-800'
                                    : 'bg-blue-600 text-slate-800 hover:translate-y-[-4px] active:translate-y-[2px] hover:shadow-[#4F8FC9]/20'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-slate-200 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                {isCashoutLoading ? (
                                    <>
                                        <div className="w-7 h-7 border-4 border-white/30 border-t-[#0A1929] rounded-full animate-spin" />
                                        SYNCING ASSETS...
                                    </>
                                ) : cashoutSuccess ? (
                                    <>
                                        <CheckCircle className="w-7 h-7" />
                                        LEDGER WRITTEN
                                    </>
                                ) : (
                                    <>
                                        Execute Settlement
                                        <ArrowRight className="w-7 h-7 group-hover:translate-x-4 transition-transform duration-700" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* QR Generator */}
                    <div className="bg-white border border-slate-200 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group h-full backdrop-blur-3xl">
                        <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

                        <div className="flex items-center gap-6 mb-12 border-b border-slate-200 pb-8">
                            <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-600 border border-blue-600/10 shadow-xl group-hover:rotate-12 transition-all duration-700">
                                <Activity className="w-7 h-7" />
                            </div>
                            <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em] leading-none opacity-80">
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
                                    className="w-full bg-white/[0.02] border border-slate-200 rounded-3xl px-12 py-10 text-6xl font-black tracking-tighter text-slate-800 focus:outline-none focus:border-blue-600/30 focus:bg-white/[0.04] transition-all outline-none tabular-nums placeholder-white/5 shadow-inner"
                                />
                                <span className="absolute right-12 top-1/2 -translate-y-1/2 font-black text-slate-800/10 text-[12px] uppercase tracking-[0.8em] group-focus-within/input:text-blue-600/40 leading-none">THB</span>
                            </div>

                            <button
                                onClick={handleGenerateQr}
                                disabled={!qrAmount || isGenerating}
                                className="aspect-square bg-white/[0.01] border-2 border-dashed border-slate-200 rounded-[3rem] flex items-center justify-center p-12 cursor-pointer hover:border-blue-600/30 transition-all overflow-hidden group/qr shadow-inner group-hover:shadow-2xl group-hover:scale-[1.02] duration-700"
                            >
                                {isGenerating ? (
                                    <div className="flex flex-col items-center gap-10">
                                        <div className="w-20 h-20 border-6 border-blue-600/10 border-t-[#4F8FC9] rounded-full animate-spin shadow-2xl" />
                                        <span className="text-[12px] font-black uppercase tracking-[0.8em] text-blue-600 animate-pulse leading-none">Encoding...</span>
                                    </div>
                                ) : generatedQr ? (
                                    <div className="w-full h-full bg-white p-12 rounded-[4rem] shadow-2xl flex flex-col items-center group-hover/qr:rotate-6 transition-all duration-700">
                                        <img src={generatedQr} alt="QR" className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="text-center group-hover/qr:scale-110 transition-all duration-700">
                                        <div className="w-24 h-24 bg-white/[0.03] rounded-[2.5rem] flex items-center justify-center border border-slate-200 mx-auto mb-10 group-hover:rotate-12 transition-all shadow-xl">
                                            <Zap className="w-12 h-12 text-blue-600 opacity-10 group-hover:opacity-100 transition-all duration-700" />
                                        </div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-800/10 group-hover:text-blue-600/60 transition-colors leading-none pr-[-0.8em]">ACTIVATE QR NODE</p>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Merchant Identity & Credentials */}
            <div className="bg-white border border-slate-200 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group backdrop-blur-3xl">
                <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />

                <div className="flex items-center justify-between mb-12 relative z-10 border-b border-slate-200 pb-10">
                    <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.6em] flex items-center gap-8 leading-none">
                        <Shield className="w-10 h-10 text-blue-600" />
                        Sovereign Merchant Protocol // <span className="text-blue-600 opacity-60">ENCRYPTED_NODE</span>
                    </h4>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-6 bg-blue-600/20 rounded-full" />)}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
                    {[
                        { label: 'Asset Identifier (CC)', id: 'MID_XETA_CC_0100', primary: false },
                        { label: 'Installment Node', id: 'MID_XETA_IPP_6011', primary: false },
                        { label: 'Gateway Vector', id: 'XETA_PGW_04153', primary: false },
                        { label: 'Terminal Shop ID', id: 'SHOP_QR_75382', primary: false },
                        { label: 'PRIMARY MASTER KEY', id: 'XETA_MASTER_03869', primary: true },
                    ].map((mid, idx) => (
                        <div key={idx} className={`flex flex-col p-12 rounded-[2.5rem] border transition-all duration-700 hover:translate-y-[-8px] shadow-2xl group/mid ${mid.primary
                            ? 'bg-blue-600 border-blue-600 text-slate-800 shadow-[#4F8FC9]/20'
                            : 'bg-white/[0.02] border-slate-200 hover:border-blue-600/30'
                            }`}>
                            <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-8 transition-colors ${mid.primary ? 'text-slate-800/40' : 'text-slate-800/10 group-hover/mid:text-blue-600/60'}`}>
                                {mid.label}
                            </span>
                            <span className={`font-mono text-[14px] font-black break-all tracking-widest leading-relaxed ${mid.primary ? 'text-slate-800' : 'text-slate-800/80'}`}>
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
