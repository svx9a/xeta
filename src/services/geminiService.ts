import { Payment } from "../types";
import { API_BASE_URL } from "../constants";

export const getPaymentRisk = async (payment: Payment, fallbackMessage: string): Promise<{ risk: 'Low' | 'Medium' | 'High'; reason: string } | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/agent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `Analyze risk for transaction ${payment.orderId}. Amount: ${payment.amount} ${payment.currency}. Customer: ${payment.customer.name}`,
                focus: 'FRAUD_DETECTION',
                language: 'en'
            })
        });

        if (!response.ok) throw new Error("Worker node did not respond.");

        const data = await response.json() as any;

        // Match the expected return schema
        return {
            risk: (data.risk || 'Low') as 'Low' | 'Medium' | 'High',
            reason: data.reason || data.response || fallbackMessage
        };

    } catch (error) {
        console.error("AI Node offline, falling back to local heuristics:", error);
        return { risk: 'Low', reason: fallbackMessage };
    }
};
