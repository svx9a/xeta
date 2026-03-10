import React, { useState, useEffect } from 'react';
import { TwitterIcon, EmailIcon, GoogleIcon, AppleIcon } from '../components/icons';
import { X } from 'lucide-react';

const SignUpPage: React.FC = () => {
    const [showContent, setShowContent] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setShowContent(true);
    }, []);

    const handleTwitterSignUp = () => {
        // In a real app, this would redirect to Twitter OAuth
        try {
            localStorage.setItem('xeta_auth_provider', 'twitter');
            window.location.hash = '/home';
        } catch (err) {
            setError('Twitter sign-up failed');
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            localStorage.setItem('xeta_auth_email', email);
            localStorage.setItem('xeta_auth_provider', 'email');
            window.location.hash = '/home';
        } catch (err) {
            setError('Email sign-up failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        // In a real app, this would redirect to Google OAuth
        try {
            localStorage.setItem('xeta_auth_provider', 'google');
            window.location.hash = '/home';
        } catch (err) {
            setError('Google sign-up failed');
        }
    };

    const handleAppleSignUp = () => {
        // In a real app, this would redirect to Apple OAuth
        try {
            localStorage.setItem('xeta_auth_provider', 'apple');
            window.location.hash = '/home';
        } catch (err) {
            setError('Apple sign-up failed');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-900" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute inset-0 geom-pattern opacity-[0.03] pointer-events-none" />

            <div className={`w-full max-w-[520px] transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="/logo-cube.png"
                        alt="XETA"
                        className="w-12 h-12 object-contain mb-4"
                    />
                    <div className="text-sm text-gray-600">
                        You are signing up for XetaPay
                    </div>
                </div>

                {/* Sign Up Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-xl p-8 sm:p-10 border border-white/20 shadow-2xl relative">
                    {showEmailForm ? (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold">Create account</h1>
                                <button
                                    onClick={() => {
                                        setShowEmailForm(false);
                                        setError('');
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleEmailSignUp} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 6 characters"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating account...' : 'Create account'}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account? <a href="#/login" className="text-blue-600 hover:underline">Sign in</a>
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-center mb-6">Create your account</h1>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Sign up buttons */}
                            <div className="space-y-4">
                                <button
                                    onClick={handleTwitterSignUp}
                                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors"
                                >
                                    <TwitterIcon className="w-5 h-5" />
                                    Sign up with X
                                </button>

                                <div className="flex items-center">
                                    <div className="flex-1 border-t border-gray-300"></div>
                                    <span className="px-4 text-sm text-gray-500">or</span>
                                    <div className="flex-1 border-t border-gray-300"></div>
                                </div>

                                <button
                                    onClick={() => setShowEmailForm(true)}
                                    className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors"
                                >
                                    <EmailIcon className="w-5 h-5" />
                                    Sign up with email
                                </button>

                                <button
                                    onClick={handleGoogleSignUp}
                                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors"
                                >
                                    <GoogleIcon className="w-5 h-5" />
                                    Sign up with Google
                                </button>

                                <button
                                    onClick={handleAppleSignUp}
                                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors"
                                >
                                    <AppleIcon className="w-5 h-5" />
                                    Sign up with Apple
                                </button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account? <a href="#/login" className="text-blue-600 hover:underline">Sign in</a>
                                </p>
                            </div>

                            <div className="mt-6 text-center text-xs text-gray-500">
                                <p>
                                    By continuing, you agree to XetaPay's <button type="button" className="underline">Terms of Service</button> and <button type="button" className="underline">Privacy Policy</button>.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer specs */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">XETAPAY_CORE_ACCESS_V9.2</p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
