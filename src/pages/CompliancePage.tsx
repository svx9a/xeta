import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import CompleteVerificationDashboard from '../components/finance/CompleteVerificationDashboard';

const CompliancePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-black tracking-tight text-text-primary uppercase">{t('compliance')}</h1>
                    <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mt-1">Multi-Step Verification & Audit Tracking</p>
                </div>
            </div>

            <div className="animate-fadeIn">
                <CompleteVerificationDashboard />
            </div>
        </div>
    );
};

export default CompliancePage;
