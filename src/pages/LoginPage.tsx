import React, { useState, useEffect } from 'react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        setShowContent(true);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            if (email.includes('admin') && password) {
                window.location.hash = '#/home';
                window.location.reload();
            } else {
                setError('Authentication Failure: Invalid credentials provided for node access.');
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-surface-sunken flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-900" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-10" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-500 rounded-full blur-[150px] opacity-10" />
            <div className="absolute inset-0 geom-pattern opacity-[0.03] pointer-events-none" />

            <div className={`w-full max-w-[520px] transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-16">
                    <img
                        src="/logo-cube.png"
                        alt="XETA"
                        className="w-12 h-12 object-contain brightness-200"
                    />
                </div>

                {/* Login Form Card */}
                <div className="bg-surface backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-border-subtle shadow-2xl relative">
                    <div className="absolute top-8 right-12">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">STATUS: ONLINE</span>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-text-primary uppercase tracking-tight mb-2">Gateway Access</h1>
                        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Primary Gateway</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-3">
                            <label htmlFor="identity" className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] block ml-1">Email Address</label>
                            <input
                                id="identity"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-6 py-5 text-text-primary focus:border-blue-500/50 focus:bg-surface-elevated focus:outline-none transition-all placeholder-text-tertiary/30 text-sm font-medium min-h-[56px] shadow-inner"
                                placeholder="name@xeta.network"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="secret" className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] block ml-1">Password</label>
                            <input
                                id="secret"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-6 py-5 text-text-primary focus:border-blue-500/50 focus:bg-surface-elevated focus:outline-none transition-all placeholder-text-tertiary/30 text-sm font-medium min-h-[56px] tracking-widest"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wide flex items-center gap-3 min-h-[44px]">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-action-primary-bg text-action-primary-text border border-white/10 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-action-primary-hover transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group min-h-[56px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <span>Initiate Session</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-2 pt-8 border-t border-border-subtle">
                        <button className="text-[10px] font-black text-text-tertiary hover:text-blue-400 transition-colors uppercase tracking-[0.1em]">Reset Credentials</button>
                        <button className="text-[10px] font-black text-text-tertiary hover:text-blue-400 transition-colors uppercase tracking-[0.1em]">Create Access Node</button>
                    </div>
                </div>

                {/* Footer specs */}
                <div className="mt-12 text-center">
                    <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.6em] opacity-40">XetaPay Financial Engine // v9.2</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
