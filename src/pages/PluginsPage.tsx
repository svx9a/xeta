import React, { useState } from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { LinkIcon, CheckCircleIcon } from '../components/icons';
import { Page } from '../types';

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
    
    const buttonBaseClasses = "inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-200 hover:scale-105 w-full max-w-[160px]";

    const handleConnectClick = () => {
        onConnect(platform.name);
    };

    return (
        <Card className={`flex flex-col items-center text-center transition-all duration-300 relative ${isConnected ? 'ring-2 ring-primary/20 border-primary' : ''}`}>
            {isConnected && (
                 <div className="absolute top-4 right-4 text-emerald-500">
                    <CheckCircleIcon className="w-6 h-6" />
                 </div>
            )}
            <div className="w-20 h-20 flex items-center justify-center bg-white rounded-2xl border border-border-color/60 shadow-sm mb-6">
                <img src={platform.logoUrl} alt={`${platform.name} logo`} className="max-h-12 max-w-[48px]" />
            </div>
            <h3 className="text-xl font-extrabold text-text-primary tracking-tight">{platform.name}</h3>
            <p className="text-xs font-medium text-text-secondary my-4 flex-grow max-w-[240px] leading-relaxed">{platform.description}</p>
            
            {isConnected ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full justify-center">
                    <button onClick={() => onManage(platform.name)} className={`${buttonBaseClasses} satin-effect text-white shadow-satin`}>
                        {t('manage')}
                    </button>
                    <button onClick={handleConnectClick} className={`${buttonBaseClasses} bg-white text-text-secondary border border-border-color/60 hover:bg-gray-50`}>
                        {t('disconnect')}
                    </button>
                </div>
            ) : (
                <button onClick={handleConnectClick} className={`${buttonBaseClasses} ${platform.isFeatured ? 'satin-effect text-white shadow-satin' : 'bg-white text-text-secondary border border-border-color/60 hover:bg-gray-50'}`}>
                    <LinkIcon className="w-4 h-4"/>
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
            // Placeholder for other integrations in the future
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
        <div className="animate-fadeIn max-w-6xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-8">{t('connectYourPlatform')}</h1>
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