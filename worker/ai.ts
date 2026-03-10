/**
 * XETA NEURAL AI SERVICE (DeepSeek Powered)
 * Handles fraud assessment, sentiment analysis, and conversational agent logic.
 */

export interface AIResult {
    fraudRisk: number;
    sentiment: number;
    language: string;
    confidence: number;
}

export interface RiskAssessment {
    risk: 'Low' | 'Medium' | 'High';
    reason: string;
}

export class NeuralAI {
    private static API_URL = "https://api.deepseek.com/v1/chat/completions";

    private static async callDeepSeek(apiKey: string, messages: any[], jsonMode: boolean = false) {
        if (!apiKey) {
            throw new Error("Neural AI Error: Missing DeepSeek API Key. Bridge collapsed.");
        }

        const response = await fetch(this.API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages,
                response_format: jsonMode ? { type: 'json_object' } : undefined,
                temperature: 0.7,
                max_tokens: jsonMode ? 500 : 1000
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`DeepSeek API Failure: ${response.status} - ${error}`);
        }

        const data: any = await response.json();
        return data;
    }

    static async analyzeTransaction(apiKey: string, text: string, lang: string = "th"): Promise<AIResult> {
        const prompt = `
            Analyze this transaction description for sentiment and fraud risk. 
            Text: "${text}" 
            Language: ${lang}
            Respond ONLY with a valid JSON object matching this schema:
            { "fraudRisk": number (0-1), "sentiment": number (-1 to 1), "language": string, "confidence": number (0-1) }
        `;

        const data: any = await this.callDeepSeek(apiKey, [
            { role: 'system', content: 'You are a financial analysis bot. You output strict JSON only.' },
            { role: 'user', content: prompt }
        ], true);

        return JSON.parse(data.choices[0].message.content);
    }

    static async assessRisk(apiKey: string, payment: any): Promise<RiskAssessment> {
        const prompt = `
            You are Xeta Next's automated fraud detection AI.
            Analyze this transaction: Amount is ${payment.amount} ${payment.currency}. Gateway is ${payment.method}. Processing latency was ${payment.processingTime}.
            Respond ONLY with a valid JSON object matching this schema exactly:
            { "risk": "Low" | "Medium" | "High", "reason": "Short explanation" }
        `;

        const data: any = await this.callDeepSeek(apiKey, [
            { role: 'system', content: 'You are a sovereign fraud detection engine. Output strict JSON only.' },
            { role: 'user', content: prompt }
        ], true);

        return JSON.parse(data.choices[0].message.content);
    }

    static async chat(apiKey: string, input: string, options: { language?: string, focus?: string } = {}) {
        let systemPrompt = `
            You are the Xeta Next Blockchain Agent, a highly advanced conversational AI.
            Your goal is to help users bridge Fiat to Bitcoin.
            Keep responses short, confident, and slightly cyberpunk in tone.
            Name: AGX9-Neural-Agent.
        `;

        if (options.focus === 'payment') {
            systemPrompt += "\nFocus on payment topics (PromptPay, Bitcoin, Sats).";
        }

        if (options.language?.toLowerCase() === 'th') {
            systemPrompt += "\nRespond entirely in Thai (ภาษาไทย).";
        }

        const data: any = await this.callDeepSeek(apiKey, [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input }
        ]);

        const responseContent = data.choices[0].message.content.trim();

        return {
            response: responseContent,
            intent: input.toLowerCase().includes('baht') || input.toLowerCase().includes('sats') ? 'TRIGGER_BRIDGE' : 'CHAT'
        };
    }
}
