import React from 'react';
import { downloadFile } from '../services/downloadService';
import { Clock, Cpu, Download, CheckCircle, QrCode } from 'lucide-react';

interface PromptPayQRProps {
    amount: number;
    phoneNumber?: string;
    orderId?: string;
}

const PromptPayQR: React.FC<PromptPayQRProps> = ({ amount, phoneNumber = '081-234-5678', orderId = 'ORD-000' }) => {
    const [timeLeft, setTimeLeft] = React.useState(299); // 4:59

    React.useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleDownloadQR = async () => {
        const mockQrUrl = `https://picsum.photos/seed/${orderId}/500/500`;
        try {
            await downloadFile(mockQrUrl, {
                filename: `promptpay_qr_${orderId}.png`,
                contentType: 'image/png',
                onComplete: () => console.log('QR Downloaded'),
                onError: (err) => alert(`Failed to download QR: ${err.message}`)
            });
        } catch (error) {
            console.error(error);
        }
    };

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=XETAPAY_PNP_${orderId}_${amount}`;

    return (
        <div className="flex flex-col items-center gap-10 bg-[var(--bg-secondary)] p-12 rounded-[3.5rem] border-2 border-[var(--border-subtle)] shadow-2xl relative overflow-hidden group">
            {/* Background Kinetic Effect */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--primary-azure)]/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />

            <div className="flex flex-col items-center text-center gap-4 relative z-10 w-full px-8">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary-azure)] animate-pulse" />
                    <h3 className="text-xl font-black uppercase tracking-[0.4em] text-[var(--text-primary)]">Neural Prompt Gateway</h3>
                </div>
                <p className="text-[10px] font-black text-[var(--text-secondary)]/40 uppercase tracking-[0.4em] leading-relaxed max-w-[280px]">
                    SCAN WITH MOBILE OPERATING SYSTEM FOR INSTANT ASSET SETTLEMENT
                </p>
            </div>

            <div className="relative group/qr p-12 bg-white rounded-[3rem] shadow-2xl transition-all duration-700 hover:rotate-2 border-2 border-[var(--border-subtle)]">
                {/* QR Focus Frame */}
                <div className="absolute inset-0 border-[6px] border-[var(--primary-azure)]/5 rounded-[3rem] -m-2 opacity-0 group-hover/qr:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="w-64 h-64 bg-white flex items-center justify-center p-4 relative z-10">
                    <img
                        src={qrUrl}
                        alt="QR Matrix"
                        className="w-full h-full object-contain group-hover/qr:scale-110 transition-transform duration-700"
                    />
                    {/* QR Pulse Center */}
                    <div className="absolute inset-x-0 h-0.5 bg-[var(--primary-azure)]/40 animate-scan pointer-events-none" />
                </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-6 relative z-10">
                <div className="bg-[var(--bg-primary)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-xl group-hover:translate-y-[-4px] transition-all duration-500">
                    <p className="text-[9px] font-black text-[var(--text-secondary)]/40 uppercase tracking-[0.3em] mb-2">AMOUNT SECURED</p>
                    <p className="text-3xl font-black text-[var(--text-primary)] tracking-tight tabular-nums border-l-2 border-[var(--primary-azure)]/20 pl-4">{amount.toLocaleString()}</p>
                </div>
                <div className="bg-[var(--bg-primary)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-xl group-hover:translate-y-[-4px] transition-all duration-500 delay-75">
                    <p className="text-[9px] font-black text-[var(--text-secondary)]/40 uppercase tracking-[0.3em] mb-2">TIME REMAINING</p>
                    <div className="flex items-center gap-2 border-l-2 border-[var(--primary-azure)]/20 pl-4">
                        <Clock className="w-4 h-4 text-[var(--primary-azure)] animate-pulse" />
                        <p className="text-3xl font-black text-[var(--text-primary)] tracking-tight tabular-nums font-mono">
                            {formatTime(timeLeft)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 py-4 px-8 bg-[var(--bg-primary)]/40 rounded-full border border-[var(--border-subtle)] animate-pulse">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.5em]">MONITORING HANDSHAKE...</span>
            </div>

            <div className="mt-8 w-full relative z-10 grid grid-cols-2 gap-6 px-4">
                <button
                    onClick={handleDownloadQR}
                    className="py-5 bg-[var(--primary-azure)]/10 text-[var(--primary-azure)] border-2 border-[var(--primary-azure)]/20 rounded-2xl font-black uppercase tracking-[0.3em] text-[9px] hover:bg-[var(--primary-azure)]/20 transition-all flex items-center justify-center gap-3"
                >
                    <Download className="w-4 h-4" />
                    Archive Map
                </button>
                <button
                    className="py-5 bg-[var(--bg-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-subtle)] rounded-2xl font-black uppercase tracking-[0.3em] text-[9px] hover:translate-y-[-4px] transition-all shadow-xl flex items-center justify-center gap-3"
                >
                    <CheckCircle className="w-4 h-4" />
                    Verify Node
                </button>
            </div>
        </div>
    );
};

export default PromptPayQR;
