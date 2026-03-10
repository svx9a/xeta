import React, { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Download, CheckCircle, FileText, PieChart, Activity, Zap, Calendar, Database, Shield, ArrowRight } from 'lucide-react';
import { downloadCSV } from '../services/downloadService';
import { MOCK_PAYMENTS } from '../constants';
import { ReportPageHeader } from '../components/reports/ReportPageHeader';
import { ReportCard } from '../components/reports/ReportCard';
import { ReportStatCard } from '../components/reports/ReportStatCard';

const ReportsPage: React.FC = () => {
    const { t } = useTranslation();
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [reportType, setReportType] = useState('transactionHistory');
    const [format, setFormat] = useState('CSV');

    const handleGenerateReport = (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setReportReady(false);
        setProgress(0);

        // Simulate generation progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsGenerating(false);
                    setReportReady(true);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleDownload = () => {
        if (format === 'CSV') {
            const exportData = MOCK_PAYMENTS.map(p => ({
                Date: new Date(p.date).toLocaleDateString(),
                OrderID: p.orderId,
                Customer: p.customer.name,
                Email: p.customer.email,
                Amount: p.amount,
                Currency: p.currency,
                Method: p.paymentMethod,
                Status: p.status
            }));

            downloadCSV(exportData, `xetapay_${reportType}_${new Date().toISOString().split('T')[0]}`, {
                onComplete: () => console.log('Download complete'),
                onError: (err) => alert(`Download failed: ${err.message}`)
            });
        } else {
            alert('PDF generation is not implemented in this demo. Please use CSV.');
        }
    };

    const inputBaseClasses = "w-full bg-slate-100 border border-slate-200 rounded-[1.25rem] p-7 text-2xl font-black tracking-tighter text-slate-800 focus:outline-none focus:border-blue-600/30 focus:bg-slate-100 transition-all appearance-none cursor-pointer pr-20 shadow-inner outline-none";
    const labelBaseClasses = "block text-[11px] font-black text-blue-600/60 uppercase tracking-[0.5em] pl-2 leading-none mb-5";

    return (
        <div className="animate-fadeIn w-full space-y-16 pb-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
            <ReportPageHeader
                title="Sovereign"
                subtitle="Analytics"
                icon={PieChart}
                description={
                    <>
                        Real-time <span className="text-slate-800 font-black underline decoration-[#4F8FC9]/40 underline-offset-[16px] uppercase tracking-widest decoration-4">Dataset Extraction</span> for high-velocity reconciliation and audit compliance.
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                {/* Generation Matrix */}
                <div className="lg:col-span-2">
                    <ReportCard
                        title="Query Constructor"
                        icon={Database}
                    >
                        <form onSubmit={handleGenerateReport} className="space-y-16 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6 group/field">
                                    <label htmlFor="report-type" className={labelBaseClasses}>Extraction Logic</label>
                                    <div className="relative">
                                        <select

                                            id="report-type"
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value)}
                                            className={inputBaseClasses}
                                        >
                                            <option value="transactionHistory" className="bg-white text-slate-800">TRANSACTION_HISTORY_V1</option>
                                            <option value="payoutSummary" className="bg-white text-slate-800">PAYOUT_RECON_V1</option>
                                        </select>
                                        <ArrowRight className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-blue-600/30 rotate-90 pointer-events-none group-focus-within/field:text-blue-600 transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-6 group/field">
                                    <label htmlFor="report-format" className={labelBaseClasses}>Target Schema</label>
                                    <div className="relative">
                                        <select
                                            id="report-format"
                                            value={format}
                                            onChange={(e) => setFormat(e.target.value)}
                                            className={inputBaseClasses}
                                        >
                                            <option value="CSV" className="bg-white text-slate-800">RAW_CSV_DATA</option>
                                            <option value="PDF" className="bg-white text-slate-800">DOC_PDF_STAMPED</option>
                                        </select>
                                        <Download className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-blue-600/30 pointer-events-none group-focus-within/field:text-blue-600 transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10 border-t border-slate-200 pt-16">
                                <label className={labelBaseClasses}>Temporal Range Vector</label>
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="relative group/input">
                                        <input type="date" className={`${inputBaseClasses} text-xl`} />
                                        <Calendar className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-blue-600/20 group-focus-within/input:text-blue-600 transition-colors pointer-events-none" />
                                    </div>
                                    <div className="relative group/input">
                                        <input type="date" className={`${inputBaseClasses} text-xl`} />
                                        <Calendar className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-blue-600/20 group-focus-within/input:text-blue-600 transition-colors pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {isGenerating && (
                                <div className="space-y-8 animate-fadeIn py-10 bg-slate-100 rounded-[2.5rem] p-12 mt-8 shadow-inner border border-slate-200">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[12px] font-black text-blue-600 uppercase tracking-[0.6em] mb-4 animate-pulse">Encoding Data Sequence</p>
                                            <p className="text-3xl font-mono text-slate-800 font-black uppercase tracking-tighter">NODE_AGX_SYNC: {progress}%</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-6 bg-white rounded-full overflow-hidden border border-slate-200 relative shadow-2xl">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#1E4A6F] via-[#2B6C9E] to-[#4F8FC9] transition-all duration-300 ease-out shadow-sm"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pt-12 border-t border-slate-200">
                                <button
                                    type="submit"
                                    disabled={isGenerating}
                                    className="w-full sm:w-auto px-16 py-8 text-[14px] font-black uppercase tracking-[0.5em] text-slate-800 bg-blue-600 hover:bg-white hover:shadow-2xl hover:translate-y-[-6px] active:translate-y-[2px] rounded-[1.5rem] shadow-2xl disabled:opacity-50 transition-all flex items-center justify-center gap-8 group border-b-4 border-b-black/20"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-7 h-7 border-[4px] border-white/20 border-t-[#0A1929] rounded-full animate-spin" />
                                            Synchronizing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-7 h-7 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                                            Execute Extraction
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {reportReady && (
                            <div className="mt-16 p-12 flex flex-col md:flex-row items-center justify-between gap-12 rounded-[2.5rem] bg-[#10B981]/5 border-2 border-[#10B981]/20 animate-slideUp relative overflow-hidden group/success shadow-2xl border-l-[12px] border-l-[#10B981]">
                                <div className="flex items-center gap-10 relative z-10">
                                    <div className="w-24 h-24 flex items-center justify-center bg-slate-100 rounded-[2rem] border border-[#10B981]/30 shadow-xl group-hover/success:rotate-12 transition-all duration-700">
                                        <CheckCircle className="w-12 h-12 text-[#10B981]" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black uppercase tracking-tighter text-slate-800 mb-4 leading-none">Sequence Complete</p>
                                        <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#10B981]/60">Audit-Ready Manifest Indexed</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownload}
                                    className="w-full md:w-auto flex items-center justify-center gap-6 px-12 py-8 text-[12px] font-black uppercase tracking-[0.5em] text-slate-800 bg-slate-100 border border-slate-200 rounded-[1.5rem] hover:bg-slate-100 hover:shadow-2xl hover:translate-y-[-4px] transition-all shadow-xl"
                                >
                                    <Download className="w-7 h-7" />
                                    Download Archive
                                </button>
                            </div>
                        )}
                    </ReportCard>
                </div>

                {/* Neural Insights */}
                <div className="space-y-12">
                    <ReportCard
                        title="Neural Analytics Hub"
                        icon={Activity}
                        className="text-slate-800"
                    >
                        <div className="space-y-16 relative z-10">
                            <div className="pb-12 border-b border-slate-200 group/row transition-all hover:translate-x-4">
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-800/20 mb-6 transition-colors group-hover/row:text-blue-600">Ledger Sequences (MTD)</p>
                                <p className="text-4xl md:text-6xl font-black tracking-tighter text-slate-800 leading-none break-words">1,284 <span className="text-sm opacity-20 uppercase ml-4 text-blue-600 tracking-[0.6em]">Units</span></p>
                            </div>
                            <div className="pb-12 border-b border-slate-200 group/row transition-all hover:translate-x-4">
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-800/20 mb-6 transition-colors group-hover/row:text-blue-600">Processed Value</p>
                                <p className="text-4xl md:text-6xl font-black tracking-tighter text-blue-600 leading-none break-words">฿ 4.12<span className="text-3xl">M</span></p>
                            </div>
                            <div className="group/row transition-all hover:translate-x-4">
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-800/20 mb-6 transition-colors group-hover/row:text-blue-600">Node Reliability</p>
                                <div className="flex items-end gap-6 text-slate-800">
                                    <p className="text-4xl md:text-6xl font-black tracking-tighter leading-none break-words">99.2<span className="text-3xl">%</span></p>
                                    <div className="mb-2 w-5 h-5 rounded-full bg-[#10B981] shadow-sm animate-ping" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 pt-12 border-t border-slate-200 flex items-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
                            <Shield className="w-6 h-6 text-[#10B981]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Compliant // AGX-9V-SECURE</span>
                        </div>
                    </ReportCard>

                    <div className="bg-white/40 rounded-[3rem] p-12 border-2 border-dashed border-slate-200 group hover:border-blue-600/40 transition-all duration-700 backdrop-blur-md">
                        <FileText className="w-12 h-12 text-blue-600 mb-10 opacity-20 group-hover:opacity-100 transition-all group-hover:rotate-12 duration-700" />
                        <h5 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.5em] leading-none mb-6">Extraction Note</h5>
                        <p className="text-[14px] font-black text-slate-800/30 leading-relaxed border-l-4 border-slate-200 pl-8 uppercase tracking-tighter">All reports are timestamp-locked and immutable once finalized on the core regional node.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
