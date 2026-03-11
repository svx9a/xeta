import React, { useState } from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { CheckCircleIcon, ExclamationCircleIcon } from '../components/icons';
import Modal from '../components/Modal';

const IntegrationsPage: React.FC = () => {
    const { t } = useTranslation();
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected'>('disconnected');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isDisconnectModalOpen, setDisconnectModalOpen] = useState(false);

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnecting(true);
        setTimeout(() => {
            setConnectionStatus('connected');
            setIsConnecting(false);
        }, 1500);
    };

    const handleDisconnect = () => {
        setConnectionStatus('disconnected');
        setDisconnectModalOpen(false);
    };

    const handleForceSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    }
    
    const storeUrl = "xeta-demo-store.myshopify.com";

    return (
        <div className="animate-fadeIn max-w-5xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-7">{t('integrations')}</h1>
            
            <div className="grid grid-cols-1 gap-8">
                {connectionStatus === 'connected' ? (
                    <Card>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-2">{t('shopifyIntegration')}</h2>
                                 <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400`}>
                                    <CheckCircleIcon className="w-5 h-5" />
                                    <span>{t(connectionStatus as any)}</span>
                                </div>
                            </div>
                            <button onClick={() => setDisconnectModalOpen(true)} className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors">{t('disconnect')}</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-sidebar-bg/30 border border-border-color/60 rounded-2xl">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">{t('storeUrl')}</label>
                                <p className="font-bold text-text-primary tracking-tight">{storeUrl}</p>
                            </div>
                            <div className="p-6 bg-sidebar-bg/30 border border-border-color/60 rounded-2xl">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">{t('syncStatus')}</label>
                                <p className="font-bold text-text-primary flex items-center gap-2 tracking-tight">
                                   {isSyncing ? t('syncing') : t('lastSynced')}
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-8">
                            <button onClick={handleForceSync} disabled={isSyncing} className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-white satin-effect rounded-full shadow-satin hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all">
                                {isSyncing ? t('syncing') : t('forceSync')}
                            </button>
                        </div>
                    </Card>
                ) : (
                    <Card>
                        <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-8">{t('shopifyIntegration')}</h2>
                        <form onSubmit={handleConnect} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="shopify-url" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('storeUrl')}</label>
                                    <input type="text" id="shopify-url" placeholder="your-store.myshopify.com" className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-4 text-text-primary font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="shopify-api-key" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('apiKey')}</label>
                                    <input type="password" id="shopify-api-key" placeholder="Enter your Shopify API Key" className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-4 text-text-primary font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="shopify-api-secret" className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('apiSecret')}</label>
                                <input type="password" id="shopify-api-secret" placeholder="Enter your Shopify API Secret" className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-4 text-text-primary font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                            </div>
                            <div className="flex items-center gap-6 pt-4">
                                <button type="submit" disabled={isConnecting} className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-white satin-effect rounded-full shadow-satin hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all">
                                    {isConnecting ? t('connecting') : t('saveConnect')}
                                </button>
                                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400`}>
                                    <ExclamationCircleIcon className="w-5 h-5" />
                                    <span>{t(connectionStatus as any)}</span>
                                </div>
                            </div>
                        </form>
                    </Card>
                )}

                <Card>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-2">{t('promptPay')} Integration</h2>
                            <p className="text-xs font-medium text-text-secondary">Enable QR code payments for your Thai customers.</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" 
                                alt="PromptPay" 
                                className="w-8"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">PromptPay ID (Mobile or Tax ID)</label>
                                <input type="text" placeholder="081-XXX-XXXX" className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-4 text-text-primary font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Account Name (Thai)</label>
                                <input type="text" placeholder="ชื่อบัญชีภาษาไทย" className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-4 text-text-primary font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                            <button className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-white satin-effect rounded-full shadow-satin hover:scale-105 transition-all">
                                {t('enable')} {t('promptPay')}
                            </button>
                        </div>
                    </div>
                </Card>
            </div>

            <Modal
                isOpen={isDisconnectModalOpen}
                onClose={() => setDisconnectModalOpen(false)}
                title={t('confirmDisconnectTitle')}
                footer={
                    <>
                        <button onClick={() => setDisconnectModalOpen(false)} className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary bg-white dark:bg-card-bg border border-border-color hover:bg-gray-50 rounded-full transition-all">{t('cancel')}</button>
                        <button onClick={handleDisconnect} className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 rounded-full shadow-lg transition-all">{t('confirmDisconnect')}</button>
                    </>
                }
            >
                <p className="text-sm font-medium text-text-secondary leading-relaxed">{t('confirmDisconnectMsg', { storeUrl })}</p>
            </Modal>
        </div>
    );
};

export default IntegrationsPage;