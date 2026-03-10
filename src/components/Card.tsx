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
            className={`bg-black/40 border border-white/12 rounded-2xl subtle-glow ${padding} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;