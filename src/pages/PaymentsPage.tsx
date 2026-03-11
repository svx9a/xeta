import React, { useState, useCallback } from 'react';
import Card from '../components/Card';
import PaymentsTable from '../components/PaymentsTable';
import { Payment } from '../types';
import Modal from '../components/Modal';
import RefundModal from '../components/RefundModal';
import { useTranslation } from '../contexts/LanguageContext';
import { usePayments } from '../contexts/PaymentsContext';
import PromptPayQR from '../components/PromptPayQR';
import { TranslationKeys } from '../translations';
import DoubleVerifyPaymentModal from '../components/DoubleVerifyPaymentModal';

const PaymentDetailRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between py-4 border-b border-border-color/60 last:border-b-0">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-text-primary text-right tracking-tight">{value}</span>
    </div>
);

const PaymentsPage: React.FC = () => {
    const { payments, updatePayment } = usePayments();
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [isDoubleVerifyOpen, setIsDoubleVerifyOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { t, currentLang } = useTranslation();

    const handleUpdatePayment = useCallback((paymentId: string, updates: Partial<Payment>) => {
        updatePayment(paymentId, updates);
        setSelectedPayment(prev => (prev && prev.id === paymentId) ? { ...prev, ...updates } : prev);
    }, [updatePayment]);
    
    const formatCurrency = (value: number, currency: string = 'THB') => {
        return new Intl.NumberFormat(currentLang === 'th' ? 'th-TH' : 'en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'VND' || currency === 'IDR' ? 0 : 2
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(currentLang === 'th' ? 'th-TH' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const openDetailModal = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsDetailModalOpen(true);
    };
    
    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setTimeout(() => setSelectedPayment(null), 300);
    };

    const openRefundModal = () => {
        setIsDetailModalOpen(false); // Close details
        setIsRefundModalOpen(true); // Open refund
    };
    
    const closeRefundModal = () => {
        setIsRefundModalOpen(false);
        setTimeout(() => setSelectedPayment(null), 300);
    };

    const simulateApiCall = () => {
        setIsProcessing(true);
        return new Promise(resolve => setTimeout(() => {
            setIsProcessing(false);
            resolve(true);
        }, 1500));
    };

    const handleCaptureStart = (payment: Payment) => {
        setSelectedPayment(payment);
        // Requirement: Show verification for high risk
        if (payment.risk === 'High' || payment.amount > 50000) {
            setIsDetailModalOpen(false);
            setIsDoubleVerifyOpen(true);
        } else {
            handleCapture(payment);
        }
    };

    const handleCapture = async (payment: Payment) => {
        await simulateApiCall();
        handleUpdatePayment(payment.id, {
            status: 'captured',
            amountCapturable: 0,
            capturedAmount: payment.amount,
            amountRefundable: payment.amount,
        });
        closeDetailModal();
        setIsDoubleVerifyOpen(false);
    };

    const handleVoid = async (payment: Payment) => {
        await simulateApiCall();
        handleUpdatePayment(payment.id, {
            status: 'voided',
            amountCapturable: 0,
        });
        closeDetailModal();
    };

    const handleRefundSubmit = async (paymentId: string, amount: number) => {
        const payment = payments.find(p => p.id === paymentId);
        if (!payment) return;

        await simulateApiCall();
        
        const newRefundedAmount = payment.refundedAmount + amount;
        const newAmountRefundable = payment.amountRefundable - amount;
        const newStatus = newAmountRefundable > 0 ? 'partially_refunded' : 'refunded';

        handleUpdatePayment(paymentId, {
            status: newStatus,
            refundedAmount: newRefundedAmount,
            amountRefundable: newAmountRefundable,
        });

        closeRefundModal();
    };


    const renderDetailModalContent = () => {
        if (!selectedPayment) return null;
        return (
            <div className="space-y-1">
                <PaymentDetailRow label={t('orderId')} value={selectedPayment.orderId} />
                <PaymentDetailRow label={t('totalAmount')} value={formatCurrency(selectedPayment.amount, selectedPayment.currency)} />
                <PaymentDetailRow label={t('status')} value={<span className="capitalize">{t(selectedPayment.status as TranslationKeys)}</span>} />
                <PaymentDetailRow label={t('paymentMethod')} value={<span className="uppercase tracking-widest text-[10px] font-bold">{t(selectedPayment.paymentMethod as TranslationKeys)}</span>} />
                <PaymentDetailRow label={t('capturedAmount')} value={formatCurrency(selectedPayment.capturedAmount, selectedPayment.currency)} />
                <PaymentDetailRow label={t('refundedAmount')} value={formatCurrency(selectedPayment.refundedAmount, selectedPayment.currency)} />
                <PaymentDetailRow label={t('date')} value={formatDate(selectedPayment.date)} />
                <PaymentDetailRow label={t('customer')} value={selectedPayment.customer.name} />
                <PaymentDetailRow label={t('email')} value={selectedPayment.customer.email} />
                
                {selectedPayment.paymentMethod === 'credit_card' && (
                    <PaymentDetailRow label={t('card')} value={`${selectedPayment.card.brand} **** ${selectedPayment.card.last4}`} />
                )}

                {selectedPayment.paymentMethod === 'promptpay' && (
                    <div className="py-6 border-t border-border-color/60 mt-4">
                        <PromptPayQR amount={selectedPayment.amount} orderId={selectedPayment.orderId} />
                    </div>
                )}

                {selectedPayment.paymentMethod === 'qr_code' && (
                    <div className="py-6 border-t border-border-color/60 mt-4 text-center">
                         <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">{t('qrPayment')}</p>
                         <div className="w-32 h-32 bg-white p-2 border border-border-color/60 rounded-xl mx-auto flex items-center justify-center">
                            <div className="w-full h-full bg-sidebar-bg/20 rounded-lg flex items-center justify-center">
                                <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50">QR CODE</span>
                            </div>
                         </div>
                    </div>
                )}

                {selectedPayment.risk && (
                    <>
                        <PaymentDetailRow label={t('aiRisk')} value={selectedPayment.risk} />
                        <PaymentDetailRow label={t('riskReason')} value={<span className="text-[10px] font-medium leading-relaxed">{selectedPayment.riskReason || 'N/A'}</span>} />
                    </>
                )}
            </div>
        );
    };

    const renderDetailModalFooter = () => {
        if (!selectedPayment) return null;

        const canCapture = selectedPayment.status === 'authorized';
        const canVoid = selectedPayment.status === 'authorized';
        const canRefund = (selectedPayment.status === 'captured' || selectedPayment.status === 'partially_refunded') && selectedPayment.amountRefundable > 0;

        const buttonBase = "px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-200 disabled:opacity-50 hover:scale-105";
        const primaryButton = `${buttonBase} text-white satin-effect shadow-satin`;
        const secondaryButton = `${buttonBase} text-text-secondary bg-white border border-border-color/60 hover:bg-gray-50`;

        return (
            <div className="flex justify-end items-center gap-4">
                {isProcessing && <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse text-text-secondary">{t('processing')}</span>}
                {canVoid && <button onClick={() => handleVoid(selectedPayment)} disabled={isProcessing} className={secondaryButton}>{t('void')}</button>}
                {canRefund && <button onClick={openRefundModal} disabled={isProcessing} className={primaryButton}>{t('refund')}</button>}
                {canCapture && <button onClick={() => handleCaptureStart(selectedPayment)} disabled={isProcessing} className={primaryButton}>{t('capture')} {formatCurrency(selectedPayment.amountCapturable, selectedPayment.currency)}</button>}
            </div>
        );
    };

    return (
        <div className="animate-fadeIn max-w-7xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-8">{t('allPayments')}</h1>
            <Card padding="p-0" className="overflow-hidden">
                <PaymentsTable payments={payments} onViewDetails={openDetailModal} onUpdatePayment={handleUpdatePayment} />
            </Card>

            <Modal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                title={t('transactionDetails')}
                footer={renderDetailModalFooter()}
            >
                {renderDetailModalContent()}
            </Modal>

            <RefundModal
                isOpen={isRefundModalOpen}
                onClose={closeRefundModal}
                payment={selectedPayment}
                onRefundSubmit={handleRefundSubmit}
            />

            {selectedPayment && (
                <DoubleVerifyPaymentModal 
                    isOpen={isDoubleVerifyOpen}
                    onClose={() => setIsDoubleVerifyOpen(false)}
                    onConfirm={() => handleCapture(selectedPayment)}
                    transactionDetails={{
                        amount: selectedPayment.amount,
                        recipient: selectedPayment.customer.name,
                        riskLevel: selectedPayment.risk === 'High' ? 'high' : 'medium',
                        transactionId: selectedPayment.id
                    }}
                />
            )}
        </div>
    );
};

export default PaymentsPage;
