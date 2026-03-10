import React, { useState } from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { LinkIcon, CheckCircleIcon } from '../components/icons';
import { Page } from '../types';
import { Zap, Activity } from 'lucide-react';

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

    const buttonBaseClasses = "inline-flex items-center justify-center px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-200 hover:scale-105 active:scale-95 border-2 min-w-[140px]";

    return (
        <Card padding="p-10" className={`flex flex-col items-center text-center transition-all duration-300 relative bg-white rounded-3xl shadow-sm border ${isConnected ? 'border-[#3B82F6]' : 'border-slate-100 hover:shadow-md'}`}>
            {isConnected && (
                <div className="absolute top-6 right-6 text-[#10B981]">
                    <CheckCircleIcon className="w-6 h-6" />
                </div>
            )}

            <div className="w-24 h-24 flex items-center justify-center bg-slate-50 rounded-2xl mb-8">
                <img src={platform.logoUrl} alt={`${platform.name} logo`} className="max-h-12 max-w-[48px] object-contain" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4">{platform.name}</h3>
            <p className="text-sm text-slate-500 mb-10 max-w-[260px] leading-relaxed">{platform.description}</p>

            <div className="flex flex-col gap-3 mt-auto">
                {isConnected ? (
                    <>
                        <button
                            onClick={() => onManage(platform.name)}
                            className={`${buttonBaseClasses} bg-white border-slate-200 text-slate-900 hover:bg-slate-50`}
                        >
                            {t('manage')}
                        </button>
                        <button
                            onClick={() => onConnect(platform.name)}
                            className={`${buttonBaseClasses} border-transparent text-[#3B82F6] hover:bg-blue-50`}
                        >
                            {t('disconnect')}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onConnect(platform.name)}
                        className={`${buttonBaseClasses} bg-white border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50`}
                    >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        {t('connect')}
                    </button>
                )}
            </div>
        </Card>
    );
}

const PluginsPage: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
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
        <div className="animate-fadeIn max-w-5xl w-full space-y-12 pb-20 mx-auto px-6">
            <div className="pt-10 pb-8 text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                    Connect Your Platform
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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