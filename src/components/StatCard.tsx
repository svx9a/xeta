import React from 'react';
import Card from './Card';
import { useTranslation } from '../contexts/LanguageContext';

interface StatCardProps {
    titleKey: 'todaySoFar' | 'yesterday' | 'thisMonthSoFar' | 'lastMonth';
    amount: string;
    paymentCount: number;
}

const StatCard: React.FC<StatCardProps> = ({ titleKey, amount, paymentCount }) => {
    const { t } = useTranslation();

    return (
        <Card padding="p-6" className="relative overflow-hidden group hover:shadow-satin transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <h3 className="text-text-secondary text-xs font-bold uppercase tracking-widest">{t(titleKey)}</h3>
            <p className="text-3xl font-extrabold text-text-primary mt-3 tracking-tight">{amount}</p>
            <div className="flex items-center mt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                <span className="text-xs font-bold text-text-secondary uppercase tracking-tighter">{paymentCount} {t('payments')}</span>
            </div>
        </Card>
    );
};

export default StatCard;