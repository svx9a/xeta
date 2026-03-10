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
        <header className="flex justify-between md:justify-end items-center px-6 py-4 bg-white/80 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-[100] w-full shadow-lg">
            <div className="flex items-center gap-4 lg:hidden">
                <button
                    onClick={onMenuClick}
                    className="text-mercury-400 hover:text-mercury-600 transition-colors p-3 rounded-lg hover:bg-mercury-50 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2"
                    aria-label="Menu"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>
                <button
                    onClick={() => handleNavigate('home')}
                    className="h-11 min-w-[44px] cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2 rounded"
                    aria-label="Home"
                >
                    <img
                        src="/logo-text.png"
                        alt="XETAPAY Logo"
                        className="h-full object-contain brightness-0 opacity-80"
                    />
                </button>
            </div>

            <div className="flex items-center gap-4">
                {/* Connected Status */}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-emerald-200/30 bg-gradient-to-r from-emerald-50/50 to-blue-50/30 transition-all cursor-default group">
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 z-10 relative" />
                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-30" />
                    </div>
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-[0.2em] group-hover:text-emerald-900 transition-colors">Node_Sync: Active</span>
                </div>

                {/* Language Switcher */}
                <div className="relative" ref={langMenuRef}>
                    <button
                        onClick={() => setLangMenuOpen(!isLangMenuOpen)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-mercury-200 hover:border-mercury-300 transition-all text-xs font-bold text-mercury-600 uppercase tracking-wide bg-white/80 backdrop-blur-sm group shadow-sm hover:shadow-md hover:bg-mercury-50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2"
                        aria-expanded={isLangMenuOpen}
                        aria-haspopup="true"
                    >
                        <Globe className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span className="group-hover:text-slate-900 transition-colors">{currentLangData.label}</span>
                    </button>

                    {isLangMenuOpen && (
                        <div className="absolute right-0 mt-3 w-44 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn py-2" role="menu">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as 'en' | 'th' | 'vi' | 'id');
                                        setLangMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-3 text-[10px] font-bold transition-all uppercase tracking-[0.1em] ${currentLang === lang.code ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
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
                        className="flex items-center gap-3 pl-3 pr-4 py-3 rounded-lg transition-all hover:bg-mercury-50/80 group border border-mercury-200 hover:border-mercury-300 bg-white/80 backdrop-blur-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-lg transition-all group-hover:scale-105 group-hover:shadow-xl">
                            SJ
                        </div>
                        <div className="hidden sm:flex flex-col items-start text-left">
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">Steve John</span>
                            <span className="text-[8px] font-black text-blue-600 tracking-[0.2em] uppercase opacity-60">MASTER_NODE_ADMIN</span>
                        </div>
                        <ChevronDownIcon className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''} group-hover:text-slate-600`} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-fadeIn py-3">
                            <ul className="space-y-1">
                                <li className="px-3">
                                    <button onClick={() => handleNavigate('account')} className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-mercury-700 hover:text-mercury-900 hover:bg-mercury-50 rounded-lg uppercase tracking-wide transition-all group/item min-h-[44px] focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2 focus:bg-mercury-50">
                                        <span>Identity Profile</span>
                                        <User className="w-5 h-5 opacity-40 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                                    </button>
                                </li>
                                <li className="px-3">
                                    <button onClick={() => handleNavigate('settings')} className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-mercury-700 hover:text-mercury-900 hover:bg-mercury-50 rounded-lg uppercase tracking-wide transition-all group/item min-h-[44px] focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2 focus:bg-mercury-50">
                                        <span>Core Settings</span>
                                        <Settings className="w-5 h-5 opacity-40 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                                    </button>
                                </li>
                                <div className="h-px bg-mercury-200 mx-6 my-2" />
                                <li className="px-3">
                                    <button onClick={() => handleNavigate('login')} className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg uppercase tracking-wide transition-all group/item min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:bg-red-50">
                                        <span>Revoke Session</span>
                                        <LogOut className="w-5 h-5 opacity-40 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
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
