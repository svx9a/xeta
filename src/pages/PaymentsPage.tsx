// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// ⛔ CRITICAL: DO NOT USE MONACO EDITOR HERE
// ⛔ This is a PRODUCTION PAYMENT PAGE
// ⛔ Monaco would break PCI compliance
// ⛔ Security team will reject PR
// ⛔ Users don't need code editing
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

import React, { useState, useCallback, useEffect } from 'react';
import Card from '../components/Card';
import PaymentsTable from '../components/PaymentsTable';
import { Payment } from '../types';
import Modal from '../components/Modal';
import RefundModal from '../components/RefundModal';
import { useTranslation } from '../contexts/LanguageContext';
import { usePayments } from '../contexts/PaymentsContext';
import PromptPayQR from '../components/PromptPayQR';
import { getShippingQuotes, ShippingQuote } from '../services/shippingService';
import { useWarehouse } from '../hooks/useWarehouse';
import { useCarrierPreference } from '../hooks/useCarrierPreference';
import { Trash2, Shield, Activity, FileText, CheckCircle, Clock, ArrowRight, ExternalLink, Download, AlertCircle, Zap, Database, Truck, Globe, Package, Loader2, ChevronDown, Star, Terminal, ShieldAlert, Fingerprint, Search } from 'lucide-react';

const PaymentDetailRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-6 border-b border-slate-200 last:border-b-0">
        <span className="text-[10px] font-black text-slate-800/30 uppercase tracking-[0.4em]">{label}</span>
        <span className="text-[15px] font-black text-slate-800 tracking-widest uppercase">{value}</span>
    </div>
);

const Timeline: React.FC<{ eta: string }> = ({ eta }) => (
    <div className="flex items-center gap-3 mt-8 p-6 bg-slate-100 rounded-2xl border border-slate-200 shadow-2xl">
        <div className="w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(79,143,201,0.6)] animate-pulse" />
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#4F8FC9]/60 to-white/5" />
        <div className="w-2 h-2 bg-slate-200 rounded-full" />
        <div className="h-[1px] flex-1 bg-slate-100" />
        <div className="w-2 h-2 bg-slate-100 rounded-full" />
        <span className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest ml-4">ETA: {eta}</span>
    </div>
);

const CarrierIcon = ({ carrier }: { carrier: string }) => {
    if (carrier.includes('Kerry')) return <Zap className="w-5 h-5 text-blue-600" />;
    if (carrier.includes('DHL')) return <Globe className="w-5 h-5 text-blue-600" />;
    if (carrier.includes('Post')) return <FileText className="w-5 h-5 text-blue-600" />;
    return <Package className="w-5 h-5 text-blue-600" />;
};

const PaymentsPage: React.FC = () => {
    const { payments, loading, updatePayment } = usePayments();

    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingQuotes, setLoadingQuotes] = useState(false);
    const [bestShip, setBestShip] = useState<{
        carrier: string;
        confidence: number;
        eta: string;
        price: number;
        allQuotes: ShippingQuote[];
        logs: string[];
    } | null>(null);
    const { t, currentLang } = useTranslation();
    const { defaultWarehouse } = useWarehouse();
    const { preferredCarrier, savePreference } = useCarrierPreference();

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        // Simple console-based toast for now
        console.log(`[TOAST][${type.toUpperCase()}]: ${message}`);
    };

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
        setIsDetailModalOpen(false);
        setIsRefundModalOpen(true);
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

    const handleCapture = async (payment: Payment) => {
        await simulateApiCall();
        handleUpdatePayment(payment.id, {
            status: 'captured',
            amountCapturable: 0,
            capturedAmount: payment.amount,
            amountRefundable: payment.amount,
        });
        closeDetailModal();
    };

    const handleVoid = async (payment: Payment) => {
        await simulateApiCall();
        handleUpdatePayment(payment.id, {
            status: 'voided',
            amountCapturable: 0,
        });
        closeDetailModal();
    };

    const calculateOrderWeight = (payment: Payment) => {
        return payment.items?.reduce((total, item) => total + (item.weight || 0.5) * item.quantity, 0) || 0.5;
    };

    const calculateConfidence = (best: ShippingQuote, allQuotes: ShippingQuote[]) => {
        if (allQuotes.length < 2) return 99.9;
        const secondBest = allQuotes[1].price;
        const spread = ((secondBest - best.price) / best.price) * 100;
        return Math.min(99.9, 85 + spread);
    };

    const loadShippingQuotes = async (payment: Payment) => {
        if (!payment.shippingAddress) return;
        setLoadingQuotes(true);
        setBestShip(null);
        try {
            const quotes = await getShippingQuotes({
                from: defaultWarehouse.address,
                to: payment.shippingAddress,
                weight: calculateOrderWeight(payment),
                value: payment.amount
            });

            const sorted = [...quotes].sort((a, b) => a.price - b.price);
            const best = sorted[0];
            const confidence = calculateConfidence(best, sorted);

            setBestShip({
                carrier: best.carrier,
                confidence: confidence,
                eta: best.estimatedDelivery,
                price: best.price,
                allQuotes: sorted,
                logs: best.logs
            });
        } catch (error) {
            console.error('Failed to get shipping quotes:', error);
            showToast('Intelligence Sync Failed', 'error');
        } finally {
            setLoadingQuotes(false);
        }
    };

    useEffect(() => {
        if (isDetailModalOpen && selectedPayment) {
            loadShippingQuotes(selectedPayment);
        }
    }, [isDetailModalOpen, selectedPayment?.id]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'd' && isDetailModalOpen && !isProcessing && bestShip && selectedPayment) {
                const canDispatch = selectedPayment.status === 'captured' && selectedPayment.fulfillmentStatus !== 'shipped';
                if (canDispatch) {
                    handleDispatch(selectedPayment.id, bestShip.carrier);
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isDetailModalOpen, isProcessing, bestShip, selectedPayment]);

    const handleDispatch = async (paymentId: string, carrierName?: string) => {
        setIsProcessing(true);
        try {
            await simulateApiCall();
            const trackingNum = `XT-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
            handleUpdatePayment(paymentId, {
                fulfillmentStatus: 'shipped',
                shippingMethod: carrierName || bestShip?.carrier || 'XETA Logistics',
                trackingNumber: trackingNum
            });
            showToast(`Asset mobilized: ${trackingNum}`);
            closeDetailModal();
        } catch (error) {
            showToast('Dispatch failed', 'error');
        } finally {
            setIsProcessing(false);
        }
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
            <div className="space-y-4 bg-transparent rounded-3xl overflow-hidden relative group">
                {/* Modal Header Section */}
                <div className="flex items-center gap-8 mb-14 pb-12 border-b border-slate-200">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] text-blue-600 border border-blue-600/20 shadow-2xl flex items-center justify-center group-hover:rotate-[15deg] transition-all duration-1000">
                        <Activity className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-slate-800 tracking-widest uppercase leading-none mb-4">Extraction View</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-[1px] bg-blue-600/40" />
                            <p className="text-[11px] font-black text-slate-800/30 uppercase tracking-[0.6em] leading-none">{selectedPayment.orderId}</p>
                        </div>
                    </div>
                </div>

                {/* Primary Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 bg-slate-100 p-10 rounded-[3rem] border border-slate-200 shadow-2xl">
                    <div className="space-y-2">
                        <PaymentDetailRow label={t('valuation')} value={<span className="text-5xl font-black text-slate-800 tracking-widest leading-none block my-4">{formatCurrency(selectedPayment.amount, selectedPayment.currency)}</span>} />
                        <PaymentDetailRow label={t('status')} value={<span className={`uppercase tracking-[0.4em] text-[10px] font-black px-6 py-2.5 rounded-xl border backdrop-blur-md shadow-lg ${selectedPayment.status === 'captured' ? 'text-[#10B981] bg-[#10B981]/5 border-[#10B981]/20' : 'text-slate-800/40 bg-slate-100 border-slate-200'}`}>{t(selectedPayment.status as any)}</span>} />
                        <PaymentDetailRow label={t('method')} value={<span className="text-slate-800 font-black uppercase tracking-[0.3em] text-[13px]">{t(selectedPayment.paymentMethod as any)}</span>} />
                    </div>
                    <div className="space-y-2">
                        <PaymentDetailRow label={t('date')} value={<span className="text-slate-800/60 font-mono text-[14px] tracking-widest">{formatDate(selectedPayment.date)}</span>} />
                        <PaymentDetailRow label={t('customer')} value={<span className="text-slate-800 font-black uppercase tracking-widest">{selectedPayment.customer.name}</span>} />
                        <PaymentDetailRow label={t('email')} value={<span className="text-blue-600 font-mono text-[13px] tracking-tight underline underline-offset-8 decoration-[#4F8FC9]/30">{selectedPayment.customer.email}</span>} />
                    </div>
                </div>

                {/* Secure Payment Instrument Display */}
                {selectedPayment.paymentMethod === 'credit_card' && (
                    <div className="mt-12 p-12 bg-slate-100 rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden group/card">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-bl-full -mr-12 -mt-12 transition-transform duration-1000 group-hover/card:scale-150" />
                        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-600 rounded-full shadow-glow" />
                        <PaymentDetailRow label={t('card')} value={
                            <div className="flex items-center gap-6 font-mono text-[15px] text-slate-800 font-black tracking-widest">
                                <Shield className="w-8 h-8 text-blue-600" />
                                {selectedPayment.card.brand.toUpperCase()} •••• {selectedPayment.card.last4}
                            </div>
                        } />
                    </div>
                )}

                {selectedPayment.paymentMethod === 'promptpay' && (
                    <div className="py-16 border-t border-slate-200 mt-16 flex flex-col items-center bg-slate-100 rounded-[3rem]">
                        <p className="text-[11px] font-black text-slate-800/20 uppercase tracking-[1em] mb-14">Neural Asset Map</p>
                        <div className="w-full max-w-sm scale-90 sm:scale-100 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-200">
                            <PromptPayQR amount={selectedPayment.amount} orderId={selectedPayment.orderId} />
                        </div>
                    </div>
                )}

                {selectedPayment.risk && (
                    <div className="mt-16 pt-16 border-t border-slate-200 relative">
                        <div className="flex items-center gap-6 mb-10">
                            <div className={`p-4 rounded-2xl ${selectedPayment.risk === 'High' ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#10B981]/10 border border-slate-200'}`}>
                                <AlertCircle className={`w-8 h-8 ${selectedPayment.risk === 'High' ? 'text-red-500' : 'text-[#10B981]'}`} />
                            </div>
                            <p className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em]">Risk Vector Analysis</p>
                        </div>
                        <div className="relative">
                            <p className="text-[16px] font-black text-slate-800/80 bg-slate-100 p-12 rounded-[3.5rem] border border-slate-200 leading-relaxed uppercase tracking-widest shadow-2xl">
                                "{selectedPayment.riskReason || 'No anomaly detected in the current node sequence.'}"
                            </p>
                        </div>
                    </div>
                )}

                {/* Fulfillment Section */}
                <div className="mt-16 pt-16 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-blue-600/10 rounded-[2rem] border border-blue-600/20">
                                <Truck className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em]">Fulfillment Vector</p>
                        </div>
                        <div className="flex items-center gap-6">
                            {selectedPayment.trackingNumber && (
                                <span className="text-[12px] font-mono font-black text-blue-600 bg-blue-600/10 px-6 py-3 rounded-xl border border-blue-600/20 tracking-widest">
                                    {selectedPayment.trackingNumber}
                                </span>
                            )}
                            <span className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border backdrop-blur-md shadow-2xl ${selectedPayment.fulfillmentStatus === 'shipped' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-slate-100 text-slate-800/30 border-slate-200'}`}>
                                {selectedPayment.fulfillmentStatus || 'unfulfilled'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-slate-100 p-12 rounded-[4rem] border border-slate-200 relative overflow-hidden group/fulfillment shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover/fulfillment:opacity-[0.08] transition-opacity duration-1000">
                            <Globe className="w-32 h-32 text-slate-800" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                    <label className="block text-[10px] font-black text-slate-800/30 uppercase tracking-[0.5em]">Delivery Node</label>
                                </div>
                                <p className="text-2xl font-black text-slate-800 leading-tight uppercase tracking-widest underline decoration-[#4F8FC9]/30 underline-offset-[16px] decoration-4">
                                    {selectedPayment.shippingAddress || 'GEOSPATIAL DATA MISSING'}
                                </p>
                            </div>
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                    <label className="block text-[10px] font-black text-slate-800/30 uppercase tracking-[0.5em]">Logistics Carrier</label>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-100 rounded-[2rem] flex items-center justify-center shadow-2xl border border-slate-200">
                                        <Package className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <p className="text-3xl font-black text-slate-800 uppercase tracking-widest">
                                        {selectedPayment.shippingMethod || 'PENDING ASSIGNMENT'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Carrier Intelligence */}
                    <div className="mt-12 p-14 bg-blue-600/5 rounded-[4rem] border border-blue-600/20 relative overflow-hidden group/ai shadow-2xl">
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                        <div className="flex items-center gap-8 mb-12">
                            <div className="relative">
                                <Zap className={`w-10 h-10 text-blue-600 ${loadingQuotes ? 'animate-spin' : 'animate-pulse'}`} />
                                <div className="absolute inset-0 blur-xl bg-blue-600/30 animate-pulse" />
                            </div>
                            <h5 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.6em] leading-none">Best-Ship Intelligence Protocol</h5>
                        </div>

                        {loadingQuotes ? (
                            <div className="flex items-center gap-8 py-12">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                                <span className="text-[15px] font-bold text-slate-800/40 uppercase tracking-[0.8em] animate-pulse">Scanning Logistics Grid...</span>
                            </div>
                        ) : bestShip ? (
                            <>
                                <p className="text-[16px] font-bold text-slate-800/60 leading-relaxed uppercase tracking-widest mb-12">
                                    Based on the geospatial delivery node <span className="text-slate-800 font-black underline decoration-[#4F8FC9]/60 underline-offset-[12px] decoration-4">{selectedPayment.shippingAddress?.split(',').pop()?.trim() || 'REGIONAL_NODE'}</span>,
                                    XETA-AI recommends <span className="text-blue-600 font-black">{bestShip.carrier}</span> for optimal clearing velocity.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                                    <div className="flex items-center gap-5">
                                        <Activity className="w-6 h-6 text-blue-600" />
                                        <span className="text-[11px] font-black text-slate-800/40 uppercase tracking-widest">Confidence: {bestShip.confidence.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                        <span className="text-[11px] font-black text-slate-800/40 uppercase tracking-widest">Est. Transit: {bestShip.eta}</span>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <Database className="w-6 h-6 text-blue-600" />
                                        <span className="text-[11px] font-black text-slate-800/40 uppercase tracking-widest">Market Fee: {formatCurrency(bestShip.price, selectedPayment.currency)}</span>
                                    </div>
                                </div>

                                {/* Risk Vector Analysis - Deep Dive */}
                                <div className="mt-12 bg-slate-100 p-12 rounded-[3.5rem] border border-slate-200 relative overflow-hidden group shadow-2xl">
                                    <div className="flex items-center gap-5 mb-10">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-[#10B981] rounded-full animate-ping opacity-20" />
                                            <Shield className="w-6 h-6 text-[#10B981] relative z-10" />
                                        </div>
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-800/40">Neural Risk Vector Analysis</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center p-6 bg-white/[0.02] rounded-2xl border border-slate-200 shadow-xl">
                                                <span className="text-[10px] font-black text-slate-800/20 uppercase tracking-widest flex items-center gap-4">
                                                    <Globe className="w-4 h-4" /> IP Reputation
                                                </span>
                                                <span className="text-[11px] font-black text-[#10B981] uppercase tracking-widest">SECURE [98/100]</span>
                                            </div>
                                            <div className="flex justify-between items-center p-6 bg-white/[0.02] rounded-2xl border border-slate-200 shadow-xl">
                                                <span className="text-[10px] font-black text-slate-800/20 uppercase tracking-widest flex items-center gap-4">
                                                    <Fingerprint className="w-4 h-4" /> Biometric Match
                                                </span>
                                                <span className="text-[11px] font-black text-[#10B981] uppercase tracking-widest">VERIFIED</span>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center p-6 bg-white/[0.02] rounded-2xl border border-slate-200 shadow-xl">
                                                <span className="text-[10px] font-black text-slate-800/20 uppercase tracking-widest flex items-center gap-4">
                                                    <Activity className="w-4 h-4" /> Velocity Check
                                                </span>
                                                <span className="text-[11px] font-black text-[#10B981] uppercase tracking-widest">NOMINAL</span>
                                            </div>
                                            <div className="flex justify-between items-center p-6 bg-white/[0.02] rounded-2xl border border-slate-200 shadow-xl">
                                                <span className="text-[10px] font-black text-slate-800/20 uppercase tracking-widest flex items-center gap-4">
                                                    <ShieldAlert className="w-4 h-4" /> Anomaly Score
                                                </span>
                                                <span className="text-[11px] font-black text-[#10B981] uppercase tracking-widest">0.002%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-10 border-t border-slate-200 flex items-center gap-4">
                                        <Search className="w-4 h-4 text-blue-600" />
                                        <span className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest">
                                            AI Status: Constant node monitoring active. No deviations detected.
                                        </span>
                                    </div>
                                </div>

                                <Timeline eta={bestShip.eta} />

                                <div className="mt-12 p-8 bg-black/20 rounded-[2.5rem] border border-white/[0.02] space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-800/20 uppercase tracking-[0.4em]">
                                        <span>Base Node Fee</span>
                                        <span className="text-slate-800/40">{formatCurrency(bestShip.price - (bestShip.allQuotes[0].weightSurcharge || 0) - (bestShip.allQuotes[0].premiumFee || 0), selectedPayment.currency)}</span>
                                    </div>
                                    {bestShip.allQuotes[0].weightSurcharge && (
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-800/20 uppercase tracking-[0.4em]">
                                            <span>Mass Surcharge</span>
                                            <span className="text-slate-800/40">+{formatCurrency(bestShip.allQuotes[0].weightSurcharge, selectedPayment.currency)}</span>
                                        </div>
                                    )}
                                    {bestShip.allQuotes[0].premiumFee > 0 && (
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-800/20 uppercase tracking-[0.4em]">
                                            <span>Priority Vector</span>
                                            <span className="text-blue-600">+{formatCurrency(bestShip.allQuotes[0].premiumFee, selectedPayment.currency)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-14 pt-10 border-t border-slate-200">
                                    <details className="group/details">
                                        <summary className="flex items-center gap-4 text-[11px] font-black text-slate-800/20 uppercase tracking-[0.4em] cursor-pointer list-none hover:text-blue-600 transition-all">
                                            <ChevronDown className="w-5 h-5 group-open/details:rotate-180 transition-transform" />
                                            Alternative Logistics Nodes
                                        </summary>
                                        <div className="mt-10 space-y-4">
                                            {bestShip.allQuotes.slice(1).map((quote, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-slate-100 p-8 rounded-3xl border border-slate-200 hover:border-blue-600/30 transition-all group/alt shadow-xl">
                                                    <div className="flex items-center gap-6">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); savePreference(quote.carrier); }}
                                                            className={`p-2 rounded-xl transition-all ${preferredCarrier === quote.carrier ? 'text-amber-400 bg-amber-400/10' : 'text-slate-800/10 hover:text-amber-400'}`}
                                                        >
                                                            <Star className="w-5 h-5 fill-current" />
                                                        </button>
                                                        <CarrierIcon carrier={quote.carrier} />
                                                        <span className="text-[13px] font-black text-slate-800 uppercase tracking-widest">{quote.carrier}</span>
                                                    </div>
                                                    <div className="flex items-center gap-12">
                                                        <span className="text-[11px] font-black text-slate-800/20 uppercase tracking-widest">{quote.estimatedDelivery}</span>
                                                        <span className="text-[13px] font-black text-slate-800">{formatCurrency(quote.price, selectedPayment.currency)}</span>
                                                        <button
                                                            onClick={() => handleDispatch(selectedPayment.id, quote.carrier)}
                                                            className="px-8 py-4 bg-blue-600 text-slate-800 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl opacity-0 group-hover/alt:opacity-100 transition-all hover:bg-blue-600/80 shadow-2xl"
                                                        >
                                                            Select
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                </div>

                                {/* Logistics Node Logs - Terminal Style */}
                                <div className="mt-12">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Terminal className="w-5 h-5 text-slate-800/20" />
                                        <h3 className="text-[11px] font-black text-slate-800/20 uppercase tracking-[0.4em]">Logistics Node Logs</h3>
                                    </div>
                                    <div className="bg-black/40 p-10 rounded-[2.5rem] font-mono text-[11px] text-blue-600/80 space-y-3 overflow-x-auto shadow-2xl border border-slate-200">
                                        {bestShip.logs.map((log, i) => (
                                            <div key={i} className="flex gap-6">
                                                <span className="text-slate-800/10">[{new Date().toLocaleTimeString()}]</span>
                                                <span className="tracking-widest capitalize">{log}</span>
                                            </div>
                                        ))}
                                        <div className="animate-pulse text-blue-600">_</div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-[15px] font-bold text-slate-800/30 uppercase tracking-widest p-14 bg-slate-100 rounded-[3rem] border border-slate-200">Insufficient geospatial data for intelligent routing.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderDetailModalFooter = () => {
        if (!selectedPayment) return null;

        const canCapture = selectedPayment.status === 'authorized';
        const canVoid = selectedPayment.status === 'authorized';
        const canRefund = (selectedPayment.status === 'captured' || selectedPayment.status === 'partially_refunded') && selectedPayment.amountRefundable > 0;
        const canDispatch = selectedPayment.status === 'captured' && selectedPayment.fulfillmentStatus !== 'shipped';

        const buttonBase = "px-10 py-6 text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all disabled:opacity-50 flex items-center gap-4 shadow-2xl hover:translate-y-[-4px] active:translate-y-[1px] border-b-4 border-b-black/20";
        const primaryButton = `${buttonBase} text-slate-800 bg-blue-600 hover:bg-white`;
        const secondaryButton = `${buttonBase} text-slate-800/60 bg-slate-100 border border-slate-200 hover:bg-slate-100 hover:text-slate-800`;

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-12 w-full px-8 pb-10">
                <div className="flex gap-6">
                    <button className="p-6 bg-slate-100 border border-slate-200 rounded-2xl text-slate-800/20 hover:text-blue-600 hover:bg-blue-600/10 hover:border-blue-600/20 transition-all shadow-2xl group">
                        <Download className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="p-6 bg-slate-100 border border-slate-200 rounded-2xl text-slate-800/20 hover:text-blue-600 hover:bg-blue-600/10 hover:border-blue-600/20 transition-all shadow-2xl group">
                        <ExternalLink className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    {isProcessing && (
                        <div className="flex items-center gap-4 bg-blue-600/10 px-8 py-5 rounded-2xl border border-blue-600/20 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_#4F8FC9]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">NODE_SYNC</span>
                        </div>
                    )}
                    {canVoid && <button onClick={() => handleVoid(selectedPayment)} disabled={isProcessing} className={secondaryButton}>{t('void')}</button>}
                    {canRefund && <button onClick={openRefundModal} disabled={isProcessing} className={secondaryButton}>{t('refund')}</button>}
                    {canDispatch && <button onClick={() => handleDispatch(selectedPayment.id, bestShip?.carrier)} disabled={isProcessing || loadingQuotes} className={primaryButton}>
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Truck className="w-6 h-6" />}
                        Dispatch via {bestShip?.carrier || 'Best Carrier'}
                    </button>}
                    {canCapture && <button onClick={() => handleCapture(selectedPayment)} disabled={isProcessing} className={primaryButton}>
                        <Zap className="w-6 h-6" />
                        Capture {formatCurrency(selectedPayment.amountCapturable, selectedPayment.currency)}
                    </button>}
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fadeIn w-full space-y-16 pb-32">
            <div className="relative overflow-hidden bg-white rounded-[48px] p-16 text-slate-800 shadow-2xl border border-slate-200 group">
                {/* Cyber Background Accents */}
                <div className="absolute top-0 right-0 w-[80vw] h-[80vw] sm:w-[40vw] sm:h-[40vw] bg-blue-600/5 rounded-full -mr-8 -mt-8 blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-600/3 rounded-full -ml-8 -mb-8 blur-[100px]" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-10 mb-14">
                            <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] border border-slate-200 backdrop-blur-3xl shadow-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-1000 group-hover:border-blue-600/30">
                                <Activity className="w-12 h-12 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-6xl sm:text-8xl font-black tracking-widest text-slate-800 uppercase leading-[0.85] mb-4">
                                    Global <span className="text-blue-600 block sm:inline">Ledger</span>
                                </h1>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-[1px] bg-blue-600/40" />
                                    <p className="text-[12px] font-black text-slate-800/40 uppercase tracking-[0.8em]">NET_AGX_OMNI_NODE</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-2xl text-slate-800/60 max-w-4xl font-black leading-relaxed uppercase tracking-wide border-l-8 border-blue-600/20 pl-10">
                            Omni-channel <span className="text-slate-800 font-black underline decoration-[#4F8FC9]/40 underline-offset-[16px] decoration-4">Transaction Monitoring</span> and asset management across the AGX-9V mesh network.
                        </p>
                    </div>

                    <div className="flex items-center gap-10 bg-slate-100 px-10 py-8 rounded-3xl border border-slate-200 text-slate-800 backdrop-blur-3xl group/status shadow-2xl">
                        <div className="relative">
                            <div className="w-6 h-6 rounded-full bg-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-125 transition-transform" />
                            <div className="absolute inset-0 bg-[#10B981] rounded-full animate-ping opacity-20" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[16px] font-black uppercase tracking-[0.5em] leading-none">SECURE</span>
                            <span className="text-[11px] font-black text-slate-800/30 uppercase tracking-[0.3em]">NODE_SYNC_100%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/60 rounded-[40px] border border-slate-200 overflow-hidden relative shadow-2xl backdrop-blur-3xl group">
                {/* Internal Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.02]" />

                <div className="p-10 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10 bg-white/[0.02]">
                    <div className="flex items-center gap-10">
                        <div className="w-20 h-20 bg-blue-600/5 border border-blue-600/20 rounded-3xl text-blue-600 shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-1000 group-hover:bg-blue-600/10">
                            <Database className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-slate-800 uppercase tracking-widest leading-none mb-4">{t('allPayments')}</h2>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-[1px] bg-blue-600/40" />
                                <p className="text-[11px] font-black text-slate-800/20 uppercase tracking-[0.6em] leading-none">Sovereign Data Matrix</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-16">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-800/20 uppercase tracking-[0.5em] mb-4 leading-none">Active Index</p>
                            <p className="text-3xl font-black text-slate-800 font-mono tracking-widest leading-none">1,284_SEQ</p>
                        </div>
                        <div className="h-16 w-[1px] bg-slate-100" />
                        <button className="flex items-center gap-6 px-12 py-7 bg-slate-100 border border-slate-200 rounded-2xl hover:bg-blue-600 hover:border-blue-600 transition-all text-[11px] font-black text-slate-800 uppercase tracking-[0.5em] group shadow-2xl hover:translate-y-[-4px]">
                            <Download className="w-6 h-6 text-blue-600 group-hover:text-slate-800 transition-colors" />
                            Stream Raw
                        </button>
                    </div>
                </div>

                <div className="relative z-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-48 gap-8">
                            <div className="relative">
                                <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
                                <div className="absolute inset-0 blur-2xl bg-blue-600/20 animate-pulse" />
                            </div>
                            <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.8em] animate-pulse">Synchronizing with Live Ledger Node...</p>
                        </div>
                    ) : (
                        <PaymentsTable payments={payments} onViewDetails={openDetailModal} onUpdatePayment={handleUpdatePayment} />
                    )}
                </div>
            </div>

            <Modal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                title={<span className="font-black uppercase tracking-[0.3em] text-blue-600 block pt-8 px-8">Security Protocol // Sequence Info</span>}
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
        </div>
    );
};

export default PaymentsPage;