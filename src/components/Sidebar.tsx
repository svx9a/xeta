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
        const iconPath = `/icons/${id === 'home' ? 'chart' :
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
                className={`w-[25px] h-[25px] object-contain transition-all duration-500 ${isActive ? 'brightness-[1.2]' : 'brightness-[1.1] opacity-60 grayscale group-hover/nav:grayscale-0 group-hover/nav:opacity-100'}`}
            />
        );
    };

    return (
        <>
            <aside className={`fixed top-0 left-0 z-40 w-72 h-screen bg-[#0B1120] border-r border-white/5 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Logo Architecture */}
                <div className="flex flex-col items-center justify-center pt-8 pb-6 relative group">
                    <div className="w-52 h-16 flex items-center justify-center relative transition-all duration-500 hover:scale-105">
                        <img
                            src="/logo-text.png"
                            alt="XETAPAY Logo"
                            className="w-full h-full object-contain opacity-100 invert brightness-0"
                        />
                    </div>
                </div>

                {/* Navigation Core */}
                <nav className="flex-1 overflow-y-auto px-4 mt-6 scrollbar-hide">
                    <div className="space-y-8">
                        {NAV_GROUPS.map((group) => (
                            <div key={group.title} className="mb-0">
                                <h3 className="px-4 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">
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
                                                    className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-[14px] transition-all duration-300 group/nav min-h-[48px] focus:outline-none ${isActive
                                                        ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    <span className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'brightness-200' : 'opacity-50 grayscale group-hover/nav:grayscale-0 group-hover/nav:opacity-100'}`}>
                                                        {getIcon(item.id, isActive)}
                                                    </span>
                                                    <span className="relative z-10 flex-1 text-left">
                                                        {label}
                                                    </span>
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
                        className="p-4 bg-gray-100 backdrop-blur-xl rounded-2xl border border-gray-300 flex items-center justify-between group cursor-default shadow-lg hover:shadow-xl transition-all duration-300 glow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse" />
                                <div className="absolute inset-0 bg-gray-600 rounded-full animate-ping opacity-20" />
                            </div>
                            <span className="text-[9px] font-black text-gray-800 uppercase tracking-[0.2em]">Node_Alpha: Secure</span>
                        </div>
                        <img src="/shield.png" className="w-[25px] h-[25px] opacity-50 group-hover:opacity-70 transition-opacity flex-shrink-0 brightness-[2.4]" alt="secure" />
                    </div>
                </div>
            </aside>
            {isOpen && (
                <div
                    role="button"
                    tabIndex={-1}
                    className="fixed inset-0 bg-gray-500/40 z-30 lg:hidden backdrop-blur-sm"
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
