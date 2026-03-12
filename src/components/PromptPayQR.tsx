import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { downloadFile } from '../services/downloadService';

interface PromptPayQRProps {
    amount: number;
    phoneNumber?: string;
    orderId?: string;
}

const PromptPayQR: React.FC<PromptPayQRProps> = ({ amount, phoneNumber = '081-234-5678', orderId = 'ORD-000' }) => {
    const { t } = useTranslation();
    
    const handleDownloadQR = async () => {
        // In a real app, this would be the actual QR code image URL or base64
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
    
    return (
        <div className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-2xl border border-border-color shadow-sm w-full">
            <div className="mb-4 text-center">
                <img 
                    src="/icons/xeta-mark.png" 
                    alt="PromptPay" 
                    className="h-8 mx-auto mb-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                />
                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t('qrPayment')}</p>
            </div>
            
            <div className="relative p-2 sm:p-4 bg-white border-[3px] sm:border-4 border-primary rounded-xl mb-4">
                {/* Mock QR Code */}
                <div className="w-32 h-32 sm:w-48 sm:h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    <div className="grid grid-cols-8 gap-0.5 sm:gap-1 opacity-20 w-full h-full">
                        {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className={`w-5 h-5 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}></div>
                        ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <img 
                                src="/icons/xeta-mark.png" 
                                alt="XETA" 
                                className="w-8 opacity-80"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-center space-y-1">
                <p className="text-2xl font-extrabold text-text-primary">฿{amount.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{phoneNumber}</p>
            </div>
            
            <div className="mt-6 w-full">
                <button 
                    onClick={handleDownloadQR}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl satin-effect uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform active:scale-95"
                >
                    {t('download')} QR
                </button>
            </div>
        </div>
    );
};

export default PromptPayQR;
