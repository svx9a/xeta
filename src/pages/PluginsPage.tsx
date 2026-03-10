import React, { useState } from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { LinkIcon, CheckCircleIcon } from '../components/icons';
import { Page } from '../types';
import { Zap, Shield, ExternalLink, Activity } from 'lucide-react';

interface Platform {
    logoUrl: string;
    name: string;
    description: string;
    isFeatured?: boolean;
}

interface PlatformCardProps {
    platform: Platform;
    isConnected: boolean;
    onConnect: (name: string) => void;
    onManage: (name: string) => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, isConnected, onConnect, onManage }) => {
    const { t } = useTranslation();

    const buttonBaseClasses = "inline-flex items-center justify-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.25rem] transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px] shadow-2xl border-b-4 border-b-black/20";

    return (
        <Card padding="p-12" className={`flex flex-col items-center text-center transition-all duration-500 relative bg-white/60 border border-slate-200 rounded-[4rem] shadow-2xl backdrop-blur-3xl hover:shadow-[#4F8FC9]/10 group overflow-hidden ${isConnected ? 'border-blue-600/30 bg-gradient-to-b from-[#4F8FC9]/5 to-transparent' : ''}`}>
            {isConnected && (
                <div className="absolute top-10 right-10 text-[#10B981] animate-pulse">
                    <CheckCircleIcon className="w-10 h-10 shadow-sm" />
                </div>
            )}

            <div className="w-32 h-32 flex items-center justify-center bg-slate-100 rounded-[2.5rem] border border-slate-200 shadow-2xl mb-12 group-hover:rotate-6 transition-all duration-700 relative overflow-hidden">
                <img src={platform.logoUrl} alt={`${platform.name} logo`} className="max-h-16 max-w-[72px] relative z-10 brightness-0 invert opacity-40 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-[0.2]" />
            </div>

            <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase mb-6 leading-none">{platform.name}</h3>
            <p className="text-[14px] font-black text-slate-800/40 mb-12 flex-grow max-w-full sm:max-w-[280px] leading-relaxed border-t border-slate-200 pt-8 uppercase tracking-tight">{platform.description}</p>

            {isConnected ? (
                <div className="flex flex-col gap-5 w-full">
                    <button
                        onClick={() => onManage(platform.name)}
                        className={`${buttonBaseClasses} bg-blue-600 text-slate-800 hover:bg-white`}
                    >
                        <Zap className="w-5 h-5" />
                        {t('manage')}
                    </button>
                    <button
                        onClick={() => onConnect(platform.name)}
                        className={`${buttonBaseClasses} bg-slate-100 border border-slate-200 text-slate-800/40 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20`}
                    >
                        {t('disconnect')}
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => onConnect(platform.name)}
                    className={`${buttonBaseClasses} bg-slate-100 border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-slate-800 hover:border-blue-600 group/btn mt-auto`}
                >
                    <LinkIcon className="w-5 h-5 group-hover/btn:rotate-45 transition-transform" />
                    {t('connect')}
                </button>
            )}
        </Card>
    );
}

const PluginsPage: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
    const { t } = useTranslation();
    const [connectedPlatforms, setConnectedPlatforms] = useState<Record<string, boolean>>({ Shopify: true });

    const handlePlatformConnect = (platformName: string) => {
        setConnectedPlatforms(prev => ({
            ...prev,
            [platformName]: !prev[platformName]
        }));
    };

    const handleManagePlatform = (platformName: string) => {
        if (platformName === 'Shopify') {
            setCurrentPage('integrations');
        } else {
            alert(`Managing ${platformName} is not yet implemented.`);
        }
    };

    const platforms: Platform[] = [
        {
            logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
            name: 'Shopify',
            description: 'The all-in-one commerce platform to start, run, and grow a business.',
            isFeatured: true
        },
        {
            logoUrl: 'https://cdn.worldvectorlogo.com/logos/woocommerce.svg',
            name: 'WooCommerce',
            description: 'A customizable, open-source eCommerce platform built on WordPress.',
        },
        {
            logoUrl: 'https://cdn.worldvectorlogo.com/logos/bigcommerce-1.svg',
            name: 'BigCommerce',
            description: 'A leading SaaS e-commerce platform for fast-growing and established brands.',
        },
        {
            logoUrl: 'https://cdn.worldvectorlogo.com/logos/magento-2.svg',
            name: 'Magento',
            description: 'An enterprise-level platform for large businesses with extensive needs.',
        }
    ];

    return (
        <div className="animate-fadeIn max-w-full 2xl:max-w-[1600px] w-full space-y-16 pb-32 mx-auto px-6">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-10 pb-12 border-b border-slate-200">
                <div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-slate-800 uppercase leading-none">
                        Plugin <span className="text-blue-600">Architecture</span>
                    </h1>
                    <p className="text-[12px] font-black text-blue-600/80 uppercase tracking-[0.5em] mt-6 border-l-4 border-blue-600/20 pl-6 h-4 opacity-70">
                        Bridge external platforms into the XETAPAY core
                    </p>
                </div>
                <div className="flex items-center gap-6 bg-slate-100 px-10 py-6 rounded-[2rem] border border-slate-200 shadow-2xl backdrop-blur-3xl group">
                    <Activity className="w-8 h-8 text-blue-600 animate-pulse group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-800/40 group-hover:text-slate-800 transition-colors leading-none pr-[-0.4em]">Global Sync Ready</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
                {platforms.map(platform => (
                    <PlatformCard
                        key={platform.name}
                        platform={platform}
                        isConnected={!!connectedPlatforms[platform.name]}
                        onConnect={handlePlatformConnect}
                        onManage={handleManagePlatform}
                    />
                ))}
            </div>
        </div>
    );
};

export default PluginsPage;