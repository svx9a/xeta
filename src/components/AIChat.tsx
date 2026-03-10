import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { aiService, ChatMessage } from '../services/aiService';

interface AIChatProps {
  context?: string; // e.g., 'payments', 'routing', 'settlement'
}

const AIChat: React.FC<AIChatProps> = ({ context = 'general' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your XETAPAY AI Assistant. I can help you with ${context} questions. What would you like to know?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.conversation(input, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/15 transition-all duration-300 glow-sm z-40 shadow-lg"
          aria-label="Open AI Chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] rounded-2xl bg-black/90 border border-white/12 flex flex-col shadow-2xl mercury-border-glow z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white/60 animate-pulse" />
              <span className="text-white font-black text-sm uppercase tracking-wide">AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'bg-white/5 text-white/90 border border-white/10'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 text-white/60 px-4 py-3 rounded-lg text-sm border border-white/10">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse delay-100" />
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-6 border-t border-white/10 flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/12 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-white/10 hover:bg-white/15 disabled:opacity-50 border border-white/12 text-white rounded-lg p-2.5 transition-all hover:glow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChat;
