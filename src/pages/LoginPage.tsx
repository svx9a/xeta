import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { AppleIcon, MailIcon } from '../components/icons';

const LoginPage: React.FC = () => {
    const { login, token } = useAuth();
    const navigate = useNavigate();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [loginMode, setLoginMode] = useState<'options' | 'email'>('options');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);
        
        setTimeout(async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (window as any).turnstile?.getResponse();
            
            // SIMULATION: In a real app, this sends email/pass to /api/auth/login
            await login({
                id: 'email_user_' + btoa(email).substring(0, 8),
                name: email.split('@')[0],
                email: email,
                tenant_id: 'TENANT-001',
                turnstile_token: token || 'simulated_token'
            });
            setIsAuthenticating(false);
        }, 1200);
    };

    const handleGoogleLogin = async () => {
        setIsAuthenticating(true);
        setTimeout(async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (window as any).turnstile?.getResponse();
            const simulatedGoogleId = 'google_v2_' + Math.floor(Math.random() * 1000000);
            
            await login({
                id: simulatedGoogleId,
                name: 'Sovereign Merchant',
                email: 'merchant@xetapay.com',
                tenant_id: 'TENANT-001',
                turnstile_token: token || 'simulated_token'
            });
            setIsAuthenticating(false);
        }, 1500);
    };

    return (
        <div className="min-h-[100dvh] bg-background relative overflow-x-hidden flex flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md relative z-10 animate-fadeIn">
                <div className="text-center mb-8 sm:mb-10">
                    <img
                        src="/icons/xetapay-logo.png"
                        alt="XETAPAY"
                        className="w-72 sm:w-80 max-w-[92%] h-auto mx-auto mb-3 object-contain select-none"
                        draggable={false}
                    />
                    <p className="text-text-secondary font-bold uppercase tracking-[0.2em] text-[10px] opacity-60">Next-Gen Payment Infrastructure</p>
                </div>

                <Card className="p-6 sm:p-8 satin-effect bg-white/50 dark:bg-sidebar-bg/10 backdrop-blur-xl border-white/20">
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-black text-text-primary mb-1">
                                {loginMode === 'email' ? 'Email Access' : 'Welcome Back'}
                            </h2>
                            <p className="text-xs text-text-secondary">
                                {loginMode === 'email' ? 'Enter your credentials to continue' : 'Login to your merchant dashboard'}
                            </p>
                        </div>

                        {loginMode === 'options' ? (
                            <div className="space-y-3">
                                <button 
                                    onClick={handleGoogleLogin}
                                    disabled={isAuthenticating}
                                    className={`w-full satin-effect flex items-center justify-center gap-4 py-3.5 rounded-2xl border border-primary/40 bg-primary/10 font-bold text-sm transition-all shadow-md hover:scale-[1.01] active:scale-95 hover:bg-primary/20 ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isAuthenticating ? (
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                                    ) : (
                                        <>
                                            <div className="w-5 h-5 flex items-center justify-center bg-primary rounded-lg text-white text-[10px]">A</div>
                                            <span className="text-primary tracking-widest uppercase text-xs">Admin Overdrive Access</span>
                                        </>
                                    )}
                                </button>

                                <button 
                                    disabled={isAuthenticating}
                                    className="w-full satin-effect flex items-center justify-center gap-4 py-3.5 rounded-2xl border border-border-color/60 bg-black text-white font-bold text-sm transition-all shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                                >
                                    <AppleIcon className="w-5 h-5 text-white" />
                                    <span>Continue with Apple</span>
                                </button>

                                <button 
                                    onClick={() => setLoginMode('email')}
                                    disabled={isAuthenticating}
                                    className="w-full satin-effect flex items-center justify-center gap-4 py-3.5 rounded-2xl border border-border-color/60 bg-sidebar-bg/40 font-bold text-sm transition-all shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                                >
                                    <MailIcon className="w-5 h-5 text-text-secondary" />
                                    <span className="text-text-primary">Standard Email Access</span>
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleEmailAuth} className="space-y-4 animate-scaleUp">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary transition-colors group-focus-within:text-primary" />
                                        <input 
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="merchant@example.com"
                                            className="w-full bg-sidebar-bg/20 border border-border-color/40 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-text-secondary rounded-full"></div>
                                        </div>
                                        <input 
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-sidebar-bg/20 border border-border-color/40 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isAuthenticating}
                                    className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isAuthenticating ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                    ) : (
                                        'Secure Sign In / Register'
                                    )}
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => setLoginMode('options')}
                                    className="w-full text-[10px] text-text-secondary font-bold uppercase tracking-widest hover:text-primary transition-colors"
                                >
                                    Back to options
                                </button>
                            </form>
                        )}

                        <div className="flex justify-center">
                            <div className="cf-turnstile" data-sitekey="0x4AAAAAACpKX1PxoaSTx8Kv"></div>
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-color/30"></div></div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-text-secondary"><span className="bg-background px-4">Secure Access</span></div>
                        </div>

                        <div className="text-center text-[10px] text-text-secondary/60 leading-relaxed italic">
                            By continuing, you agree to XETAPAY's <br/>
                            <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                        </div>
                    </div>
                </Card>

                <div className="mt-8 text-center text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">
                    Xetapay Merchant Dashboard v9
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
