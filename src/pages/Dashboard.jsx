import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DocumentUpload from '../components/common/DocumentUpload';
import ProductList from '../components/farmer/ProductList';
import { useState } from 'react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleUploadSuccess = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Verification Banner for unverified users */}
                {user && !user.isVerified && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <h3 className="font-semibold text-amber-800">Document Verification Required</h3>
                            <p className="text-sm text-amber-700 mt-1">
                                To buy or sell on the marketplace, please upload your documents for verification.
                                You can still browse and access your dashboard.
                            </p>
                        </div>
                    </div>
                )}

                <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-500">
                            Welcome, {user?.role === 'farmer' ? '🌾 Farmer' : '🛒 Buyer'} {user?.name || user?.phone}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Verification Status</h2>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user?.isVerified
                                        ? 'bg-green-100 text-green-700'
                                        : user?.documents?.length > 0
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {user?.isVerified
                                        ? '✓ VERIFIED'
                                        : user?.documents?.length > 0
                                            ? '⏳ PENDING REVIEW'
                                            : 'NOT VERIFIED'}
                                </span>
                            </div>

                            {!user?.isVerified && (
                                <div className="mt-4">
                                    <DocumentUpload onUploadSuccess={handleUploadSuccess} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Profile Details</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phone</span>
                                <span className="font-medium">+91{user?.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Name</span>
                                <span className="font-medium">{user?.name || 'Not Set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Role</span>
                                <span className="font-medium capitalize">{user?.role || 'Not Set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Location</span>
                                <span className="font-medium">{user?.location || 'Not Set'}</span>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => navigate('/profile-setup')}
                                    className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {user?.role === 'farmer' && (
                    <div className="mt-8">
                        <ProductList />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
