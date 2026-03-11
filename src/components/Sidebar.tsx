import React from 'react';
import { Page } from '../types';
import { NAV_LINKS } from '../constants';
import { AtomIcon } from './icons';
import { useTranslation } from '../contexts/LanguageContext';
import { TranslationKeys } from '../translations';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setOpen }) => {
    const { t } = useTranslation();

    return (
        <>
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-sidebar-bg border-r border-border-color p-6 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 mb-10">
                    <img 
                        src="/logo-cube.png" 
                        alt="XETAPAY" 
                        className="w-10 h-10 object-contain neon-aura"
                    />
                    <div>
                        <div className="text-xl font-serif font-black tracking-widest text-text-primary uppercase">XETA</div>
                        <div className="text-[10px] font-bold tracking-[0.3em] text-primary -mt-1 uppercase opacity-80">Payment</div>
                    </div>
                </div>

                <nav className="flex-grow">
                    <ul>
                        {NAV_LINKS.map(link => {
                            const isActive = currentPage === link.id;
                            
                            const getIconPath = (id: string) => {
                                const name = id === 'home' ? 'chart' :
                                    id === 'payments' ? 'card' :
                                        id === 'payouts' ? 'refresh' :
                                        id === 'compliance' ? 'shield' :
                                            id === 'plugins' ? 'globe' :
                                                id === 'integrations' ? 'shield' :
                                                    id === 'developer' ? 'logo-cube' :
                                                        id === 'reports' ? 'eye' :
                                                            id === 'settings' ? 'clock' :
                                                                id === 'account' ? 'user' : 'logo-cube';
                                return `/icons/${name}.png`;
                            };

                            return (
                                <li key={link.id} className="mb-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(link.id);
                                            setOpen(false);
                                        }}
                                        className={`w-full group flex items-center gap-4 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                                            isActive
                                                ? 'satin-effect text-white shadow-satin active:scale-95'
                                                : 'text-text-secondary hover:bg-white dark:hover:bg-white/5 hover:text-primary'
                                        }`}
                                    >
                                        <img 
                                            src={getIconPath(link.id)} 
                                            alt="" 
                                            className={`w-5 h-5 object-contain transition-all duration-300 icon-active-aura ${isActive ? 'brightness-0 invert neon-aura' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`}
                                        />
                                        <span>{t(link.tKey as TranslationKeys)}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                 <div className="border-t border-border-color pt-6">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-card-bg shadow-sm border border-border-color/50">
                         <AtomIcon className="w-5 h-5 text-primary animate-pulse neon-aura icon-active-aura" />
                         <span className="text-[10px] font-serif font-bold text-text-secondary uppercase tracking-wider leading-tight no-neon">{t('quantumLedgerSecured')}</span>
                    </div>
                </div>
            </aside>
            {isOpen && (
                <button 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden w-full h-full cursor-default" 
                    onClick={() => setOpen(false)}
                    aria-label="Close sidebar"
                />
            )}
        </>
    );
};

export default Sidebar;
