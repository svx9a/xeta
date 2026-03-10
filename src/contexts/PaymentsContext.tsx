import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Payment } from '../types';
import { MOCK_PAYMENTS, API_BASE_URL } from '../constants';

interface PaymentsContextType {
    payments: Payment[];
    loading: boolean;
    updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
    refreshPayments: () => void;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export const PaymentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
    const [loading, setLoading] = useState(false);

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/ticket-orders`);
            if (!response.ok) throw new Error('API Sync failed');
            const data = await response.json() as any[];

            // Map DB ticket_orders to Frontend Payment type
            const mappedPayments: Payment[] = data.map((order: any) => ({
                id: order.id,
                date: order.created_at,
                orderId: order.id,
                amount: order.price_thb,
                currency: 'THB',
                paymentMethod: 'promptpay', // Default based on seed
                status: order.status.toLowerCase() === 'pending' ? 'authorized' : 'captured',
                customer: {
                    name: 'XETA User', // Placeholder as not in seed
                    email: 'user@xeta.digital'
                },
                card: { last4: '****', brand: order.channel || 'PromptPay' },
                amountCapturable: order.status === 'PENDING' ? order.price_thb : 0,
                capturedAmount: order.status !== 'PENDING' ? order.price_thb : 0,
                amountRefundable: order.status !== 'PENDING' ? order.price_thb : 0,
                refundedAmount: 0,
                fulfillmentStatus: 'unfulfilled',
                items: [{ id: `it_${order.id}`, name: `Seat: ${order.seat_zone}`, quantity: order.qty, price: order.price_thb / order.qty }]
            }));

            // Merge with mock payments for "High Density" look if DB is sparsely populated
            setPayments(prev => [...mappedPayments, ...MOCK_PAYMENTS.filter(m => !mappedPayments.find(p => p.id === m.id))]);
        } catch (error) {
            console.error('Data Awakening Error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const updatePayment = useCallback((paymentId: string, updates: Partial<Payment>) => {
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, ...updates } : p));
    }, []);

    return (
        <PaymentsContext.Provider value={{ payments, loading, updatePayment, refreshPayments: fetchPayments }}>
            {children}
        </PaymentsContext.Provider>
    );
};


export const usePayments = () => {
    const context = useContext(PaymentsContext);
    if (context === undefined) {
        throw new Error('usePayments must be used within a PaymentsProvider');
    }
    return context;
};
