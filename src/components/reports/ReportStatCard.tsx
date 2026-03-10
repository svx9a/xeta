import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ReportStatCardProps {
    title: string;
    value: string;
    subValue?: string;
    icon: LucideIcon;
    trend?: number;
    description?: string;
    className?: string;
}

export const ReportStatCard: React.FC<ReportStatCardProps> = ({ 
    title, 
    value, 
    subValue, 
    icon: Icon, 
    trend,
    description,
    className = ""
}) => {
    return (
        <div className={`bg-white/60 text-slate-800 rounded-[3rem] border border-slate-200 shadow-2xl backdrop-blur-3xl relative overflow-hidden group p-8 md:p-12 ${className}`}>
            <div className="flex items-center gap-6 mb-16 border-b border-slate-200 pb-10">
                <Icon className="w-8 h-8 text-blue-600 animate-pulse" />
                <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-blue-600/80 leading-none">{title}</h4>
            </div>

            <div className="space-y-16 relative z-10">
                <div className="pb-12 border-b border-slate-200 group/row transition-all hover:translate-x-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-800/20 mb-6 transition-colors group-hover/row:text-blue-600">{description}</p>
                    <p className="text-4xl md:text-6xl font-black tracking-tighter text-slate-800 leading-none break-words">
                        {value} 
                        {subValue && <span className="text-sm opacity-20 uppercase ml-4 text-blue-600 tracking-[0.6em]">{subValue}</span>}
                    </p>
                    {trend !== undefined && (
                        <div className={`mt-4 flex items-center gap-2 text-sm font-bold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            <span>{trend >= 0 ? '+' : ''}{trend}%</span>
                            <span className="text-slate-400 font-normal">vs last period</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
