import React, { useState } from 'react';
import Card from '../components/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { Settings, Globe, Shield, Bell, Smartphone, User, Lock, Mail, Languages, Coins, Fingerprint, ShieldCheck } from 'lucide-react';
import Switch from '../components/Switch';
import Modal from '../components/Modal';

const SettingsPage: React.FC = () => {
    const { currentLang, setLanguage, t } = useTranslation();
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

    const languages = [
        { code: 'en', label: 'English', native: 'English' },
        { code: 'th', label: 'Thai', native: 'ไทย' },
        { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt' },
        { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' }
    ];

    const inputBaseClasses = "w-full bg-slate-100 border border-slate-200 rounded-[1.25rem] p-5 font-black text-xl tracking-tighter text-slate-800 focus:outline-none focus:bg-slate-100 focus:border-blue-600/30 transition-all placeholder-white/20 shadow-inner outline-none";
    const labelBaseClasses = "block text-[10px] font-black text-blue-600/60 uppercase tracking-[0.4em] mb-4 leading-none";

    return (
        <div className="space-y-16 animate-fadeIn max-w-full 2xl:max-w-[1600px] w-full pb-32 mx-auto px-6">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-10 pb-12 border-b border-slate-200">
                <div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-slate-800 uppercase leading-none">
                        Configuration
                    </h1>
                    <p className="text-[12px] font-black text-blue-600/80 uppercase tracking-[0.5em] mt-6 border-l-4 border-blue-600/20 pl-6 h-4">SYSTEM PREFERENCES // NODE v9.2</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-12">
                    <Card padding="p-12" className="bg-white/60 rounded-[3rem] border border-slate-200 shadow-2xl backdrop-blur-3xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />
                        <div className="flex items-center gap-8 mb-16 border-b border-slate-200 pb-10">
                            <div className="p-6 bg-blue-600/10 rounded-3xl border border-blue-600/20 shadow-xl group-hover:rotate-6 transition-transform duration-500">
                                <Globe className="w-10 h-10 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-3">Regional Protocol</h2>
                                <p className="text-[11px] font-black text-blue-600/40 uppercase tracking-[0.4em] leading-none">LOCALIZATION ENGINE</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                            <div className="space-y-6">
                                <label className={labelBaseClasses}>Interface Language</label>
                                <div className="relative group/select">
                                    <select
                                        value={currentLang}
                                        onChange={(e) => setLanguage(e.target.value as any)}
                                        className={`${inputBaseClasses} appearance-none cursor-pointer pr-16`}
                                    >
                                        {languages.map(lang => (
                                            <option key={lang.code} value={lang.code} className="bg-white text-slate-800">
                                                {lang.label} ({lang.native})
                                            </option>
                                        ))}
                                    </select>
                                    <Languages className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-600/40 group-hover/select:text-blue-600 transition-colors pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className={labelBaseClasses}>Base Currency Tier</label>
                                <div className="relative group/select">
                                    <select className={`${inputBaseClasses} appearance-none cursor-pointer pr-16`}>
                                        <option className="bg-white text-slate-800">THB (Thai Baht)</option>
                                        <option className="bg-white text-slate-800">USD (US Dollar)</option>
                                        <option className="bg-white text-slate-800">EUR (Euro)</option>
                                        <option className="bg-white text-slate-800">VND (Vietnamese Dong)</option>
                                        <option className="bg-white text-slate-800">IDR (Indonesian Rupiah)</option>
                                    </select>
                                    <Coins className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-600/40 group-hover/select:text-blue-600 transition-colors pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card padding="p-12" className="bg-white/60 rounded-[3rem] border border-slate-200 shadow-2xl backdrop-blur-3xl relative group overflow-hidden">
                        <div className="flex items-center gap-8 mb-16 border-b border-slate-200 pb-10">
                            <div className="p-6 bg-blue-600/10 rounded-3xl border border-blue-600/20 shadow-xl group-hover:rotate-6 transition-transform duration-500">
                                <ShieldCheck className="w-10 h-10 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-3">Security Perimeter</h2>
                                <p className="text-[11px] font-black text-blue-600/40 uppercase tracking-[0.4em] leading-none">ACCESS CONTROL LIST</p>
                            </div>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div className="flex items-center justify-between p-10 bg-slate-100 border border-slate-200 rounded-[2.5rem] hover:bg-slate-100 transition-all group/item shadow-inner">
                                <div className="flex items-center gap-8">
                                    <div className="p-5 bg-blue-600/10 rounded-2xl border border-blue-600/20 group-hover/item:rotate-12 transition-transform">
                                        <Fingerprint className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase mb-2">Biometric Authorization</h4>
                                        <p className="text-[11px] font-black text-slate-800/40 uppercase tracking-[0.2em]">TOUCH ID / FACE ID PASSKEY</p>
                                    </div>
                                </div>
                                <Switch checked={isBiometricEnabled} onChange={setIsBiometricEnabled} />
                            </div>

                            <button
                                onClick={() => setIs2FAModalOpen(true)}
                                className="w-full flex items-center justify-between p-10 bg-blue-600 border-4 border-slate-200 rounded-[2.5rem] hover:translate-y-[-4px] active:translate-y-[1px] transition-all group/item shadow-2xl"
                            >
                                <div className="flex items-center gap-8">
                                    <div className="p-5 bg-slate-200 rounded-2xl border border-white/30 backdrop-blur-md group-hover/item:rotate-[-6deg] transition-transform shadow-lg">
                                        <Lock className="w-8 h-8 text-slate-800" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase mb-2">Multi-Factor Protocol</h4>
                                        <p className="text-[11px] font-black text-slate-800/70 uppercase tracking-[0.2em] border-l-2 border-slate-300 pl-4 leading-none">TOTP / SMS GATEWAY ENABLED</p>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-slate-800 bg-slate-200 px-6 py-3 rounded-xl border border-white/30 uppercase tracking-[0.3em]">CONFIGURE</div>
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="space-y-12">
                    <Card padding="p-12" className="bg-white/60 rounded-[3rem] border border-slate-200 shadow-2xl backdrop-blur-3xl text-slate-800 relative group overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-12 pb-6 border-b border-slate-200 leading-none">Notifications</h3>
                        <div className="space-y-8">
                            {[
                                { icon: Mail, label: 'Email Alerts', status: 'ACTIVE' },
                                { icon: Smartphone, label: 'Push Tokens', status: 'READY' },
                                { icon: Bell, label: 'System Pings', status: 'ON' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-8 bg-slate-100 border border-slate-200 rounded-[2rem] hover:bg-slate-100 transition-all group/notify shadow-inner">
                                    <div className="flex items-center gap-6">
                                        <item.icon className="w-6 h-6 text-blue-600" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-800/40 group-hover/notify:text-slate-800 transition-colors">{item.label}</span>
                                    </div>
                                    <div className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]" />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="p-12 bg-white/40 border-2 border-dashed border-slate-200 rounded-[3rem] relative group hover:bg-white/60 hover:border-blue-600/30 transition-all backdrop-blur-md">
                        <div className="flex flex-col items-center text-center gap-8 relative z-10">
                            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-blue-600 border border-slate-200 shadow-xl group-hover:rotate-[15deg] transition-all duration-700">
                                <User className="w-12 h-12" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">Master Proxy</h4>
                                <p className="text-[14px] text-slate-800/40 leading-relaxed font-black mb-8 px-4 uppercase tracking-tighter">Your node is currently operating under Master Admin credentials.</p>
                            </div>
                            <button className="text-[12px] font-black text-blue-600 uppercase tracking-[0.56em] hover:text-slate-800 transition-all underline underline-offset-[16px] decoration-4 decoration-[#4F8FC9]/20 hover:decoration-[#4F8FC9]">EDIT ENTITY PROFILE</button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={is2FAModalOpen}
                onClose={() => setIs2FAModalOpen(false)}
                title="Secure 2FA Implementation"
            >
                <div className="p-16 bg-white rounded-[4rem] border border-slate-200 shadow-2xl text-center max-w-2xl mx-auto">
                    <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-slate-200 shadow-xl">
                        <Shield className="w-16 h-16 text-blue-600" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-6 leading-none">Security Challenge</h3>
                    <p className="text-xl text-slate-800/40 mb-12 font-black leading-relaxed uppercase tracking-tight">Scan the temporal vector below or input the manual reconciliation hash.</p>
                    <div className="w-56 h-56 bg-slate-100 mx-auto rounded-[2rem] border-4 border-slate-300 flex items-center justify-center shadow-inner group">
                        <div className="w-40 h-40 bg-blue-600/20 rounded-xl animate-pulse group-hover:scale-110 transition-transform" />
                    </div>
                    <button
                        onClick={() => setIs2FAModalOpen(false)}
                        className="mt-16 w-full py-7 text-sm font-black uppercase tracking-[0.4em] text-slate-800 bg-gradient-to-r from-[#1E4A6F] to-[#2B6C9E] rounded-2xl shadow-2xl hover:translate-y-[-4px] active:translate-y-[2px] transition-all"
                    >
                        COMPLETE VERIFICATION
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SettingsPage;