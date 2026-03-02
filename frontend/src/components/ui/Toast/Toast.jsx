'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Simple event bus for toasts
const listeners = new Set();
let toastIdCounter = 0;
export const toast = {
    success: (message) => notify('success', message),
    error: (message) => notify('error', message),
    info: (message) => notify('info', message),
};

export const showToast = (message, type = 'info') => notify(type, message);

const notify = (type, message) => {
    listeners.forEach(listener => listener({ type, message, id: ++toastIdCounter }));
};

export function ToastContainer() {
    const [toasts, setToasts] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleToast = (toast) => {
            setToasts(prev => [...prev, toast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, 3000); // Auto dismiss after 3s
        };

        listeners.add(handleToast);
        return () => listeners.delete(handleToast);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-5 fade-in duration-300
                        ${t.type === 'success' ? 'bg-white border-green-200 text-green-800' : ''}
                        ${t.type === 'error' ? 'bg-white border-red-200 text-red-800' : ''}
                        ${t.type === 'info' ? 'bg-gray-900 border-gray-800 text-white' : ''}
                    `}
                >
                    {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                    {t.type === 'info' && <Info className="w-5 h-5" />}

                    <p className="text-sm font-medium flex-1">{t.message}</p>

                    <button
                        onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
                        className="p-1 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 opacity-50" />
                    </button>
                </div>
            ))}
        </div>,
        document.body
    );
}
