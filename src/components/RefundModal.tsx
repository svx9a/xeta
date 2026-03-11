import React, { useState, useEffect } from 'react';
import { Payment } from '../types';
import Modal from './Modal';
import { useTranslation } from '../contexts/LanguageContext';

interface RefundModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: Payment | null;
    onRefundSubmit: (paymentId: string, amount: number) => void;
}

const RefundModal: React.FC<RefundModalProps> = ({ isOpen, onClose, payment, onRefundSubmit }) => {
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState('');
    const { t } = useTranslation();

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

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB' }).format(value);

    const footerContent = (
        <>
            <button onClick={onClose} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-text-secondary bg-white dark:bg-card-bg border border-border-color hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-all">
                {t('cancel')}
            </button>
            <button 
                onClick={handleSubmit} 
                disabled={!!error || !amount} 
                className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-white satin-effect rounded-full shadow-satin hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all"
            >
                {t('refund')} {amount ? formatCurrency(Number(amount)) : ''}
            </button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('refund')} ${t('order')} #${payment.orderId}`} footer={footerContent}>
            <div className="space-y-6">
                 <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{t('maxRefundable')}</p>
                    <p className="text-2xl font-extrabold text-text-primary tracking-tight">{formatCurrency(maxRefundable)}</p>
                </div>
                
                <div>
                    <label htmlFor="refund-amount" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('refundAmount')}</label>
                    <div className="relative">
                        <input
                            type="number"
                            id="refund-amount"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className={`w-full bg-white dark:bg-background border ${error ? 'border-rose-500' : 'border-border-color'} rounded-xl p-4 text-text-primary font-bold text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none`}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-sm">THB</div>
                    </div>
                    {error && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{error}</p>}
                </div>
            </div>
        </Modal>
    );
};

export default RefundModal;