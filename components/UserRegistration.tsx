"use client";

import { useState } from 'react';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';
import styles from '../app/user/user.module.css';

interface UserRegistrationProps {
    onComplete: (user: any) => void;
}

export default function UserRegistration({ onComplete }: UserRegistrationProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Registration failed');
            }
            const user = await res.json();
            localStorage.setItem('userId', user.id.toString());
            localStorage.setItem('userEmail', user.email);
            onComplete(user);
        } catch (error: any) {
            console.error(error);
            alert(`Error registering: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.glassCard}>
            <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Join the Team</h2>
                <p className={styles.formSubtitle}>Create your profile to start the technical assessment</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>Full Name</label>
                    <div className={styles.inputField}>
                        <input
                            required
                            type="text"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="Alex Johnson"
                        />
                        <User size={18} />
                    </div>
                </div>
                <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>Email Address</label>
                    <div className={styles.inputField}>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="alex@company.com"
                        />
                        <Mail size={18} />
                    </div>
                </div>

                <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>Phone Number</label>
                    <div className={styles.inputField}>
                        <input
                            required
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                        />
                        <Phone size={18} />
                    </div>
                </div>

                <button
                    type="submit"
                    className={styles.actionButton}
                    disabled={loading}
                >
                    {loading ? (
                        'Creating Profile...'
                    ) : (
                        <>
                            Get Started <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <p className={styles.footerText}>
                Your data is secure and will only be used for the recruitment process.
            </p>
        </div>
    );
}
