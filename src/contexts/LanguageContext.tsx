import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations, TranslationKeys } from '../translations';

export type Language = 'en' | 'th' | 'vi' | 'id' | 'ms' | 'ph' | 'kh' | 'mm' | 'la';

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
        const validLangs: Language[] = ['en', 'th', 'vi', 'id', 'ms', 'ph', 'kh', 'mm', 'la'];
        if (savedLang && validLangs.includes(savedLang)) {
            setCurrentLang(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setCurrentLang(lang);
        localStorage.setItem('language', lang);
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
