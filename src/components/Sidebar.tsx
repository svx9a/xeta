import React from 'react';
import { Page } from '../types';
import { NAV_GROUPS } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';
import appBridge from '../services/appBridge';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setOpen }) => {
    const { t } = useTranslation();

    const getIcon = (id: string, isActive: boolean) => {
        const iconPath = `/src/assets/icons/${id === 'home' ? 'chart' :
            id === 'payments' ? 'card' :
                id === 'payouts' ? 'refresh' :
                    id === 'plugins' ? 'globe' :
                        id === 'integrations' ? 'shield' :
                            id === 'developer' ? 'logo-cube' :
                                id === 'reports' ? 'eye' :
                                    id === 'settings' ? 'clock' :
                                        id === 'account' ? 'user' : 'logo-cube'}.png`;

        return (
            <img
                src={iconPath}
                alt={id}
                className={`w-5 h-5 object-contain transition-all duration-500 ${isActive ? 'brightness-100' : 'opacity-40 grayscale group-hover/nav:grayscale-0 group-hover/nav:opacity-100'}`}
            />
        );
    };

    return (
        <>
            <aside className={`fixed top-0 left-0 z-40 w-72 h-screen bg-white/85 backdrop-blur-2xl border-r border-white/20 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] lg:translate-x-0 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Logo Architecture */}
                <div className="flex flex-col items-center justify-center pt-8 pb-6 relative group">
                    <div className="w-52 h-16 flex items-center justify-center relative transition-all duration-500 hover:scale-105">
                        <img
                            src="/logo-text.png"
                            alt="XETAPAY Logo"
                            className="w-full h-full object-contain filter brightness-0 opacity-80"
                        />
                    </div>
                    <div className="mt-3 text-[8px] font-black text-blue-600 tracking-[0.8em] uppercase opacity-50">v9.2</div>
                </div>

                {/* Navigation Core */}
                <nav className="flex-1 overflow-y-auto px-4 mt-6 scrollbar-hide">
                    <div className="space-y-8">
                        {NAV_GROUPS.map((group) => (
                            <div key={group.title} className="mb-0">
                                <h3 className="px-4 mb-3 text-[9px] font-black text-slate-400/60 uppercase tracking-[0.5em]">
                                    {group.title}
                                </h3>
                                <ul className="space-y-1">
                                    {group.items.map((item) => {
                                        const isActive = currentPage === item.id;
                                        const label = (item as { label?: string; tKey?: string }).label || t(item.tKey as 'home');
                                        return (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => {
                                                        appBridge.navigate(item.id);
                                                        setCurrentPage(item.id);
                                                        setOpen(false);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            appBridge.navigate(item.id);
                                                            setCurrentPage(item.id);
                                                            setOpen(false);
                                                        }
                                                    }}
                                                    className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-sm tracking-wide transition-all duration-300 group/nav min-h-[44px] focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2 focus:ring-offset-mercury-50 ${isActive
                                                        ? 'bg-mercury-600 text-white shadow-lg shadow-mercury-500/25 z-10'
                                                        : 'text-mercury-700 hover:text-mercury-900 hover:bg-mercury-100/80'
                                                        }`}
                                                >
                                                    <span className="flex-shrink-0 transition-all duration-300 group-hover/nav:scale-110">
                                                        {getIcon(item.id, isActive)}
                                                    </span>
                                                    <span className="relative z-10 flex-1 text-left">
                                                        {label}
                                                    </span>
                                                    {isActive && <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-lg" />}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </nav>

                <div className="p-6">
                    <div
                        className="p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-between group cursor-default shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                            </div>
                            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-[0.2em]">Node_Alpha: Secure</span>
                        </div>
                        <img src="/shield.png" className="w-5 h-5 opacity-40 group-hover:opacity-60 transition-opacity flex-shrink-0" alt="secure" />
                    </div>
                </div>
            </aside>
            {isOpen && (
                <div
                    role="button"
                    tabIndex={-1}
                    className="fixed inset-0 bg-slate-900/20 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                            setOpen(false);
                        }
                    }}
                    aria-label="Close sidebar"
                />
            )}
        </>
    );
};

export default Sidebar;
