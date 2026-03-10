import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations, TranslationKeys } from '../translations';

type Language = 'en' | 'th' | 'vi' | 'id' | 'ms' | 'fil' | 'km' | 'lo' | 'my';

interface LanguageContextType {
    currentLang: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKeys, options?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLang, setCurrentLang] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        const validLangs: Language[] = ['en', 'th', 'vi', 'id', 'ms', 'fil', 'km', 'lo', 'my'];
        if (savedLang && validLangs.includes(savedLang)) {
            setCurrentLang(savedLang);
        }
        applyFontForLang(savedLang && validLangs.includes(savedLang) ? savedLang : 'en');
    }, []);

    const applyFontForLang = (lang: Language) => {
        setCurrentLang(lang);
        localStorage.setItem('language', lang);
        const fontMap: Record<Language, { family: string; url?: string }> = {
            en: { family: `'Space Grotesk','system-ui',sans-serif`, url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap' },
            th: { family: `'IBM Plex Sans Thai','system-ui',sans-serif`, url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap' },
            vi: { family: `'Inter','Noto Sans','system-ui',sans-serif`, url: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap' },
            id: { family: `'Inter','system-ui',sans-serif` },
            ms: { family: `'Inter','system-ui',sans-serif` },
            fil: { family: `'Inter','system-ui',sans-serif` },
            km: { family: `'Inter','Noto Sans Khmer','system-ui',sans-serif`, url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;500;700&display=swap' },
            lo: { family: `'Inter','Noto Sans Lao','system-ui',sans-serif`, url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;500;700&display=swap' },
            my: { family: `'Inter','Noto Sans Myanmar','system-ui',sans-serif`, url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;500;700&display=swap' },
        };
        const cfg = fontMap[lang];
        document.documentElement.style.setProperty('--font-sans', cfg.family);
        if (cfg.url && !document.querySelector(`link[data-font="${lang}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cfg.url;
            link.setAttribute('data-font', lang);
            document.head.appendChild(link);
        }
    };
    const setLanguage = (lang: Language) => {
        applyFontForLang(lang);
    };

    const t = useCallback((key: TranslationKeys, options?: { [key: string]: string | number }): string => {
        let translation = translations[currentLang][key] || translations['en'][key] || key;
        if (options) {
            Object.keys(options).forEach(optionKey => {
                translation = translation.replace(`{{${optionKey}}}`, String(options[optionKey]));
            });
        }
        return translation;
    }, [currentLang]);

    return (
        <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
