'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string;
}

export default function Modal({ isOpen, onClose, title, children, footer, width = '500px' }: ModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            pointerEvents: isAnimating ? 'auto' : 'none',
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    opacity: isAnimating ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                }}
            />

            {/* Modal Content */}
            <div style={{
                position: 'relative',
                width: '90%',
                maxWidth: width,
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 0 50px rgba(56, 189, 248, 0.2), 0 0 20px rgba(56, 189, 248, 0.1)', // Stronger Cosmic glow
                opacity: isAnimating ? 1 : 0,
                transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '85vh',
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(to right, rgba(56, 189, 248, 0.05), transparent)'
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
                    }}>
                        {title}
                    </h3>
                    {onClose && (
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                display: 'flex',
                                borderRadius: '50%',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.transform = 'rotate(90deg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#94a3b8';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.transform = 'rotate(0deg)';
                            }}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div style={{
                    padding: '2rem',
                    overflowY: 'auto',
                    color: '#e2e8f0',
                    lineHeight: 1.7,
                    fontSize: '1.05rem'
                }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{
                        padding: '1.5rem 2rem',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
