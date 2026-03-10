import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'medium' }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        small: 'max-w-md',
        medium: 'max-w-xl',
        large: 'max-w-5xl'
    };

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[200] flex justify-center items-center p-4 sm:p-20 transition-opacity duration-500 animate-fadeIn overflow-y-auto"
            onClick={onClose}
        >
            <div
                className={`${sizeClasses[size]} w-full mx-auto my-auto bg-[var(--bg-primary)] rounded-[48px] shadow-[0_40px_100px_rgba(15,23,42,0.15)] transform transition-all duration-500 scale-100 border border-[var(--border-subtle)] overflow-hidden relative group mercury-border-glow backdrop-blur-2xl`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--primary-azure)]/40 to-transparent" />

                <div className="px-12 py-10 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-secondary)]/50">
                    <div className="text-[var(--text-primary)]">
                        {typeof title === 'string' ? (
                            <div className="flex items-center gap-6">
                                <div className="w-1.5 h-6 bg-[var(--primary-azure)]/60 rounded-full" />
                                <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-[var(--text-primary)]">{title}</h2>
                            </div>
                        ) : title}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-secondary)]/30 w-14 h-14 flex items-center justify-center rounded-2xl hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all transform hover:rotate-90 duration-500 text-3xl font-light border border-[var(--border-subtle)]"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-12 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {footer && (
                    <div className="px-12 py-10 bg-[var(--bg-secondary)]/50 border-t border-[var(--border-subtle)] flex justify-end gap-6 relative z-10">
                        {footer}
                    </div>
                )}

                {/* Cyber Accents */}
                <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.02]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[var(--primary-azure)]/5 rounded-full blur-[100px] pointer-events-none" />
            </div>
        </div>
    );
};

export default Modal;