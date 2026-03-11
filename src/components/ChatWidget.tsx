import React, { useEffect, useMemo, useRef, useState } from 'react';
import { API_BASE_URL } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';
import { XIcon, ZapIcon } from './icons';

type ChatRole = 'assistant' | 'user';
type ChatFocus = 'all' | 'payment' | 'tech';

interface ChatMessage {
  role: ChatRole;
  text: string;
}

const copy = {
  th: {
    title: 'XETA Assistant',
    online: 'พร้อมช่วยเหลือ',
    typing: 'กำลังพิมพ์...',
    placeholder: 'สอบถามเรื่องระบบ การชำระเงิน หรือการใช้งาน...',
    welcome: 'สวัสดีครับ ผมคือ XETA Assistant พร้อมช่วยตอบคำถามเกี่ยวกับการชำระเงิน รายงาน ระบบ และการใช้งานทั่วไป',
    error: 'ขออภัย ขณะนี้ไม่สามารถเชื่อมต่อผู้ช่วยได้ กรุณาลองใหม่อีกครั้ง',
    all: 'ทั้งหมด',
    payment: 'การชำระเงิน',
    tech: 'ระบบ',
  },
  en: {
    title: 'XETA Assistant',
    online: 'Ready to help',
    typing: 'Typing...',
    placeholder: 'Ask about payments, reports, or platform usage...',
    welcome: 'Hello, I am XETA Assistant. I can help with payments, reports, platform usage, and general questions.',
    error: 'Sorry, I cannot connect to the assistant right now. Please try again.',
    all: 'All',
    payment: 'Payments',
    tech: 'System',
  },
} as const;

const focusButtonStyles =
  'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all';

const ChatWidget: React.FC = () => {
  const { currentLang } = useTranslation();
  const lang = currentLang === 'th' ? 'th' : 'en';
  const text = copy[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [focus, setFocus] = useState<ChatFocus>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: text.welcome }]);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((previous) => {
      if (previous.length === 1 && previous[0]?.role === 'assistant') {
        return [{ role: 'assistant', text: text.welcome }];
      }
      return previous;
    });
  }, [text.welcome]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const statusText = useMemo(() => (isLoading ? text.typing : text.online), [isLoading, text.typing, text.online]);

  const sendMessage = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    setMessages((previous) => [...previous, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: lang,
          focus,
        }),
      });

      const data = (await response.json()) as { response?: string };
      setMessages((previous) => [
        ...previous,
        { role: 'assistant', text: data.response || text.error },
      ]);
    } catch {
      setMessages((previous) => [...previous, { role: 'assistant', text: text.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[360px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-7rem)] rounded-[28px] border border-border-color/70 bg-card-bg/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-color/60 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/logo-cube.png" alt="XETA Assistant" className="w-11 h-11 object-contain rounded-2xl" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-card-bg rounded-full" />
              </div>
              <div>
                <p className="text-sm font-black text-text-primary tracking-tight">{text.title}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{statusText}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/70 dark:hover:bg-white/5 transition-colors"
              aria-label="Close chat"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="px-5 py-3 border-b border-border-color/60 flex items-center gap-2">
            {(['all', 'payment', 'tech'] as ChatFocus[]).map((item) => (
              <button
                key={item}
                onClick={() => setFocus(item)}
                className={`${focusButtonStyles} ${
                  focus === item
                    ? 'bg-primary text-white border-primary shadow-satin'
                    : 'bg-transparent text-text-secondary border-border-color hover:border-primary/40 hover:text-primary'
                }`}
              >
                {text[item]}
              </button>
            ))}
          </div>

          <div ref={bodyRef} className="h-[420px] overflow-y-auto px-5 py-4 space-y-4 bg-gradient-to-b from-background/50 to-transparent">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white dark:bg-background border border-border-color/60 text-text-primary rounded-bl-md'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-background border border-border-color/60 text-text-primary rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:120ms]" />
                  <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t border-border-color/60 bg-white/60 dark:bg-background/40">
            <div className="flex items-center gap-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={text.placeholder}
                disabled={isLoading}
                className="flex-1 bg-white dark:bg-background border border-border-color/70 rounded-2xl px-4 py-3 text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 rounded-2xl satin-effect text-white flex items-center justify-center shadow-satin disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((previous) => !previous)}
        className="relative w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-105"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <img src="/logo-cube.png" alt="Open chat" className="w-16 h-16 object-contain drop-shadow-2xl" />
        {!isOpen && (
          <>
            <span className="absolute inset-2 rounded-full bg-primary/10 blur-xl" />
            <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center border-2 border-background">
              1
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-card-bg border border-border-color/60 text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm whitespace-nowrap">
              <ZapIcon className="w-3.5 h-3.5 inline-block mr-1" />
              {text.title}
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
