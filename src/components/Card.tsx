import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'p-6' }) => {
    return (
        <div className={`bg-card-bg border border-border-color/60 rounded-2xl shadow-sm ${padding} ${className}`}>
            {children}
        </div>
    );
};

export default Card;