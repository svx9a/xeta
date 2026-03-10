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
            className={`bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl ${padding} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;