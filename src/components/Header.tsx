import React, { useState, useEffect, useRef } from 'react';
import { Bars3Icon, MoonIcon, SunIcon, FlaskIcon, ZapIcon } from './icons';
import { useTranslation } from '../contexts/LanguageContext';
import { Page } from '../types';
import { TranslationKeys } from '../translations';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
    onMenuClick: () => void;
    theme: string;
    setTheme: (theme: string) => void;
    isProduction: boolean;
    setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, theme, setTheme, isProduction, setCurrentPage }) => {
    const { t } = useTranslation();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const modeConfig = isProduction 
        ? {
            textKey: 'productionMode',
            Icon: ZapIcon,
            color: 'text-rose-500'
        } 
        : {
            textKey: 'sandboxMode',
            Icon: FlaskIcon,
            color: 'text-emerald-500'
        };

    return (
        <header className="flex justify-between items-center p-4 sm:px-7 sm:py-5 border-b border-border-color bg-white lg:bg-background sticky top-0 z-30 backdrop-blur-md bg-opacity-90">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden text-text-primary p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <Bars3Icon className="w-6 h-6 icon-active-aura" />
                </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-8">
                <button onClick={toggleTheme} className="text-text-secondary hover:text-primary transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full group">
                    {theme === 'light' ? <MoonIcon className="w-5 h-5 icon-active-aura" /> : <SunIcon className="w-5 h-5 icon-active-aura" />}
                </button>

                <div className="flex items-center gap-8 sm:gap-14">
                    <LanguageSwitcher />
                    
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-background-light dark:bg-white/5 border border-border-color/30">
                        <modeConfig.Icon className={`w-4 h-4 ${modeConfig.color} icon-active-aura`} />
                        <span className="hidden sm:inline text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em] select-none no-neon">
                            {t(modeConfig.textKey as TranslationKeys)}
                        </span>
                    </div>

                    <div className="relative" ref={menuRef}>
                        <button 
                            className="flex items-center gap-3 cursor-pointer group focus:outline-none" 
                            onClick={() => setMenuOpen(!isMenuOpen)}
                            aria-expanded={isMenuOpen}
                            aria-haspopup="true"
                        >
                            <div className="w-10 h-10 rounded-full satin-effect shadow-satin icon-active-aura flex items-center justify-center overflow-hidden">
                                <img src="/icons/xeta-mark.png" alt="XETAPAY" className="w-7 h-7 object-contain" />
                            </div>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-card-bg border border-border-color rounded-xl shadow-2xl z-50 animate-fadeIn overflow-hidden">
                                 <ul>
                                    <li>
                                        <button 
                                            onClick={() => { setCurrentPage('account'); setMenuOpen(false); }} 
                                            className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-primary/5 transition-colors"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                                            {t('viewProfile')}
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            onClick={() => { alert('Logout clicked!'); setMenuOpen(false); }} 
                                            className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-500/5 transition-colors"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500/40"></div>
                                            {t('logout')}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
