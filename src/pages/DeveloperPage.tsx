import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { CheckCircleIcon } from '../components/icons';
import { useTranslation } from '../contexts/LanguageContext';
import { MOCK_ACTIVITY_LOGS } from '../constants';
import { ActivityLogStatus } from '../types';
import { pingApi } from '../services/edgeClient';
import Switch from '../components/Switch';
import { TranslationKeys } from '../translations';

interface DeveloperPageProps {
    isProduction: boolean;
    setIsProduction: (isProduction: boolean) => void;
}

const ApiKeyInput: React.FC<{ label: string; value: string; description: string }> = ({ label, value, description }) => (
    <div>
        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{label}</label>
        <div className="relative group">
            <input 
                type="text" 
                readOnly 
                value={value} 
                className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-4 font-mono text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-text-secondary hover:text-primary transition-colors icon-active-aura">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
            </button>
        </div>
        <small className="text-[10px] font-bold text-text-secondary mt-2 block uppercase tracking-tighter opacity-70">{description}</small>
    </div>
);

const ActivityStatusBadge: React.FC<{ status: ActivityLogStatus }> = ({ status }) => {
    const { t } = useTranslation();
    const baseClasses = "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest inline-block border";
    const statusClasses: Record<ActivityLogStatus, string> = {
        succeeded: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
        pending: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        failed: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{t(status as TranslationKeys)}</span>;
};


const DeveloperPage: React.FC<DeveloperPageProps> = ({ isProduction, setIsProduction }) => {
    const [apiStatus, setApiStatus] = useState<'idle' | 'pinging' | 'online' | 'offline'>('idle');
    const { t } = useTranslation();
    const latexEnabled = import.meta.env.DEV || (import.meta as any)?.env?.VITE_ENABLE_LATEX_COMPILER === 'true';

    const handlePingApi = async () => {
        setApiStatus('pinging');
        const isOnline = await pingApi();
        setApiStatus(isOnline ? 'online' : 'offline');
    };

    return (
        <div className="space-y-7 animate-fadeIn max-w-5xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">{t('developerTools')}</h1>

            <Card>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">{t('environmentSettings')}</h2>
                <div className="flex items-center justify-between p-6 bg-sidebar-bg/30 border border-border-color/60 rounded-2xl">
                    <div>
                        <p className="font-bold text-text-primary tracking-tight">{t('productionMode')}</p>
                        <p className="text-xs text-text-secondary font-medium mt-1">{t('productionModeDesc')}</p>
                    </div>
                    <Switch checked={isProduction} onChange={setIsProduction} />
                </div>
            </Card>

            {latexEnabled ? (
                <Card>
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-3">Utilities</h2>
                    <Link
                        to="/latex"
                        className="block p-6 rounded-2xl border border-border-color/60 bg-sidebar-bg/30 hover:bg-white/5 transition-all active:scale-[0.99]"
                    >
                        <div className="text-xs font-bold uppercase tracking-widest text-text-primary">LaTeX Compiler</div>
                        <div className="text-xs text-text-secondary font-medium mt-1">
                            Compile <span className="font-mono">.tex</span> to PDF locally via <span className="font-mono">tectonic</span>.
                        </div>
                    </Link>
                </Card>
            ) : null}
            
            <Card padding="p-0" className="overflow-hidden">
                <div className="px-8 py-5 border-b border-border-color/60 bg-sidebar-bg/30">
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">{t('liveActivity')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-text-secondary uppercase tracking-widest bg-background/50">
                            <tr>
                                <th scope="col" className="px-8 py-4">{t('timestamp')}</th>
                                <th scope="col" className="px-8 py-4">{t('event')}</th>
                                <th scope="col" className="px-8 py-4">{t('description')}</th>
                                <th scope="col" className="px-8 py-4">{t('orderId')}</th>
                                <th scope="col" className="px-8 py-4 text-right">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color/60">
                            {MOCK_ACTIVITY_LOGS.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-5 whitespace-nowrap text-xs font-medium text-text-secondary">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="px-8 py-5">
                                        <span className="font-mono text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-text-secondary px-2 py-1 rounded border border-border-color/60">
                                            {log.event}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-text-primary tracking-tight">{log.description}</td>
                                    <td className="px-8 py-5 text-xs font-bold text-text-secondary">#{log.orderId}</td>
                                    <td className="px-8 py-5 text-right"><ActivityStatusBadge status={log.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <Card>
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">{t('apiKeys')}</h2>
                    <div className="space-y-6">
                        <ApiKeyInput label={t('sandboxKey')} value="sand_sk_test_XXXXXXXXXXXXXXXXXXXXXXXX" description={t('sandboxKeyDesc')} />
                        <ApiKeyInput label={t('liveKey')} value="live_pk_live_XXXXXXXXXXXXXXXXXXXXXXXX" description={t('liveKeyDesc')} />
                    </div>
                </Card>

                <Card className="flex flex-col">
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">{t('apiStatus')}</h2>
                    <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
                        <button 
                            onClick={handlePingApi} 
                            disabled={apiStatus === 'pinging'} 
                            className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-white satin-effect rounded-full shadow-satin hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all mb-6"
                        >
                            {apiStatus === 'pinging' ? t('pinging') : t('pingAPI')}
                        </button>
                        
                        {apiStatus === 'online' && (
                            <div className="flex items-center gap-3 p-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800 animate-fadeIn">
                                <CheckCircleIcon className="w-5 h-5 icon-active-aura" />
                                <span>{t('apiOperational')}</span>
                            </div>
                        )}
                        
                        {apiStatus === 'offline' && (
                            <div className="flex items-center gap-3 p-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800 animate-fadeIn">
                                <svg className="w-5 h-5 icon-active-aura" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>API Offline</span>
                            </div>
                        )}

                        {apiStatus === 'idle' && (
                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-50">
                                Ready to test connection
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DeveloperPage;
