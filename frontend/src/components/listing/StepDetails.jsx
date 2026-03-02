'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormData, nextStep, prevStep } from '@/store/slices/listingSlice';
import VoiceInput from '../ui/VoiceInput/VoiceInput';
import { ArrowRight } from 'lucide-react';

export default function StepDetails() {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.listing);

    // Initialize local state from Redux to ensure inputs are editable immediately
    // usage of local state prevents Redux dispatch delays from blocking typing
    const [localData, setLocalData] = useState({
        cropName: formData.cropName || '',
        variety: formData.variety || '',
        quantity: formData.quantity || '',
        unit: formData.unit || 'kg',
        expectedPrice: formData.expectedPrice || ''
    });

    const [errors, setErrors] = useState({});

    // Sync local state when Redux changes (e.g. if coming back from review)
    useEffect(() => {
        setLocalData({
            cropName: formData.cropName || '',
            variety: formData.variety || '',
            quantity: formData.quantity || '',
            unit: formData.unit || 'kg',
            expectedPrice: formData.expectedPrice || ''
        });
    }, [formData]);

    const handleChange = (field, value) => {
        setLocalData(prev => ({ ...prev, [field]: value }));

        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!localData.cropName) newErrors.cropName = 'Required / आवश्यक';
        if (!localData.quantity) newErrors.quantity = 'Required / आवश्यक';
        if (!localData.expectedPrice) newErrors.expectedPrice = 'Required / आवश्यक';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            // Sync to Redux before moving on
            dispatch(updateFormData(localData));
            dispatch(nextStep());
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Crop Details</h2>
                <p className="text-gray-500 text-sm">Fill in the details or use the mic to speak.</p>
            </div>

            {/* Crop Name */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Prop / Crop Name <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={localData.cropName}
                            onChange={(e) => handleChange('cropName', e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                            placeholder="e.g. Potato / आलू"
                        />
                    </div>
                    <VoiceInput onResult={(text) => handleChange('cropName', text)} />
                </div>
                {errors.cropName && <p className="text-red-500 text-sm">{errors.cropName}</p>}
            </div>

            {/* Variety */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Variety (Optional)
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={localData.variety}
                        onChange={(e) => handleChange('variety', e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                        placeholder="e.g. Kufri Jyoti"
                    />
                    <VoiceInput onResult={(text) => handleChange('variety', text)} />
                </div>
            </div>

            {/* Quantity Row */}
            <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Quantity <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={localData.quantity}
                            onChange={(e) => handleChange('quantity', e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                            placeholder="00"
                        />
                        {/* Unit Selector - simplified */}
                        <select
                            value={localData.unit}
                            onChange={(e) => handleChange('unit', e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5"
                        >
                            <option value="kg">kg</option>
                            <option value="quintal">quintal</option>
                            <option value="ton">ton</option>
                        </select>
                    </div>
                    {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Expected Price (per {localData.unit}) <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">₹</span>
                        <input
                            type="number"
                            value={localData.expectedPrice}
                            onChange={(e) => handleChange('expectedPrice', e.target.value)}
                            className="w-full p-4 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold text-green-700"
                            placeholder="0.00"
                        />
                    </div>
                    <VoiceInput onResult={(text) => handleChange('expectedPrice', text.replace(/[^0-9.]/g, ''))} />
                </div>
                {errors.expectedPrice && <p className="text-red-500 text-sm">{errors.expectedPrice}</p>}
            </div>

            <button
                onClick={handleNext}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
                Next Step
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}
