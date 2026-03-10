import React, { useState, useEffect, useRef } from 'react';
import { Bars3Icon, ChevronDownIcon } from './icons';
import { useTranslation } from '../contexts/LanguageContext';
import { Page } from '../types';
import appBridge from '../services/appBridge';
import { User, Settings, LogOut, Globe } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
    isProduction: boolean;
    setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, setCurrentPage }) => {
    const { currentLang, setLanguage } = useTranslation();
    const [isLangMenuOpen, setLangMenuOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const langMenuRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'th', label: 'TH' },
        { code: 'vi', label: 'VI' },
        { code: 'id', label: 'ID' }
    ];

    const currentLangData = languages.find(l => l.code === currentLang) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (page: Page) => {
        appBridge.navigate(page);
        setCurrentPage(page);
        setMenuOpen(false);
    };

    return (
        <header className="flex justify-between md:justify-end items-center px-6 py-4 bg-black/90 backdrop-blur-2xl border-b border-white/12 sticky top-0 z-[100] w-full shadow-lg mercury-border-glow">
            <div className="flex items-center gap-4 lg:hidden">
                <button
                    onClick={onMenuClick}
                    className="text-white/70 hover:text-white transition-colors p-3 rounded-lg hover:bg-white/5 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
                    aria-label="Menu"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>
                <button
                    onClick={() => handleNavigate('home')}
                    className="h-11 min-w-[44px] cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black rounded"
                    aria-label="Home"
                >
                    <img
                        src="/logo-text.png"
                        alt="XETAPAY Logo"
                        className="h-full object-contain opacity-100 brightness-200"
                    />
                </button>
            </div>

            <div className="flex items-center gap-4">
                {/* Connected Status */}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-white/20 bg-white/5 transition-all cursor-default group animate-gentle-glow">
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50 z-10 relative" />
                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30" />
                    </div>
                    <span className="text-[9px] font-black text-white/90 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Node_Sync: Active</span>
                </div>

                {/* Language Switcher */}
                <div className="relative" ref={langMenuRef}>
                    <button
                        onClick={() => setLangMenuOpen(!isLangMenuOpen)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/12 hover:border-white/20 transition-all text-xs font-bold text-white/80 uppercase tracking-wide bg-white/5 backdrop-blur-sm group hover:bg-white/10 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black glow-sm"
                        aria-expanded={isLangMenuOpen}
                        aria-haspopup="true"
                    >
                        <Globe className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                        <span className="group-hover:text-white transition-colors">{currentLangData.label}</span>
                    </button>

                    {isLangMenuOpen && (
                        <div className="absolute right-0 mt-3 w-44 bg-black/95 backdrop-blur-xl border border-white/12 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn py-2" role="menu">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as 'en' | 'th' | 'vi' | 'id');
                                        setLangMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-3 text-[10px] font-bold transition-all uppercase tracking-[0.1em] ${currentLang === lang.code ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                    role="menuitem"
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-3 pl-3 pr-4 py-3 rounded-lg transition-all hover:bg-white/10 group border border-white/12 hover:border-white/20 bg-white/5 backdrop-blur-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black glow-sm"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 text-white flex items-center justify-center text-[10px] font-black shadow-lg transition-all group-hover:scale-105 group-hover:shadow-xl">
                            SJ
                        </div>
                        <div className="hidden sm:flex flex-col items-start text-left">
                            <span className="text-[11px] font-black text-white uppercase tracking-tighter leading-none mb-1">Steve John</span>
                            <span className="text-[8px] font-black text-white/60 tracking-[0.2em] uppercase opacity-80">MASTER_NODE_ADMIN</span>
                        </div>
                        <ChevronDownIcon className={`w-3 h-3 text-white/50 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''} group-hover:text-white/80`} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-3 w-72 bg-black/95 backdrop-blur-xl border border-white/12 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-fadeIn py-3">
                            <ul className="space-y-1">
                                <li className="px-3">
                                    <button onClick={() => handleNavigate('account')} className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg uppercase tracking-wide transition-all group/item min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black focus:bg-white/10">
                                        <span>Identity Profile</span>
                                        <User className="w-5 h-5 opacity-50 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                                    </button>
                                </li>
                                <li className="px-3">
                                    <button onClick={() => handleNavigate('settings')} className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg uppercase tracking-wide transition-all group/item min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black focus:bg-white/10">
                                        <span>Core Settings</span>
                                        <Settings className="w-5 h-5 opacity-50 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                                    </button>
                                </li>
                                <div className="h-px bg-white/10 mx-6 my-2" />
                                <li className="px-3">
                                    <button onClick={() => handleNavigate('login')} className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg uppercase tracking-wide transition-all group/item min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black focus:bg-red-500/10">
                                        <span>Revoke Session</span>
                                        <LogOut className="w-5 h-5 opacity-50 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
