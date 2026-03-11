import React from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { MOCK_USER, MOCK_ACTIVITY_LOGS } from '../constants';
import { ActivityLog, ActivityLogStatus } from '../types';

const ActivityStatusBadge: React.FC<{ status: ActivityLogStatus }> = ({ status }) => {
    const { t } = useTranslation();
    const baseClasses = "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest inline-block border";
    const statusClasses: Record<ActivityLogStatus, string> = {
        succeeded: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
        pending: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        failed: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{t(status as any)}</span>;
};

const ProfileDetail: React.FC<{ labelKey: any; value: string }> = ({ labelKey, value }) => {
    const { t } = useTranslation();
    return (
        <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">{t(labelKey)}</label>
            <p className="text-text-primary font-bold tracking-tight">{value}</p>
        </div>
    );
};

const AccountPage: React.FC = () => {
    const { t } = useTranslation();
    const user = MOCK_USER;

    return (
        <div className="space-y-7 animate-fadeIn max-w-5xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">{t('account')}</h1>

            <Card className="overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="w-28 h-28 rounded-full satin-effect text-white flex items-center justify-center font-bold text-5xl flex-shrink-0 shadow-satin">
                        {user.avatar}
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">{user.name}</h2>
                        <p className="text-text-secondary font-medium">{user.email}</p>
                        <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                             <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                                {t(user.role as any)}
                             </span>
                        </div>
                    </div>
                    <button className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-white satin-effect rounded-full shadow-satin hover:scale-105 transition-all w-full sm:w-auto">
                        {t('editProfile')}
                    </button>
                </div>
                <div className="border-t border-border-color/60 my-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ProfileDetail labelKey="role" value={t(user.role as any)} />
                    <ProfileDetail labelKey="lastLogin" value={new Date(user.lastLogin).toLocaleString()} />
                </div>
            </Card>

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
                                <th scope="col" className="px-8 py-4 text-right">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color/60">
                            {MOCK_ACTIVITY_LOGS.slice(0, 5).map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-5 whitespace-nowrap text-xs font-medium text-text-secondary">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="px-8 py-5">
                                        <span className="font-mono text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-text-secondary px-2 py-1 rounded border border-border-color/60">
                                            {log.event}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-text-primary tracking-tight">{log.description}</td>
                                    <td className="px-8 py-5 text-right"><ActivityStatusBadge status={log.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-8 py-4 bg-sidebar-bg/30 border-t border-border-color/60 text-center">
                    <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                        View all activity
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AccountPage;
