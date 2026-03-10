import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ReportPageHeaderProps {
    title: string;
    subtitle: string;
    description: React.ReactNode;
    icon: LucideIcon;
    version?: string;
}

export const ReportPageHeader: React.FC<ReportPageHeaderProps> = ({ 
    title, 
    subtitle, 
    description, 
    icon: Icon,
    version = "QUANTUM_DATA_ENGINE_V9.0"
}) => {
    return (
        <div className="relative overflow-hidden bg-white rounded-[3rem] p-8 md:p-12 text-slate-800 shadow-2xl border border-slate-200 group">
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-[150px] group-hover:scale-110 transition-all duration-1000 pointer-events-none" />
            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-10 mb-12">
                    <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] border border-blue-600/20 backdrop-blur-3xl shadow-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-700">
                        <Icon className="w-12 h-12 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-800 uppercase leading-none break-words">
                            {title} <span className="text-blue-600">{subtitle}</span>
                        </h1>
                        <p className="text-[10px] md:text-[12px] font-black text-blue-600/80 uppercase tracking-widest mt-6 border-l-4 border-blue-600/20 pl-6 h-4 leading-none">
                            {version}
                        </p>
                    </div>
                </div>
                <div className="text-xl md:text-2xl text-slate-800/40 max-w-3xl font-black leading-relaxed border-l-4 border-blue-600/20 pl-8 uppercase tracking-tight">
                    {description}
                </div>
            </div>
        </div>
    );
};
