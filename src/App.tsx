import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PaymentsPage from './pages/PaymentsPage';
import PayoutsPage from './pages/PayoutsPage';
import ReportsPage from './pages/ReportsPage';
import PluginsPage from './pages/PluginsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import DeveloperPage from './pages/DeveloperPage';
import SettingsPage from './pages/SettingsPage';
import AccountPage from './pages/AccountPage';
import { Page } from './types';
import { useTranslation } from './contexts/LanguageContext';
import PDPABanner from './components/PDPABanner';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isProduction, setIsProduction] = useState(false);
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) return savedTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });
    const { currentLang } = useTranslation();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.lang = currentLang;
    }, [currentLang]);


    const renderPage = () => {
        switch (currentPage) {
            case 'home': return <HomePage />;
            case 'payments': return <PaymentsPage />;
            case 'payouts': return <PayoutsPage />;
            case 'plugins': return <PluginsPage setCurrentPage={setCurrentPage} />;
            case 'integrations': return <IntegrationsPage />;
            case 'developer': return <DeveloperPage isProduction={isProduction} setIsProduction={setIsProduction} />;
            case 'reports': return <ReportsPage />;
            case 'settings': return <SettingsPage />;
            case 'account': return <AccountPage />;
            default: return <HomePage />;
        }
    };

    return (
        <div className="text-text-primary bg-background min-h-screen flex">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
            <div className="flex-1 lg:ml-64 transition-all duration-300 ease-in-out">
                <Header 
                    onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
                    theme={theme} 
                    setTheme={setTheme} 
                    isProduction={isProduction}
                    setCurrentPage={setCurrentPage} 
                />
                <main className="p-4 sm:p-7">
                    {renderPage()}
                </main>
            </div>
            <PDPABanner />
        </div>
    );
};

export default App;