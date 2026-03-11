import React from 'react';
import Card from '../Card';
import { LucideIcon } from 'lucide-react';

interface ReportCardProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    children: React.ReactNode;
    className?: string;
    actionButton?: React.ReactNode;
}

export const ReportCard: React.FC<ReportCardProps> = ({ 
    title, 
    subtitle, 
    icon: Icon, 
    children, 
    className = "",
    actionButton
}) => {
    return (
        <Card padding="p-8 md:p-12" className={`bg-[var(--bg-secondary)] rounded-[3rem] border border-[var(--border-subtle)] relative overflow-hidden transition-all group shadow-2xl backdrop-blur-3xl ${className}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-[var(--border-subtle)] pb-10">
                <div className="flex items-center gap-8">
                    <div className="p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] shadow-xl group-hover:rotate-6 transition-transform duration-500">
                        <Icon className="w-10 h-10 text-[var(--primary-azure)]" />
                    </div>
                    <div>
                        <h3 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none mb-3 italic">{title}</h3>
                        {subtitle && <p className="text-[11px] font-black text-[var(--primary-azure)]/40 uppercase tracking-[0.4em] leading-none italic">{subtitle}</p>}
                    </div>
                </div>
                {actionButton}
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </Card>
    );
};
