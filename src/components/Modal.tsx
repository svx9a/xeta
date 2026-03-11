import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
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

    return (
        <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-card-bg rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-transform duration-300 scale-100 border border-border-color/60 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-8 py-5 border-b border-border-color/60 flex justify-between items-center bg-sidebar-bg/30">
                    <h2 className="text-lg font-bold text-text-primary tracking-tight">{title}</h2>
                    <button onClick={onClose} className="text-text-secondary w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">&times;</button>
                </div>
                <div className="p-8">
                    {children}
                </div>
                {footer && (
                    <div className="px-8 py-5 bg-sidebar-bg/30 border-t border-border-color/60 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;