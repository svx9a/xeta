import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { downloadFile } from '../services/downloadService';
import { Clock, Cpu, Download, CheckCircle } from 'lucide-react';

interface PromptPayQRProps {
    amount: number;
    phoneNumber?: string;
    orderId?: string;
}

const PromptPayQR: React.FC<PromptPayQRProps> = ({ amount, phoneNumber = '081-234-5678', orderId = 'ORD-000' }) => {
    const { t } = useTranslation();
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
        <div className="flex flex-col items-center p-8 bg-black/40 rounded-3xl border-2 border-white/12 backdrop-blur-3xl relative overflow-hidden group shadow-[0_80px_150px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />

            <div className="w-full flex justify-between items-center mb-12 relative z-10 px-4">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/10 rounded-xl border border-white/12 shadow-2xl transition-transform group-hover:rotate-12">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png"
                            alt="PromptPay"
                            className="h-8 filter brightness-200 invert opacity-90"
                        />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-white uppercase tracking-[0.5em] italic leading-none mb-1">TH-RTP Interface</p>
                        <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.3em] italic opacity-60">Node Certified: B.O.T. v9.2</p>
                    </div>
                </div>
                <div className="bg-white/20 px-6 py-3 rounded-xl border border-white/12 shadow-glow flex items-center gap-4 group/timer hover:border-white/40 transition-all">
                    <Clock className="w-5 h-5 text-white/60 animate-pulse" />
                    <span className="font-mono text-2xl font-black text-white/90 tracking-widest tabular-nums">{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="relative mb-14 group-hover:scale-[1.03] transition-all duration-1000">
                <div className="absolute -inset-20 bg-white opacity-5 rounded-full blur-[100px] animate-pulse" />
                <div className="relative p-8 bg-black/60 rounded-2xl border-2 border-white/12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden group/qr">
                    {/* Neural Grid Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] transition-opacity group-hover/qr:opacity-[0.06]">
                        <div className="grid grid-cols-24 h-full w-full">
                            {Array.from({ length: 576 }).map((_, i) => (
                                <div key={i} className="border-[0.5px] border-white/20" />
                            ))}
                        </div>
                    </div>

                    <div className="w-72 h-72 bg-white/10 flex items-center justify-center relative overflow-hidden rounded-2xl shadow-glow p-8 cursor-none border border-white/20">
                        {/* Dynamic High-Res QR */}
                        <img
                            src={qrUrl}
                            alt="QR Matrix"
                            className="w-full h-full object-contain mix-blend-lighten group-hover/qr:scale-[1.02] transition-transform duration-700"
                        />

                        {/* High-Resolution Scanning Beam */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-[200%] w-full -translate-y-full animate-[scan_4s_linear_infinite] pointer-events-none mix-blend-overlay" />

                        {/* Corner Target Markers */}
                        <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-white/60 rounded-tl-2xl opacity-40" />
                        <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-white/60 rounded-tr-2xl opacity-40" />
                        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-white/60 rounded-bl-2xl opacity-40" />
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-white/60 rounded-br-2xl opacity-40" />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-black/50 rounded-2xl flex items-center justify-center shadow-glow border-2 border-white/20 relative overflow-hidden group/innerlogo hover:scale-110 transition-transform duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/innerlogo:opacity-100 transition-opacity" />
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png"
                                    alt="PP"
                                    className="w-14 relative z-10 filter brightness-200 drop-shadow-glow"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center space-y-8 relative z-10 w-full px-4">
                <div className="flex flex-col items-center">
                    <span className="text-[11px] font-black text-white/70 uppercase tracking-[1em] mb-6 italic opacity-60">Asset Value Extraction</span>
                    <div className="flex items-end gap-4 justify-center">
                        <span className="text-4xl font-black text-white/20 italic pb-2 tracking-tighter tabular-nums">฿</span>
                        <p className="text-8xl font-black text-white italic tracking-tighter drop-shadow-glow tabular-nums leading-none">
                            {amount.toLocaleString()}
                            <span className="text-3xl opacity-20">.00</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white/5 px-8 py-5 rounded-2xl border border-white/12 backdrop-blur-3xl flex items-center justify-between group/id hover:border-white/30 transition-all cursor-copy shadow-inner">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.5em] mb-2 italic opacity-40">Vector ID / Node</p>
                        <p className="text-2xl font-mono font-bold text-white/90 uppercase tracking-[0.3em] drop-shadow-glow">{phoneNumber}</p>
                    </div>
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/12 group-hover/id:border-white/40 transition-all group-hover/id:rotate-180 duration-1000 shadow-2xl">
                        <Cpu className="w-7 h-7 text-white/50 group-hover/id:text-white/80 transition-colors" />
                    </div>
                </div>
            </div>

            <div className="mt-14 w-full relative z-10 grid grid-cols-2 gap-6 px-4">
                <button
                    onClick={handleDownloadQR}
                    className="py-7 bg-white/20 text-white border-2 border-white/12 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/30 transition-all shadow-xl italic flex items-center justify-center gap-3"
                >
                    <Download className="w-4 h-4" />
                    Archive Map
                </button>
                <button
                    className="py-7 bg-white/30 text-white border-2 border-white/12 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:scale-[1.05] transition-all shadow-2xl italic flex items-center justify-center gap-3"
                >
                    <CheckCircle className="w-4 h-4" />
                    Verify Node
                </button>
            </div>

            <div className="mt-12 text-center opacity-20">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-[1em] italic">XETA-CRYPTO-P092-TH</p>
            </div>
        </div>
    );
};

export default PromptPayQR;
