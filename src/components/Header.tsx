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
        <header className="flex justify-between md:justify-end items-center px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] w-full shadow-sm">
            <div className="flex items-center gap-4 lg:hidden">
                <button
                    onClick={onMenuClick}
                    className="text-slate-600 hover:text-slate-900 transition-colors p-3 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
                    aria-label="Menu"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>
            </div>

            <div className="flex items-center gap-4">
                {/* Connected Status */}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 transition-all cursor-default group">
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 z-10 relative" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Node_Sync: Active</span>
                </div>

                {/* Language Switcher */}
                <div className="relative" ref={langMenuRef}>
                    <button
                        onClick={() => setLangMenuOpen(!isLangMenuOpen)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-[11px] font-bold text-slate-600 uppercase tracking-wide bg-white hover:bg-slate-50 min-h-[44px] focus:outline-none"
                        aria-expanded={isLangMenuOpen}
                        aria-haspopup="true"
                    >
                        <Globe className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        <span className="group-hover:text-slate-900 transition-colors">{currentLangData.label}</span>
                    </button>

                    {isLangMenuOpen && (
                        <div className="absolute right-0 mt-3 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn py-2" role="menu">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as 'en' | 'th' | 'vi' | 'id');
                                        setLangMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-3 text-[11px] font-bold transition-all uppercase tracking-wide ${currentLang === lang.code ? 'text-[#3B82F6] bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
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
                        className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white hover:bg-slate-50 min-h-[44px] focus:outline-none"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#0B1120] text-white flex items-center justify-center text-[10px] font-bold shadow-sm transition-all group-hover:scale-105">
                            SJ
                        </div>
                        <div className="hidden sm:flex flex-col items-start text-left">
                            <span className="text-[12px] font-bold text-slate-900 tracking-tight leading-none mb-1">Steve John</span>
                            <span className="text-[10px] font-medium text-slate-500 uppercase">Provider Admin</span>
                        </div>
                        <ChevronDownIcon className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn py-3">
                            <ul className="space-y-1">
                                <li className="px-2">
                                    <button onClick={() => handleNavigate('account')} className="w-full flex items-center justify-between px-4 py-3 text-[12px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg uppercase tracking-wide transition-all min-h-[44px] focus:outline-none">
                                        <span>Profile</span>
                                        <User className="w-4 h-4 opacity-50" />
                                    </button>
                                </li>
                                <li className="px-2">
                                    <button onClick={() => handleNavigate('settings')} className="w-full flex items-center justify-between px-4 py-3 text-[12px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg uppercase tracking-wide transition-all min-h-[44px] focus:outline-none">
                                        <span>Settings</span>
                                        <Settings className="w-4 h-4 opacity-50" />
                                    </button>
                                </li>
                                <div className="h-px bg-slate-100 mx-4 my-2" />
                                <li className="px-2">
                                    <button onClick={() => handleNavigate('login')} className="w-full flex items-center justify-between px-4 py-3 text-[12px] font-bold text-red-600 hover:bg-red-50 rounded-lg uppercase tracking-wide transition-all min-h-[44px] focus:outline-none">
                                        <span>Logout</span>
                                        <LogOut className="w-4 h-4 opacity-50" />
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
