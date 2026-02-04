import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProfileSetup = () => {
    const { user, isAuthenticated, register, pendingPhone } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if this is a new user registration flow
    const isNewUser = location.state?.isNewUser || (!isAuthenticated && pendingPhone);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        role: 'farmer', // default
        cropInterests: '',
        buyingPreferences: '',
    });

    useEffect(() => {
        // Guard: Redirect to login if not authenticated AND no pending phone (direct access)
        if (!isAuthenticated && !pendingPhone) {
            navigate('/login', { replace: true });
            return;
        }

        // If authenticated user, populate form with existing data
        if (user && isAuthenticated) {
            setFormData({
                name: user.name || '',
                location: user.location || '',
                role: user.role || 'farmer',
                cropInterests: user.cropInterests?.join(', ') || '',
                buyingPreferences: user.buyingPreferences?.join(', ') || '',
            });
        }
    }, [user, isAuthenticated, pendingPhone, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isNewUser) {
                // New user registration flow
                if (!formData.role) {
                    throw 'Please select a role';
                }
                await register(formData.name, formData.role);
                navigate('/dashboard');
            } else {
                // Existing user profile update
                await api.put('/users/profile', {
                    name: formData.name,
                    location: formData.location,
                    cropInterests: formData.cropInterests.split(',').map(s => s.trim()).filter(Boolean),
                    buyingPreferences: formData.buyingPreferences.split(',').map(s => s.trim()).filter(Boolean),
                });
                window.location.href = '/dashboard';
            }
        } catch (err) {
            console.error("Operation failed", err);
            setError(typeof err === 'string' ? err : err.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isNewUser ? 'Create Your Account' : 'Complete your Profile'}
                    </h2>
                    {isNewUser && (
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Phone: +91{pendingPhone}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required={isNewUser}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Role selection - only for new users */}
                        {isNewUser && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'farmer' })}
                                        className={`py-3 px-4 rounded-lg border-2 transition-all ${formData.role === 'farmer'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        🌾 Farmer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'buyer' })}
                                        className={`py-3 px-4 rounded-lg border-2 transition-all ${formData.role === 'buyer'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        🛒 Buyer
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Location - for profile update */}
                        {!isNewUser && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    name="location"
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="City, State"
                                />
                            </div>
                        )}

                        {/* Farmer-specific fields - only for profile update */}
                        {!isNewUser && user?.role === 'farmer' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Interests (comma separated)</label>
                                <textarea
                                    name="cropInterests"
                                    value={formData.cropInterests}
                                    onChange={(e) => setFormData({ ...formData, cropInterests: e.target.value })}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Wheat, Rice, Corn"
                                />
                            </div>
                        )}

                        {/* Buyer-specific fields - only for profile update */}
                        {!isNewUser && user?.role === 'buyer' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Buying Preferences (comma separated)</label>
                                <textarea
                                    name="buyingPreferences"
                                    value={formData.buyingPreferences}
                                    onChange={(e) => setFormData({ ...formData, buyingPreferences: e.target.value })}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Vegetables, Fruits"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (isNewUser ? 'Create Account' : 'Save Profile')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
