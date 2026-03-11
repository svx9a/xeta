import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    status?: string;
    statusColor?: 'emerald' | 'amber' | 'rose';
    actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon: Icon, status, statusColor = 'emerald', actions }) => {
    const statusColors = {
        emerald: { dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        amber: { dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
        rose: { dot: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    };
    const sc = statusColors[statusColor];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-4">
                {Icon && (
                    <div className="w-11 h-11 bg-[var(--primary-azure)]/10 rounded-xl border border-[var(--primary-azure)]/20 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[var(--primary-azure)]" />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight leading-none">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.2em] mt-1.5">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                {status && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 ${sc.bg} rounded-lg border ${sc.border}`}>
                        <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                        <span className={`text-[10px] font-bold ${sc.text} uppercase tracking-wider`}>{status}</span>
                    </div>
                )}
                {actions}
            </div>
        </div>
    );
};

export default PageHeader;
