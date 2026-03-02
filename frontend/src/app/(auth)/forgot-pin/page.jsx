'use client';

import { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { forgotPinAsync } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { showToast } from '@/components/ui/Toast/Toast';
import Link from 'next/link';

export default function ForgotPinPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>}>
            <ForgotPinContent />
        </Suspense>
    );
}

function ForgotPinContent() {
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isLoading } = useSelector((state) => state.auth);

    const [userType, setUserType] = useState(searchParams.get('type') || 'farmer');
    const [mobile, setMobile] = useState('');
    const [aadharLast4, setAadharLast4] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [success, setSuccess] = useState(false);

    const handleResetPin = async (e) => {
        e.preventDefault();

        if (mobile.length !== 10) {
            showToast(t('auth.login.enterValidMobile'), 'error');
            return;
        }
        if (aadharLast4.length !== 4) {
            showToast(t('auth.forgotPin.enterLast4'), 'error');
            return;
        }
        if (newPin.length !== 4) {
            showToast(t('auth.login.enterValidPin'), 'error');
            return;
        }
        if (newPin !== confirmPin) {
            showToast(t('auth.errors.pinMismatch'), 'error');
            return;
        }

        try {
            await dispatch(forgotPinAsync({ mobile, aadharLast4, newPin, userType })).unwrap();
            setSuccess(true);
            showToast(t('auth.forgotPin.success'), 'success');
        } catch (err) {
            showToast(err || t('auth.forgotPin.failed'), 'error');
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.forgotPin.successTitle')}</h1>
                    <p className="text-gray-500 mb-6">{t('auth.forgotPin.successMessage')}</p>
                    <Button onClick={() => router.push('/login')} fullWidth>
                        {t('auth.forgotPin.goToLogin')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-3">🔑</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.forgotPin.title')}</h1>
                    <p className="text-gray-500">{t('auth.forgotPin.subtitle')}</p>
                </div>

                {/* Role Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${userType === 'farmer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
                        onClick={() => setUserType('farmer')}>
                        🧑‍🌾 {t('auth.login.farmer')}
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${userType === 'buyer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
                        onClick={() => setUserType('buyer')}>
                        🛒 {t('auth.login.buyer')}
                    </button>
                </div>

                <form onSubmit={handleResetPin} className="space-y-4">
                    <Input
                        label={t('auth.forgotPin.mobileLabel')}
                        placeholder={t('auth.farmer.mobilePlaceholder')}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        type="tel" inputMode="numeric" prefix="+91" required
                    />

                    <Input
                        label={t('auth.forgotPin.aadharLast4Label')}
                        placeholder={t('auth.forgotPin.aadharLast4Placeholder')}
                        value={aadharLast4}
                        onChange={(e) => setAadharLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        type="tel" inputMode="numeric" maxLength={4} required
                    />

                    <Input
                        label={t('auth.forgotPin.newPinLabel')}
                        placeholder="● ● ● ●"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        type="password" inputMode="numeric" maxLength={4} required
                    />

                    <Input
                        label={t('auth.forgotPin.confirmPinLabel')}
                        placeholder="● ● ● ●"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        type="password" inputMode="numeric" maxLength={4} required
                    />

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        {t('auth.forgotPin.resetButton')}
                    </Button>

                    <p className="text-center text-sm text-gray-500">
                        <Link href="/login" className="text-green-600 font-medium hover:underline">
                            ← {t('auth.farmer.backToLogin')}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
