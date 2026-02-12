'use client';

import React from 'react';

interface HoloButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export default function HoloButton({ children, variant = 'primary', className = '', style, ...props }: HoloButtonProps) {
    let baseColor = 'rgba(59, 130, 246, 0.5)'; // Blue
    let hoverColor = 'rgba(59, 130, 246, 0.8)';
    let glowColor = '#60a5fa';

    if (variant === 'secondary') {
        baseColor = 'rgba(255, 255, 255, 0.1)';
        hoverColor = 'rgba(255, 255, 255, 0.2)';
        glowColor = '#ffffff';
    } else if (variant === 'danger') {
        baseColor = 'rgba(239, 68, 68, 0.5)';
        hoverColor = 'rgba(239, 68, 68, 0.8)';
        glowColor = '#f87171';
    }

    return (
        <button
            {...props}
            className={className}
            style={{
                background: baseColor,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                color: 'white',
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
                boxShadow: `0 0 15px ${baseColor}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = hoverColor;
                e.currentTarget.style.boxShadow = `0 0 25px ${baseColor}, 0 0 5px ${glowColor}`;
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = baseColor;
                e.currentTarget.style.boxShadow = `0 0 15px ${baseColor}`;
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            {children}
            {/* Glossy sheen overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '50%',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
                pointerEvents: 'none'
            }} />
        </button>
    );
}
