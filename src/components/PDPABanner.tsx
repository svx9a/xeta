import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { ShieldCheckIcon, XIcon } from './icons';

const PDPABanner: React.FC = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('pdpa-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('pdpa-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50 animate-slideUp">
            <div className="bg-white border border-border-color rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                    <button onClick={() => setIsVisible(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ShieldCheckIcon className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="space-y-3">
                        <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-widest">{t('pdpaCompliance')}</h3>
                        <p className="text-xs font-medium text-text-secondary leading-relaxed">
                            {t('acceptTerms')}
                        </p>
                        
                        <div className="flex items-center gap-3 pt-2">
                            <button 
                                onClick={handleAccept}
                                className="px-5 py-2.5 bg-primary text-slate-800 text-[10px] font-bold uppercase tracking-widest rounded-lg satin-effect"
                            >
                                {t('acceptTerms').split(' ')[0]}
                            </button>
                            <a href="#" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                                {t('privacyPolicy')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDPABanner;
