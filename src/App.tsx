import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PaymentsProvider } from './contexts/PaymentsContext';

// Pages
import HomePage from './pages/HomePage';
import PaymentsPage from './pages/PaymentsPage';
import PayoutsPage from './pages/PayoutsPage';
import ReportsPage from './pages/ReportsPage';
import QuotationPage from './pages/QuotationPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import DeveloperPage from './pages/DeveloperPage';
import IntegrationsPage from './pages/IntegrationsPage';
import ConsumerPaymentPage from './pages/ConsumerPaymentPage';
import LoginPage from './pages/LoginPage';
import LatexCompilerPage from './pages/LatexCompilerPage';
import AIVideoDirectoryPage from './pages/AIVideoDirectoryPage';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, isLoading } = useAuth();
    
    if (isLoading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
        </div>
    );
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
};

interface InjectedProps {
    isProduction: boolean;
    setIsProduction: (p: boolean) => void;
    theme: string;
    setTheme: (t: string) => void;
}

const DashboardLayout: React.FC<{ 
    children: React.ReactElement;
    theme: string;
    setTheme: (t: string) => void;
    isProduction: boolean;
    setIsProduction: (p: boolean) => void;
}> = ({ children, theme, setTheme, isProduction, setIsProduction }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const clonedChildren = React.cloneElement(children, {
        isProduction,
        setIsProduction,
        theme,
        setTheme
    } as InjectedProps);

    return (
        <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-background text-text-primary`}>
            <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all lg:pl-64">
                <Header 
                    onMenuClick={() => setSidebarOpen(true)} 
                    theme={theme} 
                    setTheme={setTheme}
                    isProduction={isProduction}
                    setCurrentPage={() => {}} // Legacy prop support
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8 animate-fadeIn">
                    {clonedChildren}
                </main>
            </div>
        </div>
    );
};

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('xeta_theme') || 'dark');
    const [isProduction, setIsProduction] = useState(localStorage.getItem('xeta_mode') === 'production');
    const latexEnabled = import.meta.env.DEV || (import.meta as any)?.env?.VITE_ENABLE_LATEX_COMPILER === 'true';

    useEffect(() => {
        localStorage.setItem('xeta_theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('xeta_mode', isProduction ? 'production' : 'sandbox');
    }, [isProduction]);

    const wrap = (comp: React.ReactElement) => (
        <ProtectedRoute>
            <DashboardLayout 
                theme={theme} 
                setTheme={setTheme} 
                isProduction={isProduction} 
                setIsProduction={setIsProduction}
            >
                {comp}
            </DashboardLayout>
        </ProtectedRoute>
    );

    return (
        <LanguageProvider>
            <AuthProvider>
                <PaymentsProvider>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/pay/:id" element={<ConsumerPaymentPage />} />

                            <Route path="/" element={wrap(<HomePage />)} />
                            <Route path="/payments" element={wrap(<PaymentsPage />)} />
                            <Route path="/payouts" element={wrap(<PayoutsPage />)} />
                            <Route path="/reports" element={wrap(<ReportsPage />)} />
                            <Route path="/quotation" element={wrap(<QuotationPage />)} />
                            <Route path="/account" element={wrap(<AccountPage />)} />
                            <Route path="/settings" element={wrap(<SettingsPage />)} />
                            <Route path="/developer" element={wrap(<DeveloperPage 
                                isProduction={isProduction} 
                                setIsProduction={setIsProduction} 
                            />)} />
                            {latexEnabled ? <Route path="/latex" element={wrap(<LatexCompilerPage />)} /> : null}
                            <Route path="/integrations" element={wrap(<IntegrationsPage />)} />
                            <Route path="/ai-video" element={wrap(<AIVideoDirectoryPage />)} />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>
                </PaymentsProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;
