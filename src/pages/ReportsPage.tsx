import React, { useState } from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { DownloadIcon, CheckCircleIcon } from '../components/icons';
import { downloadCSV } from '../services/downloadService';
import { MOCK_PAYMENTS } from '../constants';

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
            // Transform data for export
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
                onComplete: () => {
                    console.log('Download complete');
                },
                onError: (err) => {
                    alert(`Download failed: ${err.message}`);
                }
            });
        } else {
            alert('PDF generation is not implemented in this demo. Please use CSV.');
        }
    };

    return (
        <div className="animate-fadeIn max-w-4xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-8">{t('generateReports')}</h1>

            <Card>
                <form onSubmit={handleGenerateReport} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="report-type" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('reportType')}</label>
                            <select 
                                id="report-type" 
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-3.5 text-sm font-bold text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                            >
                                <option value="transactionHistory">{t('transactionHistory')}</option>
                                <option value="payoutSummary">{t('payoutSummary')}</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="report-format" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('format')}</label>
                            <select 
                                id="report-format" 
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-3.5 text-sm font-bold text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                            >
                                <option value="CSV">CSV</option>
                                <option value="PDF">PDF</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('dateRange')}</label>
                        <div className="flex items-center gap-4">
                            <input type="date" className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-3.5 text-sm font-bold text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer" />
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">to</span>
                            <input type="date" className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-3.5 text-sm font-bold text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer" />
                        </div>
                    </div>

                    {isGenerating && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                                <span>{t('generating')}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-sidebar-bg/30 rounded-full overflow-hidden">
                                <div 
                                    className="h-full satin-effect transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={isGenerating} 
                            className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white satin-effect rounded-full shadow-satin hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all"
                        >
                            {isGenerating ? t('generating') : t('generateReport')}
                        </button>
                    </div>
                </form>

                {reportReady && (
                    <div className="mt-10 p-6 flex items-center justify-between gap-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800 animate-fadeIn">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-800/50 rounded-full">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold tracking-tight">{t('reportReady')}</p>
                                <p className="text-xs font-medium opacity-80">Your file is ready for download</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-white border border-emerald-200 rounded-full hover:bg-emerald-50 transition-all shadow-sm"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            {t('download')}
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ReportsPage;
