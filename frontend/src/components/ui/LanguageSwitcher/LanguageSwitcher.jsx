'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'hr', name: 'Haryanvi', nativeName: 'हरियाणवी' },
];

export default function LanguageSwitcher({ variant = 'default' }) {
    const { i18n, t } = useTranslation('common');
    const [mounted, setMounted] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        setCurrentLang(i18n.language);
    }, [i18n.language]);

    if (!mounted) {
        return null; // or a loading skeleton/default state
    }

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('i18nextLng', langCode);
        setCurrentLang(langCode);
        setIsOpen(false);
    };

    const currentLanguage = LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0];

    return (
        <div className={`${styles.switcher} ${styles[variant]}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.mainButton}
                aria-label={t('common.changeLanguage')}
                aria-expanded={isOpen}
            >
                <span className={styles.langIcon}>🌐</span>
                <span className={styles.langCode}>{currentLanguage.nativeName}</span>
                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`${styles.langOption} ${lang.code === currentLang ? styles.active : ''}`}
                        >
                            <span className={styles.langName}>{lang.nativeName}</span>
                            <span className={styles.langEnglish}>{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {isOpen && (
                <div
                    className={styles.backdrop}
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}
