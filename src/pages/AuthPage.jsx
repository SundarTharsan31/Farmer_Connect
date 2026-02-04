import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
    const [step, setStep] = useState('MOBILE'); // MOBILE, OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [devOtp, setDevOtp] = useState(null); // For dev mode

    const { login, sendOtp, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated && user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, user, navigate, location]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setDevOtp(null);
        try {
            if (phone.length < 10) throw new Error("Invalid mobile number");
            const result = await sendOtp(phone);
            if (result.devOtp) {
                setDevOtp(result.devOtp);
            }
            setStep('OTP');
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (otp.length !== 6) throw new Error("OTP must be 6 digits");
            const result = await login(phone, otp);

            if (result.isNewUser) {
                // New user - navigate to registration/profile setup
                navigate('/profile-setup', { state: { isNewUser: true } });
            } else {
                // Existing user - navigate to dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/20">
                <h2 className="text-3xl font-bold text-white text-center mb-2">AgriMarket</h2>
                <p className="text-white/80 text-center mb-8">Welcome to the future of farming</p>

                <AnimatePresence mode="wait">
                    {step === 'MOBILE' ? (
                        <motion.form
                            key="mobile-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleSendOtp}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Mobile Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="Enter 10 digit number"
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                    autoFocus
                                />
                            </div>
                            {error && <p className="text-red-300 text-sm text-center">{error}</p>}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors shadow-lg disabled:opacity-50"
                            >
                                {isLoading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="otp-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleVerifyOtp}
                            className="space-y-6"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-white">Enter OTP</label>
                                    <button
                                        type="button"
                                        onClick={() => setStep('MOBILE')}
                                        className="text-xs text-white/70 hover:text-white underline"
                                    >
                                        Change Number
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="XXXXXX"
                                    maxLength={6}
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-center tracking-widest text-2xl"
                                    autoFocus
                                />
                                <p className="text-xs text-white/60 text-center mt-2">OTP sent to +91{phone}</p>
                                {devOtp && (
                                    <p className="text-sm text-green-300 text-center mt-2 bg-green-900/30 py-2 rounded">
                                        🔧 Dev Mode: Use OTP <span className="font-mono font-bold">{devOtp}</span>
                                    </p>
                                )}
                            </div>
                            {error && <p className="text-red-300 text-sm text-center">{error}</p>}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Login'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AuthPage;
