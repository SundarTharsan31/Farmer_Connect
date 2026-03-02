'use client';

import { useDispatch, useSelector } from 'react-redux';
import { updateFormData, nextStep, addImage, removeImage } from '@/store/slices/listingSlice';
import ImageCapture from './ImageCapture';
import { ArrowRight, Star } from 'lucide-react';

const QUALITY_GRADES = [
    {
        id: 'A',
        label: 'Grade A (Best)',
        description: 'Excellent quality, uniform size, no damage.',
        color: 'bg-green-50 border-green-200 text-green-700',
        stars: 3
    },
    {
        id: 'B',
        label: 'Grade B (Good)',
        description: 'Good quality, slight variations, minor marks.',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        stars: 2
    },
    {
        id: 'C',
        label: 'Grade C (Fair)',
        description: 'Fair quality, mixed sizes, visible marks.',
        color: 'bg-orange-50 border-orange-200 text-orange-700',
        stars: 1
    }
];

export default function StepQuality() {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.listing);

    const handleNext = () => {
        if (formData.qualityGrade) {
            dispatch(nextStep());
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
            {/* Section Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">Quality & Photos</h2>
                <p className="text-gray-500 text-sm">Rate your produce and verify with photos.</p>
            </div>

            {/* Quality Selection */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Quality Grade <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-3">
                    {QUALITY_GRADES.map((grade) => (
                        <button
                            key={grade.id}
                            onClick={() => dispatch(updateFormData({ qualityGrade: grade.id }))}
                            className={`
                                relative p-4 rounded-xl border-2 text-left transition-all
                                ${formData.qualityGrade === grade.id
                                    ? `ring-2 ring-offset-1 border-transparent ${grade.color.replace('bg-', 'ring-')}` // Use color for ring
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                                ${formData.qualityGrade === grade.id ? grade.color : 'bg-white'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-lg">{grade.label}</span>
                                <div className="flex gap-1">
                                    {[...Array(grade.stars)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm opacity-80">{grade.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Add Photos (Optional)
                </label>
                <ImageCapture
                    images={formData.images}
                    onAdd={(img) => dispatch(addImage(img))}
                    onRemove={(index) => dispatch(removeImage(index))}
                />
            </div>

            <button
                onClick={handleNext}
                disabled={!formData.qualityGrade}
                className={`
                    w-full mt-6 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all
                    ${formData.qualityGrade
                        ? 'bg-green-600 hover:bg-green-700 text-white active:scale-[0.98]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                `}
            >
                Next Step
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}
