import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import PromptPayQR from '../components/PromptPayQR';
import { useTranslation } from '../contexts/LanguageContext';
import { CheckCircleIcon } from '../components/icons';

interface PaymentDetails {
    id: string;
    merchant_name: string;
    amount_thb: number;
    status: 'PENDING' | 'PAID' | 'EXPIRED';
    expires_at: string;
}

const ConsumerPaymentPage: React.FC = () => {
    const { currentLang } = useTranslation();
    const [details, setDetails] = useState<PaymentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Run immediately to fetch data for this link
        const fetchPaymentDetails = async () => {
            try {
                // Determine API base url (for local vs prod) 
                const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:8081' : window.location.origin;
                
                const response = await fetch(`${baseUrl}/api/payment-links${window.location.pathname.replace('/pay', '')}`);
                
                if (!response.ok) {
                    throw new Error('Payment link not found or expired.');
                }
                
                const data = await response.json();
                setDetails(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetails();
        
        // Simulating websocket/polling for payment success
        const simInterval = setInterval(() => {
            setDetails(prev => {
                if (prev && prev.status === 'PENDING' && Math.random() > 0.95) {
                    return { ...prev, status: 'PAID' };
                }
                return prev;
            });
        }, 5000);

        return () => clearInterval(simInterval);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(currentLang === 'th' ? 'th-TH' : 'en-US', {
            style: 'currency',
            currency: 'THB',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !details) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center py-12">
                    <div className="text-rose-500 mb-4 text-4xl">⚠️</div>
                    <h2 className="text-xl font-black text-text-primary mb-2">Link Unavailable</h2>
                    <p className="text-text-secondary text-sm">{error || 'This payment link could not be found.'}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0f1115] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
            <div className="w-full max-w-md space-y-6 animate-fadeIn">
                {/* Header branding */}
                <div className="text-center space-y-2 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0A2540] to-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20">
                         <span className="text-white font-black text-2xl tracking-tighter">X</span>
                    </div>
                    <div className="text-sm font-bold tracking-widest text-text-secondary uppercase">Secure Checkout</div>
                </div>

                {details.status === 'PAID' ? (
                     <Card className="text-center py-12 border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full translate-y-1/2"></div>
                        <CheckCircleIcon className="w-20 h-20 text-emerald-500 mx-auto mb-6 animate-pulse" />
                        <h2 className="text-2xl font-black text-text-primary mb-2 tracking-tight">Payment Successful</h2>
                        <p className="text-text-secondary mb-8">Thank you for your payment to <br/><strong className="text-text-primary">{details.merchant_name}</strong>.</p>
                        <div className="inline-block bg-white dark:bg-sidebar-bg/50 px-6 py-3 rounded-xl border border-border-color shadow-sm">
                            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Receipt Number</div>
                            <div className="font-mono text-sm text-text-primary">TX-{Date.now().toString().slice(-8)}</div>
                        </div>
                     </Card>
                ) : (
                    <div className="bg-white dark:bg-[#1a1d24] rounded-[2rem] shadow-2xl border border-border-color overflow-hidden">
                        {/* Summary Top */}
                        <div className="p-8 pb-6 border-b border-border-color/40 bg-gray-50 dark:bg-sidebar-bg/30">
                            <div className="text-center">
                                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Amount Due</span>
                                <div className="text-4xl font-black text-primary my-2 tracking-tight">{formatCurrency(details.amount_thb)}</div>
                                <div className="text-sm font-medium text-text-primary">To: {details.merchant_name}</div>
                            </div>
                        </div>

                        {/* QR Code Body */}
                        <div className="p-8 pt-10 text-center relative">
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-6">Scan to Pay with PromptPay</p>
                            <div className="flex justify-center">
                                <PromptPayQR amount={details.amount_thb} orderId={`Order: ${details.id}`} />
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-dashed border-border-color/60 text-xs text-text-secondary">
                                Link expires on {new Date(details.expires_at).toLocaleDateString()}
                            </div>
                        </div>
                        
                        {/* Footer decorative */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-[#0A2540] to-primary"></div>
                    </div>
                )}
                
                <div className="text-center text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-8 flex items-center justify-center gap-2">
                    <span className="opacity-50">Powered by</span>
                    <span className="text-text-primary">XETAPAY</span>
                </div>
            </div>
        </div>
    );
};

export default ConsumerPaymentPage;
