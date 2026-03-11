import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, Language } from '../contexts/LanguageContext';
import { ChevronDownIcon } from './icons';

const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'ph', label: 'Filipino', flag: '🇵🇭' },
    { code: 'kh', label: 'ភាសាខ្មែរ', flag: '🇰🇭' },
    { code: 'mm', label: 'မြန်မာဘာသာ', flag: '🇲🇲' },
    { code: 'la', label: 'ພາສາລາວ', flag: '🇱🇦' },
];

const LanguageSwitcher: React.FC = () => {
    const { currentLang, setLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeLanguage = languages.find(l => l.code === currentLang) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 border border-border-color/20"
                aria-label="Select Language"
            >
                <span className="text-xl leading-none">{activeLanguage.flag}</span>
                <span className="hidden sm:inline text-xs font-bold text-text-primary uppercase tracking-wider">{activeLanguage.code}</span>
                <ChevronDownIcon className={`w-3 h-3 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card-bg border border-border-color shadow-2xl rounded-xl overflow-hidden z-50 animate-fadeIn">
                    <div className="py-2 max-h-[300px] overflow-y-auto">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-primary/5 ${
                                    currentLang === lang.code ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary'
                                }`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <span className="flex-1 text-left">{lang.label}</span>
                                {currentLang === lang.code && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
