import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    padding?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'p-6', ...props }) => {
    return (
        <div
            {...props}
            className={`bg-card-bg border border-border-color/60 rounded-2xl shadow-sm ${padding} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;