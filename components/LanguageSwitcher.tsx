'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import '../i18n';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ru' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '0.4rem 0.8rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(5px)'
            }}
        >
            <span style={{ fontSize: '1.2em' }}>{i18n.language === 'en' ? '🇺🇸' : '🇷🇺'}</span>
            <span>{i18n.language === 'en' ? 'EN' : 'RU'}</span>
        </button>
    );
}
