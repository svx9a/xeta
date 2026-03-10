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
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-900" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute inset-0 geom-pattern opacity-[0.03] pointer-events-none" />

            <div className={`w-full max-w-[520px] transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-16">
                    <img
                        src="/logo-cube.png"
                        alt="XETA"
                        className="w-12 h-12 object-contain"
                    />
                </div>

                {/* Login Form Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-xl p-8 sm:p-10 border border-white/20 shadow-2xl relative">
                    <div className="absolute top-8 right-12">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">TLS_1.3</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="identity" className="text-xs font-bold text-mercury-600 uppercase tracking-wider block">USERNAME</label>
                            <input
                                id="identity"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-4 text-mercury-900 focus:border-white/50 focus:bg-white/90 focus:outline-none transition-all placeholder-mercury-400 text-base font-medium min-h-[44px]"
                                placeholder="name@xeta.network"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="secret" className="text-xs font-bold text-mercury-600 uppercase tracking-wider block">PASSWORD</label>
                            <input
                                id="secret"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-4 text-mercury-900 focus:border-white/50 focus:bg-white/90 focus:outline-none transition-all placeholder-mercury-400 text-base font-medium min-h-[44px] tracking-wider"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-700 text-sm font-medium flex items-center gap-3 min-h-[44px]">
                                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white/90 backdrop-blur-xl text-mercury-700 border border-white/30 py-4 rounded-xl font-bold uppercase tracking-wide text-sm shadow-xl hover:bg-white/95 hover:border-white/50 focus:bg-white/95 focus:border-white/50 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group min-h-[48px] focus:outline-none focus:ring-2 focus:ring-mercury-400 focus:ring-offset-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <span>LOGIN</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                        <button className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors min-h-[44px] px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">FORGOT PASSWORD?</button>
                        <button className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors min-h-[44px] px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">SIGN UP</button>
                    </div>
                </div>

                {/* Footer specs */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">XETAPAY_CORE_ACCESS_V9.2</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
