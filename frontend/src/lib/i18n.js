import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enCommon from '../../public/locales/en/common.json';
import hiCommon from '../../public/locales/hi/common.json';
import taCommon from '../../public/locales/ta/common.json';
import teCommon from '../../public/locales/te/common.json';
import knCommon from '../../public/locales/kn/common.json';
import bnCommon from '../../public/locales/bn/common.json';
import mrCommon from '../../public/locales/mr/common.json';
import guCommon from '../../public/locales/gu/common.json';
import paCommon from '../../public/locales/pa/common.json';
import hrCommon from '../../public/locales/hr/common.json';

const resources = {
    en: { common: enCommon },
    hi: { common: hiCommon },
    ta: { common: taCommon },
    te: { common: teCommon },
    kn: { common: knCommon },
    bn: { common: bnCommon },
    mr: { common: mrCommon },
    gu: { common: guCommon },
    pa: { common: paCommon },
    hr: { common: hrCommon },
};

// Always initialise with lng='en' so that both server and client produce
// identical HTML on the first render, preventing hydration mismatches.
// After hydration, we read the user's preferred language from localStorage
// and switch to it, triggering a client-only re-render.
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: ['common'],

        interpolation: {
            escapeValue: false, // React already escapes
        },
    });

// Post-hydration language detection (client only)
if (typeof window !== 'undefined') {
    // Use requestIdleCallback (or setTimeout fallback) so this runs
    // after React has finished hydrating the page.
    const detect = () => {
        const saved = localStorage.getItem('i18nextLng');
        if (saved && saved !== 'en' && resources[saved]) {
            i18n.changeLanguage(saved);
        }
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(detect);
    } else {
        setTimeout(detect, 0);
    }
}

export default i18n;
