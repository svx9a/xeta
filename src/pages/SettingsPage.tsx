import React, { useState } from 'react';
import Card from '../components/Card';
import Switch from '../components/Switch';
import { useTranslation } from '../contexts/LanguageContext';
import Modal from '../components/Modal';
import { CheckCircleIcon, QrCodeIcon } from '../components/icons';

const SettingsPage: React.FC = () => {
    const { t, currentLang, setLanguage } = useTranslation();
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [is2FAModalOpen, set2FAModalOpen] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [currentCurrency, setCurrentCurrency] = useState('THB');

    const handle2FASetup = () => {
        // In a real app, this would involve API calls. Here, we just simulate.
        if (verificationCode === "123456") {
            setTwoFactorEnabled(true);
            set2FAModalOpen(false);
            setVerificationCode('');
        } else {
            alert("Invalid verification code. Please try again.");
        }
    };

    const footer2FA = (
        <>
            <button onClick={() => set2FAModalOpen(false)} className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary bg-white dark:bg-card-bg border border-border-color hover:bg-gray-50 rounded-full transition-all">
                {t('cancel')}
            </button>
            <button 
                onClick={handle2FASetup} 
                className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white satin-effect rounded-full shadow-satin hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all" 
                disabled={verificationCode.length < 6}
            >
                {t('verifyEnable')}
            </button>
        </>
    );

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'th', name: 'ไทย (Thai)' },
        { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
        { code: 'id', name: 'Bahasa Indonesia' },
        { code: 'ms', name: 'Bahasa Melayu (Malay)' },
    ];

    const currencies = [
        { code: 'THB', name: 'Thai Baht (฿)' },
        { code: 'VND', name: 'Vietnamese Dong (₫)' },
        { code: 'IDR', name: 'Indonesian Rupiah (Rp)' },
        { code: 'MYR', name: 'Malaysian Ringgit (RM)' },
        { code: 'SGD', name: 'Singapore Dollar (S$)' },
        { code: 'PHP', name: 'Philippine Peso (₱)' },
    ];

    return (
        <div className="animate-fadeIn space-y-7 max-w-5xl pb-20">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-7">{t('settings')}</h1>
            
            <Card>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">{t('regionalSettings')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('language')}</label>
                        <select 
                            value={currentLang} 
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-4 text-text-primary font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('currency')}</label>
                        <select 
                            value={currentCurrency}
                            onChange={(e) => setCurrentCurrency(e.target.value)}
                            className="w-full bg-white dark:bg-background border border-border-color/60 rounded-xl p-4 text-text-primary font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                        >
                            {currencies.map(curr => (
                                <option key={curr.code} value={curr.code}>{curr.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">{t('securitySettings')}</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-sidebar-bg/30 border border-border-color/60 rounded-2xl">
                        <div>
                            <p className="font-bold text-text-primary tracking-tight">{t('biometricAuth')}</p>
                            <p className="text-xs text-text-secondary font-medium mt-1">{t('biometricDesc')}</p>
                        </div>
                        <Switch checked={biometricEnabled} onChange={setBiometricEnabled} />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-sidebar-bg/30 border border-border-color/60 rounded-2xl">
                        <div>
                            <p className="font-bold text-text-primary tracking-tight">{t('twoFactorAuth')}</p>
                            <p className="text-xs text-text-secondary font-medium mt-1">{t('twoFactorDesc')}</p>
                        </div>
                        {twoFactorEnabled ? (
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                <CheckCircleIcon className="w-5 h-5" />
                                <span>{t('enabled')}</span>
                            </div>
                        ) : (
                             <button onClick={() => set2FAModalOpen(true)} className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white satin-effect rounded-full shadow-satin hover:scale-105 transition-all">
                                {t('enable')}
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            <Modal
                isOpen={is2FAModalOpen}
                onClose={() => set2FAModalOpen(false)}
                title={t('setup2FA')}
                footer={footer2FA}
            >
                <div className="text-center">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-6">{t('scanQrCode')}</p>
                    <div className="flex justify-center my-8">
                        <div className="p-4 bg-white rounded-2xl border border-border-color/60 shadow-sm">
                            <QrCodeIcon className="w-32 h-32 text-text-primary" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">{t('enterVerificationCode')}</p>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full max-w-[200px] mx-auto bg-white dark:bg-background border border-border-color/60 rounded-xl p-4 text-center font-mono tracking-[0.5em] text-2xl font-bold text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default SettingsPage;