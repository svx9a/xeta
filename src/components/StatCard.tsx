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
            className="bg-black/40 rounded-md p-8 border border-white/12 relative overflow-hidden group hover:border-white/20 transition-all duration-700 subtle-glow hover:glow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`${t(titleKey)}: ${amount} with ${paymentCount} transactions`}
            data-ai-field="stat-card-metric"
        >
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-3 bg-white/60 rounded-full" />
                        <h3 className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">{t(titleKey)}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all duration-500 border border-white/12 shadow-sm">
                        <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="space-y-3">
                        <p className="text-3xl font-black text-white tracking-tight leading-none">
                            {amount.replace('฿', '')}<span className="text-[10px] text-white/50 ml-2 font-bold uppercase tracking-widest">THB</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-[1px] bg-white/10" />
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">
                                {paymentCount} TRANSACTIONS
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight ${isUp ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-red-400 bg-red-500/10 border border-red-500/20'}`}>
                        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {trendValue}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;