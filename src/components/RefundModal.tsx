import React, { useState, useEffect } from 'react';
import { Payment } from '../types';
import Modal from './Modal';
import { useTranslation } from '../contexts/LanguageContext';
import { Info, AlertCircle, Zap } from 'lucide-react';

interface RefundModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: Payment | null;
    onRefundSubmit: (paymentId: string, amount: number) => void;
}

const RefundModal: React.FC<RefundModalProps> = ({ isOpen, onClose, payment, onRefundSubmit }) => {
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState('');
    const { t, currentLang } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setError('');
        }
    }, [isOpen]);

    if (!payment) return null;

    const maxRefundable = payment.amountRefundable;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = Number(value);
        setAmount(value);

        if (numValue > maxRefundable) {
            setError(t('errorAmountExceeds', { max: maxRefundable.toFixed(2) }));
        } else if (numValue <= 0 && value !== '') {
            setError(t('errorAmountPositive'));
        } else {
            setError('');
        }
    };

    const handleSubmit = () => {
        if (error || amount === '' || Number(amount) <= 0) {
            setError(t('errorInvalidAmount'));
            return;
        }
        onRefundSubmit(payment.id, Number(amount));
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(currentLang === 'th' ? 'th-TH' : 'en-US', {
            style: 'currency',
            currency: payment.currency || 'THB',
            minimumFractionDigits: payment.currency === 'VND' || payment.currency === 'IDR' ? 0 : 2
        }).format(value);
    };

    const footerContent = (
        <div className="flex justify-end items-center gap-8 w-full px-6 pb-8">
            <button onClick={onClose} className="px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] text-white/60 bg-white/10 border border-white/12 hover:bg-white/15 rounded-2xl transition-all">
                {t('cancel')}
            </button>
            <button
                onClick={handleSubmit}
                disabled={!!error || !amount}
                className="px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] text-white bg-white/20 hover:bg-white/30 rounded-2xl shadow-2xl hover:translate-y-[-4px] active:translate-y-[1px] disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center gap-4 border-b-4 border-b-white/20"
            >
                <Zap className="w-5 h-5" />
                {t('refund')} {amount ? formatCurrency(Number(amount)) : ''}
            </button>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={<span className="font-black uppercase tracking-widest text-white block pt-8 px-8">Liquidity Reversion Protocol</span>} footer={footerContent}>
            <div className="space-y-10 bg-black/40 p-10 rounded-[3rem] border-2 border-white/12 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/12 flex items-center justify-between group-hover:bg-white/10 transition-all duration-500 shadow-inner">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/12 shadow-xl group-hover:rotate-12 transition-transform duration-700">
                            <Info className="w-7 h-7 text-white/60" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.5em] mb-2 opacity-60 leading-none">{t('maxRefundable')}</p>
                            <p className="text-4xl font-black text-white uppercase tracking-tighter tabular-nums leading-none">{formatCurrency(maxRefundable)}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 ml-2">
                        <div className="w-1.5 h-6 bg-white/60 rounded-full" />
                        <label htmlFor="refund-amount" className="text-[11px] font-black text-white/80 uppercase tracking-[0.5em] leading-none">{t('refundAmount')}</label>
                    </div>

                    <div className="relative group/input">
                        <input
                            type="number"
                            id="refund-amount"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className={`w-full bg-white/[0.02] border-2 ${error ? 'border-red-500/50' : 'border-white/12'} rounded-[2.5rem] p-10 text-white font-black text-6xl focus:border-white/30 focus:bg-white/[0.04] transition-all outline-none tabular-nums placeholder:text-white/5 tracking-tighter shadow-inner`}
                        />
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-white/40 font-black text-xl tracking-[0.4em] pointer-events-none">{payment.currency}</div>
                    </div>
                    {error && (
                        <div className="flex items-center gap-4 ml-6 animate-fadeIn">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            <p className="text-red-400 text-[11px] font-black uppercase tracking-[0.3em]">{error}</p>
                        </div>
                    )}
                </div>

                <div className="pt-10 border-t border-white/12">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] leading-relaxed border-l-4 border-white/10 pl-6 h-6 flex items-center">
                        Notice: Asset reversion initiates instant kinetic verification across regional neural hubs.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default RefundModal;