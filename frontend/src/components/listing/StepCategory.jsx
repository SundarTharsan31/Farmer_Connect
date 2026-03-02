'use client';

import { useDispatch, useSelector } from 'react-redux';
import { updateFormData, nextStep } from '@/store/slices/listingSlice';
import { Apple, Wheat, Carrot, Milk, Flower, Sprout } from 'lucide-react';

const CATEGORIES = [
    {
        id: 'vegetables',
        label: 'Vegetables',
        labelHi: 'सब्जियां',
        icon: Carrot,
        color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
        id: 'fruits',
        label: 'Fruits',
        labelHi: 'फल',
        icon: Apple,
        color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
        id: 'grains',
        label: 'Grains',
        labelHi: 'अनाज',
        icon: Wheat,
        color: 'bg-yellow-50 text-yellow-600 border-yellow-200'
    },
    {
        id: 'flowers',
        label: 'Flowers',
        labelHi: 'फूल',
        icon: Flower,
        color: 'bg-pink-50 text-pink-600 border-pink-200'
    },
    {
        id: 'spices',
        label: 'Spices',
        labelHi: 'मसाले',
        icon: Sprout,
        color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
        id: 'others',
        label: 'Others',
        labelHi: 'अन्य',
        icon: Milk,
        color: 'bg-blue-50 text-blue-600 border-blue-200'
    }
];

export default function StepCategory() {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.listing);

    const handleSelect = (categoryId) => {
        dispatch(updateFormData({ category: categoryId }));
        dispatch(nextStep());
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
                What are you selling?
            </h2>
            <p className="text-gray-500 mb-6">
                Select the category of your produce.
                <span className="block text-sm text-gray-400 mt-1">आप क्या बेचना चाहते हैं?</span>
            </p>

            <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.category === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => handleSelect(cat.id)}
                            className={`
                                relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-3 transition-all
                                hover:scale-[1.02] active:scale-95 touch-manipulation
                                ${cat.color}
                                ${isSelected ? 'ring-2 ring-green-600 ring-offset-2 border-transparent' : 'border-current bg-opacity-10'}
                            `}
                            style={{ minHeight: '140px' }}
                        >
                            <div className={`p-3 rounded-full bg-white shadow-sm`}>
                                <Icon className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <div>
                                <span className="block font-bold text-lg">{cat.label}</span>
                                <span className="block text-sm opacity-80 font-medium">{cat.labelHi}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
