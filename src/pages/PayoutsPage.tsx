import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import SettlementManager from '../components/SettlementManager';

const PayoutsPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="animate-fadeIn w-full space-y-16 pb-32 px-6">
            <div className="pb-12 border-b border-slate-200">
                <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-slate-800 uppercase leading-none">
                    Settlements
                </h1>
                <p className="text-[12px] font-black text-blue-600/80 uppercase tracking-[0.5em] mt-6 border-l-4 border-blue-600/20 pl-6 h-4">OPERATIONAL DISBURSEMENTS // NODE v9.2</p>
            </div>

            <SettlementManager />
        </div>
    );
};

export default PayoutsPage;
