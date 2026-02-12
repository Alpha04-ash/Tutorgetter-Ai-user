'use client';

import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export default function GlassCard({ children, className = '', style = {}, onClick }: GlassCardProps) {
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                borderRadius: '16px',
                padding: '2rem',
                color: '#f8fafc',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: onClick ? 'pointer' : 'default', // Add pointer cursor if clickable
                ...style
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = (style.transform || '') + ' translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(59, 130, 246, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = style.transform || 'none';
                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
        >
            {children}
        </div>
    );
}
