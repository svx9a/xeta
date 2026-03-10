import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Page } from './types';
import { useTranslation } from './contexts/LanguageContext';
import appBridge from './services/appBridge';

// Lazy load all pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const PaymentsPage = React.lazy(() => import('./pages/PaymentsPage'));
const PayoutsPage = React.lazy(() => import('./pages/PayoutsPage'));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'));
const PluginsPage = React.lazy(() => import('./pages/PluginsPage'));
const IntegrationsPage = React.lazy(() => import('./pages/IntegrationsPage'));
const DeveloperPage = React.lazy(() => import('./pages/DeveloperPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const AccountPage = React.lazy(() => import('./pages/AccountPage'));
const RedirectPage = React.lazy(() => import('./pages/RedirectPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const ShippingAnalytics = React.lazy(() => import('./pages/ShippingAnalytics'));
const RoutingControlPanel = React.lazy(() => import('./components/RoutingControlPanel'));

// Loading component for Suspense fallback
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-slate-600">Loading...</span>
        </div>
    </div>
);

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isProduction, setIsProduction] = useState(false);
    const { currentLang } = useTranslation();

    useEffect(() => {
        document.documentElement.lang = currentLang;
    }, [currentLang]);

    useEffect(() => {
        const getPageFromHash = (): Page => {
            const hash = typeof window !== 'undefined' ? window.location.hash : '';
            const clean = hash.replace(/^#\/?/, '').split('?')[0];
            const pages: Page[] = ['home', 'payments', 'payouts', 'plugins', 'integrations', 'developer', 'reports', 'settings', 'account', 'redirect', 'routing', 'login', 'checkout', 'success', 'shipping_analytics'];
            return (pages.includes(clean as Page) ? (clean as Page) : 'login');
        };
        setCurrentPage(getPageFromHash());
        const unsubscribe = appBridge.onRouteChange(() => {
            setCurrentPage(getPageFromHash());
        });
        return unsubscribe;
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case 'home': return <HomePage />;
            case 'login': return <LoginPage />;
            case 'payments': return <PaymentsPage />;
            case 'payouts': return <PayoutsPage />;
            case 'plugins': return <PluginsPage setCurrentPage={setCurrentPage} />;
            case 'integrations': return <IntegrationsPage />;
            case 'developer': return <DeveloperPage isProduction={isProduction} setIsProduction={setIsProduction} />;
            case 'reports': return <ReportsPage />;
            case 'settings': return <SettingsPage />;
            case 'redirect': return <RedirectPage />;
            case 'account': return <AccountPage />;
            case 'routing': return <RoutingControlPanel />;
            case 'checkout': return <CheckoutPage />;
            case 'shipping_analytics': return <ShippingAnalytics />;
            default: return <HomePage />;
        }
    };

    if (currentPage === 'login') {
        return <LoginPage />;
    }

    return (
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen flex overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-emerald-500/5 rounded-full blur-3xl" />
            </div>

            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />

            <div className="flex-1 transition-all duration-300 ease-out flex flex-col min-h-screen relative">
                <Header
                    onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
                    isProduction={isProduction}
                    setCurrentPage={setCurrentPage}
                />

                <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 w-full max-w-7xl mx-auto relative z-10">
                    <div className="animate-fadeIn">
                        <Suspense fallback={<PageLoader />}>
                            {renderPage()}
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
