'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { resetListing } from '@/store/slices/listingSlice';
import { CheckCircle, MapPin, Package, Tag, Star } from 'lucide-react';
import { useState } from 'react';
import { ApiService } from '@/services/apiService';

export default function StepReview() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { formData } = useSelector((state) => state.listing);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            await ApiService.addListing({
                cropName: formData.cropName,
                category: formData.category,
                variety: formData.variety,
                quantity: formData.quantity,
                unit: formData.unit,
                expectedPrice: formData.expectedPrice,
                qualityGrade: formData.qualityGrade,
                description: formData.description || '',
                imageUrl: formData.images?.[0] || '',
                locationAddress: formData.location?.address || '',
                locationLat: formData.location?.lat || null,
                locationLng: formData.location?.lng || null,
            });

            alert('Listing Created Successfully!');
            dispatch(resetListing());
            router.push('/farmer/dashboard');
        } catch (err) {
            alert('Failed to create listing. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Review Listing</h2>
                <p className="text-gray-500 text-sm">Check details before publishing.</p>
            </div>

            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden divide-y">
                {/* Images */}
                {formData.images.length > 0 && (
                    <div className="p-4 grid grid-cols-3 gap-2 bg-gray-50">
                        {formData.images.map((img, i) => (
                            <img key={i} src={img} className="w-full aspect-square object-cover rounded-lg border" alt="Crop" />
                        ))}
                    </div>
                )}

                {/* Main Details */}
                <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-bold">{formData.category}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{formData.cropName}</h3>
                            <p className="text-gray-600">{formData.variety}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">
                            <Star className="w-4 h-4 fill-current" />
                            Grade {formData.qualityGrade}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Package className="w-4 h-4" />
                            <span className="text-xs font-medium">Quantity</span>
                        </div>
                        <p className="font-bold text-lg">{formData.quantity} <span className="text-sm font-normal">{formData.unit}</span></p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Tag className="w-4 h-4" />
                            <span className="text-xs font-medium">Price</span>
                        </div>
                        <p className="font-bold text-lg">₹{formData.expectedPrice} <span className="text-sm font-normal">/{formData.unit}</span></p>
                    </div>
                </div>

                {/* Location */}
                <div className="p-4 flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <p className="text-sm">
                        {formData.location.address || `${formData.location.lat}, ${formData.location.lng}`}
                    </p>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-200"
            >
                {isSubmitting ? (
                    <>
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        Publishing...
                    </>
                ) : (
                    <>
                        <CheckCircle className="w-5 h-5" />
                        Confirm & Publish
                    </>
                )}
            </button>
        </div>
    );
}
