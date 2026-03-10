import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
    titleKey: 'todaySoFar' | 'yesterday' | 'thisMonthSoFar' | 'lastMonth';
    amount: string;
    paymentCount: number;
    trend?: 'up' | 'down';
    trendValue?: string;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ titleKey, amount, paymentCount, trend = 'up', trendValue = '+12.3%', onClick }) => {
    const { t } = useTranslation();
    const isUp = trend === 'up';

    const handleClick = () => {
        if (onClick) onClick();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            className="bg-white rounded-2xl p-8 border border-slate-100 relative overflow-hidden group hover:border-[#3B82F6] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer focus:outline-none"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`${t(titleKey)}: ${amount} with ${paymentCount} transactions`}
            data-ai-field="stat-card-metric"
        >
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-3 bg-[#3B82F6] rounded-full" />
                        <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{t(titleKey)}</h3>
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-slate-900 tracking-tight leading-none">
                            {amount.replace('฿', '')}<span className="text-[10px] text-slate-400 ml-2 font-bold uppercase tracking-widest">THB</span>
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            {paymentCount} TRANSACTIONS
                        </p>
                    </div>

                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {trendValue}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;