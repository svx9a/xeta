import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
    titleKey: 'todaySoFar' | 'yesterday' | 'thisMonthSoFar' | 'lastMonth';
    amount: string;
    paymentCount: number;
    trend?: 'up' | 'down';
    trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ titleKey, amount, paymentCount, trend = 'up', trendValue = '+12.3%' }) => {
    const { t } = useTranslation();
    const isUp = trend === 'up';

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 relative overflow-hidden group hover:border-blue-600/30 transition-all duration-700 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.1)]">
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-3 bg-blue-600 rounded-full" />
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{t(titleKey)}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 border border-slate-100 shadow-sm">
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="space-y-3">
                        <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                            {amount.replace('฿', '')}<span className="text-[10px] text-slate-300 ml-2 font-bold uppercase tracking-widest">THB</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-[1px] bg-slate-100" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                {paymentCount} TRANSACTIONS
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight ${isUp ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-red-500 bg-red-50 border border-red-100'}`}>
                        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {trendValue}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;