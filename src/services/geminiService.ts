
import { GoogleGenAI, Type } from "@google/genai";
import { Payment } from "../types";

// The API key is sourced from `process.env.API_KEY` and is assumed to be available
// in the execution environment as per the project's setup.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.warn("API_KEY environment variable not set. Gemini API calls will be disabled.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        risk: {
            type: Type.STRING,
            enum: ["Low", "Medium", "High"],
            description: "The assessed risk level for the transaction."
        },
        reason: {
            type: Type.STRING,
            description: "A brief explanation for the assessed risk level."
        }
    },
    required: ["risk", "reason"]
};


export const getPaymentRisk = async (payment: Payment, fallbackMessage: string): Promise<{ risk: 'Low' | 'Medium' | 'High'; reason: string } | null> => {
    if (!ai) {
        console.error("Gemini AI client is not initialized.");
        // Fallback for when API key is not available
        return new Promise(resolve => setTimeout(() => resolve({ risk: 'Low', reason: fallbackMessage }), 1000));
    }

    const prompt = `
        Analyze the following payment transaction for fraud risk and provide a risk assessment.
        Consider factors like amount, currency, and customer details. High-value transactions could be riskier.
        
        Transaction Details:
        - Amount: ${payment.amount} ${payment.currency}
        - Customer Name: ${payment.customer.name}
        - Customer Email: ${payment.customer.email}
        - Card Brand: ${payment.card.brand}
        - Card Last 4 Digits: ${payment.card.last4}
        - Transaction Date: ${payment.date}

        Based on these details, assess the risk as "Low", "Medium", or "High" and provide a brief justification.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonString = response.text;
        const result = JSON.parse(jsonString);
        
        return result as { risk: 'Low' | 'Medium' | 'High'; reason: string };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get risk assessment from Gemini API.");
    }
};
