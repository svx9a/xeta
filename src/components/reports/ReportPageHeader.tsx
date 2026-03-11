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
        <div className="relative overflow-hidden bg-[var(--bg-secondary)] rounded-[3rem] p-8 md:p-12 text-[var(--text-primary)] shadow-2xl border border-[var(--border-subtle)] group backdrop-blur-3xl">
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[var(--primary-azure)]/5 rounded-full -mr-32 -mt-32 blur-[150px] group-hover:scale-110 transition-all duration-1000 pointer-events-none" />
            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-10 mb-12">
                    <div className="w-24 h-24 bg-[var(--bg-primary)] rounded-[2.5rem] border border-[var(--border-subtle)] backdrop-blur-3xl shadow-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-700">
                        <Icon className="w-12 h-12 text-[var(--primary-azure)]" />
                    </div>
                    <div>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-[var(--text-primary)] uppercase leading-none break-words italic">
                            {title} <span className="text-[var(--primary-azure)]">{subtitle}</span>
                        </h1>
                        <p className="text-[10px] md:text-[12px] font-black text-[var(--primary-azure)] uppercase tracking-widest mt-6 border-l-4 border-[var(--primary-azure)]/20 pl-6 h-4 leading-none italic">
                            {version}
                        </p>
                    </div>
                </div>
                <div className="text-xl md:text-2xl text-[var(--text-secondary)]/40 max-w-3xl font-black leading-relaxed border-l-4 border-[var(--primary-azure)]/20 pl-8 uppercase tracking-tight italic">
                    {description}
                </div>
            </div>
        </div>
    );
};
