/**
 * AI Service - Integration with dragon-dance-transformers Cloudflare Worker
 * Provides AI-powered features: chat, transaction analysis, form assistance, payment routing insights
 */

const AI_WORKER_URL = 'https://dragon-dance-transformers.sv9.workers.dev';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: 'fast' | 'balanced' | 'quality' | 'code';
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class AIService {
  private workerUrl: string;
  private isAvailable: boolean = false;

  constructor() {
    this.workerUrl = AI_WORKER_URL;
    this.checkHealth();
  }

  /**
   * Check if AI worker is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.workerUrl}/health`);
      this.isAvailable = response.ok;
      return this.isAvailable;
    } catch (error) {
      console.error('[AI Service] Health check failed:', error);
      this.isAvailable = false;
      return false;
    }
  }

  /**
   * Chat completion using OpenAI-compatible endpoint
   */
  async chat(messages: ChatMessage[], model: 'fast' | 'balanced' | 'quality' | 'code' = 'balanced'): Promise<string> {
    if (!this.isAvailable) {
      console.warn('[AI Service] Worker not available, using fallback');
      return this.getFallbackResponse(messages);
    }

    try {
      const request: ChatCompletionRequest = {
        messages,
        model,
        temperature: 0.7,
        max_tokens: 500,
      };

      const response = await fetch(`${this.workerUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '', // Worker handles auth
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.statusText}`);
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0]?.message.content || '';
    } catch (error) {
      console.error('[AI Service] Chat failed:', error);
      return this.getFallbackResponse(messages);
    }
  }

  /**
   * Generate smart descriptions for transactions
   * Model: 'fast' for quick descriptions
   */
  async generateTransactionDescription(
    paymentMethod: string,
    amount: number,
    merchant: string,
    status: string
  ): Promise<string> {
    const prompt = `Provide a brief (one sentence), professional insight about this payment transaction:
    Method: ${paymentMethod}
    Amount: ฿${amount}
    Merchant: ${merchant}
    Status: ${status}

    Keep it concise and data-focused.`;

    const messages: ChatMessage[] = [
      { role: 'user', content: prompt }
    ];

    return this.chat(messages, 'fast');
  }

  /**
   * Analyze payment patterns and provide insights
   * Model: 'balanced' for nuanced analysis
   */
  async analyzePaymentPattern(totalAmount: number, transactionCount: number, period: string): Promise<string> {
    const prompt = `Analyze this payment pattern and provide a brief insight (1-2 sentences):
    Total: ฿${totalAmount}
    Transactions: ${transactionCount}
    Period: ${period}

    Focus on trends or anomalies.`;

    const messages: ChatMessage[] = [
      { role: 'user', content: prompt }
    ];

    return this.chat(messages, 'balanced');
  }

  /**
   * Suggest form field values or corrections
   * Model: 'quality' for careful recommendations
   */
  async suggestFormValue(fieldLabel: string, currentValue: string, context: string = ''): Promise<string> {
    const prompt = `Suggest a corrected or improved value for this form field:
    Field: ${fieldLabel}
    Current Value: ${currentValue || '(empty)'}
    ${context ? `Context: ${context}` : ''}

    Respond with ONLY the suggested value, nothing else.`;

    const messages: ChatMessage[] = [
      { role: 'user', content: prompt }
    ];

    return this.chat(messages, 'quality');
  }

  /**
   * Generate intelligent routing recommendations
   * Model: 'balanced' for good performance/quality tradeoff
   */
  async getRoutingRecommendation(
    routes: Array<{ provider: string; fee: number; successRate: number }>
  ): Promise<string> {
    const routeInfo = routes.map(r => `${r.provider} (Fee: ${r.fee}%, Success: ${r.successRate}%)`).join(', ');
    const prompt = `Based on these payment routes: ${routeInfo}
    Give a brief recommendation (1 sentence) on which route to choose for optimal transaction success.`;

    const messages: ChatMessage[] = [
      { role: 'user', content: prompt }
    ];

    return this.chat(messages, 'balanced');
  }

  /**
   * Multi-turn conversation (for chat widget)
   */
  async conversation(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    const messages: ChatMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    return this.chat(messages, 'balanced');
  }

  /**
   * Fallback response when AI service is unavailable
   */
  private getFallbackResponse(messages: ChatMessage[]): string {
    const lastMessage = messages[messages.length - 1];

    // Simple heuristic-based fallbacks
    if (lastMessage.content.toLowerCase().includes('recommend')) {
      return 'I recommend selecting the route with the highest success rate for optimal transaction completion.';
    }
    if (lastMessage.content.toLowerCase().includes('pattern')) {
      return 'Your payment patterns appear normal for this period.';
    }
    if (lastMessage.content.toLowerCase().includes('suggest')) {
      return 'Please check the format of this field according to our guidelines.';
    }

    return 'I am unable to generate an AI response at this time. Please try again later.';
  }

  /**
   * Get AI service status
   */
  getStatus(): { available: boolean; url: string } {
    return {
      available: this.isAvailable,
      url: this.workerUrl,
    };
  }
}

// Export singleton instance
export const aiService = new AIService();
export type { ChatMessage, ChatCompletionRequest, ChatCompletionResponse };
