"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from '../user/user.module.css';

// Custom SVG Icons for a premium look
const ShieldSVG = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 7V12C3 17.5228 7.47715 22 12 22C16.5228 22 21 17.5228 21 12V7L12 2Z"
            stroke="url(#blue-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V16" stroke="url(#blue-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12H16" stroke="url(#blue-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="blue-gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
    </svg>
);

const CameraSVG = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="7" width="20" height="14" rx="3" stroke="#C084FC" strokeWidth="1.5" />
        <path d="M7 7L9.17157 4.82843C9.92172 4.07828 10.9391 3.65685 12 3.65685V3.65685C13.0609 3.65685 14.0783 4.07828 14.8284 4.82843L17 7" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="14" r="3" stroke="#C084FC" strokeWidth="1.5" />
        <path d="M16 10H16.01" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
        {/* Glow effect */}
        <circle cx="12" cy="14" r="7" stroke="#C084FC" strokeOpacity="0.2" strokeWidth="4" />
    </svg>
);

const DocSVG = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2V8H20" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 13H16" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 17H14" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 9H11" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function TermsPage() {
    return (
        <div className={styles.container} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '2rem' }}>

            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem',
                    filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
                }}>
                    <ShieldSVG />
                </div>
                <h1 className="cosmic-text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                    Terms & Policy
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    Ensuring Fair & Secure Assessments
                </p>
            </div>

            {/* Main Content Card */}
            <div className={styles.glassCard} style={{ maxWidth: '900px', width: '100%', padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>

                {/* Navigation Bar */}
                <div style={{
                    padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Last Updated: Jan 2026</div>
                    <Link href="/user" className={styles.button} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                </div>

                <div style={{ padding: '3rem', display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>

                    {/* Section 1: Camera */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        <div style={{
                            minWidth: '80px', height: '80px', borderRadius: '20px',
                            background: 'rgba(192, 132, 252, 0.1)', border: '1px solid rgba(192, 132, 252, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(192, 132, 252, 0.15)'
                        }}>
                            <CameraSVG />
                        </div>
                        <div>
                            <h2 style={{ color: '#f8fafc', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>Camera Usage & Privacy</h2>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '1rem' }}>
                                To maintain the highest standards of academic integrity, we require continuous webcam access during the assessment.
                                <span style={{ color: '#c084fc', display: 'block', marginTop: '0.5rem', fontWeight: 500 }}>
                                    We will have access to your camera for academic purposes only.
                                </span>
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '0.9rem' }}>🔒 Secure Storage</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Encrypted recordings accessible only to staff.</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '0.9rem' }}>🤖 AI Proctoring</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}> Automated detection of suspicious behavior.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

                    {/* Section 2: Integrity */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        <div style={{
                            minWidth: '80px', height: '80px', borderRadius: '20px',
                            background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(74, 222, 128, 0.15)'
                        }}>
                            <DocSVG />
                        </div>
                        <div>
                            <h2 style={{ color: '#f8fafc', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>Academic Integrity Policy</h2>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '1rem' }}>
                                Candidates must complete the assessment independently. The use of unauthorized AI tools, external help, or plagiarism will result in immediate disqualification.
                            </p>
                            <ul style={{ color: '#94a3b8', lineHeight: '1.8', listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></span>
                                    Code solutions must be original.
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></span>
                                    No screensharing or secondary devices.
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></span>
                                    Data is retained for 12 months for audit purposes.
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div style={{
                    background: 'rgba(59, 130, 246, 0.05)', padding: '2rem', textAlign: 'center',
                    borderTop: '1px solid rgba(59, 130, 246, 0.1)'
                }}>
                    <p style={{ color: '#60a5fa', fontSize: '0.95rem', fontWeight: 500 }}>
                        By beginning the assessment, you explicitly consent to these terms.
                    </p>
                </div>
            </div>
        </div>
    );
}
