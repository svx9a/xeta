import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Payment } from '../types';
import { MOCK_PAYMENTS } from '../constants';

interface PaymentsContextType {
    payments: Payment[];
    updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export const PaymentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);

    useEffect(() => {
        // Only attempt WebSocket connection when running against the local dev server.
        // On static deployments (Cloudflare Pages) there is no WS endpoint — skip silently.
        const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (!isLocalDev) return;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;
        let socket: WebSocket | null = null;

        try {
            socket = new WebSocket(wsUrl);

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'NEW_PAYMENT') {
                        setPayments(prev => [message.data, ...prev]);
                    }
                } catch (err) {
                    console.error('WebSocket message error:', err);
                }
            };

            socket.onopen = () => console.log('Connected to real-time payments');
            socket.onerror = () => console.log('WebSocket unavailable – using mock data');
            socket.onclose = () => console.log('Disconnected from real-time payments');
        } catch {
            console.log('WebSocket init skipped');
        }

        return () => { if (socket) socket.close(); };
    }, []);

    const updatePayment = useCallback((paymentId: string, updates: Partial<Payment>) => {
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, ...updates } : p));
    }, []);

    return (
        <PaymentsContext.Provider value={{ payments, updatePayment }}>
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
